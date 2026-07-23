// api/contact.js
// Vercel Serverless Function — handles the Contact form submission.
// No database. Sends two emails via Resend: a notification to the studio
// and an auto-reply to the enquirer.

const RESEND_API_URL = "https://api.resend.com/emails";

const VALID_TYPES = [
  "Full house",
  "Single room",
  "Hotel or hospitality",
  "Restoration only",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MAX = 100;
const EMAIL_MAX = 200;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 3000;

// --- Very small in-memory rate limiter -------------------------------
// NOTE: this map lives in the function's memory, which is reset whenever
// the serverless function has a "cold start" (new instance spun up), and
// is NOT shared across concurrent instances. That's fine for a low-traffic
// studio site as a first line of defense against casual spam/bots, but it
// is not a rigorous guarantee. If traffic grows, swap this for a proper
// shared store such as Upstash Redis (Vercel has a first-party
// integration) using a fixed-window or sliding-window counter keyed by IP.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map(); // ip -> [timestamps]

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);

  // Opportunistic cleanup so the map doesn't grow forever between cold starts.
  if (rateLimitStore.size > 500) {
    for (const [key, arr] of rateLimitStore) {
      const fresh = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) rateLimitStore.delete(key);
      else rateLimitStore.set(key, fresh);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

function getClientIp(req) {
  // Vercel populates x-forwarded-for with the client IP first in the list.
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

// --- Sanitization / validation ----------------------------------------

// Strips newlines, carriage returns and other control characters so a
// malicious value can't be used to inject extra email headers (classic
// "email header injection" via CRLF in a From/Subject/Reply-To field).
function sanitizeText(value) {
  return String(value ?? "")
    .replace(/[\r\n\t\x00-\x1F\x7F]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(payload) {
  const errors = {};

  const name = sanitizeText(payload.name);
  const email = sanitizeText(payload.email);
  const type = sanitizeText(payload.type);
  const message = sanitizeText(payload.message);

  if (!name) errors.name = "Name is required.";
  else if (name.length > NAME_MAX)
    errors.name = `Name must be ${NAME_MAX} characters or fewer.`;

  if (!email) errors.email = "Email is required.";
  else if (email.length > EMAIL_MAX)
    errors.email = `Email must be ${EMAIL_MAX} characters or fewer.`;
  else if (!EMAIL_REGEX.test(email))
    errors.email = "Please enter a valid email address.";

  if (!type) errors.type = "Project type is required.";
  else if (!VALID_TYPES.includes(type))
    errors.type = "Please select a valid project type.";

  if (!message) errors.message = "Message is required.";
  else if (message.length < MESSAGE_MIN)
    errors.message = `Message must be at least ${MESSAGE_MIN} characters.`;
  else if (message.length > MESSAGE_MAX)
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;

  return { errors, clean: { name, email, type, message } };
}

async function sendEmail({ from, to, subject, html, replyTo }) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    // Don't leak Resend's raw response body (may include account/API details).
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      /* ignore */
    }
    console.error("Resend API error:", res.status, bodyText);
    throw new Error(`Email send failed with status ${res.status}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  // --- Rate limiting ---
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({
      ok: false,
      error: "Too many enquiries from this address. Please try again later.",
    });
  }

  const body = req.body || {};

  // --- Honeypot: bots fill in every field, real users never see this one.
  // Reject silently with a 200 so bots don't learn anything from the response.
  if (sanitizeText(body.website || body._hp || "")) {
    return res.status(200).json({ ok: true });
  }

  // --- Validation ---
  const { errors, clean } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!process.env.RESEND_API_KEY || !adminEmail) {
    console.error("Missing RESEND_API_KEY or ADMIN_EMAIL environment variable.");
    return res.status(500).json({
      ok: false,
      error: "The enquiry could not be sent. Please try again shortly.",
    });
  }

  const { name, email, type, message } = clean;
  const submittedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  // Using Resend's shared test/onboarding sender until a custom domain is
  // verified. Swap "from" to e.g. "Thornbury & Hale <enquiries@thornburyandhale.co.uk>"
  // once the domain is verified in the Resend dashboard.
  const FROM_ADDRESS =
    process.env.RESEND_FROM_ADDRESS || "Thornbury & Hale <onboarding@resend.dev>";

  try {
    // 1) Notify the studio
    await sendEmail({
      from: FROM_ADDRESS,
      to: adminEmail,
      replyTo: email,
      subject: `New enquiry — ${type} — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; color: #1C1B17; max-width: 560px;">
          <h2 style="margin-bottom: 4px;">New enquiry from the website</h2>
          <p style="color:#666; margin-top:0;">${escapeHtml(submittedAt)}</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding:6px 0; width:120px;"><strong>Name</strong></td><td style="padding:6px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email</strong></td><td style="padding:6px 0;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Project type</strong></td><td style="padding:6px 0;">${escapeHtml(type)}</td></tr>
          </table>
          <p><strong>Message</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(message)}</p>
          <p style="color:#666; font-size: 12px; margin-top: 24px;">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
        </div>
      `,
    });

    // 2) Auto-reply to the enquirer
    await sendEmail({
      from: FROM_ADDRESS,
      to: email,
      subject: "Thank you for your enquiry — Thornbury & Hale",
      html: `
        <div style="font-family: Georgia, serif; color: #1C1B17; max-width: 560px;">
          <p>Dear ${escapeHtml(name)},</p>
          <p>Thank you for getting in touch with Thornbury &amp; Hale. We've received your
          enquiry about your <em>${escapeHtml(type.toLowerCase())}</em> project and will be
          in touch within a week to arrange a first call.</p>
          <p>Warm regards,<br />Thornbury &amp; Hale</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form email error:", err);
    return res.status(500).json({
      ok: false,
      error: "The enquiry could not be sent. Please try again shortly.",
    });
  }
}

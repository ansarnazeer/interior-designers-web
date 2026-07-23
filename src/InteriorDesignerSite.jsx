import { useState } from "react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1800&q=75",
  about: "https://images.unsplash.com/photo-1581784878214-8d5596b98a01?auto=format&fit=crop&w=1200&q=75",
};

const PLATES = [
  { n: "I", name: "Fenwick House", place: "Cotswolds", img: "https://images.unsplash.com/photo-1780547300423-c6a539738adb?auto=format&fit=crop&w=1200&q=75", note: "A Georgian rectory's drawing room, restored plasterwork paired with a newly upholstered fireside seat." },
  { n: "II", name: "Clareville Mews", place: "London", img: "https://images.unsplash.com/photo-1725905507743-30f903ebbf2c?auto=format&fit=crop&w=1200&q=75", note: "A carriage-house opened end to end, kitchen and dining folded into one considered run." },
  { n: "III", name: "The Abbotsleigh Dining Room", place: "Hampshire", img: "https://images.unsplash.com/photo-1721742145312-9264de4cd63f?auto=format&fit=crop&w=1200&q=75", note: "Built around a single fitting: a table set beside the window where the light falls best." },
  { n: "IV", name: "Wren's Court", place: "Bath", img: "https://images.unsplash.com/photo-1724883462835-cc4144d89531?auto=format&fit=crop&w=1200&q=75", note: "A townhouse entrance hall and stair, returned to its original proportion after decades of subdivision." },
  { n: "V", name: "The Reading Room", place: "Marchmont", img: "https://images.unsplash.com/photo-1749703821652-c43ccda0874e?auto=format&fit=crop&w=1200&q=75", note: "A single armchair commission — one client, one chair, eleven fabrics considered before the first cut." },
  { n: "VI", name: "Priory Guest Room", place: "Suffolk", img: "https://images.unsplash.com/photo-1682449893611-c9dcae54b51c?auto=format&fit=crop&w=1200&q=75", note: "A guest bedroom for a working farmhouse, kept plain enough that the linen does the talking." },
];

const SERVICES = [
  { n: "I", title: "Full interior architecture", note: "Structural and spatial planning alongside your architect, from first sketch to final coat of paint." },
  { n: "II", title: "Bespoke furniture and upholstery", note: "Pieces drawn and built to the room, upholstered in fabrics chosen for how they wear, not just how they photograph." },
  { n: "III", title: "Antique sourcing and restoration", note: "A private network of dealers across England and France, with restoration overseen in-house." },
  { n: "IV", title: "Single-room commissions", note: "For clients who want one room done properly rather than a whole house taken on at once." },
  { n: "V", title: "Snagging and styling", note: "The final layer — art hung, linens chosen, flowers placed — finished the week before you move back in." },
];

const NAV = ["Home", "Portfolio", "Services", "About", "Contact"];

function Wordmark({ dark }) {
  return (
    <span
      className={`text-[20px] tracking-[0.14em] uppercase ${dark ? "text-[#F3ECDD]" : "text-[#1C1B17]"}`}
      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
    >
      Thornbury <span className="text-[#B08D57]">&amp;</span> Hale
    </span>
  );
}

function Rule({ className = "" }) {
  return (
    <div className={`flex flex-col gap-[3px] w-16 ${className}`}>
      <div className="h-px bg-[#B08D57]" />
      <div className="h-px bg-[#B08D57] opacity-50" />
    </div>
  );
}

function NavBar({ page, setPage, dark }) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 ${dark ? "bg-[#1F3328]/95" : "bg-[#F3ECDD]/95"} backdrop-blur-sm border-b border-[#B08D57]/30`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <button onClick={() => setPage("Home")} className="focus:outline-none">
          <Wordmark dark={dark} />
        </button>
        <nav className="hidden md:flex gap-8">
          {NAV.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`relative text-[13px] tracking-[0.12em] uppercase pb-1 transition-colors ${
                page === item ? "text-[#B08D57]" : dark ? "text-[#F3ECDD]/80 hover:text-[#F3ECDD]" : "text-[#1C1B17]/70 hover:text-[#1C1B17]"
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {item}
              {page === item && <span className="absolute left-0 -bottom-[1px] w-full h-[1.5px] bg-[#B08D57]" />}
            </button>
          ))}
        </nav>
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className={`md:hidden text-[13px] tracking-wide uppercase bg-transparent border border-[#B08D57]/50 rounded-sm px-2 py-1 ${dark ? "text-[#F3ECDD]" : "text-[#1C1B17]"}`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          {NAV.map((item) => (
            <option key={item} value={item} className="text-[#1C1B17]">
              {item}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <p
      className={`text-[12px] tracking-[0.28em] uppercase mb-4 ${dark ? "text-[#B08D57]" : "text-[#5C2430]"}`}
      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500 }}
    >
      {children}
    </p>
  );
}

function Display({ children, className = "", light = false }) {
  return (
    <h1
      className={`${light ? "text-[#F3ECDD]" : "text-[#1C1B17]"} ${className}`}
      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, lineHeight: 1.08 }}
    >
      {children}
    </h1>
  );
}

function Home({ setPage }) {
  return (
    <div className="animate-[fadeUp_0.7s_ease]">
      <section className="relative h-[100svh] min-h-[560px] flex items-end overflow-hidden">
        <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(0.85) contrast(1.05)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(31,51,40,0.35) 0%, rgba(28,27,23,0.55) 55%, rgba(20,24,20,0.88) 100%)" }} />
        <div className="relative max-w-6xl mx-auto w-full px-6 md:px-10 pb-20 pt-40">
          <Eyebrow dark>Interior design atelier &middot; est. 2011</Eyebrow>
          <Display light className="text-[42px] md:text-[68px] max-w-3xl">
            Rooms with the weight of memory, built for how you live now.
          </Display>
          <Rule className="my-7" />
          <p className="max-w-xl text-[16px] md:text-[17px] text-[#F3ECDD]/85 leading-relaxed" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
            Thornbury &amp; Hale designs private residences, small hotels and single rooms — layering
            inherited pieces with new work so a house reads as though it was always this way.
          </p>
          <div className="flex flex-wrap gap-4 mt-9">
            <button
              onClick={() => setPage("Portfolio")}
              className="px-7 py-3 border border-[#B08D57] text-[#F3ECDD] text-[13px] tracking-[0.14em] uppercase hover:bg-[#B08D57] hover:text-[#1C1B17] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              View the portfolio
            </button>
            <button
              onClick={() => setPage("Contact")}
              className="px-7 py-3 text-[#F3ECDD]/85 text-[13px] tracking-[0.14em] uppercase hover:text-[#B08D57] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Begin an enquiry &rarr;
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#F3ECDD] py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: "Architecture-led", note: "We work from the walls in, not the cushions out — every commission starts with the room's proportions." },
            { title: "Made, not bought", note: "Joinery, upholstery and lighting are drawn and built for the specific room, rarely off the shelf." },
            { title: "Sourced with patience", note: "Antiques and textiles come from a private network built over fifteen years of looking." },
          ].map((item) => (
            <div key={item.title} className="border-t border-[#B08D57]/40 pt-6">
              <h3 className="text-[20px] text-[#1C1B17] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {item.title}
              </h3>
              <p className="text-[14px] text-[#1C1B17]/70 leading-relaxed" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, note }) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Display className="text-[36px] md:text-[52px] max-w-2xl">{title}</Display>
      <Rule className="my-6" />
      {note && (
        <p className="max-w-xl text-[15px] text-[#1C1B17]/70 leading-relaxed" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
          {note}
        </p>
      )}
    </div>
  );
}

function Portfolio() {
  return (
    <div className="bg-[#F3ECDD] min-h-screen animate-[fadeUp_0.6s_ease]">
      <SectionHeader
        eyebrow="Selected commissions"
        title="The Plates"
        note="Six rooms from the past three years, numbered as they were finished rather than as they might be ranked."
      />
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-24 grid md:grid-cols-2 gap-x-10 gap-y-16">
        {PLATES.map((p) => (
          <figure key={p.n} className="group">
            <div className="overflow-hidden border border-[#B08D57]/30">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ filter: "grayscale(12%) sepia(6%) contrast(1.04)" }}
              />
            </div>
            <figcaption className="flex items-start gap-4 mt-4">
              <span className="text-[26px] text-[#B08D57] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {p.n}
              </span>
              <div>
                <p className="text-[19px] text-[#1C1B17]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                  {p.name} <span className="text-[#1C1B17]/50 text-[15px]">&mdash; {p.place}</span>
                </p>
                <p className="text-[13.5px] text-[#1C1B17]/65 leading-relaxed mt-1" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                  {p.note}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="bg-[#1F3328] min-h-screen animate-[fadeUp_0.6s_ease]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-14">
        <Eyebrow dark>How we work</Eyebrow>
        <Display light className="text-[36px] md:text-[52px] max-w-2xl">
          Services
        </Display>
        <Rule className="my-6" />
      </div>
      <div className="max-w-4xl mx-auto px-6 md:px-10 pb-28">
        {SERVICES.map((s, i) => (
          <div key={s.n} className={`flex gap-8 py-8 ${i !== 0 ? "border-t border-[#B08D57]/25" : ""}`}>
            <span className="text-[30px] text-[#B08D57] w-12 shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {s.n}
            </span>
            <div>
              <h3 className="text-[22px] text-[#F3ECDD] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {s.title}
              </h3>
              <p className="text-[14.5px] text-[#F3ECDD]/70 leading-relaxed max-w-lg" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                {s.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="bg-[#F3ECDD] min-h-screen animate-[fadeUp_0.6s_ease]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-24 grid md:grid-cols-2 gap-14 items-start">
        <div className="overflow-hidden border border-[#B08D57]/30">
          <img src={IMG.about} alt="Studio detail" className="w-full h-[480px] object-cover" style={{ filter: "grayscale(15%) sepia(8%) contrast(1.05)" }} />
        </div>
        <div>
          <Eyebrow>The practice</Eyebrow>
          <Display className="text-[34px] md:text-[44px] mb-6">About Thornbury &amp; Hale</Display>
          <p className="text-[15px] text-[#1C1B17]/75 leading-relaxed mb-5" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
            Founded in 2011 by Eleanor Thornbury and James Hale, the practice grew out of a shared
            frustration with interiors that looked finished on delivery day and dated within five
            years. We build rooms the way a good tailor builds a coat — for the specific body, meant
            to be let out and taken in as life changes, not replaced.
          </p>
          <p className="text-[15px] text-[#1C1B17]/75 leading-relaxed mb-8" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
            The studio takes on a small number of commissions each year across England and Scotland,
            working directly with clients, architects and a long-standing network of makers.
          </p>
          <blockquote
            className="border-l-2 border-[#B08D57] pl-6 text-[22px] italic text-[#1C1B17]/85"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "A good room should look like no one decorated it at all."
          </blockquote>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", type: "Full house", message: "" });
  const [website, setWebsite] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // no-op, handled below
      }

      if (res.status === 429) {
        setError((data && data.error) || "Too many enquiries from this address. Please try again later.");
        return;
      }
      if (res.status === 400 && data && data.errors) {
        setFieldErrors(data.errors);
        setError("Please check the highlighted fields and try again.");
        return;
      }
      if (!res.ok) {
        setError((data && data.error) || "Something went wrong sending your enquiry. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-[#1F3328] min-h-screen animate-[fadeUp_0.6s_ease]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-28 grid md:grid-cols-5 gap-14">
        <div className="md:col-span-2">
          <Eyebrow dark>Enquiries</Eyebrow>
          <Display light className="text-[34px] md:text-[42px] mb-6">
            Begin a conversation
          </Display>
          <p className="text-[14.5px] text-[#F3ECDD]/70 leading-relaxed mb-8" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
            Tell us a little about the room, or the whole house, and we'll arrange a first call within
            a week.
          </p>
          <div className="space-y-5 text-[14px]" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
            <div>
              <p className="text-[#B08D57] tracking-[0.12em] uppercase text-[12px] mb-1">Studio</p>
              <p className="text-[#F3ECDD]/80">14 Gracechurch Mews, Marylebone, London W1U</p>
            </div>
            <div>
              <p className="text-[#B08D57] tracking-[0.12em] uppercase text-[12px] mb-1">Hours</p>
              <p className="text-[#F3ECDD]/80">Monday &ndash; Friday, 9 &ndash; 6, by appointment</p>
            </div>
            <div>
              <p className="text-[#B08D57] tracking-[0.12em] uppercase text-[12px] mb-1">Contact</p>
              <p className="text-[#F3ECDD]/80">enquiries@thornburyandhale.co.uk</p>
              <p className="text-[#F3ECDD]/80">+44 (0)20 7946 0192</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-[#F3ECDD] p-8 md:p-10">
          {sent ? (
            <div className="h-full flex flex-col justify-center">
              <p className="text-[26px] text-[#1C1B17] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                Enquiry sent.
              </p>
              <p className="text-[14px] text-[#1C1B17]/70" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                Thank you, {form.name || "there"}. We'll be in touch within a week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot: hidden from real users (off-screen, not display:none,
                  so basic bots that skip display:none fields still get caught),
                  excluded from tab order and autofill. */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, overflow: "hidden" }}
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#5C2430] bg-[#5C2430]/10 border border-[#5C2430]/30 px-4 py-3" style={{ fontFamily: "'Jost', sans-serif" }}>
                  {error}
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-[12px] tracking-[0.12em] uppercase text-[#1C1B17]/60" style={{ fontFamily: "'Jost', sans-serif" }}>
                    Name
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-2 bg-transparent border-b border-[#1C1B17]/25 focus:border-[#B08D57] outline-none py-2 text-[15px] text-[#1C1B17]"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  />
                  {fieldErrors.name && (
                    <span className="block mt-1 text-[12px] text-[#5C2430]">{fieldErrors.name}</span>
                  )}
                </label>
                <label className="block">
                  <span className="text-[12px] tracking-[0.12em] uppercase text-[#1C1B17]/60" style={{ fontFamily: "'Jost', sans-serif" }}>
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-2 bg-transparent border-b border-[#1C1B17]/25 focus:border-[#B08D57] outline-none py-2 text-[15px] text-[#1C1B17]"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  />
                  {fieldErrors.email && (
                    <span className="block mt-1 text-[12px] text-[#5C2430]">{fieldErrors.email}</span>
                  )}
                </label>
              </div>
              <label className="block">
                <span className="text-[12px] tracking-[0.12em] uppercase text-[#1C1B17]/60" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Project type
                </span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-[#1C1B17]/25 focus:border-[#B08D57] outline-none py-2 text-[15px] text-[#1C1B17]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <option>Full house</option>
                  <option>Single room</option>
                  <option>Hotel or hospitality</option>
                  <option>Restoration only</option>
                </select>
                {fieldErrors.type && (
                  <span className="block mt-1 text-[12px] text-[#5C2430]">{fieldErrors.type}</span>
                )}
              </label>
              <label className="block">
                <span className="text-[12px] tracking-[0.12em] uppercase text-[#1C1B17]/60" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Message
                </span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-[#1C1B17]/25 focus:border-[#B08D57] outline-none py-2 text-[15px] text-[#1C1B17] resize-none"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                />
                {fieldErrors.message && (
                  <span className="block mt-1 text-[12px] text-[#5C2430]">{fieldErrors.message}</span>
                )}
              </label>
              <button
                type="submit"
                disabled={sending}
                className="px-7 py-3 bg-[#1C1B17] text-[#F3ECDD] text-[13px] tracking-[0.14em] uppercase hover:bg-[#5C2430] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {sending ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="bg-[#1C1B17] border-t border-[#B08D57]/30 py-10 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Wordmark dark />
        <nav className="flex flex-wrap justify-center gap-6">
          {NAV.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className="text-[12px] tracking-[0.12em] uppercase text-[#F3ECDD]/60 hover:text-[#B08D57] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {item}
            </button>
          ))}
        </nav>
        <p className="text-[12px] text-[#F3ECDD]/40" style={{ fontFamily: "'Jost', sans-serif" }}>
          &copy; 2026 Thornbury &amp; Hale
        </p>
      </div>
    </footer>
  );
}

export default function InteriorDesignerSite() {
  const [page, setPage] = useState("Home");
  const navDark = page === "Services" || page === "About" || page === "Contact";

  return (
    <div className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
      <NavBar page={page} setPage={setPage} dark={navDark} />
      <main key={page}>
        {page === "Home" && <Home setPage={setPage} />}
        {page === "Portfolio" && <Portfolio />}
        {page === "Services" && <Services />}
        {page === "About" && <About />}
        {page === "Contact" && <Contact />}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

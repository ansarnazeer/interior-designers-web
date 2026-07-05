# Thornbury & Hale — Interior Design Atelier

A single-page React site for a fictional interior design studio, built with Vite, React, and Tailwind CSS. Pages (Home, Portfolio, Services, About, Contact) are handled with client-side state rather than a router.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
├── index.html
├── src/
│   ├── main.jsx                 # React entry point
│   ├── InteriorDesignerSite.jsx # Main site component (all pages/sections)
│   └── index.css                # Tailwind directives
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

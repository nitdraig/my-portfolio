# agustin-top-v2

Isolated redesign of [agustin.top](https://www.agustin.top). Lives beside the parent portfolio and does **not** share its build or deploy.

See `agustin-top-guia-rediseño.md` for the full product guide.

## Current phase

**Phase 1 — Foundation** (in progress / active):

- New IA: `/work`, `/process`, `/about`, `/resources`, `/contact`, `/idea`
- Dark editorial UI, HTML-first hero (“Tenés una idea…”)
- Structured content for SEO / GEO (`person`, `process`)
- Idea flow with local structuring (no external AI yet)
- Contact API reused from the prior site

Later phases (not started): motion polish, Three.js, full AI layer, conversion analytics, CWV pass.

## Setup

```bash
cd agustin-top-v2
npm install
cp .env.example .env
npm run dev
```

Dev server defaults to **http://localhost:4322** so it does not collide with the parent project on 4321.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local server on port 4322 |
| `npm run build` | Production build |
| `npm run preview` | Preview build on 4322 |
| `npm run check` | Astro + TypeScript check |

## Isolation notes

- Own `package.json`, `node_modules`, `.env`, and Astro config
- Parent repo root is the previous live site — leave it alone while iterating here
- Prefer deploying v2 as a separate Vercel project / preview until cutover

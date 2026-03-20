# Changelog — Neurospark Corporation Website

## v3.0.0 — March 2026

### New Features
- **WAZO agent** — 13th agent added (Startup Idea Validation, Sector Intelligence).
  Full detail page content: problem statement, 6 capabilities, 8 tools, 6-step workflow, 3 use cases, 6 FAQs. Added to `agents.js` and `AgentDetailPage.jsx`.
- **HESABU Platform page** (`/platforms/hesabu`) — New multi-agent platform page presenting PESA + MALIPO + KODI as an orchestrated compliance engine.
  Sections: Hero (Early Access badge), Monthly Workflow timeline, Regulatory Monitor, Human Gate terminal demo, Audit Trail chain, Pricing Tiers, FAQ, CTA.
  Includes `SoftwareApplication` JSON-LD schema.
- **`useDocumentMeta` hook** — Replaces `useDocumentTitle`. Sets title, meta description, OG tags, Twitter cards, and canonical URL per page. Backward-compatible alias `useDocumentTitle` preserved.
- **`Breadcrumb` component** — Visual breadcrumb + `BreadcrumbList` JSON-LD schema injection. Used on HESABU platform page; ready for agent detail pages.
- **Blog live data** — `BlogPage.jsx` now fetches posts from Hashnode API on mount. Loading skeleton, error state with retry, and static `data/blog.js` fallback all implemented. (Was scaffolded in v2.7 but never wired — the primary functional regression found in audit.)

### Fixes
- **Dark mode FOUC** — Inline script in `<head>` reads `localStorage('ns-theme')` before React loads and sets `data-theme="dark"` immediately, eliminating the flash of light theme on first load.
- **Hero mobile overflow** — Blob SVG width/height changed from fixed `700px/480px` to `min(700px, 100vw)` / `min(480px, 70vw)`. Eliminates horizontal scroll on narrow viewports.
- **StatsStrip reflow** — Changed grid from `auto-fit/minmax(180px,1fr)` to `grid-cols-2 sm:grid-cols-4`. Prevents three-then-one layout break at 360–540px.
- **Chapter grid breakpoint** — `minmax(300px,1fr)` → `minmax(350px,1fr)` to prevent content/image order mismatch at 600–768px.
- **`focus-visible` on form inputs** — WCAG 2.1 AA compliant focus ring added to all `input`, `textarea`, `button`, and `select` elements in `index.css`.
- **`delay-150` undefined class** — Hero tagline `delay-150` → `delay-200` (Tailwind base has no `delay-150`).
- **Hero image CLS** — Added explicit `width={900} height={394}` to `<img>`. Added explicit dimensions to Chapter, BlogCard, FeaturedPost images.
- **Hero mobile aspect ratio** — `aspect-[4/3] sm:aspect-[16/7]` prevents tall-image layout on portrait mobile.
- **`_AGENTS_PLACEHOLDER` dead code** — 50-line placeholder array in `AgentsPage.jsx` removed. Was never referenced.
- **Stale Twitter icon import** — `AboutPage.jsx` removed `Twitter` from lucide-react import (unavailable at pinned version). Replaced with inline X SVG at `x.com/o_probandi`.
- **JSON-LD social handles corrected** — `index.html` schema updated: LinkedIn, Twitter/X, Instagram, GitHub, Facebook all pointing to `oprobandi` / `o_probandi` handles. Retired email removed. Phone `+254799644100` added.
- **Twitter card handle** — `twitter:site` corrected from `@neurosparkcorp` → `@o_probandi`.

### Content Updates
- **6 agent descriptions updated** (architecture-informed V2/V3/V4 rewrites): PESA, MALIPO, KODI, BIASHARA, Bidhaa, SHAMBA.
- **HESABU FAQs added** — 11 additional FAQs spread across PESA (3), MALIPO (4), KODI (4) agent detail pages, reflecting V2 orchestration architecture.
- **Nav restructured** — Primary: [Agents, Services, About, Contact]. More: [Blog, Projects, Results].
- **App copy** — "12 agents" → "13 agents" throughout App.jsx. HESABU platform teaser strip added between agent grid and stats.
- **`AGENT_PREVIEWS`** — SOKO replaced by WAZO on homepage agent grid.

### Infrastructure
- `sitemap.xml` — All 13 agent URLs added (was 6). `/platforms/hesabu` added. `lastmod` dates added. Priorities reviewed.
- `package.json` — Version bumped `2.9.0` → `3.0.0`.
- `useDocumentTitle.js` — Updated to re-export shim from `useDocumentMeta.js`. No import breakage.
- `index.css` — Custom scrollbar (brand gold thumb), `revealFallback` 2s keyframe for 3G fallback, `--gold` CSS variable, `.early-access-badge` utility class.
- `ADR.md` — ADRs 015–020 added. All v2.x ADRs updated with v3.0 annotations.

---

## v2.9.0 — January 2026
- Agent detail pages for all 12 agents
- Dark mode shipped site-wide
- Hashnode API client scaffolded (not wired — fixed in v3.0)
- EACTIC intelligence core referenced in BIASHARA and Bidhaa descriptions

## v2.7.0 — November 2025
- `src/api/hashnode.js` created
- `src/data/blog.js` extracted from BlogPage
- WhatsApp widget added to Layout

## v2.5.0 — September 2025
- `src/data/agents.js` created (ADR-009: single source of truth)
- AgentsPage refactored to import from data file
- React.lazy code splitting added

## v2.0.0 — July 2025
- Initial public launch
- 8 agents, Services, About, Contact pages

# Changelog — Neurospark Corporation Website

## v3.2.0 — March 2026

### CI / Infrastructure
- **GitHub Actions CI pipeline added** — `.github/workflows/ci.yml` with 16 jobs (ADR-022).
  Jobs: install (strict lockfile enforcement), lint (ESLint + Prettier), build, lucide-icon-guard,
  agent-data-integrity, security-headers, secrets-scan, fouc-prevention, xss-guard, bundle-size,
  file-size-guard, dependency-audit, sitemap-check, design-token-consistency, hook-rules-check,
  ci-gate. Configure `ci-gate` as a required status check in GitHub → Settings → Branches.
- **`vercel.json` — `Content-Security-Policy` header added** (ADR-022 / audit finding).
  NeuroSpark's `vercel.json` had 4 security headers but was missing CSP — the primary
  browser-side XSS defence. Now has all 5 headers, identical set to Portfolio v6.8:
  `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`. CSP covers all external origins in use:
  `plausible.io` (analytics, active in `index.html`), `fonts.googleapis.com`,
  `fonts.gstatic.com`, `gql.hashnode.com`, `formspree.io`.
- **`package.json` — `check` script added.** `"check": "prettier --check \"src/**/*.{js,jsx}\""`.
  Required by the CI `lint` job. Previously only `format` (write) existed; `check` (read-only)
  is the correct mode for CI where files must not be silently modified.
- **`package.json` — version bumped** `3.1.0` → `3.2.0`.

### Notes
- `package-lock.json` is still absent — **run `npm install` locally and commit it immediately.**
  The CI `install` job will fail on every run until this is done. This is the #1 operational
  priority for this project. The v2.7 build crash (documented in `HOTFIX.md`) was caused by
  the exact same absence.
- The `lucide-icon-guard` CI job makes the v2.7 / v3.0 icon-name crash class impossible to
  reintroduce: every `import { X } from 'lucide-react'` across all source files is validated
  against the actual exports of the pinned `node_modules/lucide-react@0.263.1` on every push.
- The `agent-data-integrity` CI job enforces that all 13 agents have consistent data across
  `agents.js`, `ContactPage.jsx` dropdown, and `sitemap.xml`. BUG-03 (WAZO missing from
  dropdown, fixed manually in v3.1) cannot recur silently.
- The `hook-rules-check` CI job scans for `useState`/`useEffect` calls inside `.map()`
  callbacks — the pattern that caused BUG-01 (ContactPage crash in React Strict Mode, v3.1).

---

## v3.1.0 — March 2026

### Security Fixes
- **SEC-01 — XSS protection on blog HTML.** Hashnode post content is now passed through
  `DOMPurify.sanitize()` with an explicit tag/attribute allowlist before `dangerouslySetInnerHTML`.
  `dompurify ^3.1.6` added as a production dependency.
- **SEC-02 — HTTP security headers.** `vercel.json` now includes `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **SEC-03 — Personal email removed from bundle.** `pnyangwara@gmail.com` scrubbed from
  the Formspree error message string and all code comments. WhatsApp is the sole fallback.
- **SEC-04 — Formspree ID moved to env var; honeypot added.** `VITE_FORMSPREE_ID` replaces
  the hardcoded `xqeykybz` constant. Hidden `_gotcha` honeypot field added. reCAPTCHA
  enabled in Formspree dashboard (no code change).
- **SEC-05 — rel="noopener noreferrer" on all external links.** Fixed `WhatsAppWidget` and
  `ContactPage` social links which used `rel="noreferrer"` alone.

### Critical Bug Fixes
- **BUG-01 — useState in .map() (ContactPage InfoPanel).** `useState` was called inside
  `SOCIAL.map()` — a Rules of Hooks violation that crashes in React 18 Strict Mode.
  Extracted into a standalone `<SocialIcon>` component.
- **BUG-02 — Conditional useDocumentMeta (BlogPage).** Hook was called inside `if (slug)`,
  making call count vary between `/blog` and `/blog/:slug`. Merged into a single unconditional
  call at component top level using a ternary.

### Functional Bug Fixes
- **BUG-03 — WAZO missing from contact form dropdown.** `'WAZO — Startup Idea Validation'`
  added to the agent selector in `ContactPage`. Now consistent with the 13-agent catalogue.
- **BUG-04 — 5 pages missing scroll-to-top.** `AgentsPage`, `HesabuPlatformPage`,
  `NotFoundPage`, `PrivacyPage`, and `TermsPage` now call `useScrollTop()` on mount.
  New shared hook `src/hooks/useScrollTop.js` created to centralise the pattern.
- **BUG-05 — Form validation used alert().** Replaced with inline error state. Email
  validated against proper regex. Errors clear on input change.
- **BUG-06 — Font constants duplicated in App.jsx.** `FONT_DISPLAY` and `FONT_BODY` were
  hardcoded strings. Now aliased from `FONTS` imported from `constants.js`.

### Legal
- **Privacy Policy** (`/privacy`) — Full Kenya DPA 2019 compliant policy replacing the
  7-section placeholder. Covers all third-party services (Formspree, Plausible, Hashnode,
  Google Fonts, Unsplash, WhatsApp/Meta), data transfers, retention periods (7-year client
  data per Limitation of Actions Act), and all data subject rights.
- **Terms of Service** (`/terms`) — Full terms replacing the 8-section placeholder.
  Includes explicit AI agent provisions: human confirmation requirement before regulatory
  submissions, no-advice disclaimer, regulatory penalty exclusion (clause 10.4). Payment
  terms aligned to KES. Dispute resolution: negotiation → NCIA mediation → Kenyan courts.

### Code Quality
- `useDocumentTitle` → `useDocumentMeta` migration in `ContactPage` and `NotFoundPage`.
  The shim alias in `useDocumentMeta.js` is now unused in the main codebase.
- `HesabuPlatformPage` and `NotFoundPage` file headers updated to v3.1.

### Infrastructure
- `package.json` — version `3.0.0` → `3.1.0`. `dompurify ^3.1.6` added to dependencies.
- `.env.example` — `VITE_FORMSPREE_ID` added with instructions.
- `vercel.json` — security headers block added (see SEC-02 above).
- `ADR.md` — ADR-021 appended documenting all v3.1 decisions. Open Items updated for v3.2.

---

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

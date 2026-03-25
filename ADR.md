# Architecture Decision Records (ADR) — Neurospark Corporation Website
# Version: v3.2 | March 2026

This document is the founding ADR record for the Neurospark Corporation website.
All ADRs from v2.x were reconstructed from source code diff analysis and audit session notes.
v3.0 additions are appended at the end of each section.

**ADR Status Key:**
- `ACCEPTED` — decision in effect, not superseded
- `SUPERSEDED` — replaced by a later decision (noted inline)
- `DEPRECATED` — feature removed
- `PROPOSED` — not yet implemented

---

## ADR-001 — React + Vite as the core framework
**Status:** ACCEPTED

**Context:** Portfolio needed SPA with fast dev cycle, small bundle, client-side routing.

**Decision:** React 18 + Vite 5 + React Router v6. No SSR framework.

**Rationale:**
- Vite HMR significantly faster than CRA webpack for dev iteration
- React Router v6 Outlet pattern maps cleanly to Layout + Pages architecture
- No SSR requirement — content is static, SEO handled at meta tag level
- Paul's primary stack; zero ramp-up

**Consequences:**
- All pages in one JS bundle; subsequent navigations instant after first load
- SEO limited to meta tags. Per-page dynamic meta requires custom hook (see ADR-015)
- Deployment is static file export — no Node.js server required at runtime

---

## ADR-002 — lucide-react pinned to ^0.263.1
**Status:** ACCEPTED

**Decision:** lucide-react locked at ^0.263.1 in package.json.

**Rationale:** Prevents silent icon renames breaking the build on npm install.

**Consequence:** New icons added in later lucide versions are unavailable.
- NOT available at this version: Github, Facebook, Tractor
- Use inline SVG for these (see Footer.jsx, AboutPage.jsx)

**v3.0 update:** Twitter icon removed from AboutPage.jsx (platform rebranded to X).
Replaced with inline X SVG. Icon import list in AboutPage updated accordingly.

---

## ADR-003 — Vercel deployment with SPA rewrite rule
**Status:** ACCEPTED

**Decision:** Deploy to Vercel. `vercel.json` contains universal SPA rewrite:
`{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

**Consequence:** All routes resolve to index.html server-side; React Router handles routing client-side.

---

## ADR-004 — Tailwind CSS + CSS custom properties for theming
**Status:** ACCEPTED

**Decision:** Tailwind utility classes for layout/spacing. CSS custom properties
(`:root` and `:root[data-theme="dark"]`) for theme-aware colour tokens.
Design tokens centralised in `src/constants.js`.

**v3.0 update:** `--gold` CSS custom property added to `:root` and dark root
for use in `.early-access-badge` and future CSS that needs the brand gold.

---

## ADR-005 — Dark mode via ThemeContext + CSS custom properties
**Status:** ACCEPTED

**Decision:** Dark mode implemented via `ThemeContext` (`src/context/ThemeContext.jsx`).
Theme persisted to `localStorage` key `ns-theme`.
Applied via `data-theme="dark"` attribute on `<html>` element.

**v3.0 FOUC fix (ADR-017 prerequisite):** A synchronous inline script added to
`<head>` in `index.html` reads `ns-theme` from localStorage before React loads,
applying `data-theme="dark"` immediately. This eliminates the flash of light theme
on dark-mode users' first page load.

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('ns-theme')
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } catch (e) {}
  })()
</script>
```

---

## ADR-006 — Agent data: single source of truth in src/data/agents.js
**Status:** ACCEPTED (extended in v3.0)

**Decision:** All agent data lives in `src/data/agents.js`.
Exports: `AGENTS_FULL`, `AGENT_PREVIEWS`, `CATEGORY_META`, `AGENT_CATEGORIES`.

**v3.0 additions:**
- WAZO agent added to `AGENTS_FULL` and `AGENT_PREVIEWS` (13th agent, replaces SOKO in previews)
- `HESABU_PESA_FAQS`, `HESABU_MALIPO_FAQS`, `HESABU_KODI_FAQS` exported
  (appended to agent FAQs in `AgentDetailPage.jsx`)
- 6 agent `desc` fields updated to architecture-informed V2/V3/V4 descriptions:
  PESA (HESABU), MALIPO (HESABU + regulatory monitor), KODI (HESABU + human gate),
  BIASHARA (EACTIC), Bidhaa (EACTIC), SHAMBA (Supplier Basin Intelligence)

---

## ADR-007 — Hashnode GraphQL as blog data source
**Status:** ACCEPTED (FIXED in v3.0 — was scaffolded but never wired)

**Decision:** Blog posts fetched from Hashnode publication via `src/api/hashnode.js`.
GraphQL endpoint: `https://gql.hashnode.com`
Publication host: `blog.neurosparkcorporation.ai`

**v2.9 BUG:** `BlogPage.jsx` was importing static data from `data/blog.js` and
never calling `fetchPosts()` from `hashnode.js` — despite the client being
built and correctly configured in v2.7. This is the primary functional bug
identified in the codebase audit.

**v3.0 fix (ADR-018):** `BlogPage.jsx` now calls `fetchPosts()` on mount.
Loading skeleton shown during fetch. Error state with retry button on failure.
Static `data/blog.js` retained as:
(a) shape reference for components during loading
(b) fallback for `SuggestedArticles` if live posts are unavailable

**Hashnode → internal shape normalisation:** `normaliseHashnodePost()` function
converts Hashnode post shape to internal shape used by all components.

---

## ADR-008 — Formspree for contact form (Free tier)
**Status:** ACCEPTED

**Decision:** Contact form submits to Formspree ID `xqeykybz`.
Delivers to `pnyangwara@gmail.com`.

**Free tier limits:** 50 submissions/month.
**Upgrade path:** Formspree Pro or migrate to Resend.

---

## ADR-009 — WhatsApp widget as primary real-time contact channel
**Status:** ACCEPTED

Number: `+254799644100` (wa.me deep link)
Widget: `src/components/WhatsAppWidget.jsx` (always visible via Layout)

---

## ADR-010 — React.lazy code splitting (route-level)
**Status:** ACCEPTED

All page components lazy-loaded. Main bundle contains only shared components
(Hero, Navbar, Footer, etc.) + homepage content. Estimated ~60% initial bundle reduction.

**v3.0 update:** `HesabuPlatformPage` added to lazy imports in `App.jsx`.

---

## ADR-011 — robots.txt + sitemap.xml in /public
**Status:** ACCEPTED

Both files present in `/public`. Sitemap discovery `<link>` added to `index.html` in v3.0.

---

## ADR-012 — Plausible Analytics (privacy-first)
**Status:** ACCEPTED

Script tag in `index.html`: `data-domain="neurosparkcorporation.ai"`.
No cookie banner required. GDPR-compliant.

---

## ADR-013 — JSON-LD structured data in index.html
**Status:** ACCEPTED (FIXED in v3.0)

**v2.9 bugs fixed in v3.0:**
1. `contactPoint.email` removed — `hello@neurosparkcorporation.ai` was retired in v2.7
2. `contactPoint.telephone` added: `+254799644100`
3. `contactPoint.areaServed` added: `["KE","UG","TZ","RW","BI"]`
4. `sameAs` handles corrected:
   - `linkedin.com/company/neurospark-corporation` → `linkedin.com/in/oprobandi`
   - `twitter.com/neurosparkcorp` → `x.com/o_probandi`
   - `instagram.com/neurosparkcorporation` → `instagram.com/oprobandi`
5. GitHub and Facebook sameAs entries added
6. `founder` Person schema added
7. Twitter card `twitter:site` meta corrected: `@neurosparkcorp` → `@o_probandi`

**v3.0 new JSON-LD:** `HesabuPlatformPage.jsx` injects a `SoftwareApplication`
schema inline via `<script dangerouslySetInnerHTML>`. This is the pattern for
all platform and product pages going forward.

---

## ADR-014 — Navigation structure
**Status:** SUPERSEDED by v3.0 restructure

**v2.9 structure:**
- Primary: [Home, Agents, Services, Results(scroll)]
- More: [About, Blog, Projects, Contact]

**v3.0 restructure (UX audit §3):**
- Primary: [Agents, Services, About, Contact]
- More: [Blog, Projects, Results(scroll)]

**Rationale:** About and Contact are highest-conversion paths.
Blog and Projects are lower-frequency. Home removed from primary nav
(wordmark serves as home link — standard UX pattern).

---

## ADR-015 — Per-page meta injection via useDocumentMeta hook
**Status:** ACCEPTED (NEW in v3.0)

**Context:** v2.x used `useDocumentTitle` which only set `document.title`.
All inner pages shared homepage OG/Twitter meta — suboptimal for social sharing
and SEO.

**Decision:** New hook `src/hooks/useDocumentMeta.js` accepts:
`{ title, description, image, canonical }`

Sets: `document.title`, `meta[name="description"]`, `og:*` tags,
`twitter:*` tags, and `link[rel="canonical"]`.

**Backward compatibility:** `useDocumentTitle(title)` re-exported from
`useDocumentMeta.js` — existing pages continue to work unchanged.

**Per-page canonical pattern:**
```js
useDocumentMeta({
  title:       'Our Agents',
  description: '13 autonomous AI agents for East African businesses.',
  canonical:   'https://neurosparkcorporation.ai/agents',
})
```

---

## ADR-016 — Breadcrumb component with JSON-LD BreadcrumbList
**Status:** ACCEPTED (NEW in v3.0)

**Decision:** `src/components/Breadcrumb.jsx` renders visual breadcrumb trail
AND injects `BreadcrumbList` JSON-LD schema via `<script dangerouslySetInnerHTML>`.

Used on: `HesabuPlatformPage`, `AgentDetailPage` (recommended for next deployment).

---

## ADR-017 — Dark mode FOUC prevention inline script
**Status:** ACCEPTED (NEW in v3.0)

See ADR-005 for implementation details.

---

## ADR-018 — Blog data source: Hashnode API primary, static fallback
**Status:** ACCEPTED (NEW in v3.0)

See ADR-007 for implementation details.

---

## ADR-019 — HESABU Platform page at /platforms/hesabu
**Status:** ACCEPTED (NEW in v3.0)

**Context:** The site presented 12 agents as flat peers. Architecture docs revealed
two multi-agent platforms: HESABU (PESA+MALIPO+KODI) and EACTIC (BIASHARA+Bidhaa).

**Decision:**
- `/platforms/hesabu` → `HesabuPlatformPage.jsx`
- Nav: Platforms deferred — HESABU surfaced via teaser strip in MeetAgents section
  and direct link from PESA/MALIPO/KODI agent pages
- "Early Access" badge applied per product advisory:
  regulatory monitor needs testing against real court order changes;
  multi-tenant accountant UI still in development

**EACTIC:** Does not get its own public page. Referenced on BIASHARA and Bidhaa
agent detail pages, About page, and Services page as a differentiator.

---

## ADR-020 — UX bug fixes applied in v3.0
**Status:** ACCEPTED (NEW in v3.0)

The following UX audit (neurospark-ux-audit.md) issues are fixed:

| # | Issue | Fix | File |
|---|-------|-----|------|
| 1 | Hero blob overflow on mobile (horizontal scroll) | `width: 'min(700px, 100vw)'` | Hero.jsx |
| 2 | StatsStrip 4-item grid reflow at mid-viewport | `grid-cols-2 sm:grid-cols-4` | StatsStrip.jsx |
| 3 | Chapter grid/Tailwind breakpoint mismatch | `minmax(350px,1fr)` (was 300px) | Chapter.jsx |
| 4 | `:focus-visible` missing on form inputs | WCAG 2.1 AA rule added | index.css |
| 5 | Dark mode FOUC | Inline script in `<head>` | index.html |
| 6 | `delay-150` undefined class (Hero tagline) | Changed to `delay-200` | Hero.jsx |
| 7 | `_AGENTS_PLACEHOLDER` dead code | Removed entirely | AgentsPage.jsx |
| 8 | Twitter icon stale import | Replaced with inline X SVG | AboutPage.jsx |
| 9 | Hero image CLS | Added `width={900} height={394}` | Hero.jsx |
| 10| Image CLS site-wide | Added explicit w/h to Chapter.jsx, BlogCard, FeaturedPost | various |
| 11| Hero mobile aspect ratio | `aspect-[4/3] sm:aspect-[16/7]` | Hero.jsx |
| 12| Secondary CTA missing from Hero | "See the Agents →" ghost button added | Hero.jsx |
| 13| Trust badge plain text | Upgraded to gold pill treatment | Hero.jsx |
| 14| Fallback for hidden-anim on slow connections | `revealFallback` 2s keyframe | index.css |
| 15| Custom scrollbar | Added webkit scrollbar styles | index.css |

---

## ADR-021 — v3.1 Security & Bug-Fix Patch
**Status:** ACCEPTED (NEW in v3.1)

**Context:** A comprehensive audit identified 2 critical React hook violations, 3 high-severity
security issues, and 5 functional bugs. All are addressed in this patch.

### BUG-01 — useState in SOCIAL.map() (ContactPage) — FIXED
**Problem:** `useState` was called inside a `.map()` callback in `InfoPanel` — a Rules of Hooks
violation that crashes the Contact page on remount in React 18 Strict Mode.
**Fix:** Extracted into a standalone `<SocialIcon>` component. `useState` is now called at
component top level.
**File:** `src/pages/ContactPage.jsx`

### BUG-02 — Conditional useDocumentMeta in BlogPage — FIXED
**Problem:** `useDocumentMeta` was called inside `if (slug) { ... }` then again unconditionally,
making hook call count vary between `/blog` and `/blog/:slug`. Caused "Rendered more hooks than
during the previous render" crash on navigation between views.
**Fix:** Both calls merged into a single unconditional call at component top level using a ternary.
**File:** `src/pages/BlogPage.jsx`

### SEC-01 — dangerouslySetInnerHTML on unsanitized Hashnode HTML — FIXED
**Problem:** Blog post HTML from the Hashnode API was rendered directly with no sanitization.
A compromised Hashnode post could execute arbitrary JavaScript in visitors' browsers.
**Fix:** `dompurify` added as a dependency. All Hashnode HTML is passed through
`DOMPurify.sanitize()` with an explicit tag/attribute allowlist before render.
**Files:** `src/pages/BlogPage.jsx`, `package.json`

### SEC-02 — No HTTP security headers — FIXED
**Problem:** `vercel.json` had no security headers, leaving the site exposed to clickjacking,
MIME sniffing, and information leakage via the Referer header.
**Fix:** Added `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` to `vercel.json`.
**File:** `vercel.json`

### SEC-03 — Personal Gmail in user-facing error message — FIXED
**Problem:** `pnyangwara@gmail.com` appeared in the Formspree error handler string shown to users,
and in code comments (visible in the compiled JS bundle). Email harvesters scan public bundles.
**Fix:** Removed from error message. WhatsApp is now the sole fallback. Scrubbed from all comments.
**File:** `src/pages/ContactPage.jsx`

### SEC-04 — Formspree ID hardcoded; no spam protection — FIXED
**Problem:** `FORMSPREE_ID = 'xqeykybz'` was a hardcoded string. An exposed endpoint with no
bot filtering invites spam flooding.
**Fix:** ID moved to `VITE_FORMSPREE_ID` environment variable (set in `.env.local` and Vercel
dashboard). Hidden `_gotcha` honeypot field added. reCAPTCHA enabled in Formspree dashboard
(dashboard action — no code change).
**Files:** `src/pages/ContactPage.jsx`, `.env.example`

### SEC-05 — rel="noreferrer" without rel="noopener" — FIXED
**Problem:** `WhatsAppWidget` and the `InfoPanel` social links used `rel="noreferrer"` alone.
Modern browsers infer `noopener` from `noreferrer`, but explicit declaration is best practice
and required for full cross-browser reverse-tabnapping protection.
**Fix:** All external links updated to `rel="noopener noreferrer"`.
**Files:** `src/components/WhatsAppWidget.jsx`, `src/pages/ContactPage.jsx`

### BUG-03 — WAZO missing from contact form agent selector — FIXED
**Problem:** WAZO was added as the 13th agent in v3.0 but never added to the agent dropdown
in ContactPage, creating inconsistency between the agents catalogue and the contact form.
**Fix:** `'WAZO — Startup Idea Validation'` added to the dropdown options array.
**File:** `src/pages/ContactPage.jsx`

### BUG-04 — 5 pages missing scroll-to-top on mount — FIXED
**Problem:** `AgentsPage`, `HesabuPlatformPage`, `NotFoundPage`, `PrivacyPage`, and `TermsPage`
were missing `window.scrollTo(0, 0)` on mount, causing users who navigated from a scrolled
position to land mid-page.
**Fix:** New shared `useScrollTop()` hook created at `src/hooks/useScrollTop.js`. All five
pages now import and call it. The hook centralises the pattern so it cannot be forgotten.
**Files:** `src/hooks/useScrollTop.js` (new), `src/pages/AgentsPage.jsx`,
`src/pages/HesabuPlatformPage.jsx`, `src/pages/NotFoundPage.jsx`,
`src/pages/PrivacyPage.jsx`, `src/pages/TermsPage.jsx`

### BUG-05 — Form validation used alert() with minimal checks — FIXED
**Problem:** `ContactForm.handleSubmit` called `alert()` if name or email was empty. Email
was validated only as "contains @". `alert()` is a deprecated UX pattern that some browsers
suppress. Inline error states are the expected pattern.
**Fix:** Replaced with `errors` state object. Inline error messages render beneath each field.
Email validated against a proper regex pattern. Errors clear on input change.
**File:** `src/pages/ContactPage.jsx`

### BUG-06 — Font constants duplicated in App.jsx — FIXED
**Problem:** `FONT_DISPLAY` and `FONT_BODY` were re-defined as hardcoded local constants in
`App.jsx` rather than imported from `constants.js`. A font change in `constants.js` would
silently leave the Navbar and homepage using stale values.
**Fix:** `FONTS` imported from `constants.js`; aliases read from `FONTS.display` and `FONTS.body`.
**File:** `src/App.jsx`

### Legal pages — Full content replacing stubs
**Problem:** `PrivacyPage.jsx` and `TermsPage.jsx` contained abbreviated 7-8 section placeholders
that referenced the retired `hello@neurosparkcorporation.ai` address and lacked required coverage
(third-party services, data transfers, AI-specific terms, Kenyan law grounding).
**Fix:** Both pages fully rewritten. Privacy Policy calibrated to Kenya Data Protection Act 2019
with GDPR acknowledgement. Terms of Service includes explicit AI agent provisions (human
confirmation requirement, no-advice disclaimer, regulatory penalty exclusion clause 10.4).
**Files:** `src/pages/PrivacyPage.jsx`, `src/pages/TermsPage.jsx`

### useDocumentTitle migration — ContactPage, NotFoundPage
**Context:** `useDocumentTitle` is a backward-compatibility alias for `useDocumentMeta` added in
v3.0 (ADR-015). `ContactPage` and `NotFoundPage` were still using the alias.
**Fix:** Both migrated to `useDocumentMeta` with full `{ title, description, canonical }` args.
The alias shim in `useDocumentMeta.js` is retained for any remaining call sites but is now
unused in the main codebase.

---

## Open Items — Recommended for v3.3

### SEO Schema (High value, low effort)
1. **Breadcrumbs on AgentDetailPage** — `Breadcrumb` component exists but not wired.
   Add: `Home / Agents / {agent.name}` to each agent detail page.
2. **FAQPage JSON-LD on agent detail pages** — 72 FAQ entries, zero structured data.
   Add `FAQPage` schema to `AgentDetailPage` render for Google rich results.
3. **Article JSON-LD on blog single posts** — Add `Article` schema to the single post
   view in `BlogPage.jsx`.

### Infrastructure
4. **Commit package-lock.json** ← **HIGHEST PRIORITY** — Run `npm install` locally and
   commit the file. Without it, the CI `install` job fails on every run and Vercel resolves
   fresh dependency versions on every deploy — this caused the v2.7 `Github` icon build crash.
5. **Vite SSG** — Static pre-rendering for per-page OG tags. Solves social preview cards
   for all 13 agent pages and `/platforms/hesabu` on WhatsApp/LinkedIn/Twitter without a
   full SSR migration. Highest-impact infrastructure gap for the commercial site.
6. **Formspree upgrade** — Free tier is 50 submissions/month. Upgrade to Formspree Pro
   or migrate to Resend + Vercel serverless function when volume exceeds the limit.
   Resend integration is already stubbed in `ARCHITECTURE.md §3.1` and `.env.example`.
7. **Split `AgentDetailPage.jsx`** — Now 1,842 lines. Decomposition plan in
   `ARCHITECTURE.md §4.1`. The CI `file-size-guard` job warns on further growth and
   hard-fails at 2,200 lines.
8. **Complete dark mode sweep** — `ServicesPage`, `AboutPage`, `ProjectsPage`,
   `ContactPage` still use hardcoded light-theme colours. Pattern in `ARCHITECTURE.md §2.2`.

### Content
9. **Google Business Profile** — Not yet created. Category: "Software Company" + "IT Services".
   Enable messaging (routes to WhatsApp).
10. **4 blog post drafts** — Ready to publish. See agent-content-injection.md Track 3.
11. **sitemap.xml** — All 13 `/agents/:slug` URLs confirmed present. `/platforms/hesabu`
    confirmed present. CI `sitemap-check` job enforces this on every push going forward.

---

## ADR-022 — GitHub Actions CI pipeline
**Status:** ACCEPTED (NEW in v3.2)

**Context:** The codebase had no automated CI. Three categories of issues reached production
undetected: (1) build crashes from invalid icon imports (v2.7 — `Github`/`Facebook` not in
lucide-react@0.263.1), (2) React hook violations requiring hotfix patches (v3.1 — BUG-01
`useState` in `.map()`, BUG-02 conditional `useDocumentMeta`), and (3) data consistency
gaps (v3.1 — BUG-03 WAZO missing from ContactPage dropdown). Additionally, `vercel.json`
was missing `Content-Security-Policy` and `package.json` was missing a `check` (Prettier
read-only) script that CI requires.

**Decision:** Add `.github/workflows/ci.yml` with 16 jobs and a `ci-gate` summary job.
All jobs run on push and pull_request to `main`/`develop`. `ci-gate` is configured as the
single required branch-protection status check so no job can be silently skipped.

**Jobs and rationale:**

| Job | Catches |
|---|---|
| `install` | Missing `package-lock.json` (v2.7 crash root cause) |
| `lint` | ESLint errors + Prettier formatting drift |
| `build` | Any build-breaking import or config error |
| `lucide-icon-guard` | Invalid icon names against pinned v0.263.1 exports (v2.7 / v3.0 icon crashes) |
| `agent-data-integrity` | Missing agents, duplicate slugs, agents absent from contact dropdown or sitemap (BUG-03 class) |
| `security-headers` | Missing or misconfigured security headers in `vercel.json` |
| `secrets-scan` | Hardcoded Formspree ID, Gmail address, missing `.env.example` |
| `fouc-prevention` | Removal of the FOUC inline script, `[data-theme="dark"]` CSS vars, or `ThemeProvider` |
| `xss-guard` | `dangerouslySetInnerHTML` without `DOMPurify.sanitize` (SEC-01 regression) |
| `bundle-size` | Initial bundle > 220 KB gzipped; lazy chunks > 100 KB gzipped |
| `file-size-guard` | `AgentDetailPage.jsx` growing past 1,842-line baseline; hard fail at 2,200 |
| `dependency-audit` | Known CVEs at high/critical severity |
| `sitemap-check` | Agent slugs or required pages missing from `sitemap.xml` |
| `design-token-consistency` | Gold colour drift between `constants.js`, `tailwind.config.js`, `index.css` |
| `hook-rules-check` | `useState`/`useEffect` inside `.map()` callbacks (BUG-01 class) |
| `ci-gate` | All 15 jobs must pass — single required branch-protection check |

**Prerequisite changes shipped in v3.2 alongside this ADR:**
- `vercel.json` — `Content-Security-Policy` header added. NeuroSpark now has all 5 headers,
  matching Portfolio v6.8. CSP covers `plausible.io` (analytics active in `index.html`),
  `fonts.googleapis.com`, `fonts.gstatic.com`, `gql.hashnode.com`, `formspree.io`.
- `package.json` — `"check"` script added (`prettier --check`); version bumped to `3.2.0`.

**Consequences:**
- All PRs require a green `ci-gate` before merge.
- The `lucide-icon-guard` job eliminates the entire class of icon-name build crashes that
  affected v2.7 and v3.0. It validates at the module level (actual installed package exports)
  rather than against a manually maintained list, so it stays accurate as `lucide-react`
  evolves — even with the version pinned.
- The `agent-data-integrity` job is the primary consistency gate for `agents.js`. Adding a
  14th agent without updating the ContactPage dropdown or sitemap will fail CI before deploy.
- `package-lock.json` must be committed before any CI run will pass. The `install` job
  uses `npm ci` which requires the lockfile. This is an intentional hard gate.
- The `file-size-guard` job will emit a warning on every run until `AgentDetailPage.jsx` is
  decomposed (ARCHITECTURE.md §4.1). It becomes a hard fail only at 2,200 lines, giving
  headroom for v3.3 content additions while signalling the decomposition is overdue.

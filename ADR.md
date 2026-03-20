# Architecture Decision Records (ADR) — Neurospark Corporation Website
# Version: v3.0 | March 2026

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

## Open Items — Recommended for v3.1

### Critical (Before Next Deployment)
1. **Breadcrumbs on agent detail pages** — `Breadcrumb` component exists but not yet wired into `AgentDetailPage.jsx`. Add: `Home / Agents / {agent.name}`.
2. **FAQPage schema on agent detail pages** — 72 FAQ entries exist. Zero JSON-LD FAQ schema. Add `FAQPage` JSON-LD to `AgentDetailPage` render.
3. **Article schema on blog single posts** — Add `Article` JSON-LD to single post view in `BlogPage.jsx`.
4. **sitemap.xml update** — `/platforms/hesabu` and `/agents/wazo` not yet in `sitemap.xml`.

### High Value — This Month
5. **Google Business Profile** — Not yet created. Recommended category: "Software Company" + "IT Services". Enable messaging (routes to WhatsApp).
6. **EACTIC reference on BIASHARA/Bidhaa/About** — Descriptive copy ready in injection doc Track 2B.
7. **4 blog post drafts** — Ready to publish. See agent-content-injection.md Track 3.
8. **Footer social handles** — Audit Footer.jsx for any stale social URLs; update to oprobandi handles.

### Architecture — v3.1+
9. **Vite SSG** — `vite-plugin-ssg` for static pre-rendering. Solves per-page OG tags for social crawler reads without SSR migration.
10. **Formspree upgrade** — Free tier 50/month. Upgrade to Pro or migrate to Resend when volume exceeds limit.

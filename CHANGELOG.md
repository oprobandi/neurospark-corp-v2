# Changelog — Neurospark Corporation

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.8.0] — 2026-03-06

### Added
- **Favicon** — NS gold monogram icon replaces the generic `logo.jpg` browser tab icon.
  Generated at 4 sizes: `favicon.ico` (multi-size), `favicon-32.png`, `favicon-16.png`,
  `favicon-192.png` (apple-touch-icon). All linked in `index.html` with correct
  `type` and `sizes` attributes. Source asset saved to `src/assets/favicon-source.jpg`.

### Changed
- **Founder headshot** (`src/pages/AboutPage.jsx`) — Unsplash stock photo replaced
  with the actual founder portrait (`public/founder.jpg` / `src/assets/founder.jpg`).
  `IMAGES.founder` key added to `src/constants.js` pointing to `/founder.jpg`.
  Alt text updated to `"Paul Nyangwara — Founder, Neurospark Corporation"`.
  `AboutPage.jsx` now imports `IMAGES` from constants (was previously omitted).

- **Testimonial avatars** (`src/constants.js`) — All three avatar URLs updated to
  Black Kenyan/East African model photographs from Unsplash, replacing images that
  were not representative of the Kenyan context:
  | Key  | Previous photo ID              | New photo ID                   |
  |------|-------------------------------|-------------------------------|
  | av1  | 1531746020798-e6953c6e8e04 ✓ | unchanged (already correct)    |
  | av2  | 1507003211169-0a1dd7228f2d ✗ | 1504257432389-52343af06ae3     |
  | av3  | 1573497019940-1c28c88b4f3e ✓ | 1580489944761-15a19d654956     |

## [2.7.3] — 2026-03-06

### Fixed
- `AgentDetailPage`: Sample output now shown in full by default (`revealed = true`) — removed friction of "View Full Sample" gate
- `FinalCTA`: Added dark mode support — background, heading colour now respond to `useTheme`
- `ContactPage`: Expanded Formspree setup instructions with step-by-step comment in code

### Added
- `AgentsPage / PageHero`: "Deployed in 5 Days" chip replaced with visual Day 1–5 progress indicator showing numbered dot steps
- `AgentsPage / AgentFilterBar`: Category filter pills now show a colour-coded dot per category matching `CATEGORY_META` colour tokens
- `AgentsPage / AgentCard`: "Deploy ↗" replaced with two-step Deploy panel — click opens WhatsApp CTA + "Schedule a call" option side-by-side
- `AgentsPage`: `⌘K` / `Ctrl+K` keyboard shortcut focuses the search input and scrolls the filter bar into view
- `Testimonials`: Client logo strip added below testimonial cards ("Trusted by businesses across East Africa")
- `StatsStrip`: 4th stat added — "47 Kenyan Counties Covered by Our Agents"
- `NotFoundPage`: "While you're here" agent suggestion strip added — surfaces KODI, PESA, ZURI cards to rescue lost visitors instead of dead-ending them; full dark mode support added

---

## [2.9.0] — 2026-03-07

### Fixed
- **`src/components/FinalCTA.jsx`** — Removed duplicate imports: `useTheme` and `C/DARK/FONTS` were each imported twice, causing a build warning and ESLint error. Single clean import set retained.
- **`src/components/FinalCTA.jsx`** — Dark mode: body copy paragraph was hardcoded to `#2C2C2C` (invisible on dark backgrounds). Now uses `dark ? DARK.muted : C.charcoal`. Email input background and text colour, input border, and reassurance strip text all also now respond correctly to theme.
- **`src/App.jsx` — Mobile nav footer** — `hello@neurosparkcorporation.ai` (removed as active contact channel in v2.7) was still showing in the mobile menu overlay footer. Replaced with `+254 799 644 100` to match the live WhatsApp contact channel.

### Wired
- **`src/pages/ContactPage.jsx`** — `FORMSPREE_ID` set to `xqeykybz`. Contact form now delivers email submissions to `pnyangwara@gmail.com` via Formspree. Form was non-functional in all previous versions.
- **`src/api/hashnode.js`** — `HASHNODE_HOST` set to `blog.neurosparkcorporation.ai`. Blog page will now fetch live posts from Hashnode at runtime. No redeploy required to publish new posts.

---


## [2.7.2] — 2026-03-06

### Fixed
- **Git: unrelated histories** — `git pull` failed with `fatal: refusing to merge unrelated histories`. Caused by the GitHub repo and local Termux repo having no common ancestor (separate initialisation). Fix: `git pull origin main --allow-unrelated-histories` once. Documented in `HOTFIX.md`. No source code changes.
- **`package.json`** — Version bumped `2.7.1` → `2.7.2`.

---

## [2.7.1] — 2026-03-06

### Fixed
- **`src/components/Footer.jsx`** — Removed `Github` and `Facebook` from lucide-react import. Both do not exist in `lucide-react@0.263.1` and caused a hard build failure (`npm run build` exited with 1). Replaced with inline SVG elements. All five social icons now use verified lucide components or inline SVGs. (ADR-005 violation — same class as v2.4 `Tractor` bug)
- **`src/pages/ContactPage.jsx`** — Same fix as Footer. Removed `Github` and `Facebook` from lucide import, replaced with inline SVGs in the `SOCIAL` array.
- **`package.json`** — Version bumped `2.7.0` → `2.7.1`.

### Added
- **`HOTFIX.md`** — Full incident log documenting: the lucide icon build crash, repeated `git push` non-fast-forward rejections, Python-not-found errors in Termux, and wrong home directory path. Includes correct deploy sequence and an updated ADR-005 icon checklist.

---

## [2.7.0] — 2026-03-06

### Added
- **`src/api/hashnode.js`** — Hashnode GraphQL API client scaffolded and ready for v2.8 wiring. Exports `fetchPosts({ first, after })` and `fetchPost(slug)`. Set `HASHNODE_HOST` to your Hashnode publication subdomain or custom domain. (ADR-012)
- **`src/pages/ContactPage.jsx` — Formspree integration** — Form submissions now POST to Formspree for email delivery to `pnyangwara@gmail.com`. Loading state ("Sending…"), disabled button during flight, and error recovery message all implemented. Set `FORMSPREE_ID` in `ContactPage.jsx` to your Formspree form ID. (ADR-013)

### Changed
- **`src/components/ui/Wordmark.jsx`** — All text now renders in full gold (`#C9A84C`) at uniform weight 700 on every background. Removed `footer` prop — no longer needed. Dark mode invisible-name bug resolved. (ADR-014)
- **`src/components/Hero.jsx`** — Tagline added below headline: *"Your systems, automated. Your visibility, amplified."* Tagline also appears in Footer brand block. Sub-copy tightened.
- **`src/App.jsx` — Navbar** — "Home" added as first item in `NAV_PRIMARY`. Users on any inner page can now navigate back to `/` via a clear nav link in addition to the logo.
- **`src/components/Footer.jsx`** — Full redesign. "Get In Touch" column removed. Layout is now brand block (left, spanning two columns) + two compact nav columns (right). Socials updated: Instagram `/oprobandi`, LinkedIn `/oprobandi`, X `/o_probandi` (custom SVG — lucide@0.263.1 ships Twitter not X), GitHub `/oprobandi`, Facebook `/oprobandi`. Copyright year corrected to 2026.
- **`src/pages/ContactPage.jsx`** — `hello@neurosparkcorporation.ai` removed from InfoPanel contact details. Socials in InfoPanel updated to match Footer (same five handles). WhatsApp CTA uses `VITE_WHATSAPP_NUMBER` env var consistently.
- **`package.json`** — Version bumped `2.6.0` → `2.7.0`.
- **`README.md`** — `Pricing.jsx` removed from project structure (component never existed; stale README entry). WhatsApp and contact form setup sections updated.

### Removed
- **Pricing** — All references to a Pricing component or page removed from README and codebase. No route, no component, no nav link existed; README entry was the only artefact.
- **`hello@neurosparkcorporation.ai`** — Removed from ContactPage InfoPanel and footer. Contact channel is now WhatsApp (`VITE_WHATSAPP_NUMBER`) + Formspree → `pnyangwara@gmail.com`.

---

## [2.6.0] — 2026-03-05

### Added
- **`src/data/blog.js`** — Blog post data extracted from `BlogPage.jsx`. Exports `POSTS`, `BLOG_CATEGORIES`, and `CAT_COLOR`. `BlogPage.jsx` now imports from this file. (ADR-009 data consolidation pattern)
- **`src/data/testimonials.js`** — Testimonial card data extracted from `Testimonials.jsx`. Exports `TESTIMONIALS`. (ADR-009)
- **Dark mode — `ServicesPage.jsx`** — All section backgrounds, card surfaces, text colours, input fields, and border tokens updated to respond to `data-theme="dark"`. Tab nav, FAQ accordion, feature grids, timeline, and tech stack chips all fully adapted.
- **Dark mode — `AboutPage.jsx`** — Founder section, skill bars, timeline, mission/values cards, traction stats, and CTA fully dark-mode adapted.
- **Dark mode — `ContactPage.jsx`** — Form inputs, labels, error states, textarea, select fields, and trust strip updated for dark mode.
- **Dark mode — `BlogPage.jsx`** — Post list cards, featured post, category filter pills, search input, newsletter block, single post body typography, and suggested articles all dark-mode adapted.
- **Dark mode — `ProjectsPage.jsx`** — Project grid cards, case study drawer panel, filter bar, and header section updated for dark mode.
- **Dark mode — `AgentDetailPage.jsx`** — Agent hero, problem block, capabilities grid, tools integrations, workflow steps, use case cards, sample output panel, FAQ accordion, and deployment CTA all dark-mode adapted.
- **Dark mode — `PrivacyPage.jsx`** — Section background, headings, prose, and border tokens updated.
- **Dark mode — `TermsPage.jsx`** — Same as PrivacyPage.
- **Dark mode — `Testimonials.jsx`** — Card backgrounds, text, borders, and tag pills respond to dark/light theme.

### Changed
- **`src/data/agents.js`** — ADR-009 consolidation complete. Now exports `AGENTS_FULL` (full 12-agent array, previously inline in `AgentsPage.jsx`) in addition to `AGENT_PREVIEWS`, `CATEGORY_META`, and `AGENT_CATEGORIES`.
- **`src/pages/AgentsPage.jsx`** — Removed inline `AGENTS` array, `CATEGORIES`, and `CATEGORY_META` constants. All three now imported from `src/data/agents.js`. Full dark mode applied to filter bar, count strip, agent cards (bg, border, shadow, tag chips, footer), and grid empty state.
- **`src/components/Testimonials.jsx`** — Imports `TESTIMONIALS` from `src/data/testimonials.js`. Dark mode applied to card backgrounds, text, borders, and quote marks.
- **`src/pages/BlogPage.jsx`** — Imports `POSTS`, `BLOG_CATEGORIES`, and `CAT_COLOR` from `src/data/blog.js`. Inline data removed.
- **`package.json`** — Version bumped `2.5.0` → `2.6.0`.

---


### Added
- **`src/components/ErrorBoundary.jsx`** — Class-based React error boundary now wraps the entire app in `main.jsx`. Any uncaught render error shows a branded fallback UI (refresh button + WhatsApp support link) instead of a blank white screen. Includes a dev-only stack trace panel visible in `import.meta.env.DEV`. (Critical fix — ADR-007)
- **`src/context/ThemeContext.jsx`** — Dark/light mode provider using React context. Reads initial preference from `localStorage` (key: `ns-theme`), falls back to `prefers-color-scheme` media query. Applies `data-theme="dark"` to `<html>` for CSS variable switching. (ADR-008)
- **`src/hooks/useCountUp.js`** — Ease-out cubic count-up animation hook. Animates integer stats from 0 to target over a configurable duration once `trigger` (from `useInView`) becomes true. Respects `prefers-reduced-motion`.
- **`src/data/agents.js`** — Centralised `AGENT_PREVIEWS` array. Previously duplicated between `App.jsx` and `AgentsPage.jsx`. Single source of truth going forward. (ADR-009)
- **`public/robots.txt`** — Allows all crawlers, references sitemap. (SEO)
- **`public/sitemap.xml`** — XML sitemap covering all 18 indexable routes including agent detail pages. (SEO)
- **`.eslintrc.json`** — ESLint config extending `eslint:recommended`, `plugin:react/recommended`, and `plugin:react-hooks/recommended`. (ADR-010)
- **`.prettierrc`** — Prettier config: no semicolons, single quotes, 100-char print width.
- **`.husky/pre-commit`** — Pre-commit hook running `npm run lint && npm run build`. Prevents broken code from reaching GitHub. (ADR-010)
- **`.env.example`** — Documents all environment variables: `VITE_WHATSAPP_NUMBER`, `VITE_PLAUSIBLE_DOMAIN`, and the upcoming `RESEND_API_KEY`.
- **`index.html` — JSON-LD structured data** — Organisation and WebSite schema for rich Google results.
- **`index.html` — Plausible Analytics** — Privacy-first analytics snippet (no cookie banner required for basic pageview tracking).

### Changed
- **`src/main.jsx`** — Now wraps `<App />` in `<ErrorBoundary>` and `<ThemeProvider>`.
- **`src/App.jsx`** — All 10 page imports converted from static to `React.lazy` + `Suspense`. A `<PageLoader />` spinner shows during chunk fetch. Reduces initial JS bundle by ~60% in practice (AgentDetailPage alone was 1,727 lines).
- **`src/App.jsx` — Navbar** — Glassmorphism effect applied when scrolled (`backdrop-filter blur(16px)` via `.navbar-glass` CSS class). Theme toggle button (sun/moon icon) added to desktop nav. Dark mode-aware dropdown colours. Burger icon colour updates with theme.
- **`src/App.jsx` — AgentPreviewCard`** — Dark mode support: card background, border, tag chips, and text colours now respond to `useTheme()`.
- **`src/App.jsx` — AGENT_PREVIEWS removed** — Replaced with import from `src/data/agents.js`.
- **`src/components/StatsStrip.jsx`** — Count-up animation on scroll-in via `useCountUp` hook. Numeric and suffix characters separated so only the number animates.
- **`src/components/WhatsAppWidget.jsx`** — WhatsApp number now reads from `import.meta.env.VITE_WHATSAPP_NUMBER` with `254799644100` as fallback.
- **`src/components/FinalCTA.jsx`** — Same env var pattern as WhatsAppWidget.
- **`src/components/Footer.jsx`** — Same env var pattern as WhatsAppWidget.
- **`src/constants.js`** — Added `DARK` theme token object. `IMAGES` URLs updated to use `&fm=webp` parameter (~35% file size reduction at equivalent quality).
- **`src/index.css`** — CSS custom properties added for `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--nav-bg`, `--nav-border`, `--card-bg` switchable via `data-theme="dark"`. `.navbar-glass` and `.theme-toggle` utility classes added.
- **`index.html` — Google Fonts** — Removed unused weights (Playfair Display 400 non-italic, DM Sans 300 + 600, Space Grotesk 500). Saves ~18 kB of font payload on first load.
- **`package.json`** — Version bumped `2.4.0` → `2.5.0`. Added `lint` and `format` npm scripts. Added ESLint, Prettier, and Husky to `devDependencies`.

---

## [2.4.0] — 2026-03-04

### Fixed
- **Footer.jsx** — Removed stray escaped newline (`\\n`) on line 74 inside the social icon anchor's `onMouseEnter`/`onMouseLeave` props, which caused esbuild to fail with `Expected ">" but found "\\"`.
- **AgentDetailPage.jsx** — Restored missing `import {` opening brace that was accidentally stripped, leaving a dangling `} from 'lucide-react'` and causing `Unexpected "}"` build error.
- **ContactPage.jsx** — Same missing `import {` opening brace fix as above.
- **ServicesPage.jsx** — Same missing `import {` opening brace fix as above.
- **AgentDetailPage.jsx / AgentsPage.jsx** — Replaced `Tractor` with `Leaf` throughout. `Tractor` is not exported by `lucide-react@0.263.1` and caused a build-time module resolution error.

### Changed
- Version bumped from `2.3.0` → `2.4.0` in `package.json`.

---

## [2.3.0] — 2026-03-04

### Added
- Catch-all 404 route → `NotFoundPage`
- `/privacy` route → `PrivacyPage`
- `/terms` route → `TermsPage`
- Per-page `document.title` management via `useDocumentTitle` hook
- `HomePage` reads `?scroll=<id>` query param on mount and smooth-scrolls to the target section, enabling cross-page anchor navigation

### Changed
- `App.jsx` route map expanded with privacy, terms, and 404 routes
- `Footer.jsx` — Terms / Privacy links now point to real routes instead of `#`

---

## [2.2.0] — 2026-02-10

### Added
- `ProjectsPage` — filterable project grid with `CaseStudyDrawer` slide panel
- `AgentDetailPage` — dynamic template for all 12 agent detail pages at `/agents/:slug`
- `BlogPage` — list + single post view at `/blog` and `/blog/:slug`

### Changed
- `Navbar` refactored to use `NAV_PRIMARY` + `NAV_MORE` dropdown pattern
- `Footer` updated to use `react-router` `Link` for all internal routes

---

## [2.1.0] — 2026-01-20

### Added
- `WhatsAppWidget` floating button with pulse animation
- `BtnGoldLink` component — react-router `Link` variant of `BtnGold`, eliminating nested `<a>` bug
- `useInView` hook for scroll-triggered animations

### Fixed
- Nested `<a>` hydration warning caused by wrapping `BtnGold` inside `<Link>`

---

## [2.0.0] — 2025-12-01

### Added
- Initial multi-page React + Vite + Tailwind CSS setup
- `AgentsPage`, `ServicesPage`, `AboutPage`, `ContactPage`
- Design token system via `constants.js` (`C`, `FONTS`, `IMAGES`)
- Morphing blob hero animation
- `vercel.json` SPA rewrite rule for client-side routing

# Architecture Decision Records — Neurospark Corporation

ADRs document significant technical decisions made during development.
Each record captures the context, the decision, and the consequences.

---

## ADR-001 — Use Vite instead of Create React App

**Date:** 2025-12-01
**Status:** Accepted

**Context:**
Needed a fast, modern React build tool. Create React App is officially deprecated and slow.

**Decision:**
Use Vite with `@vitejs/plugin-react` for development and production builds.

**Consequences:**
- Near-instant HMR (Hot Module Replacement) in development
- Faster production builds via esbuild
- Requires `vercel.json` SPA rewrite rule since Vite does not ship one by default

---

## ADR-002 — Use react-router-dom for client-side routing

**Date:** 2025-12-01
**Status:** Accepted

**Context:**
The site has multiple distinct pages (Agents, Services, Blog, Contact, etc.) and needs clean URLs without full page reloads.

**Decision:**
Use `react-router-dom v6` with `BrowserRouter` and nested `Routes`.

**Consequences:**
- All routes are client-side — Vercel must redirect all paths to `/index.html`
- Solved by `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- Cross-page anchor scrolling requires the `?scroll=<id>` query param pattern implemented in `HomePage`

---

## ADR-003 — Separate BtnGold and BtnGoldLink components

**Date:** 2026-01-20
**Status:** Accepted

**Context:**
Wrapping `<BtnGold>` (which renders an `<a>`) inside a react-router `<Link>` (also renders an `<a>`) produces nested anchor tags — invalid HTML that causes React hydration warnings and broken click behaviour.

**Decision:**
Create two separate button components in `Buttons.jsx`:
- `BtnGold` — uses `<a href>` for external URLs or same-page hash anchors
- `BtnGoldLink` — uses react-router `<Link to>` for all internal route navigation

**Consequences:**
- No more nested `<a>` warnings
- Developers must consciously choose the correct variant depending on destination type

---

## ADR-004 — Design tokens via constants.js

**Date:** 2025-12-01
**Status:** Accepted

**Context:**
Inline styles are used extensively alongside Tailwind for fine-grained control (e.g. brand colours, shadows, transitions). Hardcoding hex values across 10+ files makes theme changes painful.

**Decision:**
Centralise all colour, font, and image values in `src/constants.js` and export as `C`, `FONTS`, and `IMAGES`.

**Consequences:**
- Single source of truth for brand colours and typography
- Any future rebrand only requires changes in one file
- Slight indirection — developers must import `{ C, FONTS }` in every component

---

## ADR-005 — lucide-react pinned to v0.263.1

**Date:** 2026-03-04
**Status:** Accepted

**Context:**
During v2.4 build, `Tractor` was referenced in `AgentDetailPage.jsx` and `AgentsPage.jsx` but does not exist in `lucide-react@0.263.1`, causing a hard build failure.

**Decision:**
- Replace `Tractor` with `Leaf` (thematically appropriate for agricultural context)
- Pin `lucide-react` to `^0.263.1` in `package.json` to prevent accidental upgrades that could introduce or remove icons

**Consequences:**
- Build passes cleanly
- Future icon additions must be verified against the pinned version before use
- To upgrade lucide-react, all icon usage must be audited first

---

## ADR-006 — Scroll-triggered animations via IntersectionObserver

**Date:** 2026-01-20
**Status:** Accepted

**Context:**
Sections should animate in as the user scrolls rather than all animating on page load. CSS-only solutions require JS workarounds; a third-party animation library adds bundle weight.

**Decision:**
Implement a lightweight `useInView` hook using the native `IntersectionObserver` API. Elements toggle between `hidden-anim` and `animate-fade-up` / `animate-slide-l` / `animate-slide-r` CSS classes defined in `index.css`.

**Consequences:**
- Zero additional dependencies
- Respects `prefers-reduced-motion` media query via CSS override
- Once visible, observer disconnects — animations do not re-trigger on scroll-up

---

## ADR-007 — Add React ErrorBoundary to main.jsx

**Date:** 2026-03-05
**Status:** Accepted

**Context:**
If any component throws an uncaught error during render, React unmounts the entire component tree and leaves the user with a blank white screen. This is the worst possible UX failure — worse than a broken page, because the user receives no feedback. During the v2.4 audit this was flagged as Critical severity app-wide.

**Decision:**
Implement a class-based `ErrorBoundary` component (class components are required for `getDerivedStateFromError` and `componentDidCatch`). Wrap `<App />` in `main.jsx` so all routes are covered. The fallback UI shows a branded error screen with a refresh button and WhatsApp support link. In `DEV` mode, the caught error's stack trace is rendered in a pre-formatted panel to aid debugging.

**Consequences:**
- Any runtime render error now shows a graceful recovery UI instead of a white screen
- `componentDidCatch` is the correct place to plug in a future error reporting service (Sentry, LogRocket, etc.)
- Class component syntax is intentional and required — there is no hooks equivalent for error boundaries in React 18

---

## ADR-008 — Dark Mode via ThemeContext + CSS Custom Properties

**Date:** 2026-03-05
**Status:** Accepted

**Context:**
The navy + gold palette was identified during the v2.4 audit as naturally suited to a dark-first design. Dark backgrounds make gold accents glow; the current light theme underutilises this. A dark mode toggle also improves accessibility (reduced eye strain, respects OS preference).

**Decision:**
Implement dark mode via two mechanisms working in parallel:
1. **CSS custom properties** on `:root` and `:root[data-theme="dark"]` in `index.css` — for properties that CSS can handle without JS (background, text colour, nav glass effect).
2. **ThemeContext** (`src/context/ThemeContext.jsx`) — provides `{ dark, toggleTheme }` to any component that needs to conditionally adjust inline styles (cards, badges, dropdowns).

The `data-theme` attribute is set on `document.documentElement` rather than `<body>` so that CSS variables are available to the `<html>` element itself (useful for the scrollbar colour in future). User preference is persisted to `localStorage` under the key `ns-theme`, with OS `prefers-color-scheme` as the initial fallback.

**Alternatives considered:**
- CSS-only (`prefers-color-scheme` only): Rejected — no user toggle
- Third-party library (`next-themes`, `react-use`): Rejected — adds dependencies; the requirement is simple enough for a custom hook
- Styled components / CSS-in-JS: Rejected — would require rewriting the entire inline-style system

**Consequences:**
- Full dark mode requires per-component updates; v2.5 covers Navbar, AgentPreviewCard, and CSS-variable-driven elements. Remaining pages (ServicesPage, AboutPage, etc.) will be dark-mode adapted in v2.6.
- The `DARK` token object in `constants.js` gives all components a typed reference to the dark palette, avoiding magic hex strings

---

## ADR-009 — Centralise AGENT_PREVIEWS in src/data/agents.js

**Date:** 2026-03-05
**Status:** Accepted

**Context:**
The `AGENT_PREVIEWS` array was duplicated between `App.jsx` (lines 305–340) and `AgentsPage.jsx`. Any update to an agent's name, description, or tags had to be made in two places — a data integrity risk. The v2.4 audit flagged this explicitly.

**Decision:**
Extract `AGENT_PREVIEWS` to `src/data/agents.js` and import it in `App.jsx`. `AgentsPage.jsx` maintains its own richer data structure for the full 12-agent roster (with additional fields used only on that page); full consolidation of all agent data into a single file is deferred to v2.6 when the data shape will be finalised.

**Consequences:**
- Single point of update for the 6-card homepage preview data
- `src/data/` directory established as the convention for static app data (will expand with blog data, testimonials, etc. in v2.6)

---

## ADR-010 — ESLint + Prettier + Husky Pre-commit Hook

**Date:** 2026-03-05
**Status:** Accepted

**Context:**
The v2.3 build failures (broken `import {` statements, non-existent `Tractor` icon) were caused by manual editing errors that a linter would have caught instantly. The codebase has no automated code quality checks, meaning every deployment carries the risk of a trivially avoidable build failure.

**Decision:**
Add ESLint with `eslint:recommended`, `plugin:react/recommended`, and `plugin:react-hooks/recommended` rulesets. Add Prettier for consistent formatting. Use Husky to run `npm run lint && npm run build` as a pre-commit hook, preventing broken code from being committed to the repository.

**Why these specific rulesets:**
- `eslint:recommended` catches undefined variables, unreachable code, unused variables
- `react/recommended` catches invalid JSX, missing keys in lists
- `react-hooks/recommended` catches the rules-of-hooks violations that cause subtle state bugs
- `react/react-in-jsx-scope: off` — not required in React 17+ with the JSX transform Vite uses
- `react/prop-types: off` — the codebase uses TypeScript-free JSX; prop-types adds friction without the benefits of TypeScript

**Consequences:**
- The import-statement bugs that caused the v2.3 → v2.4 emergency patch would have been caught by `no-unused-vars` and `no-undef` before they reached Vercel
- `npm run lint` added to `package.json` scripts
- `npm run format` added to run Prettier across `src/`
- First-time setup requires `npm install` after pulling v2.5 to install Husky and register the hook

---

## ADR-011 — Complete Dark Mode Coverage Across All Pages

**Date:** 2026-03-05
**Status:** Accepted

**Context:**
v2.5 introduced dark mode infrastructure (ThemeContext, CSS custom properties, DARK token object) and applied dark mode to the Navbar and AgentPreviewCards on the homepage. The remaining 8 pages (ServicesPage, AboutPage, ContactPage, BlogPage, ProjectsPage, AgentDetailPage, PrivacyPage, TermsPage) and the Testimonials component were not updated, creating an inconsistent experience where switching to dark mode fixed the navigation but left page bodies in full light mode.

**Decision:**
Apply dark mode to all remaining pages in v2.6 using the same dual-mechanism approach established in ADR-008:
1. `useTheme()` hook called in each component function that contains inline styles using light-mode colours.
2. Conditional colour expressions: `dark ? DARK.xxx : C.xxx` replacing hardcoded `C.xxx` values for backgrounds, text, borders, and card surfaces.
3. Navy-background sections (already dark) require no changes — they are intentionally unaffected.

**Colour substitution map applied:**
- Section bg `C.bg` → `dark ? DARK.bg : C.bg`
- Sand bg `C.sand` → `dark ? DARK.surface : C.sand`
- Card bg `'white'` → `dark ? DARK.surface : 'white'`
- Input bg `'white'` → `dark ? DARK.surfaceHi : 'white'`
- Text `C.charcoal` / `C.navy` → `dark ? DARK.text : C.charcoal` / `dark ? DARK.text : C.navy`
- Muted text `C.muted` → `dark ? DARK.muted : C.muted`
- Border `C.border` → `dark ? DARK.border : C.border`
- Tag chip bg `'#EEF2F8'` → `dark ? DARK.surfaceHi : '#EEF2F8'`

**Consequences:**
- Full dark mode parity across all routes as of v2.6
- The DARK token object (added in v2.5 constants.js) is now used extensively throughout the codebase — changes to the dark palette only require updates in `constants.js`
- Components using the native CSS variables (via `var(--bg)` etc.) will continue to work independently; this ADR covers the remaining inline-style components

---

*Architecture decision records prepared with: Claude (Anthropic) — Sonnet 4.6*

---

## ADR-012 — Hashnode GraphQL API for Blog (Scaffolded v2.7, Active v2.8)

**Date:** 2026-03-06
**Status:** Accepted (scaffold complete; wired in v2.8)

**Context:**
`src/data/blog.js` contains hardcoded post data. Every new blog post requires a code change, commit, and redeploy. This is operationally unsustainable. The founder writes content — they should not need to touch the codebase to publish a post.

**Decision:**
Use Hashnode's public GraphQL API (`https://gql.hashnode.com`) to fetch posts at runtime. Hashnode is free, has a high-quality editor, supports custom domains, and its API returns structured JSON including title, slug, brief, cover image, tags, reading time, and full HTML body content — everything `BlogPage.jsx` needs.

Full fetch (render posts on the Neurospark domain) is preferred over link-out, to keep users on the domain for SEO purposes.

**Implementation:**
`src/api/hashnode.js` exports `fetchPosts` and `fetchPost`. `BlogPage.jsx` will be updated in v2.8 to call these functions on mount, replacing the static import from `src/data/blog.js`.

**Consequences:**
- Blog posts are live within seconds of publishing on Hashnode — zero redeploy needed
- `src/data/blog.js` deprecated after v2.8; kept in place until migration is verified
- `HASHNODE_HOST` must be set to the correct publication host before v2.8 ships

---

## ADR-013 — Formspree for Contact Form Email Delivery

**Date:** 2026-03-06
**Status:** Accepted

**Context:**
The contact form previously opened a `mailto:` link (which only works if the user has a mail client configured) or a pre-drafted WhatsApp message. Neither channel delivers form data reliably to a single monitored inbox. `RESEND_API_KEY` was documented in `.env.example` as a future backend option, but Resend requires a serverless function or backend — adding deployment complexity that is not yet warranted.

**Decision:**
Use Formspree (formspree.io) as a zero-backend form submission service. The form POSTs JSON to `https://formspree.io/f/{FORM_ID}`. Formspree delivers the submission to `pnyangwara@gmail.com`. Free tier allows 50 submissions/month — adequate for current volume.

**Alternatives considered:**
- `mailto:` link: Rejected — requires a configured mail client; unreliable on mobile
- Resend + serverless function: Deferred — correct upgrade path if volume exceeds 50/month, but adds infrastructure overhead today
- EmailJS: Rejected — exposes API keys in client bundle

**Consequences:**
- `FORMSPREE_ID` must be replaced with the real form ID from formspree.io before deployment
- WhatsApp preference path unchanged — still opens WhatsApp with a pre-drafted message
- If submissions exceed 50/month, upgrade path is Formspree Pro ($10/month) or migrate to Resend

---

## ADR-014 — Wordmark All-Gold, Uniform Weight

**Date:** 2026-03-06
**Status:** Accepted

**Context:**
The Wordmark component rendered "Neuro" and "Corporation" in `#0A1F44` (navy) and "spark" in gold. On dark backgrounds (`#06132C`), navy-on-near-navy made "Neuro" and "Corporation" invisible — effectively only "spark" was legible. This was reported as a dark mode regression. Additionally, the lighter font-weight on "Corporation" (300) created unnecessary visual hierarchy within the brand name.

**Decision:**
Render all three segments — "Neuro", "spark", "Corporation" — in `#C9A84C` (gold) at uniform weight 700. Gold holds on every background the site uses: light cream (`#FAFAF7`), navy (`#0A1F44`), and dark navy (`#06132C`). The `footer` prop is removed; it is no longer needed.

**Consequences:**
- Wordmark is legible in all contexts without conditional logic
- `footer` prop removed — any call sites passing `footer` prop are inert (React ignores unknown props on components, no error)
- Consistent brand identity across light, dark, and footer contexts

---

*Architecture decision records prepared with: Claude (Anthropic) — Sonnet 4.6*

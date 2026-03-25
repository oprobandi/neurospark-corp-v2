# Neurospark Corporation — Changelog

---

## v3.3.1 — 2026-03-25

### New Features

- **FAQPage (/faq)** — New dedicated FAQ page with accordion UI, organised into
  6 categories: Getting Started, How the Agents Work, Pricing & Contracts,
  Technical & Integrations, Data Privacy & Security, Results & Support.
  18 questions total. Schema.org FAQPage meta injected via useDocumentMeta
  for Google rich snippets.
  Added to NAV_MORE dropdown and mobile full-screen overlay.
  Bottom CTA links to /contact and /agents.

- **OG Image** — /public/og-image.jpg added (1200×630, 178 KB).
  og:image, og:image:width, og:image:height, and twitter:image meta tags
  updated in index.html. Previous value was /logo.jpg (incorrect for sharing).

### Updates

- **Testimonial avatars** — av2 and av3 URLs in constants.js updated to
  confirmed Black African professional portraits (Unsplash).
  ⚠ Visually verify av1/av2/av3 render correctly after first deploy.

- **Hero agents CTA** — Confirmed present since v3.0 ("See the Agents →" ghost
  button). No change required. Documented here for clarity.

### Route map (current)
  /                    → HomePage
  /agents              → AgentsPage
  /agents/:slug        → AgentDetailPage
  /platforms/hesabu    → HesabuPlatformPage
  /services            → ServicesPage
  /about               → AboutPage
  /blog                → BlogPage (list + single post)
  /projects            → ProjectsPage
  /contact             → ContactPage
  /faq                 → FAQPage (NEW)
  /privacy             → PrivacyPage
  /terms               → TermsPage
  *                    → NotFoundPage

---

## v3.3.0 — 2026-03-25

### Bug Fixes
- **BUG-08 (ServicesPage)** — Removed duplicate `dark` prop from sub-components
  FeatureGrid, ProcessTimeline, Deliverables, TechStack, ServiceFAQ.
  Convention: all components source `dark` from useTheme() directly. Never pass
  `dark` as a prop.

- **BUG-09 (AgentDetailPage)** — Removed rogue WAZO data block pasted after
  the component return statement. Caused "Expected ; but found :" parse error.
  WAZO confirmed correctly wired in src/data/agents.js.

### Navigation Redesign
- Primary nav: Home · About · Services · Contact (max 4)
- Home link added (was missing in all prior versions)
- "Let's Talk" CTA button removed — Contact link handles this
- More dropdown: Agents, Hesabu, Blog, Projects, Results

---

## v3.2.0 — 2026-03-25
- ServicesPage rebuilt with sub-components
- AgentDetailPage expanded with WAZO as 13th agent

## v3.1.0
- FONTS sourced from constants.js (BUG-06)
- useScrollTop added to AgentsPage, HesabuPlatformPage, NotFoundPage

## v3.0.0
- HesabuPlatformPage added (/platforms/hesabu)
- WAZO replaces SOKO on homepage agent preview
- Nav "More" dropdown introduced
- Hero dual CTA: primary + "See the Agents →" ghost button

## v2.x
- Multiple Footer iterations based on client feedback
- PrivacyPage and TermsPage placeholder pages
- Git remote URL fix; binary assets tracked via git add -f
- Google Business Profile setup for NeuroSpark Corporation

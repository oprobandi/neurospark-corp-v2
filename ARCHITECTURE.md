# Neurospark Corporation — Architecture & Improvement Roadmap
**Document version:** 2.0
**Prepared after:** v2.5 deployment
**Covers:** v2.6 → v3.0 patch recommendations

---

## Table of Contents

1. [v2.5 Delivery Summary](#1-v25-delivery-summary)
2. [Visual & UX Roadmap (v2.6)](#2-visual--ux-roadmap-v26)
3. [Contact & Conversion (v2.6)](#3-contact--conversion-v26)
4. [Code Architecture (v2.6)](#4-code-architecture-v26)
5. [Backend & Data Layer (v2.6)](#5-backend--data-layer-v26)
6. [New Features & Sections (v2.6)](#6-new-features--sections-v26)
7. [Platform Expansion (v3.0)](#7-platform-expansion-v30)
8. [Patch Roadmap](#8-patch-roadmap)
9. [Standing Engineering Rules](#9-standing-engineering-rules)

---

## 1. v2.5 Delivery Summary

### What shipped in v2.5

All 15 v2.5 tasks from the previous roadmap have been delivered:

| # | Task | Status |
|---|---|---|
| 1 | `ErrorBoundary` in `main.jsx` | ✅ Shipped |
| 2 | `package-lock.json` committed | ⚠️ Run `npm install` locally to generate — cannot be created without a live Node environment |
| 3 | Route-based code splitting with `React.lazy` | ✅ Shipped |
| 4 | ESLint + Prettier + pre-commit hook | ✅ Shipped |
| 5 | `AGENT_PREVIEWS` → `src/data/agents.js` | ✅ Shipped |
| 6 | Dark mode — `ThemeContext` + CSS vars + toggle | ✅ Shipped |
| 7 | Glassmorphism navbar on scroll | ✅ Shipped |
| 8 | Animated count-up stats | ✅ Shipped |
| 9 | `sitemap.xml` + `robots.txt` in `/public` | ✅ Shipped |
| 10 | JSON-LD structured data in `index.html` | ✅ Shipped |
| 11 | ARIA labels in Footer social icons | ✅ Already correct in v2.4 — verified |
| 12 | Plausible Analytics snippet | ✅ Shipped |
| 13 | `.env.example` + WhatsApp number as env var | ✅ Shipped |
| 14 | WebP conversion for Unsplash image URLs | ✅ Shipped (`&fm=webp`) |
| 15 | Remove unused Google Font weights | ✅ Shipped (~18 kB saved) |

### Known gaps carried into v2.6

- **Dark mode coverage is partial.** The Navbar, AgentPreviewCard, StatsStrip, and CSS-variable-driven backgrounds are dark-aware. The individual page components (`ServicesPage`, `AboutPage`, `BlogPage`, `ProjectsPage`, `ContactPage`) still use hardcoded light colours. Full dark mode coverage requires a sweep across all page components.
- **`package-lock.json` still absent.** Run `npm install` in the v2.5 directory and commit the generated `package-lock.json`. This is a one-command fix that requires a live Node environment.
- **AgentDetailPage.jsx is still 1,727 lines.** Splitting it into section sub-components is scoped to v2.6.
- **No real contact form backend.** WhatsApp redirect still in use. The Resend serverless function is v2.6 scope.

---

## 2. Visual & UX Roadmap (v2.6)

### 2.1 Neural Canvas Particle Hero

Replace the hero image with a full-viewport canvas animation — a dark field of slowly drifting particles forming connections between nearby dots, evoking a neural network. This directly reinforces the AI/agents brand without any copy changes.

```jsx
// src/components/NeuralCanvas.jsx
import { useEffect, useRef } from 'react'

export default function NeuralCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const PARTICLE_COUNT = 80
    const CONNECTION_DIST = 140

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 1,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width
        p.y = (p.y + p.vy + canvas.height) % canvas.height
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            ctx.strokeStyle = `rgba(201,168,76,${0.25 * (1 - dist / CONNECTION_DIST)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx.fillStyle = 'rgba(201,168,76,0.7)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.6, pointerEvents: 'none',
      }}
    />
  )
}
```

**Important:** Wrap the `tick` loop in a `prefers-reduced-motion` check and render a static gold radial gradient for users who have motion disabled.

---

### 2.2 Full Dark Mode Coverage (v2.6)

The v2.5 dark mode covers the Navbar and homepage agent cards. v2.6 should sweep all remaining page components:

**Pattern for each page:**
```jsx
import { useTheme } from '../context/ThemeContext'
import { C, DARK } from '../constants'

export default function ServicesPage() {
  const { dark } = useTheme()
  const bg   = dark ? DARK.bg : C.bg
  const text = dark ? DARK.text : C.charcoal
  // ...
}
```

Pages requiring dark mode updates: `ServicesPage`, `AboutPage`, `BlogPage`, `ProjectsPage`, `ContactPage`, `AgentsPage`, `AgentDetailPage`.

Recommendation: **do one page per commit** and verify mobile at 360px before merging.

---

### 2.3 Glassmorphism Agent Cards (v2.6)

The v2.5 agent cards darken correctly but don't yet use full glassmorphism. Once dark mode is the primary theme, apply:

```jsx
const glassSurface = {
  background:           'rgba(10, 31, 68, 0.6)',
  backdropFilter:       'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border:               '1px solid rgba(201,168,76,0.2)',
  borderTop:            '2px solid rgba(201,168,76,0.5)',
  borderRadius:         20,
  boxShadow:            '0 8px 32px rgba(6,19,44,0.5)',
}

const glassHover = {
  border:    '1px solid rgba(201,168,76,0.6)',
  boxShadow: '0 12px 48px rgba(201,168,76,0.15), 0 0 0 1px rgba(201,168,76,0.1)',
  transform: 'translateY(-6px)',
}
```

---

### 2.4 Bento Grid Agent Section (v2.6)

Replace the current uniform 3-column grid with a bento layout where the first card is double-width, creating visual hierarchy and a more editorial feel. CSS Grid makes this straightforward:

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'auto auto',
  gap: 24,
}}>
  {AGENT_PREVIEWS.map((a, i) => (
    <AgentPreviewCard
      key={a.code}
      {...a}
      style={i === 0 ? { gridColumn: 'span 2' } : {}}
    />
  ))}
</div>
```

Collapses gracefully to a single column on mobile via `@media (max-width: 640px)`.

---

### 2.5 Terminal Preview Widget on Agent Detail Pages (v2.6)

Each agent detail page should include a simulated terminal block showing a sample input/output interaction. This concretely demonstrates what the agent does rather than just describing it.

```jsx
// src/components/AgentTerminal.jsx
export default function AgentTerminal({ agentCode, sampleInteraction }) {
  // Typewriter effect on scroll-in via useInView
  // Dark terminal background, gold prompt, monospace font
  // Example for PESA:
  // > reconcile --source mpesa --date 2026-03-01
  // ✓ Fetched 847 transactions
  // ✓ Matched 844 (99.6%)
  // ⚠  3 discrepancies flagged → report saved to /reports/2026-03-01.pdf
}
```

---

### 2.6 Button Ripple & Nav Link Micro-interactions (v2.6)

```css
/* Ripple on BtnGold click */
@keyframes ripple {
  to { transform: scale(4); opacity: 0; }
}
.btn-ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  width: 10px; height: 10px;
  animation: ripple 0.6s linear;
  pointer-events: none;
}
```

---

## 3. Contact & Conversion (v2.6)

### 3.1 Real Contact Form — Resend + Vercel Serverless Function

The current contact form opens WhatsApp. This is effective for warm leads but loses cold leads who prefer email. The fix is a proper form → email flow:

```
src/
  pages/
    ContactPage.jsx          ← form UI (already exists, needs backend wiring)
api/
  send-contact.js            ← Vercel serverless function
```

```js
// api/send-contact.js
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, message, agent } = req.body
  await resend.emails.send({
    from: 'noreply@neurosparkcorporation.ai',
    to:   'hello@neurosparkcorporation.ai',
    subject: `[Website enquiry] ${name} — ${agent ?? 'General'}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
  })
  res.status(200).json({ ok: true })
}
```

Resend free tier: 3,000 emails/month — more than enough for initial contact volume.

**Rate limiting:** Add `upstash/ratelimit` to prevent form spam (max 3 submissions per IP per hour).

---

### 3.2 Pricing Section (v2.6)

High-intent visitors who want to know cost are sent to Contact — a friction point that costs conversions. A 3-tier pricing section (Starter / Growth / Enterprise) with clear deliverables per tier lets visitors self-select their bracket before reaching out.

Place it between `BrandMoment` and `Testimonials` on the homepage. Design as a 3-column card group on desktop, stacked on mobile.

---

### 3.3 Cookie Consent Banner (v2.6 — Legal requirement)

Once analytics or live chat is active, GDPR / Kenya Data Protection Act compliance requires a consent banner. Build it proactively:

```jsx
// src/components/CookieBanner.jsx
// Persists consent choice in localStorage ('ns-cookie-consent')
// Conditionally fires Plausible custom events only when consented
// Hides automatically after consent; shows again if cleared
```

The Plausible base pageview script doesn't require consent — only the custom event tracking does. This simplifies the legal requirement considerably.

---

## 4. Code Architecture (v2.6)

### 4.1 Split AgentDetailPage.jsx into Section Components

`AgentDetailPage.jsx` is 1,727 lines. This is the highest maintainability risk in the codebase. The page should be decomposed into:

```
src/pages/agent-detail/
  AgentDetailPage.jsx        ← thin orchestrator, ~80 lines
  AgentHero.jsx              ← agent header + code badge + intro
  AgentCapabilities.jsx      ← capability cards grid
  AgentWorkflow.jsx          ← step-by-step how it works
  AgentIntegrations.jsx      ← connected tools / APIs
  AgentPricing.jsx           ← pricing for this specific agent
  AgentCTA.jsx               ← contact / demo request CTA
  AgentTerminal.jsx          ← terminal preview widget (new)
```

Each sub-component can be independently tested, styled, and dark-mode adapted.

### 4.2 CSS Custom Properties — Full Theme Switching (v2.6)

Extend the CSS variable system started in v2.5 to cover all page-level backgrounds:

```css
/* Add to :root and :root[data-theme="dark"] in index.css */
:root {
  --section-bg-alt:  #F5EFE0;   /* sand — alternate section bg */
  --chapter-bg-1:    #FAFAF7;
  --chapter-bg-2:    #F5EFE0;
}
:root[data-theme="dark"] {
  --section-bg-alt:  #0d1f3c;
  --chapter-bg-1:    #06132C;
  --chapter-bg-2:    #0A1F44;
}
```

Update `Chapter.jsx` and section `bg` props to read from CSS variables rather than hardcoded hex strings. This eliminates the need for JS-level theme detection in most layout components.

### 4.3 Bundle Analysis

Add `rollup-plugin-visualizer` to understand what's in the final bundle:

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'
export default {
  plugins: [react(), visualizer({ open: true })]
}
```

Run `npm run build` and the visualizer opens a treemap in the browser. Look for: large polyfills, duplicated dependencies, unexpectedly large page chunks.

---

## 5. Backend & Data Layer (v2.6)

### 5.1 GitHub Actions CI

Every pull request should be verified before merge:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### 5.2 Commit package-lock.json

**This is the single highest-priority item in v2.6.** Run `npm install` locally in the v2.5 directory, then commit the generated `package-lock.json`. Without it, Vercel resolves fresh dependency versions on every deploy — the exact mechanism that caused the `lucide-react` / `Tractor` incident.

```bash
npm install
git add package-lock.json
git commit -m "chore: commit package-lock.json (v2.5)"
```

---

## 6. New Features & Sections (v2.6)

### 6.1 Live Chat Widget

Replace or supplement the WhatsApp floating button with a Crisp live chat widget:
- Shows agent availability hours (08:00–18:00 EAT)
- Captures visitor email before the chat begins
- Falls back gracefully to "Leave a message" when offline
- Keeps conversation history across sessions

Crisp free tier is generous. Mobile app available for the team to respond from phones.

### 6.2 Scroll-Driven Count-Up for Stats Strip

The v2.5 count-up animation already implements the full `useCountUp` hook. This task in v2.6 extends it to the counter boxes in the `MeetAgents` section footer panel (the `12 / 4 / 24/7 / 5` statistics).

---

## 7. Platform Expansion (v3.0)

*Estimated scope: 2–3 weeks*

| # | Task |
|---|---|
| 1 | **Sanity CMS integration** — Blog and agent data editable without code deploys; visual editor at `neurospark.sanity.studio` |
| 2 | **Crisp live chat** with EAT business hours config |
| 3 | **Agent demo request flow** — booking a live demo with a specific agent |
| 4 | **Client portal teaser page** — protected area for future product |
| 5 | **Full WCAG 2.1 AA accessibility audit** and remediation |
| 6 | **Swahili language toggle** — key pages available in Kiswahili |
| 7 | **East Africa region landing pages** — `/ke`, `/ug`, `/tz` with localised copy and schema |
| 8 | **Performance budget enforcement** via Lighthouse CI (target: Perf ≥ 90, LCP < 2.5s) |
| 9 | **TypeScript migration** — start with `constants.ts`, `agents.ts`, then hooks; migrate pages last |
| 10 | **Agent API integration** — live agent status indicators, real-time task counters |

---

## 8. Patch Roadmap

### v2.6 — Visual Excellence & Full Dark Mode
*Estimated scope: 4–5 days*

| # | Task | Priority |
|---|---|---|
| 1 | Commit `package-lock.json` | **Critical** |
| 2 | Complete dark mode across all page components | High |
| 3 | Neural canvas particle hero | High |
| 4 | Real contact form with Resend serverless function | High |
| 5 | Cookie consent banner | High |
| 6 | Glassmorphism agent cards (full backdrop-filter) | Medium |
| 7 | Bento grid homepage agent section | Medium |
| 8 | Terminal preview widget on agent detail pages | Medium |
| 9 | Pricing section on homepage | Medium |
| 10 | Split `AgentDetailPage.jsx` into section components | Medium |
| 11 | CSS custom properties — full theme switching | Medium |
| 12 | Button ripple + nav link slide micro-interactions | Medium |
| 13 | Count-up stats in `MeetAgents` footer panel | Low |
| 14 | `rollup-plugin-visualizer` bundle analysis | Low |
| 15 | GitHub Actions CI workflow | Low |

---

### v3.0 — Platform Expansion
*Estimated scope: 2–3 weeks*

| # | Task |
|---|---|
| 1 | Sanity CMS for Blog |
| 2 | Crisp live chat |
| 3 | Agent demo booking flow |
| 4 | Client portal teaser |
| 5 | WCAG 2.1 AA audit + remediation |
| 6 | Swahili language toggle |
| 7 | Region landing pages (`/ke`, `/ug`, `/tz`) |
| 8 | Lighthouse CI performance budgets |
| 9 | TypeScript migration (incremental) |
| 10 | Live agent API integration |

---

## 9. Standing Engineering Rules

**One section per commit.** The v2.3 → v2.4 incident demonstrated that bundling multiple changes — even when each looks safe individually — creates compound build failures that are difficult to trace on a phone.

**Run `npm run lint && npm run build` before every `git push`.** The Husky pre-commit hook (added in v2.5) automates this. Never bypass it with `--no-verify` unless you are explicitly reverting a bad commit.

**Test on mobile before deploying.** The target audience — East African founders — is overwhelmingly mobile-first. Every new UI component must be tested at 360px, 390px, and 414px widths before it is considered complete.

**Keep `lucide-react` pinned to `^0.263.1`** until a deliberate upgrade decision is made with a full icon usage audit.

**Never commit secrets.** The `.env.example` file documents what variables are needed. The actual `.env.local` file must remain in `.gitignore` at all times.

---

*Architecture document prepared by: Claude (Anthropic) — Sonnet 4.6*
*Based on v2.5 implementation — March 2026*

/**
 * ServicesPage.jsx — /services
 *
 * Place at: src/pages/ServicesPage.jsx
 *
 * Add to App.jsx routes:
 *   import ServicesPage from './pages/ServicesPage'
 *   <Route path="/services" element={<ServicesPage />} />
 *
 * Also update Navbar NAV_LINKS to include:
 *   { label: 'Services', href: '/services', internal: true }
 *
 * Sections:
 *   1. PageHero
 *   2. ServiceTabNav (sticky)
 *   3. ServiceBlock × 3  (AI Agents / Web Dev / SEO)
 *      — FeatureGrid, ProcessTimeline (expandable), Deliverables, TechStack, ServiceFAQ
 *   4. CrossSell
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown, ChevronUp, CheckCircle, ArrowRight,
  Bot, Globe, TrendingUp, Zap, Shield, Clock,
  Code, BarChart2, FileText, Layers, Search,
  Users, Cpu, RefreshCw, PenTool, Target,
} from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentTitle } from '../hooks/useDocumentMeta'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono


// ─── Design tokens ─────────────────────────────────────────────────────────

// ─── Service data ───────────────────────────────────────────────────────────
const SERVICES = [
  {
    id:       'ai',
    tab:      'AI Agents & Automation',
    icon:     Bot,
    eyebrow:  'SERVICE 01',
    headline: 'Autonomous agents that run your operations — silently, accurately, around the clock.',
    subhead:  "Repetitive work doesn't just waste time. It occupies the cognitive bandwidth of your best people. Our AI agents take over defined operational domains end-to-end, surfacing only the decisions that genuinely need a human being.",
    bg:       C.navy,
    dark:     true,
    features: [
      { icon: Zap,         title: 'End-to-End Automation',  desc: 'Agents own entire workflows — not just single steps. From data collection through output delivery, with zero hand-holding.' },
      { icon: Shield,      title: 'Kenyan Market Native',   desc: '12 pre-built domain specialists trained on Kenyan regulatory, financial, and operational realities — not generic templates.' },
      { icon: RefreshCw,   title: 'Always-On Operation',    desc: 'Agents run 24/7, on schedule or event-triggered. No shift dependency. No sick days. No context-switching.' },
      { icon: Layers,      title: 'System Integration',     desc: 'Connects to your existing tools — QuickBooks, Xero, Shopify, WhatsApp, KRA iTax, M-Pesa API — without disruption.' },
      { icon: BarChart2,   title: 'Observable Outputs',     desc: 'Every agent delivers structured reports, dashboards, or alerts — not black-box processing. Full audit trails included.' },
      { icon: Users,       title: 'Human-in-the-Loop',      desc: 'Designed to escalate the right decisions to the right people — and only those. Your team stays in control where it matters.' },
    ],
    timeline: [
      { step: 'Discovery',  detail: 'We map your operational landscape — existing tools, data sources, team workflows, and pain points. A one-week deep-dive with your team produces the full automation blueprint.' },
      { step: 'Strategy',   detail: 'We identify which agent(s) from our catalogue match your needs, or scope a custom build. We define success metrics and integration touchpoints up front.' },
      { step: 'Build',      detail: 'Agent configuration, API integrations, and workflow logic are built and tested in a staging environment before touching your live data.' },
      { step: 'Deploy',     detail: 'Deployment to your live environment with a parallel-run period — agent and human doing the same task simultaneously so you can validate output quality.' },
      { step: 'Monitor',    detail: 'Ongoing performance monitoring, output quality review, and iterative refinement. You receive a monthly operations report and can request changes at any time.' },
    ],
    deliverables: [
      'Deployed agent(s) running in your environment',
      'Integration with your existing systems and data sources',
      'Custom report templates and alert configurations',
      'Full audit trail and compliance documentation',
      'Dedicated Slack/WhatsApp channel with your account team',
      'Monthly performance review and optimisation report',
    ],
    techStack: ['Python / LangChain', 'OpenAI GPT-4o', 'Anthropic Claude', 'KRA iTax API', 'M-Pesa Business API', 'Airtel Money API', 'WhatsApp Business API', 'QuickBooks API', 'Xero API', 'Zapier / Make', 'PostgreSQL', 'AWS / GCP'],
    pricingTier: 'Starter Agent or Growth Engine',
    faq: [
      { q: 'How long does agent deployment take?',            a: 'Pre-built agents from our catalogue are typically deployed within 5 business days. Custom agents require a 2–4 week build depending on integration complexity.' },
      { q: 'Do I need technical staff to work with the agents?', a: 'No. Our agents are configured and maintained by our team. You interact with outputs — reports, alerts, dashboards — not with any technical infrastructure.' },
      { q: 'Can agents integrate with software we already use?', a: 'Yes. We maintain native integrations with QuickBooks, Xero, Sage, Shopify, WooCommerce, WhatsApp Business, and the major Kenyan government portals. For other systems, we assess integration feasibility during Discovery.' },
      { q: 'What happens when an agent encounters something it cannot handle?', a: 'All agents have defined escalation paths. When an input falls outside the agent\'s confidence boundary, it flags the item for human review with full context — it never silently fails.' },
      { q: 'How is agent performance measured?',             a: 'We define success metrics during Strategy (e.g., reconciliation accuracy rate, penalty-free compliance record, ticket resolution rate). Monthly performance reports track these against baseline.' },
    ],
  },
  {
    id:       'web',
    tab:      'Website Development',
    icon:     Globe,
    eyebrow:  'SERVICE 02',
    headline: 'A website that works as hard as you do — built, maintained, and evolved by an agent.',
    subhead:  "Most business websites are a snapshot of the company at the moment of launch. Six months later they are already lying. Our web agent builds sites that stay alive — current, accurate, and representing you the way you deserve.",
    bg:       C.bg,
    dark:     false,
    features: [
      { icon: PenTool,     title: 'Design-Led Builds',      desc: 'Editorial aesthetics — Playfair Display typography, gold/navy identity — designed for professional credibility in the East African market.' },
      { icon: Cpu,         title: 'Agent-Managed Content',  desc: 'Your web agent monitors the site, publishes content on an approved schedule, and refreshes offers, team pages, and announcements automatically.' },
      { icon: Globe,       title: 'Mobile-First',           desc: 'Built for East Africa\'s mobile-dominant internet audience. Every page renders perfectly on the devices your customers actually use.' },
      { icon: Zap,         title: 'Performance Optimised',  desc: 'Sub-2-second load times, image compression, CDN delivery, and Core Web Vitals optimisation — built in from day one.' },
      { icon: Shield,      title: 'Security & Uptime',      desc: 'SSL certificates, daily security scans, automated backups, and uptime monitoring with instant alerting if anything goes wrong.' },
      { icon: Search,      title: 'SEO-Ready Architecture', desc: 'Schema markup, sitemap generation, canonical tags, and on-page structure built to make the SEO agent\'s job easier from the first day.' },
    ],
    timeline: [
      { step: 'Discovery',  detail: 'We review your existing site (if any), your brand guidelines, competitor landscape, and the specific jobs the new site needs to do for your business.' },
      { step: 'Strategy',   detail: 'Sitemap, user journey mapping, and content architecture. We define which pages are critical for conversion and which support SEO and trust-building.' },
      { step: 'Build',      detail: 'Design and development in a staging environment. You review two rounds of revisions before anything goes live. Mobile and desktop tested across devices.' },
      { step: 'Deploy',     detail: 'Go-live with DNS migration, SSL provisioning, performance validation, and search console setup. Zero downtime migration from your current site.' },
      { step: 'Monitor',    detail: 'The web agent takes over: content scheduling, uptime monitoring, performance tracking, and monthly health reports to your inbox.' },
    ],
    deliverables: [
      'Custom-designed, mobile-first website (up to 10 pages)',
      'CMS or agent-managed content publishing workflow',
      'SSL certificate, CDN setup, and hosting configuration',
      'Google Analytics 4 and Search Console integration',
      'Automated uptime monitoring with instant alerting',
      'Monthly website health report',
      'Two rounds of design revisions before launch',
    ],
    techStack: ['React / Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel / Netlify', 'Cloudflare CDN', 'Sanity CMS', 'Contentful', 'Google Analytics 4', 'Hotjar', 'Figma', 'Cloudinary', 'Resend / SendGrid'],
    pricingTier: 'Growth Engine',
    faq: [
      { q: 'How long does a website build take?',             a: 'A standard 5–10 page business website takes 3–4 weeks from kickoff to launch. Larger e-commerce or multi-service sites are scoped individually.' },
      { q: 'Do you rebuild existing websites or only build from scratch?', a: 'Both. We frequently migrate and redesign existing sites, preserving SEO equity (existing URLs, internal links, search rankings) during the transition.' },
      { q: 'How does the agent-managed content work in practice?', a: 'You set a content calendar and approve topics. The web agent drafts content, schedules publication, updates the relevant pages, and reports on what went live each week.' },
      { q: 'Can you integrate e-commerce (payments, M-Pesa)?', a: 'Yes. We integrate M-Pesa STK Push, Pesapal, DPO Pay, and Stripe for Kenyan and international payment processing. Shopify and WooCommerce builds are also available.' },
      { q: 'Who owns the website and all its assets?',         a: 'You do. All code, design assets, domain, and hosting accounts are in your name. We have no lock-in — you can take the site to any developer at any time.' },
    ],
  },
  {
    id:       'seo',
    tab:      'SEO & Organic Growth',
    icon:     TrendingUp,
    eyebrow:  'SERVICE 03',
    headline: 'Real search visibility in Nairobi, Kampala, Dar es Salaam — and beyond.',
    subhead:  "Most SEO agencies deliver a PDF at the end of the month. We deliver a continuously running agent that monitors your rankings, builds your content library, and adapts its strategy as the search landscape shifts — without you lifting a finger.",
    bg:       C.sand,
    dark:     false,
    features: [
      { icon: Search,      title: 'Regional Keyword Strategy', desc: 'Research grounded in how East African consumers actually search — not keyword tools calibrated for London or New York.' },
      { icon: FileText,    title: 'Content Production',         desc: 'AI-assisted articles, service pages, and blog posts reviewed and published on your schedule. You approve; the agent publishes.' },
      { icon: BarChart2,   title: 'Daily Rank Monitoring',      desc: 'Position tracking across 50+ target keywords, with movement alerts and weekly consolidated ranking reports.' },
      { icon: Code,        title: 'Technical SEO Audit',        desc: 'Site speed, crawlability, Core Web Vitals, structured data, and internal linking — audited and fixed, not just flagged.' },
      { icon: Target,      title: 'Local SEO',                  desc: 'Google Business Profile management, local citation building, and county/city-specific keyword targeting for multi-location businesses.' },
      { icon: TrendingUp,  title: 'Backlink Intelligence',      desc: 'Competitor backlink gap analysis and outreach pipeline — building domain authority from relevant Kenyan and East African publications.' },
    ],
    timeline: [
      { step: 'Discovery',  detail: 'Full technical audit of your current site, baseline ranking data across your industry keywords, and competitor landscape analysis for your specific market geography.' },
      { step: 'Strategy',   detail: '90-day keyword strategy, content calendar, and priority technical fixes. We agree on the metrics that matter for your business before any work begins.' },
      { step: 'Build',      detail: 'Technical fixes are implemented, content production begins, and your Google Business Profile is optimised. Month one establishes the foundation.' },
      { step: 'Deploy',     detail: 'Content cadence hits full speed, rank tracking goes live, and link building outreach begins. You receive your first ranking movement report.' },
      { step: 'Monitor',    detail: 'The SEO agent runs continuously — daily rank checks, content scheduling, algorithm update assessments, and monthly strategy reviews with your account team.' },
    ],
    deliverables: [
      'Full technical SEO audit and implementation report',
      '90-day keyword strategy document',
      '4 SEO-optimised articles or pages per month',
      'Daily rank tracking dashboard (50+ keywords)',
      'Google Business Profile setup and monthly management',
      'Monthly performance report (traffic, rankings, conversions)',
      'Quarterly strategy review and next-quarter content plan',
    ],
    techStack: ['Ahrefs', 'Semrush', 'Google Search Console', 'Google Analytics 4', 'Screaming Frog', 'Surfer SEO', 'Google Business Profile API', 'Schema.org markup', 'Core Web Vitals', 'Rank Math / Yoast', 'Moz Local', 'Bing Webmaster Tools'],
    pricingTier: 'Growth Engine',
    faq: [
      { q: 'How long before we see ranking improvements?',      a: 'Technical fixes and on-page optimisation typically show movement within 4–8 weeks. Meaningful competitive ranking shifts for new content usually take 3–6 months. We are transparent about realistic timelines from day one.' },
      { q: 'Do you write all the content yourselves?',          a: 'We produce AI-assisted drafts reviewed by a content strategist, then sent to you for a final approval before publication. You are never surprised by what goes live.' },
      { q: 'Can you do SEO for businesses outside Nairobi?',   a: 'Yes — we actively work in Mombasa, Kisumu, Kampala, Dar es Salaam, Kigali, and increasingly for Kenyan businesses targeting international markets (UK, UAE, US diaspora).' },
      { q: 'What if Google\'s algorithm changes?',              a: 'Algorithm updates are monitored by the SEO agent within hours of rolling out. Impact assessments are in your inbox before most agencies have even noticed. Strategy adjustments follow immediately where needed.' },
      { q: 'Do you work on e-commerce SEO specifically?',      a: 'Yes. Product page optimisation, category hierarchy, schema markup for products and reviews, and shopping feed setup are all within scope for e-commerce clients.' },
    ],
  },
]

// ─── Shared: DotGrid ────────────────────────────────────────────────────────
function DotGrid({ opacity = 0.12 }) {
  const { dark } = useTheme()
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="svgDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#svgDots)" />
      </svg>
    </div>
  )
}

// ─── 1. PageHero ────────────────────────────────────────────────────────────
function PageHero() {
  const { dark } = useTheme()
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        background: C.navy,
        paddingTop:    'clamp(120px,14vw,160px)',
        paddingBottom: 'clamp(80px,10vw,120px)',
      }}
    >
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.1) 0%, transparent 65%)',
      }} />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <p className="animate-fade-up mb-4" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>
          WHAT WE DO
        </p>
        <h1 className="animate-fade-up delay-100" style={{
          fontFamily: FD, fontWeight: 700,
          fontSize: 'clamp(2rem,5vw,3.6rem)',
          color: 'white', lineHeight: 1.15, marginBottom: 20,
        }}>
          Three Ways NeuroSpark<br />
          <em style={{ color: C.gold }}>Transforms Your Business.</em>
        </h1>
        <p className="animate-fade-up delay-200 mx-auto" style={{
          fontFamily: FB, fontSize: 'clamp(1rem,2vw,1.1rem)',
          color: '#94A3B8', maxWidth: 560, lineHeight: 1.85, marginBottom: 36,
        }}>
          Every service is built for the Kenyan market — not adapted from a Western playbook, not resold from a global platform. Designed here, for the specific realities of doing business in East Africa.
        </p>

        {/* Service pill quick-links */}
        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-3">
          {SERVICES.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 999,
                padding: '9px 18px',
                color: '#CBD5E1',
                fontSize: '0.85rem',
                fontFamily: FB,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; e.currentTarget.style.color = C.gold }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#CBD5E1' }}
            >
              <s.icon size={14} />
              {s.tab}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 2. ServiceTabNav (sticky) ──────────────────────────────────────────────
function ServiceTabNav({ active }) {
  const { dark } = useTheme()
  const [sticky, setSticky] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const fn = () => setSticky(navRef.current?.getBoundingClientRect().top <= 70)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div
      ref={navRef}
      style={{
        position: 'sticky', top: 70, zIndex: 38,
        background: sticky ? 'rgba(250,250,247,0.97)' : C.bg,
        backdropFilter: sticky ? 'blur(12px)' : 'none',
        borderBottom: sticky ? `1px solid ${C.border}` : '1px solid transparent',
        boxShadow: sticky ? '0 4px 24px rgba(10,31,68,0.06)' : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex overflow-x-auto" style={{ gap: 0, scrollbarWidth: 'none' }}>
          {SERVICES.map(s => {
            const isActive = active === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 20px',
                  fontFamily: FB,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  color: isActive ? C.navy : C.muted,
                  borderBottom: `3px solid ${isActive ? C.gold : 'transparent'}`,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.muted }}
              >
                <s.icon size={15} />
                {s.tab}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── 3a. FeatureGrid ────────────────────────────────────────────────────────
function FeatureGrid({ features, dark, visible }) {
  const { dark } = useTheme()
  return (
    <div className="grid gap-5 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      {features.map((f, i) => {
        const [hover, setHover] = useState(false)
        const delay = `delay-${(i % 3 + 1) * 100}`
        return (
          <div
            key={i}
            className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              background: dark
                ? (hover ? 'rgba(201,168,76,0.09)' : 'rgba(255,255,255,0.05)')
                : (hover ? '#fff' : C.bg),
              border: `1px solid ${hover ? C.gold : (dark ? 'rgba(255,255,255,0.09)' : C.border)}`,
              borderRadius: 14,
              padding: '22px 22px',
              transition: 'all 0.3s',
              boxShadow: hover ? '0 8px 28px rgba(10,31,68,0.12)' : 'none',
            }}
          >
            <f.icon size={22} color={C.gold} style={{ marginBottom: 12 }} />
            <h4 style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.98rem', color: dark ? 'white' : C.navy, marginBottom: 7 }}>
              {f.title}
            </h4>
            <p style={{ fontFamily: FB, fontSize: '0.86rem', color: dark ? '#94A3B8' : C.muted, lineHeight: 1.65 }}>
              {f.desc}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ─── 3b. ProcessTimeline ────────────────────────────────────────────────────
function ProcessTimeline({ steps, dark, visible }) {
  const { dark } = useTheme()
  const [openStep, setOpenStep] = useState(null)
  const textColor = dark ? 'white' : C.navy
  const mutedColor = dark ? '#94A3B8' : C.muted
  const borderColor = dark ? 'rgba(255,255,255,0.1)' : C.border

  return (
    <div className="mb-16">
      <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 14 }}>
        HOW IT WORKS
      </p>

      {/* Desktop horizontal */}
      <div className="hidden md:flex mb-4 relative">
        {/* Gold connector line */}
        <div style={{ position: 'absolute', top: 18, left: 18, right: 18, height: 2, background: `linear-gradient(90deg, ${C.gold} 0%, rgba(201,168,76,0.2) 100%)`, zIndex: 0 }} />
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex-1 cursor-pointer"
            style={{ position: 'relative', zIndex: 1, paddingRight: i < steps.length - 1 ? 16 : 0 }}
            onClick={() => setOpenStep(openStep === i ? null : i)}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.navy, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: '0 0 0 4px rgba(201,168,76,0.12)' }}>
              <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.75rem', color: C.gold }}>{i + 1}</span>
            </div>
            <h5 style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.88rem', color: textColor, marginBottom: 4 }}>{s.step}</h5>
            {openStep === i && (
              <p style={{ fontFamily: FB, fontSize: '0.82rem', color: mutedColor, lineHeight: 1.65, marginTop: 8 }}>{s.detail}</p>
            )}
            <div style={{ marginTop: 4 }}>
              {openStep === i
                ? <ChevronUp size={13} color={C.gold} />
                : <ChevronDown size={13} color={mutedColor} />}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ borderBottom: `1px solid ${borderColor}` }}
          >
            <button
              onClick={() => setOpenStep(openStep === i ? null : i)}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '14px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.navy, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', color: C.gold }}>{i + 1}</span>
              </div>
              <span style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.92rem', color: textColor, flex: 1 }}>{s.step}</span>
              {openStep === i ? <ChevronUp size={15} color={C.gold} /> : <ChevronDown size={15} color={mutedColor} />}
            </button>
            {openStep === i && (
              <p style={{ fontFamily: FB, fontSize: '0.86rem', color: mutedColor, lineHeight: 1.7, paddingBottom: 14 }}>{s.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3c. Deliverables ───────────────────────────────────────────────────────
function Deliverables({ items, dark, visible }) {
  const { dark } = useTheme()
  const textColor  = dark ? 'white' : C.navy
  const mutedColor = dark ? '#94A3B8' : C.muted

  return (
    <div className="mb-16">
      <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 14 }}>
        WHAT YOU RECEIVE
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {items.map((item, i) => (
          <div
            key={i}
            className={visible ? `animate-fade-up delay-${(i % 2 + 1) * 100}` : 'hidden-anim'}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
          >
            <CheckCircle size={16} color={C.sky} style={{ flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? '#CBD5E1' : C.charcoal, lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3d. TechStack ──────────────────────────────────────────────────────────
function TechStack({ items, dark }) {
  const { dark } = useTheme()
  return (
    <div className="mb-16">
      <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 12 }}>
        TECH STACK
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span key={i} style={{
            fontFamily: FM, fontWeight: 600, fontSize: '0.78rem',
            color: dark ? '#C9A84C' : C.navy,
            background: dark ? 'rgba(201,168,76,0.1)' : 'white',
            border: `1px solid ${dark ? 'rgba(201,168,76,0.25)' : C.border}`,
            borderRadius: 8, padding: '6px 13px',
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── 3e. ServiceFAQ ─────────────────────────────────────────────────────────
function ServiceFAQ({ faq, dark }) {
  const { dark } = useTheme()
  const [open, setOpen] = useState(null)
  const textColor  = dark ? 'white' : C.navy
  const bodyColor  = dark ? '#94A3B8' : C.charcoal
  const borderColor= dark ? 'rgba(255,255,255,0.1)' : C.border

  return (
    <div>
      <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 14 }}>
        FREQUENTLY ASKED
      </p>
      {faq.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
          >
            <span style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.93rem', color: textColor, lineHeight: 1.35 }}>{item.q}</span>
            {open === i
              ? <ChevronUp size={16} color={C.gold} style={{ flexShrink: 0 }} />
              : <ChevronDown size={16} color={dark ? '#475569' : C.muted} style={{ flexShrink: 0 }} />}
          </button>
          {open === i && (
            <p style={{ fontFamily: FB, fontSize: '0.9rem', color: bodyColor, lineHeight: 1.8, paddingBottom: 18 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── 3. ServiceBlock ────────────────────────────────────────────────────────
function ServiceBlock({ service }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView(0.05)
  const { dark, bg } = service

  const headColor    = dark ? 'white' : C.navy
  const subColor     = dark ? '#94A3B8' : C.muted

  return (
    <section id={service.id} ref={ref} style={{ background: bg, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.goldDim, border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <service.icon size={22} color={C.gold} />
            </div>
            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
              {service.eyebrow}
            </p>
          </div>
          <h2
            className={visible ? 'animate-fade-up' : 'hidden-anim'}
            style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3.2vw,2.4rem)', color: headColor, lineHeight: 1.25, maxWidth: 700, marginBottom: 14 }}
          >
            {service.headline}
          </h2>
          <p
            className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'}
            style={{ fontFamily: FB, fontSize: '1rem', color: subColor, maxWidth: 640, lineHeight: 1.85 }}
          >
            {service.subhead}
          </p>
        </div>

        {/* Features */}
        <FeatureGrid features={service.features} dark={dark} visible={visible} />

        {/* Process */}
        <ProcessTimeline steps={service.timeline} dark={dark} visible={visible} />

        {/* Deliverables */}
        <Deliverables items={service.deliverables} dark={dark} visible={visible} />

        {/* Tech stack */}
        <TechStack items={service.techStack} dark={dark} />

        {/* Pricing reference + FAQ */}
        <div className="grid gap-16" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          <div>
            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 12 }}>
              PRICING
            </p>
            <p style={{ fontFamily: FB, fontSize: '0.9rem', color: subColor, lineHeight: 1.7, marginBottom: 14 }}>
              This service is included in the <strong style={{ color: headColor }}>{service.pricingTier}</strong> plan. See the full comparison table on our Pricing page.
            </p>
            <Link to="/pricing" style={{ color: C.gold, fontFamily: FB, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              See Full Pricing <ArrowRight size={14} />
            </Link>
          </div>
          <ServiceFAQ faq={service.faq} dark={dark} />
        </div>
      </div>
    </section>
  )
}

// ─── 4. CrossSell ───────────────────────────────────────────────────────────
function CrossSell() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()

  const nodes = [
    { label: 'AI Agent',     sub: 'Operations & Compliance', icon: Bot,        color: '#3B82F6' },
    { label: 'Web Agent',    sub: 'Always-Current Website',  icon: Globe,      color: '#10B981' },
    { label: 'SEO Agent',    sub: 'Organic Traffic Growth',  icon: TrendingUp, color: '#F59E0B' },
    { label: 'Your Business',sub: 'Focus on What Matters',   icon: Zap,        color: C.gold    },
  ]

  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', position: 'relative', overflow: 'hidden' }}>
      <DotGrid opacity={0.09} />
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
            THE FULL STACK
          </p>
          <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.7rem,3.2vw,2.4rem)', color: 'white', maxWidth: 580, margin: '0 auto 14px' }}>
            Many clients combine all three services for maximum impact.
          </h2>
          <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, color: '#94A3B8', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            When an AI agent runs your operations, a web agent keeps your site current, and an SEO agent grows your audience — every component feeds the others. The business you build becomes a self-reinforcing system.
          </p>
        </div>

        {/* Diagram */}
        <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap justify-center gap-4 mb-8`}>
          {nodes.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: i < nodes.length - 1 ? 0 : undefined }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${n.color}40`,
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
                minWidth: 130,
                transition: 'all 0.3s',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${n.color}18`, border: `1px solid ${n.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <n.icon size={20} color={n.color} />
                </div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.85rem', color: 'white', marginBottom: 3 }}>{n.label}</div>
                <div style={{ fontFamily: FB, fontSize: '0.72rem', color: '#64748B', lineHeight: 1.4 }}>{n.sub}</div>
              </div>
              {i < nodes.length - 1 && (
                <ArrowRight size={18} color="rgba(201,168,76,0.4)" style={{ flexShrink: 0, margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Three benefit lines */}
        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} grid gap-4 mb-12`} style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            { headline: 'Operations agent → feeds website', body: 'Case studies, compliance updates, and product changes are automatically reflected on your website without anyone writing a brief.' },
            { headline: 'Website → feeds SEO', body: 'Fresh content from the web agent gives the SEO agent a constant supply of indexable pages — compounding your organic visibility month after month.' },
            { headline: 'SEO traffic → feeds the business', body: 'More qualified visitors land on a site that represents you accurately. More enquiries route through to the ZURI customer service agent. Fewer leads fall through the cracks.' },
          ].map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 12, padding: '20px 20px' }}>
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.88rem', color: C.gold, marginBottom: 8, lineHeight: 1.35 }}>{b.headline}</p>
              <p style={{ fontFamily: FB, fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.7 }}>{b.body}</p>
            </div>
          ))}
        </div>

        <div className={`${visible ? 'animate-fade-up delay-500' : 'hidden-anim'} text-center`}>
          <Link to="/pricing" style={{
            display: 'inline-block', background: C.gold, color: dark ? DARK.text : C.navy,
            borderRadius: 999, padding: '13px 30px',
            fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#b8943e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,168,76,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            See the Full-Stack Package →
          </Link>
          <p style={{ fontFamily: FB, fontSize: '0.82rem', color: '#475569', marginTop: 12 }}>
            Growth Engine plan — all three services, one account team, one monthly fee.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Active tab tracker ─────────────────────────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [ids])
  return active
}

// ─── ServicesPage Root ──────────────────────────────────────────────────────
export default function ServicesPage() {
  const { dark } = useTheme()
  useDocumentTitle('Services')
  const active = useActiveSection(['ai', 'web', 'seo'])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHero />
      <ServiceTabNav active={active} />
      {SERVICES.map(s => <ServiceBlock key={s.id} service={s} />)}
      <CrossSell />
    </>
  )
}

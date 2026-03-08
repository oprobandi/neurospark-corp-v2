/**
 * App.jsx — Neurospark Corporation  v2.5
 *
 * Changes from v2.4:
 *   • All page imports converted to React.lazy + Suspense (route-level code splitting)
 *   • AGENT_PREVIEWS removed — imported from src/data/agents.js (single source of truth)
 *   • Dark mode toggle added to Navbar (reads/writes via ThemeContext)
 *   • Navbar glassmorphism effect on scroll (backdrop-filter blur)
 *   • Agent preview cards updated to respond to dark/light theme
 *
 * Route map:
 *   /               → HomePage
 *   /agents         → AgentsPage
 *   /agents/:slug   → AgentDetailPage
 *   /services       → ServicesPage
 *   /about          → AboutPage
 *   /blog           → BlogPage (list)
 *   /blog/:slug     → BlogPage (single post)
 *   /projects       → ProjectsPage
 *   /contact        → ContactPage
 *   /privacy        → PrivacyPage
 *   /terms          → TermsPage
 *   *               → NotFoundPage
 */

import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, X, ArrowRight, ChevronDown, Sun, Moon } from 'lucide-react'

// ─── Shared components (always in main bundle) ────────────────────────────────
import Hero           from './components/Hero'
import StatsStrip     from './components/StatsStrip'
import Chapter        from './components/Chapter'
import BrandMoment    from './components/BrandMoment'
import Testimonials   from './components/Testimonials'
import FinalCTA       from './components/FinalCTA'
import Footer         from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import Wordmark       from './components/ui/Wordmark'
import { BtnGold, BtnGoldLink } from './components/ui/Buttons'
import Eyebrow        from './components/ui/Eyebrow'
import { useInView }  from './hooks/useInView'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { IMAGES, C, DARK } from './constants'
import { useTheme }   from './context/ThemeContext'
import { AGENT_PREVIEWS } from './data/agents'

// ─── Pages (lazy-loaded — each becomes its own JS chunk) ─────────────────────
// This reduces the initial bundle size significantly.
// Heavy pages like AgentDetailPage (1,727 lines) are only fetched when visited.
const AgentsPage      = lazy(() => import('./pages/AgentsPage'))
const AgentDetailPage = lazy(() => import('./pages/AgentDetailPage'))
const ServicesPage    = lazy(() => import('./pages/ServicesPage'))
const AboutPage       = lazy(() => import('./pages/AboutPage'))
const BlogPage        = lazy(() => import('./pages/BlogPage'))
const ProjectsPage    = lazy(() => import('./pages/ProjectsPage'))
const ContactPage     = lazy(() => import('./pages/ContactPage'))
const PrivacyPage     = lazy(() => import('./pages/PrivacyPage'))
const TermsPage       = lazy(() => import('./pages/TermsPage'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'))

// ─── Suspense fallback ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(201,168,76,0.2)',
          borderTopColor: '#C9A84C',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: "'DM Sans',sans-serif" }}>Loading…</p>
      </div>
    </div>
  )
}

// ─── Design tokens ───────────────────────────────────────────────────────────
const FONT_DISPLAY = "'Playfair Display', serif"
const FONT_BODY    = "'DM Sans', sans-serif"

// ─── useScrollNav ─────────────────────────────────────────────────────────────
// Smooth-scrolls to a section id if already on /.
// From any other page: navigates to /?scroll=<id>, HomePage handles the scroll.
function useScrollNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return function scrollNav(sectionId) {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/?scroll=${sectionId}`)
    }
  }
}

// ─── Nav config ──────────────────────────────────────────────────────────────
// type: 'route'  → react-router Link
//       'scroll' → useScrollNav (homepage section)
//       'page'   → <a href> for external
const NAV_PRIMARY = [
  { label: 'Home',     type: 'route',  href: '/'         },
  { label: 'Agents',   type: 'route',  href: '/agents'   },
  { label: 'Services', type: 'route',  href: '/services' },
  { label: 'Results',  type: 'scroll', href: 'results'   },
]
const NAV_MORE = [
  { label: 'About',    type: 'route',  href: '/about'    },
  { label: 'Blog',     type: 'route',  href: '/blog'     },
  { label: 'Projects', type: 'route',  href: '/projects' },
  { label: 'Contact',  type: 'route',  href: '/contact'  },
]
const NAV_ALL = [...NAV_PRIMARY, ...NAV_MORE]

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [moreOpen,  setMoreOpen]  = useState(false)
  const [popAnim,   setPopAnim]   = useState(false)
  const location   = useLocation()
  const scrollNav  = useScrollNav()
  const { dark, toggleTheme } = useTheme()

  const T = dark ? DARK : { bg: C.bg, surface: 'white', text: C.charcoal, muted: C.muted, border: C.border }

  function handleToggleTheme() {
    setPopAnim(true)
    toggleTheme()
    setTimeout(() => setPopAnim(false), 350)
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
    setMoreOpen(false)
  }, [location])

  useEffect(() => {
    if (!moreOpen) return
    const close = () => setMoreOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [moreOpen])

  function renderLink(l, className, styleOverride) {
    const active  = l.type === 'route' && location.pathname === l.href
    const baseClr = active ? C.gold : (styleOverride?.color ?? T.text)
    const style   = {
      fontFamily: FONT_BODY,
      color: baseClr,
      fontWeight: active ? 600 : 400,
      ...styleOverride,
    }

    if (l.type === 'scroll') {
      return (
        <button
          key={l.label}
          onClick={() => scrollNav(l.href)}
          className={className}
          style={{ ...style, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {l.label}
        </button>
      )
    }
    return (
      <Link key={l.href} to={l.href} className={className} style={style}>
        {l.label}
      </Link>
    )
  }

  // Desktop link with underline active indicator
  function desktopLink(l) {
    const active = l.type === 'route' && location.pathname === l.href
    return renderLink(l, 'nav-link ml-7 no-underline text-[0.95rem]', {
      borderBottom: `2px solid ${active ? C.gold : 'transparent'}`,
      paddingBottom: 2,
      transition: 'color 0.3s, border-color 0.3s',
    })
  }

  // Mobile overlay link
  function mobileLink(l, i) {
    const active = l.type === 'route' && location.pathname === l.href
    const sharedStyle = {
      fontFamily: FONT_DISPLAY,
      fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
      color: active ? C.gold : 'white',
      opacity: menuOpen ? 1 : 0,
      transition: `opacity 0.4s ease ${i * 0.055}s`,
      display: 'block', textAlign: 'center', width: '100%', textDecoration: 'none',
    }

    if (l.type === 'scroll') {
      return (
        <button
          key={l.label}
          onClick={() => { scrollNav(l.href); setMenuOpen(false) }}
          style={{ ...sharedStyle, background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0' }}
        >
          {l.label}
        </button>
      )
    }
    return (
      <Link
        key={l.href}
        to={l.href}
        onClick={() => setMenuOpen(false)}
        style={{ ...sharedStyle, padding: '12px 0' }}
      >
        {l.label}
      </Link>
    )
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300${scrolled ? ' navbar-glass' : ''}`}
        style={!scrolled ? { background: T.bg, borderBottom: '1px solid transparent' } : {}}
      >
        <div className="max-w-[1100px] mx-auto px-6 h-[70px] flex items-center justify-between">
          <Link to="/" className="no-underline"><Wordmark /></Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center">
            {NAV_PRIMARY.map(desktopLink)}

            {/* More dropdown */}
            <div className="relative ml-7" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setMoreOpen(o => !o)}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[0.95rem]"
                style={{ fontFamily: FONT_BODY, color: T.text, padding: '2px 0' }}
              >
                More
                <ChevronDown
                  size={14}
                  style={{ marginTop: 1, transition: 'transform 0.2s', transform: moreOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>

              {moreOpen && (
                <div
                  className="absolute right-0 top-full mt-3 rounded-xl py-2 min-w-[160px]"
                  style={{ background: T.surface ?? 'white', border: `1px solid ${T.border}`, boxShadow: '0 8px 32px rgba(10,31,68,0.18)' }}
                >
                  {NAV_MORE.map(l => {
                    const active = l.type === 'route' && location.pathname === l.href
                    return (
                      <Link
                        key={l.href}
                        to={l.href}
                        className="no-underline block"
                      >
                        <span style={{
                          fontFamily: FONT_BODY, fontSize: '0.9rem', display: 'block', padding: '9px 18px',
                          color: active ? C.gold : T.text, fontWeight: active ? 600 : 400,
                        }}>
                          {l.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={handleToggleTheme}
              className={`theme-toggle ml-5${popAnim ? ' theme-pop' : ''}`}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? <Sun size={16} color={C.gold} /> : <Moon size={16} color={C.navy} />}
            </button>

            {/* CTA → /contact */}
            <BtnGoldLink to="/contact" className="ml-4">Let's Talk</BtnGoldLink>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-transparent border-none cursor-pointer p-2"
            aria-label="Open navigation menu"
          >
            <Menu size={26} color={dark ? C.gold : C.navy} />
          </button>
        </div>
      </nav>

      {/* Full-screen overlay mobile menu */}
      <div
        className="fixed inset-0 z-[60] flex flex-col md:hidden"
        style={{
          background: C.navy,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.38s ease',
        }}
      >
        <div className="flex justify-end px-6 pt-5 pb-3">
          <button onClick={() => setMenuOpen(false)} className="bg-transparent border-none cursor-pointer" aria-label="Close menu">
            <X size={26} color="#94A3B8" />
          </button>
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-center gap-1"
          style={{ transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)', transition: 'transform 0.45s ease' }}
        >
          {NAV_ALL.map((l, i) => mobileLink(l, i))}

          <div className="mt-8" style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.4s ease 0.4s' }}>
            <BtnGoldLink to="/contact" onClick={() => setMenuOpen(false)}>Let's Talk</BtnGoldLink>
          </div>
        </div>

        <p className="text-center pb-8" style={{ color: '#1A3060', fontFamily: FONT_BODY, fontSize: '0.8rem' }}>
          Nairobi, Kenya · +254 799 644 100
        </p>
      </div>
    </>
  )
}

// ─── Agent preview cards (homepage MeetAgents section) ───────────────────────
// AGENT_PREVIEWS imported from src/data/agents.js (single source of truth as of v2.5)

function AgentPreviewCard({ code, name, meaning, category, tags, icon, desc, delay, visible }) {
  const [hover, setHover] = useState(false)
  const { dark } = useTheme()
  const T = dark ? DARK : null
  const cardBg     = dark ? (hover ? DARK.surfaceHi : DARK.surface) : (hover ? 'white' : 'white')
  const cardBorder = hover ? C.gold : (dark ? DARK.border : C.border)
  const cardTop    = hover ? C.gold : 'transparent'
  const cardShadow = dark
    ? (hover ? '0 12px 48px rgba(201,168,76,0.15), 0 0 0 1px rgba(201,168,76,0.1)' : '0 2px 12px rgba(6,19,44,0.5)')
    : (hover ? '0 12px 40px rgba(10,31,68,0.12)' : '0 2px 12px rgba(10,31,68,0.05)')
  return (
    <div
      className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: cardBg, borderRadius: 16,
        border: `1px solid ${cardBorder}`,
        borderTop: `3px solid ${cardTop}`,
        padding: '24px 28px', transition: 'all 0.3s ease',
        boxShadow: cardShadow,
        transform: hover ? 'translateY(-4px)' : 'none', cursor: 'pointer',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icon}</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.12em', color: dark ? C.gold : C.navy, background: 'rgba(201,168,76,0.14)',
            border: `1px solid ${C.gold}`, borderRadius: 999, padding: '2px 10px',
          }}>{code}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: dark ? DARK.muted : C.muted, fontFamily: FONT_BODY, background: dark ? DARK.surfaceHi : '#F5EFE0', padding: '3px 9px', borderRadius: 999 }}>
          {category}
        </span>
      </div>

      <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '1rem', fontWeight: 700, color: dark ? DARK.text : C.navy, lineHeight: 1.3, marginBottom: 3 }}>{name}</h3>
      <p  style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', fontStyle: 'italic', color: dark ? DARK.muted : C.muted, marginBottom: 10 }}>{meaning}</p>
      <p  style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: dark ? '#CBD5E1' : C.charcoal, lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(t => (
          <span key={t} style={{ fontSize: '0.7rem', fontFamily: FONT_BODY, color: dark ? C.gold : C.navy, background: dark ? DARK.surfaceHi : '#EEF2F8', borderRadius: 999, padding: '3px 10px', fontWeight: 600 }}>{t}</span>
        ))}
      </div>

      <Link to={`/agents#${code.toLowerCase()}`} className="no-underline flex items-center gap-1 text-[0.85rem] font-semibold" style={{ color: C.gold, fontFamily: FONT_BODY }}>
        Learn More <ArrowRight size={14} style={{ marginTop: 1 }} />
      </Link>
    </div>
  )
}

function MeetAgents() {
  const [ref, visible] = useInView()
  return (
    <section ref={ref} id="agents-preview" style={{ background: C.bg, padding: 'clamp(80px,10vw,140px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <Eyebrow className={visible ? 'animate-fade-up' : 'hidden-anim'}>THE AGENTS</Eyebrow>
          <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', color: C.navy, lineHeight: 1.2, marginBottom: 14 }}>
            Meet the Agents Running<br />Your Business Behind the Scenes
          </h2>
          <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FONT_BODY, color: C.muted, maxWidth: 540, margin: '0 auto', lineHeight: 1.8 }}>
            12 domain-specific AI agents — each one purpose-built for a specific operational challenge East African businesses face every day.
          </p>
        </div>

        <div className="grid gap-6 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {AGENT_PREVIEWS.map((a, i) => (
            <AgentPreviewCard key={a.code} {...a} delay={`delay-${(i % 3 + 1) * 100}`} visible={visible} />
          ))}
        </div>

        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} flex flex-col sm:flex-row items-center justify-center gap-4`}>
          <BtnGoldLink to="/agents">Browse All 12 Agents</BtnGoldLink>
          <Link to="/contact" className="no-underline flex items-center gap-2" style={{ color: C.muted, fontFamily: FONT_BODY, fontSize: '0.9rem' }}>
            Not sure which fits? <span style={{ color: C.gold, fontWeight: 600 }}>Talk to us →</span>
          </Link>
        </div>

        <div className={`${visible ? 'animate-fade-up delay-500' : 'hidden-anim'} mt-14 rounded-2xl flex flex-wrap justify-around py-7 px-6 gap-6`} style={{ background: C.navy }}>
          {[
            { num: '12',   label: 'Specialist Agents' },
            { num: '4',    label: 'Business Domains' },
            { num: '24/7', label: 'Always-On Operation' },
            { num: '5',    label: 'East African Countries' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <span style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: C.gold, display: 'block', lineHeight: 1 }}>{num}</span>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: 6, fontFamily: FONT_BODY }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
// Reads ?scroll=<sectionId> on mount and smooth-scrolls to that section.
// This handles cross-page anchor navigation (e.g. clicking "Results" from /blog).
function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  useDocumentTitle(null) // base title: "Neurospark Corporation"

  useEffect(() => {
    const target = searchParams.get('scroll')
    if (!target) return

    // Small delay lets the page paint before scrolling
    const timer = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
      // Clean up the query param without adding a history entry
      setSearchParams({}, { replace: true })
    }, 80)

    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main>
      <Hero />
      <StatsStrip />
      <MeetAgents />

      <section id="services">
        <Chapter
          bg="#FAFAF7"
          eyebrow="THE PROBLEM WITH REPETITIVE TASKS"
          headline="Your team loses hours every day to work that should already be automated."
          problem="Manual payroll reconciliation, weekly reporting via WhatsApp group chains, approval requests that bounce between inboxes for days — these aren't just inefficiencies. They're morale killers. Your sharpest people are buried in logistics that a machine should be handling. The East African business landscape is competitive enough without your team fighting spreadsheets."
          solutionText="Our autonomous operations agents take over your recurring workflows end-to-end — from data collection and report generation to approval routing and notification dispatch. They run silently in the background, 24/7, and surface only what needs a human decision. Your team stops being a relay race and starts being a decision engine."
          img={IMAGES.ch1}
          imgAlt="Team collaborating on operations in a modern Nairobi office"
        />
      </section>

      <Chapter
        reverse
        bg="#F5EFE0"
        eyebrow="THE BURDEN OF WEBSITE MAINTENANCE"
        headline="Your business website is either stale, broken, or both — and you know it."
        problem="You launched the site in 2022 and haven't updated the team page since. The blog has five posts from that initial push of energy. Your promotions page still shows last December's deals. In a market where first impressions are made online before any phone call, a neglected site is quietly costing you clients — especially as mobile internet penetration across East Africa continues to surge past 60%."
        solutionText="Our web-agent monitors your site health, publishes content updates on a schedule you approve, refreshes offers and announcements, and flags anything that needs a human eye. Your website stays alive, current, and professional — without hiring a full-time content manager or chasing an agency that never picks up the phone."
        img={IMAGES.ch2}
        imgAlt="Digital workspace showing website management dashboard"
      />

      <Chapter
        bg="#FAFAF7"
        eyebrow="THE COMPLEXITY OF RANKING ON GOOGLE"
        headline="You built something great. Google still doesn't know you exist."
        problem="Competing for visibility in Nairobi's digital market — or reaching Kampala, Dar es Salaam, and Kigali — requires consistent content strategy, technical site hygiene, and smart keyword targeting that evolves weekly. Most agencies charge enterprise rates and deliver monthly PDFs. Most DIY tools are built for Silicon Valley, not Westlands. The result: East African businesses punch far below their digital weight class."
        solutionText="Our SEO agent researches regional keyword opportunities, monitors your rankings daily, produces optimised content briefs for your team or directly publishes AI-assisted articles you review, and builds clean reporting you can actually act on. Your visibility grows steadily — not in theory, but in real search traffic from real customers in your market."
        img={IMAGES.ch3}
        imgAlt="Analytics dashboard showing SEO growth and traffic trends"
      />

      <BrandMoment />

      <div id="results">
        <Testimonials />
      </div>

      <div id="contact">
        <FinalCTA />
      </div>
    </main>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/agents"       element={<AgentsPage />} />
          <Route path="/agents/:slug" element={<AgentDetailPage />} />
          <Route path="/services"     element={<ServicesPage />} />
          <Route path="/about"        element={<AboutPage />} />
          <Route path="/blog"         element={<BlogPage />} />
          <Route path="/blog/:slug"   element={<BlogPage />} />
          <Route path="/projects"     element={<ProjectsPage />} />
          <Route path="/contact"      element={<ContactPage />} />
          <Route path="/privacy"      element={<PrivacyPage />} />
          <Route path="/terms"        element={<TermsPage />} />
          <Route path="*"             element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppWidget />
    </BrowserRouter>
  )
}

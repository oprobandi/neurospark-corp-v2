/**
 * AboutPage.jsx — /about
 *
 * Place at: src/pages/AboutPage.jsx
 *
 * Add to App.jsx routes:
 *   import AboutPage from './pages/AboutPage'
 *   <Route path="/about" element={<AboutPage />} />
 *
 * Also update Navbar NAV_LINKS:
 *   { label: 'About', href: '/about', internal: true }
 *
 * Sections:
 *   1. PageHero         — Nairobi image + glass card overlay
 *   2. FounderSection   — 2-col bio + animated skill bars
 *   3. Timeline         — vertical milestone timeline
 *   4. MissionValues    — 4-card navy section
 *   5. TractionStats    — animated count-up strip
 *   6. ContactCTA       — dual-button final section
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Linkedin, Github, CheckCircle, ArrowRight, Zap, Globe, Shield, MessageCircle } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, DARK, FONTS, IMAGES } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono


// ─── Design tokens ─────────────────────────────────────────────────────────

// ─── Skill bar data ─────────────────────────────────────────────────────────
const SKILLS = [
  { label: 'AI & Autonomous Agents',            pct: 95 },
  { label: 'Web Development & Architecture',    pct: 90 },
  { label: 'SEO & Organic Growth Strategy',     pct: 88 },
  { label: 'East African Business Consulting',  pct: 85 },
]

// ─── Timeline data ──────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year:  '2022',
    icon:  '🚀',
    title: 'NeuroSpark Corporation Founded',
    desc:  'Started in Nairobi with a single conviction: East African businesses were being underserved by automation tools built for Silicon Valley. The first client was a logistics SME drowning in WhatsApp-chain reporting.',
  },
  {
    year:  '2023',
    icon:  '📈',
    title: 'First 20 Clients. First Proof Points.',
    desc:  "Twenty businesses onboarded across operations automation, website management, and SEO. Average client reclaimed 14 hours per week. Word spread. The referral rate hit 70% of new business — no paid acquisition needed.",
  },
  {
    year:  '2024',
    icon:  '🤖',
    title: '12 Specialist AI Agents Launched',
    desc:  'The full agent catalogue — PESA, KODI, MALIPO, BIASHARA, ZURI, and eight more — launched across four domains. Expanded beyond Kenya into Uganda, Tanzania, Rwanda, and Burundi. Client count crossed 150.',
  },
  {
    year:  '2025',
    icon:  '🌍',
    title: 'Pan-African Operations',
    desc:  "NeuroSpark begins operations across five East African countries with active clients in Nairobi, Kampala, Dar es Salaam, Kigali, and Mombasa. The agent catalogue continues expanding. The mission remains the same: give East African founders the operational leverage they deserve.",
  },
]

// ─── Values data ────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon:  Zap,
    title: 'East African First',
    desc:  "Every agent, every service, and every default assumption is calibrated to the realities of doing business in Kenya and East Africa — not adapted from a Western playbook. If KRA's interface changes, our agents adapt before you notice.",
  },
  {
    icon:  Shield,
    title: 'Radical Transparency',
    desc:  "No mysterious black boxes. Every agent produces auditable outputs. We show you exactly what ran, what it found, and what it decided — because autonomous systems you cannot inspect are autonomous systems you cannot trust.",
  },
  {
    icon:  CheckCircle,
    title: 'Automation that Empowers',
    desc:  "We automate the work that should not require a human being — so human beings can focus on the work only they can do. Our measure of success is not efficiency metrics. It is the hours we give back to founders.",
  },
  {
    icon:  MessageCircle,
    title: 'No Jargon. Ever.',
    desc:  "We talk about agents, not LLMs. We talk about outcomes, not architectures. If you would not say it to a smart businessperson over coffee in Westlands, we do not say it in our pitch decks, our reports, or our code comments.",
  },
]

// ─── Traction stats ─────────────────────────────────────────────────────────
const STATS = [
  { end: 12,  suffix: '',  label: 'AI Agents Deployed' },
  { end: 150, suffix: '+', label: 'Businesses Served' },
  { end: 5,   suffix: '',  label: 'East African Countries' },
  { end: 99,  suffix: '%', label: 'Agent Uptime (SLA)' },
]

// ─── Shared components ──────────────────────────────────────────────────────
function DotGrid({ opacity = 0.13 }) {
  const { dark } = useTheme()
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="aboutDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aboutDots)" />
      </svg>
    </div>
  )
}

// ─── 1. PageHero ────────────────────────────────────────────────────────────
function PageHero() {
  const { dark } = useTheme()
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop:    'clamp(120px,14vw,160px)',
        paddingBottom: 'clamp(80px,10vw,120px)',
        background: C.navy,
      }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1600&auto=format&fit=crop&q=80"
        alt="Nairobi city skyline"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.18, mixBlendMode: 'luminosity' }}
        loading="eager"
      />
      <DotGrid opacity={0.1} />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,31,68,0.6) 0%, rgba(10,31,68,0.85) 100%)' }} />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Glass card */}
        <div
          className="animate-fade-up max-w-[600px]"
          style={{
            background: 'rgba(10,31,68,0.72)',
            backdropFilter: 'blur(24px)',
            border: `1px solid rgba(201,168,76,0.28)`,
            borderRadius: 20,
            padding: 'clamp(32px,5vw,52px)',
          }}
        >
          <p className="mb-4" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>
            OUR STORY
          </p>
          <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: 'white', lineHeight: 1.15, marginBottom: 18 }}>
            Built in Nairobi.
            <br />
            <em style={{ color: C.gold }}>Built for Africa.</em>
          </h1>
          <p style={{ fontFamily: FB, fontSize: 'clamp(0.95rem,1.8vw,1.05rem)', color: '#94A3B8', lineHeight: 1.85, marginBottom: 24 }}>
            NeuroSpark Corporation exists because East African businesses deserve the same operational leverage that their counterparts in London, Singapore, and New York take for granted — and because no one had built the tools with this market genuinely in mind.
          </p>
          <div className="flex items-center gap-2">
            <MapPin size={14} color={C.sky} />
            <span style={{ fontFamily: FB, fontSize: '0.85rem', color: C.sky }}>Nairobi, Kenya — Est. 2022</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2. SkillBar ────────────────────────────────────────────────────────────
function SkillBar({ label, pct, visible, delay }) {
  const { dark } = useTheme()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setWidth(pct), 200 + delay)
    return () => clearTimeout(t)
  }, [visible, pct, delay])

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: FB, fontSize: '0.88rem', fontWeight: 600, color: C.navy }}>{label}</span>
        <span style={{ fontFamily: FM, fontSize: '0.82rem', color: C.gold, fontWeight: 700 }}>{width}%</span>
      </div>
      <div style={{ height: 7, background: dark ? DARK.surfaceHi : '#EEF2F8', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`,
          background: `linear-gradient(90deg, ${C.sky} 0%, ${C.gold} 100%)`,
          borderRadius: 999,
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

// ─── 2. FounderSection ──────────────────────────────────────────────────────
function FounderSection() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const [float, setFloat] = useState(0)

  // Floating animation
  useEffect(() => {
    let frame
    let start
    const animate = (ts) => {
      if (!start) start = ts
      setFloat(Math.sin((ts - start) / 1400) * 8)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div
          className="grid gap-16 items-center"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}
        >
          {/* Left — headshot */}
          <div className={`${visible ? 'animate-slide-l' : 'hidden-anim'} flex flex-col items-center`}>
            {/* Circular gold-ring portrait */}
            <div style={{ position: 'relative', width: 260, height: 260 }}>
              {/* Rotating gold ring */}
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%',
                background: `conic-gradient(${C.gold} 0deg, transparent 80deg, ${C.gold} 160deg, transparent 240deg, ${C.gold} 320deg, transparent 360deg)`,
                animation: 'spin 12s linear infinite',
              }} />
              {/* White gap ring */}
              <div style={{
                position: 'absolute', inset: -2,
                borderRadius: '50%',
                background: dark ? DARK.bg : C.bg,
              }} />
              {/* Photo */}
              <img
                src={IMAGES.founder}
                alt="Paul Nyangwara — Founder, Neurospark Corporation"
                style={{
                  position: 'relative',
                  width: '100%', height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: `translateY(${float}px)`,
                  transition: 'transform 0.1s linear',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Name + role */}
            <div className="text-center mt-6">
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.3rem', color: dark ? DARK.text : C.navy, marginBottom: 3 }}>Paul</p>
              <p style={{ fontFamily: FB, fontSize: '0.85rem', color: dark ? DARK.muted : C.muted, marginBottom: 8 }}>Founder & Chief Agent Architect</p>
              <div className="flex items-center justify-center gap-2 mb-5">
                <MapPin size={13} color={C.sky} />
                <span style={{ fontFamily: FB, fontSize: '0.82rem', color: C.sky }}>🇰🇪 Nairobi, Kenya</span>
              </div>
              {/* Social icons */}
              <div className="flex justify-center gap-3">
                {[
                  { Icon: Linkedin, href: 'https://linkedin.com/in/oprobandi', label: 'LinkedIn' },
                  { Icon: () => <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>, href: 'https://x.com/o_probandi', label: 'X / Twitter' },
                  { Icon: Github,   href: 'https://github.com/oprobandi',               label: 'GitHub' },
                ].map(({ Icon, href, label }) => {
                  const [hover, setHover] = useState(false)
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="no-underline"
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: `1px solid ${hover ? C.gold : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: hover ? C.gold : C.muted,
                        transition: 'all 0.25s',
                      }}
                    >
                      <Icon size={15} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right — bio + skill bars */}
          <div className={visible ? 'animate-slide-r' : 'hidden-anim'}>
            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 10 }}>
              THE FOUNDER
            </p>
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,2.8vw,2rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 18 }}>
              Built on a conviction.<br />
              <em style={{ color: C.gold }}>Refined by 150+ businesses.</em>
            </h2>

            <p style={{ fontFamily: FB, fontSize: '0.95rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.9, marginBottom: 14 }}>
              I started NeuroSpark because I kept seeing the same problem across East African businesses: extraordinary people trapped in ordinary tasks. A founder who built a 40-person company spending Sunday evenings in Excel. A director reconciling M-Pesa transactions by hand every Friday. A brilliant marketing lead who hadn't written a single strategy document in six months because they were too busy updating the website.
            </p>
            <p style={{ fontFamily: FB, fontSize: '0.95rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.9, marginBottom: 28 }}>
              The technology to solve these problems has existed for years. What didn't exist was a version of it built specifically for Kenya — for KRA's iTax, for M-Pesa's API, for the EAC's customs structure, for PPADA procurement, for customers who write in Sheng. That's what we built. And we're not done.
            </p>

            <div style={{ borderTop: `2px solid ${C.gold}`, width: 50, marginBottom: 22 }} />

            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: dark ? DARK.muted : C.muted, fontWeight: 700, marginBottom: 14 }}>
              CORE EXPERTISE
            </p>
            {SKILLS.map((s, i) => (
              <SkillBar key={i} label={s.label} pct={s.pct} visible={visible} delay={i * 150} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 3. Timeline ────────────────────────────────────────────────────────────
function Timeline() {
  const { dark } = useTheme()
  const [ref, visible] = useInView(0.05)

  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div className="max-w-[860px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          COMPANY HISTORY
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,2.8vw,2rem)', color: dark ? DARK.text : C.navy, marginBottom: 48 }}>
          How we got here.
        </h2>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${C.gold}, rgba(201,168,76,0.15))` }} />

          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'}
              style={{ display: 'flex', gap: 28, paddingBottom: i < TIMELINE.length - 1 ? 48 : 0, position: 'relative' }}
            >
              {/* Dot */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: C.navy, border: `2px solid ${C.gold}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
                boxShadow: `0 0 0 6px ${C.sand}`,
                fontSize: '1.1rem',
              }}>
                {item.icon}
              </div>

              {/* Content */}
              <div style={{ paddingTop: 6, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: FM, fontWeight: 800, fontSize: '0.85rem', color: C.gold }}>{item.year}</span>
                  <div style={{ height: 1, background: C.border, flex: 1 }} />
                </div>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.05rem', color: dark ? DARK.text : C.navy, marginBottom: 8, lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.8 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 4. MissionValues ───────────────────────────────────────────────────────
function MissionValues() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', position: 'relative', overflow: 'hidden' }}>
      <DotGrid opacity={0.1} />
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
            WHAT WE STAND FOR
          </p>
          <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.3rem)', color: 'white' }}>
            Our Operating Values
          </h2>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {VALUES.map((v, i) => {
            const [hover, setHover] = useState(false)
            return (
              <div
                key={i}
                className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  background: hover ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hover ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 16,
                  padding: '28px 26px',
                  transition: 'all 0.3s',
                  transform: hover ? 'translateY(-4px)' : 'none',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.goldDim, border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <v.icon size={20} color={C.gold} />
                </div>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.05rem', color: 'white', marginBottom: 10, lineHeight: 1.3 }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: FB, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.75 }}>
                  {v.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── 5. TractionStats (count-up) ────────────────────────────────────────────
function CountUp({ end, suffix, visible }) {
  const { dark } = useTheme()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 1600
    const step = (end / duration) * 16
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, end])

  return (
    <span>{count}{suffix}</span>
  )
}

function TractionStats() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
            THE NUMBERS
          </p>
          <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', color: C.navy }}>
            Three years of compounding impact.
          </h2>
        </div>

        <div
          className="rounded-2xl"
          style={{ background: C.navy, padding: 'clamp(40px,6vw,64px)' }}
        >
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', textAlign: 'center' }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'}
              >
                <div style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', color: C.gold, lineHeight: 1, display: 'block', marginBottom: 8 }}>
                  {visible ? <CountUp end={s.end} suffix={s.suffix} visible={visible} /> : '0' + s.suffix}
                </div>
                <p style={{ fontFamily: FB, fontSize: '0.88rem', color: '#94A3B8' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bar chart decoration */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 40, paddingTop: 32 }}>
            <p style={{ fontFamily: FB, fontSize: '0.75rem', color: '#1A3060', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Client growth by year
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 80, justifyContent: 'center' }}>
              {[
                { year: '2022', pct: 14 },
                { year: '2023', pct: 38 },
                { year: '2024', pct: 72 },
                { year: '2025', pct: 100 },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, maxWidth: 80 }}>
                  <div style={{
                    width: '100%', height: `${b.pct * 0.72}px`,
                    background: `linear-gradient(to top, ${C.gold}, rgba(201,168,76,0.4))`,
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 1.2s ease',
                    minHeight: 8,
                  }} />
                  <span style={{ fontFamily: FM, fontSize: '0.7rem', color: '#475569' }}>{b.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 6. ContactCTA ──────────────────────────────────────────────────────────
function ContactCTA() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const [hoverCall, setHoverCall] = useState(false)
  const [hoverWA,   setHoverWA  ] = useState(false)

  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          LET'S TALK
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 14 }}>
          Ready to see NeuroSpark<br />
          <em style={{ color: C.gold }}>in action?</em>
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, color: dark ? DARK.muted : C.muted, lineHeight: 1.85, marginBottom: 32 }}>
          Tell us your biggest operational headache. We'll tell you exactly which agent solves it — and walk you through a live demo tailored to your business, not a generic slide deck.
        </p>

        <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap justify-center gap-4 mb-10`}>
          <Link
            to="/contact"
            onMouseEnter={() => setHoverCall(true)}
            onMouseLeave={() => setHoverCall(false)}
            style={{
              display: 'inline-block', background: hoverCall ? '#b8943e' : C.gold, color: dark ? DARK.text : C.navy,
              borderRadius: 999, padding: '13px 28px',
              fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', transition: 'all 0.3s',
              boxShadow: hoverCall ? '0 6px 24px rgba(201,168,76,0.4)' : 'none',
              transform: hoverCall ? 'translateY(-2px)' : 'none',
            }}
          >
            Schedule a Call
          </Link>
          <a
            href="https://wa.me/254799644100?text=Hi%20NeuroSpark!%20I%27d%20like%20to%20learn%20more%20about%20your%20agents."
            target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHoverWA(true)}
            onMouseLeave={() => setHoverWA(false)}
            style={{
              display: 'inline-block',
              background: hoverWA ? 'rgba(37,211,102,0.12)' : 'transparent',
              color: '#25D366', border: '2px solid #25D366',
              borderRadius: 999, padding: '13px 28px',
              fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', transition: 'all 0.3s',
            }}
          >
            WhatsApp Us Now
          </a>
        </div>

        {/* Trust strip */}
        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} flex flex-wrap justify-center gap-6`}>
          {['No long-term contracts', 'Onboarded in 5 business days', 'Cancel anytime'].map(t => (
            <span key={t} style={{ fontFamily: FB, fontSize: '0.82rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={13} color={C.sky} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AboutPage Root ─────────────────────────────────────────────────────────
export default function AboutPage() {
  const { dark } = useTheme()
  useDocumentMeta({ title: 'About Us', description: 'Meet Paul Nyang\'wara, Founder & CEO of Neurospark Corporation. Learn about our mission to build AI agents for East African businesses.', canonical: 'https://neurosparkcorporation.ai/about' })
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      {/* Inject spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <PageHero />
      <FounderSection />
      <Timeline />
      <MissionValues />
      <TractionStats />
      <ContactCTA />
    </>
  )
}

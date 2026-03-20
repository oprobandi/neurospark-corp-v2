/**
 * AgentsPage.jsx — /agents route — v3.0
 *
 * Changes from v2.7.3:
 *   • _AGENTS_PLACEHOLDER dead code block removed (was 50 lines, never executed — ADR-009)
 *   • useDocumentTitle → useDocumentMeta (ADR-015)
 *   • WAZO (13th agent) now visible in grid automatically via AGENTS_FULL import
 *
 * Changes from v2.5:
 *   • AGENTS array imported from src/data/agents.js (AGENTS_FULL) — ADR-009 consolidation
 *   • CATEGORY_META and AGENT_CATEGORIES imported from data file
 *   • Full dark mode support via useTheme
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, X } from 'lucide-react'
import Eyebrow from '../components/ui/Eyebrow'
import { useInView } from '../hooks/useInView'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AGENTS_FULL as AGENTS, CATEGORY_META, AGENT_CATEGORIES as CATEGORIES } from '../data/agents'

const FONT_DISPLAY = FONTS.display
const FONT_BODY    = FONTS.body
const FONT_MONO    = FONTS.mono


// ─── Dot grid background (hero) ───────────────────────────────────────────────
function DotGrid() {
  const { dark } = useTheme()
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(201,168,76,0.18)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  )
}

// ─── PageHero ─────────────────────────────────────────────────────────────────
function PageHero({ onBrowse }) {
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

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 500,
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, rgba(56,189,248,0.07) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <Eyebrow className="animate-fade-up" style={{ color: C.gold }}>
          THE AGENTS
        </Eyebrow>

        <h1
          className="animate-fade-up delay-100"
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(2.2rem,5vw,3.8rem)',
            lineHeight: 1.15,
            color: 'white',
            marginBottom: 20,
          }}
        >
          Kenya's Most Powerful AI Agents
          <br />
          <em style={{ color: C.gold }}>Built for Business.</em>
        </h1>

        <p
          className="animate-fade-up delay-200 mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 'clamp(1rem,2vw,1.1rem)',
            color: '#94A3B8',
            maxWidth: 560,
            lineHeight: 1.85,
            marginBottom: 36,
          }}
        >
          12 domain-specific agents — each one built from the ground up for the regulatory, financial, and operational realities of doing business in East Africa. Not adapted from Western tools. Built here, for here.
        </p>

        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-4">
          <button
            onClick={onBrowse}
            style={{
              background: C.gold,
              color: C.navy,
              border: 'none',
              borderRadius: 999,
              padding: '13px 28px',
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#b8943e'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,0.38)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.gold
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Browse All Agents ↓
          </button>
          <a
            href="/contact"
            style={{
              background: 'transparent',
              color: C.sky,
              border: `2px solid ${C.sky}`,
              borderRadius: 999,
              padding: '13px 28px',
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Talk to Sales
          </a>
        </div>

        {/* Glass stat chips + deployment progress */}
        <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-4 mt-12">
          {['12 Agents Live', '24/7 Operation', 'No-Code Setup'].map(chip => (
            <span
              key={chip}
              style={{
                background: 'rgba(10,31,68,0.6)',
                backdropFilter: 'blur(18px)',
                border: `1px solid rgba(201,168,76,0.28)`,
                borderRadius: 999,
                padding: '7px 16px',
                color: '#CBD5E1',
                fontSize: '0.82rem',
                fontFamily: FONT_BODY,
              }}
            >
              {chip}
            </span>
          ))}
          {/* Deployment progress chip */}
          <span
            style={{
              background: 'rgba(10,31,68,0.6)',
              backdropFilter: 'blur(18px)',
              border: `1px solid rgba(201,168,76,0.28)`,
              borderRadius: 999,
              padding: '7px 16px',
              color: '#CBD5E1',
              fontSize: '0.82rem',
              fontFamily: FONT_BODY,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Deployed in:
            {[1,2,3,4,5].map(d => (
              <span key={d} style={{
                width: 18, height: 18, borderRadius: '50%',
                background: d <= 3 ? C.gold : 'rgba(201,168,76,0.25)',
                border: `1px solid rgba(201,168,76,0.5)`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700,
                color: d <= 3 ? C.navy : 'rgba(201,168,76,0.6)',
              }}>
                {d}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}

// ─── AgentFilterBar ───────────────────────────────────────────────────────────
function AgentFilterBar({ activeCategory, setActiveCategory, search, setSearch, gridRef, searchRef }) {
  const [isSticky, setIsSticky] = useState(false)
  const barRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return
      setIsSticky(barRef.current.getBoundingClientRect().top <= 70)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const barBg = isSticky
    ? (dark ? 'rgba(6,19,44,0.97)' : 'rgba(250,250,247,0.96)')
    : (dark ? DARK.bg : C.bg)

  return (
    <div
      ref={barRef}
      style={{
        position: 'sticky', top: 70, zIndex: 40,
        background: barBg,
        borderBottom: isSticky ? `1px solid ${dark ? DARK.border : C.border}` : '1px solid transparent',
        backdropFilter: isSticky ? 'blur(12px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: isSticky ? (dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(10,31,68,0.06)') : 'none',
        padding: '14px 0',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const active = cat === activeCategory
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: active ? C.navy : (dark ? DARK.surfaceHi : 'white'),
                    color:      active ? C.gold : (dark ? DARK.muted : C.charcoal),
                    border:     `1px solid ${active ? C.navy : (dark ? DARK.border : C.border)}`,
                    borderRadius: 999, padding: '7px 16px',
                    fontFamily: FONT_BODY, fontWeight: active ? 600 : 400,
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.25s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {cat !== 'All' && CATEGORY_META[cat] && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: active ? C.gold : CATEGORY_META[cat].color,
                      transition: 'background 0.25s',
                    }} />
                  )}
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Search input */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: dark ? DARK.muted : C.muted, pointerEvents: 'none' }} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents… (⌘K)"
              style={{
                width: '100%', border: `1px solid ${dark ? DARK.border : C.border}`,
                borderRadius: 999, padding: '9px 36px 9px 36px',
                fontFamily: FONT_BODY, fontSize: '0.88rem',
                background: dark ? DARK.surfaceHi : 'white',
                color: dark ? DARK.text : C.charcoal, outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: dark ? DARK.muted : C.muted, display: 'flex', alignItems: 'center' }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AgentCountStrip ──────────────────────────────────────────────────────────
function AgentCountStrip({ count, total }) {
  const { dark } = useTheme()
  return (
    <div style={{ background: dark ? DARK.bg : C.bg, padding: '18px 0', borderBottom: `1px solid ${dark ? DARK.border : C.border}` }}>
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
        <p style={{ fontFamily: FONT_BODY, color: dark ? DARK.muted : C.muted, fontSize: '0.88rem', margin: 0 }}>
          Showing{' '}
          <span style={{ color: dark ? DARK.text : C.navy, fontWeight: 700 }}>{count}</span>{' '}
          {count === total ? '' : `of ${total} `}
          agent{count !== 1 ? 's' : ''}
          {count === total ? ' — all domains' : ' matching your filter'}
        </p>
        <span style={{ color: C.gold, fontSize: '0.75rem', fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Built for East Africa
        </span>
      </div>
    </div>
  )
}

// ─── AgentCard ────────────────────────────────────────────────────────────────
function AgentCard({ agent, index, visible }) {
  const [hover, setHover] = useState(false)
  const [deployOpen, setDeployOpen] = useState(false)
  const { dark } = useTheme()
  const meta = CATEGORY_META[agent.category] || {}
  const delay = `delay-${((index % 3) + 1) * 100}`

  const cardBg     = dark ? (hover ? DARK.surfaceHi : DARK.surface) : 'white'
  const cardBorder = hover ? C.gold : (dark ? DARK.border : C.border)
  const cardTopBorder = hover ? C.gold : 'transparent'
  const cardShadow = dark
    ? (hover ? '0 16px 48px rgba(201,168,76,0.18), 0 0 0 1px rgba(201,168,76,0.1)' : '0 2px 14px rgba(6,19,44,0.5)')
    : (hover ? '0 16px 48px rgba(10,31,68,0.14)' : '0 2px 14px rgba(10,31,68,0.05)')

  return (
    <article
      id={agent.slug}
      className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: cardBg, borderRadius: 18,
        border: `1px solid ${cardBorder}`,
        borderTop: `4px solid ${cardTopBorder}`,
        overflow: 'hidden', transition: 'all 0.3s ease',
        boxShadow: cardShadow,
        transform: hover ? 'translateY(-5px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Card header */}
      <div style={{ padding: '24px 26px 18px' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{agent.icon}</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: dark ? C.gold : C.navy, background: C.goldDim, border: `1px solid ${C.gold}`, borderRadius: 999, padding: '3px 11px' }}>
              {agent.code}
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', fontFamily: FONT_BODY, fontWeight: 600, color: meta.color, background: dark ? `${meta.color}22` : meta.bg, padding: '4px 10px', borderRadius: 999, flexShrink: 0 }}>
            {agent.category}
          </span>
        </div>

        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.05rem', color: dark ? DARK.text : C.navy, lineHeight: 1.3, marginBottom: 4 }}>
          {agent.name}
        </h3>
        <p style={{ fontFamily: FONT_BODY, fontSize: '0.75rem', fontStyle: 'italic', color: dark ? DARK.muted : C.muted, marginBottom: 12 }}>
          {agent.meaning}
        </p>
        <p style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: dark ? '#CBD5E1' : C.charcoal, lineHeight: 1.7 }}>
          {agent.desc}
        </p>
      </div>

      {/* Tags */}
      <div style={{ padding: '0 26px 16px', flex: 1 }}>
        <div className="flex flex-wrap gap-1.5">
          {agent.tags.map(t => (
            <span key={t} style={{ fontSize: '0.7rem', fontFamily: FONT_BODY, color: dark ? C.gold : C.navy, background: dark ? DARK.surfaceHi : '#EEF2F8', borderRadius: 999, padding: '3px 10px', fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, background: hover ? (dark ? DARK.surfaceHi : '#FAFAF7') : cardBg, transition: 'background 0.3s' }}>
        <div style={{ padding: '14px 26px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to={`/agents/${agent.slug}`} className="no-underline flex items-center gap-1.5" style={{ color: C.gold, fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.88rem' }}>
            Learn More <ArrowRight size={14} />
          </Link>
          <button
            onClick={e => { e.stopPropagation(); setDeployOpen(o => !o) }}
            style={{
              background: deployOpen ? C.gold : 'transparent',
              color: deployOpen ? C.navy : '#25D366',
              border: `1px solid ${deployOpen ? C.gold : '#25D366'}`,
              borderRadius: 999, padding: '5px 14px',
              fontFamily: FONT_BODY, fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            Deploy {deployOpen ? '▲' : '↗'}
          </button>
        </div>

        {/* Two-step deploy panel */}
        {deployOpen && (
          <div style={{
            padding: '0 26px 18px',
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'fadeIn 0.2s ease',
          }}>
            <a
              href={`https://wa.me/254799644100?text=I%27d%20like%20to%20deploy%20${encodeURIComponent(agent.code)}%20(${encodeURIComponent(agent.name)})`}
              target="_blank" rel="noopener noreferrer"
              className="no-underline flex items-center gap-2"
              style={{
                background: '#25D366', color: 'white', borderRadius: 8,
                padding: '9px 14px', fontFamily: FONT_BODY, fontWeight: 600,
                fontSize: '0.82rem', justifyContent: 'center',
              }}
            >
              <span>💬</span> Deploy via WhatsApp
            </a>
            <Link
              to="/contact"
              className="no-underline flex items-center gap-2"
              style={{
                background: dark ? DARK.surfaceHi : '#EEF2F8',
                color: dark ? DARK.text : C.navy, borderRadius: 8,
                padding: '9px 14px', fontFamily: FONT_BODY, fontWeight: 600,
                fontSize: '0.82rem', justifyContent: 'center',
              }}
            >
              <span>📅</span> Schedule a call instead
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
// ─── AgentGrid ────────────────────────────────────────────────────────────────
function AgentGrid({ agents }) {
  const [ref, visible] = useInView(0.05)
  const { dark } = useTheme()

  if (agents.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: dark ? DARK.muted : C.muted, fontFamily: FONT_BODY }}>
        <p style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: dark ? DARK.text : C.charcoal, marginBottom: 8 }}>
          No agents found
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Try a different search term or browse all categories.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="grid gap-7"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
    >
      {agents.map((agent, i) => (
        <AgentCard
          key={agent.code}
          agent={agent}
          index={i}
          visible={visible}
        />
      ))}
    </div>
  )
}

// ─── CalloutBanner ────────────────────────────────────────────────────────────
function CalloutBanner() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const [hover, setHover] = useState(false)

  return (
    <div
      ref={ref}
      className={`${visible ? 'animate-fade-up' : 'hidden-anim'} rounded-2xl overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navyMid} 60%, #1a3565 100%)`,
        padding: 'clamp(40px,6vw,64px)',
        position: 'relative',
        marginTop: 56,
        textAlign: 'center',
      }}
    >
      {/* Dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dotsBanner" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(201,168,76,0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotsBanner)" />
        </svg>
      </div>

      <div className="relative z-10">
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.gold,
            display: 'block',
            marginBottom: 14,
          }}
        >
          CUSTOM AGENTS
        </span>

        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(1.6rem,3vw,2.2rem)',
            color: 'white',
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          Can't find the right agent?<br />
          <em style={{ color: C.gold }}>We'll build it for you.</em>
        </h2>

        <p
          style={{
            fontFamily: FONT_BODY,
            color: '#94A3B8',
            fontSize: '0.95rem',
            lineHeight: 1.75,
            maxWidth: 520,
            margin: '0 auto 28px',
          }}
        >
          Every business is different. If you have a domain-specific operational challenge that none of the 12 agents solves, we scope and build custom agents — designed exactly around your workflows, your systems, and your market.
        </p>

        <a
          href="/contact"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="no-underline inline-block rounded-full font-semibold"
          style={{
            background: hover ? '#b8943e' : C.gold,
            color: C.navy,
            padding: '13px 32px',
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'all 0.3s',
            boxShadow: hover ? '0 6px 24px rgba(201,168,76,0.4)' : 'none',
            transform: hover ? 'translateY(-2px)' : 'none',
          }}
        >
          Request a Custom Agent →
        </a>

        {/* Reassurances */}
        <div className="flex flex-wrap justify-center gap-6 mt-7">
          {['Scoped in 48 hours', 'Built in 2–3 weeks', 'No long-term contract'].map(r => (
            <span
              key={r}
              style={{
                fontSize: '0.8rem',
                color: '#64748B',
                fontFamily: FONT_BODY,
              }}
            >
              ✓ {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── AgentsPage Root ──────────────────────────────────────────────────────────
export default function AgentsPage() {
  useDocumentMeta({ title: 'Our 13 Agents', description: '13 autonomous AI agents built for Kenyan and East African businesses — finance, tax, trade, and customer experience.', canonical: 'https://neurosparkcorporation.ai/agents' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [search,         setSearch]         = useState('')
  const gridRef   = useRef(null)
  const searchRef = useRef(null)
  const { dark } = useTheme()

  const scrollToGrid = () => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // ⌘K / Ctrl+K → focus the search input and scroll filter bar into view
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => searchRef.current?.focus(), 300)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Filter agents
  const filtered = AGENTS.filter(a => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.meaning.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <PageHero onBrowse={scrollToGrid} />

      <AgentFilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        gridRef={gridRef}
        searchRef={searchRef}
      />

      <AgentCountStrip count={filtered.length} total={AGENTS.length} />

      {/* Agent grid */}
      <section
        ref={gridRef}
        style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(56px,7vw,100px) 0' }}
      >
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Category heading */}
          {activeCategory !== 'All' && (
            <div className="mb-10">
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 700, color: dark ? DARK.text : C.navy, marginBottom: 4 }}>
                {activeCategory}
              </h2>
              <p style={{ fontFamily: FONT_BODY, color: dark ? DARK.muted : C.muted, fontSize: '0.9rem' }}>
                {filtered.length} agent{filtered.length !== 1 ? 's' : ''} in this category
              </p>
              <div style={{ width: 48, height: 3, background: C.gold, borderRadius: 2, marginTop: 10 }} />
            </div>
          )}

          <AgentGrid agents={filtered} />
          <CalloutBanner />
        </div>
      </section>
    </>
  )
}

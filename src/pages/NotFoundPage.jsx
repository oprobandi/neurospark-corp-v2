/**
 * NotFoundPage.jsx — v2.7.3
 *
 * Changes:
 *   • "While you're here" agent suggestion strip rescues lost visitors
 *   • Dark mode support via useTheme
 */

import { Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useScrollTop } from '../hooks/useScrollTop'
import { useTheme } from '../context/ThemeContext'
import { C, DARK, FONTS } from '../constants'

const FD = FONTS.display
const FB = FONTS.body

const SUGGESTED = [
  { code: 'KODI',   icon: '📋', name: 'KRA Tax Compliance',             slug: 'kodi',   tag: 'Finance & Tax'       },
  { code: 'PESA',   icon: '💳', name: 'Mobile Payments Reconciliation', slug: 'pesa',   tag: 'Finance & Tax'       },
  { code: 'ZURI',   icon: '🤝', name: 'Swahili Customer Service',       slug: 'zuri',   tag: 'Customer Experience' },
]

export default function NotFoundPage() {
  useScrollTop() // BUG-04: was missing scroll-to-top on mount
  useDocumentMeta({ title: 'Page Not Found', canonical: 'https://neurosparkcorporation.ai/404' })
  const { dark } = useTheme()

  return (
    <main
      style={{
        minHeight: '100vh',
        background: dark ? DARK.bg : C.bg,
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{
          fontFamily: FD, fontStyle: 'italic',
          fontSize: 'clamp(6rem,18vw,10rem)', color: C.gold,
          lineHeight: 1, margin: 0, opacity: 0.25, userSelect: 'none',
        }}>404</p>

        <h1 style={{
          fontFamily: FD, fontWeight: 700,
          fontSize: 'clamp(1.8rem,4vw,2.8rem)',
          color: dark ? DARK.text : C.navy,
          lineHeight: 1.2, marginBottom: 16, marginTop: 8,
        }}>
          This page doesn't exist.
        </h1>

        <p style={{
          fontFamily: FB, color: dark ? DARK.muted : C.muted,
          fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 40,
        }}>
          The link you followed may be broken, or the page may have been moved.
          Let's get you back somewhere useful.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: dark ? DARK.surface : C.navy, color: 'white',
            fontFamily: FB, fontWeight: 600, fontSize: '0.95rem',
            padding: '13px 28px', borderRadius: 999, textDecoration: 'none', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          ><Home size={16} /> Back to Home</Link>

          <Link to="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.gold, color: C.navy,
            fontFamily: FB, fontWeight: 600, fontSize: '0.95rem',
            padding: '13px 28px', borderRadius: 999, textDecoration: 'none', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >Contact Us <ArrowRight size={16} /></Link>
        </div>

        {/* Agent suggestions */}
        <div style={{ marginTop: 72 }}>
          <p style={{
            fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase',
            letterSpacing: '0.14em', color: C.gold, fontWeight: 700, marginBottom: 20,
          }}>
            While you're here — have you met these agents?
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {SUGGESTED.map(a => (
              <Link key={a.code} to={`/agents/${a.slug}`} style={{
                textDecoration: 'none',
                background: dark ? DARK.surface : 'white',
                border: `1px solid ${dark ? DARK.border : C.border}`,
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: 6, minWidth: 160, maxWidth: 185, transition: 'all 0.25s',
                boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(10,31,68,0.06)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? DARK.border : C.border; e.currentTarget.style.transform = 'none' }}
              >
                <span style={{ fontSize: '1.6rem' }}>{a.icon}</span>
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', color: C.gold }}>{a.code}</span>
                <span style={{ fontFamily: FD, fontSize: '0.88rem', fontWeight: 700, color: dark ? DARK.text : C.navy, lineHeight: 1.3 }}>{a.name}</span>
                <span style={{ fontFamily: FB, fontSize: '0.7rem', color: dark ? DARK.muted : C.muted }}>{a.tag}</span>
              </Link>
            ))}
          </div>
          <Link to="/agents" style={{
            display: 'inline-block', marginTop: 24,
            color: C.gold, fontFamily: FB, fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none',
          }}>
            Browse all 12 agents →
          </Link>
        </div>
      </div>
    </main>
  )
}

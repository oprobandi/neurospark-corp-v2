/**
 * Breadcrumb.jsx — v3.0
 *
 * Renders a visual breadcrumb trail AND injects a JSON-LD BreadcrumbList
 * schema for Google rich result eligibility.
 *
 * ADR-016: Breadcrumb navigation on all inner-level pages.
 *
 * Usage:
 *   import Breadcrumb from '../components/Breadcrumb'
 *
 *   <Breadcrumb items={[
 *     { label: 'Home',   href: '/' },
 *     { label: 'Agents', href: '/agents' },
 *     { label: 'PESA Agent' },             // last item has no href
 *   ]} />
 *
 * Props:
 *   items — array of { label: string, href?: string }
 *           The last item is the current page (no href needed).
 */

import { Link } from 'react-router-dom'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'

const BASE_URL = 'https://neurosparkcorporation.ai'

export default function Breadcrumb({ items = [] }) {
  const { dark } = useTheme()

  if (!items.length) return null

  // ── JSON-LD BreadcrumbList ─────────────────────────────────────────────────
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <>
      {/* JSON-LD — injected into <body> via dangerouslySetInnerHTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display:    'flex',
          alignItems: 'center',
          flexWrap:   'wrap',
          gap:        4,
          fontSize:   '0.8rem',
          fontFamily: FONTS.body,
          color:      dark ? DARK.muted : C.muted,
          marginBottom: 24,
        }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Separator (not before first item) */}
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ color: dark ? DARK.border : C.border, margin: '0 2px', userSelect: 'none' }}
              >
                /
              </span>
            )}

            {/* Link (all items except last) */}
            {item.href ? (
              <Link
                to={item.href}
                style={{
                  color:          dark ? DARK.muted : C.muted,
                  textDecoration: 'none',
                  transition:     'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.gold }}
                onMouseLeave={e => { e.currentTarget.style.color = dark ? DARK.muted : C.muted }}
              >
                {item.label}
              </Link>
            ) : (
              // Current page — no link, higher contrast
              <span
                aria-current="page"
                style={{ color: dark ? DARK.text : C.charcoal, fontWeight: 500 }}
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}

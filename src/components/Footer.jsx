/**
 * Footer.jsx — v2.7
 *
 * Changes:
 *   • Removed "Get In Touch" column entirely
 *   • Redesigned layout: brand block (left) + nav links (right) in a clean two-column grid
 *   • Socials updated: Instagram, LinkedIn, X (custom SVG), GitHub, Facebook — all /oprobandi handles
 *   • Removed hello@neurosparkcorporation.ai
 *   • Wordmark footer prop removed (Wordmark now always gold)
 *   • Copyright year corrected to 2026
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Linkedin, Instagram } from 'lucide-react'
import Wordmark from './ui/Wordmark'

const FONT_BODY    = "'DM Sans', sans-serif"
const FONT_DISPLAY = "'Playfair Display', serif"

// ─── Social links ─────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: 'Instagram',
    href:  'https://instagram.com/oprobandi',
    Icon:  Instagram,
  },
  {
    label: 'LinkedIn',
    href:  'https://linkedin.com/in/oprobandi',
    Icon:  Linkedin,
  },
  {
    label: 'X',
    href:  'https://x.com/o_probandi',
    Icon:  null,
    svg:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.737-8.836L2.002 2.25H8.08l4.26 5.632 5.904-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>,
  },
  {
    label: 'GitHub',
    href:  'https://github.com/oprobandi',
    Icon:  null,
    svg:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  },
  {
    label: 'Facebook',
    href:  'https://facebook.com/oprobandi',
    Icon:  null,
    svg:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>,
  },
]

// ─── Nav columns ──────────────────────────────────────────────────────────────
const NAV_COL_1 = [
  { label: 'Agents',   href: '/agents'   },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
]
const NAV_COL_2 = [
  { label: 'About',   href: '/about'   },
  { label: 'Blog',    href: '/blog'    },
  { label: 'Contact', href: '/contact' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function FooterLink({ href, children }) {
  const [hover, setHover] = useState(false)
  return (
    <Link
      to={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? 'white' : '#94A3B8',
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'color 0.25s',
        display: 'block',
        marginBottom: 12,
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </Link>
  )
}

function SocialBtn({ label, href, Icon, svg }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Neurospark on ${label}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        border: `1px solid ${hover ? '#C9A84C' : '#1A3060'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hover ? '#C9A84C' : '#94A3B8',
        cursor: 'pointer', transition: 'all 0.25s', textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {Icon ? <Icon size={15} /> : svg}
    </a>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer style={{ background: '#0A1F44', color: 'white', paddingBottom: 0 }}>
      <div className="geo-border" />

      <div className="max-w-[1100px] mx-auto px-6" style={{ paddingTop: 56, paddingBottom: 32 }}>

        {/* Main grid: brand (wide) + two nav columns */}
        <div
          className="grid gap-12 mb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
        >
          {/* Brand block */}
          <div style={{ gridColumn: 'span 2', maxWidth: 340 }}>
            <Link to="/" className="no-underline">
              <Wordmark />
            </Link>

            <p className="flex items-center gap-1 mt-2" style={{ color: '#38BDF8', fontSize: '0.82rem', fontFamily: FONT_BODY }}>
              <MapPin size={12} /> Nairobi, Kenya
            </p>

            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: 14, lineHeight: 1.7, fontFamily: FONT_BODY }}>
              Autonomous AI agents built for East African founders who are done wasting their best hours on work a machine should be doing.
            </p>

            {/* Tagline */}
            <p style={{ color: '#C9A84C', fontSize: '0.8rem', fontFamily: FONT_DISPLAY, fontStyle: 'italic', marginTop: 10 }}>
              Your systems, automated. Your visibility, amplified.
            </p>

            {/* Socials */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {SOCIALS.map(s => <SocialBtn key={s.label} {...s} />)}
            </div>
          </div>

          {/* Nav column 1 */}
          <div>
            <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 20, fontFamily: FONT_BODY }}>
              Navigate
            </h4>
            {NAV_COL_1.map(l => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
          </div>

          {/* Nav column 2 */}
          <div>
            <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'transparent', marginBottom: 20, fontFamily: FONT_BODY, userSelect: 'none' }}>
              &nbsp;
            </h4>
            {NAV_COL_2.map(l => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1A3060', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: FONT_BODY }}>
            © 2026 Neurospark Corporation. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'none', fontFamily: FONT_BODY }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'none', fontFamily: FONT_BODY }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

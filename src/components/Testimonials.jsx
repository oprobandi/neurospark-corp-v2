/**
 * Testimonials.jsx — v2.6
 *
 * Changes from v2.5:
 *   • CARDS data extracted to src/data/testimonials.js (ADR-009)
 *   • Dark mode support via useTheme
 */

import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import Eyebrow from './ui/Eyebrow'
import { IMAGES, C, DARK } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { TESTIMONIALS } from '../data/testimonials'

function TestimonialCard({ avatar, name, role, quote, metric, tag, delay }) {
  const [hover, setHover] = useState(false)
  const { dark } = useTheme()

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`animate-fade-up ${delay} flex flex-col rounded-2xl p-8 transition-all duration-300`}
      style={{
        background:  dark ? (hover ? DARK.surfaceHi : DARK.surface) : 'white',
        boxShadow:   hover
          ? (dark ? '0 8px 40px rgba(201,168,76,0.18)' : '0 8px 40px rgba(10,31,68,0.14)')
          : (dark ? '0 2px 24px rgba(6,19,44,0.6)' : '0 2px 24px rgba(10,31,68,0.08)'),
        border:      hover
          ? '1px solid #C9A84C'
          : `1px solid ${dark ? DARK.border : 'transparent'}`,
        transform:   hover ? 'translateY(-6px)' : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <img src={avatar} alt={name} loading="lazy" className="rounded-full object-cover flex-shrink-0" style={{ width: 48, height: 48 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: dark ? DARK.text : '#0A1F44' }}>{name}</div>
          <div style={{ fontSize: '0.8rem', color: dark ? DARK.muted : '#6B6B6B' }}>{role}</div>
        </div>
      </div>
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', color: '#C9A84C', lineHeight: 0.5, display: 'block', marginBottom: 14 }}>"</span>
      <p className="flex-1" style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '1.05rem', color: dark ? '#CBD5E1' : '#0A1F44', lineHeight: 1.6, marginBottom: 20 }}>{quote}</p>
      <div style={{ fontWeight: 700, color: '#C9A84C', fontSize: '1rem', marginBottom: 14 }}>{metric}</div>
      <span style={{ background: dark ? 'rgba(56,189,248,0.15)' : 'rgba(56,189,248,0.12)', color: '#0ea5e9', fontSize: '0.78rem', borderRadius: 999, padding: '4px 14px', display: 'inline-block', fontWeight: 600, alignSelf: 'flex-start' }}>{tag}</span>
    </div>
  )
}

export default function Testimonials() {
  const [ref, visible] = useInView()
  const { dark } = useTheme()

  return (
    <section ref={ref} id="results" style={{ background: dark ? DARK.bg : '#F5EFE0', padding: 'clamp(80px,10vw,140px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <Eyebrow>WHAT OUR CLIENTS STOPPED WORRYING ABOUT</Eyebrow>
          <h2
            className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: dark ? DARK.text : '#0A1F44', maxWidth: 540, margin: '0 auto' }}
          >
            Real results from businesses just like yours.
          </h2>
        </div>
        {visible && (
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {TESTIMONIALS.map((c, i) => <TestimonialCard key={i} {...c} />)}
          </div>
        )}

        {/* Client logo strip */}
        <div className="mt-16 text-center">
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', textTransform: 'uppercase',
            letterSpacing: '0.14em', color: dark ? DARK.muted : '#6B6B6B', marginBottom: 24,
            fontWeight: 600,
          }}>
            Trusted by businesses across East Africa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
            {[
              'Savana Logistics', 'Maisha Healthcare', 'Zuri Interiors',
              'Pendo Agri', 'Haraka Fintech', 'Ujumbe Media',
            ].map(name => (
              <span key={name} style={{
                fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
                fontSize: '0.95rem', fontWeight: 700,
                color: dark ? 'rgba(232,228,220,0.35)' : 'rgba(10,31,68,0.22)',
                letterSpacing: '0.01em', userSelect: 'none',
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

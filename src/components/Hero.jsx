/**
 * Hero.jsx — v3.0
 *
 * Changes from v2.7:
 *   • Blob width clamped to min(700px, 100vw) — fixes horizontal scroll on mobile (UX audit §2.1)
 *   • Blob height clamped to min(480px, 70vw) — proportional on small screens
 *   • Hero image aspect ratio: 4/3 on mobile, 16/7 on sm+ (UX audit §2.3)
 *   • Added secondary "See the Agents" ghost button CTA (UX audit §3 hero)
 *   • Trust indicator upgraded to gold pill/badge treatment (UX audit §3 hero)
 *   • Image has explicit width + height for CLS prevention (SEO audit §2.5)
 *   • delay-150 changed to delay-200 — delay-150 was undefined in index.css (UX audit §7.4)
 */

import { BtnGold, BtnGoldLink } from './ui/Buttons'
import { IMAGES } from '../constants'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ paddingTop: 'clamp(140px,15vw,180px)', paddingBottom: 'clamp(80px,8vw,100px)', background: '#FAFAF7' }}
    >
      {/* Morphing blob — v3.0: clamped to viewport width to prevent mobile horizontal scroll */}
      <div
        className="blob absolute pointer-events-none"
        style={{
          top:       -80,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     'min(700px, 100vw)',
          height:    'min(480px, 70vw)',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.18) 0%, rgba(56,189,248,0.12) 55%, transparent 80%)',
          filter:    'blur(80px)',
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <p
          className="animate-fade-up mb-4"
          style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C9A84C', fontWeight: 600 }}
        >
          NAIROBI-BUILT. WORLD-READY.
        </p>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-100 mb-4"
          style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.15, color: '#0A1F44' }}
        >
          You built this business<br />to do great work.
          <br />
          <em style={{ color: '#C9A84C' }}>
            Not to chase admin work<br />that never ends.
          </em>
        </h1>

        {/* Tagline — v3.0: delay-150 → delay-200 (delay-150 was not defined in index.css) */}
        <p
          className="animate-fade-up delay-200 mb-6"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 'clamp(1rem,2vw,1.25rem)',
            color: '#6B6B6B',
            letterSpacing: '0.01em',
          }}
        >
          Your systems, automated.&nbsp;&nbsp;Your visibility, amplified.
        </p>

        {/* Sub-copy */}
        <p
          className="animate-fade-up delay-300 mx-auto mb-9"
          style={{ maxWidth: 560, color: '#2C2C2C', fontSize: 'clamp(0.95rem,2vw,1.05rem)', lineHeight: 1.85 }}
        >
          Neurospark Corporation builds autonomous AI agents that handle the operational grind — so Kenyan and East African founders can focus on what they actually built their business to do.
        </p>

        {/* v3.0: Dual CTA — primary + secondary ghost button */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <BtnGold href="/contact">Let's Take It Off Your Plate</BtnGold>
          <BtnGoldLink
            to="/agents"
            style={{
              background:   'transparent',
              color:        '#0A1F44',
              border:       '2px solid #0A1F44',
              borderRadius: 999,
              padding:      '12px 28px',
              fontFamily:   "'DM Sans',sans-serif",
              fontWeight:   600,
              fontSize:     '0.9rem',
              textDecoration: 'none',
              transition:   'all 0.3s',
              display:      'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#0A1F44'; e.currentTarget.style.color = '#0A1F44' }}
          >
            See the Agents →
          </BtnGoldLink>
        </div>

        {/* v3.0: Trust badge — upgraded from plain text to pill treatment */}
        <div className="animate-fade-up delay-500 flex justify-center mt-5">
          <span style={{
            background:    'rgba(201,168,76,0.10)',
            border:        '1px solid rgba(201,168,76,0.30)',
            borderRadius:  999,
            padding:       '5px 16px',
            fontSize:      '0.82rem',
            fontFamily:    "'DM Sans',sans-serif",
            color:         '#C9A84C',
            fontWeight:    600,
          }}>
            ✓ Join 150+ East African businesses saving 14+ hours a week
          </span>
        </div>

        {/* Hero image — v3.0: mobile aspect ratio 4/3, desktop 16/7; explicit w/h for CLS */}
        <div
          className="animate-fade-up mt-16 rounded-[20px] overflow-hidden mx-auto"
          style={{ maxWidth: 900 }}
        >
          <img
            src={IMAGES.hero}
            alt="African entrepreneurs collaborating in a modern Nairobi office"
            width={900}
            height={394}
            loading="eager"
            fetchpriority="high"
            className="w-full block object-cover aspect-[4/3] sm:aspect-[16/7]"
          />
        </div>
      </div>
    </section>
  )
}

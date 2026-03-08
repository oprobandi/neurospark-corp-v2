/**
 * Hero.jsx — v2.7
 *
 * Changes:
 *   • Tagline updated: "Your systems, automated. Your visibility, amplified."
 *   • Sub-copy tightened to align with new tagline
 */

import { BtnGold } from './ui/Buttons'
import { IMAGES } from '../constants'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ paddingTop: 'clamp(140px,15vw,180px)', paddingBottom: 'clamp(80px,8vw,100px)', background: '#FAFAF7' }}
    >
      {/* Morphing blob */}
      <div
        className="blob absolute pointer-events-none"
        style={{
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 480,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.18) 0%, rgba(56,189,248,0.12) 55%, transparent 80%)',
          filter: 'blur(80px)',
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

        {/* Tagline */}
        <p
          className="animate-fade-up delay-150 mb-6"
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
          className="animate-fade-up delay-200 mx-auto mb-9"
          style={{ maxWidth: 560, color: '#2C2C2C', fontSize: 'clamp(0.95rem,2vw,1.05rem)', lineHeight: 1.85 }}
        >
          Neurospark Corporation builds autonomous AI agents that handle the operational grind — so Kenyan and East African founders can focus on what they actually built their business to do.
        </p>

        <div className="animate-fade-up delay-300">
          <BtnGold href="/contact">Let's Take It Off Your Plate</BtnGold>
        </div>

        <p
          className="animate-fade-up delay-400 mt-4"
          style={{ fontSize: '0.88rem', color: '#6B6B6B', fontFamily: "'DM Sans',sans-serif" }}
        >
          Join 150+ East African businesses that reclaimed their week.
        </p>

        {/* Hero image */}
        <div
          className="animate-fade-up delay-500 mt-16 rounded-[20px] overflow-hidden mx-auto"
          style={{ aspectRatio: '16/7', maxWidth: 900 }}
        >
          <img
            src={IMAGES.hero}
            alt="African entrepreneurs collaborating in a modern Nairobi office"
            loading="eager"
            fetchpriority="high"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>
    </section>
  )
}

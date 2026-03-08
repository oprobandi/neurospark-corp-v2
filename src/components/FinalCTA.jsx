/**
 * FinalCTA.jsx — v2.9
 *
 * Changes from v2.8:
 *   • Removed duplicate imports (useTheme × 2, C/DARK/FONTS × 2) — build warning fix
 *   • Fixed dark mode: body copy paragraph now uses DARK.text instead of hardcoded #2C2C2C
 *   • Fixed dark mode: email input background and text respond to theme
 *   • Fixed dark mode: reassurance strip text uses DARK.muted in dark mode
 */

import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { Shield, Zap, XCircle } from 'lucide-react'
import { BtnGold } from './ui/Buttons'
import Eyebrow from './ui/Eyebrow'
import { useTheme } from '../context/ThemeContext'
import { DARK, C } from '../constants'

export default function FinalCTA() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [ref, visible] = useInView()
  const { dark } = useTheme()

  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
    window.open(
      `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER ?? '254799644100'}?text=Hi%20Neurospark%20Corporation%21%20I%27d%20like%20a%20free%20audit.%20My%20email%3A%20${encodeURIComponent(email)}`,
      '_blank'
    )
  }

  return (
    <section ref={ref} id="contact" style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(80px,10vw,140px) 0', textAlign: 'center' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <Eyebrow>START TODAY</Eyebrow>
        <h2
          className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'}
          style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: dark ? DARK.text : C.navy, marginBottom: 16 }}
        >
          Ready to hand it off?
        </h2>
        <p
          className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'}
          style={{ color: dark ? DARK.muted : C.charcoal, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.85 }}
        >
          Tell us your biggest operational headache and we'll show you exactly how our agents would solve it. No pitch deck. No obligation.
        </p>

        {/* Email form */}
        <div
          className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap gap-3 justify-center mx-auto mb-3`}
          style={{ maxWidth: 480 }}
        >
          {submitted ? (
            <div style={{
              background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.35)',
              borderRadius: 12, padding: '16px 24px', color: '#1A7A4A',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem', width: '100%', textAlign: 'center',
            }}>
              ✅ &nbsp;WhatsApp is opening — we'll be in touch shortly!
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                aria-label="Your email address"
                aria-invalid={!!error}
                className="flex-1 min-w-[200px] rounded-full outline-none"
                style={{
                  border: `1px solid ${error ? '#C0392B' : (dark ? DARK.border : C.border)}`,
                  padding: '13px 22px',
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '0.95rem',
                  background: dark ? DARK.surfaceHi : 'white',
                  color: dark ? DARK.text : C.charcoal,
                }}
              />
              <BtnGold onClick={handleSubmit}>Claim My Free Audit</BtnGold>
            </>
          )}
        </div>

        {/* Inline error */}
        {error && !submitted && (
          <p style={{ color: '#C0392B', fontSize: '0.85rem', fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>
            {error}
          </p>
        )}

        {/* Reassurances */}
        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} flex flex-wrap justify-center gap-8`} style={{ marginTop: 28 }}>
          {[
            { Icon: Shield,   text: 'No long-term contracts'       },
            { Icon: Zap,      text: 'Onboarded in 5 business days' },
            { Icon: XCircle,  text: 'Cancel anytime'               },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: dark ? DARK.muted : C.muted }}>
              <Icon size={16} color="#38BDF8" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

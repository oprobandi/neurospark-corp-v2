import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentMeta'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'

const FD = FONTS.display
const FB = FONTS.body

const LAST_UPDATED = '1 July 2025'

function Section({ title, children }) {
  const { dark } = useTheme()
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: FD,
          fontWeight: 700,
          fontSize: '1.4rem',
          color: dark ? DARK.text : C.navy,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <div style={{ fontFamily: FB, color: dark ? DARK.text : C.charcoal, lineHeight: 1.85, fontSize: '1rem' }}>
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  const { dark } = useTheme()
  useDocumentTitle('Privacy Policy')

  return (
    <main style={{ background: dark ? DARK.bg : C.bg, minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: C.navy, padding: 'clamp(64px,8vw,100px) 24px', textAlign: 'center', marginBottom: 72 }}>
        <p style={{ fontFamily: FB, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.gold, fontWeight: 600, marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', color: 'white' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: FB, color: '#94A3B8', marginTop: 12, fontSize: '0.9rem' }}>
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <Section title="1. Who We Are">
          <p>
            Neurospark Corporation is an autonomous AI agency incorporated in Nairobi, Kenya. We build
            and operate AI agents that handle operational tasks for East African businesses. Our contact
            address is: hello@neurosparkcorporation.ai.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p style={{ marginBottom: 12 }}>We collect information you provide directly, including:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
            {['Name and company name', 'Email address and phone number', 'Enquiry details submitted through our contact form', 'Messages sent via WhatsApp'].map(item => (
              <li key={item} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>
          <p>
            We also collect anonymised usage data (page visits, device type, browser) through analytics
            tools to improve our service. This data contains no personally identifiable information.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information solely to:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8 }}>
            {[
              'Respond to your enquiries and provide our services',
              'Send you operational updates relevant to your engagement',
              'Improve our website and agent products',
              'Comply with legal obligations under Kenyan law',
            ].map(item => (
              <li key={item} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: 12 }}>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            Enquiry data is retained for up to 24 months after the close of an engagement. You may
            request deletion of your data at any time by emailing hello@neurosparkcorporation.ai.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p>
            Under the Kenya Data Protection Act 2019, you have the right to access, correct, and
            request deletion of your personal data. To exercise these rights, contact us at
            hello@neurosparkcorporation.ai.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Our website uses essential cookies for basic functionality. Analytics cookies are used only
            in anonymised, aggregated form. You may disable cookies in your browser settings at any time.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Questions about this policy? Email us at{' '}
            <a href="mailto:hello@neurosparkcorporation.ai" style={{ color: C.gold, textDecoration: 'underline' }}>
              hello@neurosparkcorporation.ai
            </a>.
          </p>
        </Section>

        <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 32, marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: C.gold, fontFamily: FB, fontSize: '0.9rem' }}>Terms of Service →</Link>
          <Link to="/" style={{ color: dark ? DARK.muted : C.muted, fontFamily: FB, fontSize: '0.9rem' }}>← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}

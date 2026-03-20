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
      <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.4rem', color: dark ? DARK.text : C.navy, marginBottom: 12 }}>
        {title}
      </h2>
      <div style={{ fontFamily: FB, color: dark ? DARK.text : C.charcoal, lineHeight: 1.85, fontSize: '1rem' }}>
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  const { dark } = useTheme()
  useDocumentTitle('Terms of Service')

  return (
    <main style={{ background: dark ? DARK.bg : C.bg, minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: C.navy, padding: 'clamp(64px,8vw,100px) 24px', textAlign: 'center', marginBottom: 72 }}>
        <p style={{ fontFamily: FB, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.gold, fontWeight: 600, marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', color: 'white' }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: FB, color: '#94A3B8', marginTop: 12, fontSize: '0.9rem' }}>
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <Section title="1. Agreement">
          <p>
            By using Neurospark Corporation's website or services, you agree to these Terms of Service.
            These terms form a binding legal agreement between you and Neurospark Corporation, incorporated
            in Nairobi, Kenya.
          </p>
        </Section>

        <Section title="2. Services">
          <p>
            We provide AI agent deployment, web development, and managed SEO services as described on our
            website. The specific scope, deliverables, and pricing for each engagement are defined in a
            separate service agreement or statement of work signed by both parties.
          </p>
        </Section>

        <Section title="3. Intellectual Property">
          <p>
            Upon full payment, clients receive ownership of all deliverables created specifically for
            their engagement. Our underlying AI models, agent frameworks, and tooling remain the
            intellectual property of Neurospark Corporation.
          </p>
        </Section>

        <Section title="4. Payment">
          <p>
            Services are billed monthly in advance unless otherwise agreed in writing. Late payments
            (exceeding 14 days past due date) may result in suspension of services. All prices are
            quoted in USD unless a Kenyan Shilling rate is agreed in writing.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            Neurospark Corporation's total liability for any claim arising from these terms shall not
            exceed the total fees paid in the 3 months preceding the claim. We are not liable for
            indirect, consequential, or incidental damages.
          </p>
        </Section>

        <Section title="6. Termination">
          <p>
            Either party may terminate an engagement with 30 days' written notice. Upon termination,
            all fees owed for work completed to date remain payable. Client data will be returned or
            deleted per the terms of our Privacy Policy.
          </p>
        </Section>

        <Section title="7. Governing Law">
          <p>
            These terms are governed by the laws of the Republic of Kenya. Any disputes shall be
            resolved in the courts of Nairobi, Kenya.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Questions? Email{' '}
            <a href="mailto:hello@neurosparkcorporation.ai" style={{ color: C.gold, textDecoration: 'underline' }}>
              hello@neurosparkcorporation.ai
            </a>.
          </p>
        </Section>

        <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 32, marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: C.gold, fontFamily: FB, fontSize: '0.9rem' }}>Privacy Policy →</Link>
          <Link to="/" style={{ color: dark ? DARK.muted : C.muted, fontFamily: FB, fontSize: '0.9rem' }}>← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}

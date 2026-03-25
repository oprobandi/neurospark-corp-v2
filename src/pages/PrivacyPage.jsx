/**
 * PrivacyPage.jsx — v3.1
 *
 * Changes from v2.0 stub:
 *   • Full Privacy Policy replacing the 7-section placeholder.
 *   • Calibrated to Kenya Data Protection Act 2019 + GDPR acknowledgement.
 *   • Covers every third-party service in the codebase:
 *     Formspree, Plausible, Hashnode, Google Fonts, Unsplash, WhatsApp.
 *   • Retired hello@neurosparkcorporation.ai removed — WhatsApp is primary contact.
 *   • BUG-04: useScrollTop() added (was missing).
 *   • useDocumentTitle → useDocumentMeta (ADR-015).
 *   • LAST_UPDATED constant at top — update here whenever policy changes.
 */

import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useScrollTop } from '../hooks/useScrollTop'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'

const FD = FONTS.display
const FB = FONTS.body

const LAST_UPDATED = '18 March 2026'

function Section({ title, children }) {
  const { dark } = useTheme()
  return (
    <section style={{ marginBottom: 52 }}>
      <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.35rem', color: dark ? DARK.text : C.navy, marginBottom: 14, lineHeight: 1.3 }}>
        {title}
      </h2>
      <div style={{ fontFamily: FB, color: dark ? '#CBD5E1' : C.charcoal, lineHeight: 1.9, fontSize: '0.97rem' }}>
        {children}
      </div>
    </section>
  )
}

function P({ children, style }) {
  return <p style={{ marginBottom: 14, ...style }}>{children}</p>
}

function UL({ items }) {
  return (
    <ul style={{ paddingLeft: 22, marginBottom: 14 }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 7 }}>{item}</li>)}
    </ul>
  )
}

function DataTable({ rows }) {
  const { dark } = useTheme()
  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FB, fontSize: '0.88rem' }}>
        <thead>
          <tr>
            {rows[0].map((cell, i) => (
              <th key={i} style={{ padding: '10px 14px', background: dark ? DARK.surface : C.navy, color: dark ? C.gold : 'white', fontWeight: 700, textAlign: 'left', borderBottom: `2px solid ${C.gold}` }}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? (dark ? DARK.surfaceHi : C.sand) : 'transparent' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '9px 14px', color: dark ? DARK.text : C.charcoal, borderBottom: `1px solid ${dark ? DARK.border : C.border}`, verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PrivacyPage() {
  const { dark } = useTheme()
  useScrollTop()
  useDocumentMeta({
    title:       'Privacy Policy',
    description: 'How Neurospark Corporation collects, uses, and protects your personal data. Compliant with the Kenya Data Protection Act 2019.',
    canonical:   'https://neurosparkcorporation.ai/privacy',
  })

  const code = (str) => (
    <code style={{ background: dark ? '#1e1e1e' : '#f0ece4', padding: '1px 5px', borderRadius: 3, fontSize: '0.88em', fontFamily: FONTS.mono }}>{str}</code>
  )

  return (
    <main style={{ background: dark ? DARK.bg : C.bg, minHeight: '100vh' }}>

      {/* Hero banner */}
      <div style={{ background: C.navy, padding: 'clamp(100px,12vw,140px) 24px clamp(48px,6vw,72px)', textAlign: 'center' }}>
        <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: 12, lineHeight: 1.2 }}>Privacy Policy</h1>
        <p style={{ fontFamily: FB, color: '#94A3B8', fontSize: '0.88rem' }}>Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 24px clamp(60px,8vw,100px)' }}>

        <Section title="1. Introduction and Who We Are">
          <P>Neurospark Corporation ("Neurospark", "we", "us", or "our") is a technology company registered and operating in Nairobi, Kenya. We provide autonomous AI-powered business automation services — including AI agent deployment, website management, and search engine optimisation — primarily to businesses across East Africa.</P>
          <P>This Privacy Policy explains how we collect, use, store, disclose, and protect information about you when you visit <strong>neurosparkcorporation.ai</strong>, use our Services, or communicate with us. We are the <strong>data controller</strong> for the personal information described here.</P>
          <P>Questions? Reach us on WhatsApp: <a href="https://wa.me/254799644100" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>+254 799 644 100</a>, or via our <Link to="/contact" style={{ color: C.gold, textDecoration: 'none' }}>contact form</Link>.</P>
        </Section>

        <Section title="2. Legal Framework">
          <P>We process personal data in compliance with:</P>
          <UL items={[
            'the Kenya Data Protection Act, 2019 (Cap. 411C) and the Data Protection (General) Regulations, 2021;',
            'the Computer Misuse and Cybercrimes Act, 2018 (data security obligations);',
            'where applicable to individuals in the EEA or UK, the EU General Data Protection Regulation (GDPR) and UK GDPR; and',
            'any other applicable data protection legislation in jurisdictions where we operate.',
          ]} />
        </Section>

        <Section title="3. Information We Collect">
          <P><strong>3.1 Information you provide directly.</strong> When you use our contact form, you may provide your full name, company name, email address, phone number, and a description of your business needs. Client engagements may additionally require business registration details, billing information, and technical credentials (for example, website CMS access or Google Search Console credentials where required for web or SEO agents).</P>
          <P><strong>3.2 WhatsApp communications.</strong> Contacting us via WhatsApp gives us access to your display name, phone number, and message content.</P>
          <P><strong>3.3 Analytics data.</strong> Our Site uses <strong>Plausible Analytics</strong> — a privacy-first service that does not use cookies, does not track individuals across sites, and does not collect personal data such as IP addresses. Plausible provides only aggregate statistics and cannot identify you as an individual.</P>
          <P><strong>3.4 Theme preference.</strong> Your light/dark mode choice is stored in browser {code('localStorage')} under the key {code('ns-theme')}. This data lives only on your device and is never transmitted to our servers.</P>
          <P><strong>3.5 What we do not collect.</strong> We do not use advertising cookies, third-party tracking pixels, or fingerprinting technologies.</P>
        </Section>

        <Section title="4. How We Use Your Information">
          <P>We process your information for the following purposes:</P>
          <DataTable rows={[
            ['Purpose', 'Legal basis'],
            ['Respond to enquiries and provide quotations', 'Legitimate interest; pre-contractual steps'],
            ['Deliver Services under a client agreement', 'Performance of a contract'],
            ['Send service-related communications', 'Performance of contract; legitimate interest'],
            ['Improve our Site and Services', 'Legitimate interest'],
            ['Comply with legal and regulatory obligations', 'Legal obligation'],
            ['Protect against fraud or unlawful activity', 'Legitimate interest; legal obligation'],
            ['Enforce our Terms of Service', 'Legitimate interest; performance of contract'],
          ]} />
          <P>We do <strong>not</strong> use your data for automated decision-making that produces legal or similarly significant effects without human oversight.</P>
        </Section>

        <Section title="5. Disclosure of Your Information">
          <P>We do not sell, rent, or trade your personal data. We share it only with service providers acting on our behalf:</P>
          <UL items={[
            'Formspree (formspree.io) — processes and delivers contact form submissions.',
            'Plausible Analytics (plausible.io) — aggregate, cookieless site analytics.',
            'Hashnode (hashnode.com) — blog platform; may process request data when you load posts.',
            'Google Fonts (fonts.googleapis.com) — web fonts; Google may log request data including IP address.',
            'Unsplash (unsplash.com) — images served via CDN; Unsplash may process request data.',
          ]} />
          <P>We may also disclose information to professional advisers or as required by law, court order, or the Office of the Data Protection Commissioner of Kenya.</P>
        </Section>

        <Section title="6. Cookies and Local Storage">
          <P>Our Site does <strong>not</strong> use cookies for analytics, advertising, or tracking. We use browser localStorage solely to remember your theme preference. Third-party services loaded by the Site (including Google Fonts) may set their own cookies, which you can block through your browser settings.</P>
        </Section>

        <Section title="7. International Data Transfers">
          <P>Our primary operations are in Kenya. For visitors from the EEA or UK: Kenya is not currently recognised as providing adequate data protection under EU law. Transfers are made on the basis of appropriate safeguards. Contact us for details. Transfers to our service providers (principally in the US and Ireland) are subject to those providers' own safeguards.</P>
        </Section>

        <Section title="8. Data Retention">
          <UL items={[
            'Contact enquiry data (no commercial engagement): up to 12 months from last contact.',
            'Client data: duration of contract plus 7 years (Kenya Limitation of Actions Act, Cap. 22).',
            'Analytics data: Plausible retains only anonymised aggregate statistics — no personal data.',
            'localStorage data: persists on your device until cleared; we never receive it.',
          ]} />
        </Section>

        <Section title="9. Security">
          <P>We implement HTTPS/TLS encrypted transmission, need-to-know access controls, and use security-audited third-party processors. No transmission method is completely secure. In the event of a personal data breach likely to cause high risk to your rights, we will notify the Office of the Data Protection Commissioner and affected individuals as required by law.</P>
        </Section>

        <Section title="10. Your Rights">
          <P>Depending on your location, you may have rights to: access your data; request rectification; request erasure in certain circumstances; restrict or object to processing; data portability; and to lodge a complaint with the <strong>Office of the Data Protection Commissioner of Kenya</strong> (<a href="https://odpc.go.ke" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>odpc.go.ke</a>). EEA/UK residents may also complain to their local data protection authority.</P>
          <P>To exercise any right, contact us via WhatsApp or our contact form. We will respond within 30 days and may need to verify your identity.</P>
        </Section>

        <Section title="11. Children's Privacy">
          <P>Our Services are directed at business professionals. We do not knowingly collect personal data from individuals under 18. If you believe we have done so, contact us and we will delete it promptly.</P>
        </Section>

        <Section title="12. Changes to This Policy">
          <P>We may update this Policy from time to time. When we do, we update the "Last updated" date above. Continued use of our Site or Services after changes are published constitutes acknowledgement of those changes.</P>
        </Section>

        <Section title="13. Governing Law">
          <P>This Policy is governed by the laws of the Republic of Kenya. Disputes are subject to the exclusive jurisdiction of the courts of Kenya, without prejudice to your right to complain to the Office of the Data Protection Commissioner.</P>
        </Section>

        {/* Cross-links */}
        <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 32, marginTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/terms" style={{ color: C.gold, fontFamily: FB, fontSize: '0.9rem', textDecoration: 'none' }}>Terms of Service →</Link>
          <Link to="/" style={{ color: dark ? DARK.muted : C.muted, fontFamily: FB, fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>

      </div>
    </main>
  )
}

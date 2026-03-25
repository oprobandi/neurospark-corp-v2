/**
 * TermsPage.jsx — v3.1
 *
 * Changes from v2.0 stub:
 *   • Full Terms of Service replacing the 8-section placeholder.
 *   • Covers AI agent services explicitly: human confirmation requirement,
 *     no-advice disclaimer, regulatory penalty exclusion, third-party credentials.
 *   • Payment terms aligned to KES and Kenya law.
 *   • Dispute resolution: negotiation → NCIA mediation → Kenyan courts.
 *   • BUG-04: useScrollTop() added (was missing).
 *   • useDocumentTitle → useDocumentMeta (ADR-015).
 *   • LAST_UPDATED constant at top — update here whenever terms change.
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

function Callout({ children }) {
  const { dark } = useTheme()
  return (
    <div style={{ background: dark ? DARK.surfaceHi : C.sand, border: `1px solid ${dark ? DARK.border : C.border}`, borderLeft: `3px solid ${C.gold}`, borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
      <p style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  )
}

export default function TermsPage() {
  const { dark } = useTheme()
  useScrollTop()
  useDocumentMeta({
    title:       'Terms of Service',
    description: 'Terms of Service for Neurospark Corporation. Governs use of our website, AI agent services, website management, and SEO services. Governed by Kenyan law.',
    canonical:   'https://neurosparkcorporation.ai/terms',
  })

  return (
    <main style={{ background: dark ? DARK.bg : C.bg, minHeight: '100vh' }}>

      {/* Hero banner */}
      <div style={{ background: C.navy, padding: 'clamp(100px,12vw,140px) 24px clamp(48px,6vw,72px)', textAlign: 'center' }}>
        <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: 12, lineHeight: 1.2 }}>Terms of Service</h1>
        <p style={{ fontFamily: FB, color: '#94A3B8', fontSize: '0.88rem' }}>Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 24px clamp(60px,8vw,100px)' }}>

        <Section title="1. Introduction and Acceptance">
          <P>These Terms of Service ("Terms") govern your access to and use of <strong>neurosparkcorporation.ai</strong> (the "Site") and any services provided by <strong>Neurospark Corporation</strong>, a company incorporated and operating in Nairobi, Kenya ("Neurospark", "we", "us", or "our").</P>
          <P>By accessing the Site, submitting an enquiry, or entering into a commercial engagement with us, you ("you", "Client", or "User") agree to be bound by these Terms. If you do not agree, do not use the Site or engage our Services.</P>
          <P>Where you access our Services on behalf of a company or other legal entity, you represent that you have authority to bind that entity to these Terms.</P>
        </Section>

        <Section title="2. Our Services">
          <P>Neurospark provides:</P>
          <UL items={[
            'AI Agent Deployment — domain-specific AI agents automating defined business workflows (payments reconciliation, KRA tax compliance, Kenyan payroll, trade compliance, tender monitoring, county licensing, export intelligence, SME lending, NSE research, agricultural intelligence, real estate intelligence, customer service, startup validation).',
            'Multi-Agent Platforms — HESABU (PESA + MALIPO + KODI) orchestrated as an integrated compliance platform.',
            'Website Management — design, development, and ongoing managed maintenance of business websites.',
            'Search Engine Optimisation — SEO strategy, keyword research, content production, and ranking monitoring.',
            'Custom Projects — bespoke automation and AI integration projects agreed in writing.',
          ]} />
          <P>The specific scope, deliverables, pricing, and timelines for your engagement are set out in a separate Order Form, Statement of Work, or Service Agreement ("Engagement Document"). In the event of any conflict between these Terms and an Engagement Document, the Engagement Document prevails.</P>
        </Section>

        <Section title="3. Eligibility">
          <P>To use our Services you must: (a) be at least 18 years of age; (b) if acting on behalf of a business, be duly authorised to do so; (c) not be prohibited by applicable law from receiving the Services; and (d) not have previously been suspended from our Services for cause.</P>
        </Section>

        <Section title="4. Acceptable Use">
          <P>You must not use the Site or Services to: violate any applicable law; transmit malicious code; attempt unauthorised access to any system; scrape the Site by automated means without consent; reproduce or resell Site content without permission; submit false or fraudulent information; impersonate any person; or facilitate corruption, money laundering, or financial crime.</P>
        </Section>

        <Section title="5. Intellectual Property">
          <P><strong>5.1 Neurospark content.</strong> All content on the Site and embodied in the Services — including agent architectures, workflow designs, software, code, algorithms, brand marks, and the Neurospark wordmark — is owned by or licensed to Neurospark. Nothing in these Terms grants you the right to use Neurospark's trade marks without our prior written consent.</P>
          <P><strong>5.2 Client materials.</strong> You retain ownership of all data, content, and materials you provide to us ("Client Materials"). By providing them, you grant Neurospark a non-exclusive, royalty-free licence to use them solely to deliver the Services. You warrant that you own or have the necessary rights to provide Client Materials and that their use will not infringe third-party rights.</P>
          <P><strong>5.3 Deliverables.</strong> Ownership of deliverables produced specifically for you is governed by your Engagement Document. Unless otherwise agreed, Neurospark retains ownership of its underlying tools, frameworks, and methodologies, and grants you a licence to use agreed deliverables for your internal business purposes.</P>
          <P><strong>5.4 AI-generated outputs.</strong> The intellectual property ownership of AI-generated outputs is an evolving area of law. To the extent rights vest in outputs produced specifically for you, they are assigned to you upon full payment of all applicable fees, subject to Neurospark's retained licence to use anonymised and aggregated learnings to improve its Services.</P>
        </Section>

        <Section title="6. AI Services — Specific Terms">
          <Callout>These provisions are especially important. Please read them carefully before deploying any AI agent.</Callout>
          <P><strong>6.1 Nature of AI agent services.</strong> You acknowledge that: (a) AI agent outputs are probabilistic and not guaranteed to be error-free — outputs in regulatory, financial, legal, or compliance contexts must be reviewed by appropriately qualified personnel before being acted upon; (b) where an agent interacts with third-party APIs (KRA iTax, M-Pesa Business, NSSF/SHA portals, county licensing systems), the agent's functioning depends on the availability and behaviour of those systems, which are outside our control; (c) agents involving regulatory submissions — in particular KODI and MALIPO — are designed to require explicit human confirmation before any submission to a regulatory authority, and you are solely responsible for reviewing and approving all such submissions before authorising them.</P>
          <P><strong>6.2 No regulatory, legal, or financial advice.</strong> Nothing produced by our AI agents constitutes legal advice, tax advice, financial advice, or investment advice. Our agents automate defined operational tasks — they do not replace the judgement of qualified professionals. Seek independent advice from a certified accountant, advocate, or financial adviser for decisions with legal, tax, regulatory, or financial significance.</P>
          <P><strong>6.3 Human oversight.</strong> You agree to maintain adequate human oversight of all AI agent workflows. Neurospark accepts no liability for losses, penalties, or regulatory consequences arising from your failure to review agent outputs or implement appropriate internal approval processes.</P>
          <P><strong>6.4 Third-party credentials.</strong> Where you provide us with login credentials, API keys, or access tokens to operate an agent on your behalf, you warrant that you are authorised to share those credentials, accept responsibility for actions taken within the scope of our agreed mandate, and must notify us immediately if those credentials are changed or compromised. We treat all such credentials as confidential.</P>
        </Section>

        <Section title="7. Payment Terms">
          <P><strong>7.1 Fees.</strong> Fees are as set out in your Engagement Document. Unless otherwise agreed, fees are quoted in Kenyan Shillings (KES) and are exclusive of applicable taxes.</P>
          <P><strong>7.2 Invoicing and payment.</strong> Invoices are payable within 14 calendar days of the invoice date unless otherwise specified.</P>
          <P><strong>7.3 Late payment.</strong> Overdue amounts accrue interest at 2% per month (or the maximum rate permitted by applicable law, if lower), from the due date until payment. We may also suspend Services until outstanding amounts are settled.</P>
          <P><strong>7.4 Taxes.</strong> You are responsible for all applicable taxes, duties, and levies, including VAT where applicable under Kenyan law.</P>
          <P><strong>7.5 Disputes.</strong> If you dispute an invoice in good faith, notify us in writing within 7 days of the invoice date. Undisputed amounts remain payable by the due date.</P>
        </Section>

        <Section title="8. Confidentiality">
          <P>Each party agrees to keep confidential all non-public information disclosed by the other in connection with the Services that is designated confidential or that a reasonable person would understand to be confidential ("Confidential Information"). Confidential Information may only be used to perform obligations under these Terms, and may only be disclosed to employees or contractors who need to know it and are bound by equivalent obligations.</P>
          <P>Confidentiality obligations do not apply to information that is or becomes publicly available without breach, was already known to the recipient, is independently developed, or must be disclosed by law (with reasonable prior notice given).</P>
          <P>These obligations survive termination for <strong>3 years</strong>.</P>
        </Section>

        <Section title="9. Warranties">
          <P><strong>9.1 Your warranties.</strong> You represent that you have authority to enter these Terms; your use of the Services will comply with all applicable laws; your Client Materials do not infringe third-party rights; you will not use our Services to facilitate illegal activity; and you have all necessary consents for third-party access described in clause 6.4.</P>
          <P><strong>9.2 Our warranties.</strong> Neurospark warrants that it will provide the Services with reasonable skill and care, consistent with industry standards applicable to technology services in East Africa.</P>
          <P style={{ textTransform: 'uppercase', fontSize: '0.88rem', letterSpacing: '0.01em' }}><strong>9.3 Disclaimer.</strong> Except as in clause 9.2, the Site and Services are provided "as is" and "as available". To the fullest extent permitted by law, Neurospark disclaims all other warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and uninterrupted or error-free operation. We do not warrant that third-party APIs will function at all times.</P>
        </Section>

        <Section title="10. Limitation of Liability">
          <P style={{ textTransform: 'uppercase', fontSize: '0.88rem' }}><strong>10.1 Indirect losses.</strong> To the fullest extent permitted by law, Neurospark shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, revenue, business, goodwill, or data — even if advised of the possibility of such damages.</P>
          <P><strong>10.2 Cap on liability.</strong> Neurospark's total liability arising out of these Terms or any Engagement Document shall not exceed the greater of: (a) the total fees paid in the 12 months preceding the event giving rise to the claim; or (b) KES 100,000.</P>
          <P><strong>10.3 Exceptions.</strong> Nothing limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any liability that cannot be excluded under Kenyan law.</P>
          <P><strong>10.4 Regulatory penalties.</strong> Regulatory penalties, fines, or interest charges imposed by KRA, NSSF, SHA, county authorities, or any other regulatory body arising from inaccurate information you provided, your failure to review and approve agent outputs before submission, or your failure to maintain human oversight as required in clause 6.3, are your sole responsibility.</P>
        </Section>

        <Section title="11. Indemnification">
          <P>You agree to indemnify, defend, and hold harmless Neurospark and its directors, employees, contractors, and agents from and against any claims, liabilities, damages, losses, and costs (including reasonable legal fees) arising from: your breach of these Terms; your unauthorised use of the Services; any claim that your Client Materials infringe third-party rights; your violation of applicable law; or any regulatory claim arising from your failure to review and approve AI agent outputs as required in clause 6.3.</P>
        </Section>

        <Section title="12. Term and Termination">
          <P><strong>12.1 Duration.</strong> These Terms are effective from the date you first access the Site or engage our Services and continue until terminated.</P>
          <P><strong>12.2 Termination by you.</strong> You may terminate an engagement in accordance with your Engagement Document. In the absence of specific provisions, 30 days' written notice is required.</P>
          <P><strong>12.3 Termination by us.</strong> We may suspend or terminate with immediate effect if you: materially breach these Terms and fail to remedy it within 14 days of notice; fail to pay an undisputed amount within 7 days of a reminder; become insolvent or enter administration; or we have reasonable grounds to believe you are using the Services for unlawful activity.</P>
          <P><strong>12.4 Effects of termination.</strong> On termination: outstanding fees for work delivered become immediately due; each party returns or destroys the other's Confidential Information (subject to legal retention requirements); and Client Materials are available for retrieval for 30 days, after which we may delete them. Clauses 5, 8, 9.3, 10, 11, 13, and 14 survive termination.</P>
        </Section>

        <Section title="13. Dispute Resolution">
          <P><strong>13.1 Good faith resolution.</strong> If a dispute arises, the parties will first attempt to resolve it through direct negotiation. Either party may initiate by giving written notice describing the dispute and relief sought. The parties will use reasonable efforts to resolve it within 21 days ("Negotiation Period").</P>
          <P><strong>13.2 Mediation.</strong> If unresolved after the Negotiation Period, either party may refer the dispute to mediation administered by the <strong>Nairobi Centre for International Arbitration (NCIA)</strong> under its Mediation Rules, conducted in Nairobi in the English language.</P>
          <P><strong>13.3 Litigation.</strong> If mediation is unsuccessful or refused, either party may pursue the dispute in the courts of Kenya. The parties submit to the <strong>exclusive jurisdiction of the courts of the Republic of Kenya</strong>.</P>
          <P><strong>13.4 Governing law.</strong> These Terms are governed by and construed in accordance with the laws of the <strong>Republic of Kenya</strong>.</P>
        </Section>

        <Section title="14. General">
          <P><strong>Entire agreement.</strong> These Terms, together with any Engagement Document and our Privacy Policy, constitute the entire agreement between the parties and supersede all prior understandings.</P>
          <P><strong>Amendments.</strong> We may update these Terms from time to time; material changes will be notified and the "Last updated" date will be revised. Continued use constitutes acceptance.</P>
          <P><strong>Severability.</strong> If any provision is held invalid or unenforceable, it will be modified to the minimum extent necessary, or severed. The remaining provisions continue in full force.</P>
          <P><strong>Waiver.</strong> No failure to exercise a right constitutes a waiver. A waiver of one breach does not waive subsequent breaches.</P>
          <P><strong>Assignment.</strong> You may not assign your rights without our written consent. We may assign these Terms to a successor entity on written notice to you.</P>
          <P><strong>Force majeure.</strong> Neither party is in breach for failures caused by circumstances beyond reasonable control (acts of God, government actions, pandemics, third-party infrastructure failures). If force majeure continues for more than 60 days, either party may terminate the affected Engagement Document on 14 days' written notice.</P>
          <P><strong>Notices.</strong> Formal notices may be sent via WhatsApp (+254 799 644 100) or email. Notices are deemed received immediately on WhatsApp acknowledgement, on the next business day for email, or 3 business days after posting.</P>
          <P><strong>Relationship.</strong> These Terms do not create a partnership, joint venture, agency, or employment relationship. Each party is an independent contractor.</P>
          <P><strong>Language.</strong> These Terms are written in English. In the event of any conflict with a translation, the English version prevails.</P>
        </Section>

        <Section title="15. Contact">
          <P>
            Questions about these Terms? Contact us at{' '}
            <a href="https://wa.me/254799644100" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>+254 799 644 100</a>
            {' '}or via our{' '}
            <Link to="/contact" style={{ color: C.gold, textDecoration: 'none' }}>contact form</Link>.
          </P>
        </Section>

        {/* Cross-links */}
        <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 32, marginTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/privacy" style={{ color: C.gold, fontFamily: FB, fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy →</Link>
          <Link to="/" style={{ color: dark ? DARK.muted : C.muted, fontFamily: FB, fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>

      </div>
    </main>
  )
}

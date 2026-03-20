/**
 * HesabuPlatformPage.jsx — /platforms/hesabu — v3.0 (NEW)
 *
 * HESABU is NeuroSpark's flagship multi-agent compliance platform combining
 * PESA (payments reconciliation), MALIPO (payroll), and KODI (KRA tax)
 * under a single orchestrator with a live regulatory monitor and an immutable
 * audit trail.
 *
 * "Early Access" badge shown per product advisory — HESABU regulatory monitor
 * needs testing against real court order changes; multi-tenant accountant UI
 * is still in development.
 *
 * Sections:
 *   1. PlatformHero      — headline, badge, tagline, component overview
 *   2. WorkflowEngine    — 5-step monthly compliance cycle (timeline)
 *   3. RegulatoryMonitor — live NSSF/AHL/SHA checks
 *   4. HumanGate         — confirmation protocol, terminal demo
 *   5. AuditTrail        — SHA-256 chain architecture
 *   6. PlatformTiers     — Starter / Growth / Enterprise comparison table
 *   7. PlatformFAQ       — 4 platform-level FAQs
 *   8. DeploymentCTA     — Book a demo / WhatsApp
 *
 * JSON-LD SoftwareApplication schema injected inline (per SEO audit §2.1).
 * Source: agent-content-injection.md Track 2.
 *
 * ADR-019: HESABU Platform page at /platforms/hesabu. EACTIC does not get its
 *          own public page — it is surfaced on BIASHARA and Bidhaa agent pages.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Shield, Zap, Clock, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import Breadcrumb from '../components/Breadcrumb'

const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono

// ─── Monthly compliance workflow steps ────────────────────────────────────────
const WORKFLOW = [
  { days: 'Day 1–5',  agent: 'PESA',   icon: '💳', title: 'Payments Reconciled', desc: 'PESA fetches M-Pesa, Airtel Money, and bank statements, matches transactions to invoices, flags WHT obligations, and produces a VAT-eligible revenue breakdown for KODI.' },
  { days: 'Day 6–8',  agent: 'MALIPO', icon: '💼', title: 'Payroll Computed',     desc: 'MALIPO checks the regulatory monitor for live NSSF/AHL/SHA court order status, then computes gross-to-net for all employees and generates a P10 CSV with SHA-256 verification.' },
  { days: 'Day 9',    agent: 'KODI',   icon: '📋', title: 'PAYE Filed',           desc: 'KODI receives the verified P10 from MALIPO, validates every employee KRA PIN, presents a structured filing review, and files on iTax only after explicit human confirmation.' },
  { days: 'Day 20',   agent: 'KODI',   icon: '📋', title: 'VAT Filed',            desc: 'KODI uses PESA\'s reconciled revenue figures to prepare and file the VAT return. Both filings are logged with acknowledgement numbers in the immutable audit chain.' },
  { days: 'Month-end',agent: 'HESABU', icon: '🏛️', title: 'Compliance Summary',  desc: 'HESABU produces a complete month-end compliance report: filings made, payments due, unresolved exceptions, and regulatory assumptions used — all traceable to session-level events.' },
]

// ─── Regulatory monitor items ─────────────────────────────────────────────────
const REG_ITEMS = [
  {
    name:  'NSSF New Act',
    check: 'kenyalaw.org + Employment & Labour Relations Court cause lists',
    states: [
      { label: 'ACTIVE',    color: '#4ADE80', desc: 'Tier I + Tier II rates applied (6% each, capped at LCL/UCL)' },
      { label: 'STAYED',    color: '#FBBF24', desc: 'Old-act flat KES 200/month applied' },
      { label: 'CONTESTED', color: '#F87171', desc: 'Both scenarios presented — employer selects, choice logged' },
    ],
  },
  {
    name:  'Affordable Housing Levy',
    check: 'Ministry of Finance circulars + court order register',
    states: [
      { label: 'ACTIVE',  color: '#4ADE80', desc: '1.5% employee + 1.5% employer applied' },
      { label: 'STAYED',  color: '#FBBF24', desc: 'AHL deductions set to KES 0.00, payslip labelled accordingly' },
    ],
  },
  {
    name:  'SHA / SHIF',
    check: 'sha.go.ke + Ministry of Health circulars',
    states: [
      { label: 'ACTIVE', color: '#4ADE80', desc: '2.75% SHA contribution applied' },
      { label: 'REVIEW', color: '#FBBF24', desc: 'SHA alerts employer to check MOH circular before proceeding' },
    ],
  },
]

// ─── Platform tier table ──────────────────────────────────────────────────────
const TIERS = [
  {
    name:  'Starter',
    price: 'From KES 4,500/mo',
    features: {
      'Agents included':    'PESA or MALIPO',
      'Employees':          'Up to 10',
      'Entities':           '1',
      'Regulatory Monitor': 'Monthly',
      'Audit trail':        '12 months',
      'Multi-tenant':       '—',
    },
  },
  {
    name:    'Growth',
    price:   'From KES 12,000/mo',
    popular: true,
    features: {
      'Agents included':    'PESA + MALIPO + KODI',
      'Employees':          'Up to 50',
      'Entities':           'Up to 3',
      'Regulatory Monitor': 'Weekly',
      'Audit trail':        '36 months',
      'Multi-tenant':       '—',
    },
  },
  {
    name:  'Enterprise',
    price: 'Custom',
    features: {
      'Agents included':    'Full HESABU Platform',
      'Employees':          'Unlimited',
      'Entities':           'Unlimited',
      'Regulatory Monitor': 'Every session',
      'Audit trail':        'Unlimited',
      'Multi-tenant':       '✓ (accountants)',
    },
  },
]

const TIER_ROWS = ['Agents included', 'Employees', 'Entities', 'Regulatory Monitor', 'Audit trail', 'Multi-tenant']

// ─── Platform FAQs ────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can one accountant manage multiple client businesses on HESABU?',
    a: 'Yes. HESABU\'s multi-tenant architecture uses entity-level isolation with PostgreSQL row-level security. An accountant can switch between client entities in the same session — each with its own obligation calendar, payroll history, and filing record. Available on Enterprise tier.',
  },
  {
    q: 'Does HESABU require API access to KRA iTax?',
    a: 'No. HESABU generates P10 CSVs in KRA\'s exact iTax upload format with step-by-step manual filing instructions. When KRA publishes a public iTax API, HESABU will be the integration point. Until then, the manual upload path is fully supported.',
  },
  {
    q: 'What happens to a compliance workflow if the session closes mid-process?',
    a: 'HESABU saves workflow state across sessions. If MALIPO completed payroll on Tuesday and you return Thursday to file with KODI, HESABU resumes from exactly where you left off — no recomputation, no re-confirmation of completed steps.',
  },
  {
    q: 'Is HESABU a replacement for our accountant?',
    a: 'No. HESABU handles computation, preparation, documentation, and compliance monitoring. Your accountant retains professional responsibility for reviewing and authorising every KRA submission. HESABU enforces this by requiring human confirmation at every filing gate — it cannot and does not submit to KRA without it.',
  },
]

// ─── Dot grid background ──────────────────────────────────────────────────────
function DotGrid({ opacity = 0.12 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hesabuDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hesabuDots)" />
      </svg>
    </div>
  )
}

// ─── 1. Platform Hero ─────────────────────────────────────────────────────────
function PlatformHero() {
  const { dark } = useTheme()
  return (
    <section className="relative overflow-hidden" style={{ background: C.navy, paddingTop: 'clamp(120px,14vw,160px)', paddingBottom: 'clamp(60px,8vw,100px)' }}>
      <DotGrid opacity={0.14} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(201,168,76,0.12) 0%, transparent 60%)' }} />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'HESABU Platform' }]} />

        {/* Early Access badge */}
        <div className="mb-5">
          <span className="early-access-badge">
            <span style={{ fontSize: '0.65rem' }}>●</span> Early Access
          </span>
        </div>

        <div style={{ maxWidth: 780 }}>
          <p className="animate-fade-up mb-3" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>HESABU PLATFORM</p>
          <h1 className="animate-fade-up delay-100" style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: 'white', lineHeight: 1.15, marginBottom: 18 }}>
            The Kenyan Business<br />Compliance Platform
          </h1>
          <p className="animate-fade-up delay-200" style={{ fontFamily: FB, fontSize: 'clamp(1rem,2vw,1.1rem)', color: '#94A3B8', lineHeight: 1.8, marginBottom: 32, maxWidth: 640 }}>
            Three specialist agents. One orchestrator. Complete PAYE, VAT, and mobile money compliance — automated, auditable, and human-confirmed at every KRA filing.
          </p>
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
            <Link to="/contact" style={{ background: C.gold, color: C.navy, borderRadius: 999, padding: '14px 30px', fontFamily: FB, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b8943e'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,168,76,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.boxShadow = 'none' }}
            >
              Book a Demo
            </Link>
            <a href={`https://wa.me/254799644100?text=${encodeURIComponent('I\'d like to learn more about the HESABU compliance platform.')}`} target="_blank" rel="noopener noreferrer"
              style={{ background: 'transparent', color: '#25D366', border: '2px solid #25D366', borderRadius: 999, padding: '14px 30px', fontFamily: FB, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s' }}
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* Component pill row */}
        <div className="animate-fade-up delay-400 flex flex-wrap gap-4 mt-12">
          {[
            { code: 'PESA', icon: '💳', role: 'Payments Reconciliation', color: '#3B82F6' },
            { code: 'MALIPO', icon: '💼', role: 'Payroll Compliance',      color: '#10B981' },
            { code: 'KODI',  icon: '📋', role: 'KRA Tax Compliance',       color: '#F59E0B' },
          ].map(a => (
            <Link key={a.code} to={`/agents/${a.code.toLowerCase()}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 16px', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
              <div>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.75rem', color: C.gold, letterSpacing: '0.1em' }}>{a.code}</p>
                <p style={{ fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8' }}>{a.role}</p>
              </div>
              <ArrowRight size={12} color="#475569" style={{ marginLeft: 4 }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 2. Monthly Workflow Engine ───────────────────────────────────────────────
function WorkflowEngine() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-[900px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>THE MONTHLY CYCLE</p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 40 }}>
          One orchestrator. Five coordinated steps.<br />Zero missed deadlines.
        </h2>
        <div className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'}>
          {WORKFLOW.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, marginBottom: i < WORKFLOW.length - 1 ? 0 : undefined }}>
              {/* Timeline spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 40 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.navy, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {step.icon}
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${C.gold}, rgba(201,168,76,0.2))`, minHeight: 40, margin: '4px 0' }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: i < WORKFLOW.length - 1 ? 32 : 0, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', color: C.gold, letterSpacing: '0.1em' }}>{step.days}</span>
                  <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', color: dark ? DARK.muted : C.muted, background: dark ? DARK.surfaceHi : '#F5EFE0', padding: '2px 8px', borderRadius: 999 }}>{step.agent}</span>
                </div>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1rem', color: dark ? DARK.text : C.navy, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontFamily: FB, fontSize: '0.88rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 3. Regulatory Monitor ────────────────────────────────────────────────────
function RegulatoryMonitor() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="grid gap-12 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
          {/* Left — explanation */}
          <div>
            <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>LIVE REGULATORY MONITOR</p>
            <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 16 }}>
              Kenya's regulations change.<br />HESABU checks every session.
            </h2>
            <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, fontSize: '0.92rem', color: dark ? DARK.muted : C.charcoal, lineHeight: 1.8 }}>
              Every HESABU session begins with a live web check on the status of Kenya's three most contested payroll regulations. This is not a one-time configuration — it runs fresh every time, because court orders do not wait for your payroll cycle.
            </p>
            <p className={visible ? 'animate-fade-up delay-300' : 'hidden-anim'} style={{ fontFamily: FB, fontSize: '0.92rem', color: dark ? DARK.muted : C.charcoal, lineHeight: 1.8, marginTop: 14 }}>
              When the status is <strong>CONTESTED</strong>, HESABU presents both rate scenarios, requires you to select one explicitly, and logs your choice with the regulatory context in an immutable audit record — so you can defend the rate applied if KRA ever questions it.
            </p>
          </div>
          {/* Right — status cards */}
          <div className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'}>
            {REG_ITEMS.map((item, i) => (
              <div key={i} style={{ background: dark ? DARK.bg : 'white', border: `1px solid ${dark ? DARK.border : C.border}`, borderRadius: 14, padding: '18px 20px', marginBottom: i < REG_ITEMS.length - 1 ? 14 : 0 }}>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.8rem', color: dark ? DARK.text : C.navy, marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontFamily: FB, fontSize: '0.72rem', color: dark ? DARK.muted : C.muted, marginBottom: 10 }}>Checks: {item.check}</p>
                {item.states.map((s, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: j < item.states.length - 1 ? 8 : 0 }}>
                    <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.68rem', color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}40`, borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap', marginTop: 1 }}>{s.label}</span>
                    <span style={{ fontFamily: FB, fontSize: '0.78rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.6 }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 4. Human Gate ────────────────────────────────────────────────────────────
function HumanGate() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="grid gap-12 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {/* Terminal mock */}
          <div className={visible ? 'animate-slide-l' : 'hidden-anim'}>
            <div style={{ background: '#020C1A', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', fontFamily: FM, fontSize: '0.8rem' }}>
              <div style={{ background: '#0A1528', padding: '10px 16px', display: 'flex', gap: 6 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ padding: '20px 20px', lineHeight: 1.7 }}>
                {[
                  { color: '#C9A84C', text: '═══════════════════════════════════════════' },
                  { color: '#FBBF24', text: '⚠️  ACTION REQUIRED — PAYE Return Filing' },
                  { color: '#C9A84C', text: '═══════════════════════════════════════════' },
                  { color: '#94A3B8', text: '' },
                  { color: '#94A3B8', text: 'Employees:         34' },
                  { color: '#94A3B8', text: 'Total PAYE:        KES 847,500' },
                  { color: '#94A3B8', text: 'Filing deadline:   9th January 2026' },
                  { color: '#94A3B8', text: '' },
                  { color: '#E8E4DC', text: 'Type "CONFIRM" to file with KRA, or' },
                  { color: '#E8E4DC', text: 'describe any changes required.' },
                  { color: '#94A3B8', text: '' },
                  { color: '#C9A84C', text: '═══════════════════════════════════════════' },
                  { color: '#94A3B8', text: '' },
                  { color: '#4ADE80', text: '> CONFIRM' },
                  { color: '#94A3B8', text: '' },
                  { color: '#4ADE80', text: '✓ Confirmation logged — 08:14:22 EAT' },
                  { color: '#4ADE80', text: '✓ P10 filed via iTax' },
                  { color: '#4ADE80', text: '✓ Acknowledgement: ITX-2026-01-XXXX logged' },
                ].map((l, i) => (
                  <div key={i} style={{ color: l.color, whiteSpace: 'pre' }}>{l.text || '\u00A0'}</div>
                ))}
              </div>
            </div>
          </div>
          {/* Text */}
          <div className={visible ? 'animate-slide-r' : 'hidden-anim'}>
            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700, marginBottom: 8 }}>HUMAN GATE ENFORCEMENT</p>
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
              No return is ever filed without your explicit confirmation.
            </h2>
            <p style={{ fontFamily: FB, fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.8, marginBottom: 16 }}>
              Before every KRA submission, HESABU presents a structured filing review and waits for you to type explicit confirmation. A vague or ambiguous response does not trigger filing. The confirmation — and the session ID — is logged in an immutable audit record.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              {[
                'Every KRA return filing',
                'Every payroll computation sign-off',
                'Every provisional regulatory rate applied',
                'Every posting of unmatched transactions',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle size={16} color={C.gold} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontFamily: FB, fontSize: '0.88rem', color: '#CBD5E1' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 5. Audit Trail ───────────────────────────────────────────────────────────
function AuditTrail() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const chain = [
    { label: 'Payroll Run',         desc: 'MALIPO payroll_run_id',        icon: '💼' },
    { label: 'P10 CSV',             desc: 'SHA-256 checksum verified',     icon: '📄' },
    { label: 'Employer Confirmation',desc: 'Timestamp + Session ID logged', icon: '✅' },
    { label: 'KRA Acknowledgement', desc: 'Ack number stored in history',  icon: '📋' },
    { label: 'Any Amendment',       desc: 'Linked to original ack number', icon: '🔗' },
  ]
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-[900px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>AUDIT TRAIL ARCHITECTURE</p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 12 }}>
          If KRA audits you three years later, HESABU has the complete chain.
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, fontSize: '0.92rem', color: dark ? DARK.muted : C.charcoal, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
          Every action in HESABU is traceable. For any PAYE period, the audit chain links the original payroll run through to the KRA acknowledgement number — with SHA-256 checksum verification at each step.
        </p>
        {/* Chain */}
        <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap gap-0 items-center justify-center`}>
          {chain.map((item, i) => (
            <>
              <div key={item.label} style={{ background: dark ? DARK.surface : 'white', border: `1px solid ${dark ? DARK.border : C.border}`, borderRadius: 12, padding: '14px 18px', textAlign: 'center', minWidth: 120, maxWidth: 140 }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{item.icon}</div>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.75rem', color: dark ? DARK.text : C.navy, marginBottom: 3 }}>{item.label}</p>
                <p style={{ fontFamily: FB, fontSize: '0.68rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
              {i < chain.length - 1 && (
                <ArrowRight key={`arrow-${i}`} size={16} color={C.gold} style={{ margin: '0 6px', flexShrink: 0 }} />
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 6. Platform Tiers ────────────────────────────────────────────────────────
function PlatformTiers() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3 text-center`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>PRICING TIERS</p>
        <h2 className={`${visible ? 'animate-fade-up delay-100' : 'hidden-anim'} text-center`} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.25, marginBottom: 40 }}>
          Start with one agent. Scale to the full platform.
        </h2>
        <div className={`${visible ? 'animate-fade-up delay-200' : 'hidden-anim'} grid gap-6`} style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))' }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{ background: tier.popular ? C.navy : (dark ? DARK.bg : 'white'), border: `2px solid ${tier.popular ? C.gold : (dark ? DARK.border : C.border)}`, borderRadius: 20, padding: '28px 24px', position: 'relative', boxShadow: tier.popular ? '0 20px 60px rgba(201,168,76,0.2)' : undefined }}>
              {tier.popular && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: C.navy, fontFamily: FM, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', padding: '3px 14px', borderRadius: 999 }}>MOST POPULAR</span>
              )}
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.15rem', color: tier.popular ? 'white' : (dark ? DARK.text : C.navy), marginBottom: 4 }}>{tier.name}</p>
              <p style={{ fontFamily: FB, fontSize: '0.88rem', color: tier.popular ? C.gold : C.gold, fontWeight: 700, marginBottom: 20 }}>{tier.price}</p>
              {TIER_ROWS.map(row => (
                <div key={row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: `1px solid ${tier.popular ? 'rgba(255,255,255,0.08)' : (dark ? DARK.border : C.border)}` }}>
                  <span style={{ fontFamily: FB, fontSize: '0.8rem', color: tier.popular ? '#94A3B8' : (dark ? DARK.muted : C.muted) }}>{row}</span>
                  <span style={{ fontFamily: FB, fontSize: '0.8rem', fontWeight: 600, color: tier.popular ? 'white' : (dark ? DARK.text : C.navy), textAlign: 'right' }}>{tier.features[row]}</span>
                </div>
              ))}
              <Link to="/contact" style={{ display: 'block', textAlign: 'center', marginTop: 20, background: tier.popular ? C.gold : 'transparent', color: tier.popular ? C.navy : C.gold, border: `2px solid ${C.gold}`, borderRadius: 999, padding: '11px 20px', fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.25s' }}>
                {tier.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
        <p className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} text-center mt-8`} style={{ fontFamily: FB, fontSize: '0.82rem', color: dark ? DARK.muted : C.muted }}>
          All tiers include onboarding support. No long-term contract. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

// ─── 7. FAQ ───────────────────────────────────────────────────────────────────
function PlatformFAQ() {
  const { dark } = useTheme()
  const [open, setOpen] = useState(0)
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[800px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>FAQ</p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', color: dark ? DARK.text : C.navy, marginBottom: 28 }}>Common Questions</h2>
        <div className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'}>
          {FAQS.map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${dark ? DARK.border : C.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '18px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.95rem', color: dark ? DARK.text : C.navy, lineHeight: 1.35 }}>{item.q}</span>
                {open === i ? <ChevronUp size={18} color={C.gold} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={C.muted} style={{ flexShrink: 0 }} />}
              </button>
              {open === i && <p style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.8, paddingBottom: 20 }}>{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 8. Deployment CTA ───────────────────────────────────────────────────────
function DeploymentCTA() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', position: 'relative', overflow: 'hidden' }}>
      <DotGrid opacity={0.1} />
      <div className="max-w-[700px] mx-auto px-6 text-center relative z-10">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>GET STARTED</p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'white', marginBottom: 14 }}>
          Ready to Deploy <span style={{ color: C.gold }}>HESABU</span>?
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, color: '#94A3B8', lineHeight: 1.8, marginBottom: 32 }}>
          HESABU can be onboarded and running your compliance cycle within 5 working days. No long-term contract. Cancel anytime.
        </p>
        <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap justify-center gap-4 mb-8`}>
          <Link to="/contact" style={{ background: C.gold, color: C.navy, borderRadius: 999, padding: '14px 30px', fontFamily: FB, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>Book a Demo</Link>
          <a href={`https://wa.me/254799644100?text=${encodeURIComponent('I\'d like to deploy HESABU — the compliance platform.')}`} target="_blank" rel="noopener noreferrer"
            style={{ background: 'transparent', color: '#25D366', border: '2px solid #25D366', borderRadius: 999, padding: '14px 30px', fontFamily: FB, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
            Chat on WhatsApp
          </a>
        </div>
        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} flex flex-wrap justify-center gap-6`}>
          {['Deployed in 5 business days', 'No long-term contract', 'Cancel anytime'].map(t => (
            <span key={t} style={{ fontFamily: FB, fontSize: '0.82rem', color: '#475569' }}>
              <CheckCircle size={13} color='#38BDF8' style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HesabuPlatformPage Root ──────────────────────────────────────────────────
export default function HesabuPlatformPage() {
  useDocumentMeta({
    title:       'HESABU Compliance Platform',
    description: 'Multi-agent Kenyan compliance platform combining PESA, MALIPO, and KODI under one orchestrator with live regulatory monitoring and immutable audit trails.',
    canonical:   'https://neurosparkcorporation.ai/platforms/hesabu',
  })

  return (
    <>
      {/* JSON-LD SoftwareApplication schema — injected inline */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'HESABU Compliance Platform',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', priceCurrency: 'KES', availability: 'https://schema.org/InStock' },
        description: 'Multi-agent Kenyan business compliance platform combining PESA (mobile payments reconciliation), MALIPO (payroll), and KODI (KRA tax compliance) under a single orchestrator with live regulatory monitoring and immutable audit trails.',
        provider: { '@type': 'Organization', name: 'Neurospark Corporation', url: 'https://neurosparkcorporation.ai' },
        featureList: [
          'PAYE, VAT, and WHT filing via KRA iTax',
          'Live NSSF/AHL/SHA regulatory status monitoring',
          'M-Pesa, Airtel Money, and bank reconciliation',
          'P10 CSV generation with SHA-256 verification',
          'Employee PIN validation before filing',
          'Immutable audit trail with session-level confirmations',
          'Multi-tenant support for accountants',
          'Monthly compliance workflow engine',
        ],
      }) }} />

      <PlatformHero />
      <WorkflowEngine />
      <RegulatoryMonitor />
      <HumanGate />
      <AuditTrail />
      <PlatformTiers />
      <PlatformFAQ />
      <DeploymentCTA />
    </>
  )
}

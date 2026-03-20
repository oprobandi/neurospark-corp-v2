/**
 * src/data/agents.js — v3.0
 *
 * Changes from v2.6:
 *   • WAZO added to AGENTS_FULL (13th agent) and AGENT_PREVIEWS (replaces SOKO)
 *   • 6 agent descriptions updated with V2/V3/V4 architecture-informed rewrites:
 *       PESA    → V2 HESABU orchestration language
 *       MALIPO  → V2 HESABU orchestration + regulatory monitor
 *       KODI    → V2 HESABU orchestration + human gate enforcement
 *       BIASHARA → V2 EACTIC-backed description
 *       Bidhaa  → V3 EACTIC-backed description
 *       SHAMBA  → V4 Supplier Basin Intelligence description
 *   • HESABU FAQ additions for PESA, MALIPO, KODI stored here as
 *     HESABU_PESA_FAQS, HESABU_MALIPO_FAQS, HESABU_KODI_FAQS
 *     (imported by AgentDetailPage and appended to base FAQs)
 *   Sources: agent-content-injection.md Track 1
 *
 * ADR-009: All agent data is single source of truth in this file.
 */

export const CATEGORY_META = {
  'Finance & Tax':       { color: '#3B82F6', bg: '#EFF6FF', label: 'Finance & Tax' },
  'Trade & Compliance':  { color: '#10B981', bg: '#ECFDF5', label: 'Trade & Compliance' },
  'Sector Intelligence': { color: '#F59E0B', bg: '#FFFBEB', label: 'Sector Intelligence' },
  'Customer Experience': { color: '#8B5CF6', bg: '#F5F3FF', label: 'Customer Experience' },
}

export const AGENT_CATEGORIES = ['All', 'Finance & Tax', 'Trade & Compliance', 'Sector Intelligence', 'Customer Experience']

// ─── Homepage preview cards (6 cards on MeetAgents section) ──────────────────
// v3.0: SOKO replaced by WAZO (higher-conversion for homepage — broader appeal)
export const AGENT_PREVIEWS = [
  { code:'PESA',    name:'Mobile Payments Reconciliation', meaning:'Pesa = Money',         category:'Finance & Tax',       tags:['M-Pesa','Reconciliation','HESABU'],   icon:'💳', desc:'Parses M-Pesa, Airtel Money, and bank statements, matches receipts to invoices, flags WHT obligations, and emits reconciliation events to the HESABU compliance platform — daily, before your team arrives.' },
  { code:'KODI',    name:'KRA Tax Compliance',             meaning:'Kodi = Tax',            category:'Finance & Tax',       tags:['iTax','VAT','PAYE','HESABU'],          icon:'📋', desc:'Files PAYE, VAT, WHT, and corporate tax via KRA iTax. Enforces explicit human confirmation before every KRA submission — no return is ever filed without it.' },
  { code:'MALIPO',  name:'Kenyan Payroll Compliance',      meaning:'Malipo = Payments',     category:'Finance & Tax',       tags:['NSSF','SHA','Payroll','HESABU'],       icon:'💼', desc:'Runs full Kenyan payroll with a live regulatory monitor that checks NSSF/AHL/SHA court order status at every session before computing a single deduction.' },
  { code:'BIASHARA',name:'East African Trade Compliance',  meaning:'Biashara = Business',   category:'Trade & Compliance',  tags:['EAC','COMESA','AfCFTA','EACTIC'],      icon:'🌍', desc:'Retrieves live tariff rates, HS classifications, and rules-of-origin outcomes from the EACTIC intelligence core — never from static training data.' },
  { code:'ZURI',    name:'Swahili Customer Service',       meaning:'Zuri = Good/Beautiful', category:'Customer Experience', tags:['Swahili','English','WhatsApp'],        icon:'🤝', desc:'Handles customer enquiries in English, Swahili and Sheng — 24/7, across WhatsApp, SMS, and web chat.' },
  { code:'WAZO',    name:'Startup Idea Validation',        meaning:'Wazo = Idea / Thought', category:'Sector Intelligence', tags:['Market Research','TAM/SAM/SOM','Founders'], icon:'💡', desc:'Takes a raw startup idea and stress-tests it against East African market realities — customer validation, competitive landscape, regulatory risk, and honest economics — before a shilling is spent on development.' },
]

// ─── Full 13-agent array (AgentsPage grid) ────────────────────────────────────
export const AGENTS_FULL = [
  // ── Finance & Tax ──────────────────────────────────────────────────────────
  {
    code: 'PESA', name: 'Mobile Payments Reconciliation', meaning: 'Pesa = Money',
    category: 'Finance & Tax', icon: '💳',
    tags: ['M-Pesa','Airtel Money','Reconciliation','Fintech','HESABU'],
    // v3.0: V2 HESABU-orchestration description
    desc: 'Parses M-Pesa, Airtel Money, and bank statements, matches receipts to invoices, flags WHT obligations on B2C disbursements, and emits structured reconciliation events to the HESABU compliance platform. Produces audit-ready reports with SHA-256 verified transaction chains — daily, before your team arrives.',
    slug: 'pesa',
  },
  {
    code: 'KODI', name: 'KRA Tax Compliance', meaning: 'Kodi = Tax',
    category: 'Finance & Tax', icon: '📋',
    tags: ['KRA','iTax','VAT','PAYE','WHT','HESABU'],
    // v3.0: V2 HESABU-orchestration description
    desc: 'Files PAYE (P10), VAT, WHT, TOT, and corporate tax returns via KRA iTax. Receives verified P10 files from MALIPO, validates every employee PIN before filing, enforces explicit human confirmation before any KRA submission, and documents iTax portal downtime with timestamps as a late-filing defence.',
    slug: 'kodi',
  },
  {
    code: 'MALIPO', name: 'Kenyan Payroll Compliance', meaning: 'Malipo = Payments',
    category: 'Finance & Tax', icon: '💼',
    tags: ['NSSF','SHA','Housing Levy','PAYE','P10','HESABU'],
    // v3.0: V2 HESABU-orchestration + regulatory monitor description
    desc: 'Runs full Kenyan payroll — PAYE, NSSF (old and new act rate monitoring), SHA/SHIF at 2.75%, and Affordable Housing Levy — with a live regulatory monitor that checks court order status on NSSF and AHL at every session before computing deductions. Generates P10 CSV in KRA\'s exact iTax upload format with SHA-256 checksum verification.',
    slug: 'malipo',
  },
  {
    code: 'Mkopo', name: 'SME Lending Eligibility', meaning: 'Mkopo = Loan',
    category: 'Finance & Tax', icon: '🏦',
    tags: ['Credit','Lenders','SME Finance','CRB'],
    desc: 'Screens your business against Kenyan lender criteria, identifies your best funding matches, and prepares a loan-readiness dossier. Covers banks, SACCOs, DFIs, and digital lenders active in East Africa.',
    slug: 'mkopo',
  },
  {
    code: 'DHAMINI', name: 'NSE Investment Research', meaning: 'Dhamini = Security/Guarantee',
    category: 'Finance & Tax', icon: '📈',
    tags: ['NSE','EAC Capital Markets','Equities','Research'],
    desc: 'Delivers daily equity research briefs on Nairobi Securities Exchange listed companies. Monitors price movements, dividend announcements, and analyst consensus for East African capital market participants.',
    slug: 'dhamini',
  },
  // ── Trade & Compliance ─────────────────────────────────────────────────────
  {
    code: 'BIASHARA', name: 'East African Trade Compliance', meaning: 'Biashara = Business/Trade',
    category: 'Trade & Compliance', icon: '🌍',
    tags: ['EAC','COMESA','AfCFTA','Customs','EACTIC'],
    // v3.0: V2 EACTIC-backed description
    desc: 'Retrieves live tariff rates, HS classifications, rules-of-origin outcomes, and NTB registry data from the EACTIC intelligence core — never from static training data. Covers EAC, COMESA, AfCFTA, EU-EPA, AGOA, and bilateral frameworks. Identifies the most favourable applicable framework before advising.',
    slug: 'biashara',
  },
  {
    code: 'Bidhaa', name: 'Export Market Intelligence', meaning: 'Bidhaa = Goods/Products',
    category: 'Trade & Compliance', icon: '📦',
    tags: ['Export','Market Access','Standards','KEBS','EACTIC'],
    // v3.0: V3 EACTIC-backed description
    desc: 'Scores Kenyan exporters on export readiness across certification, documentation, product compliance, and buyer intelligence — pulling live tariff rates and AGOA/EUDR regulatory alerts from EACTIC. Honest when a business is not ready; specific about the 3-step certification path when it is. Covers EU, US, UAE, and EAC destination markets.',
    slug: 'bidhaa',
  },
  {
    code: 'Soko', name: 'Government Tender & Procurement', meaning: 'Soko = Market/Marketplace',
    category: 'Trade & Compliance', icon: '🏛️',
    tags: ['PPADA','Tenders','Procurement','Government'],
    desc: 'Tracks open government tenders across Kenya\'s national and county procurement portals, evaluates bid eligibility, and prepares PPADA-compliant submission packages — so you never miss a contract opportunity.',
    slug: 'soko',
  },
  {
    code: 'Ruhusa', name: 'County Business Licensing', meaning: 'Ruhusa = Permit/Permission',
    category: 'Trade & Compliance', icon: '📜',
    tags: ['County','Licenses','By-Laws','Permits'],
    desc: 'Maps the licensing requirements for your business across all 47 Kenyan counties, tracks renewal deadlines, and prepares permit applications aligned to county by-laws — eliminating compliance surprises.',
    slug: 'ruhusa',
  },
  // ── Sector Intelligence ────────────────────────────────────────────────────
  {
    code: 'SHAMBA', name: 'Agriculture Supply Chain', meaning: 'Shamba = Farm/Field',
    category: 'Sector Intelligence', icon: '🌾',
    tags: ['Agri','EAGC','KMD','KEPHIS','Commodity Prices'],
    // v3.0: V4 Supplier Basin Intelligence description
    desc: 'Monitors commodity prices at farm gate, aggregation point, Mombasa Tea Auction, and Nairobi Coffee Exchange simultaneously. Tracks supplier basin health via Sentinel-2 NDVI satellite imagery, KMD weather forecasts, and ENSO seasonal projections. Built for agribusiness operators — cooperatives, processors, aggregators, and exporters.',
    slug: 'shamba',
  },
  {
    code: 'Ardhi', name: 'Kenya Real Estate Intelligence', meaning: 'Ardhi = Land/Earth',
    category: 'Sector Intelligence', icon: '🏠',
    tags: ['Real Estate','Valuation','Nairobi','Planning'],
    desc: 'Delivers real-time Kenyan property market data, automated valuations for residential and commercial units, planning compliance checks, and investment opportunity alerts across Nairobi, Mombasa, and major upcountry markets.',
    slug: 'ardhi',
  },
  {
    code: 'ZURI', name: 'Swahili Customer Service', meaning: 'Zuri = Good / Beautiful',
    category: 'Customer Experience', icon: '🤝',
    tags: ['Swahili','English','Sheng','WhatsApp','Customer Support'],
    desc: 'Handles customer enquiries, complaints, and sales conversations in English, Swahili, and Sheng — 24/7, across WhatsApp, SMS, and web chat. Trained on East African business culture, not a Western call-centre script.',
    slug: 'zuri',
  },
  // ── v3.0: WAZO — 13th agent ───────────────────────────────────────────────
  {
    code: 'WAZO', name: 'Startup Idea Validation', meaning: 'Wazo = Idea / Thought',
    category: 'Sector Intelligence', icon: '💡',
    tags: ['Market Research','TAM/SAM/SOM','Founder Tools','East Africa'],
    desc: 'Takes a raw startup idea and stress-tests it against East African market realities — customer validation, competitive landscape, regulatory risk, and honest economics — before a shilling is spent on development.',
    slug: 'wazo',
  },
]

// ─── HESABU Platform — additional FAQs for PESA, MALIPO, KODI ────────────────
// These are appended to the base FAQs in AgentDetailPage.jsx
// Source: agent-content-injection.md Track 1 "Enhanced Detail Content"
export const HESABU_PESA_FAQS = [
  {
    q: 'How does PESA handle B2C disbursements for WHT purposes?',
    a: 'PESA flags every M-Pesa B2C payment that breaches the KES 24,000/year WHT threshold and emits a structured event to KODI for withholding tax assessment. This catches payments that should attract WHT but are often missed in manual reconciliation.',
  },
  {
    q: 'Can PESA handle businesses with both a Paybill and Till numbers?',
    a: 'Yes. PESA supports any combination of Paybill accounts, Till numbers, and bank accounts — reconciling them separately and in consolidated views within the same daily report.',
  },
  {
    q: 'Does PESA detect fraud patterns across M-Pesa transactions?',
    a: 'Yes. PESA maintains a fraud pattern store across sessions — flagging velocity anomalies, duplicate credits, and reversal abuse patterns. Detected patterns persist across sessions so recurring fraud risks are surfaced on every reconciliation run.',
  },
]

export const HESABU_MALIPO_FAQS = [
  {
    q: 'How does MALIPO handle the NSSF old-act vs. new-act dispute?',
    a: 'At every session start, MALIPO\'s regulatory monitor checks the current court order status for NSSF implementation. If the status is contested or unknown, MALIPO presents both rate scenarios to the employer, requires explicit selection, and logs the choice in an immutable audit record before computing a single deduction.',
  },
  {
    q: 'What happens if AHL is stayed by a court order on the day payroll runs?',
    a: 'MALIPO sets AHL deductions to KES 0.00 when the regulatory monitor confirms a court stay, labels the payslip accordingly, and documents the regulatory assumption used. When the stay is lifted, MALIPO updates automatically at the next session without manual intervention.',
  },
  {
    q: 'Does MALIPO validate employee KRA PINs before generating the P10?',
    a: 'Yes. Every employee PIN is validated against the KRA format (AXXXXXXXXXA) and cross-checked before the P10 CSV is generated. MALIPO will not emit a P10 ready for filing with unvalidated PINs unless the employer explicitly overrides and accepts the iTax rejection risk.',
  },
  {
    q: 'How does MALIPO compute tax for directors receiving fees rather than salary?',
    a: 'Directors\' fees are treated as taxable emoluments subject to PAYE — not dividends. MALIPO flags any director arrangement that appears to substitute dividends for fees (a KRA audit priority) and requires the employer to confirm the treatment before processing.',
  },
]

export const HESABU_KODI_FAQS = [
  {
    q: 'Does KODI file returns without human review?',
    a: 'Never. KODI enforces a human gate before every KRA submission — presenting a structured filing review, requiring the employer to type explicit confirmation, and logging the confirmation timestamp and session ID in an immutable audit record. No return is filed from an ambiguous or vague response.',
  },
  {
    q: 'What does KODI do if iTax is down on a filing deadline?',
    a: 'KODI documents the failed filing attempt with a precise timestamp, emits an iTax downtime record to the audit log (which KRA accepts as a late-filing defence), and provides manual filing instructions immediately — so the employer can file as soon as the portal recovers without losing the defence window.',
  },
  {
    q: 'Can KODI handle P10 amendments after an incorrect payroll run?',
    a: 'Yes. When MALIPO issues a corrected P10, KODI receives it with the original acknowledgement number, presents an amendment review to the employer, and files the amendment via iTax — with the original and amended ack numbers stored in the audit chain for KRA traceability.',
  },
  {
    q: 'Does KODI flag when employee headcount on the P10 differs from NSSF records?',
    a: 'Yes. A headcount mismatch between PAYE and NSSF/SHA records is a known KRA audit trigger. KODI surfaces this discrepancy with the most common causes and holds filing until the employer resolves or explains the difference.',
  },
]

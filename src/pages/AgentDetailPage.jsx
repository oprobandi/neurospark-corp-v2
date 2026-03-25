/**
 * AgentDetailPage.jsx — /agents/:slug — v3.0
 *
 * Place at: src/pages/AgentDetailPage.jsx
 *
 * Add to App.jsx routes:
 *   import AgentDetailPage from './pages/AgentDetailPage'
 *   <Route path="/agents/:slug" element={<AgentDetailPage />} />
 *
 * One template handles all 12 agents.
 * Sections per page:
 *   1. AgentHero       — split layout, terminal preview, stat chips
 *   2. ProblemBlock    — editorial prose, off-white
 *   3. CapabilitiesGrid — 6-card grid, navy
 *   4. ToolsIntegrations — icon chips
 *   5. AgentWorkflow   — numbered steps with connectors
 *   6. UseCases        — 2-3 scenario cards
 *   7. SampleOutput    — terminal/card mock with blur overlay
 *   8. FAQ             — accordion
 *   9. DeploymentCTA   — final navy section
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentMeta, useDocumentTitle } from '../hooks/useDocumentMeta'
import { HESABU_PESA_FAQS, HESABU_MALIPO_FAQS, HESABU_KODI_FAQS } from '../data/agents'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FONT_DISPLAY = FONTS.display
const FONT_BODY    = FONTS.body
const FONT_MONO    = FONTS.mono

import {
  ChevronDown, ChevronUp, ArrowLeft, CheckCircle,
  Zap, Shield, Globe, FileText, BarChart2, Briefcase,
  Lock, Package, MessageCircle, Leaf, Building2,
  ExternalLink, Clock, MapPin, Users, TrendingUp,
} from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────

// ─── Full agent data catalogue ────────────────────────────────────────────────
const AGENTS = {
  pesa: {
    code:    'PESA',
    name:    'Mobile Payments Reconciliation',
    meaning: 'Pesa = Money',
    tagline: 'Every shilling accounted for — automatically, every day.',
    category:'Finance & Tax',
    icon:    '💳',
    chips:   ['24/7 Reconciliation', 'Built for Kenya', 'Zero Manual Entry'],
    terminalLines: [
      '> PESA Agent — Reconciliation Run: 06:00 EAT',
      '> Connecting to M-Pesa Business API...',
      '  ✓ 847 transactions fetched (23 Jun)',
      '> Connecting to Airtel Money...',
      '  ✓ 312 transactions fetched (23 Jun)',
      '> Cross-referencing against QuickBooks ledger...',
      '  ✓ 1,143 entries matched',
      '  ⚠  14 discrepancies flagged',
      '     → KES 43,200 unmatched credit (ref: BC927X)',
      '     → 3 reversed transactions pending',
      '> Generating reconciliation report...',
      '  ✓ Report saved: recon_2024-06-23.pdf',
      '> Float balance: KES 2,847,500  [HEALTHY]',
      '> Next run: 18:00 EAT',
    ],
    problem: {
      headline: 'Your finance team spends Friday afternoons doing what a machine should do in 90 seconds.',
      body: [
        'Mobile money is the backbone of Kenyan commerce — but reconciling M-Pesa Business, Airtel Money, and T-Kash against your accounting system is a different story entirely. Each platform has its own export format, its own transaction identifiers, and its own quirks when reversals, refunds, and float corrections enter the picture. Most businesses end up with a dedicated person — or two — whose main job is reconciling mobile money. That is not a business process. That is a gap in your tooling.',
        'The consequences compound. Undetected discrepancies accumulate for weeks before someone catches them during a month-end scramble. Float positions go unmonitored until there is a shortfall. Audit trails are patchwork spreadsheets that nobody fully trusts. When KRA requests documentation, the scramble begins — and what should take hours takes days.',
        'PESA was built specifically for the structural complexity of Kenyan mobile money infrastructure. It connects to your payment platforms, maps every transaction type, and produces a reconciliation your CFO can stake their signature on — daily, automatically, before your team arrives at the office.',
      ],
    },
    capabilities: [
      { icon: '⚡', title: 'Reconciliation Engine',     desc: 'Matches transactions across M-Pesa, Airtel Money, and T-Kash against your accounting system in under 90 seconds.' },
      { icon: '🔍', title: 'Discrepancy Detection',     desc: 'Flags unmatched credits, reversed transactions, and duplicate entries with full transaction context for fast resolution.' },
      { icon: '📱', title: 'Multi-Platform Support',    desc: 'Native integration with M-Pesa Business, Airtel Money Business, T-Kash, and major Kenyan bank APIs.' },
      { icon: '📄', title: 'Audit Trail Generation',    desc: 'Produces structured, timestamped PDF and CSV reconciliation reports ready for KRA or external audit review.' },
      { icon: '💰', title: 'Float Management Monitor',  desc: 'Tracks float positions across all accounts in real time and alerts your team before balances reach critical thresholds.' },
      { icon: '📊', title: 'Exception Reporting',       desc: 'Summarises all open exceptions in a daily digest sent via email or WhatsApp — zero inbox hunting required.' },
    ],
    tools: ['M-Pesa Business API', 'Airtel Money', 'T-Kash', 'QuickBooks', 'Xero', 'Sage', 'Excel / CSV Export', 'WhatsApp Notify', 'Email SMTP'],
    workflow: [
      { step: 1, title: 'Connect Platforms',     desc: 'Link your M-Pesa Business, Airtel Money, and bank accounts via secure API credentials — one-time setup.' },
      { step: 2, title: 'Agent Fetches Daily',   desc: 'PESA pulls transaction records from all connected platforms every morning (and optionally every evening).' },
      { step: 3, title: 'Cross-Reference',       desc: 'Every mobile money transaction is matched against your accounting ledger entries using multi-point identifiers.' },
      { step: 4, title: 'Flag Exceptions',       desc: 'Unmatched items are isolated and surfaced with full context — amount, date, reference, platform, and suggested action.' },
      { step: 5, title: 'Deliver Report',        desc: 'A clean reconciliation PDF and exception summary is sent to your inbox or WhatsApp before 7 AM EAT.' },
    ],
    useCases: [
      {
        persona:  'Logistics Company — Nairobi, 28 Drivers',
        problem:  'The accounts team spent every Friday manually matching 400+ M-Pesa payments from drivers against delivery manifests. Mistakes were common, and two full days of overtime per month were the norm. An undetected KES 180,000 discrepancy sat unresolved for six weeks before it was caught.',
        outcome:  'PESA now reconciles driver payments in under two minutes each morning. Discrepancies are flagged the same day they occur. The accounts team redirected 16 hours per month toward financial analysis instead of data entry — and the six-week discrepancy problem has not recurred once in seven months.',
      },
      {
        persona:  'Retail Chain — 4 Branches, Karen & CBD',
        problem:  'Four branches processing M-Pesa, Airtel Money, and cash created a reconciliation nightmare. Each branch manager sent WhatsApp screenshots of till totals. Head office consolidated everything manually each Monday, and the consolidated view was always at least a week behind reality.',
        outcome:  'PESA consolidates all four branches into a single real-time dashboard. The Monday reconciliation meeting now takes 20 minutes instead of half a day, and the CFO has live float visibility across all locations from a single report.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  PESA RECONCILIATION REPORT — 23 JUN 2024           │',
      '│  Generated: 06:14 EAT  |  Period: 22 Jun 18:00–     │',
      '│                            23 Jun 06:00 EAT          │',
      '├─────────────────────────────────────────────────────┤',
      '│  SUMMARY                                            │',
      '│  Total Transactions:    1,159                        │',
      '│  Matched:               1,145  (98.8%)              │',
      '│  Exceptions:               14  (1.2%)               │',
      '│  Net Float Position:  KES 2,847,500                 │',
      '├─────────────────────────────────────────────────────┤',
      '│  EXCEPTIONS REQUIRING ACTION                        │',
      '│  [HIGH] BC927X — KES 43,200 unmatched credit        │',
      '│         Platform: M-Pesa  |  Time: 22:14 EAT        │',
      '│         Suggested: Verify against PO #4421          │',
      '│  [MED]  3 reversed txns pending 24h settlement      │',
      '│  [LOW]  10 duplicate reference warnings             │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Which mobile money platforms does PESA support?',    a: 'PESA currently integrates with M-Pesa Business, Airtel Money Business, and T-Kash. Bank integrations (Equity, KCB, Co-op, Absa) are available as add-ons.' },
      { q: 'Does PESA connect to my accounting software?',       a: 'Yes — PESA integrates natively with QuickBooks, Xero, and Sage. For other systems we provide a structured CSV export that maps to your chart of accounts.' },
      { q: 'How does PESA handle M-Pesa reversals?',            a: 'PESA tracks reversals separately, flags them in the exception report, and adjusts the ledger match accordingly — preventing double-counting.' },
      { q: 'Is my M-Pesa API access secure with PESA?',         a: 'All API credentials are encrypted at rest and in transit. PESA uses read-only API tokens — it cannot initiate payments on your behalf.' },
      { q: 'Can PESA reconcile multiple branches separately?',   a: 'Yes. PESA supports multi-location setups, producing both per-branch and consolidated reports in the same daily run.' },
      { q: 'What happens if a platform API goes down overnight?', a: 'PESA queues the reconciliation and processes it as soon as the API recovers, flagging the delay in the report. You\'re never left with a silent failure.' },
    ],
    // v3.0: HESABU-orchestration FAQs appended (agent-content-injection.md Track 1B)
    hesabuFaqs: HESABU_PESA_FAQS,
  },

  kodi: {
    code:    'KODI',
    name:    'KRA Tax Compliance',
    meaning: 'Kodi = Tax',
    tagline: 'Never miss a KRA deadline. Never pay a late penalty again.',
    category:'Finance & Tax',
    icon:    '📋',
    chips:   ['KRA Integrated', 'Penalty Prevention', 'All Tax Types'],
    terminalLines: [
      '> KODI Agent — Compliance Check: Daily 07:00 EAT',
      '> Fetching KRA obligation calendar...',
      '  ✓ VAT Return due: 20 Jul (27 days)',
      '  ✓ PAYE due: 9 Jul (16 days)',
      '  ✓ WHT Return due: 20 Jul (27 days)',
      '  ⚠  Corporate Tax instalment: 30 Jun (7 days)',
      '> Connecting to eTIMS for invoice validation...',
      '  ✓ 142 invoices validated this month',
      '  ⚠  3 supplier invoices missing eTIMS codes',
      '> Preparing PAYE return draft...',
      '  ✓ 34 employees processed',
      '  ✓ Draft saved for review',
      '> WhatsApp alert sent to CFO: 7-day tax notice',
      '> Next compliance window: PAYE filing in 16 days',
    ],
    problem: {
      headline: 'Most Kenyan businesses miss KRA deadlines not from negligence — but from complexity.',
      body: [
        "iTax's interface is unforgiving. Overlapping obligation calendars — VAT on the 20th, PAYE on the 9th, corporate tax instalments quarterly, withholding tax on its own schedule — create a compliance landscape that requires constant, expert attention. Most businesses either hire a dedicated tax compliance officer, pay a tax firm a significant monthly retainer, or — most commonly — fall behind and absorb the penalties quietly.",
        "The cost of those penalties adds up fast. A single late VAT return attracts a 5% penalty on the unpaid tax plus 1% interest per month. Multiply that across VAT, PAYE, and WHT across a year of imperfect compliance, and a business paying KES 200,000 in monthly taxes could easily be losing KES 80,000–120,000 annually to avoidable late fees. That is not a compliance problem. It is a cash flow leak.",
        "KODI monitors your entire KRA obligation calendar, prepares return drafts from your accounting data, alerts your team with enough lead time to review and file, and maintains a complete audit-ready compliance record. It does not replace your accountant — it makes your accountant's job easier and your exposure to penalty risk essentially zero.",
      ],
    },
    capabilities: [
      { icon: '📅', title: 'Obligation Calendar',      desc: 'Tracks all your KRA filing deadlines across VAT, PAYE, WHT, corporate tax, and instalment payments — with tiered alerts.' },
      { icon: '📝', title: 'Return Draft Preparation', desc: 'Pulls figures from your accounting system and pre-populates iTax return formats for your accountant to review and submit.' },
      { icon: '🔗', title: 'eTIMS Integration',        desc: 'Validates supplier and customer invoices against KRA eTIMS — catching non-compliant invoices before they create an audit issue.' },
      { icon: '⚠️', title: 'Penalty Risk Monitoring',  desc: 'Calculates the financial exposure of any upcoming deadline breach and escalates urgency as filing windows narrow.' },
      { icon: '📊', title: 'Compliance Dashboard',     desc: 'A clean monthly compliance scorecard — filed, pending, and overdue — for your board pack or management accounts.' },
      { icon: '🔔', title: 'Multi-Channel Alerts',     desc: 'Sends deadline reminders via WhatsApp, email, and in-app — 14 days, 7 days, 3 days, and 24 hours before each deadline.' },
    ],
    tools: ['KRA iTax Portal', 'KRA eTIMS', 'PAYE Online', 'QuickBooks', 'Xero', 'Sage', 'WhatsApp Business API', 'Email SMTP'],
    workflow: [
      { step: 1, title: 'Map Your Obligations',   desc: 'KODI profiles your business — tax type registrations, sector, and filing frequencies — to build your obligation calendar.' },
      { step: 2, title: 'Monitor Daily',          desc: 'Every morning, KODI checks all upcoming deadlines and triggers an alert chain if any window is approaching critical.' },
      { step: 3, title: 'Prepare Drafts',         desc: 'KODI pulls your accounting data and pre-populates return templates 10 days before each deadline, ready for accountant review.' },
      { step: 4, title: 'Alert & Escalate',       desc: 'Tiered WhatsApp and email alerts go to your accountant and CFO at 14, 7, 3, and 1 day before each filing deadline.' },
      { step: 5, title: 'Log Compliance Record',  desc: 'Every filed return is logged with date, amount, and confirmation reference — building your audit-ready compliance history.' },
    ],
    useCases: [
      {
        persona:  'Import/Export Business — 3 Directors, Mombasa',
        problem:  'The company had VAT, WHT, and corporate tax obligations across two registered entities. Their external accountant managed compliance reactively — filing was often late, and KES 340,000 in penalties had accumulated over 18 months without anyone flagging the pattern.',
        outcome:  'KODI mapped both entities\' complete obligation calendars and set up alert chains to both directors and the accountant. In the first quarter under KODI, zero late filings occurred. The penalty run-rate dropped from KES 22,000/month to zero.',
      },
      {
        persona:  'Tech Startup — Nairobi, 14 Staff',
        problem:  'A fast-growing startup with changing payroll figures missed PAYE filings twice in six months because no one owned the compliance task clearly. The founders were focused on fundraising, not tax calendars.',
        outcome:  'KODI now owns the PAYE preparation cycle end-to-end. It prepares the draft from their Xero payroll data, sends it to their accountant for a 10-minute review, and the accountant files. The founders have not thought about PAYE in four months.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  KODI COMPLIANCE CALENDAR — JULY 2024               │',
      '│  Entity: Acme Trading Ltd  |  KRA PIN: P051XXXXX    │',
      '├──────────────────┬────────────┬──────────┬──────────┤',
      '│  OBLIGATION      │  DUE DATE  │  STATUS  │  ACTION  │',
      '├──────────────────┼────────────┼──────────┼──────────┤',
      '│  PAYE (Jun)      │  09 Jul    │  DRAFT ✓ │  Review  │',
      '│  VAT (Jun)       │  20 Jul    │  PENDING │  27 days │',
      '│  WHT (Jun)       │  20 Jul    │  PENDING │  27 days │',
      '│  Corp Tax Inst.  │  30 Jun    │  ⚠ 7 DAY │  URGENT  │',
      '├──────────────────┴────────────┴──────────┴──────────┤',
      '│  eTIMS ALERTS                                       │',
      '│  3 supplier invoices missing eTIMS validation codes │',
      '│  Suppliers: Mega Supplies Ltd, JK Freight, Omni Co  │',
      '│  Action: Request eTIMS-compliant invoices           │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Does KODI file returns directly on my behalf?',         a: 'KODI prepares and drafts returns but requires a human accountant or director to review and submit on iTax. This is by design — your accountant retains professional responsibility for filings.' },
      { q: 'Which KRA tax types does KODI cover?',                   a: 'VAT, PAYE, Corporate Tax (including instalments), Withholding Tax, and Advance Tax for sole proprietors. Turnover Tax (TOT) support is in active development.' },
      { q: 'Can KODI handle multiple registered entities?',          a: 'Yes. KODI supports multiple KRA PINs under one account, with separate obligation calendars and consolidated reporting across entities.' },
      { q: 'What happens if KRA changes a deadline?',               a: 'KODI monitors KRA portal announcements and gazette notices. When deadlines shift — as they sometimes do at month-end — KODI updates your calendar automatically and re-triggers alerts.' },
      { q: 'Does KODI connect to my accounting software?',          a: 'KODI integrates with QuickBooks, Xero, and Sage to pull figures for return preparation. For other systems, a structured CSV upload is available.' },
      { q: 'Is my KRA login credential stored by KODI?',            a: 'No. KODI uses a read-only API integration where available, and iTax agent credentials for preparation only. Submission requires your own login — KODI cannot and does not store your iTax password.' },
    ],
    hesabuFaqs: HESABU_KODI_FAQS,
  },

  malipo: {
    code:    'MALIPO',
    name:    'Kenyan Payroll Compliance',
    meaning: 'Malipo = Payments / Wages',
    tagline: 'Compliant Kenyan payroll — calculated, filed, and dispatched without lifting a finger.',
    category:'Finance & Tax',
    icon:    '💼',
    chips:   ['NSSF & NHIF Ready', 'P9 Generation', 'iTax PAYE Filing'],
    terminalLines: [
      '> MALIPO Agent — June 2024 Payroll Run',
      '> Loading employee roster: 34 staff',
      '> Applying statutory deductions...',
      '  ✓ NSSF: Tier I + Tier II calculated',
      '  ✓ SHA (NHIF): New rates applied',
      '  ✓ Housing Levy: 1.5% employer + employee',
      '  ✓ PAYE: Graduated tax table applied',
      '> Generating payslips (34)...',
      '  ✓ Payslips generated',
      '> Preparing PAYE return for iTax...',
      '  ✓ P10 form populated',
      '> Preparing P9 annual deductions card...',
      '  ✓ All employees (YTD values updated)',
      '> Sending payslips via WhatsApp...',
      '  ✓ 34/34 delivered  |  07:02 EAT',
    ],
    problem: {
      headline: 'Kenyan payroll compliance is not complicated because it is hard. It is complicated because the rules change constantly — and the penalties for getting it wrong are severe.',
      body: [
        'The 2023 Finance Act rewrote housing levy obligations. NHIF became SHA. NSSF contributions went through contested court challenges that created uncertainty for months. Any business running payroll through a spreadsheet or a basic accounting tool without Kenya-specific statutory logic is likely getting at least one line wrong — right now — without knowing it.',
        'The error compounds each month. Underpaid NSSF contributions accumulate into a liability. Incorrect PAYE calculations result in either over-taxing employees who then expect refunds you cannot easily process, or under-taxing them and creating a KRA exposure at year-end. P9 generation in January becomes a crisis exercise in back-calculation rather than a routine output.',
        'MALIPO is maintained to track every update to Kenya\'s statutory payroll landscape — NSSF, SHA, Housing Levy, PAYE graduated rates, and the relevant Finance Act provisions. It processes your payroll monthly, produces compliant payslips, prepares your PAYE return for iTax, and generates P9 forms at year-end. Your payroll runs are correct, on time, and documented.',
      ],
    },
    capabilities: [
      { icon: '🏛️', title: 'Statutory Calculation Engine', desc: 'Calculates NSSF Tier I & II, SHA/NHIF, Housing Levy (employer + employee), and PAYE using current graduated tax tables.' },
      { icon: '📄', title: 'P9 Annual Cards',              desc: 'Generates individual employee P9 deduction cards at year-end with cumulative YTD figures ready for personal tax returns.' },
      { icon: '📮', title: 'PAYE Return Preparation',      desc: 'Produces a complete P10 PAYE return pre-filled with employer and employee figures for accountant review and iTax submission.' },
      { icon: '📱', title: 'Payslip Dispatch',             desc: 'Sends password-protected payslips to employees via WhatsApp or email — individually, automatically, on payroll run day.' },
      { icon: '📅', title: 'Payroll Calendar Management',  desc: 'Manages cut-off dates, approval reminders, and filing deadlines — keeping the whole payroll cycle on track each month.' },
      { icon: '⚙️', title: 'Statutory Rate Maintenance',   desc: 'Maintained and updated as Kenya\'s statutory rates change — no manual table updates or compliance guesswork needed.' },
    ],
    tools: ['KRA iTax (PAYE Portal)', 'NSSF Online Portal', 'SHA Portal', 'QuickBooks Payroll', 'Sage Payroll', 'WhatsApp Business API', 'Email SMTP', 'Excel / CSV'],
    workflow: [
      { step: 1, title: 'Load Employee Data',      desc: 'Connect your HR system or upload a payroll roster — MALIPO holds employee records, salary bands, and allowance structures.' },
      { step: 2, title: 'Compute Statutory Deductions', desc: 'MALIPO calculates NSSF, SHA, Housing Levy, and PAYE for every employee using current statutory tables — automatically.' },
      { step: 3, title: 'Generate Payslips',       desc: 'Individual, branded payslips are generated in PDF and queued for dispatch immediately after your payroll approval.' },
      { step: 4, title: 'Prepare PAYE Return',     desc: 'MALIPO populates the P10 iTax return with employer and employee totals, ready for your accountant to review and file by the 9th.' },
      { step: 5, title: 'Dispatch & Archive',      desc: 'Payslips are sent to employees via WhatsApp or email. All payroll records are archived for KRA audit access at any time.' },
    ],
    useCases: [
      {
        persona:  'Construction Firm — 67 Employees, Kiambu',
        problem:  'A combination of casual labourers and salaried staff created payroll complexity the owner could not manage alone. NSSF Tier II calculations after the 2023 court rulings were being applied inconsistently, and a KRA audit risk had been flagged by their external accountant.',
        outcome:  'MALIPO segmented employees by category, applied correct NSSF logic for each tier, and produced a clean compliance history going forward. The audit risk was resolved, and the monthly payroll cycle now takes the owner\'s accountant 25 minutes to approve rather than two days to prepare.',
      },
      {
        persona:  'NGO — Nairobi, 22 Staff on Donor Payroll',
        problem:  'Donor-funded staff had different benefit structures, some tax-exempt and some not. The NGO was applying a blanket PAYE calculation that was over-taxing exempt allowances — creating a growing refund liability to employees and a reputational issue.',
        outcome:  'MALIPO configured separate payroll tracks for exempt and non-exempt categories, corrected the deduction logic, and recalculated YTD P9 values for all 22 staff. The refund liability was quantified and settled cleanly, and the June year-end P9 run took four minutes.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  MALIPO PAYSLIP — June 2024                         │',
      '│  Employee: Jane Wanjiku  |  ID: EMP-042             │',
      '│  Department: Operations  |  Payment: 28 Jun         │',
      '├─────────────────────────────────────────────────────┤',
      '│  EARNINGS                                           │',
      '│  Basic Salary:              KES   85,000            │',
      '│  House Allowance:           KES   15,000            │',
      '│  Transport Allow:           KES    5,000            │',
      '│  Gross Pay:                 KES  105,000            │',
      '├─────────────────────────────────────────────────────┤',
      '│  STATUTORY DEDUCTIONS                               │',
      '│  PAYE:                      KES   22,460            │',
      '│  NSSF (Tier I + II):        KES    2,160            │',
      '│  SHA (NHIF):                KES      500            │',
      '│  Housing Levy (1.5%):       KES    1,575            │',
      '│  Total Deductions:          KES   26,695            │',
      '├─────────────────────────────────────────────────────┤',
      '│  NET PAY:                   KES   78,305            │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Does MALIPO handle casual workers differently from permanent staff?',  a: 'Yes. MALIPO supports separate payroll tracks for permanent, contract, and casual employees — with the correct NSSF tier and PAYE logic applied to each category.' },
      { q: 'Is MALIPO updated when statutory rates change?',                       a: 'Yes. When KRA, NSSF, or SHA announce rate changes, MALIPO is updated before the next payroll run — no manual table entry required.' },
      { q: 'Can MALIPO generate P9 forms for all employees at year-end?',          a: 'Yes. MALIPO produces individual P9 annual deduction cards with cumulative YTD figures for all employees, ready for personal tax return filing in January.' },
      { q: 'What HR or payroll systems does MALIPO connect to?',                   a: 'MALIPO integrates with QuickBooks Payroll, Sage Payroll, and Odoo HR. For other systems, a structured CSV roster upload is available.' },
      { q: 'Does MALIPO submit PAYE to iTax directly?',                            a: 'MALIPO prepares and populates the P10 return but requires your accountant or payroll officer to review and submit on iTax. This preserves professional oversight.' },
      { q: 'Can MALIPO handle multi-currency payroll for international staff?',    a: 'MALIPO handles KES-denominated payroll natively. Multi-currency payroll (USD, EUR) with KRA currency conversion rules is available on the Enterprise plan.' },
    ],
  },

  mkopo: {
    code:    'Mkopo',
    name:    'SME Lending Eligibility',
    meaning: 'Mkopo = Loan / Credit',
    tagline: 'Know exactly which Kenyan lenders will fund you — before you apply.',
    category:'Finance & Tax',
    icon:    '🏦',
    chips:   ['60+ Kenyan Lenders', 'CRB Aware', 'Loan-Ready in Weeks'],
    terminalLines: [
      '> Mkopo Agent — Lending Eligibility Assessment',
      '> Business Profile: Acme Electronics Ltd',
      '> Analysing financial statements (3yr)...',
      '  ✓ Revenue trend: +28% YoY',
      '  ✓ Debt-to-equity: 0.42 (healthy)',
      '  ✓ Current ratio: 1.8 (acceptable)',
      '> Checking CRB status...',
      '  ✓ No adverse listings found',
      '> Matching against 64 Kenyan lenders...',
      '  ✓ 12 lenders: high probability match',
      '  ✓  8 lenders: medium probability match',
      '> Top match: KCB SME Loan (KES 2M–15M)',
      '  Pre-qualification score: 87/100',
      '> Generating loan-readiness dossier...',
      '  ✓ Document checklist prepared',
    ],
    problem: {
      headline: 'Most Kenyan SMEs are more fundable than they think. They just don\'t know which door to knock on — or how to present themselves when it opens.',
      body: [
        'Access to credit is one of the defining constraints for East African SMEs — not because capital isn\'t available, but because the match between businesses and lenders is so poorly structured. A business owner approaches their primary bank, gets turned down for reasons that are never fully explained, and concludes that credit is inaccessible to them. Meanwhile, three other institutions would have funded them on different terms, with different requirements they could actually meet.',
        'The problem is information asymmetry. Kenyan businesses rarely have a clear picture of their own creditworthiness, which CRB listings affect them, what a specific lender\'s actual underwriting criteria look like, or which financial ratios are the deciding variables for approval. They apply to the wrong institutions with incomplete documentation, collect rejections, and accumulate hard credit enquiries that make the next application harder.',
        'Mkopo maps your financial profile against the real underwriting criteria of over 60 Kenyan lenders — banks, SACCOs, DFIs, microfinance institutions, and digital lenders. It identifies your strongest matches, tells you exactly what documentation each requires, quantifies your pre-qualification probability, and produces a loan-readiness dossier that goes into the application looking polished and complete.',
      ],
    },
    capabilities: [
      { icon: '🔍', title: 'Lender Matching Engine',    desc: 'Maps your financial profile against 64 Kenyan lenders — banks, SACCOs, DFIs, and digital lenders — ranked by approval probability.' },
      { icon: '📊', title: 'Financial Health Analysis', desc: 'Analyses your P&L, balance sheet, and cash flow to identify the strengths and gaps that matter to lenders.' },
      { icon: '🏦', title: 'CRB Check & Advisory',     desc: 'Checks your CRB status across TransUnion and Metropol, and advises on any adverse listings that need addressing before application.' },
      { icon: '📁', title: 'Loan-Readiness Dossier',   desc: 'Produces a structured application pack — financial summary, ratio analysis, document checklist — tailored to your top-matched lenders.' },
      { icon: '📈', title: 'Pre-Qualification Score',   desc: 'Generates a scored assessment (out of 100) for each lender match, with the specific factors driving the score.' },
      { icon: '🗺️', title: 'Alternative Finance Map',  desc: 'Surfaces government-backed funds, development finance, and sector-specific grants (AGPO, KDB, KIRDI) that may not require credit scoring.' },
    ],
    tools: ['TransUnion CRB', 'Metropol CRB', 'KBA Lender Database', 'AGPO Portal', 'KDB Finance', 'KIRDI Database', 'QuickBooks', 'Xero'],
    workflow: [
      { step: 1, title: 'Profile Your Business',    desc: 'Mkopo collects your 3-year financials, sector, location, registered status, and funding requirement.' },
      { step: 2, title: 'Run Creditworthiness Scan',desc: 'Financial ratios are computed and your CRB status verified across both major bureaus.' },
      { step: 3, title: 'Match to Lenders',         desc: 'Your profile is scored against 64 lenders\' actual underwriting criteria — producing a ranked shortlist with probability scores.' },
      { step: 4, title: 'Build Loan-Ready Dossier', desc: 'Mkopo produces a complete application pack for each of your top 3 lender matches — formatted to their specific requirements.' },
      { step: 5, title: 'Track Applications',       desc: 'Application status, lender feedback, and next steps are tracked in a single dashboard through to drawdown.' },
    ],
    useCases: [
      {
        persona:  'Food Manufacturer — Nakuru, 19 Staff',
        problem:  'The owner needed KES 4M to purchase a packaging machine. She had applied to two banks and been declined both times — once for insufficient collateral and once without a clear reason. She was considering abandoning the expansion plan.',
        outcome:  'Mkopo identified that her debt-service coverage ratio and revenue growth made her a strong match for KCB\'s Asset Finance product and KWFT\'s SME loan, both of which had more flexible collateral requirements. Her dossier was prepared, she applied to both, and received KES 3.8M from KCB within six weeks.',
      },
      {
        persona:  'Youth-Owned Tech Startup — Nairobi, 4 Founders',
        problem:  'The startup had strong revenue but no physical collateral and no credit history. Every bank approached asked for assets the founders did not have. They were unaware that development finance institutions existed with mandate-driven criteria.',
        outcome:  'Mkopo identified the founders\' eligibility for the Youth Enterprise Development Fund and KCIC\'s innovation financing window. Mkopo also flagged that their AGPO certification was lapsed and guided them through renewal — unlocking a pathway to government contract financing they had not known existed.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  Mkopo LENDING ELIGIBILITY REPORT                   │',
      '│  Business: Acme Electronics Ltd                     │',
      '│  Funding Required: KES 5,000,000 (Working Capital)  │',
      '├──────────────────────────────────────────┬──────────┤',
      '│  LENDER                                  │  SCORE   │',
      '├──────────────────────────────────────────┼──────────┤',
      '│  KCB SME Business Loan                   │  87/100  │',
      '│  Equity Bank SME Loan                    │  81/100  │',
      '│  Stanbic Bank Business Overdraft         │  74/100  │',
      '│  KWFT SME Loan                           │  71/100  │',
      '├──────────────────────────────────────────┴──────────┤',
      '│  KEY STRENGTHS: Revenue growth +28%, low D/E        │',
      '│  KEY GAPS: No land collateral, <3yr trading history │',
      '│  CRB STATUS: Clean across TransUnion + Metropol     │',
      '│  RECOMMENDED ACTION: Apply to KCB first (87/100)    │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Does Mkopo apply to lenders on my behalf?',               a: 'No — Mkopo identifies the best matches and prepares your dossier, but you submit applications directly to lenders. This keeps you in control of your credit enquiry footprint.' },
      { q: 'What financial information does Mkopo need from me?',     a: 'Three years of management accounts (or audited financials), your most recent 6-month bank statement, and your KRA PIN. The more complete the picture, the more accurate the matching.' },
      { q: 'Which Kenyan lenders are in Mkopo\'s database?',         a: 'Mkopo covers 64 institutions: all major commercial banks, 18 SACCOs, KWFT, KCB Foundation, Equity Afia, KDB, KIRDI, AGPO-eligible institutions, and leading digital lenders (Lipa Later, Pezesha, Asante).' },
      { q: 'Can Mkopo help if I have a CRB listing?',                a: 'Yes. Mkopo identifies the listing, quantifies its impact on your scores, and advises on the fastest route to resolution — whether payment, dispute, or lender negotiation.' },
      { q: 'What loan types does Mkopo cover?',                      a: 'Working capital, asset finance, invoice discounting, trade finance, development finance, and grant/quasi-equity instruments from DFIs and government bodies.' },
      { q: 'How long does a Mkopo assessment take?',                  a: 'An initial eligibility scan is produced within 24 hours of receiving your financial documents. The full dossier for your top 3 lenders is ready within 5 business days.' },
    ],
  },

  dhamini: {
    code:    'DHAMINI',
    name:    'NSE Investment Research',
    meaning: 'Dhamini = Security / Guarantee',
    tagline: 'Daily equity intelligence on every NSE-listed company — before the market opens.',
    category:'Finance & Tax',
    icon:    '📈',
    chips:   ['All 67 NSE Counters', 'EAC Markets', 'Daily Briefs'],
    terminalLines: [
      '> DHAMINI Agent — Morning Brief: 06:45 EAT',
      '> NSE Market Summary (22 Jun):',
      '  NSE 20: 1,847.32  ▲ +0.8%',
      '  NSE ASI: 102.4    ▲ +0.4%',
      '> Scanning 67 listed counters...',
      '  ⚡ Safaricom: Div announcement — KES 0.75/share',
      '  ⚡ KCB Group: Q2 PAT +14% YoY (forecast beat)',
      '  ⚡ Bamburi: Rights issue @ KES 45 (closes 5 Jul)',
      '> Generating equity brief: Safaricom PLC',
      '  Analyst consensus: BUY (4) HOLD (2) SELL (0)',
      '  12-month target: KES 42.50 (+18%)',
      '  Key risk: Ethiopia expansion OpEx overhang',
      '> Report delivered to portfolio@client.com',
    ],
    problem: {
      headline: 'The Nairobi Securities Exchange is one of Africa\'s deepest capital markets — and most investors are flying blind in it.',
      body: [
        'The NSE lists 67 companies across 11 sectors, with a combined market capitalisation exceeding KES 2 trillion. EAC cross-listings add another layer of opportunity — and complexity. Yet the quality of research available to non-institutional investors in this market is thin. Bloomberg terminals are priced for institutions. The stockbroker research notes that exist are inconsistently published, rarely forward-looking, and typically arrive after the market has already moved.',
        'Individual and small institutional investors in Kenya are left making decisions on what is visible in the Business Daily or from tips in investment groups — not from systematic analysis of fundamentals, sector rotation, or valuation multiples. The result is a market where retail investors consistently underperform the index, and where good companies go unnoticed while overvalued names get chased.',
        'DHAMINI delivers a daily equity research brief before the Nairobi market opens at 9:30 AM EAT. It covers corporate announcements, earnings surprises, dividend events, rights issues, and sector-level moves across all 67 NSE counters — plus cross-listed counters on USE, DSE, RSE, and EGX. You go into every trading day informed.',
      ],
    },
    capabilities: [
      { icon: '📰', title: 'Daily Market Brief',       desc: 'Pre-market summary of overnight corporate announcements, index moves, and key events across all NSE-listed counters.' },
      { icon: '💹', title: 'Earnings Analysis',        desc: 'Compares reported results against analyst consensus and prior-year performance — identifying beats, misses, and forward guidance changes.' },
      { icon: '📊', title: 'Valuation Screening',      desc: 'Screens all NSE counters against P/E, P/B, EV/EBITDA, and dividend yield — surfacing the most attractively valued stocks by sector.' },
      { icon: '🌍', title: 'EAC Cross-Listing Monitor',desc: 'Tracks price and volume data on USE, DSE, RSE, and EGX for dual-listed counters and regional arbitrage opportunities.' },
      { icon: '📅', title: 'Corporate Event Calendar', desc: 'Maintains a forward-looking calendar of AGMs, dividend cut-off dates, rights issue windows, and earnings release schedules.' },
      { icon: '⚠️', title: 'Risk & Sentiment Monitor', desc: 'Flags elevated short interest, unusual volume, regulatory announcements, and sector-level macroeconomic risks as they emerge.' },
    ],
    tools: ['NSE Data Feed', 'CMA Kenya', 'USE / DSE / RSE Data', 'Bloomberg API', 'Reuters Eikon', 'Company Annual Reports', 'CBK Monetary Policy', 'Kenya National Bureau of Statistics'],
    workflow: [
      { step: 1, title: 'Define Your Universe',  desc: 'Select your coverage — full NSE, specific sectors, or a custom watchlist of counters you actively follow.' },
      { step: 2, title: 'Overnight Data Pull',   desc: 'DHAMINI pulls closing prices, corporate announcements, and regulatory filings from NSE and CMA from the previous session.' },
      { step: 3, title: 'Analysis & Scoring',    desc: 'Earnings, valuations, and sentiment indicators are computed and compared against historical ranges and sector benchmarks.' },
      { step: 4, title: 'Brief Generation',      desc: 'A structured morning brief — headlines, key moves, deep-dive on 1–2 highlighted counters — is assembled and formatted.' },
      { step: 5, title: 'Delivery',              desc: 'The brief arrives in your email inbox and WhatsApp by 07:00 EAT — before the NSE opens at 09:30.' },
    ],
    useCases: [
      {
        persona:  'Investment Club — 12 Members, Nairobi',
        problem:  'The club made monthly stock picks based on newspaper articles and member hunches. Returns lagged the NSE 20 index by an average of 9 percentage points over two years. No member had time to do systematic research.',
        outcome:  'DHAMINI delivers a weekly sector rotation report and monthly valuation screen to the club chair. Investment decisions are now grounded in earnings data and relative valuation rather than headlines. The club\'s portfolio outperformed the NSE 20 by 6 points in the first year of use.',
      },
      {
        persona:  'Family Office — KES 80M Portfolio, Karen',
        problem:  'The family office had a stockbroker who provided occasional research notes, but coverage of mid-cap and second-tier NSE names was essentially non-existent. Two positions had deteriorated significantly before any warning signals were visible.',
        outcome:  'DHAMINI now monitors the entire portfolio daily, flagging unusual volume, earnings releases, and dividend changes in real time. The portfolio manager receives a 30-second read each morning instead of searching multiple sources manually.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  DHAMINI MORNING BRIEF — 23 JUN 2024                │',
      '│  NSE 20: 1,847  ▲0.8%  |  NASI: 102.4  ▲0.4%      │',
      '├─────────────────────────────────────────────────────┤',
      '│  TODAY\'S TOP MOVERS                                 │',
      '│  Safaricom (SCOM): +2.1% — Div KES 0.75 announced  │',
      '│  KCB Group (KCB): +1.4% — Q2 beat, PAT +14%        │',
      '│  Bamburi (BAMB): -0.8% — Rights issue dilution risk │',
      '├─────────────────────────────────────────────────────┤',
      '│  DEEP DIVE: SAFARICOM PLC (SCOM)                    │',
      '│  Price: KES 36.00  |  Mkt Cap: KES 1.44T           │',
      '│  P/E: 14.2x  |  Div Yield: 6.8%  |  P/B: 3.1x     │',
      '│  Consensus: BUY ×4 / HOLD ×2 / SELL ×0             │',
      '│  12m Target: KES 42.50  (Upside: +18%)              │',
      '│  Key risk: Ethiopia OpEx overhang in H2             │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'How many NSE counters does DHAMINI cover?',              a: 'All 67 NSE-listed companies across the Main Investment Market Segment (MIMS) and the Growth Enterprise Market Segment (GEMS), plus ETFs.' },
      { q: 'Does DHAMINI provide buy/sell recommendations?',         a: 'DHAMINI provides analyst consensus data and valuation metrics but does not make its own buy/sell calls — investment decisions remain with you. We are a research tool, not a licensed investment advisor.' },
      { q: 'Can I customise DHAMINI to cover only specific sectors?',a: 'Yes. You can configure DHAMINI to focus on specific sectors (Banking, Telco, Consumer Goods, REITs) or a custom watchlist of named counters.' },
      { q: 'Does DHAMINI cover EAC cross-listed stocks?',            a: 'Yes — Safaricom, KCB, Equity, Jubilee, Stanbic, and other cross-listed counters are tracked on both the NSE and their secondary exchanges (USE, DSE, RSE).' },
      { q: 'How current is the data in DHAMINI\'s brief?',           a: 'The morning brief is generated from NSE closing data and overnight announcements — typically compiled by 02:00 EAT and delivered by 07:00 EAT each trading day.' },
      { q: 'Is DHAMINI suitable for stockbrokers and fund managers?', a: 'Yes. DHAMINI offers a professional tier with raw data exports, API access, and custom screening models suited to institutional workflows.' },
    ],
    hesabuFaqs: HESABU_MALIPO_FAQS,
  },

  biashara: {
    code:    'BIASHARA',
    name:    'East African Trade Compliance',
    meaning: 'Biashara = Business / Trade',
    tagline: 'Cross-border trade in East Africa without the regulatory guesswork.',
    category:'Trade & Compliance',
    icon:    '🌍',
    chips:   ['EAC Coverage', 'Customs Automation', 'Real-Time Alerts'],
    terminalLines: [
      '> BIASHARA Agent — Shipment Check',
      '> Cargo: Processed foodstuffs (HS 2106.90)',
      '> Origin: Nairobi, Kenya',
      '> Destination: Kigali, Rwanda',
      '> Checking EAC Common External Tariff...',
      '  ✓ CET Rate: 25% (Category C)',
      '  ✓ EAC Preferential: 0% (KE → RW)',
      '> Checking KEBS/RBS standards alignment...',
      '  ✓ Certificate of Conformity required',
      '  ⚠  Rwanda DUS 143 standard — verify packaging',
      '> Required documents:',
      '  ✓ Form C EAC  |  ✓ CoC  |  ✓ Phytosanitary Cert',
      '> Estimated duty payable: KES 0 (EAC preferential)',
      '> Estimated clearance time: 1.5 days (Gatuna)',
    ],
    problem: {
      headline: 'The East African Community promised seamless trade. The paperwork, regulations, and border realities tell a different story.',
      body: [
        'The EAC single customs territory is a work in progress. In theory, goods should move freely between Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, and the DRC with preferential or zero tariffs under the EAC Common External Tariff. In practice, the rules of origin requirements are complex, the documentation demands vary by border post, national standards bodies apply inconsistent conformity requirements, and a single wrong HS code classification can turn a zero-duty shipment into a 25% tariff burden.',
        'Most Kenyan businesses that trade across EAC borders learn the rules through expensive experience — detained consignments, unexpected duties, rejected documentation at the border, and clearance delays that destroy the economics of perishable cargo. Freight forwarders help, but they do not always know the current state of EAC negotiations, recently updated standards, or sector-specific exemptions that could save a client thousands of shillings per shipment.',
        'BIASHARA maintains a continuously updated database of EAC tariff schedules, national standards requirements, rules of origin thresholds, and documentation requirements across all seven EAC partner states. For any shipment, it tells you exactly what you need, what you owe, and where to watch out.',
      ],
    },
    capabilities: [
      { icon: '📦', title: 'HS Code Classification',   desc: 'Classifies goods under the EAC Common External Tariff schedule and determines applicable duty rates for each partner state.' },
      { icon: '📋', title: 'Documentation Checklist',  desc: 'Generates a shipment-specific checklist of required documents — Form C, CoC, phytosanitary certificate, permits — for each destination.' },
      { icon: '💰', title: 'Duty & Tax Calculator',    desc: 'Calculates EAC preferential duties, VAT on importation, levies, and any applicable exemptions for your specific cargo and route.' },
      { icon: '🌐', title: 'Standards Compliance',     desc: 'Maps product standards requirements against KEBS, UBS, TBS, RBS, and BSBU — identifying conformity certificates required before export.' },
      { icon: '⚠️', title: 'Regulatory Change Alerts', desc: 'Monitors EAC gazette notices, tariff schedule updates, and NTB (non-tariff barrier) complaints — alerting you when rules change for your sector.' },
      { icon: '🗺️', title: 'Border Crossing Intelligence', desc: 'Provides real-time estimates on clearance times, known delays, and preferred entry points by cargo type across major EAC border posts.' },
    ],
    tools: ['EAC Secretariat Tariff Portal', 'KEBS Standards Portal', 'KRA Customs (iCMS)', 'URA Uganda Customs', 'TRA Tanzania', 'RRA Rwanda', 'URSB', 'DNCCI Burundi'],
    workflow: [
      { step: 1, title: 'Describe Your Shipment', desc: 'Input cargo type, origin, destination, value, and weight. BIASHARA handles HS code classification from a product description.' },
      { step: 2, title: 'Tariff & Duty Assessment', desc: 'The correct EAC CET rate and any preferential rate is applied, with full duty and tax calculation for your specific route.' },
      { step: 3, title: 'Standards Check',         desc: 'Product standards requirements (KEBS, RBS, TBS, etc.) are verified and any mandatory certificates identified.' },
      { step: 4, title: 'Document Pack',           desc: 'A complete, shipment-specific document checklist is generated — with links to the relevant issuing authorities for each certificate.' },
      { step: 5, title: 'Monitor & Alert',         desc: 'BIASHARA tracks your active shipments and alerts you to regulatory changes, border delays, or document expiry events in real time.' },
    ],
    useCases: [
      {
        persona:  'Processed Foods Exporter — Nairobi to Kigali, 4 Shipments/Month',
        problem:  'A snack manufacturer was consistently misclassifying products under the wrong HS code — paying 25% CET on goods that qualified for 0% EAC preferential treatment. The error cost KES 180,000 per shipment and had persisted for eight months before being identified.',
        outcome:  'BIASHARA reclassified all 14 active product lines under correct HS codes, confirmed EAC rules of origin compliance, and generated pre-clearance document packs for each. The next four shipments to Rwanda cleared in 18 hours each and the duty saving was KES 720,000 in one quarter.',
      },
      {
        persona:  'General Merchandise Importer — Uganda to Kenya, Weekly Cargo',
        problem:  'A trader importing from Kampala to Nairobi had a freight forwarder but no system to verify that the forwarder\'s advice was current. After a TBS Uganda standards change, two consignments were held at Malaba for four days — KES 95,000 in demurrage fees.',
        outcome:  'BIASHARA now monitors TBS and KEBS standards updates for their product categories and alerts the trader and forwarder simultaneously when changes occur. No consignments have been held since deployment, and clearance times at Malaba have averaged 6 hours.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  BIASHARA SHIPMENT COMPLIANCE BRIEF                 │',
      '│  Cargo: Processed Snacks (HS 2106.90.90)            │',
      '│  Route: Nairobi, KE → Kigali, RW  |  Value: $8,400 │',
      '├─────────────────────────────────────────────────────┤',
      '│  TARIFF ASSESSMENT                                  │',
      '│  EAC CET Rate:             25%                      │',
      '│  EAC Preferential (KE→RW): 0%  ← APPLICABLE        │',
      '│  Duty Payable:             KES 0                    │',
      '│  RRA VAT on Import:        18% on CIF value         │',
      '├─────────────────────────────────────────────────────┤',
      '│  REQUIRED DOCUMENTS                                 │',
      '│  ✓ Form C (EAC Certificate of Origin)               │',
      '│  ✓ Certificate of Conformity (KEBS-RBS bilateral)   │',
      '│  ⚠  Rwanda DUS 143 label compliance — verify        │',
      '│  ✓ Commercial Invoice + Packing List                │',
      '│  Estimated clearance (Gatuna): 1.5 days             │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Which EAC countries does BIASHARA cover?',               a: 'Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, and the DRC (for SADC-EAC overlap corridors). Northern Corridor and LAPSSET routes are specifically mapped.' },
      { q: 'Can BIASHARA classify my products under the correct HS code?', a: 'Yes — BIASHARA uses a combination of product description matching and sector-specific logic to propose the correct HS code, with a confidence rating and supporting reference.' },
      { q: 'Does BIASHARA handle import and export compliance?',     a: 'Both. For exports from Kenya, BIASHARA covers KEBS, EPZ/SEZ, and PVOC requirements. For imports into Kenya, it covers KRA iCMS, KEBS, KEPHIS, and port clearance documentation.' },
      { q: 'How often are EAC tariff schedules updated in BIASHARA?',a: 'BIASHARA monitoring is continuous. EAC Secretariat gazette notices and national customs portal updates are ingested within 24 hours of publication.' },
      { q: 'Can BIASHARA work with our freight forwarder?',          a: 'Yes. BIASHARA\'s compliance reports can be shared directly with your freight forwarder, and the document checklist can be configured to match your forwarder\'s workflow.' },
      { q: 'Does BIASHARA cover courier and air freight shipments?', a: 'Yes — including the specific documentation and de minimis thresholds for courier exports, and EAC aviation cargo standards.' },
    ],
  },

  bidhaa: {
    code:    'Bidhaa',
    name:    'Export Market Intelligence',
    meaning: 'Bidhaa = Goods / Products',
    tagline: 'Find your export market, meet its standards, and enter it confidently.',
    category:'Trade & Compliance',
    icon:    '📦',
    chips:   ['Global Markets', 'KEBS/KEPHIS Ready', 'Export Readiness Score'],
    terminalLines: [
      '> Bidhaa Agent — Export Market Assessment',
      '> Product: Macadamia Nuts (HS 0802.62)',
      '> Current market: Domestic',
      '> Scanning 34 target markets...',
      '  ✓ Germany: High demand, MRL compliant',
      '  ✓ Japan: Premium prices, GAP cert required',
      '  ✓ UAE: Growing market, halal cert needed',
      '> Export Readiness Score: 62/100',
      '>   Gaps identified:',
      '    ⚠  GlobalG.A.P. certification: NOT HELD',
      '    ⚠  KEPHIS export phytosanitary: PENDING',
      '    ✓  KEBS quality mark: HELD',
      '> Estimated readiness timeline: 8 weeks',
      '> Generating market entry roadmap...',
    ],
    problem: {
      headline: 'Kenya produces world-class goods. Most of them never reach world markets because nobody maps the path clearly.',
      body: [
        'Kenya is one of Africa\'s most export-ready economies — in tea, coffee, horticulture, macadamia, avocado, textiles, and light manufacturing. Yet the gap between producing a world-class product and actually getting it into a premium international market is enormous, technical, and rarely explained in accessible terms. Standards diverge by market. Certification timelines are long. Buyers demand documentation that nobody told you to prepare.',
        'The result is that most Kenyan businesses that could export don\'t — or they attempt it once, encounter a compliance barrier or a rejected shipment, and retreat to the domestic market. Those who succeed typically do so after years of expensive trial and error, or with the specific guidance of a very experienced export agent. That expertise should not be so scarce.',
        'Bidhaa closes that gap. For any Kenyan product, it identifies the highest-value export markets, maps the specific compliance requirements for each, scores your current export readiness against those requirements, and produces a step-by-step roadmap to market entry — including which certifications to pursue, in which order, with which issuing bodies.',
      ],
    },
    capabilities: [
      { icon: '🌐', title: 'Market Opportunity Scan',  desc: 'Identifies the top export markets for your product category by demand, price premium, and market access difficulty.' },
      { icon: '📋', title: 'Standards Gap Analysis',   desc: 'Maps your current certifications against the entry requirements for each target market — identifying exactly what is missing.' },
      { icon: '📊', title: 'Export Readiness Score',   desc: 'A 0–100 score measuring how close you are to export-ready for each target market, with a weighted breakdown by requirement.' },
      { icon: '🗺️', title: 'Market Entry Roadmap',    desc: 'A sequenced, actionable plan: which certifications to pursue, estimated timelines and costs, and which Kenyan bodies issue them.' },
      { icon: '💰', title: 'Price & Volume Intelligence', desc: 'Import data and price benchmarks for your product in target markets — helping you set FOB prices and understand margin structures.' },
      { icon: '🤝', title: 'Buyer Matching Signal',   desc: 'Identifies verified import companies and trade associations in target markets that source products matching your category.' },
    ],
    tools: ['ITC Trade Map', 'KEPHIS', 'KEBS', 'HCDA', 'EPC Kenya', 'GlobalG.A.P.', 'EU TRACES', 'USDA APHIS', 'Halal Certification Bodies'],
    workflow: [
      { step: 1, title: 'Profile Your Product',    desc: 'Describe your product (or provide HS code), production volume, current certifications, and target price point.' },
      { step: 2, title: 'Market Scanning',         desc: 'Bidhaa scans 34 target markets by demand index, price premium, market access complexity, and Kenya\'s existing trade relationships.' },
      { step: 3, title: 'Compliance Gap Analysis', desc: 'Your certification profile is matched against the entry requirements of your top 3 market matches — producing a gap list.' },
      { step: 4, title: 'Readiness Score & Roadmap', desc: 'An export readiness score is generated for each target market, with a sequenced roadmap to close all identified gaps.' },
      { step: 5, title: 'Ongoing Intelligence',    desc: 'Bidhaa monitors your target markets for standards changes, new buyer activity, and regulatory developments affecting your sector.' },
    ],
    useCases: [
      {
        persona:  'Avocado Farmer Cooperative — Mt. Kenya Region, 340 Members',
        problem:  'The cooperative was selling 100% to domestic markets at KES 25/kg during peak season when EU prices were reaching KES 120/kg equivalent. They had no GlobalG.A.P. certification and no clear understanding of what EU market entry would require.',
        outcome:  'Bidhaa mapped their gap to EU entry: GlobalG.A.P. group certification (12 weeks, feasible via HCDA programme), KEPHIS phytosanitary export registration, and cold chain documentation. The cooperative enrolled in the HCDA export support programme, achieved certification in 14 weeks, and shipped their first EU order to a Netherlands-based importer within five months.',
      },
      {
        persona:  'Handcraft Textile SME — Nairobi, 8 Artisans',
        problem:  'A handcraft textile business had received UK inquiries through social media but had no idea how to structure an export transaction, meet UK import requirements, or price their goods for international buyers.',
        outcome:  'Bidhaa identified that their products had no specific standards barriers for UK import, mapped the documentation required (commercial invoice, packing list, certificate of origin), and calculated competitive FOB pricing. Their first export container shipped within 6 weeks of the initial Bidhaa assessment.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  Bidhaa EXPORT READINESS REPORT                     │',
      '│  Product: Macadamia Nuts (HS 0802.62.00)            │',
      '│  Volume: 8 MT/month  |  Current: Domestic only      │',
      '├──────────────────────────┬──────────┬───────────────┤',
      '│  TARGET MARKET           │  SCORE   │  GAP SUMMARY  │',
      '├──────────────────────────┼──────────┼───────────────┤',
      '│  Germany (EU)            │  62/100  │  GlobalG.A.P. │',
      '│  United Arab Emirates    │  71/100  │  Halal cert   │',
      '│  Japan                   │  55/100  │  JGAP + GAP   │',
      '├──────────────────────────┴──────────┴───────────────┤',
      '│  PRIORITY GAPS TO CLOSE                             │',
      '│  1. GlobalG.A.P. (via HCDA): ~12 weeks, KES 85K    │',
      '│  2. KEPHIS Export Registration: ~4 weeks, KES 12K  │',
      '│  Estimated market entry: 14–16 weeks               │',
      '│  EU price premium vs domestic: +280%               │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'What product categories does Bidhaa cover?',             a: 'Agriculture and horticulture (primary focus), processed foods, textiles and leather, light manufacturing, handicrafts, and services exports. Mining and extractives are not currently covered.' },
      { q: 'How many export markets does Bidhaa scan?',              a: 'Bidhaa covers 34 priority markets including the EU (27 member states collectively), UK, UAE, US, Japan, China, Saudi Arabia, India, and EAC partner states for re-export analysis.' },
      { q: 'Can Bidhaa help me find buyers?',                        a: 'Bidhaa provides buyer signals — identifying verified importers and trade associations active in your product category in target markets. Direct buyer introductions are available as a premium service.' },
      { q: 'Does Bidhaa help with EPC (Export Promotion Council) programmes?', a: 'Yes — Bidhaa maps applicable EPC Kenya, HCDA, and KTA export support programmes to your product and readiness profile, including grant and certification cost-sharing schemes.' },
      { q: 'What if my product doesn\'t have an HS code yet?',       a: 'Bidhaa includes HS code classification as part of the assessment. You describe your product in plain language and Bidhaa proposes the correct classification with supporting justification.' },
      { q: 'How does Bidhaa stay current on export standards?',      a: 'Bidhaa ingests regulatory updates from KEBS, KEPHIS, HCDA, EU TRACES, USDA APHIS, and equivalent bodies in target markets. Standards databases are updated weekly.' },
    ],
  },

  soko: {
    code:    'Soko',
    name:    'Government Tender & Procurement',
    meaning: 'Soko = Market / Marketplace',
    tagline: 'Never miss a government contract that your business should win.',
    category:'Trade & Compliance',
    icon:    '🏛️',
    chips:   ['All 47 Counties', 'PPADA Compliant', 'Auto-Eligibility Check'],
    terminalLines: [
      '> Soko Agent — Daily Tender Scan: 07:00 EAT',
      '> Scanning procurement portals...',
      '  ✓ IFMIS National: 847 active tenders',
      '  ✓ County portals (47): 312 active tenders',
      '  ✓ Parastatals (68): 124 active tenders',
      '> Matching profile: IT Services, Nairobi-based',
      '  ⚡ New match: KNH ICT Infrastructure (KES 14M)',
      '  ⚡ New match: Nairobi County Digital Services (KES 3M)',
      '  ⚡ New match: KPLC Software Support (KES 6.5M)',
      '> Checking eligibility: KNH ICT Infrastructure',
      '  ✓ AGPO: Not required  |  ✓ Tax compliance: OK',
      '  ✓ Category: Works & Supplies — registered',
      "> Bid prep initiated for KNH tender (due: 14 Jul)",
      '> 3 new matches sent via WhatsApp',
    ],
    problem: {
      headline: 'The Kenyan government spends over KES 500 billion on procurement annually. Most SMEs miss contracts they could win simply because they don\'t hear about them in time.',
      body: [
        'Government procurement in Kenya is one of the most significant commercial opportunities available to local businesses — and one of the most poorly navigated. The Public Procurement and Asset Disposal Act (PPADA) mandates a 30% reservation for youth, women, and persons with disabilities (AGPO), prioritises locally-produced goods, and requires competitive tendering across national and county governments, state corporations, and constitutional bodies. The contracts are large, the payment terms are government-guaranteed, and the opportunity is real.',
        'The challenge is awareness and process complexity. Tenders are published across IFMIS, individual county portals, individual parastatal websites, and government gazette notices — with no single discovery point. A business that does not actively monitor all these sources will miss most relevant tenders entirely. And those that do find a tender often lose the bid to technically superior submissions — not because their offer was worse, but because the formatting, mandatory attachments, or bid bond requirements were wrong.',
        'Soko monitors every active procurement portal in Kenya, matches new tenders to your business profile daily, checks eligibility automatically, and prepares a PPADA-compliant bid structure for your review — so you walk into every tender submission ready to compete.',
      ],
    },
    capabilities: [
      { icon: '🔍', title: 'Tender Discovery',           desc: 'Monitors IFMIS, 47 county procurement portals, 68 parastatals, and gazette notices — delivering matched tenders to your dashboard daily.' },
      { icon: '✅', title: 'Eligibility Auto-Check',     desc: 'Verifies your AGPO status, tax compliance, registration category, and financial thresholds against each tender\'s requirements before you invest time.' },
      { icon: '📁', title: 'Bid Preparation Support',    desc: 'Structures PPADA-compliant bid documents — pricing schedules, mandatory attachments, technical proposals — using your business profile.' },
      { icon: '🗓️', title: 'Deadline Management',        desc: 'Tracks submission deadlines, site visit dates, bid bond validity, and tender clarification windows for every active opportunity.' },
      { icon: '📊', title: 'Win Rate Analytics',         desc: 'Tracks your bid history and outcome data — identifying which entities, categories, and price points yield the highest win rates for your profile.' },
      { icon: '📢', title: 'Alert Pipeline',             desc: 'WhatsApp and email alerts for new matches, deadline reminders, tender addenda, and award announcements in your active categories.' },
    ],
    tools: ['IFMIS Kenya', 'GPP Portal', '47 County Procurement Portals', 'Kenya Gazette', 'PPRA Debarred Suppliers List', 'KRA iTax (Tax Compliance Certificate)', 'AGPO Portal', 'NCA Database'],
    workflow: [
      { step: 1, title: 'Build Your Profile',    desc: 'Register your business category, AGPO status, county, sector, financial capacity, and preferred contract value range.' },
      { step: 2, title: 'Daily Scan & Match',    desc: 'Soko scans all procurement portals each morning and delivers only the tenders that match your profile to your dashboard and WhatsApp.' },
      { step: 3, title: 'Eligibility Check',     desc: 'Each matched tender is automatically screened against your compliance status, registration category, and financial pre-qualification.' },
      { step: 4, title: 'Bid Pack Preparation',  desc: 'For tenders you choose to pursue, Soko assembles the PPADA-required document structure and pricing schedule framework for your completion.' },
      { step: 5, title: 'Track & Analyse',       desc: 'Submitted bids are tracked through to award announcement. Outcome data builds your win-rate profile over time.' },
    ],
    useCases: [
      {
        persona:  'IT Services Company — Westlands, Nairobi, 12 Staff',
        problem:  'The company knew government ICT contracts were available but had no system to discover them. They found out about relevant tenders through word of mouth — always late. In 18 months they had submitted two bids and won zero, spending KES 180,000 on bid preparation for tenders they were structurally ineligible for.',
        outcome:  'Soko identified 12 relevant tenders in the first month, ran eligibility checks that eliminated 4 mismatches, and structured two PPADA-compliant bid packs. The company won a KES 3.2M county digital services contract in month three — their first government win.',
      },
      {
        persona:  'Youth-Owned Cleaning Services — AGPO Certified, 8 Staff',
        problem:  'The company was AGPO-certified but had never submitted a bid that qualified under the 30% reservation. They were not aware which tenders specifically required AGPO suppliers, and the county portal they checked manually had a confusing interface.',
        outcome:  'Soko filters by AGPO category automatically and surfaced 6 AGPO-exclusive cleaning contracts across 3 counties in the first quarter. The company submitted 4 bids and won 2 — KES 1.4M in total contract value in their first six months with Soko.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  Soko TENDER ALERT — 23 Jun 2024                    │',
      '│  Profile: ICT Services | Nairobi | Est. KES <15M    │',
      '├──────────────────────────────────────────────────────┤',
      '│  MATCH 1  ★★★  HIGH PRIORITY                        │',
      '│  Entity:  Kenyatta National Hospital                 │',
      '│  Title:   ICT Infrastructure Upgrade                 │',
      '│  Value:   KES 14,200,000 (Indicative)               │',
      '│  Due:     14 Jul 2024, 10:00 AM                     │',
      '│  Eligibility: ✓ Category ✓ Tax ✓ No AGPO req        │',
      '│  Bid Bond: KES 284,000 (2%)  |  Documents: 8 req    │',
      '├──────────────────────────────────────────────────────┤',
      '│  MATCH 2  ★★   MEDIUM PRIORITY                      │',
      '│  Entity:  Nairobi City County Government             │',
      '│  Title:   Digital Services Platform — Ward Level     │',
      '│  Value:   KES 3,000,000  |  AGPO: Yes (30%)         │',
      '│  Due:     19 Jul 2024  |  Eligibility: ✓ All checks │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Which procurement portals does Soko monitor?',           a: 'IFMIS national government, the GPP portal, all 47 county procurement portals, 68 state corporation and parastatal portals, and Kenya Gazette tender notices.' },
      { q: 'Does Soko help with AGPO registration and renewal?',     a: 'Soko checks your AGPO status and flags upcoming renewal dates. It does not process AGPO applications directly but provides the documentation checklist and AGPO portal link.' },
      { q: 'Can Soko prepare the full bid document for me?',         a: 'Soko prepares the structural framework and populates mandatory sections from your profile. Technical proposals, company-specific experience, and pricing require your input — Soko organises them into the correct PPADA format.' },
      { q: 'What happens if I miss a bid bond deadline?',            a: 'Soko sends bid bond validity alerts 10, 5, and 2 days before each deadline. If a bond expires before submission, Soko flags it immediately and provides the bank guarantee template.' },
      { q: 'Does Soko cover county government tenders specifically?', a: 'Yes — all 47 counties. County procurement is increasingly significant (devolved spend now exceeds KES 400B annually) and is specifically under-monitored by most businesses.' },
      { q: 'Can I track why I lost a tender?',                       a: 'Soko logs all award announcements in your history. Where debriefing data is publicly available, it is attached to the tender record. Over time this builds a pattern of where your bids are typically strongest and weakest.' },
    ],
  },

  ruhusa: {
    code:    'Ruhusa',
    name:    'County Business Licensing',
    meaning: 'Ruhusa = Permit / Permission',
    tagline: 'Every permit your business needs, tracked and renewed — automatically.',
    category:'Trade & Compliance',
    icon:    '📜',
    chips:   ['All 47 Counties', 'Renewal Alerts', 'By-Law Monitoring'],
    terminalLines: [
      '> Ruhusa Agent — License Status Check',
      '> Business: Jade Restaurant — Westlands, Nairobi',
      '> Checking active permits...',
      '  ✓ Single Business Permit: Valid to 31 Dec 2024',
      '  ✓ Food Hygiene Cert: Valid to 14 Aug 2024',
      '  ⚠  Fire Safety Certificate: EXPIRING in 22 days',
      '  ⚠  Liquor License: Renewal due 30 Jul 2024',
      '  ✗  Outdoor Advertising Permit: LAPSED (3 Aug 2023)',
      '> Generating renewal action plan...',
      '  Priority 1: Outdoor Advertising (regularise)',
      '  Priority 2: Fire Safety (apply by 30 Jun)',
      '  Priority 3: Liquor License (apply by 10 Jul)',
      '> WhatsApp alert sent to manager',
    ],
    problem: {
      headline: 'A single expired permit can shut your business down. Most businesses don\'t track all their licensing obligations until an inspector shows up.',
      body: [
        'Running a business in Kenya means navigating an overlapping set of county and national licensing requirements that change by sector, by county, and sometimes by ward. A restaurant in Nairobi needs a Single Business Permit, a Food Hygiene Certificate, a Fire Safety Certificate, and potentially a Liquor License, an Outdoor Advertising Permit, and health inspection clearances — each issued by a different county department, each with a different renewal date, and each with a different set of supporting documents required for renewal.',
        'County by-laws add another layer of complexity. Nairobi\'s by-laws differ from Mombasa\'s, which differ from Kisumu\'s. What is an illegal structure in one county may be licensed in another. Operating hours, noise regulations, signage restrictions, and waste management requirements all vary — and county enforcement units are increasingly active.',
        'Ruhusa maps every license and permit your business requires based on your sector, county, and activities — then tracks every renewal date, alerts you with enough lead time to prepare, and generates the document checklists required for each renewal application. An inspector visits your premises and finds everything in order. That is the Ruhusa standard.',
      ],
    },
    capabilities: [
      { icon: '📋', title: 'License Registry',         desc: 'Builds and maintains a complete registry of every permit and license your business needs based on sector, county, and activity profile.' },
      { icon: '⏰', title: 'Renewal Tracking',          desc: 'Tracks all renewal dates and sends tiered alerts — 60, 30, 14, and 7 days before each deadline — via WhatsApp and email.' },
      { icon: '📁', title: 'Renewal Document Packs',    desc: 'Generates the specific document checklist and application form guide for each permit renewal, matched to the issuing county department.' },
      { icon: '⚠️', title: 'Lapsed Permit Alerts',     desc: 'Identifies any lapsed permits in your profile and produces a regularisation plan — minimising penalty exposure from historic non-compliance.' },
      { icon: '📰', title: 'By-Law Change Monitor',    desc: 'Monitors county gazette notices and by-law amendments that affect your business operations, alerting you when new compliance obligations emerge.' },
      { icon: '🗺️', title: 'Multi-Location Support',   desc: 'Manages licensing across multiple business locations — each with its own county-specific permit set — in a single consolidated dashboard.' },
    ],
    tools: ['Nairobi County e-Citizen', 'County Single Business Permit Portals (47)', 'Kenya Gazette', 'NEMA Licensing', 'KRA PIN Certificate', 'KEBS Mark of Quality', 'Fire & Rescue Services'],
    workflow: [
      { step: 1, title: 'Profile Your Business',  desc: 'Ruhusa collects your sector, county, specific activities (food service, alcohol, signage, etc.), and existing permit records.' },
      { step: 2, title: 'Build License Registry', desc: 'A complete inventory of every required permit is generated — including those you may not have known were mandatory for your operations.' },
      { step: 3, title: 'Set Renewal Calendar',   desc: 'All permit expiry dates are entered into your Ruhusa calendar, with automatic alert scheduling based on renewal lead times.' },
      { step: 4, title: 'Alert & Prepare',        desc: 'Tiered alerts are sent at 60, 30, 14, and 7 days before each deadline, accompanied by the renewal document checklist.' },
      { step: 5, title: 'Monitor By-Laws',        desc: 'County by-law changes affecting your operations are monitored continuously — your compliance picture stays current as regulations evolve.' },
    ],
    useCases: [
      {
        persona:  'Mid-Size Restaurant — Kilimani, Nairobi, 32 Staff',
        problem:  'The restaurant\'s outdoor signage permit had lapsed 14 months earlier without anyone noticing. A Nairobi county enforcement sweep resulted in a KES 85,000 penalty and a 24-hour shutdown notice — during a busy Friday dinner service.',
        outcome:  'Ruhusa mapped all 7 licenses the restaurant needed, identified the lapsed outdoor permit and two others approaching expiry, and generated a regularisation plan. All permits were renewed within three weeks. The restaurant has maintained 100% compliance for 11 months since deployment.',
      },
      {
        persona:  'Salon Chain — 3 Branches (Nairobi, Mombasa, Nakuru)',
        problem:  'Each branch was managed separately with no centralised licensing oversight. The Mombasa branch was operating on a Nairobi-template SBP that did not map to Mombasa County\'s salon-specific health inspection requirements — an error that carried significant regulatory risk.',
        outcome:  'Ruhusa built separate license registries for each county, identified the Mombasa non-compliance gap, and guided the manager through the correct Mombasa County health inspection application. All three branches are now on a single Ruhusa dashboard with aligned renewal calendars.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  Ruhusa LICENSE STATUS DASHBOARD                    │',
      '│  Business: Jade Restaurant  |  Westlands, Nairobi   │',
      '│  Status as at: 23 Jun 2024                          │',
      '├──────────────────────────────┬──────────┬──────────┤',
      '│  PERMIT                      │  EXPIRY  │  STATUS  │',
      '├──────────────────────────────┼──────────┼──────────┤',
      '│  Single Business Permit      │  31 Dec  │  ✓ Valid │',
      '│  Food Hygiene Certificate    │  14 Aug  │  ✓ Valid │',
      '│  Fire Safety Certificate     │  15 Jul  │  ⚠ 22d  │',
      '│  Liquor License              │  30 Jul  │  ⚠ 37d  │',
      '│  Outdoor Advertising Permit  │  3 Aug23 │  ✗ LAPSD│',
      '│  Health Inspection Clearance │  30 Sep  │  ✓ Valid │',
      '├──────────────────────────────┴──────────┴──────────┤',
      '│  ACTION REQUIRED: 2 urgent  |  1 regularisation    │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Does Ruhusa cover all 47 Kenyan counties?',             a: 'Yes. Ruhusa has mapped Single Business Permit and sector-specific license requirements for all 47 counties, with particular depth for Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.' },
      { q: 'What happens if my county changes its by-laws?',        a: 'Ruhusa monitors county gazette notices continuously. When a by-law change creates a new compliance obligation for your profile, you receive an alert within 48 hours of publication.' },
      { q: 'Can Ruhusa submit permit applications on my behalf?',   a: 'Ruhusa prepares and packages all documentation for each renewal. Submission is done by you or your admin via the county e-Citizen portal or in-person — Ruhusa provides the complete, ready-to-submit pack.' },
      { q: 'Does Ruhusa handle national-level licenses (e.g., NEMA)?', a: 'Yes. Ruhusa covers NEMA environmental permits, KEBS mark applications, fire safety certificates (issued by Kenya Fire & Rescue), and other national regulatory requirements in addition to county permits.' },
      { q: 'What if I have multiple business locations?',           a: 'Ruhusa supports unlimited locations under one account, each with their own county-specific license registry, displayed in a single consolidated dashboard.' },
      { q: 'Can Ruhusa help me regularise lapsed permits without penalty escalation?', a: 'Ruhusa will identify the correct regularisation pathway for each lapsed permit, the likely penalty assessment, and the fastest route to compliance — but legal advice on penalty disputes requires a qualified lawyer.' },
    ],
  },

  shamba: {
    code:    'SHAMBA',
    name:    'Agriculture Supply Chain',
    meaning: 'Shamba = Farm / Field',
    tagline: 'Market prices, weather intelligence, and agri-logistics — in one daily brief.',
    category:'Sector Intelligence',
    icon:    '🌾',
    chips:   ['15+ Commodities', 'KMD Weather Data', 'KEPHIS Alerts'],
    terminalLines: [
      '> SHAMBA Agent — Morning Farm Brief: 05:30 EAT',
      '> Commodity Prices (Nairobi, 23 Jun):',
      '  Maize (90kg bag):    KES 3,200  ▼ -1.8%',
      '  Dry Beans:           KES 180/kg ▲ +3.2%',
      '  Irish Potatoes:      KES 42/kg  ▼ -0.5%',
      '> KMD Weather Forecast (Mt. Kenya Region):',
      '  Rain probability: 68%  |  Temp: 14–22°C',
      '  ⚠  Heavy rain advisory: 25–27 Jun (planting risk)',
      '> KEPHIS Alerts:',
      '  ⚠  Fall Armyworm: Murang\'a, Kirinyaga — elevated',
      '> NCE Futures (Maize, Sep delivery):',
      '  KES 3,450 (+7.8% vs spot)',
      '> Recommended action: Hold maize, defer sale 3 weeks',
      '> Logistics: 2 trucks available Nakuru→Nairobi (low cost)',
    ],
    problem: {
      headline: 'Kenya\'s farmers and agribusinesses make decisions worth billions of shillings on information that is weeks old, incomplete, or simply wrong.',
      body: [
        'Agriculture is Kenya\'s largest economic sector — employing 40% of the population and generating 33% of GDP. Yet the information infrastructure supporting agricultural decision-making is profoundly inadequate. Commodity price data is fragmented across dozens of markets, rarely aggregated in real time, and typically unavailable to the smallholder at the point of sale. Weather forecasts from KMD exist but are not integrated with agronomic decision calendars. KEPHIS pest and disease alerts are published on a government portal that most farmers have never seen.',
        'The result is a chronic information gap that drives poor decisions at scale. Farmers sell maize at KES 2,800 when three weeks later prices rise to KES 3,600 — because they had no forward price intelligence. They plant in a window that KMD data would have flagged as high-risk. They lose an entire crop to Fall Armyworm because the KEPHIS regional alert never reached them.',
        'SHAMBA aggregates commodity price data from EAGC, NCE, and major market centres; KMD weather forecasts at ward level; KEPHIS pest and disease alerts; EATTA and KPCU reports for tea and coffee; and logistics cost data for major routes. It delivers a daily brief to farmers, cooperatives, aggregators, and agribusinesses — five minutes of reading that replaces hours of informal intelligence gathering.',
      ],
    },
    capabilities: [
      { icon: '💰', title: 'Commodity Price Tracker',   desc: 'Daily price updates for 15+ commodities across 8 major Kenyan market centres — EAGC, Wakulima, Muthurwa, and NCE futures.' },
      { icon: '🌦️', title: 'Weather Intelligence',      desc: 'KMD forecast integration at ward level, with agronomic interpretation — optimal planting windows, frost risk, and irrigation timing advice.' },
      { icon: '🐛', title: 'Pest & Disease Alerts',     desc: 'KEPHIS regional alerts for Fall Armyworm, locusts, cassava mosaic, and other priority threats — geo-filtered to your location.' },
      { icon: '📈', title: 'Price Forecasting',         desc: 'NCE futures and seasonal price trend analysis for major staples — helping you time sales and input purchasing decisions.' },
      { icon: '🚛', title: 'Logistics Intelligence',    desc: 'Available truck routes, transport cost estimates, and EAC cross-border logistics updates for major agricultural corridors.' },
      { icon: '☕', title: 'Specialty Crop Coverage',   desc: 'EATTA weekly tea auction results, KPCU coffee market reports, HCDA avocado and horticulture export price data.' },
    ],
    tools: ['EAGC Market Data', 'NCE Futures', 'KMD Weather API', 'KEPHIS Alert Portal', 'EATTA Auction Results', 'KPCU Coffee Reports', 'HCDA Export Data', 'RASFF Food Safety Alerts'],
    workflow: [
      { step: 1, title: 'Configure Your Profile',  desc: 'Set your crops, county/ward location, market preferences, and cooperative affiliation to calibrate the brief to your operation.' },
      { step: 2, title: 'Overnight Data Pull',     desc: 'SHAMBA aggregates commodity prices, weather forecasts, pest alerts, and logistics data from all configured sources.' },
      { step: 3, title: 'Agronomic Analysis',      desc: 'Raw data is interpreted through agronomic logic — translating weather probabilities into planting and harvesting recommendations.' },
      { step: 4, title: 'Morning Brief Delivery',  desc: 'A concise daily brief is delivered to your WhatsApp by 06:00 EAT — readable in 3 minutes, actionable immediately.' },
      { step: 5, title: 'Alert Escalation',        desc: 'Pest advisory, extreme weather, and price crash events trigger immediate WhatsApp alerts — not held for the morning brief.' },
    ],
    useCases: [
      {
        persona:  'Maize Trader & Aggregator — Eldoret, 800 MT Annual Volume',
        problem:  'The trader was buying from farmers at prevailing spot rates with no forward view of price movement. In March 2023 he bought 120 MT at KES 3,000/bag three weeks before prices dropped to KES 2,400 — a KES 720,000 loss on avoidable timing.',
        outcome:  'SHAMBA\'s NCE futures tracking and seasonal price trend alerts now inform his buying calendar. He waits for confirmed price floor signals before large purchases. In the following six months he avoided two downside events and captured one significant price rise — net improvement vs prior year: KES 1.8M.',
      },
      {
        persona:  'Smallholder Cooperative — Meru, 340 Members, Tea & Vegetables',
        problem:  'Members were making planting decisions without KMD weather data, and two seasons in a row had seen poor germination rates due to late rains that a county-level forecast would have anticipated. KEPHIS Fall Armyworm alerts had never reached the cooperative leadership.',
        outcome:  'SHAMBA delivers a weekly cooperative brief to the chairman\'s WhatsApp. Planting windows are now aligned with KMD probability forecasts. In the first full season under SHAMBA, the cooperative\'s germination success rate improved by 23 percentage points and Fall Armyworm losses dropped from 12% to under 3% of crop.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  SHAMBA DAILY BRIEF — 23 JUN 2024, Mt. Kenya Region │',
      '├─────────────────────────────────────────────────────┤',
      '│  COMMODITY PRICES (Nairobi Markets)                 │',
      '│  Maize (90kg):     KES 3,200  ▼-1.8%  (EAGC)       │',
      '│  Dry Beans:        KES 180/kg ▲+3.2%  (Wakulima)   │',
      '│  Irish Potato:     KES   42/kg▼-0.5%  (Muthurwa)   │',
      '│  Green Coffee:     KES  210/kg▲+1.1%  (KPCU)       │',
      '├─────────────────────────────────────────────────────┤',
      '│  WEATHER (Kirinyaga County)  |  KMD Source          │',
      '│  Forecast: Rain 68% prob  |  Temp: 14–22°C          │',
      '│  ⚠  Heavy rain advisory 25–27 Jun — delay planting  │',
      '├─────────────────────────────────────────────────────┤',
      '│  PEST ALERTS  |  KEPHIS                             │',
      '│  ⚠  Fall Armyworm: Murang\'a + Kirinyaga — elevated  │',
      '│  Recommended: Scout crops, apply pheromone traps    │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Which commodities does SHAMBA track?',                   a: 'Maize, wheat, dry beans, Irish potatoes, cassava, sorghum, green coffee, tea, avocado, French beans, tomatoes, kale, onions, and dairy (farm-gate milk prices). Additional crops on request.' },
      { q: 'How localised is the weather data?',                    a: 'SHAMBA uses KMD ward-level forecast data where available, and falls back to sub-county level. You configure your specific location during setup.' },
      { q: 'Does SHAMBA cover cross-border agri-trade to Uganda/Tanzania?', a: 'Yes — commodity price and logistics data covers the Malaba, Busia, and Namanga corridors, including EAC preferential duty rates for agricultural exports.' },
      { q: 'Is SHAMBA suitable for smallholder farmers?',           a: 'Yes. The WhatsApp delivery format is specifically designed for mobile-first users without internet access. The brief is readable in under 3 minutes and requires no app download.' },
      { q: 'Does SHAMBA provide agronomic advice (fertiliser, varieties)?', a: 'SHAMBA provides planting timing, weather risk, and pest management signals — not agronomic variety or input-specific advice. That requires a registered agronomist or extension officer.' },
      { q: 'How current is the commodity price data?',              a: 'EAGC and NCE prices are updated daily from market session data. Regional market prices (Muthurwa, Wakulima, Kongowea) are updated three times weekly from field data collection.' },
    ],
  },

  ardhi: {
    code:    'Ardhi',
    name:    'Kenya Real Estate Intelligence',
    meaning: 'Ardhi = Land / Earth',
    tagline: 'Every Kenyan property decision, grounded in real data.',
    category:'Sector Intelligence',
    icon:    '🏠',
    chips:   ['Nairobi to Mombasa', 'Automated Valuation', 'Planning Compliance'],
    terminalLines: [
      '> Ardhi Agent — Property Intelligence Query',
      '> Location: Kilimani, Nairobi  |  Type: Commercial',
      '> Scanning market transactions (Q1–Q2 2024)...',
      '  ✓ 43 comparable transactions identified',
      '  ✓ Median price: KES 165,000/sqm (office)',
      '  ✓ Rental yield: 6.8% gross',
      '> Running automated valuation (subject property)...',
      '  Size: 320 sqm  |  Location score: 8.2/10',
      '  Estimated Market Value: KES 48.5M–53.2M',
      '> Checking planning compliance...',
      '  Zoning: Commercial (C2) — ✓ Confirmed',
      '  Plot ratio: 1:4 — 2 floors remaining (FAR)',
      '  ⚠  Riparian reserve: Within 30m — verify setback',
      '> Generating property brief...',
    ],
    problem: {
      headline: 'Kenya\'s property market moves on relationships and rumour far more than on data — and that costs buyers, sellers, and investors dearly.',
      body: [
        'The Kenyan real estate market transacts billions of shillings annually with remarkably little transparency. There is no central property price registry analogous to the UK\'s Land Registry public database. Asking prices diverge significantly from transaction prices. Valuers operate with inconsistent methodologies. Planning compliance — zoning, plot ratios, riparian reserves, building line restrictions — is inconsistently enforced and rarely mapped comprehensively for a layperson to access before committing to a purchase.',
        'Buyers overpay because they cannot benchmark. Investors misjudge rental yields because they are working from advertised rents rather than actual lease data. Developers miss planning constraints that could reduce their developable floor area by 40%. Banks approve mortgages on valuations that diverge by 25–30% from market reality — and when those properties go to auction, the losses crystallise.',
        'Ardhi aggregates transaction data from court-filed transfers, bank-instructed valuations, agent listing databases, and Nairobi City County planning records to produce property market intelligence that is grounded in actual evidence. Whether you are buying, selling, investing, developing, or lending, Ardhi puts real data behind your decision.',
      ],
    },
    capabilities: [
      { icon: '💹', title: 'Automated Valuation Model', desc: 'Generates evidence-based market value estimates for residential and commercial properties using comparable transaction data and location scoring.' },
      { icon: '📊', title: 'Market Price Analysis',     desc: 'Price per square metre, rental yield, and capital appreciation trends for any Kenyan sub-market — broken down by property type and period.' },
      { icon: '🗺️', title: 'Planning Compliance Check', desc: 'Reviews zoning classification, plot ratio, setback requirements, riparian reserve proximity, and height restrictions for any parcel.' },
      { icon: '📈', title: 'Investment Yield Modelling', desc: 'Models gross and net rental yields, capital growth scenarios, and holding-period returns for residential, commercial, and mixed-use assets.' },
      { icon: '⚠️', title: 'Market Movement Alerts',   desc: 'Monitors price and transaction volume trends in your target sub-markets — alerting you to significant market shifts as they develop.' },
      { icon: '🔍', title: 'Comparable Transaction Log',desc: 'Maintains a searchable database of recent property transfers for benchmarking subject property valuations and investment decisions.' },
    ],
    tools: ['Nairobi City County Planning Portal', 'Lands Ministry Registry', 'KISM Valuers Network', 'County Land Registries', 'Knight Frank Kenya Reports', 'HassConsult Index', 'Agent MLS Data'],
    workflow: [
      { step: 1, title: 'Define Your Query',       desc: 'Specify the property type, location (or specific parcel), transaction purpose (buy/sell/invest/develop), and analysis depth required.' },
      { step: 2, title: 'Data Pull & Comparables', desc: 'Ardhi pulls recent comparable transactions, listing data, and planning records for the subject property\'s location and property type.' },
      { step: 3, title: 'Valuation & Analysis',    desc: 'The automated valuation model applies location scoring, comparables weighting, and market trend adjustments to produce a value range.' },
      { step: 4, title: 'Planning Compliance',     desc: 'Zoning, plot ratio, riparian, and building line compliance is checked against County planning records and applicable regulations.' },
      { step: 5, title: 'Deliver Report',          desc: 'A structured property intelligence brief — valuation, market context, planning status, and investment metrics — is produced within 24 hours.' },
    ],
    useCases: [
      {
        persona:  'Commercial Property Investor — KES 120M Budget, Nairobi',
        problem:  'An investor was evaluating two commercial properties in Kilimani and Upper Hill. Both sellers\' asking prices were within 10% of each other, but the investor had no independent basis to assess whether either was fairly priced or which offered the better yield.',
        outcome:  'Ardhi ran automated valuations for both properties, identified that the Kilimani property was priced 18% above comparable transactions, and that the Upper Hill property had a riparian reserve encroachment affecting 15% of the developable plot. The investor renegotiated the Upper Hill price down by KES 14M on the basis of the planning constraint evidence.',
      },
      {
        persona:  'Bank — Mortgage Portfolio Monitoring, 340 Active Loans',
        problem:  'A tier-2 bank\'s mortgage portfolio had not been systematically revalued since 2021. With property prices in certain Nairobi sub-markets declining 12–18%, the bank had no clear view of current LTV ratios across the portfolio.',
        outcome:  'Ardhi ran automated valuations across all 340 properties, producing a current LTV heat map. The bank identified 23 loans with LTV >85% under current valuations, initiated targeted physical revaluations, and made appropriate provisioning adjustments — without a full revaluation exercise cost.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  Ardhi PROPERTY INTELLIGENCE BRIEF                  │',
      '│  Location: Kilimani, Nairobi  |  Type: Office       │',
      '│  Subject: 320 sqm, 3rd floor, Milimani Rd           │',
      '├─────────────────────────────────────────────────────┤',
      '│  MARKET CONTEXT (Q1–Q2 2024, Kilimani Office)       │',
      '│  Median Price:      KES 165,000/sqm                 │',
      '│  Price Range:       KES 140K–195K/sqm               │',
      '│  Gross Rental Yield: 6.8%  |  Vacancy: 11%          │',
      '│  Trend: ▼ -2.3% YoY (softening mid-market offices)  │',
      '├─────────────────────────────────────────────────────┤',
      '│  AUTOMATED VALUATION                                │',
      '│  Estimated Market Value: KES 48.5M – 53.2M          │',
      '│  Location Score: 8.2/10  |  Confidence: High        │',
      '├─────────────────────────────────────────────────────┤',
      '│  PLANNING COMPLIANCE                                │',
      '│  Zoning: C2 Commercial ✓  |  FAR: 2 floors remain  │',
      '│  ⚠  Riparian reserve: Confirm 30m setback with NCC  │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Which Kenyan cities does Ardhi cover?',                  a: 'Nairobi (all sub-markets including satellite towns), Mombasa, Kisumu, Nakuru, and Eldoret with the deepest data. Emerging markets (Thika, Machakos, Athi River) have lighter coverage that is expanding quarterly.' },
      { q: 'Is Ardhi\'s valuation a certified valuation?',          a: 'No — Ardhi produces an automated market intelligence estimate, not a certified valuation under the Kenya Institute of Surveyors (KISM) standards. For mortgage, legal, or insurance purposes, a KISM-registered valuer\'s report is required. Ardhi significantly reduces the cost and time of preparing comparable data for that exercise.' },
      { q: 'Can Ardhi check if a title deed is clean?',             a: 'Ardhi can check for land caution notices and encumbrances visible in public registry data, but a full title search requires an advocate and the Land Registry portal. Ardhi flags known encumbrances as a first screen only.' },
      { q: 'What planning information does Ardhi check?',           a: 'Zoning classification, plot ratio (FAR), setback/building line requirements, riparian reserve proximity (WRMA 30m rule), height restrictions, and building type permissions under the county land use plan.' },
      { q: 'How current is the transaction data Ardhi uses?',       a: 'Ardhi\'s Nairobi comparable transaction database is updated monthly. Agent listing data is updated weekly. In less active markets, the comparable pool may extend up to 18 months — this is disclosed in each valuation report.' },
      { q: 'Can Ardhi monitor a sub-market for investment timing?', a: 'Yes. Ardhi\'s market monitoring feature tracks price-per-sqm and transaction volume trends in any configured sub-market, sending monthly reports and threshold alerts when metrics cross your defined investment criteria.' },
    ],
  },

  zuri: {
    code:    'ZURI',
    name:    'Swahili Customer Service',
    meaning: 'Zuri = Good / Beautiful',
    tagline: 'World-class customer service in English, Swahili, and Sheng — 24 hours a day.',
    category:'Customer Experience',
    icon:    '🤝',
    chips:   ['English + Swahili + Sheng', 'WhatsApp Native', '24/7 Response'],
    terminalLines: [
      '> ZURI Agent — Active Session Log',
      '> Channel: WhatsApp Business',
      '> 14:32  Customer (Kiswahili): "Ninataka kujua bei"',
      '> 14:32  ZURI: "Karibu! Bei yetu ya siku ya leo ni..."',
      '> 14:35  Customer (Sheng): "Sawa boss, nipe delivery"',
      '> 14:35  ZURI: "Sawa kabisa! Delivery ni free above KES 500"',
      '> 14:38  Customer escalation: "Niongee na human"',
      '> 14:38  ZURI: Escalating to agent Amina...',
      '> 14:38  Agent Amina: Connected',
      '> ---',
      '> Session summary: 3 msgs | Resolved | CSAT: Positive',
      '> Today: 847 conversations  |  Resolved: 94.2%',
      '> Avg response time: 28 seconds  |  Human escalations: 54',
    ],
    problem: {
      headline: 'Your customers speak Swahili, type in Sheng, and expect a reply in 28 seconds. Your WhatsApp inbox is open only when someone is at a desk.',
      body: [
        'East African consumer behaviour has shifted decisively to WhatsApp-first communication. Over 85% of Kenyan mobile internet users have WhatsApp installed. When a customer has a question about your product, a complaint about their delivery, or wants to place an order, they send a WhatsApp message — and they expect a reply in under a minute. A response that arrives six hours later, or in stiff corporate English to a customer who wrote in casual Sheng, is a brand interaction that reduces loyalty.',
        'Most Kenyan businesses handle WhatsApp customer service through a single person — often the business owner or one designated staff member. This creates a queue that backs up during busy periods, goes silent overnight, and reflects whoever is on shift that day rather than a consistent brand voice. The customer experience is unpredictable. Returns, complaints, and pre-sale questions that should be resolved in 60 seconds instead bounce around for hours.',
        'ZURI is a customer service agent built for East African consumer communication. It understands English, Swahili, and Sheng — not as a translation exercise, but as a native speaker would. It handles enquiries, provides product information, processes common complaints, escalates to a human agent when the situation requires it, and maintains a consistent brand voice at 3 AM on a Sunday with exactly the same quality as 11 AM on a Tuesday.',
      ],
    },
    capabilities: [
      { icon: '🗣️', title: 'Trilingual Communication',  desc: 'Native-quality responses in English, Swahili, and Sheng — switching seamlessly based on how the customer writes.' },
      { icon: '💬', title: 'WhatsApp Business Native',  desc: 'Integrates directly with WhatsApp Business API — no new apps or channels required. Your existing WhatsApp number, managed by ZURI.' },
      { icon: '⚡', title: '28-Second Average Response', desc: 'Customers receive a relevant, personalised response within 28 seconds — around the clock, without queues or shift dependencies.' },
      { icon: '↗️', title: 'Smart Human Escalation',    desc: 'ZURI recognises when a conversation requires a human agent and escalates immediately — with full conversation context attached.' },
      { icon: '📊', title: 'Conversation Analytics',   desc: 'Daily dashboard of volume, resolution rate, response times, escalations, and sentiment — making your customer service visible and measurable.' },
      { icon: '🛒', title: 'Commerce Integration',     desc: 'Handles order status enquiries, delivery tracking, return requests, and product questions connected to your inventory or ordering system.' },
    ],
    tools: ['WhatsApp Business API (Meta)', 'SMS Gateway', 'Instagram DM', 'Shopify / WooCommerce', 'Quickstore Kenya', 'Zendesk', 'Freshdesk', 'Google Sheets (simple order management)'],
    workflow: [
      { step: 1, title: 'Train on Your Business',  desc: 'ZURI is trained on your product catalogue, pricing, policies (returns, delivery, payment), and brand voice during a one-week onboarding.' },
      { step: 2, title: 'Connect WhatsApp',        desc: 'Your WhatsApp Business number is connected via Meta\'s Business API. All incoming messages route through ZURI — existing messages are unaffected.' },
      { step: 3, title: 'Respond & Resolve',       desc: 'ZURI handles enquiries, complaints, and sales conversations — in the customer\'s chosen language — from the first message.' },
      { step: 4, title: 'Escalate Intelligently',  desc: 'Complex, sensitive, or explicitly-requested human conversations are escalated immediately with full context to your designated agent.' },
      { step: 5, title: 'Report Daily',            desc: 'A morning dashboard summary covers yesterday\'s volume, resolution rate, response times, and any conversations that need follow-up.' },
    ],
    useCases: [
      {
        persona:  'Online Clothing Retailer — Nairobi, 3,000 Customers/Month',
        problem:  'The founder was personally managing WhatsApp orders and enquiries from 6 AM to 11 PM every day. After missing 40+ messages over a holiday weekend, she lost KES 85,000 in orders and received multiple negative Google reviews about non-responsiveness.',
        outcome:  'ZURI now handles 94% of conversations to resolution without human intervention. The founder reviews the daily dashboard each morning and handles the 6% that need her attention. WhatsApp response time dropped from 2.5 hours (average) to 28 seconds. Customer repeat rate increased 19% in the following quarter.',
      },
      {
        persona:  'Courier Service — Mombasa, 1,200 Deliveries/Month',
        problem:  'Customers tracking their parcels were sending WhatsApp messages to the main business line — a number managed by one dispatcher who handled calls, bookings, and customer enquiries simultaneously. 30% of messages were being seen 4+ hours after sending. Complaints were escalating on social media.',
        outcome:  'ZURI connected to their internal delivery tracking system and now handles all status enquiries autonomously. Customers receive their parcel status in Swahili within 25 seconds. The dispatcher\'s workload reduced by 60%, and social media complaints about responsiveness dropped to zero in the first month.',
      },
    ],
    sampleOutput: [
      '┌─────────────────────────────────────────────────────┐',
      '│  ZURI SESSION LOG — Sample Exchange                 │',
      '│  Channel: WhatsApp  |  Time: 22:14 EAT              │',
      '├─────────────────────────────────────────────────────┤',
      '│  CUSTOMER: "Nimefanya order leo asubuhi, iko wapi?" │',
      '│  ZURI:     "Habari yako! Order yako #KE4421 iko     │',
      '│             Westlands na itafika kesho asubuhi       │',
      '│             kati ya 9–12 asubuhi. SMS utapokea."    │',
      '│  CUSTOMER: "Sawa asante. Naweza change delivery?" ─ │',
      '│  ZURI:     "Ndio! Niambie address mpya na time      │',
      '│             inayokufaa — nitarekebisha sasa hivi."  │',
      '│  CUSTOMER: "Kilimani, kesho 3pm"                    │',
      '│  ZURI:     "✓ Done! Order #KE4421 — Kilimani, kesho │',
      '│             3pm. Confirmation SMS imetumwa."        │',
      '├─────────────────────────────────────────────────────┤',
      '│  Result: Resolved in 4 msgs  |  Time: 1m 42s        │',
      '│  Customer CSAT signal: Positive  |  No escalation   │',
      '└─────────────────────────────────────────────────────┘',
    ],
    faq: [
      { q: 'Does ZURI truly understand Sheng — or just translate it?',        a: 'ZURI is trained on East African conversational data including Sheng, not just Swahili and English. It responds in the register the customer uses — formal Swahili, casual Sheng, or professional English — rather than translating everything to one language.' },
      { q: 'Can ZURI handle order processing, not just enquiries?',           a: 'Yes — for businesses with connected inventory or ordering systems (Shopify, WooCommerce, Quickstore), ZURI can check stock, confirm orders, and trigger fulfilment. For businesses without an integrated system, ZURI handles enquiries and routes orders to your team.' },
      { q: 'What happens when a customer explicitly asks for a human?',       a: 'ZURI immediately acknowledges the request and escalates the conversation to your designated human agent with the full conversation history attached — the customer does not need to repeat themselves.' },
      { q: 'Can ZURI manage multiple WhatsApp numbers for different departments?', a: 'Yes. ZURI supports multi-number setups — routing by keyword or department tag — and maintains separate conversation streams for Sales, Support, and Logistics enquiries.' },
      { q: 'Is the WhatsApp Business API required, or can ZURI work with a regular WhatsApp?', a: 'Meta\'s WhatsApp Business API is required for ZURI to function. NeuroSpark handles the API provisioning as part of onboarding. A regular WhatsApp number can often be migrated to Business API with Meta\'s approval process, which we guide you through.' },
      { q: 'Does ZURI handle sensitive complaints — like a customer who is very angry?',        a: 'ZURI is trained to de-escalate emotionally charged conversations in culturally-appropriate ways. However, for high-stakes complaints involving potential legal claims or very significant financial disputes, ZURI escalates to a human agent immediately, with a note on the sentiment context.' },
    ],
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DotGrid({ opacity = 0.14 }) {
  const { dark } = useTheme()
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="agentDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#agentDots)" />
      </svg>
    </div>
  )
}

// 1. AgentHero
function AgentHero({ agent }) {
  const { dark } = useTheme()
  const [hoverDeploy, setHoverDeploy] = useState(false)
  const [hoverDemo,   setHoverDemo  ] = useState(false)

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: C.navy,
        paddingTop: 'clamp(100px,12vw,140px)',
        paddingBottom: 'clamp(60px,8vw,100px)',
      }}
    >
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 65%)',
      }} />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <Link
          to="/agents"
          className="no-underline inline-flex items-center gap-2 mb-10"
          style={{ color: '#64748B', fontFamily: FONT_BODY, fontSize: '0.85rem', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          <ArrowLeft size={14} /> All Agents
        </Link>

        <div className="grid gap-12 items-center" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
          {/* Left: text */}
          <div>
            <p className="animate-fade-up mb-2" style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
              {agent.category}
            </p>

            <div className="animate-fade-up delay-100 flex items-center gap-4 mb-2">
              <span style={{ fontFamily: FONT_MONO, fontSize: '2.6rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                {agent.code}
              </span>
              <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{agent.icon}</span>
            </div>

            <h1 className="animate-fade-up delay-100" style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(1.4rem,2.8vw,2rem)',
              color: 'white', lineHeight: 1.25, marginBottom: 6,
            }}>
              {agent.name}
            </h1>
            <p className="animate-fade-up delay-100" style={{ fontFamily: FONT_BODY, fontStyle: 'italic', color: '#64748B', fontSize: '0.9rem', marginBottom: 14 }}>
              {agent.meaning}
            </p>
            <p className="animate-fade-up delay-200" style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 'clamp(1.05rem,1.8vw,1.3rem)', color: C.gold, lineHeight: 1.5, marginBottom: 28 }}>
              "{agent.tagline}"
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-wrap gap-3 mb-8">
              <a
                href={`https://wa.me/254799644100?text=I'd like to deploy ${agent.code} — ${agent.name}`}
                target="_blank" rel="noopener noreferrer"
                className="no-underline inline-block rounded-full font-semibold"
                onMouseEnter={() => setHoverDeploy(true)}
                onMouseLeave={() => setHoverDeploy(false)}
                style={{
                  background: hoverDeploy ? '#b8943e' : C.gold, color: dark ? DARK.text : C.navy,
                  padding: '12px 26px', fontFamily: FONT_BODY, fontSize: '0.9rem',
                  transition: 'all 0.3s', boxShadow: hoverDeploy ? '0 6px 22px rgba(201,168,76,0.4)' : 'none',
                  transform: hoverDeploy ? 'translateY(-2px)' : 'none',
                }}
              >
                Deploy {agent.code}
              </a>
              <a
                href="/contact"
                className="no-underline inline-block rounded-full font-semibold"
                onMouseEnter={() => setHoverDemo(true)}
                onMouseLeave={() => setHoverDemo(false)}
                style={{
                  background: hoverDemo ? 'rgba(56,189,248,0.12)' : 'transparent',
                  color: C.sky, border: `2px solid ${C.sky}`,
                  padding: '12px 26px', fontFamily: FONT_BODY, fontSize: '0.9rem',
                  transition: 'all 0.3s',
                }}
              >
                Book a Demo
              </a>
            </div>

            {/* Chips */}
            <div className="animate-fade-up delay-400 flex flex-wrap gap-2">
              {agent.chips.map(c => (
                <span key={c} style={{
                  background: 'rgba(10,31,68,0.6)', backdropFilter: 'blur(18px)',
                  border: '1px solid rgba(201,168,76,0.25)', borderRadius: 999,
                  padding: '6px 14px', color: '#CBD5E1', fontSize: '0.78rem', fontFamily: FONT_BODY,
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Right: terminal */}
          <div className="animate-fade-up delay-200 hidden md:block">
            <div style={{
              background: '#0D1F3C', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
            }}>
              {/* Terminal bar */}
              <div style={{ background: '#152545', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
                <span style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', color: '#4A6FA5', marginLeft: 8 }}>
                  {agent.code.toLowerCase()}.agent
                </span>
              </div>
              {/* Terminal body */}
              <div style={{ padding: '16px 20px', fontFamily: FONT_MONO, fontSize: '0.74rem', lineHeight: 1.8, maxHeight: 320, overflowY: 'auto' }}>
                {agent.terminalLines.map((line, i) => {
                  const isCommand = line.startsWith('>')
                  const isSuccess = line.includes('✓')
                  const isWarning = line.includes('⚠')
                  const isError   = line.includes('✗')
                  const color = isCommand ? '#38BDF8'
                              : isSuccess ? '#4ADE80'
                              : isWarning ? '#FBBF24'
                              : isError   ? '#F87171'
                              : '#94A3B8'
                  return (
                    <div key={i} style={{ color, whiteSpace: 'pre-wrap' }}>
                      {line}
                    </div>
                  )
                })}
                <div style={{ color: C.gold, display: 'inline-block', animation: 'blink 1.2s step-end infinite' }}>▋</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
      `}</style>
    </section>
  )
}

// 2. ProblemBlock
function ProblemBlock({ headline, body }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[860px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-4`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          THE PROBLEM
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.4rem,2.6vw,2rem)',
          color: dark ? DARK.text : C.navy, lineHeight: 1.3, marginBottom: 28,
        }}>
          {headline}
        </h2>
        {body.map((para, i) => (
          <p key={i} className={visible ? `animate-fade-up delay-${(i+2)*100}` : 'hidden-anim'} style={{
            fontFamily: FONT_BODY, fontSize: '1rem', color: dark ? DARK.text : C.charcoal,
            lineHeight: 1.9, marginBottom: i < body.length - 1 ? 20 : 0,
          }}>
            {para}
          </p>
        ))}
      </div>
    </section>
  )
}

// 3. CapabilitiesGrid
function CapabilitiesGrid({ code, capabilities }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
            WHAT {code} DOES
          </p>
          <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'white',
          }}>
            Core Capabilities
          </h2>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {capabilities.map((cap, i) => (
            <CapabilityCard key={i} cap={cap} delay={`delay-${(i % 3 + 1) * 100}`} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CapabilityCard({ cap, delay, visible }) {
  const { dark } = useTheme()
  const [hover, setHover] = useState(false)
  return (
    <div
      className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hover ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14, padding: '24px 24px',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{cap.icon}</div>
      <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 8 }}>
        {cap.title}
      </h3>
      <p style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.65 }}>
        {cap.desc}
      </p>
    </div>
  )
}

// 4. ToolsIntegrations
function ToolsIntegrations({ tools }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          INTEGRATIONS & DATA SOURCES
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', color: dark ? DARK.text : C.navy, marginBottom: 20,
        }}>
          What it connects to
        </h2>
        <div className={`${visible ? 'animate-fade-up delay-200' : 'hidden-anim'} flex flex-wrap gap-3`}>
          {tools.map((t, i) => (
            <span key={i} style={{
              fontFamily: FONT_MONO, fontWeight: 600, fontSize: '0.8rem',
              color: dark ? DARK.text : C.navy, background: dark ? DARK.surface : 'white', border: `1px solid ${dark ? DARK.border : C.border}`,
              borderRadius: 8, padding: '7px 14px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// 5. AgentWorkflow
function AgentWorkflow({ steps }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          HOW IT WORKS
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.4rem,2.6vw,2rem)', color: dark ? DARK.text : C.navy, marginBottom: 36,
        }}>
          The Workflow
        </h2>

        {/* Desktop horizontal */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'} style={{ position: 'relative', paddingRight: i < steps.length - 1 ? 24 : 0 }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: 20, left: 'calc(100% - 12px)', width: 24, height: 2, background: C.gold, zIndex: 1 }} />
              )}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.navy, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.85rem', color: C.gold }}>{s.step}</span>
              </div>
              <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.95rem', color: dark ? DARK.text : C.navy, marginBottom: 6 }}>{s.title}</h4>
              <p style={{ fontFamily: FONT_BODY, fontSize: '0.83rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden flex flex-col gap-6">
          {steps.map((s, i) => (
            <div key={i} className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'} style={{ display: 'flex', gap: 16, position: 'relative' }}>
              {i < steps.length - 1 && <div style={{ position: 'absolute', left: 19, top: 40, bottom: -24, width: 2, background: C.border }} />}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.navy, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.85rem', color: C.gold }}>{s.step}</span>
              </div>
              <div>
                <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.95rem', color: dark ? DARK.text : C.navy, marginBottom: 4 }}>{s.title}</h4>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.83rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 6. UseCases
function UseCases({ cases }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          IN THE FIELD
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.4rem,2.6vw,2rem)', color: dark ? DARK.text : C.navy, marginBottom: 28,
        }}>
          Real Use Cases
        </h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {cases.map((c, i) => (
            <div key={i} className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'} style={{
              background: dark ? DARK.surface : 'white', borderRadius: 16, padding: '28px 28px 32px',
              border: `1px solid ${dark ? DARK.border : C.border}`,
              boxShadow: '0 4px 20px rgba(10,31,68,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Users size={16} color={C.gold} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.78rem', color: C.navy }}>{c.persona}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: dark ? DARK.muted : C.muted, fontWeight: 700, marginBottom: 6 }}>THE SITUATION</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.75 }}>{c.problem}</p>
              </div>
              <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 16 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.gold, fontWeight: 700, marginBottom: 6 }}>THE OUTCOME</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.75 }}>{c.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 7. SampleOutput
function SampleOutput({ lines, code }) {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const [revealed, setRevealed] = useState(true) // v2.7.3: show full output by default
  const VISIBLE_LINES = 10

  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[860px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          SAMPLE OUTPUT
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', color: dark ? DARK.text : C.navy, marginBottom: 20,
        }}>
          What {code} actually produces
        </h2>

        <div className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ position: 'relative' }}>
          <div style={{
            background: '#0D1F3C', borderRadius: 14, overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          }}>
            {/* Bar */}
            <div style={{ background: '#152545', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.7rem', color: '#4A6FA5', marginLeft: 8 }}>
                {code.toLowerCase()}_report.txt
              </span>
            </div>
            {/* Content */}
            <div style={{ padding: '16px 20px', fontFamily: FONT_MONO, fontSize: '0.78rem', lineHeight: 1.8, color: '#94A3B8' }}>
              {(revealed ? lines : lines.slice(0, VISIBLE_LINES)).map((line, i) => {
                const isGold   = line.includes('│') || line.includes('┌') || line.includes('└') || line.includes('├') || line.includes('─') || line.includes('┤')
                const isGreen  = line.includes('✓')
                const isYellow = line.includes('⚠')
                const color = isGreen ? '#4ADE80' : isYellow ? '#FBBF24' : isGold ? '#C9A84C' : '#94A3B8'
                return <div key={i} style={{ color, whiteSpace: 'pre' }}>{line}</div>
              })}
            </div>
          </div>

          {/* Blur overlay */}
          {!revealed && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(to top, #FAFAF7 30%, transparent)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              paddingBottom: 16,
            }}>
              <button
                onClick={() => setRevealed(true)}
                style={{
                  background: C.navy, color: C.gold, border: `1px solid ${C.gold}`,
                  borderRadius: 999, padding: '9px 20px', fontFamily: FONT_BODY,
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = C.gold }}
              >
                View Full Sample ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// 8. FAQ
function FAQItem({ q, a, isOpen, onClick }) {
  const { dark } = useTheme()
  return (
    <div style={{ borderBottom: `1px solid ${dark ? DARK.border : C.border}` }}>
      <button
        onClick={onClick}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '18px 0', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}
      >
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.95rem', color: dark ? DARK.text : C.navy, lineHeight: 1.35 }}>
          {q}
        </span>
        {isOpen ? <ChevronUp size={18} color={C.gold} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={C.muted} style={{ flexShrink: 0 }} />}
      </button>
      {isOpen && (
        <p style={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.8, paddingBottom: 20 }}>
          {a}
        </p>
      )}
    </div>
  )
}

function FAQ({ faq }) {
  const { dark } = useTheme()
  const [open, setOpen] = useState(0)
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(60px,8vw,100px) 0' }}>
      <div className="max-w-[860px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          FAQ
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', color: dark ? DARK.text : C.navy, marginBottom: 28,
        }}>
          Common Questions
        </h2>
        <div className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'}>
          {faq.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// 9. DeploymentCTA
function DeploymentCTA({ agent }) {
  const { dark } = useTheme()
  const [hoverDeploy, setHoverDeploy] = useState(false)
  const [hoverWA,     setHoverWA    ] = useState(false)
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', position: 'relative', overflow: 'hidden' }}>
      <DotGrid opacity={0.1} />
      <div className="max-w-[700px] mx-auto px-6 text-center relative z-10">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          GET STARTED
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'white', marginBottom: 14,
        }}>
          Ready to Deploy <span style={{ color: C.gold }}>{agent.code}</span>?
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FONT_BODY, color: '#94A3B8', lineHeight: 1.8, marginBottom: 32 }}>
          {agent.name} can be onboarded and running in your business within 5 working days. No long-term contract. Cancel anytime.
        </p>

        <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap justify-center gap-4 mb-8`}>
          <a
            href="/contact"
            onMouseEnter={() => setHoverDeploy(true)}
            onMouseLeave={() => setHoverDeploy(false)}
            className="no-underline inline-block rounded-full font-semibold"
            style={{
              background: hoverDeploy ? '#b8943e' : C.gold, color: dark ? DARK.text : C.navy,
              padding: '14px 30px', fontFamily: FONT_BODY, fontSize: '0.95rem',
              transition: 'all 0.3s', boxShadow: hoverDeploy ? '0 6px 24px rgba(201,168,76,0.4)' : 'none',
              transform: hoverDeploy ? 'translateY(-2px)' : 'none',
            }}
          >
            Book a Demo
          </a>
          <a
            href={`https://wa.me/254799644100?text=I'd like to deploy ${agent.code} — ${agent.name}`}
            target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHoverWA(true)}
            onMouseLeave={() => setHoverWA(false)}
            className="no-underline inline-block rounded-full font-semibold"
            style={{
              background: hoverWA ? 'rgba(37,211,102,0.15)' : 'transparent',
              color: '#25D366', border: '2px solid #25D366',
              padding: '14px 30px', fontFamily: FONT_BODY, fontSize: '0.95rem',
              transition: 'all 0.3s',
            }}
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className={`${visible ? 'animate-fade-up delay-400' : 'hidden-anim'} flex flex-wrap justify-center gap-6`}>
          {['Deployed in 5 business days', 'No long-term contract', 'Cancel anytime'].map(t => (
            <span key={t} style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: '#475569' }}>
              <CheckCircle size={13} color={C.sky} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AgentDetailPage Root ─────────────────────────────────────────────────────
export default function AgentDetailPage() {
  const { dark } = useTheme()
  const { slug } = useParams()
  const navigate = useNavigate()

  const agent = AGENTS[slug]

  useDocumentMeta({ title: agent ? agent.name : 'Agent Detail', description: agent ? agent.tagline : undefined })

  // 404 fallback — redirect to /agents
  useEffect(() => {
    if (!agent) navigate('/agents', { replace: true })
  }, [agent, navigate])

  if (!agent) return null

  // Scroll to top on slug change
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  return (
    <>
      <AgentHero         agent={agent} />
      <ProblemBlock      headline={agent.problem.headline} body={agent.problem.body} />
      <CapabilitiesGrid  code={agent.code} capabilities={agent.capabilities} />
      <ToolsIntegrations tools={agent.tools} />
      <AgentWorkflow     steps={agent.workflow} />
      <UseCases          cases={agent.useCases} />
      <SampleOutput      lines={agent.sampleOutput} code={agent.code} />
      <FAQ               faq={[...(agent.faq || []), ...(agent.hesabuFaqs || [])]} />
      <DeploymentCTA     agent={agent} />
    </>
  )
}

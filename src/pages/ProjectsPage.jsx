/**
 * ProjectsPage.jsx — /projects
 *
 * Place at: src/pages/ProjectsPage.jsx
 *
 * Add to App.jsx routes:
 *   import ProjectsPage from './pages/ProjectsPage'
 *   <Route path="/projects" element={<ProjectsPage />} />
 *
 * Sections:
 *   1. PageHero
 *   2. FilterBar      — pill buttons (All / AI Agents / Web Dev / SEO / Full-Stack)
 *   3. ProjectGrid    — 3-col responsive, hover overlay with View Live + Case Study
 *   4. CaseStudyDrawer — right-slide 620px panel, full detail + testimonial + CTA
 *   5. ResultsStrip   — aggregate stats: case studies / ROI / retention
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, ExternalLink, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, DARK, FONTS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono


// ─── Design tokens ────────────────────────────────────────────────────────────

// ─── Project data (6 full case studies) ──────────────────────────────────────
const PROJECTS = [
  {
    id:       'savana',
    title:    'Savana Logistics — Operations Automation',
    client:   'Savana Logistics Ltd',
    industry: 'Road Freight & Last-Mile Delivery',
    category: 'AI Agents',
    tags:     ['PESA Agent', 'MALIPO Agent', 'WhatsApp Automation'],
    image:    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  'Full operations overhaul for a 28-driver Nairobi logistics company — reconciliation, payroll, and driver comms automated end-to-end.',
    challenge: 'Savana Logistics was processing 400+ M-Pesa driver payments weekly with a single accounts clerk doing the reconciliation manually every Friday. Payroll was calculated in a shared Google Sheet, NSSF contributions were inconsistently applied, and the business owner was still personally approving every payslip via WhatsApp at 10 PM on Thursdays. The reconciliation backlog had grown to six weeks, and a KES 180,000 discrepancy had been sitting unresolved for four of them.',
    approach: [
      'Deployed PESA agent with M-Pesa Business API integration — reconciliation configured to run twice daily, 06:00 and 18:00 EAT.',
      'Deployed MALIPO agent connected to their driver roster — statutory deductions computed and payslips generated and dispatched by 07:00 on the 28th of each month.',
      'Built a WhatsApp alert workflow: dispatch confirmations, exception flagging, and daily float status to the COO\'s phone.',
      'Parallel-ran both agents alongside the manual process for 3 weeks to validate output accuracy before full handover.',
    ],
    outcome: {
      stats: [
        { val: '16h',   label: 'Reclaimed per month per clerk' },
        { val: 'KES 0', label: 'Late penalty exposure (was KES 22K/mo)' },
        { val: '98.8%', label: 'Reconciliation match rate, first run' },
      ],
      summary: 'The accounts team redirected 16 hours per month from data entry to analysis. The six-week reconciliation backlog was cleared in the first PESA run. No late payroll or statutory filing penalties have occurred in 11 months of operation.',
    },
    testimonial: {
      quote: 'Before NeuroSpark, I spent my Sunday evenings preparing Monday reports. Now that time belongs to my family — and my team gets better data than I used to produce manually.',
      name:  'Amina Wanjiku',
      role:  'Founder & CEO, Savana Logistics',
    },
  },
  {
    id:       'maisha',
    title:    'Maisha Healthcare — Website & SEO',
    client:   'Maisha Healthcare Ltd',
    industry: 'Private Healthcare & Diagnostics',
    category: 'Full-Stack',
    tags:     ['Web Development', 'SEO Agent', 'Google Business Profile'],
    image:    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  'Complete digital rebuild for a Nairobi private clinic — new site, managed SEO, and a tripling of inbound enquiries in 90 days.',
    challenge: 'Maisha Healthcare had a three-year-old website that loaded in 8.4 seconds, displayed stock photos of Western hospitals, and ranked on page 4 for every search term that mattered to their business. Their Google Business Profile had 12 reviews and hadn\'t been updated since 2021. Inbound enquiries were coming almost entirely through word of mouth — the website was actively losing them leads it should have been converting.',
    approach: [
      'Full redesign and rebuild in 3 weeks — mobile-first, sub-2-second load, Playfair/DM Sans editorial aesthetic adapted for healthcare trust signals.',
      'Google Business Profile overhaul: 6 categories, 40 updated photos, FAQ responses, and a weekly post cadence managed by the web agent.',
      'SEO agent configured with 54 target keywords across 5 service clusters (diagnostics, specialist consultations, maternity, physiotherapy, corporate wellness).',
      'Content production: 2 articles per week for the first 12 weeks, targeting high-intent Nairobi healthcare searches.',
    ],
    outcome: {
      stats: [
        { val: '3×',    label: 'Increase in inbound enquiries (month 3)' },
        { val: 'Pg 1',  label: 'Google ranking for 18 target keywords' },
        { val: '1.8s',  label: 'New page load time (was 8.4s)' },
      ],
      summary: 'Within 90 days, Maisha Healthcare ranked on page one for 18 priority keywords and saw a three-fold increase in website-generated appointment enquiries. The SEO agent continues to produce two articles per week; the web agent handles all content updates without any staff involvement.',
    },
    testimonial: {
      quote: 'Our website was three years old and embarrassing us in pitches. Three weeks after onboarding NeuroSpark, it looked like a company half our age would envy.',
      name:  'Dr. David Odhiambo',
      role:  'CEO, Maisha Healthcare',
    },
  },
  {
    id:       'zuri-interiors',
    title:    'Zuri Interiors — SEO Growth',
    client:   'Zuri Interiors',
    industry: 'Interior Design & Home Furnishing',
    category: 'SEO',
    tags:     ['SEO Agent', 'Local SEO', 'Content Production'],
    image:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  "From page 4 to page 1 for 'interior designers Nairobi' in 90 days — without a single blog post written by the client.",
    challenge: "Zuri Interiors had strong portfolio work and excellent client referrals but virtually no organic search presence. Their site ranked on page 4 for 'interior designers Nairobi' — below three competitors with significantly less impressive portfolios. The director had tried a freelance SEO consultant for six months, paid KES 45,000, and seen zero measurable movement. She had concluded SEO didn't work for design businesses in Kenya.",
    approach: [
      'Technical audit: identified 23 critical issues — missing alt text on 140 portfolio images, no schema markup, duplicate title tags, 4.7s load time on mobile.',
      'Keyword strategy: 67-keyword map across service clusters (residential, commercial, hospitality, office design) with Nairobi neighbourhood modifiers.',
      'SEO agent producing 3 articles per week — neighbourhood design guides, material sourcing deep-dives, and before/after project spotlights.',
      'Google Business Profile activation with weekly project photo posts managed by the agent.',
    ],
    outcome: {
      stats: [
        { val: 'Pg 1',   label: "Rank for 'interior designers Nairobi'" },
        { val: '90 days',label: 'Time to first-page position' },
        { val: '+340%',  label: 'Organic traffic increase (6-month)' },
      ],
      summary: "Zuri Interiors moved from page 4 to position 3 for their primary keyword in 88 days. Six months in, organic traffic had increased by 340% and the director receives 4–6 qualified inbound project enquiries per month directly from Google — a channel that previously contributed zero.",
    },
    testimonial: {
      quote: "We went from page 4 to page 1 for 'interior designers Nairobi' in under 90 days. We didn't write a single blog post ourselves. I just track the bookings.",
      name:  'Grace Kamau',
      role:  'Director, Zuri Interiors',
    },
  },
  {
    id:       'acme-trade',
    title:    'Acme Trading — KRA Compliance Agent',
    client:   'Acme Trading Ltd',
    industry: 'Import & General Trade',
    category: 'AI Agents',
    tags:     ['KODI Agent', 'BIASHARA Agent', 'iTax Integration'],
    image:    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  'Eliminated KES 340,000 in annual tax penalties for a Mombasa import business across two registered entities.',
    challenge: 'A Mombasa-based import business operating two registered entities had accumulated KES 340,000 in KRA penalties over 18 months from late VAT, PAYE, and withholding tax filings. The external accountant managed compliance reactively — filing when reminded by the client, not proactively. Three times in 18 months, the directors discovered filings were overdue only when a KRA payment notice arrived. The business was also misclassifying goods under incorrect HS codes, paying 25% CET on shipments that qualified for 0% EAC preferential treatment.',
    approach: [
      'KODI deployed across both entities — full obligation calendars built for VAT, PAYE, WHT, and corporate tax instalment schedules.',
      'BIASHARA deployed for all import shipments — HS code validation and EAC preferential tariff checking on every incoming consignment.',
      'Alert chains configured: 14-day, 7-day, 3-day, and 24-hour deadline reminders to both directors and their accountant via WhatsApp.',
      'Retrospective HS code review of all 14 active product lines — reclassified 9 items to correct EAC preferential status.',
    ],
    outcome: {
      stats: [
        { val: 'KES 0',   label: 'Tax penalties in 12 months post-deployment' },
        { val: 'KES 720K',label: 'Saved in EAC duties (first quarter)' },
        { val: '2 entities',label: 'Managed on a single compliance dashboard' },
      ],
      summary: "In the 12 months following deployment, zero late filing penalties were incurred across both entities. The BIASHARA agent's HS reclassification saved KES 720,000 in the first quarter alone. The external accountant now receives pre-populated return drafts and spends under 30 minutes per month on the account.",
    },
    testimonial: {
      quote: 'I used to find out about overdue filings from KRA notices. Now KODI tells me 14 days before anything is due. I haven\'t paid a late filing penalty in over a year.',
      name:  'James Mutua',
      role:  'Director, Acme Trading Ltd',
    },
  },
  {
    id:       'green-harvest',
    title:    'Green Harvest Co-op — Agriculture Intelligence',
    client:   'Green Harvest Cooperative',
    industry: 'Horticulture & Export Agriculture',
    category: 'AI Agents',
    tags:     ['SHAMBA Agent', 'Bidhaa Agent', 'WhatsApp Delivery'],
    image:    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  '340 smallholder members across Mt. Kenya now receive daily commodity prices and EU export intelligence on WhatsApp — before 6 AM.',
    challenge: 'Green Harvest is a smallholder cooperative of 340 avocado and French bean farmers in Kirinyaga County. Members were selling 100% of produce to domestic aggregators at KES 25/kg during peak avocado season — when EU spot prices were equivalent to KES 120/kg. They had no GlobalG.A.P. certification, no understanding of what EU market entry would require, and two consecutive seasons of poor germination rates due to planting decisions made without weather data.',
    approach: [
      'SHAMBA agent configured for Kirinyaga County — daily weather forecasts from KMD, KEPHIS pest alerts geo-filtered to the region, EAGC and NCE commodity prices delivered by 05:30 EAT to the cooperative chairman\'s WhatsApp.',
      'Bidhaa agent engaged for EU market assessment — identified GlobalG.A.P. group certification as the single critical gap, mapped HCDA programme pathway.',
      'Supported cooperative through HCDA export support programme enrolment — certification achieved in 14 weeks.',
      'First EU shipment coordinated with Netherlands-based importer identified through Bidhaa\'s buyer matching signal.',
    ],
    outcome: {
      stats: [
        { val: '+280%', label: 'Price premium vs domestic (EU market)' },
        { val: '14 wks',label: 'Time to GlobalG.A.P. certification' },
        { val: '-23pp', label: 'Reduction in crop loss from Fall Armyworm' },
      ],
      summary: 'The cooperative shipped their first EU export order within five months of initial Bidhaa assessment. Fall Armyworm crop losses dropped from 12% to under 3% in the first full season under SHAMBA. The chairman now starts each morning with a 3-minute WhatsApp brief that replaced three hours of informal market intelligence gathering per week.',
    },
    testimonial: {
      quote: 'We were selling for KES 25 when buyers in Europe were paying KES 120. Nobody told us that was possible. NeuroSpark told us — and then showed us exactly how to get there.',
      name:  'Peter Mwangi',
      role:  'Chairman, Green Harvest Cooperative',
    },
  },
  {
    id:       'ngara-tech',
    title:    'Ngara Tech Hub — Full-Stack Digital',
    client:   'Ngara Technology Hub',
    industry: 'Co-working & Tech Community',
    category: 'Full-Stack',
    tags:     ['Web Development', 'SEO Agent', 'ZURI Agent', 'WhatsApp Automation'],
    image:    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    liveUrl:  '#',
    excerpt:  'New website, SEO growth engine, and ZURI customer service agent — deployed as a single integrated system for a Nairobi co-working space.',
    challenge: "Ngara Tech Hub was a well-regarded co-working space in Nairobi with strong community word-of-mouth but almost no digital presence. Their website was a single-page Wix site with outdated pricing. WhatsApp enquiries went unanswered for hours — often overnight, when international prospects were most active. They were losing tour bookings to competitors who responded faster, and ranking for no meaningful keywords despite being in a high-search category.",
    approach: [
      'Full website rebuild in React/Next.js — tour booking integration, real-time availability widget, member testimonial carousel, and SEO-optimised landing pages for each membership tier.',
      'SEO agent deployed: 44 target keywords across co-working, hot-desking, private office, and event space search queries in Nairobi.',
      'ZURI customer service agent configured with Ngara\'s full pricing, availability, tour booking flow, and membership FAQ — responses in English, Swahili, and Sheng.',
      'WhatsApp Business API connected to ZURI; Instagram DM routing configured for international enquiries.',
    ],
    outcome: {
      stats: [
        { val: '28s',   label: 'Average WhatsApp response time (was 4+ hrs)' },
        { val: '+420%', label: 'Organic search traffic in 6 months' },
        { val: '94%',   label: 'WhatsApp enquiries resolved without human' },
      ],
      summary: 'ZURI now handles 94% of WhatsApp and Instagram enquiries without human involvement — including tour bookings, pricing questions, and availability checks. Organic search traffic grew 420% in six months. The co-working space went from zero to 11 page-one keyword positions and is now the top organic result for "co-working space Nairobi CBD".',
    },
    testimonial: {
      quote: 'We had a three-person front desk team spending most of their day answering the same 10 WhatsApp questions. ZURI handles all of that now. They focus on member experience instead.',
      name:  'Kevin Otieno',
      role:  'Co-founder, Ngara Tech Hub',
    },
  },
]

const FILTERS = ['All', 'AI Agents', 'Web Development', 'SEO', 'Full-Stack']

// ─── Shared ────────────────────────────────────────────────────────────────────
function DotGrid({ opacity = 0.12 }) {
  const { dark } = useTheme()
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="projDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#projDots)" />
      </svg>
    </div>
  )
}

const CATEGORY_COLOR = {
  'AI Agents':      '#3B82F6',
  'Web Development':'#10B981',
  'SEO':            '#F59E0B',
  'Full-Stack':     '#8B5CF6',
}

// ─── 1. PageHero ────────────────────────────────────────────────────────────
function PageHero() {
  const { dark } = useTheme()
  return (
    <section className="relative overflow-hidden text-center" style={{
      background: C.navy,
      paddingTop:    'clamp(120px,14vw,160px)',
      paddingBottom: 'clamp(70px,9vw,110px)',
    }}>
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 70%, rgba(201,168,76,0.1) 0%, transparent 60%)',
      }} />
      <div className="max-w-[860px] mx-auto px-6 relative z-10">
        <p className="animate-fade-up mb-4" style={{ fontFamily: FM, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: C.gold, fontWeight: 700 }}>
          // OUR WORK
        </p>
        <h1 className="animate-fade-up delay-100" style={{
          fontFamily: FD, fontWeight: 700,
          fontSize: 'clamp(2rem,5vw,3.6rem)',
          color: 'white', lineHeight: 1.15, marginBottom: 18,
        }}>
          Projects That{' '}
          <em style={{ color: C.gold }}>Speak for Themselves.</em>
        </h1>
        <p className="animate-fade-up delay-200" style={{
          fontFamily: FB, fontSize: 'clamp(1rem,2vw,1.1rem)',
          color: '#94A3B8', maxWidth: 540, margin: '0 auto',
          lineHeight: 1.85,
        }}>
          Six case studies. Real East African businesses. Measurable outcomes in operations, digital visibility, and revenue.
        </p>
      </div>
    </section>
  )
}

// ─── 2. FilterBar ─────────────────────────────────────────────────────────────
function FilterBar({ active, onFilter }) {
  const { dark } = useTheme()
  return (
    <div style={{ background: dark ? DARK.bg : C.bg, padding: '28px 0 4px', borderBottom: `1px solid ${dark ? DARK.border : C.border}` }}>
      <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap gap-2">
        {FILTERS.map(f => {
          const isActive = active === f
          return (
            <button
              key={f}
              onClick={() => onFilter(f)}
              style={{
                fontFamily: FB, fontWeight: 700, fontSize: '0.84rem',
                padding: '8px 18px', borderRadius: 999,
                border: `1.5px solid ${isActive ? C.gold : C.border}`,
                background: isActive ? C.navy : 'white',
                color: isActive ? C.gold : C.muted,
                cursor: 'pointer', transition: 'all 0.25s',
                marginBottom: 24,
              }}
            >
              {f}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 3. ProjectCard ───────────────────────────────────────────────────────────
function ProjectCard({ project, onCaseStudy, delay }) {
  const { dark } = useTheme()
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()
  const catColor = CATEGORY_COLOR[project.category] || C.gold

  return (
    <div
      ref={ref}
      className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        border: `1.5px solid ${hover ? C.gold : 'transparent'}`,
        boxShadow: hover ? '0 16px 52px rgba(10,31,68,0.18)' : '0 4px 24px rgba(10,31,68,0.08)',
        transform: hover ? 'translateY(-6px)' : 'none',
        transition: 'all 0.35s ease',
        background: dark ? DARK.surface : 'white',
      }}
    >
      {/* Image with overlay */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,31,68,0.82)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <a
            href={project.liveUrl}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', borderRadius: 999, padding: '9px 16px',
              fontFamily: FB, fontWeight: 700, fontSize: '0.82rem',
              textDecoration: 'none', backdropFilter: 'blur(8px)',
              transition: 'background 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <ExternalLink size={13} /> View Live
          </a>
          <button
            onClick={() => onCaseStudy(project)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: C.gold, border: 'none', color: dark ? DARK.text : C.navy,
              borderRadius: 999, padding: '9px 16px',
              fontFamily: FB, fontWeight: 700, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'background 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#b8943e'}
            onMouseLeave={e => e.currentTarget.style.background = C.gold}
          >
            <ArrowRight size={13} /> Case Study
          </button>
        </div>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: `${catColor}22`, border: `1px solid ${catColor}55`,
          backdropFilter: 'blur(8px)',
          borderRadius: 999, padding: '4px 12px',
        }}>
          <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.68rem', color: catColor, letterSpacing: '0.06em' }}>
            {project.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 22px 22px' }}>
        <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.05rem', color: dark ? DARK.text : C.navy, marginBottom: 8, lineHeight: 1.3 }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: FB, fontSize: '0.86rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.65, marginBottom: 14 }}>
          {project.excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: FM, fontWeight: 600, fontSize: '0.7rem',
              color: dark ? DARK.text : C.navy, background: C.goldDim,
              border: `1px solid rgba(201,168,76,0.3)`,
              borderRadius: 6, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 4. CaseStudyDrawer ────────────────────────────────────────────────────
function CaseStudyDrawer({ project, onClose }) {
  const { dark } = useTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  if (!project && !visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(10,31,68,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: visible && project ? 1 : 0,
          transition: 'opacity 0.35s',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(620px, 100vw)',
          background: dark ? DARK.bg : C.bg,
          zIndex: 500,
          overflowY: 'auto',
          transform: visible && project ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '-16px 0 60px rgba(10,31,68,0.2)',
        }}
      >
        {project && (
          <>
            {/* Panel hero image */}
            <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,31,68,0.85))' }} />
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(10,31,68,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)', transition: 'background 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.5)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,31,68,0.7)'}
              >
                <X size={18} />
              </button>
              <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
                <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.68rem', color: C.gold, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  {project.industry}
                </span>
                <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.35rem', color: 'white', lineHeight: 1.25, margin: 0 }}>
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Panel content */}
            <div style={{ padding: '28px 28px 40px' }}>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-24px" style={{ marginBottom: 24 }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: FM, fontWeight: 600, fontSize: '0.72rem', color: dark ? DARK.text : C.navy, background: C.goldDim, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 6, padding: '4px 11px' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Challenge */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, marginBottom: 10 }}>
                  THE CHALLENGE
                </p>
                <p style={{ fontFamily: FB, fontSize: '0.92rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.85 }}>
                  {project.challenge}
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${dark ? DARK.border : C.border}`, margin: '24px 0' }} />

              {/* Approach */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, marginBottom: 14 }}>
                  THE APPROACH
                </p>
                <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {project.approach.map((step, i) => (
                    <li key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.navy, border: `1.5px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.72rem', color: C.gold }}>{i + 1}</span>
                      </div>
                      <p style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.75 }}>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${dark ? DARK.border : C.border}`, margin: '24px 0' }} />

              {/* Outcome stats */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, marginBottom: 14 }}>
                  THE OUTCOME
                </p>
                <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 16 }}>
                  {project.outcome.stats.map((s, i) => (
                    <div key={i} style={{ background: C.navy, borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
                      <div style={{ fontFamily: FD, fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', color: C.gold, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
                      <div style={{ fontFamily: FB, fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.85 }}>
                  {project.outcome.summary}
                </p>
              </div>

              {/* Testimonial */}
              <div style={{
                background: dark ? DARK.surface : C.sand, borderRadius: 14, padding: '20px 22px',
                borderLeft: `4px solid ${C.gold}`, marginBottom: 28,
              }}>
                <span style={{ fontFamily: FD, fontSize: '2.4rem', color: C.gold, lineHeight: 0.6, display: 'block', marginBottom: 10 }}>"</span>
                <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: '1rem', color: dark ? DARK.text : C.navy, lineHeight: 1.7, marginBottom: 14 }}>
                  {project.testimonial.quote}
                </p>
                <div>
                  <div style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.88rem', color: C.navy }}>{project.testimonial.name}</div>
                  <div style={{ fontFamily: FB, fontSize: '0.78rem', color: C.muted }}>{project.testimonial.role}</div>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/contact?enquiry=custom"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: C.gold, color: dark ? DARK.text : C.navy, borderRadius: 999,
                  padding: '14px 24px', fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#b8943e'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.boxShadow = 'none' }}
              >
                Start a Similar Project <ChevronRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ─── 5. ResultsStrip ─────────────────────────────────────────────────────────
function ResultsStrip() {
  const { dark } = useTheme()
  const [ref, visible] = useInView()
  const STATS = [
    { val: '6',    label: 'Active Case Studies' },
    { val: '3×',   label: 'Average ROI Reported' },
    { val: '100%', label: 'Client Retention Rate' },
    { val: '5',    label: 'East African Countries' },
  ]
  return (
    <section ref={ref} style={{ background: C.navy, padding: 'clamp(48px,6vw,72px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid gap-6 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          {STATS.map((s, i) => (
            <div key={i} className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'}>
              <div style={{ fontFamily: FD, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', color: C.gold, lineHeight: 1, marginBottom: 8 }}>
                {s.val}
              </div>
              <div style={{ fontFamily: FB, fontSize: '0.86rem', color: '#94A3B8' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ProjectsPage Root ────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { dark } = useTheme()
  useDocumentTitle('Projects')
  const [filter,   setFilter]   = useState('All')
  const [drawer,   setDrawer]   = useState(null)   // active project for drawer

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const filtered = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter || p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())))

  const filterMap = {
    'Web Development': p => p.category === 'Web Development' || p.category === 'Full-Stack' || p.tags.some(t => t.toLowerCase().includes('web')),
    'SEO':             p => p.category === 'SEO' || p.category === 'Full-Stack' || p.tags.some(t => t.toLowerCase().includes('seo')),
    'AI Agents':       p => p.category === 'AI Agents' || p.tags.some(t => t.toLowerCase().includes('agent')),
    'Full-Stack':      p => p.category === 'Full-Stack',
  }

  const display = filter === 'All' ? PROJECTS : PROJECTS.filter(filterMap[filter] || (() => false))

  return (
    <>
      <PageHero />
      <FilterBar active={filter} onFilter={setFilter} />

      <section style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="max-w-[1100px] mx-auto px-6">
          {display.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: dark ? DARK.muted : C.muted, fontFamily: FB }}>
              No projects in this category yet — check back soon.
            </div>
          ) : (
            <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))' }}>
              {display.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onCaseStudy={setDrawer}
                  delay={`delay-${(i % 3 + 1) * 100}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ResultsStrip />

      <CaseStudyDrawer project={drawer} onClose={() => setDrawer(null)} />
    </>
  )
}

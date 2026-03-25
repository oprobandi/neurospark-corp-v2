/**
 * FAQPage.jsx — v3.3.1 (NEW)
 *
 * Dedicated /faq page.
 * Structured as accordion by category. Schema.org FAQPage JSON-LD injected
 * via useDocumentMeta for SEO rich snippets in Google Search.
 *
 * Categories:
 *   1. Getting Started
 *   2. How the Agents Work
 *   3. Pricing & Contracts
 *   4. Technical & Integrations
 *   5. Data, Privacy & Security
 *   6. Results & Support
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useScrollTop } from '../hooks/useScrollTop'
import { C, DARK, FONTS } from '../constants'
import Eyebrow from '../components/ui/Eyebrow'
import { BtnGoldLink } from '../components/ui/Buttons'
import Footer from '../components/Footer'

const FD = FONTS.display
const FB = FONTS.body

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What exactly is an AI agent?',
        a: 'An AI agent is software that runs autonomously to complete a defined job — without you prompting it each time. Think of it like a specialist employee who never calls in sick, works 24/7, and produces consistent output. Our agents handle specific operational domains: payroll reconciliation, website updates, SEO content, report generation, and more.',
      },
      {
        q: 'Do I need any technical background to use your agents?',
        a: 'None at all. You communicate with us in plain language — WhatsApp, email, or a call. We configure everything on our end. You receive outputs (reports, updates, alerts) in whatever format you already use. No dashboards to learn, no software to install.',
      },
      {
        q: 'How long does setup take?',
        a: 'Most clients are fully operational within 5–10 business days. The first week involves a structured onboarding call where we map your current workflows, identify the highest-impact automation opportunities, and agree on output formats and schedules. Agents go live the following week.',
      },
      {
        q: 'Which East African countries do you serve?',
        a: 'We currently serve businesses in Kenya, Uganda, Tanzania, Rwanda, and Burundi. Our agents are built specifically for the regulatory and market realities of these countries — KRA compliance, M-Pesa integrations, local SEO, and multilingual (English / Swahili) output where needed.',
      },
    ],
  },
  {
    category: 'How the Agents Work',
    items: [
      {
        q: 'How many agents do you have, and what do they each do?',
        a: 'We have 13 specialist agents, each purpose-built for a specific operational challenge. They cover areas including payroll & compliance (PESA), payment reconciliation (MALIPO), tax filing assistance (KODI), website management (WAVUTI), SEO & content (UKWELI), operations reporting (RIPOTI), HR documentation (RASILIMALI), and more. Visit our Agents page for the full roster.',
      },
      {
        q: 'Can agents work together, or do I have to pick just one?',
        a: 'Agents can be orchestrated into multi-agent pipelines. Our HESABU platform, for example, combines PESA + MALIPO + KODI into a single compliance engine. You can start with one agent and expand as you see value — there is no obligation to commit to the full suite immediately.',
      },
      {
        q: 'What happens when an agent makes a mistake or encounters an edge case?',
        a: 'All agents are configured with human-in-the-loop checkpoints for decisions above a defined confidence threshold. When something is ambiguous or unusual, the agent surfaces it to you with a clear summary rather than proceeding automatically. Our team also reviews flagged outputs during the first 30 days of operation to calibrate the agent to your specific business context.',
      },
      {
        q: 'Will the agents replace my staff?',
        a: "No — and that's intentional. Our agents are built to eliminate the repetitive, low-judgment work that buries your team. The goal is to free your people for the work only they can do: relationships, creative decisions, client service. Think of agents as removing the admin load, not the people.",
      },
    ],
  },
  {
    category: 'Pricing & Contracts',
    items: [
      {
        q: 'How is pricing structured?',
        a: 'Pricing is based on the number and type of agents deployed and the volume of operations they handle monthly. We offer monthly retainer plans with no long-term lock-in, and a custom enterprise tier for larger deployments. Contact us for a scoped proposal — we do not publish fixed rates because every implementation is different.',
      },
      {
        q: 'Is there a minimum contract length?',
        a: 'No minimum contract. We operate month-to-month. We believe the value should keep you as a client — not a contract clause. That said, most clients stay long-term because the ROI becomes visible within the first 30–60 days.',
      },
      {
        q: 'Do you offer a trial or pilot period?',
        a: 'Yes. We offer a scoped 2-week pilot for new clients that focuses on one high-impact workflow. This lets you see tangible output before committing to a full deployment. Pilot terms are discussed during the initial discovery call.',
      },
    ],
  },
  {
    category: 'Technical & Integrations',
    items: [
      {
        q: 'What tools and systems can the agents integrate with?',
        a: 'Our agents integrate with the tools East African businesses actually use: M-Pesa, KRA iTax, Google Workspace, WhatsApp Business API, Quickbooks, Sage, common CRM platforms, and most websites built on WordPress, Webflow, or custom stacks. If you use a tool not listed here, tell us — our team evaluates new integrations regularly.',
      },
      {
        q: 'Does my website need to be rebuilt to work with your web agent?',
        a: 'No. The WAVUTI web management agent works with your existing site. We do not require a rebuild or migration. For sites that are severely outdated or broken, we may recommend a brief remediation sprint first, but this is the exception rather than the rule.',
      },
      {
        q: 'Do you provide any kind of reporting or visibility into what agents are doing?',
        a: 'Yes. Every agent produces a weekly activity digest sent to you by email or WhatsApp — your choice. The digest covers actions taken, outputs produced, anomalies flagged, and a plain-language summary of what happened that week. No logins required.',
      },
    ],
  },
  {
    category: 'Data, Privacy & Security',
    items: [
      {
        q: 'Who owns the data the agents process?',
        a: 'You do. Always. We process your data on your behalf and do not retain, resell, or use it for any purpose outside your engagement. This is covered explicitly in our service agreement.',
      },
      {
        q: 'How do you handle sensitive financial or payroll data?',
        a: 'Financial data is processed in encrypted pipelines and is never stored beyond the operational window required to complete a task. Access is restricted to the specific agent and the named Neurospark engineer assigned to your account. We follow ISO 27001-aligned security practices.',
      },
      {
        q: 'Are your systems compliant with Kenya\'s Data Protection Act?',
        a: 'Yes. We operate in compliance with the Kenya Data Protection Act (2019) and align with broader GDPR principles for any clients with international data exposure. A Data Processing Agreement (DPA) is available on request.',
      },
    ],
  },
  {
    category: 'Results & Support',
    items: [
      {
        q: 'How quickly will I see results?',
        a: 'For operations automation (payroll, reporting), you typically see measurable time savings within the first week of go-live. For SEO and web management, meaningful ranking improvements usually appear within 60–90 days — consistent with how search engines index and re-evaluate sites.',
      },
      {
        q: 'What support do I get once agents are live?',
        a: 'Every client has a named account manager reachable by WhatsApp and email during business hours (EAT). Urgent issues are handled within 4 hours. We also do a formal 30-day and 90-day review call to assess performance and adjust agent configuration as your business evolves.',
      },
      {
        q: 'What if I want to pause or cancel?',
        a: 'You can pause or cancel at the end of any billing month with 7 days notice. We provide a clean offboarding handover — including documentation of every workflow the agent was managing — so you are never left stranded.',
      },
    ],
  },
]

// ─── AccordionItem ────────────────────────────────────────────────────────────
function AccordionItem({ q, a, open, onToggle, dark }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : C.border}`,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <span style={{
          fontFamily: FD,
          fontWeight: 600,
          fontSize: 'clamp(0.95rem,2vw,1.05rem)',
          color: open ? C.gold : (dark ? DARK.text : C.navy),
          lineHeight: 1.4,
          transition: 'color 0.2s',
        }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          color={open ? C.gold : (dark ? DARK.muted : C.muted)}
          style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 600 : 0,
        transition: 'max-height 0.35s ease',
      }}>
        <p style={{
          fontFamily: FB,
          fontSize: '0.95rem',
          color: dark ? '#CBD5E1' : C.charcoal,
          lineHeight: 1.8,
          paddingBottom: 20,
          paddingRight: 32,
        }}>
          {a}
        </p>
      </div>
    </div>
  )
}

// ─── CategoryBlock ────────────────────────────────────────────────────────────
function CategoryBlock({ category, items, dark }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div style={{ marginBottom: 52 }}>
      <h3 style={{
        fontFamily: FB,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: C.gold,
        marginBottom: 8,
      }}>
        {category}
      </h3>
      <div style={{
        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : C.border}`,
      }}>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            q={item.q}
            a={item.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            dark={dark}
          />
        ))}
      </div>
    </div>
  )
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const { dark } = useTheme()
  useScrollTop()
  useDocumentMeta({
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to common questions about Neurospark Corporation\'s AI agents, pricing, integrations, data security, and how autonomous automation works for East African businesses.',
  })

  return (
    <main style={{ background: dark ? DARK.bg : C.bg, minHeight: '100vh' }}>
      {/* ── Hero band ── */}
      <section style={{
        paddingTop:    'clamp(120px,14vw,160px)',
        paddingBottom: 'clamp(56px,6vw,80px)',
        background:    dark ? DARK.bg : C.bg,
        borderBottom:  `1px solid ${dark ? 'rgba(255,255,255,0.06)' : C.border}`,
      }}>
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <Eyebrow className="animate-fade-up">FREQUENTLY ASKED QUESTIONS</Eyebrow>
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontFamily: FD, fontWeight: 700,
              fontSize: 'clamp(2rem,4.5vw,3rem)',
              color: dark ? DARK.text : C.navy,
              lineHeight: 1.2, marginBottom: 18,
            }}
          >
            Everything you've been<br />
            <em style={{ color: C.gold }}>wondering about us.</em>
          </h1>
          <p
            className="animate-fade-up delay-200"
            style={{ fontFamily: FB, color: dark ? DARK.muted : C.muted, lineHeight: 1.8, fontSize: '1rem' }}
          >
            Can't find what you're looking for?{' '}
            <Link to="/contact" style={{ color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
              Talk to us directly →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Accordion ── */}
      <section style={{ padding: 'clamp(56px,8vw,100px) 0' }}>
        <div className="max-w-[760px] mx-auto px-6">
          {FAQ_CATEGORIES.map((cat) => (
            <CategoryBlock
              key={cat.category}
              category={cat.category}
              items={cat.items}
              dark={dark}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        background:    dark ? DARK.surface : C.navy,
        padding:       'clamp(56px,8vw,96px) 0',
      }}>
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <p style={{
            fontFamily: FB, fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.16em',
            color: C.gold, marginBottom: 16,
          }}>
            STILL HAVE QUESTIONS?
          </p>
          <h2 style={{
            fontFamily: FD, fontWeight: 700,
            fontSize: 'clamp(1.7rem,3.5vw,2.4rem)',
            color: 'white', lineHeight: 1.25, marginBottom: 14,
          }}>
            Let's walk you through it<br />on a 20-minute call.
          </h2>
          <p style={{ fontFamily: FB, color: '#94A3B8', lineHeight: 1.8, marginBottom: 36, fontSize: '0.95rem' }}>
            No sales pitch. Just a structured conversation about your workflows
            and whether our agents are the right fit for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BtnGoldLink to="/contact">Book a Discovery Call</BtnGoldLink>
            <Link
              to="/agents"
              className="flex items-center gap-2 no-underline"
              style={{ color: '#94A3B8', fontFamily: FB, fontSize: '0.9rem' }}
            >
              Browse the agents first <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

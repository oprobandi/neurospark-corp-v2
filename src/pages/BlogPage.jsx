/**
 * BlogPage.jsx — v3.0
 *
 * CRITICAL CHANGE from v2.9:
 *   BlogPage now fetches live posts from Hashnode via src/api/hashnode.js.
 *   The previous version imported static data from src/data/blog.js but
 *   NEVER called the Hashnode API — despite the client being built in v2.7.
 *   This was the primary functional bug identified in the codebase audit.
 *
 * Data Strategy (ADR-018: Hashnode-primary, static fallback):
 *   1. On mount, fetchPosts() from Hashnode API is called.
 *   2. If successful → live posts replace static fallback.
 *   3. If API fails (network error, publication not found) → graceful error state.
 *   4. Loading skeleton shown during fetch.
 *   Static POSTS from data/blog.js are still used as:
 *     (a) Blog card shape reference during loading
 *     (b) Fallback for SuggestedArticles in single-post view
 *
 * Single post view (/blog/:slug):
 *   Calls fetchPost(slug) for full HTML content.
 *   Falls back to static post if Hashnode fetch fails.
 *
 * Data shape normalisation:
 *   Hashnode post → normalised to same shape as static POSTS:
 *     { slug, title, excerpt, category, readTime, date, image, author, tags, body }
 *   where body for Hashnode posts is a single HTML block (type:'html').
 *
 * Sections (list view):
 *   1. ListHero    — search bar + category filter pills
 *   2. FeaturedPost — large 2-col card
 *   3. BlogGrid    — filtered grid with loading/error states
 *   4. NewsletterBlock
 *
 * Single post view (/blog/:slug):
 *   1. PostHero
 *   2. PostBody    — renders HTML for Hashnode posts, blocks for static posts
 *   3. SuggestedArticles
 *   4. NewsletterBlock
 */

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Search, Clock, Calendar, ArrowRight, X, ChevronRight, AlertCircle, Loader } from 'lucide-react'
import { useInView }  from '../hooks/useInView'
import { C, DARK, FONTS, IMAGES } from '../constants'
import { useTheme }   from '../context/ThemeContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fetchPosts, fetchPost } from '../api/hashnode'
import { POSTS as STATIC_POSTS, BLOG_CATEGORIES as CATEGORIES, CAT_COLOR } from '../data/blog'

const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono

// ─── Normalise Hashnode post to internal shape ────────────────────────────────
function normaliseHashnodePost(hn) {
  return {
    slug:     hn.slug,
    title:    hn.title,
    excerpt:  hn.brief || '',
    // Map Hashnode tags to our category system; fall back to first tag or 'AI Agents'
    category: mapHashnodeCategory(hn.tags?.map(t => t.name) || []),
    readTime: hn.readTimeInMinutes || 5,
    date:     formatDate(hn.publishedAt),
    image:    hn.coverImage?.url || IMAGES.hero,
    author: {
      name:   hn.author?.name || 'Paul Nyang\'wara',
      role:   'Founder, NeuroSpark',
      avatar: hn.author?.profilePicture || IMAGES.founder,
    },
    tags:     hn.tags?.map(t => t.name) || [],
    featured: false,
    // For Hashnode posts, body is a single HTML block (rendered via dangerouslySetInnerHTML)
    body:     hn.content?.html ? [{ type: 'html', content: hn.content.html }] : [],
    _source:  'hashnode',
  }
}

function mapHashnodeCategory(tags) {
  const tagLower = tags.map(t => t.toLowerCase())
  if (tagLower.some(t => ['tax','kra','paye','vat','nssf','payroll','compliance'].some(k => t.includes(k)))) return 'Tax & Compliance'
  if (tagLower.some(t => ['seo','search','google','ranking'].some(k => t.includes(k)))) return 'SEO'
  if (tagLower.some(t => ['agri','farm','shamba','food','crop'].some(k => t.includes(k)))) return 'Agriculture'
  if (tagLower.some(t => ['real estate','property','land','ardhi'].some(k => t.includes(k)))) return 'Real Estate'
  return 'AI Agents'
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return iso }
}

// ─── Shared ────────────────────────────────────────────────────────────────────
function DotGrid({ opacity = 0.12 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="blogDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blogDots)" />
      </svg>
    </div>
  )
}

function CategoryBadge({ cat, small }) {
  const color = CAT_COLOR[cat] || C.gold
  return (
    <span style={{
      fontFamily: FM, fontWeight: 700,
      fontSize: small ? '0.65rem' : '0.7rem',
      letterSpacing: '0.07em',
      color, background: `${color}14`,
      border: `1px solid ${color}35`,
      borderRadius: 999, padding: small ? '2px 9px' : '3px 11px',
      display: 'inline-block',
    }}>
      {cat?.toUpperCase()}
    </span>
  )
}

// ─── Loading skeleton cards ───────────────────────────────────────────────────
function SkeletonCard() {
  const { dark } = useTheme()
  const base = { background: dark ? DARK.surfaceHi : '#E8E4DC', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: dark ? DARK.surface : 'white', boxShadow: '0 2px 16px rgba(10,31,68,0.07)' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{ ...base, height: 180 }} />
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{ ...base, height: 12, width: '30%', marginBottom: 12 }} />
        <div style={{ ...base, height: 16, width: '85%', marginBottom: 8 }} />
        <div style={{ ...base, height: 16, width: '70%', marginBottom: 16 }} />
        <div style={{ ...base, height: 12, width: '50%' }} />
      </div>
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────
function BlogError({ message, onRetry }) {
  const { dark } = useTheme()
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: dark ? DARK.muted : C.muted }}>
      <AlertCircle size={40} color={C.gold} style={{ marginBottom: 16 }} />
      <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.1rem', color: dark ? DARK.text : C.navy, marginBottom: 8 }}>
        Could not load posts
      </p>
      <p style={{ fontFamily: FB, fontSize: '0.88rem', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
        {message || 'The Hashnode publication may not be live yet.'}
      </p>
      <button
        onClick={onRetry}
        style={{ background: C.gold, color: C.navy, border: 'none', borderRadius: 999, padding: '10px 22px', fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
      >
        Try Again
      </button>
    </div>
  )
}

// ─── NewsletterBlock ──────────────────────────────────────────────────────────
function NewsletterBlock() {
  const { dark } = useTheme()
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)
  const [ref, visible] = useInView()

  const submit = () => {
    if (!email.includes('@')) { alert('Please enter a valid email.'); return }
    window.open(`https://wa.me/254799644100?text=${encodeURIComponent(`Please subscribe ${email} to the NeuroSpark weekly digest.`)}`, '_blank')
    setSent(true)
  }

  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(64px,8vw,100px) 0' }}>
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          WEEKLY DIGEST
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,2.8vw,2rem)', color: dark ? DARK.text : C.navy, marginBottom: 10 }}>
          Get Kenya's Best Business Intelligence Weekly
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, color: dark ? DARK.muted : C.muted, lineHeight: 1.8, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
          Join 2,000+ East African business owners. Tax deadlines, AI automation case studies, SEO strategies, and regulatory updates — every Friday morning.
        </p>
        {sent ? (
          <div style={{ background: dark ? DARK.surface : 'white', border: `1px solid ${dark ? DARK.border : C.border}`, borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>✅</div>
            <p style={{ fontFamily: FB, fontWeight: 700, color: dark ? DARK.text : C.navy, fontSize: '0.95rem' }}>You're in. First edition arrives Friday.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center" style={{ maxWidth: 460, margin: '0 auto' }}>
            <input
              type="email" placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ flex: 1, minWidth: 200, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '12px 18px', fontFamily: FB, fontSize: '0.9rem', color: dark ? DARK.text : C.charcoal, background: dark ? DARK.surface : 'white', outline: 'none' }}
            />
            <button onClick={submit} style={{ background: C.gold, color: C.navy, border: 'none', borderRadius: 999, padding: '12px 22px', fontFamily: FB, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Subscribe Free
            </button>
          </div>
        )}
        <p style={{ fontFamily: FB, fontSize: '0.76rem', color: '#94A3B8', marginTop: 12 }}>
          No spam. Unsubscribe anytime. 2,000+ subscribers.
        </p>
      </div>
    </section>
  )
}

// ─── List view components ─────────────────────────────────────────────────────
function ListHero({ query, setQuery, activeCategory, setActiveCategory }) {
  return (
    <section className="relative overflow-hidden" style={{ background: C.navy, paddingTop: 'clamp(110px,13vw,150px)', paddingBottom: 'clamp(48px,6vw,72px)' }}>
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.09) 0%, transparent 60%)' }} />
      <div className="max-w-[860px] mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <p className="animate-fade-up mb-3" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>INSIGHTS & IDEAS</p>
          <h1 className="animate-fade-up delay-100" style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'white', lineHeight: 1.2, marginBottom: 6 }}>
            AI, Automation & Business in Kenya.
          </h1>
        </div>
        {/* Search bar */}
        <div className="animate-fade-up delay-200 mx-auto" style={{ maxWidth: 480, position: 'relative', marginBottom: 20 }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Search articles…" value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '12px 40px 12px 42px', fontFamily: FB, fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
          />
          {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={15} /></button>}
        </div>
        {/* Category pills */}
        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.8rem', padding: '7px 16px', borderRadius: 999, border: `1.5px solid ${isActive ? C.gold : 'rgba(255,255,255,0.18)'}`, background: isActive ? C.goldDim : 'transparent', color: isActive ? C.gold : '#94A3B8', cursor: 'pointer', transition: 'all 0.25s' }}>
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedPost({ post }) {
  const { dark } = useTheme()
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(48px,6vw,72px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-6`} style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>FEATURED ARTICLE</p>
        <Link to={`/blog/${post.slug}`} className={`${visible ? 'animate-fade-up delay-100' : 'hidden-anim'} no-underline grid`}
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 0, border: `1.5px solid ${hover ? C.gold : C.border}`, borderRadius: 20, overflow: 'hidden', transition: 'all 0.35s', boxShadow: hover ? '0 16px 52px rgba(10,31,68,0.14)' : '0 4px 24px rgba(10,31,68,0.07)', transform: hover ? 'translateY(-4px)' : 'none' }}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >
          <div style={{ overflow: 'hidden', minHeight: 280 }}>
            <img src={post.image} alt={post.title} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s ease', minHeight: 280 }} />
          </div>
          <div style={{ background: dark ? DARK.surface : 'white', padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 14 }}><CategoryBadge cat={post.category} /></div>
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.3rem,2.4vw,1.8rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.3, marginBottom: 14 }}>{post.title}</h2>
            <p style={{ fontFamily: FB, fontSize: '0.92rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.8, marginBottom: 20 }}>{post.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FB, fontSize: '0.78rem', color: C.muted }}><Calendar size={13} color={C.muted} /> {post.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FB, fontSize: '0.78rem', color: C.muted }}><Clock size={13} color={C.muted} /> {post.readTime} min read</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.gold, fontFamily: FB, fontWeight: 700, fontSize: '0.88rem' }}>
              Read Article <ArrowRight size={14} style={{ transition: 'transform 0.25s', transform: hover ? 'translateX(4px)' : 'none' }} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}

function BlogCard({ post, delay }) {
  const { dark } = useTheme()
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()
  return (
    <Link ref={ref} to={`/blog/${post.slug}`}
      className={`${visible ? `animate-fade-up ${delay}` : 'hidden-anim'} no-underline block`}
      style={{ textDecoration: 'none', borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${hover ? C.gold : 'transparent'}`, boxShadow: hover ? '0 12px 40px rgba(10,31,68,0.14)' : '0 2px 16px rgba(10,31,68,0.07)', transform: hover ? 'translateY(-5px)' : 'none', transition: 'all 0.3s ease', background: dark ? DARK.surface : 'white' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div style={{ overflow: 'hidden', aspectRatio: '16/9' }}>
        <img src={post.image} alt={post.title} width={400} height={225} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
      </div>
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{ marginBottom: 10 }}><CategoryBadge cat={post.category} small /></div>
        <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.02rem', color: dark ? DARK.text : C.navy, lineHeight: 1.35, marginBottom: 8 }}>{post.title}</h3>
        <p style={{ fontFamily: FB, fontSize: '0.84rem', color: dark ? DARK.muted : C.muted, lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={post.author.avatar} alt={post.author.name} width={28} height={28} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.76rem', color: dark ? DARK.text : C.navy }}>{post.author.name}</div>
              <div style={{ fontFamily: FB, fontSize: '0.7rem', color: C.muted }}>{post.date}</div>
            </div>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.muted, fontFamily: FB, fontSize: '0.74rem' }}><Clock size={12} /> {post.readTime}m</span>
        </div>
      </div>
    </Link>
  )
}

// ─── Single post view ─────────────────────────────────────────────────────────
function PostHero({ post }) {
  return (
    <section style={{ paddingTop: 70 }}>
      <div style={{ position: 'relative', maxHeight: 480, overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} width={1200} height={480} style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,31,68,0.3) 0%, rgba(10,31,68,0.8) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,4vw,48px)' }}>
          <div className="max-w-[860px] mx-auto">
            <CategoryBadge cat={post.category} />
            <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', color: 'white', lineHeight: 1.2, marginTop: 12, marginBottom: 14, maxWidth: 700 }}>{post.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={post.author.avatar} alt={post.author.name} width={36} height={36} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${C.gold}`, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{post.author.name}</div>
                  <div style={{ fontFamily: FB, fontSize: '0.76rem', color: '#94A3B8' }}>{post.author.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8' }}><Calendar size={12} /> {post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8' }}><Clock size={12} /> {post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PostBody({ post }) {
  const { dark } = useTheme()
  return (
    <section style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(40px,6vw,72px) 0' }}>
      <div className="max-w-[720px] mx-auto px-6">
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: dark ? DARK.muted : C.muted, fontFamily: FB, fontSize: '0.84rem', textDecoration: 'none', marginBottom: 32 }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = dark ? DARK.muted : C.muted}
        >← Back to Blog</Link>

        {post.excerpt && (
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: '1.15rem', color: dark ? DARK.text : C.navy, lineHeight: 1.75, marginBottom: 32, paddingLeft: 20, borderLeft: `3px solid ${C.gold}` }}>
            {post.excerpt}
          </p>
        )}

        {/* Hashnode HTML content */}
        {post.body?.length > 0 && post.body[0].type === 'html' ? (
          <div
            className="blog-prose"
            style={{ fontFamily: FB, fontSize: '1rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: post.body[0].content }}
          />
        ) : (
          /* Static block content */
          post.body?.map((block, i) => {
            if (block.type === 'h2') return <h2 key={i} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.2rem,2.2vw,1.55rem)', color: dark ? DARK.text : C.navy, lineHeight: 1.3, marginTop: 40, marginBottom: 14 }}>{block.content}</h2>
            return <p key={i} style={{ fontFamily: FB, fontSize: '1rem', color: dark ? DARK.text : C.charcoal, lineHeight: 1.9, marginBottom: 18 }}>{block.content}</p>
          })
        )}

        {post.tags?.length > 0 && (
          <div style={{ borderTop: `1px solid ${dark ? DARK.border : C.border}`, paddingTop: 24, marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontFamily: FM, fontWeight: 600, fontSize: '0.74rem', color: dark ? DARK.text : C.navy, background: C.goldDim, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 6, padding: '4px 11px' }}>{tag}</span>
            ))}
          </div>
        )}

        <div style={{ background: C.navy, borderRadius: 16, padding: '28px 28px', marginTop: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 4 }}>Ready to put this into practice?</p>
            <p style={{ fontFamily: FB, fontSize: '0.84rem', color: '#94A3B8' }}>See the agent that handles this automatically.</p>
          </div>
          <Link to="/agents" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.gold, color: C.navy, borderRadius: 999, padding: '10px 20px', fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
            Browse Agents <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function SuggestedArticles({ currentSlug, allPosts }) {
  const { dark } = useTheme()
  const suggestions = allPosts.filter(p => p.slug !== currentSlug).slice(0, 3)
  const [ref, visible] = useInView()
  if (!suggestions.length) return null
  return (
    <section ref={ref} style={{ background: dark ? DARK.surface : C.sand, padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-4`} style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>YOU MIGHT ALSO LIKE</p>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
          {suggestions.map((p, i) => <BlogCard key={p.slug} post={p} delay={`delay-${(i + 1) * 100}`} />)}
        </div>
      </div>
    </section>
  )
}

// ─── BlogPage Root ────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { dark }  = useTheme()
  const { slug }  = useParams()
  const navigate  = useNavigate()

  // ── Posts state ────────────────────────────────────────────────────────────
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [retryN,  setRetryN]  = useState(0)

  // ── Single-post state ──────────────────────────────────────────────────────
  const [singlePost,     setSinglePost]     = useState(null)
  const [singleLoading,  setSingleLoading]  = useState(false)
  const [singleError,    setSingleError]    = useState(null)

  // ── List / filter state ────────────────────────────────────────────────────
  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  // ── Fetch post list ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPosts({ first: 20 })
      .then(({ posts: hnPosts }) => {
        if (cancelled) return
        setPosts(hnPosts.map(normaliseHashnodePost))
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.warn('[BlogPage] Hashnode fetch failed:', err.message)
        setError(err.message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [retryN])

  // ── Fetch single post ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return
    setSingleLoading(true)
    setSingleError(null)
    setSinglePost(null)
    fetchPost(slug)
      .then(hnPost => {
        setSinglePost(normaliseHashnodePost(hnPost))
        setSingleLoading(false)
      })
      .catch(err => {
        // Try static fallback
        const staticPost = STATIC_POSTS.find(p => p.slug === slug)
        if (staticPost) {
          setSinglePost(staticPost)
          setSingleLoading(false)
        } else {
          setSingleError(err.message)
          setSingleLoading(false)
        }
      })
  }, [slug])

  // ── Single post view ───────────────────────────────────────────────────────
  if (slug) {
    useDocumentMeta({
      title:       singlePost ? singlePost.title : 'Blog',
      description: singlePost?.excerpt || undefined,
      canonical:   `https://neurosparkcorporation.ai/blog/${slug}`,
    })

    if (singleLoading) return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={36} color={C.gold} style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
    if (singleError || !singlePost) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BlogError message={singleError} onRetry={() => navigate('/blog')} />
        </div>
      )
    }
    const allForSuggestions = posts.length ? posts : STATIC_POSTS
    return (
      <>
        <PostHero post={singlePost} />
        <PostBody post={singlePost} />
        <SuggestedArticles currentSlug={slug} allPosts={allForSuggestions} />
        <NewsletterBlock />
      </>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────
  useDocumentMeta({
    title:       'Blog — AI, Tax & Automation for East African Business',
    description: 'Practical guides on KRA compliance, M-Pesa reconciliation, SEO, and AI automation for Kenyan and East African businesses.',
    canonical:   'https://neurosparkcorporation.ai/blog',
  })

  // Merge: live posts first, fill with static if live is empty
  const displayPosts = posts.length ? posts : (error ? [] : STATIC_POSTS)
  const featuredPost  = displayPosts.find(p => p.featured) || displayPosts[0]

  const filtered = useMemo(() => {
    let list = displayPosts.filter(p => p.slug !== featuredPost?.slug)
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category?.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, query, displayPosts, featuredPost])

  return (
    <>
      <ListHero query={query} setQuery={setQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      {/* Loading state */}
      {loading && (
        <section style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(48px,6vw,72px) 0' }}>
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {!loading && error && (
        <section style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(48px,6vw,72px) 0' }}>
          <div className="max-w-[1100px] mx-auto px-6">
            <BlogError message={error} onRetry={() => setRetryN(n => n + 1)} />
          </div>
        </section>
      )}

      {/* Loaded state */}
      {!loading && !error && (
        <>
          {!query && activeCategory === 'All' && featuredPost && <FeaturedPost post={featuredPost} />}
          <section style={{ background: dark ? DARK.bg : C.bg, padding: 'clamp(32px,4vw,60px) 0 clamp(60px,8vw,100px)' }}>
            <div className="max-w-[1100px] mx-auto px-6">
              {(query || activeCategory !== 'All') ? (
                <p style={{ fontFamily: FB, fontSize: '0.84rem', color: dark ? DARK.muted : C.muted, marginBottom: 24 }}>
                  {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
                  {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                  {query ? ` for "${query}"` : ''}
                </p>
              ) : (
                <p className="mb-6" style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>ALL ARTICLES</p>
              )}
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: dark ? DARK.muted : C.muted, fontFamily: FB }}>
                  No articles found. Try a different search or category.
                </div>
              ) : (
                <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
                  {filtered.map((p, i) => <BlogCard key={p.slug} post={p} delay={`delay-${(i % 3 + 1) * 100}`} />)}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <NewsletterBlock />
    </>
  )
}

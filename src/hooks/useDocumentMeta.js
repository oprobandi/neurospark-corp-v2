/**
 * useDocumentMeta.js — v3.0
 *
 * Replaces useDocumentTitle (v2.x). Extends per-page meta to cover:
 *   • document.title
 *   • meta[name="description"]
 *   • meta[property="og:*"]  (title, description, image, url)
 *   • meta[name="twitter:*"] (title, description, image)
 *   • link[rel="canonical"]
 *
 * ADR-015: Per-page meta injection without SSR.
 *
 * Usage:
 *   import { useDocumentMeta } from '../hooks/useDocumentMeta'
 *
 *   useDocumentMeta({
 *     title:       'Our AI Agents',
 *     description: '13 autonomous AI agents built for East African businesses.',
 *     canonical:   'https://neurosparkcorporation.ai/agents',
 *     image:       'https://neurosparkcorporation.ai/logo.jpg', // optional
 *   })
 *
 * Passing no args (or null title) resets to base site meta.
 * Each page call is idempotent — safe to call multiple times.
 */

import { useEffect } from 'react'

const BASE_TITLE   = 'Neurospark Corporation'
const BASE_URL     = 'https://neurosparkcorporation.ai'
const DEFAULT_IMG  = `${BASE_URL}/logo.jpg`
const DEFAULT_DESC = 'Neurospark Corporation — Nairobi-built autonomous AI agents for East African founders. We automate operations, manage your website, and grow your Google rankings.'

/** Sets or creates a <meta> tag by CSS selector. */
function setMeta(selector, attr, val) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    // Parse attribute assignments from selector like meta[name="description"]
    const nameMatch = selector.match(/\[name="([^"]+)"\]/)
    const propMatch = selector.match(/\[property="([^"]+)"\]/)
    if (nameMatch) el.setAttribute('name', nameMatch[1])
    if (propMatch) el.setAttribute('property', propMatch[1])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, val)
}

/** Sets or creates a <link> tag by rel. */
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * @param {object} opts
 * @param {string|null} [opts.title]       – Page-specific title (appended with " | Neurospark Corporation")
 * @param {string}      [opts.description] – Page meta description (150–160 chars ideal)
 * @param {string}      [opts.image]       – Absolute URL for OG/Twitter card image
 * @param {string}      [opts.canonical]   – Absolute canonical URL for this page
 */
export function useDocumentMeta({ title, description, image, canonical } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE
    const desc      = description || DEFAULT_DESC
    const img       = image       || DEFAULT_IMG
    const canon     = canonical   || BASE_URL + window.location.pathname

    // ── Title ─────────────────────────────────────────────────────────────────
    document.title = fullTitle

    // ── Meta description ──────────────────────────────────────────────────────
    setMeta('meta[name="description"]',         'content', desc)

    // ── Open Graph ────────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',        'content', fullTitle)
    setMeta('meta[property="og:description"]',  'content', desc)
    setMeta('meta[property="og:image"]',        'content', img)
    setMeta('meta[property="og:url"]',          'content', canon)

    // ── Twitter / X ───────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]',       'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="twitter:image"]',       'content', img)

    // ── Canonical ─────────────────────────────────────────────────────────────
    setLink('canonical', canon)

    // Cleanup: restore to base on unmount
    return () => {
      document.title = BASE_TITLE
    }
  }, [title, description, image, canonical])
}

// ─── Backward-compatibility alias ────────────────────────────────────────────
// Existing calls to useDocumentTitle(title) still work unchanged.
export function useDocumentTitle(title) {
  useDocumentMeta({ title: title || null })
}

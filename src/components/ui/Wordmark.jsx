/**
 * Wordmark.jsx — v2.7
 *
 * Changes:
 *   • All text now renders in gold (#C9A84C) on every background
 *   • Uniform font-weight 700 across Neuro, spark, and Corporation
 *   • Removed footer prop — no longer needed (gold works on all backgrounds)
 *   • Dark mode no longer requires any special handling
 */

import logo from '../../assets/logo.jpg'

export default function Wordmark({ size = '1.35rem' }) {
  return (
    <span className="flex items-center gap-2.5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: size }}>
      <img
        src={logo}
        alt="Neurospark Corporation"
        className="rounded-full object-cover flex-shrink-0"
        style={{ height: 42, width: 42 }}
      />
      <span style={{ color: '#C9A84C' }}>
        Neurospark Corporation
      </span>
    </span>
  )
}

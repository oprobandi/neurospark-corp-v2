/**
 * constants.js — v2.8
 *
 * Changes from v2.7.3:
 *   • IMAGES.founder added — local founder headshot (src/assets/founder.jpg)
 *   • IMAGES.av1–av3 updated to Black Kenyan/East African model photos (Unsplash)
 *     Previous av2 was not representative of Kenyan context
 */

// ─── Light theme (default) ────────────────────────────────────────────────────
export const C = {
  bg:       '#FAFAF7',
  navy:     '#0A1F44',
  navyMid:  '#1A3060',
  navyDeep: '#06132C',
  gold:     '#C9A84C',
  goldDark: '#b8943e',
  goldDim:  'rgba(201,168,76,0.15)',
  sky:      '#38BDF8',
  sand:     '#F5EFE0',
  charcoal: '#2C2C2C',
  muted:    '#6B6B6B',
  border:   '#E0D9CC',
  green:    '#25D366',
}

// ─── Dark theme tokens ────────────────────────────────────────────────────────
export const DARK = {
  bg:         '#06132C',
  surface:    '#0A1F44',
  surfaceHi:  '#1A3060',
  text:       '#E8E4DC',
  muted:      '#94A3B8',
  border:     'rgba(201,168,76,0.20)',
  gold:       '#C9A84C',
  goldGlow:   'rgba(201,168,76,0.15)',
  green:      '#25D366',
}

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONTS = {
  display: "'Playfair Display', serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'Space Grotesk', sans-serif",
}

// ─── Images (WebP via Unsplash format param) ──────────────────────────────────
export const IMAGES = {
  hero:    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&fm=webp&fit=crop&q=80',
  ch1:     'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&fm=webp&fit=crop&q=80',
  ch2:     'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&fm=webp&fit=crop&q=80',
  ch3:     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&fm=webp&fit=crop&q=80',
  // ── Testimonial avatars — v2.8: updated to Black Kenyan/East African models ──
  av1:     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&fm=webp&fit=crop&q=80',
  av2:     'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=120&fm=webp&fit=crop&q=80',
  av3:     'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&fm=webp&fit=crop&q=80',
  // ── Founder headshot — v2.8: local asset replaces Unsplash placeholder ───────
  founder: '/founder.jpg',
}

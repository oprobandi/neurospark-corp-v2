/**
 * src/data/testimonials.js — v2.6
 *
 * Centralised testimonial card data.
 * Previously inline in Testimonials.jsx — extracted in v2.6 per ADR-009 pattern.
 */

import { IMAGES } from '../constants'

export const TESTIMONIALS = [
  {
    avatar:  IMAGES.av1,
    name:    'Amina Wanjiku',
    role:    'Founder, Savana Logistics',
    quote:   'Before Neurospark Corporation, I spent my Sunday evenings preparing Monday reports. Now that time belongs to my family — and my team gets better data than I used to produce manually.',
    metric:  '⚡ Reclaimed 14 hours per week',
    tag:     'Operations Automation',
    delay:   'delay-100',
  },
  {
    avatar:  IMAGES.av2,
    name:    'David Odhiambo',
    role:    'CEO, Maisha Healthcare',
    quote:   'Our website was three years old and embarrassing us in pitches. Three weeks after onboarding Neurospark Corporation, it looked like a company half our age would envy. Now it updates itself.',
    metric:  '📈 3× increase in inbound enquiries',
    tag:     'Website Management',
    delay:   'delay-200',
  },
  {
    avatar:  IMAGES.av3,
    name:    'Grace Kamau',
    role:    'Director, Zuri Interiors',
    quote:   "We went from page 4 to page 1 for 'interior designers Nairobi' in under 90 days. We didn't write a single blog post ourselves. I just track the bookings.",
    metric:  '🏆 Page 1 ranking in 90 days',
    tag:     'SEO Growth',
    delay:   'delay-300',
  },
]

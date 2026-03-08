/**
 * StatsStrip.jsx — v2.7.3
 *
 * Changes from v2.5:
 *   • 4th stat added: "47 Counties" — reinforces national coverage depth
 *
 * Changes from v2.4:
 *   • Count-up animation via useCountUp hook — numbers animate from 0 to target
 *     when the strip enters the viewport (respects prefers-reduced-motion)
 *   • Suffix characters ('+', 'hrs', '×') are displayed separately so only
 *     the numeric portion animates
 */

import { useInView }   from '../hooks/useInView'
import { useCountUp }  from '../hooks/useCountUp'

// Each stat has: num (display value), label, countTarget (integer for count-up),
// prefix/suffix for non-numeric characters around the animating number.
const STATS = [
  { label: 'East African Businesses Served',  countTarget: 150, suffix: '+' },
  { label: 'Average Hours Reclaimed Per Week', countTarget: 14,  suffix: 'hrs' },
  { label: 'Average SEO Traffic Growth in 90 Days', countTarget: 3, suffix: '×' },
  { label: 'Kenyan Counties Covered by Our Agents', countTarget: 47, suffix: '' },
]

function AnimatedStat({ label, countTarget, suffix, visible }) {
  const count = useCountUp(countTarget, visible, 1800)
  return (
    <div className="text-center">
      <span
        style={{
          fontFamily:  "'Playfair Display',serif",
          fontStyle:   'italic',
          fontSize:    'clamp(2.4rem,5vw,3.8rem)',
          color:       '#C9A84C',
          display:     'block',
          lineHeight:  1,
        }}
      >
        {count}{suffix}
      </span>
      <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: 8 }}>{label}</p>
    </div>
  )
}

export default function StatsStrip() {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} style={{ background: '#0A1F44', padding: '56px 0' }}>
      <div
        className="max-w-[1100px] mx-auto px-6 grid gap-10"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}
      >
        {STATS.map((s, i) => (
          <AnimatedStat key={i} {...s} visible={visible} />
        ))}
      </div>
    </div>
  )
}

/**
 * StatsStrip.jsx — v3.0
 *
 * Changes from v2.7.3:
 *   • Mobile grid changed from auto-fit/minmax to explicit grid-cols-2 sm:grid-cols-4
 *     Fixes marginal reflow at 360–540px viewports (UX audit §2.6)
 */

import { useInView }   from '../hooks/useInView'
import { useCountUp }  from '../hooks/useCountUp'

const STATS = [
  { label: 'East African Businesses Served',      countTarget: 150, suffix: '+'  },
  { label: 'Average Hours Reclaimed Per Week',     countTarget: 14,  suffix: 'hrs'},
  { label: 'Average SEO Traffic Growth in 90 Days', countTarget: 3,  suffix: '×' },
  { label: 'Kenyan Counties Covered by Our Agents', countTarget: 47, suffix: ''  },
]

function AnimatedStat({ label, countTarget, suffix, visible }) {
  const count = useCountUp(countTarget, visible, 1800)
  return (
    <div className="text-center">
      <span
        style={{
          fontFamily: "'Playfair Display',serif",
          fontStyle:  'italic',
          fontSize:   'clamp(2.4rem,5vw,3.8rem)',
          color:      '#C9A84C',
          display:    'block',
          lineHeight: 1,
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
      {/* v3.0: explicit 2-col mobile / 4-col desktop — prevents marginal reflow on 360–540px */}
      <div
        className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-10"
      >
        {STATS.map((s, i) => (
          <AnimatedStat key={i} {...s} visible={visible} />
        ))}
      </div>
    </div>
  )
}

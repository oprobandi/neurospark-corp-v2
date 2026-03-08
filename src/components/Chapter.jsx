import { useInView } from '../hooks/useInView'
import Eyebrow from './ui/Eyebrow'

export default function Chapter({ reverse = false, bg = '#FAFAF7', eyebrow, headline, problem, solutionText, img, imgAlt }) {
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: bg, padding: 'clamp(80px,10vw,140px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div
          className="grid gap-16 items-center"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}
        >
          {/* Visual — conditionally ordered */}
          <div
            className={`${visible ? (reverse ? 'animate-slide-r' : 'animate-slide-l') : 'hidden-anim'} ${reverse ? 'md:order-2' : 'md:order-1'}`}
          >
            <div
              className="rounded-[20px] overflow-hidden"
              style={{ aspectRatio: '4/3', background: '#F5EFE0', boxShadow: 'inset 0 2px 20px rgba(10,31,68,0.06)' }}
            >
              <img src={img} alt={imgAlt} loading="lazy" className="w-full h-full object-cover block" />
            </div>
          </div>

          {/* Text */}
          <div
            className={`${visible ? (reverse ? 'animate-slide-l' : 'animate-slide-r') : 'hidden-anim'} ${reverse ? 'md:order-1' : 'md:order-2'}`}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3.5vw,2.4rem)', color: '#0A1F44', lineHeight: 1.25, marginBottom: 16 }}
            >
              {headline}
            </h2>
            <p style={{ color: '#2C2C2C', lineHeight: 1.85, marginBottom: 20 }}>{problem}</p>

            <hr style={{ border: 'none', borderTop: '2px solid #C9A84C', width: 60, margin: '28px 0' }} />

            <Eyebrow>HOW NEUROSPARK CORPORATION SOLVES IT</Eyebrow>
            <p style={{ color: '#2C2C2C', lineHeight: 1.85 }}>{solutionText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

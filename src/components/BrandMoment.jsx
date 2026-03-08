import { useInView } from '../hooks/useInView'
import { BtnGhost } from './ui/Buttons'

export default function BrandMoment() {
  const [ref, visible] = useInView()
  return (
    <section
      ref={ref}
      id="about"
      style={{ background: '#0A1F44', padding: 'clamp(80px,10vw,140px) 0', textAlign: 'center' }}
    >
      <div className="max-w-[800px] mx-auto px-6">
        <p
          className={visible ? 'animate-fade-up' : 'hidden-anim'}
          style={{
            fontFamily: "'Playfair Display',serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem,3.2vw,2.2rem)',
            color: '#C9A84C',
            lineHeight: 1.55,
            marginBottom: 40,
          }}
        >
          "By Monday morning, your inbox is triaged, your Nairobi website is updated, your Google ranking report is ready — and you didn't lift a finger."
        </p>
        <div className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'}>
          <BtnGhost href="#services">See How the Agents Work →</BtnGhost>
        </div>
      </div>
    </section>
  )
}

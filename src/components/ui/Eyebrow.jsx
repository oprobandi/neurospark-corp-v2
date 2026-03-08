export default function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`mb-3.5 ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: '#C9A84C',
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  )
}

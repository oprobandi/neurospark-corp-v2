import { useState } from 'react'
import { Link } from 'react-router-dom'

const GOLD_STYLE = (hover, extra = {}) => ({
  background:     hover ? '#b8943e' : '#C9A84C',
  color:          '#0A1F44',
  padding:        '13px 28px',
  boxShadow:      hover ? '0 6px 22px rgba(201,168,76,0.38)' : 'none',
  transform:      hover ? 'translateY(-2px)' : 'none',
  fontFamily:     "'DM Sans', sans-serif",
  fontWeight:     600,
  fontSize:       '0.95rem',
  borderRadius:   999,
  transition:     'all 0.3s',
  textDecoration: 'none',
  cursor:         'pointer',
  display:        'inline-block',
  ...extra,
})

/**
 * BtnGold — <a href> variant. Use for external URLs or same-page hash anchors.
 */
export function BtnGold({ children, href = '/contact', onClick, className = '', style = {} }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={GOLD_STYLE(hover, style)}
    >
      {children}
    </a>
  )
}

/**
 * BtnGoldLink — react-router <Link to> variant. Use for all internal route navigation.
 * Eliminates the nested-<a> bug that occurs when wrapping BtnGold in a <Link>.
 */
export function BtnGoldLink({ children, to = '/contact', onClick, className = '', style = {} }) {
  const [hover, setHover] = useState(false)
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={GOLD_STYLE(hover, style)}
    >
      {children}
    </Link>
  )
}

/**
 * BtnGhost — outline/ghost button, <a href> variant.
 */
export function BtnGhost({ children, href = '#' }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:     hover ? 'rgba(56,189,248,0.1)' : 'transparent',
        color:          '#38BDF8',
        border:         '2px solid #38BDF8',
        padding:        '13px 28px',
        borderRadius:   999,
        fontFamily:     "'DM Sans', sans-serif",
        fontWeight:     600,
        fontSize:       '0.95rem',
        textDecoration: 'none',
        cursor:         'pointer',
        display:        'inline-block',
        transition:     'all 0.3s',
      }}
    >
      {children}
    </a>
  )
}

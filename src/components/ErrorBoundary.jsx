/**
 * ErrorBoundary.jsx — v2.5
 *
 * Catches uncaught render errors and displays a friendly fallback UI
 * instead of leaving the user with a blank white screen.
 *
 * Usage (in main.jsx):
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */

import { Component } from 'react'

const FONT_BODY    = "'DM Sans', sans-serif"
const FONT_DISPLAY = "'Playfair Display', serif"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production you'd send this to an error reporting service (Sentry, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#06132C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚡</div>
        <h1
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: '#C9A84C',
            marginBottom: 12,
          }}
        >
          Something went wrong.
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            color: '#94A3B8',
            fontSize: '1rem',
            maxWidth: 480,
            lineHeight: 1.8,
            marginBottom: 32,
          }}
        >
          An unexpected error occurred. Our team has been notified. Please
          refresh the page — if the problem persists, contact us on WhatsApp.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#C9A84C',
              color: '#06132C',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 999,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER ?? '254799644100'}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#25D366',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 999,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            WhatsApp Support
          </a>
        </div>

        {import.meta.env.DEV && this.state.error && (
          <pre
            style={{
              marginTop: 40,
              background: '#0A1F44',
              border: '1px solid #1A3060',
              borderRadius: 12,
              padding: '20px 24px',
              color: '#38BDF8',
              fontSize: '0.78rem',
              textAlign: 'left',
              maxWidth: 700,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    )
  }
}

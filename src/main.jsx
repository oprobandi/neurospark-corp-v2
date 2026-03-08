/**
 * main.jsx — v2.5
 *
 * Changes from v2.4:
 *   • Wrapped <App /> in <ErrorBoundary> — any uncaught render error now
 *     shows a friendly fallback instead of a blank white screen (Critical fix)
 *   • Wrapped in <ThemeProvider> — dark/light mode state flows to all components
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

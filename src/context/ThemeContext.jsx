/**
 * ThemeContext.jsx — v2.5
 *
 * Provides a dark/light mode toggle across the entire app.
 *
 * - Reads initial preference from localStorage (key: 'ns-theme')
 * - Falls back to the OS-level prefers-color-scheme media query
 * - Persists user choice in localStorage on every toggle
 * - Applies `data-theme="dark"` to <html> so CSS variables kick in
 *
 * Usage:
 *   const { dark, toggleTheme } = useTheme()
 */

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ dark: false, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('ns-theme')
      if (stored) return stored === 'dark'
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    try { localStorage.setItem('ns-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  const toggleTheme = () => setDark(d => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

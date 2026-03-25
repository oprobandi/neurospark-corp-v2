/**
 * useScrollTop.js — v3.1 (NEW)
 *
 * Scrolls the window to the top on component mount.
 *
 * Bug fixed: 5 pages (AgentsPage, HesabuPlatformPage, NotFoundPage,
 * PrivacyPage, TermsPage) were missing scroll-to-top, causing users who
 * navigated from a scrolled position to land mid-page.
 *
 * Previously each page called `useEffect(() => { window.scrollTo(0,0) }, [])`
 * inline. This hook centralises that pattern so it's impossible to forget.
 *
 * Usage:
 *   import { useScrollTop } from '../hooks/useScrollTop'
 *   // inside any page component:
 *   useScrollTop()
 */

import { useEffect } from 'react'

export function useScrollTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

/**
 * useCountUp.js — v2.5
 *
 * Animates a numeric value from 0 to `target` over `duration` ms
 * once `trigger` becomes true (typically when the element enters the viewport).
 *
 * Respects prefers-reduced-motion — returns the final value immediately.
 *
 * Usage:
 *   const count = useCountUp(150, visible, 1800)
 *   // → animates 0 → 150 when `visible` flips to true
 */

import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, trigger, duration = 1800) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!trigger) return

    // Respect reduced-motion — skip animation
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCount(target)
      return
    }

    const startTime = performance.now()
    const startVal  = 0

    const tick = (now) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(startVal + (target - startVal) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [trigger, target, duration])

  return count
}

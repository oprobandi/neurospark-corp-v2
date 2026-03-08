import { useEffect } from 'react'

const BASE = 'Neurospark Corporation'

/**
 * Sets document.title to "<title> | Neurospark Corporation".
 * Pass null or undefined to use the base title alone.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : BASE
    return () => { document.title = BASE }
  }, [title])
}

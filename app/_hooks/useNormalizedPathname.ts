'use client'

import { usePathname } from 'next/navigation'

/**
 * A custom hook that returns the current pathname from `next/navigation`
 * with any trailing slash removed.
 * This is useful for ensuring consistent path matching when `trailingSlash: true`
 * is enabled in `next.config.ts`.
 *
 * @returns {string} The normalized pathname.
 */
export function useNormalizedPathname(): string {
  const pathname = usePathname()

  // If the path is longer than a single slash and ends with a slash, remove it.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  // Otherwise, return the original pathname.
  return pathname
}

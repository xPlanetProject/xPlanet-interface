import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'

import { useLayoutEffect, useState } from 'react'

export function useMediaQuery(mediaQuery: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(mediaQuery).matches
  )

  useLayoutEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    const listener = e => setMatches(e.matches)

    mediaQueryList.addListener(listener)

    return () => mediaQueryList.removeListener(listener)
  }, [mediaQuery])

  return matches
}
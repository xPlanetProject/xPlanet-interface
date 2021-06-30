import { useMemo } from 'react'

import {
  SupportedLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE
} from '@/constants/locales'

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
function parseLocale(
  maybeSupportedLocale: string
): SupportedLocale | undefined {
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()
  return SUPPORTED_LOCALES.find(
    (locale) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale
  )
}

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale(): SupportedLocale | undefined {
  if (!navigator.language) return undefined

  const [language, region] = navigator.language.split('-')

  if (region) {
    return (
      parseLocale(`${language}-${region.toUpperCase()}`) ??
      parseLocale(language)
    )
  }

  return parseLocale(language)
}

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 */
export function useActiveLocale(): SupportedLocale {
  const userLocale = useUserLocale()

  console.log(userLocale)

  return useMemo(() => {
    return userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE
  }, [userLocale])
}

export function useUserLocale(): SupportedLocale | null {
  return localStorage.getItem('i18nextLng') as SupportedLocale
}

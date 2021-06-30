import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `./locales/{{lng}}.json`
    },
    react: {
      useSuspense: true
    },
    fallbackLng: 'en-US',
    preload: ['en-US'],
    keySeparator: '.',
    interpolation: { escapeValue: false }
  })

console.log(new LanguageDetector())

console.log(i18next)

export default i18next

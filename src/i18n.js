import { createI18n } from 'vue-i18n'
import AR from '@/languages/ar.json'
import FR from '@/languages/fr.json'
import EN from '@/languages/en.json'

const savedLanguage = localStorage.getItem('user-language') || 'fr'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  globalInjection: true,
  messages: {
    ar: AR,
    fr: FR,
    en: EN,
  },
})

export default i18n

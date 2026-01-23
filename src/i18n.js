import { createI18n } from 'vue-i18n'
import AR from '@/languages/ar.json'
import FR from '@/languages/fr.json'

const savedLanguage = localStorage.getItem('user-language') || 'ar'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  globalInjection: true,
  messages: {
    ar: AR,
    fr: FR,
  },
})

export default i18n

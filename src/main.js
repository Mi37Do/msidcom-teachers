import './utils/appLogger'
import './assets/main.css'
import './assets/nuit.css'
import 'flag-icons/css/flag-icons.min.css'
// Thème choisi (jour / nuit) appliqué avant le premier affichage
import '@/composables/useTheme'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'

import i18n from './i18n'
import router from './router'
import { useWidgetStore } from './stores/widget'
import AR from '@/languages/ar.json'
import FR from '@/languages/fr.json'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

axios.defaults.baseURL = import.meta.env.VITE_MSIDCOM_API
axios.defaults.timeout = 20000


const app = createApp(App)
app.use(createPinia())
app.use(VCalendar, {})
app.use(autoAnimatePlugin)
app.use(VueViewer)
app.use(i18n)
app.use(router)

// Session expirée ou révoquée (compte désactivé, déconnexion depuis un autre appareil) :
// retour à l'écran de connexion au lieu d'écrans vides en erreur
axios.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401 && router.currentRoute.value.meta?.requireAuth) {
    await useWidgetStore().clearSession()
    router.push({ name: 'login-view' })
  }
  // Une requête annulée volontairement garde son message
  if (!axios.isCancel(error)) {
    error.messageTechnique = error.message
    error.message = messageErreurLisible(error)
  }
  return Promise.reject(error)
})

// Les messages d'erreur affichent error.message : un texte lisible, dans la langue choisie,
// au lieu de « Request failed with status code 404 » ou « Network Error »
function messageErreurLisible(error) {
  const t = i18n.global.t
  const status = error.response?.status
  if (!error.response) return t('translation.errorNetwork')
  if (status === 400) return t('translation.errorInvalidData')
  if (status === 401) return t('translation.errorSessionExpired')
  if (status === 403) return t('translation.errorForbidden')
  if (status === 404) return t('translation.errorNotFound')
  if (status === 413) return t('translation.errorTooLarge')
  if (status === 429) return t('translation.errorTooManyRequests')
  if (status >= 500) return t('translation.errorServer')
  return t('translation.error_occurred')
}

app.mount('#app')

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import router from './router'
import AR from '@/languages/ar.json'
import FR from '@/languages/fr.json'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_MSIDCOM_API

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  globalInjection: true,
  messages: {
    ar: AR,
    fr: FR,
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(VCalendar, {})
app.use(autoAnimatePlugin)
app.use(i18n)
app.use(router)

app.mount('#app')

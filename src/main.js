import './assets/main.css'
import 'flag-icons/css/flag-icons.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'

import i18n from './i18n'
import router from './router'
import AR from '@/languages/ar.json'
import FR from '@/languages/fr.json'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

axios.defaults.baseURL = import.meta.env.VITE_MSIDCOM_API


const app = createApp(App)
app.use(createPinia())
app.use(VCalendar, {})
app.use(autoAnimatePlugin)
app.use(VueViewer)
app.use(i18n)
app.use(router)

app.mount('#app')

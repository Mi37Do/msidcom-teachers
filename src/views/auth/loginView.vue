<template>
  <div
    class="page-connexion w-full min-h-screen grid gap-6 bg-gradient-to-tr from-background-3/50 via-background-2/50 to-background-1 from-0% via-75% to-100% relative">

    <img src="@/assets/pics/bluePartLogo.svg" class="w-40 absolute bottom-0 left-0" alt="">
    <img src="@/assets/pics/greenPartLogo.svg" class="w-40 absolute top-0 right-0" alt="">

    <div class="w-full flex flex-col justify-center items-center gap-6 z-10 py-6 px-10 transition-all duration-300">
      <div class="w-full h-fit my-auto flex justify-center">
        <form @submit.prevent="login" class="w-full h-full flex flex-col gap-3 items-center">

          <!-- ── Logo: scale down smoothly instead of hard class swap ───── -->
          <img src="@/assets/pics/logoSquare.svg" :style="{
            transform: `scale(${logoScale})`,
            transformOrigin: 'center top',
            transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          }" class="w-28" alt="" />

          <!-- ── Collapsible chrome – fade + slide out ───────────────────── -->
          <Transition name="kb-collapse">
            <div v-if="!hideAuxContent" class="flex items-center pixa-title my-2">
              {{ t('translation.appTitle') }}
            </div>
          </Transition>

          <Transition name="kb-collapse">
            <div v-if="!hideAuxContent" class="flex items-center pixa-title-2">
              {{ t('translation.connexion') }}
            </div>
          </Transition>

          <Transition name="kb-collapse">
            <div v-if="!hideAuxContent" class="h-px w-full bg-slate-600" />
          </Transition>

          <!-- ── Fields (always visible) ────────────────────────────────── -->
          <div class="w-full flex flex-col gap-3">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text capitalize">
                  {{ t('translation.username') }} <span class="text-red-500">*</span>
                </span>
              </div>
              <input type="text" required v-model="user.username" :placeholder="t('translation.username') + ' ....'"
                class="pixa-input-login px-3 placeholder:capitalize" @focus="onInputFocus" @blur="onInputBlur" />
            </label>

            <label class="form-control w-full">
              <div class="label">
                <span class="label-text capitalize">
                  {{ t('translation.password') }} <span class="text-red-500">*</span>
                </span>
              </div>
              <div class="relative w-full">
                <input :type="isPassword ? 'password' : 'text'" required v-model="user.password"
                  :placeholder="t('translation.password') + ' ....'"
                  class="pixa-input-login h-[40px] px-3 placeholder:capitalize w-full" @focus="onInputFocus"
                  @blur="onInputBlur" />
                <button @click="isPassword = !isPassword" type="button"
                  :class="useWidget.userLanguage === 'ar' ? 'left-1' : 'right-1'"
                  class="btn btn-sm btn-square absolute top-1 btn-ghost">
                  <eye-slash class="w-5" />
                </button>
              </div>
            </label>

            <div v-if="errorMessage.show"
              class="w-full h-10 bg-red-100 text-red-500 border border-red-500 rounded-xl my-2 p-2.5">
              {{ errorMessage.message }}
            </div>

            <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn btn-primary-2 w-full">
              <span v-if="loading" class="loading loading-ring loading-xs" />
              <span v-else>{{ t('translation.auth') }}</span>
            </button>
          </div>

        </form>
      </div>

      <!-- ── Language switcher – also collapses when keyboard opens ──── -->
      <Transition name="kb-collapse">
        <div v-if="!hideAuxContent" class="flex items-start gap-1">
          <div @click="useWidget.changeLanguage = true"
            class="h-20 rounded-[15px] p-3 flex justify-center gap-5 w-fit">
            <span>{{useWidget.languages?.find(i => i.id === useWidget.userLanguage)?.desingation}}</span>
            <div v-html="useWidget.languages?.find(i => i.id === useWidget.userLanguage)?.icon"
              :class="useWidget.userLanguage === 'ar' ? 'left-0' : 'right-0'" class="w-8" />
          </div>
          <!-- Mode jour / mode nuit, aussi avant la connexion -->
          <commun-theme-toggle class="btn-ghost w-12 h-12 rounded-[15px]" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget'
import axios from 'axios'
import Cookies from 'js-cookie'
import { onBeforeUnmount, onMounted, reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import eyeSlash from '@/assets/icons/eyeSlash.vue'
import communThemeToggle from '@/components/commun/communThemeToggle.vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { Preferences } from '@capacitor/preferences'
import { useFirebaseMessaging } from '@/composables/useFirebaseMessaging'

// ── Keyboard state ───────────────────────────────────────────────────────────
const keyboardOpen = ref(false)
const platform = Capacitor.getPlatform()
const isNative = platform !== 'web'

// Logo smoothly shrinks to 45% when keyboard is open
const logoScale = computed(() => keyboardOpen.value ? 0.45 : 1)

// Non-essential chrome (title, divider, language switcher) disappears
const hideAuxContent = computed(() => keyboardOpen.value)

// On iOS the Keyboard plugin events drive keyboardOpen (they also fire for the
// system dismiss gesture, which focus/blur never reports). Focus/blur is the
// web fallback.
let blurTimer = null
const onInputFocus = () => {
  if (isNative) return
  if (blurTimer) { clearTimeout(blurTimer); blurTimer = null }
  keyboardOpen.value = true
}
const onInputBlur = () => {
  if (isNative) return
  blurTimer = setTimeout(() => {
    keyboardOpen.value = false
  }, 100)
}

// ── Store / composables ──────────────────────────────────────────────────────
const { t } = useI18n()
const router = useRouter()
const useWidget = useWidgetStore()
const { initializeFCM } = useFirebaseMessaging()

// Le serveur répond en anglais : on affiche un message traduit selon le cas
const resolveErrorMessage = (error) => {
  const status = error.response?.status
  if (!error.response) {
    return t(navigator.onLine === false || error.code === 'ERR_NETWORK'
      ? 'translation.loginOffline'
      : 'translation.loginFailed')
  }
  if (status === 400) return t('translation.loginMissingFields')
  if (status === 401) return t('translation.loginInvalid')
  if (status === 403) {
    return t(error.response.data?.error === 'User account is inactive.'
      ? 'translation.loginInactive'
      : 'translation.loginWrongApp')
  }
  if (status === 429) return t('translation.loginTooManyAttempts')
  if (status >= 500) return t('translation.loginServerError')
  return t('translation.loginFailed')
}

// ── Local state ──────────────────────────────────────────────────────────────
const isPassword = ref(true)
const loading = ref(false)
const user = reactive({ username: '', password: '' })
const errorMessage = reactive({ show: false, message: '' })

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (isNative) {
    try {
      // setResizeMode n'existe que sur iOS : sur Android l'appel échouait et les écouteurs
      // du clavier n'étaient jamais posés. 'body' garde les champs au-dessus du clavier sur
      // iPhone comme sur iPad ; Android redimensionne la vue tout seul.
      if (platform === 'ios') {
        await Keyboard.setResizeMode({ mode: 'body' })
      }
      await Keyboard.addListener('keyboardWillShow', () => { keyboardOpen.value = true })
      await Keyboard.addListener('keyboardWillHide', () => { keyboardOpen.value = false })
    } catch (error) {
      console.error('Keyboard setup failed:', error)
    }
  }
})

onBeforeUnmount(async () => {
  if (blurTimer) { clearTimeout(blurTimer); blurTimer = null }
  if (isNative) {
    try {
      await Keyboard.removeAllListeners()
      // Back to the default for the rest of the app (chat inputs, forms)
      if (platform === 'ios') {
        await Keyboard.setResizeMode({ mode: 'native' })
      }
      // Pas d'App.removeAllListeners() : il supprimait l'écoute du retour au premier plan
    } catch (error) {
      console.error('Keyboard cleanup failed:', error)
    }
  }
})

// ── Login ────────────────────────────────────────────────────────────────────
const login = async () => {
  if (loading.value) return

  const username = user.username.trim()
  const password = user.password
  if (!username || !password) {
    errorMessage.message = t('translation.loginMissingFields')
    errorMessage.show = true
    return
  }

  user.username = username
  loading.value = true
  errorMessage.show = false

  try {
    axios.defaults.headers.common['Authorization'] = ''
    const response = await axios.post(`/api/Login_PROF`, { username, password })

    const token = response.data.token

    Cookies.set('token', token)
    localStorage.setItem('msidcom_prof_token', token)
    // Jamais le mot de passe : il était enregistré en clair sur le téléphone
    localStorage.setItem('msidcom_prof_login', JSON.stringify({ username }))

    await Preferences.set({ key: 'authToken-prof', value: token })

    axios.defaults.headers.common['Authorization'] = 'token ' + token

    if (Capacitor.isNativePlatform() ||
      (typeof Notification !== 'undefined' && Notification.permission !== 'denied')) {
      // Pas attendu : sur iOS le jeton peut tarder (autorisation, APNs) et ne doit pas
      // bloquer l'utilisateur sur cet écran
      initializeFCM().catch((err) => console.error('Push registration failed:', err))
    }

    router.push({ name: 'app-panel' })

  } catch (error) {
    console.error('Login error:', error)
    errorMessage.message = resolveErrorMessage(error)
    errorMessage.show = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Slide-up + fade out when keyboard opens, reverse when it closes */
.kb-collapse-enter-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.4, 0, 0.2, 1), max-height 220ms ease;
}

.kb-collapse-leave-active {
  transition: opacity 180ms ease, transform 180ms cubic-bezier(0.4, 0, 0.2, 1), max-height 180ms ease;
}

.kb-collapse-enter-from,
.kb-collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

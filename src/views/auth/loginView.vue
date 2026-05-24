<template>
  <div
    class="w-full h-screen grid gap-6 bg-gradient-to-tr from-background-3/50 via-background-2/50 to-background-1 from-0% via-75% to-100% relative">
    <img src="@/assets/pics/bluePartLogo.svg" class="w-40 absolute bottom-0 left-0" alt="">
    <img src="@/assets/pics/greenPartLogo.svg" class="w-40 absolute top-0 right-0" alt="">

    <div :style="{ height: remainingHeight + 'px' }"
      class="w-full flex flex-col justify-center items-center gap-6 z-10 py-6 px-10 transition-all duration-300">
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
              <input type="text" required v-model="user.username" :placeholder="t('translation.connexion') + ' ....'"
                class="pixa-input-login px-3 placeholder:capitalize" />
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
                  class="pixa-input-login h-[40px] px-3 placeholder:capitalize w-full" />
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
        <div v-if="!hideAuxContent" @click="useWidget.changeLanguage = true"
          class="h-20 rounded-[15px] p-3 flex justify-center gap-5 w-fit">
          <span>{{useWidget.languages?.find(i => i.id === useWidget.userLanguage)?.desingation}}</span>
          <div v-html="useWidget.languages?.find(i => i.id === useWidget.userLanguage)?.icon"
            :class="useWidget.userLanguage === 'ar' ? 'left-0' : 'right-0'" class="w-8" />
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
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { Preferences } from '@capacitor/preferences'
import { App } from '@capacitor/app'
import { useFirebaseMessaging } from '@/composables/useFirebaseMessaging'

// ── Keyboard state ───────────────────────────────────────────────────────────
const keyboardHeight = ref(0)
const remainingHeight = ref(window.innerHeight)
const keyboardOpen = ref(false)

// Logo smoothly shrinks to 45% when keyboard is open
const logoScale = computed(() => keyboardOpen.value ? 0.45 : 1)

// Non-essential chrome (title, divider, language switcher) disappears
const hideAuxContent = computed(() => keyboardOpen.value)

// ── Store / composables ──────────────────────────────────────────────────────
const { t } = useI18n()
const router = useRouter()
const useWidget = useWidgetStore()
const { initializeFCM } = useFirebaseMessaging()

// ── Local state ──────────────────────────────────────────────────────────────
const isPassword = ref(true)
const loading = ref(false)
const user = reactive({ username: '', password: '' })
const errorMessage = reactive({ show: false, message: '' })

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (Capacitor.getPlatform() !== 'web') {
    await Keyboard.addListener('keyboardWillShow', (info) => {
      keyboardHeight.value = info.keyboardHeight
      remainingHeight.value = window.innerHeight - info.keyboardHeight
      keyboardOpen.value = true
    })
    await Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = 0
      remainingHeight.value = window.innerHeight
      keyboardOpen.value = false
    })
  }
})

onBeforeUnmount(async () => {
  if (Capacitor.getPlatform() !== 'web') {
    await Keyboard.removeAllListeners()
    await App.removeAllListeners()
  }
})

// ── Login ────────────────────────────────────────────────────────────────────
const login = async () => {
  loading.value = true
  errorMessage.show = false

  if (user.username.endsWith(' ')) {
    user.username = user.username.trimEnd()
  }

  try {
    axios.defaults.headers.common['Authorization'] = ''
    const response = await axios.post(`/api/Login_PROF`, user)

    const token = response.data.token

    Cookies.set('token', token)
    localStorage.setItem('msidcom_prof_token', token)
    localStorage.setItem('msidcom_prof_login', JSON.stringify(user))

    await Preferences.set({ key: 'authToken-prof', value: token })

    axios.defaults.headers.common['Authorization'] = 'token ' + token

    if (Capacitor.isNativePlatform() || Notification.permission !== 'denied') {
      await initializeFCM()
    }

    router.push({ name: 'app-panel' })

  } catch (error) {
    console.error('Login error:', error)
    errorMessage.message = error.response?.data?.error || 'Login failed'
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

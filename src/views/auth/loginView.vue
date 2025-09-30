<template>
  <div
    class="w-full h-screen grid gap-6 bg-gradient-to-tr from-background-3/50 via-background-2/50 to-background-1 from-0% via-75% to-100% relative">
    <img src="@/assets/pics/bluePartLogo.svg" class="w-40 absolute bottom-0 left-0" alt="">
    <img src="@/assets/pics/greenPartLogo.svg" class="w-40 absolute top-0 right-0" alt="">
    <div :style="{ height: remainingHeight + 'px' }" class="w-full flex flex-col justify-center gap-6 z-10 py-6 px-10">
      <div class="w-full h-fit my-auto flex justify-center ">
        <form @submit.prevent="login" class="w-full h-full flex flex-col gap-3 items-center">

          <img src="@/assets/pics/logoSquare.svg" class="w-28" alt="">
          <div class="flex items-center pixa-title my-2">
            msidcom - enseignant
          </div>
          <div class="flex items-center pixa-title-2">
            {{ t('translation.connexion') }}
          </div>
          <div class="h-px w-full bg-slate-600"></div>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text capitalize">{{ t('translation.username') }} <span
                  class="text-red-500">*</span></span>
            </div>
            <input type="text" required v-model="user.username" :placeholder="t('translation.connexion') + ' ....'"
              class=" pixa-input-login px-3 placeholder:capitalize" />
          </label>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text capitalize">{{ t('translation.password') }} <span
                  class="text-red-500">*</span></span>
            </div>
            <div class="relative w-full">
              <input :type="isPassword ? 'password' : 'text'" required v-model="user.password"
                :placeholder="t('translation.password') + ' ....'"
                class=" pixa-input-login h-[40px] px-3 placeholder:capitalize w-full" />

              <button @click="isPassword = !isPassword" type="button"
                class="btn btn-sm btn-square absolute right-1 top-1 btn-ghost">
                <eye-slash class="w-5" />
              </button>
            </div>

          </label>

          <div v-if="errorMessage.show"
            class="w-full h-10 bg-red-100 text-red-500 border border-red-500 rounded-xl my-2 p-2.5">{{
              errorMessage.message }}
          </div>

          <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn btn-primary-2 w-full">
            <span v-if="loading" class="loading loading-ring loading-xs"></span>
            <span v-else> {{ t('translation.auth') }}</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import axios from 'axios';
import Cookies from 'js-cookie';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import eyeSlash from '@/assets/icons/eyeSlash.vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { useNotificationBadge } from '@/stores/notifications';

const keyboardHeight = ref(0)
const remainingHeight = ref(window.innerHeight)
const { t } = useI18n()
const router = useRouter()
const useWidget = useWidgetStore()
const isPassword = ref(true)
const user = reactive(
  { username: '', password: '' }
)
const useNotif = useNotificationBadge()
const loading = ref(false)
const errorMessage = reactive(
  {
    show: false,
    message: ''
  }
)

onMounted(() => {
  useWidget.signOut()
  Cookies.remove('token')
  useWidget.signOutModal = false

  if (Capacitor.getPlatform() !== 'web') {
    Keyboard.addListener('keyboardWillShow', (info) => {
      console.log('Height:', info.keyboardHeight)
    })
    Keyboard.addListener('keyboardWillHide', () => {
      console.log('Keyboard hidden')
    })

    // When keyboard is about to show
    Keyboard.addListener('keyboardWillShow', (info) => {
      keyboardHeight.value = info.keyboardHeight
      remainingHeight.value = window.screen.height - info.keyboardHeight
    })

    // When keyboard is about to hide
    Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = 0
      remainingHeight.value = window.screen.height
    })
  }


})

onBeforeUnmount(() => {
  if (Capacitor.getPlatform() !== 'web') {
    Keyboard.removeAllListeners()
  }
})

const login = async () => {
  loading.value = true
  axios.defaults.headers.common['Authorization'] = ''
  try {
    if (user.username.endsWith(' ')) {
      user.username.trimEnd()
    }
    let response = await axios.post(`/api/Login_PROF`, user)

    Cookies.set('token', response.data.token)
    axios.defaults.headers.common['Authorization'] = 'token ' + Cookies.get('token')

    await useNotif.getNotifications()

    router.push({ name: 'app-panel' })
  } catch (error) {
    console.error(error)
    errorMessage.message = error.response.data.error
    errorMessage.show = true
  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>

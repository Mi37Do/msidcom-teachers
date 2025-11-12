<template>
  <div
    class="w-full h-screen grid gap-6 bg-gradient-to-tr from-background-3/50 via-background-2/50 to-background-1 from-0% via-75% to-100% relative">
    <img src="@/assets/pics/bluePartLogo.svg" class="w-40 absolute bottom-0 left-0" alt="">
    <img src="@/assets/pics/greenPartLogo.svg" class="w-40 absolute top-0 right-0" alt="">
    <div :style="{ height: remainingHeight + 'px' }" class="w-full flex flex-col justify-center gap-6 z-10 py-6 px-10">
      <div class="w-full h-fit my-auto flex justify-center ">
        <form @submit.prevent="login" class="w-full h-full flex flex-col gap-3 items-center">

          <img src="@/assets/pics/logoSquare.svg" class="w-28" alt="">
          <div class="flex items-center pixa-title my-2"> msidcom - enseignant </div>
          <div class="flex items-center pixa-title-2"> {{ t('translation.connexion') }} </div>
          <div class="h-px w-full bg-slate-600"></div>

          <div class="w-full flex flex-col gap-3">
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
          </div>

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
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

const keyboardHeight = ref(0)
const remainingHeight = ref(window.innerHeight)
const { t } = useI18n()
const router = useRouter()
const useWidget = useWidgetStore()
const isPassword = ref(true)
const loadingLogin = ref(true)
const user = reactive(
  { username: '', password: '' }
)
const loading = ref(false)
const errorMessage = reactive(
  {
    show: false,
    message: ''
  }
)


onBeforeUnmount(async () => {
  if (Capacitor.getPlatform() !== 'web') {
    // Remove all listeners
    await Keyboard.removeAllListeners();
    await App.removeAllListeners();
  }
})

const login = async () => {
  loading.value = true;
  errorMessage.show = false; // Reset error message
  if (user.username.endsWith(' ')) {
    user.username = user.username.trimEnd()
  }
  try {
    axios.defaults.headers.common['Authorization'] = ''
    let response = await axios.post(`/api/Login_PROF`, user);

    // Save token to all storage locations
    const token = response.data.token;

    Cookies.set('token', token);
    localStorage.setItem('msidcom_prof_token', token);
    localStorage.setItem('msidcom_prof_login', JSON.stringify(user));

    // Save to Capacitor Preferences (persistent storage for mobile)
    await Preferences.set({
      key: 'authToken-prof',
      value: token
    });

    // Set axios header
    axios.defaults.headers.common['Authorization'] = 'token ' + token;

    // Update store with user data
    // await useWidget.initData();

    // Navigate to app panel
    router.push({ name: 'app-panel' });

  } catch (error) {
    console.error('Login error:', error);
    errorMessage.message = error.response?.data?.error || 'Login failed';
    errorMessage.show = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <div class="w-full h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-6">

    <img src="@/assets/pics/logo.svg" class="w-40" alt="">

    <span class="loading loading-ring "></span>

  </div>
</template>

<script setup>
import App from '@/App.vue';
import { useWidgetStore } from '@/stores/widget';
import { Capacitor } from '@capacitor/core';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const useWidget = useWidgetStore()
const router = useRouter()

onMounted(async () => {
  try {
    // Initial load - check if user is already authenticated
    await useWidget.initData();

    // If already authenticated, redirect to app panel
    if (useWidget.authUser.isAuthenticated) {
      router.push({ name: 'app-panel' });
      return; // Exit early
    } else {
      router.push({ name: 'login-view' });
    }

    // Only add listener on mobile platforms
    if (Capacitor.getPlatform() !== 'web') {
      // App state listener
      App.addListener('appStateChange', async ({ isActive }) => {
        if (isActive) {
          console.log('App came to foreground - restoring session');
          await useWidget.initData();

          // If session restored successfully, redirect
          if (useWidget.authUser.isAuthenticated) {
            router.push({ name: 'app-panel' });
          }
        } else {
          console.log('App went to background');
        }
      });


    }
  } catch (error) {

  }

})
</script>

<style lang="scss" scoped></style>

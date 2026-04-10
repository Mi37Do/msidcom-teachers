<script setup>
import { onMounted } from 'vue';
import CommunLanguagesSwitcherModal from './components/commun/communLanguagesSwitcherModal.vue';
import { useWidgetStore } from './stores/widget'
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const useWidget = useWidgetStore()

onMounted(async () => {
  useWidget.userLanguage = useWidget.getLanguage()

  if (Capacitor.isNativePlatform()) {
    await StatusBar.setOverlaysWebView({ overlay: false })
    await StatusBar.setBackgroundColor({ color: '#49c5b1' })
    await StatusBar.setStyle({ style: Style.Dark })
  }
})
</script>

<template>
  <div :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
    :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto' }" class="w-full oveflow-hidden">

    <CommunLanguagesSwitcherModal />
    <RouterView />
  </div>
</template>

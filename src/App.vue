<script setup>
import { onMounted } from 'vue'
import CommunLanguagesSwitcherModal from './components/commun/communLanguagesSwitcherModal.vue';
import { useWidgetStore } from './stores/widget'
import { Capacitor } from '@capacitor/core'
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area'

const useWidget = useWidgetStore()

onMounted(async () => {
  useWidget.userLanguage = useWidget.getLanguage()

  if (Capacitor.isNativePlatform()) {
    await SafeArea.setSystemBarsStyle({ style: SystemBarsStyle.Light })
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

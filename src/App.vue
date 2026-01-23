<script setup>
import { onMounted } from 'vue';
import CommunLanguagesSwitcherModal from './components/commun/communLanguagesSwitcherModal.vue';
import { useWidgetStore } from './stores/widget'
const useWidget = useWidgetStore()


onMounted(() => {
  useWidget.userLanguage = useWidget.getLanguage()
})
</script>

<template>
  <div :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
    :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto' }"
    class="w-full h-screen oveflow-hidden pt-safe-top pb-safe-bottom">

    <CommunLanguagesSwitcherModal />
    <RouterView />
  </div>
</template>

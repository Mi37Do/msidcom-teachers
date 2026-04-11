<script setup>
import { onMounted } from 'vue'
import CommunLanguagesSwitcherModal from './components/commun/communLanguagesSwitcherModal.vue';
import { useWidgetStore } from './stores/widget'
const useWidget = useWidgetStore()

onMounted(() => {
  useWidget.userLanguage = useWidget.getLanguage()
})
</script>

<template>
  <div :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
    :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto' }" class="w-full oveflow-hidden">

    <CommunLanguagesSwitcherModal />
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CommunLanguagesSwitcherModal from './components/commun/communLanguagesSwitcherModal.vue';
import CommunApercuFichier from './components/commun/communApercuFichier.vue';
import { useWidgetStore } from './stores/widget'
import { styliserBarresSysteme } from './composables/useTheme'

const useWidget = useWidgetStore()

onMounted(async () => {
  useWidget.userLanguage = useWidget.getLanguage()

  // Barre d'état du téléphone selon le mode jour / nuit
  await styliserBarresSysteme()
})
</script>

<template>
  <div :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
    :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto' }" class="w-full oveflow-hidden">

    <CommunLanguagesSwitcherModal />
    <RouterView />
    <!-- Aperçu des pièces jointes, ouvert depuis n'importe quel écran -->
    <CommunApercuFichier />
  </div>
</template>

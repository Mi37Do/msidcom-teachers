<template>
  <!-- Messages de succès / d'erreur : en haut de l'écran, sous l'encoche, au-dessus des fenêtres -->
  <div v-auto-animate role="status" aria-live="polite"
    class="fixed inset-x-0 z-[1000] flex flex-col items-center gap-1.5 px-4 pointer-events-none"
    :style="{ top: 'calc(var(--safe-area-top, 0px) + 12px)' }">
    <commun-toast v-for="item in useWidget.toasts" :item="item" :key="item.id" />
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import communToast from './communToast.vue';
const useWidget = useWidgetStore()
</script>

<style lang="scss" scoped></style>

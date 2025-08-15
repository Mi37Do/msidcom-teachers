<template>
  <div v-auto-animate class="absolute flex flex-col gap-1.5 bottom-6 right-6 max-w-80 overflow-hidden z-50">
    <!--  -->
    <commun-toast v-for="item in useWidget.toasts" :item="item" :key="item" />
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import communToast from './communToast.vue';
const useWidget = useWidgetStore()
</script>

<style lang="scss" scoped></style>

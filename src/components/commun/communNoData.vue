<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-6">

    <exclamation-icon class="w-12 h-12 fill-slate-600" />
    <span class="uppercase text-lg font-medium max-w-80 text-center">{{ t('translation.noDataAvailable') }}</span>
  </div>
</template>

<script setup>
import exclamationIcon from '@/assets/icons/exclamationIcon.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped></style>

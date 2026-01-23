<template>
  <div class="w-full h-full flex flex-col gap-3 pt-3">
    <span class="detail-title px-6 truncates">{{ t('translation.myMessages') }}</span>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped></style>

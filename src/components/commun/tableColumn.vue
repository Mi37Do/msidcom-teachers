<template>
  <div :class="[`w-full h-full
     flex items-center px-3 truncate capitalize font-medium`]">
    {{ t(`translation.${item.title}`) }}
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps(['item'])

const { t } = useI18n()

</script>

<style lang="scss" scoped></style>

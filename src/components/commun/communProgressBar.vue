<template>
  <div class="w-full h-3 bg-primary/10 border border-primary/30 rounded-r-full">
    <div :style="{
      width: `${value}%`
    }" class="h-full rounded-r-full bg-primary"></div>
  </div>
</template>

<script setup>
const props = defineProps(['value'])
</script>

<style lang="scss" scoped></style>

<template>
  <div :class="['w-full h-full flex', props.class, direction === 'horizontal' ? 'flex-row' : 'flex-col']">

  </div>
</template>

<script setup>
const props = defineProps(['class', 'direction'])
</script>

<style lang="scss" scoped></style>

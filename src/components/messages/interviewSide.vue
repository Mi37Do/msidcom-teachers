<template>
  <div class="w-full h-full flex flex-col p-3 border-l border-border-color">
    <div class="w-full h-12 border-b border-border-color pt-2 mt-1">
      <span class="pixa-title-3">entrevue en attente</span>
    </div>

    <div class="w-full flex-1 overflow-hidden">
      <div class="h-full overflow-auto hidden-scrollbar">
        <div class="h-fit flex flex-col py-3 gap-1">
          <interview-item v-for="item in list" :item="item" :key="item" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import interviewItem from './interviewItem.vue';

const props = defineProps(['list'])
</script>

<style lang="scss" scoped></style>

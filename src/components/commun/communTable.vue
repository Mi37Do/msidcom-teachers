<template>
  <div class="w-full h-full bg-white rounded-[10px] pixa-border overflow-hidden flex flex-col">

    <slot name="table_header" />

    <div div class=" flex-1 overflow-hidden">
      <div ref="scrollingBox" class="w-full h-full overflow-y-auto overflow-x-hidden">
        <div class="w-full h-fit flex flex-col">
          <slot name="table_items"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import tableColumn from './tableColumn.vue';

const props = defineProps(['columns', 'grids'])

</script>

<style lang="scss" scoped>
/* Add custom styles if needed */
.resize-x {
  resize: horizontal;
}
</style>

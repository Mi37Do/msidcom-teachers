<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div :class="border ? 'border-r' : ''" class="w-full   border-primary/30">
      <slot name="add_to_table" />
    </div>
    <span class="w-full h-px bg-primary/30 mt-4"></span>

    <div class="w-full flex-1 overflow-hidden">
      <div class="h-full overflow-auto hidden-scrollbar">
        <div class="h-fit p-2 flex flex-col gap-2">
          <slot name="table_items" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['item', 'index', 'border'])

</script>

<style lang="scss" scoped></style>

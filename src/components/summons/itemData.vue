<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-4" :class="[
    `grid gap-1.5`]">
    <span class="my-auto truncate flex items-center gap-3">
      <div class="w-full">
        <span class="font-medium truncate flex-1 auto-dir">
          {{ item.prenom }} {{ item.nom }}</span>
      </div>


      <button @click="() => {
        useStudent.focusedStudent = item
        useWidget.addSummonModal = true
      }" class="btn btn-square btn-ghost">
        <file-alt class="w-6 fill-error" />
      </button>
    </span>
  </div>
</template>

<script setup>
import fileAlt from '@/assets/icons/fileAlt.vue';
import { useStudentStore } from '@/stores/students';
import { useRoute } from 'vue-router';
import { useWidgetStore } from '@/stores/widget';
import elipsisH from '@/assets/icons/elipsisH.vue';
import { ref } from 'vue';

const props = defineProps(['item', 'type'])
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
</script>

<style lang="scss" scoped></style>

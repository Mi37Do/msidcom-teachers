<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-4" :class="[
    `grid grid-cols-2 gap-1.5`]">
    <span class="my-auto truncate flex items-center gap-3">
      <span class="font-medium truncate flex-1">
        {{ item.eleve_designations.eleve_designations_prenom }} {{ item.eleve_designations.eleve_designations_nom
        }}</span>
    </span>
    <span class="my-auto truncate flex items-center gap-3">
      <span class="font-medium truncate flex-1">
        {{ format(item.date, 'dd-MM-yyyy HH:mm') }}</span>

      <button @click="() => {
        useStudent.focusedSummon = item
        useWidget.summonDetail = true
      }" class="btn btn-square btn-ghost">
        <elipsis-h class="w-6 fill-primary-3" />
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
import { format } from 'date-fns';

const props = defineProps(['item'])
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
</script>

<style lang="scss" scoped></style>

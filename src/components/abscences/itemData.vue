<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-3"
    :class="`grid gap-1.5 grid-cols-2`">
    <span class="my-auto truncate flex items-center gap-3">
      <div class=" flex items-center justify-center overflow-hidden">
        <slot name="studentCheckbox" />
      </div>
      <span class="font-medium truncate auto-dir">
        {{ item.prenom }} {{ item.nom }}</span>
    </span>


    <div class="w-full flex items-center justify-between gap-2">
      <div class="flex flex-wrap items-center gap-1.5 min-w-0">
        <span
          :class="item.present ? 'text-emerald-500 bg-emerald-100 border-emerald-500' : 'border-red-500 text-red-500 bg-red-100 '"
          class="border  rounded-full py-1 px-2.5 h-fit uppercase  my-auto w-fit flex items-center gap-2 text-xs">{{
            item.present ? t('translation.present') : t('translation.absent') }}</span>

        <!-- Le signalement fait aujourd'hui : le prof voit qu'il a bien été enregistré -->
        <span v-if="item.signalement_type" :title="t('translation.signaledToday')"
          :class="item.signalement_type === 'Absence' ? 'text-error border-error/40 bg-error/10' : 'text-warning border-warning/40 bg-warning/10'"
          class="border rounded-full py-1 px-2 text-xs w-fit truncate">
          {{ item.signalement_type === 'Absence' ? t('translation.absenceType') : t('translation.lateType') }}
          <template v-if="item.signalement_heure">· {{ format(new Date(item.signalement_heure), 'HH:mm') }}</template>
        </span>
      </div>

      <button type="button" :aria-label="t('translation.signaleAbs/Late')" @click="() => {
        useStudent.focusedStudent = item
        useWidget.lateModal = true
      }"
        class="btn btn-sm btn-square shrink-0 text-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
        <no-time-warning class="w-4" />
      </button>
    </div>

  </div>
</template>

<script setup>
import { format } from 'date-fns';
import noTimeWarning from '@/assets/icons/noTimeWarning.vue';
import { useStudentStore } from '@/stores/students';
import { useWidgetStore } from '@/stores/widget';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
defineProps(['item'])
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
</script>

<style lang="scss" scoped></style>

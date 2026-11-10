<template>
  <div class="w-full border-b border-border-color hover:bg-slate-50 px-3 py-2 flex flex-col gap-1.5">
    <div class="grid gap-1.5 grid-cols-3 items-center">

      <div class="flex flex-col gap-1 min-w-0">
        <span :class="item.type === 'Absence' ? 'text-error' : 'text-warning'" class="truncate font-medium capitalize">
          {{ item.type === 'Absence' ? t('translation.abscence') : t('translation.lateOne') }}
        </span>
        <!-- Un signalement du prof reste « en attente » tant que l'école ne l'a pas validé -->
        <span :class="item.confirmed ? 'text-emerald-600 bg-emerald-100' : 'text-slate-600 bg-slate-100'"
          class="rounded-full px-2 py-0.5 text-[11px] w-fit truncate max-w-full">
          {{ item.confirmed ? t('translation.validated') : t('translation.pending') }}
        </span>
      </div>

      <div class="flex flex-col min-w-0">
        <span class="truncate">{{ dateAbsence ? format(dateAbsence, 'dd/MM/yyyy') : 'N/A' }}</span>
        <span v-if="dateAbsence" class="truncate text-slate-500">{{ format(dateAbsence, 'HH:mm') }}</span>
        <!-- Une fois validée, l'agent est la personne de l'école qui a validé : on ne l'affiche plus -->
        <span v-if="item.agent_nom && !item.confirmed" class="truncate text-[11px] text-slate-500">
          {{ t('translation.signaledBy') }} {{ item.agent_nom }}
        </span>
      </div>

      <div class="flex items-center justify-center">
        <button v-if="justifiee" type="button" @click="voirJustification"
          :aria-label="t('translation.viewJustification')"
          class="btn btn-xs h-auto min-h-7 py-1 border border-primary text-primary bg-transparent hover:bg-primary/10 flex items-center gap-1 max-w-full">
          <check-file-primary class="w-4 shrink-0" />
          <span class="text-xs">{{ t('translation.justified') }}</span>
        </button>
        <span v-else class="flex items-center gap-1 text-slate-500 text-xs text-center min-w-0">
          <check-file class="w-4 shrink-0" />
          <span>{{ t('translation.unjustified') }}</span>
        </span>
      </div>
    </div>

    <!-- Le motif donné par le parent, lisible sans ouvrir la justification -->
    <button v-if="item.commentaire" type="button" @click="voirJustification"
      class="w-full text-start text-sm text-slate-600 bg-slate-50 rounded-lg px-2 py-1 line-clamp-2 auto-dir">
      <span class="font-medium capitalize">{{ t('translation.motif') }} :</span> {{ item.commentaire }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import checkFilePrimary from '@/assets/icons/checkFilePrimary.vue';
import checkFile from '@/assets/icons/checkFile.vue';
import { useStudentStore } from '@/stores/students';
import { useWidgetStore } from '@/stores/widget';

const props = defineProps(['item'])
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
const { t } = useI18n()

const dateAbsence = computed(() => (props.item.date_heure_abs ? new Date(props.item.date_heure_abs) : null))
const justifiee = computed(() => Boolean(props.item.justification || props.item.commentaire))

// Ouvre la fenêtre de justification (motif et fichier joint)
const voirJustification = () => {
  useStudent.focusedAbscence = props.item
  useWidget.justifyModal = true
}
</script>

<style lang="scss" scoped></style>

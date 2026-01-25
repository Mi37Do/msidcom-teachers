<template>
  <div ref="rootElement"
    class="w-full py-2 h-12 border-b border-border-color hover:bg-slate-50 px-3 grid gap-1.5 grid-cols-2">
    <span class="my-auto truncate flex items-center gap-3">
      <span class="font-medium">
        {{ item.prenom }} {{ item.nom }}</span>
    </span>
    <span class="my-auto truncate flex items-center gap-3 w-full justify-between">
      <span v-if="!selectedNotes" class="font-medium flex-1 truncate">N/A</span>
      <span v-else class="font-medium flex-1 truncate">
        <span v-if="tab === 'avrege'">{{ selectedNotes.moyenne ? selectedNotes.moyenne : 'N/A' }}</span>
        <span v-if="tab === 'attendance'">{{ selectedNotes.assiduite ? selectedNotes.assiduite : 'N/A' }}</span>
        <span v-if="tab === 'test' || tab === 'test_1'">{{ selectedNotes.test_1 ? selectedNotes.test_1 : 'N/A' }}</span>
        <span v-if="tab === 'test_2'">{{ selectedNotes.test_1 ? selectedNotes.test_2 : 'N/A' }}</span>
        <span v-if="tab === 'homework' || tab === 'homework_1'">{{ selectedNotes.devoir_1 ? selectedNotes.devoir_1 :
          'N/A' }}</span>
        <span v-if="tab === 'homework_2'">{{ selectedNotes.devoir_1 ? selectedNotes.devoir_2 : 'N/A' }}</span>
        <span v-if="tab === 'exam'">{{ selectedNotes.examens ? selectedNotes.examens : 'N/A' }}</span>
      </span>

      <button v-if="useWidget.currentYear && !currentTabValue" @click="() => {
        tempNotes.Trimestre = trimester
        tempNotes.matiere_spec = specialite
        Object.assign(useWidget.addNote, {
          add: selectedNotes ? true : false,
          type: tab,
          type_fr: tab === 'avrege' ? 'moyenne' : tab === 'attendance' ? 'assiduite' : (tab === 'test' || tab === 'test_1') ? 'test_1' : tab === 'test_2' ? 'test_2' : (tab === 'homework' || tab === 'homework_1') ? 'devoir_1' : tab === 'homework_2' ? 'devoir_2' : 'examens',
          open: true,
          note: selectedNotes ? selectedNotes : tempNotes,
          student: item.id
        })
      }"
        class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
        <edit class="w-5"></edit>
      </button>
    </span>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import edit from '@/assets/icons/edit.vue';
import { useWidgetStore } from '@/stores/widget';
import { useI18n } from 'vue-i18n';

const props = defineProps(['item', 'tab', 'selectedNotes', 'specialite', "trimester"])

const currentTabValue = computed(() => {
  if (!props.selectedNotes) return null
  if (props.tab === 'avrege') return props.selectedNotes.moyenne
  if (props.tab === 'attendance') return props.selectedNotes.assiduite
  if (props.tab === 'test' || props.tab === 'test_1') return props.selectedNotes.test_1
  if (props.tab === 'test_2') return props.selectedNotes.test_2
  if (props.tab === 'homework' || props.tab === 'homework_1') return props.selectedNotes.devoir_1
  if (props.tab === 'homework_2') return props.selectedNotes.devoir_2
  if (props.tab === 'exam') return props.selectedNotes.examens
  return null
})
const useWidget = useWidgetStore()
const rootElement = ref(null)
const tempNotes = reactive({
  moyenne: null,
  assiduite: null,
  test_1: null,
  devoir_1: null,
  test_2: null,
  Trimestre: null, matiere_spec: null,
  devoir_2: null, examens: null,
  anne: useWidget.currentYear ? useWidget.currentYear.id : null,
})
const { t } = useI18n()

defineExpose({ rootElement })

</script>

<style lang="scss" scoped></style>

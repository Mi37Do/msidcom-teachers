<template>
  <div ref="rootElement" class="w-full h-[57px] border-b border-border-color hover:bg-slate-50 px-3"
    :class="`grid gap-1.5 grid-cols-3`">

    <span :class="item.type === 'Absence' ? 'text-error' : 'text-warning'"
      class="my-auto truncate font-medium capitalize">{{ item.type === 'Absence' ? t('translation.abscence') :
        t('translation.lateOne')
      }}</span>
    <span class="my-auto truncate">{{ item.date_heure_abs ? format(item.date_heure_abs, 'dd/MM/yyyy - HH:mm') : 'N/A'
    }}</span>
    <span class="flex items-center justify-center">

      <check-file-primary v-if="item.justification" @click="saveFile(item.justification)" class="w-[20px]" />
      <check-file v-else class="w-[20px]" />
    </span>



  </div>
</template>

<script setup>
import { format } from 'date-fns';
import fileEdit from '@/assets/icons/fileEdit.vue';
import { useI18n } from 'vue-i18n';
import checkFilePrimary from '@/assets/icons/checkFilePrimary.vue';
import checkFile from '@/assets/icons/checkFile.vue';
import { useDownloadFile } from '@/composables/downloadFile';
import { useStudentStore } from '@/stores/students';

const props = defineProps(['item'])
const useStudent = useStudentStore()
const { t } = useI18n()

const { downloadFile } = useDownloadFile()

// Trigger from UI
const saveFile = (base64String) => {
  let uniqueName = `${props.item.type}_${useStudent.focusedStudent.nom}_${useStudent.focusedStudent.prenom}_${format(props.item.date_heure_abs, 'dd_MM_yyyy')}`
  downloadFile(uniqueName, base64String)
}

</script>

<style lang="scss" scoped></style>

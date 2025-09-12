<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-4" :class="[
    `grid grid-cols-3 gap-1.5`]">
    <span :class="item.type === 'Absence' ? 'text-error' : 'text-warning'"
      class="my-auto truncate flex items-center gap-3">
      <span class="font-medium truncate flex-1">
        {{ item.type
        }}</span>
    </span>
    <span class="my-auto truncate flex flex-col justify-center ">
      <span class="font-medium truncate flex-1">
        {{ format(item.date_heure_abs, 'dd-MM-yyyy') }}</span>
      <span class="truncate flex-1 text-slate-500">{{ format(item.date_heure_abs, 'HH:mm') }}</span>
    </span>


    <div class="my-auto flex items-center justify-center gap-3">
      <button v-if="!item.justification" @click="
        () => {
          useStudent.focusedAbscence = item
          useWidget.addJustify = true
        }
      " class="btn btn-square btn-ghost">
        <add-circle class="w-5" />
      </button>

      <button v-else @click="
        () => {
          saveFile(item.justification)
        }
      " class="btn btn-square btn-ghost">
        <file-alt class="fill-primary w-5" />
      </button>

    </div>
  </div>
</template>

<script setup>
import addCircle from '@/assets/icons/addCircle.vue';
import { useStudentStore } from '@/stores/students';
import fileAlt from '@/assets/icons/fileAlt.vue';
import { useWidgetStore } from '@/stores/widget';
import elipsisH from '@/assets/icons/elipsisH.vue';
import { ref } from 'vue';
import { format } from 'date-fns';
import { useDownloadFile } from '@/composables/downloadFile';

const props = defineProps(['item'])
const useStudent = useStudentStore()
const useWidget = useWidgetStore()

const { downloadFile } = useDownloadFile()

// Trigger from UI
const saveFile = (base64String) => {
  let uniqueName = `justification_${props.item.type}_${useWidget.authUser.userDetail.first_name}_${useWidget.authUser.userDetail.last_name}_${format(props.item.date_heure_abs, 'dd_MM_yyyy')}.pdf`
  downloadFile(uniqueName, base64String, 'application/pdf')
}

</script>

<style lang="scss" scoped></style>

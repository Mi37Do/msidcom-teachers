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

      <check-file-primary v-if="item.justification" @click="handleDownload(item.justification)" class="w-[20px]" />
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
import { useDownloadBase64 } from '@/composables/useDownloadBase64'

const props = defineProps(['item'])
const { t } = useI18n()
const { downloadBase64 } = useDownloadBase64()

function handleDownload(base64String) {
  downloadBase64(base64String, 'file.pdf', 'application/pdf')
}

</script>

<style lang="scss" scoped></style>

<template>
  <div class="w-full h-fit rounded-xl border border-border-color bg-white  p-4 flex flex-col gap-3 overflow-hidden">
    <div class="w-full flex gap-4 items-center">
      <span class="truncate font-medium text-[1.05rem] flex-1 capitalize">{{ item.designation }}</span>

      <div
        :class="item.type === 'Annonce' ? 'bg-warning/20 text-warning' : item.type === 'Devoir' ? 'bg-primary-3/20 text-primary-3' : 'bg-primary/20 text-primary'"
        class="h-6 w-20  rounded-full flex items-center justify-center text-xs  font-medium">{{
          translatedType }}</div>
    </div>

    <span class=" font-medium">{{ t('translation.postedOn') }} {{ format(item.created
      , 'dd/MM/yyyy - HH:mm') }}</span>

    <span>{{ item.description }}</span>
    <div v-if="item.piece_juinte" @click="saveFile(item.piece_juinte)"
      class="px-2.5 py-1.5 w-fit text-primary bg-primary/20 rounded-md text-xs font-medium flex gap-1.5 items-center">
      <file-alt class="w-5 fill-primary" />
      {{ t('translation.attachments') }}
    </div>
    <span v-if="item.date_limite" class=" font-medium text-error">{{ t('translation.deadline') }} {{ format(item.date_limite
      , 'dd/MM/yyyy') }}</span>
  </div>
</template>

<script setup>
import Trash from '@/assets/icons/trash.vue';
import { useWidgetStore } from '@/stores/widget';
import { format } from 'date-fns';
import fileAlt from '@/assets/icons/fileAlt.vue';
import { useDownloadFile } from '@/composables/downloadFile';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n()
const props = defineProps(['item', 'classes'])
const useWidget = useWidgetStore()

const translatedType = computed(() => {
  if (props.item.type === 'Annonce') return t('translation.annoncementType')
  if (props.item.type === 'Devoir') return t('translation.homeworkTypeLabel')
  return t('translation.otherType')
})
const { downloadFile } = useDownloadFile()

const saveFile = (base64String) => {
  let uniqueName = `${format(new Date(), 'dd_MMM_yyyy')}`
  downloadFile(uniqueName, base64String)
}
</script>

<style lang="scss" scoped></style>

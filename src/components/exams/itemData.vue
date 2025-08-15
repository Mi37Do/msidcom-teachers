<template>
  <div ref="rootElement" class="w-full bg-white rounded-xl border border-border-color h-fit p-3"
    :class="`flex flex-col gap-3 w-full`">
    <div class="my-auto truncate flex items-center gap-3 w-full">
      <span class="flex-1 overflow-hidden flex gap-1">
        <span class="text-secondary-2">Niveau & Spécialité :</span>
        <span class="font-medium">{{ item.specialite_designations }}</span>
      </span>

      <div class="w-fit px-2 flex items-center font-medium h-6 bg-error/20 rounded-full text-error">24H</div>
    </div>

    <div class="flex gap-1.5">
      <span class="text-secondary-2">Du </span>
      <span class="my-auto truncate font-medium">{{ format(item.date_debut, 'dd-MM-yyyy') }}</span>
      <span class="text-secondary-2">Au </span>
      <span class="my-auto truncate font-medium">{{ format(item.date_fin, 'dd-MM-yyyy') }}</span>
    </div>


    <div v-if="item.file"
      class="flex gap-3 items-center bg-primary/20 fill-primary py-1.5 px-2.5 rounded-lg text-primary font-medium text-xs w-fit">
      <div @click="handleDownload(item.file)" class="flex justify-center">
        <file-alt :class="'fill-primary'" class="w-5" />
      </div>
      <span>PDF d'examen</span>
    </div>

    <div class="flex gap-1.5 font-medium text-gray-500">
      <span class="">Publier le </span>
      <span class="my-auto truncate ">{{ format(item.created, 'dd-MM-yyyy HH:mm') }}</span>
    </div>


  </div>
</template>

<script setup>
import fileAlt from '@/assets/icons/fileAlt.vue';
import { format } from 'date-fns';
import { ref } from 'vue';
import { useRoomStore } from '@/stores/rooms';
import { useSubjectStore } from '@/stores/subjects';
import { useDownloadBase64 } from '@/composables/useDownloadBase64'

const { downloadBase64 } = useDownloadBase64()

const props = defineProps(['item'])
const useRoom = useRoomStore()
const useSubject = useSubjectStore()
const rootElement = ref(null)

defineExpose({ rootElement })

function handleDownload(base64String) {
  downloadBase64(base64String, 'file.pdf', 'application/pdf')
}
</script>

<style lang="scss" scoped></style>

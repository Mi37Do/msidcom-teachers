<template>
  <div ref="rootElement" class="w-full bg-white rounded-xl border border-border-color h-fit p-3"
    :class="`flex flex-col gap-3 w-full`">
    <div class="my-auto truncate flex items-center gap-3 w-full">
      <span class="flex-1 overflow-hidden flex gap-1">
        <span class="text-secondary-2">Niveau & Spécialité :</span>
        <span class="font-medium">{{ item.specialite_designations }}</span>
      </span>

      <div
        v-if="differenceInHours(new Date(), parse(item.date_debut, 'yyyy-MM-dd', new Date())) < 24 && differenceInHours(new Date(), parse(item.date_debut, 'yyyy-MM-dd', new Date())) > 0"
        class="w-fit px-2 flex items-center font-medium h-6 bg-error/20 rounded-full text-error">25h</div>
    </div>

    <div class="flex gap-1.5">
      <span class="text-secondary-2">Du </span>
      <span class="my-auto truncate font-medium">{{ format(item.date_debut, 'dd-MM-yyyy') }}</span>
      <span class="text-secondary-2">Au </span>
      <span class="my-auto truncate font-medium">{{ format(item.date_fin, 'dd-MM-yyyy') }}</span>
    </div>


    <button v-if="item.file" @click="saveFile(item.file)"
      class="flex gap-3 items-center bg-primary/20 fill-primary py-1.5 px-2.5 rounded-lg text-primary font-medium text-xs w-fit">
      <div class="flex justify-center">
        <file-alt :class="'fill-primary'" class="w-5" />
      </div>
      <span>PDF d'examen</span>
    </button>

    <div class="flex gap-1.5 font-medium text-gray-500">
      <span class="">Publier le </span>
      <span class="my-auto truncate ">{{ format(item.created, 'dd-MM-yyyy HH:mm') }}</span>
    </div>


  </div>
</template>

<script setup>
import fileAlt from '@/assets/icons/fileAlt.vue';
import { differenceInHours, format, parse } from 'date-fns';
import { ref } from 'vue';
import { useDownloadFile } from '@/composables/downloadFile';


const { downloadFile } = useDownloadFile()

const props = defineProps(['item'])
const rootElement = ref(null)

defineExpose({ rootElement })

// Trigger from UI
const saveFile = (base64String) => {
  let uniqueName = `examen_${props.item.specialite_designations.replace(/\s+/g, '_').toLowerCase()}_${props.item.date_debut}`

  downloadFile(uniqueName, base64String)
}
</script>

<style lang="scss" scoped></style>

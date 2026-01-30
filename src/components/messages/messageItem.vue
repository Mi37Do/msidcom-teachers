<template>
  <div
    :class="useWidget.authUser.userDetail.id === message.sender_id ? 'ml-auto bg-primary/20' : 'mr-auto bg-[#F5F5F5]'"
    class="max-w-[300px] p-2 rounded-lg h-fit flex flex-col gap-2 items-end">
    <span v-if="message.message" class="w-full break-all">{{ message.message }}</span>

    <div v-if="message.type === 'Piece_jouinte'">
      <div v-if="message.type_piece_jointe === 'image'" class="w-40 h-40 overflow-hidden rounded-md">
        <img :src="message.pieces_jointe" class="w-full h-full object-cover">
      </div>
      <div v-else @click="saveFile(message.pieces_jointe)" class="w-10 h-10 ">
        <downloadFiles class="w-10 fill-primary" />
      </div>
    </div>

    <div class="hidden">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import downloadFiles from '@/assets/icons/downloadFile.vue';
import { useDownloadFile } from '@/composables/downloadFile';
import { useWidgetStore } from '@/stores/widget'
import { format } from 'date-fns';

const props = defineProps(['message', 'side'])
const useWidget = useWidgetStore()

const { downloadFile } = useDownloadFile()

// Trigger from UI
const saveFile = (base64String) => {
  let uniqueName = `${format(new Date(), 'dd_MMM_yyyy')}`
  downloadFile(uniqueName, base64String)
}
</script>

<style lang="scss" scoped></style>

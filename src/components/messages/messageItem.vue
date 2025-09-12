<template>
  <div :class="useWidget.authUser.userDetail.id === message.sender ? 'ml-auto bg-primary/20' : 'mr-auto bg-[#F5F5F5]'"
    class="max-w-[300px] p-2 rounded-lg h-fit flex flex-col gap-2 items-end">
    <span>{{ message.message }}</span>

    <div v-if="message.type === 'Piece_jouinte'" @click="saveFile(message.pieces_jointe)" class="w-10 h-10 ">
      <downloadFiles class="w-10 fill-primary" />
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

console.log(props.message);


const { downloadFile } = useDownloadFile()

// Trigger from UI
const saveFile = (base64String) => {
  let uniqueName = `${format(new Date(), 'dd_MMM_yyyy')}.pdf`
  downloadFile(uniqueName, base64String, 'application/pdf')
}
</script>

<style lang="scss" scoped></style>

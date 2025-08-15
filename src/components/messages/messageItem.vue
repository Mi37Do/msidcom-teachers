<template>
  <div :class="useWidget.authUser.userDetail.id === message.sender ? 'ml-auto bg-primary/20' : 'mr-auto bg-[#F5F5F5]'"
    class="max-w-[300px] p-2 rounded-lg h-fit flex flex-col gap-2 items-end">
    <span>{{ message.message }}</span>

    <div v-if="message.type === 'Piece_jouinte'" @click="downloadPdf(message.file)" class="w-10 h-10 ">
      <downloadFile class="w-10 fill-primary" />
    </div>
    <div class="hidden">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import downloadFile from '@/assets/icons/downloadFile.vue';
import { useWidgetStore } from '@/stores/widget'

const props = defineProps(['message', 'side'])
const useWidget = useWidgetStore()

console.log(props.message);



const downloadPdf = (file) => {
  const link = document.createElement('a')
  link.href = file
  link.download = 'file.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style lang="scss" scoped></style>

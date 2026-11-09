<template>
  <div
    :class="useWidget.authUser.userDetail.id === message.sender_id ? 'ml-auto bg-primary/20' : 'mr-auto bg-[#F5F5F5]'"
    class="max-w-[300px] p-2 rounded-lg h-fit flex flex-col gap-2 items-end">
    <span v-if="message.message" class="w-full break-all">{{ message.message }}</span>

    <div v-if="message.type === 'Piece_jouinte'">
      <!-- Image ou autre fichier : aperçu en grand, avec téléchargement dans son format d'origine -->
      <button v-if="message.type_piece_jointe === 'image'" type="button" @click="saveFile(message.pieces_jointe)"
        class="block w-40 h-40 overflow-hidden rounded-md">
        <img :src="message.pieces_jointe" class="w-full h-full object-cover" :alt="t('translation.attachment')">
      </button>
      <button v-else type="button" @click="saveFile(message.pieces_jointe)" class="block w-10 h-10"
        :aria-label="t('translation.apercu')">
        <downloadFiles class="w-10 fill-primary" />
      </button>
    </div>

    <div class="hidden">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import downloadFiles from '@/assets/icons/downloadFile.vue';
import { useApercuFichier } from '@/composables/useApercuFichier';
import { useWidgetStore } from '@/stores/widget'
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';

const props = defineProps(['message', 'side'])
const useWidget = useWidgetStore()

const { t } = useI18n()
const { ouvrirApercu } = useApercuFichier()

const saveFile = (base64String) => {
  let uniqueName = `${format(new Date(), 'dd_MMM_yyyy')}`
  ouvrirApercu(base64String, uniqueName)
}
</script>

<style lang="scss" scoped></style>

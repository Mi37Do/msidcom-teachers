<template>
  <div
    :class="useWidget.authUser.userDetail.id === message.sender_id ? 'ml-auto bg-primary/20' : 'mr-auto bg-[#F5F5F5]'"
    class="max-w-[300px] p-2 rounded-lg h-fit flex flex-col gap-2 items-end">
    <span v-if="message.message" class="w-full break-all">{{ message.message }}</span>

    <div v-if="message.type === 'Piece_jouinte'">
      <!-- La discussion n'envoie pas les fichiers : ils se chargent au toucher (aperçu en grand, avec
           téléchargement). Une photo déjà ouverte s'affiche ensuite en vignette. -->
      <button v-if="message.type_piece_jointe === 'image' && image" type="button" @click="ouvrirFichier"
        class="block w-40 h-40 overflow-hidden rounded-md">
        <img :src="image" class="w-full h-full object-cover" :alt="t('translation.photoJointe')">
      </button>
      <button v-else-if="message.type_piece_jointe === 'image'" type="button" @click="ouvrirFichier"
        class="flex items-center gap-2 px-3 py-2 rounded-md bg-white/70 text-primary font-medium">
        <file-alt class="w-5 fill-primary" />
        {{ t('translation.photoJointe') }}
      </button>
      <button v-else type="button" @click="ouvrirFichier" class="block w-10 h-10"
        :aria-label="t('translation.apercu')">
        <downloadFiles class="w-10 fill-primary" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import downloadFiles from '@/assets/icons/downloadFile.vue';
import fileAlt from '@/assets/icons/fileAlt.vue';
import { estUnFichier, fichierEnMemoire, useApercuFichier } from '@/composables/useApercuFichier';
import { useWidgetStore } from '@/stores/widget'
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';

const props = defineProps(['message', 'side'])
const useWidget = useWidgetStore()

const { t } = useI18n()
const { ouvrirFichierDe } = useApercuFichier()

const FICHE = { ressource: 'messages', champ: 'pieces_jointe' }

// Photo à montrer en vignette : envoyée avec la discussion (anciennes versions du serveur) ou déjà ouverte
const image = computed(() =>
  estUnFichier(props.message.pieces_jointe) ? props.message.pieces_jointe : fichierEnMemoire(props.message, FICHE))

const ouvrirFichier = () =>
  ouvrirFichierDe(props.message, { ...FICHE, nom: `${format(new Date(), 'dd_MMM_yyyy')}` })
</script>

<style lang="scss" scoped></style>

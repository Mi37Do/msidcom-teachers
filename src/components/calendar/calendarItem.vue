<template>
  <div class="w-full h-fit flex">
    <div :style="variablesCarte(couleur)"
      class="carte-couleur flex-1 h-full  rounded-[10px] p-4 border border-border-color flex flex-col items-center overflow-hidden gap-2">
      <span class="font-semibold truncate">
        {{ item.matiere_designation }} - {{ typeCours(item.type_cour) }}</span>
      <span class="capitalize">{{ t('translation.room') }} - {{
        item.salle_designation ?? 'N/A' }}</span>
      <!-- Numéro de classe (avant : la salle était affichée à sa place) -->
      <span class="capitalize">{{ t('translation.classe') }} {{
        item.class_specialite ?? 'N/A' }} - {{
          item.class_num ?? 'N/A' }}</span>

      <span class="capitalize flex gap-2 items-center">
        <clock class="w-5 carte-accent-fill" /> {{ item.from_time ? format(parse(item.from_time,
          'HH:mm:ss', new Date()), 'HH:mm') :
          'N/A' }} - {{
          item.to_time ? format(parse(item.to_time, 'HH:mm:ss', new Date()), 'HH:mm') :
            'N/A' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { couleurCarteAuHasard, variablesCarte } from '@/utils/couleursCartes'
import { format, parse } from 'date-fns'
import { useI18n } from 'vue-i18n'
import clock from '@/assets/icons/clock.vue'
import { useRoute } from 'vue-router'

const props = defineProps(['item'])
const route = useRoute()

const { t } = useI18n()

// Codes du serveur (TP, TD, COUR, AUTRE) traduits ; une valeur inconnue ou vide reste lisible
const TYPES_COURS = ['TP', 'TD', 'COUR', 'AUTRE']
const typeCours = (code) => (TYPES_COURS.includes(code) ? t(`translation.course_type_${code}`) : code || '')


const couleur = couleurCarteAuHasard()
</script>

<style lang="scss" scoped></style>

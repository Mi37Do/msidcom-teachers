<template>
  <div class="w-full h-fit flex">
    <div v-if="sideOptions" class="w-8 mr-2">
      <slot name="side_options"></slot>
    </div>
    <div :style="variablesCarte(couleur)"
      class="carte-couleur flex-1 h-full  rounded-[10px] p-4 border border-border-color flex flex-col items-center overflow-hidden gap-2">
      <span class="font-semibold truncate">
        {{ item.matiere_designations }} - {{ item.type_cour }}</span>
      <span class="capitalize">{{ t('translation.room') }} {{ item.salle_designations }}</span>
      <span v-if="route.name === 'class-time-table-view'" class="capitalize truncate">{{ t('translation.prof') }} {{
        item.prof_designations }}</span>

      <span v-else class="capitalize truncate">{{
        item.classe_designations.classe_specialite }} - {{
          item.classe_designations.class_number }}</span>
      <span class="capitalize">{{ item.from_time ? format(parse(item.from_time, 'HH:mm:ss', new Date()), 'HH:mm') :
        'N/A' }} - {{
          item.to_time ? format(parse(item.to_time, 'HH:mm:ss', new Date()), 'HH:mm') :
            'N/A' }} </span>
    </div>
  </div>
</template>

<script setup>
import { couleurCarteAuHasard, variablesCarte } from '@/utils/couleursCartes'
const props = defineProps(['sideOptions', 'item', 'room', 'teacher', 'subject'])
import { format, parse } from 'date-fns'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useI18n()


const couleur = couleurCarteAuHasard()
</script>

<style lang="scss" scoped></style>

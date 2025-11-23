<template>
  <div class="w-full h-fit flex">
    <div :style="{ color: currentTheme.secondary, background: currentTheme.primary }"
      class="flex-1 h-full  rounded-[10px] p-4 border border-border-color flex flex-col items-center overflow-hidden gap-2">
      <span class="font-semibold truncate">
        {{ item.matiere_designation }} - {{ item.type_cour }}</span>
      <span class="capitalize">{{ t('translation.room') }} - {{
        item.salle_designation }}</span>
      <span class="capitalize">{{ t('translation.classe') }} {{
        item.class_specialite }} - {{
          item.salle_designation }}</span>

      <span class="capitalize flex gap-2 items-center">
        <clock :style="{ fill: currentTheme.secondary }" class="w-5" /> {{ item.from_time ? format(parse(item.from_time,
          'HH:mm:ss', new Date()), 'HH:mm') :
          'N/A' }} - {{
          item.to_time ? format(parse(item.to_time, 'HH:mm:ss', new Date()), 'HH:mm') :
            'N/A' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { format, parse } from 'date-fns'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import clock from '@/assets/icons/clock.vue'
import { useRoute } from 'vue-router'

const props = defineProps(['item'])
const route = useRoute()
const themes = [
  {
    id: 1,
    primary: '#D4E5FF',
    secondary: '#002D72',
  },
  {
    id: 2,
    primary: '#FFECC5',
    secondary: '#F1B434',
  },
  {
    id: 3,
    primary: '#E5DDFF',
    secondary: '#7E5EEE',
  },
  {
    id: 4,
    primary: '#FFBABE',
    secondary: '#EF6079',
  },
  {
    id: 5,
    primary: '#D0EDF2',
    secondary: '#00778B',
  },
]

const { t } = useI18n()

function getRandomTheme() {
  const index = Math.floor(Math.random() * themes.length)
  return themes[index]
}

// Example usage
const currentTheme = ref(getRandomTheme())
</script>

<style lang="scss" scoped></style>

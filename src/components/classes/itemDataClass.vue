<template>
  <div class="flex flex-col gap-3 bg-white p-3 rounded-xl border  border-slate-200 font-medium h-fit">
    <div class="w-full  flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-primary/40 rounded-full flex items-center justify-center">
        <calendar class="w-5 h-5" />
      </div>
      <span class="truncate flex-1 text-lg font-medium capitalize">{{ t('translation.classe') }}: {{ item.specialite ?
        item.specialite[0].specialite_designations : ''
      }} - {{ item ? item.class_num : 'N/A' }}</span>

      <slot name="options" />
    </div>

    <div class="w-full grid grid-cols-2 gap-3 px-3">
      <span class="uppercase font-semibold">{{ t('translation.subject') }}</span>

      <div v-if="item.specialite" class="flex flex-wrap gap-0 5">
        <span v-for="spec in item.specialite" :key="spec.id">{{ spec.matiere_designations }}</span>
      </div>
    </div>

    <div class="flex items-center gap-3 w-full px-3">
      <div class="flex-1">
        <commun-progress-bar />
      </div>
      <span class="text-primary font-semibold">66%</span>
    </div>

    <router-link :to="{ name: 'class-panel', params: { id: item.id } }"
      class="btn btn-sm pixa-btn w-fit pixa-btn-nofloat">{{
        t('translation.access') }}
      <angle-icon class="w-5 h-5 -rotate-90" />
    </router-link>
  </div>

</template>

<script setup>
import calendar from '@/assets/icons/calendar.vue';
import { useI18n } from 'vue-i18n';
import communProgressBar from '../commun/communProgressBar.vue';
import angleIcon from '@/assets/icons/angleIcon.vue';

const props = defineProps(['item'])

const { t } = useI18n()
</script>

<style lang="scss" scoped></style>

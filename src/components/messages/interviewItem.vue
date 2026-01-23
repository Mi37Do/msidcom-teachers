<template>
  <div class="h-fit bg-white border border-border-color rounded-md p-3 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="flex gap-1.5 flex-1 truncate">
        <span class="text-secondary-2 capitalize">{{ t('translation.interviewFor') }} : </span>
        <span>{{ item.entrevue_day }}</span>

      </div>

      <div :class="[
        item.state === 'NEW' ? 'bg-warning' : item.state === 'ACCEPTEE' ? 'bg-primary' : 'bg-error'
      ]" class="flex gap-3 px-2 py-1  items-center text-white rounded-full uppercase text-xs">
        <span class="w-1 h-1 bg-white rounded-full"></span>
        <span>{{ item.state === 'NEW' ? t('translation.in_progress') : item.state }}</span>
      </div>
      <!--
      <span class="font-medium">{{ item.entrevue_day }}</span>
      <span v-if="item.entrevue_hours" class="font-medium">{{ item.entrevue_hours }}</span>-->
    </div>

    <div class="flex gap-1.5 flex-1 truncate">
      <span class="text-secondary-2 capitalize">{{ t('translation.tutor') }} : </span>
      <span>{{ item.parent_designations }}</span>

    </div>

    <div class="flex gap-1.5 flex-1">
      <span class="text-secondary-2 capitalize">{{ t('translation.date') }} : </span> <span>{{ item.prof_disponiblites
      }}</span>
    </div>

    <div class="flex gap-1.5 flex-1">
      <span class="text-secondary-2 capitalize">{{ t('translation.motif') }} : </span>
      <span>{{ item.motif }}</span>
    </div>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const props = defineProps(['item'])
const useMessages = useMessagesStore()

console.log(props.item);


const { t } = useI18n()

</script>

<style lang="scss" scoped></style>

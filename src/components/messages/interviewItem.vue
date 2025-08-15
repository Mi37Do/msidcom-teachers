<template>
  <div class="h-fit bg-[#F5F5F5] rounded-md p-3 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="flex gap-1.5 flex-1">
        <span class="text-secondary-2 capitalize">{{ t('translation.parent') }} : </span>
        <span>{{ item.parent_designations }}</span>
      </div>
      <span class="font-medium">{{ item.entrevue_day }}</span>
      <span v-if="item.entrevue_hours" class="font-medium">{{ item.entrevue_hours }}</span>
    </div>

    <div class="flex gap-1.5 flex-1">
      <span class="text-secondary-2 capitalize">{{ t('translation.prof') }} : </span>
      <span>{{ item.prof_designations }}</span>
    </div>

    <div class="flex gap-1.5 flex-1">
      <span class="text-secondary-2 capitalize">{{ t('translation.motif') }} : </span>
      <span>{{ item.motif }}</span>
    </div>
    <div v-if="item.state === 'NEW'" class="flex justify-end gap-1.5">
      <button @click="changeStatus('REFUSEE')" class="btn btn-sm pixa-btn red-btn-ghost">refuser</button>
      <button @click="changeStatus('ACCEPTEE')" class="btn btn-sm pixa-btn btn-primary">accepter</button>
    </div>
    <div v-else class="w-full flex items-center justify-center py-2 rounded-lg text-white font-medium"
      :class="item.state === 'ACCEPTEE' ? 'bg-primary' : 'bg-error'">
      {{ item.state === 'ACCEPTEE' ? 'Accepter' : 'Refuser' }}
    </div>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const props = defineProps(['item'])
const useMessages = useMessagesStore()

const { t } = useI18n()

const changeStatus = async (status) => {
  try {
    let response = await axios.patch(`/api/Entrevue/${props.item.id}/`, {
      state: status
    })

    await useMessages.getInterviews()
  } catch (error) {
    console.error(error)

  }
}
</script>

<style lang="scss" scoped></style>

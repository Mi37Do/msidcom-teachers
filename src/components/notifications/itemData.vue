<template>
  <button @click="openNotification(item)" :class="openNotif ? 'h-fit' : 'h-20'" v-auto-animate
    class=" bg-white border border-border-color rounded-xl p-4 flex  gap-4">
    <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
      <Megaphone v-if="item.type === 'ANNONCE'" class="w-8 fill-slate-700" />
      <stop-watch v-else class="w-8" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-full overflow-hidden text-start">
      <span class="w-full  text-lg font-medium">{{ item.title }}</span>
      <span class="truncate text-sm -mt-0.5">{{ format(item.created, 'dd-MM-yyyy | HH:mm') }}</span>
      <div class="w-full flex gap-3">
        <span v-if="openNotif" class=" flex-1 text-start mt-4">{{ item.message
          }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
import stopWatch from '@/assets/icons/stopWatch.vue';
import percent from '@/assets/icons/percent.vue';
import Megaphone from '@/assets/icons/megaphone.vue';
import FileAlt from '@/assets/icons/fileAlt.vue';
import Note from '@/assets/icons/note.vue';
import user from '@/assets/icons/user.vue';
import { format } from 'date-fns';
import { ref } from 'vue';
import axios from 'axios';
import { useWidgetStore } from '@/stores/widget';

const props = defineProps(['item'])

const openNotif = ref(false)
const useWidget = useWidgetStore()

const openNotification = async (item) => {
  openNotif.value = !openNotif.value
  if (item.is_read) return
  else {
    try {
      let response = await axios.patch(`/api/Notification/${item.id}/`, {
        is_read: true
      })
      await useWidget.getNotifications()
    } catch (error) {

    }
  }
}
</script>

<style lang="scss" scoped></style>

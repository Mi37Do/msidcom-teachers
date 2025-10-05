<template>
  <button @click="openNotification(item)" :class="openNotif ? 'h-fit' : 'h-20'" v-auto-animate
    class="bg-white border border-border-color rounded-xl p-4 flex gap-4 items-center">
    <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
      <Megaphone class="w-8 fill-slate-700" />
    </div>

    <div class="flex-1 flex flex-col justify-between h-full overflow-hidden text-start">
      <span class="w-full truncate text-lg font-medium">{{ item.title }}</span>
      <span class="truncate text-sm -mt-0.5">{{ format(item.created, 'dd-MM-yyyy | HH:mm') }}</span>
      <div class="w-full flex gap-3">
        <span v-if="openNotif" class="flex-1 text-start mt-4">{{ item.message }}</span>
      </div>
    </div>

    <span v-if="!item.is_read" class="w-2.5 h-2.5 bg-primary rounded-full"></span>
  </button>
</template>

<script setup>
import Megaphone from '@/assets/icons/megaphone.vue'
import { format } from 'date-fns'
import { ref } from 'vue'
import { useNotificationBadge } from '@/stores/notifications'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const useNotif = useNotificationBadge()
const openNotif = ref(false)

const openNotification = async (item) => {
  openNotif.value = !openNotif.value

  // Only mark as read if it's not already read
  if (!item.is_read) {
    try {
      await useNotif.markAsRead([item.id])
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      // Optionally show a toast/alert to user
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add any custom styles here if needed */
</style>

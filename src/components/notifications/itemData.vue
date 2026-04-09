<template>
  <button @click="openNotification(item)"
    class="w-full h-fit rounded-xl border border-border-color bg-[#F5F5F5] p-3 flex gap-3 overflow-hidden">
    <div class="w-12 flex h-full">
      <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center relative">
        <span v-if="!item.is_read" class="w-2.5 h-2.5 bg-primary rounded-full absolute -top-0.5 -right-0.5"></span>
        <Comments
          v-if="item.type === 'ENTREVUE_DEMANDE' || item.type === 'MESSAGE' || item.type === 'ENTREVUE_ACCEPTEE' || item.type === 'ENTREVUE_REFUSEE'"
          class="w-8 fill-slate-700" />
        <Schedule v-if="item.type === 'EVENT' || item.type === 'ANNONCE'" class="w-8 fill-slate-700" />
      </div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col gap-3 items-start relative">
      <div class="w-full flex gap-4 items-center text-start">
        <span class="font-medium text-[1.05rem] flex-1 capitalize">{{ item.title }}</span>

        <div class="flex gap-1.5 shrink-0">

          <button type="button" @click.stop="
            () => {
              Object.assign(useWidget.deleteModal, {
                open: true,
                id: item.id,
                designation: item.title,
              })
            }
          " class="btn btn-sm btn-square btn-ghost p-0 pixa-btn-nofloat-red">
            <Trash class="w-5" />
          </button>
        </div>
      </div>

      <span>{{ format(item.created, 'dd/MM/yyyy') }}</span>

      <span class="text-start break-words max-w-full">{{ item.message }}</span>
    </div>
  </button>
</template>

<script setup>
import Trash from '@/assets/icons/trash.vue'
import { useWidgetStore } from '@/stores/widget'
import { format } from 'date-fns'
import { useNotificationBadge } from '@/stores/notifications'
import axios from 'axios'
import Schedule from '@/assets/icons/schedule.vue'
import Comments from '@/assets/icons/comments.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const useWidget = useWidgetStore()
const notificationStore = useNotificationBadge()
const router = useRouter()

const redirectMap = {
  ABSENCE_RETARD_ELEVE: { name: 'students-classes-view' },
  STATUE_PRESENCE_ELEVE: { name: 'students-classes-view' },
  CONVOCATION: { name: 'students-classes-view' },
  ENTREVUE_DEMANDE: { name: 'chat-view' },
  ENTREVUE_ACCEPTEE: { name: 'interview-view' },
  ENTREVUE_REFUSEE: { name: 'interview-view' },
  ANNONCE: { name: 'annoncements-classes-view' },
  ANNONCE_PROF: { name: 'annoncements-classes-view' },
  BULLETIN_DISPONIBLE: { name: 'students-classes-view' },
  EVENT: { name: 'schedule-view' },
}

const openNotification = async (item) => {
  if (!item.is_read) {
    try {
      await axios.patch(`/api/Notification/${item.id}/`, { is_read: true })
      await notificationStore.getNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  if (item.type === 'ABSENCE_RETARD_PROF') return

  if (item.type === 'MESSAGE' && item.discussion_id) {
    router.push({ name: 'chat-view', query: { discussion_id: item.discussion_id } })
    return
  }

  const route = redirectMap[item.type]
  if (route) router.push(route)
}
</script>

<style lang="scss" scoped></style>

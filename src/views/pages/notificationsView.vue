<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full px-6">
      <div class="flex gap-[10px] capitalize">
        <span class="pixa-title-2 flex-1 leading-loose">
          {{ t('translation.notifications') }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-auto" @scroll="onScroll">
        <div class="h-fit pb-6 flex flex-col gap-1.5 px-6">
          <itemData v-for="not in useNotif.notificationsList" :key="not.id" :item="not" />

          <div v-if="useNotif.loadingMore" class="flex justify-center py-3">
            <span class="loading loading-spinner loading-sm"></span>
          </div>
        </div>
      </div>
    </div>

    <delete-modal @deleteItem="
      async (id) => {
        try {
          await axios.delete(`/api/Notification/${id}/`)
          await useNotif.getNotifications()
          Object.assign(useWidget.deleteModal, {
            id: null,
            designation: null,
            open: false,
          })
        } catch (error) {
          console.error(error)
          useWidget.addToast({
            msg: error.message,
            color: 'red',
          })
        }
      }
    " />

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import itemData from '@/components/notifications/itemData.vue';
import { onMounted, ref } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import { useNotificationBadge } from '@/stores/notifications';
import deleteModal from '@/components/commun/deleteModal.vue';
import axios from 'axios';

const { t } = useI18n()
const loading = ref(true)
const useWidget = useWidgetStore()
const useNotif = useNotificationBadge()

const onScroll = async (e) => {
  const el = e.target
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    await useNotif.loadNextPage()
  }
}

onMounted(async () => {
  await useNotif.getNotifications()
  loading.value = false
})
</script>

<style lang="scss" scoped></style>

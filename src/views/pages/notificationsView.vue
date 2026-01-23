<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full px-6">
      <div class=" flex  gap-[10px] capitalize">

        <!---->
        <span class="pixa-title-2 flex-1 leading-loose">
          {{ t('translation.notifications') }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">

      <div class="h-full overflow-auto">
        <div class="h-fit pb-6 flex flex-col gap-1.5 px-6">
          <itemData v-for="not in useNotif.notifications" :key="not.id" :item="not" />


        </div>
      </div>
    </div>

  </div>

</template>

<script setup>
import { useI18n } from 'vue-i18n';
import itemData from '@/components/notifications/itemData.vue';
import { onMounted, ref } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import { format } from 'date-fns';
import { useNotificationBadge } from '@/stores/notifications';

const { t } = useI18n()
const loading = ref(true)
const useWidget = useWidgetStore()
const useNotif = useNotificationBadge()

onMounted(async () => {
  await useNotif.getNotifications()
  // console.log(notifications.value);

  loading.value = false
})
</script>

<style lang="scss" scoped></style>

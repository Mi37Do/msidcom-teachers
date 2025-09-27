<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full px-6">
      <div class=" flex  gap-[10px] capitalize">

        <!---->
        <span class="pixa-title-2 flex-1 leading-loose">
          notifications
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">

      <div class="h-full overflow-auto">
        <div class="h-fit pb-6 flex flex-col gap-1.5 px-6">
          <itemData v-for="not in useWidget.notifications" :key="not.id" :item="not" />



          <!--
          <button class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
              <percent class="w-8 fill-slate-700" />
            </div>
            <span class="pixa-title-3 truncate">
              {{ t('translation.programAdvance') }}</span>
          </button>
          <button class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
              <Megaphone class="w-8 fill-slate-700" />
            </div>
            <span class="pixa-title-3 truncate">
              {{ t('translation.annoncements') }}</span>
          </button>
          <button class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
              <FileAlt class="w-8 fill-slate-700" />
            </div>
            <span class="pixa-title-3 truncate">
              {{ t('translation.summons') }}</span>
          </button>
          <button class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
              <Note class="w-8 fill-slate-700" />
            </div>
            <span class="pixa-title-3 truncate">
              {{ t('translation.enteringNotes') }}</span>
          </button>
          <button class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
              <user class="w-8 fill-slate-700" />
            </div>
            <span class="pixa-title-3 truncate">
              {{ t('translation.studentPerProfile') }}</span>
          </button>-->


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

const { t } = useI18n()
const loading = ref(true)
const useWidget = useWidgetStore()

onMounted(async () => {
  await useWidget.getNotifications()

  loading.value = false
})
</script>

<style lang="scss" scoped></style>

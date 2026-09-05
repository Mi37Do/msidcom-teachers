<template>
  <div class="w-full h-full overflow-hidden flex flex-col pt-6">
    <div class="w-full flex items-center justify-between px-6">
      <div class="w-fit rounded-xl flex gap-1 p-1 pixa-border">
        <router-link :to="{ name: 'schedule-view' }"
          :class="route.name === 'schedule-view' ? 'btn-primary' : 'btn-ghost'"
          class="btn btn-sm pixa-btn-navigation relative">
          <span v-if="scheduleCount" class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute -top-1 -right-1 rounded-full text-xs text-white flex items-center justify-center z-10">{{ scheduleCount > 99 ? '99+' : scheduleCount }}</span>
          {{
            t('translation.events')
          }}</router-link>
        <router-link :to="{ name: 'exams-annoncements-view' }"
          :class="route.name === 'exams-annoncements-view' ? ' btn-primary' : 'btn-ghost'"
          class="btn btn-sm pixa-btn-navigation relative">
          <span v-if="annoncesCount" class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute -top-1 -right-1 rounded-full text-xs text-white flex items-center justify-center z-10">{{ annoncesCount > 99 ? '99+' : annoncesCount }}</span>
          {{
            t('translation.examsAnnoncements')
          }}</router-link>
      </div>
    </div>

    <div class="relative flex-1 overflow-hidden">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useNotificationBadge } from '@/stores/notifications';

const { t } = useI18n()
const route = useRoute()
const useNotif = useNotificationBadge()

const scheduleCount = computed(() => useNotif.unreadCountFor(['EVENT']))
const annoncesCount = computed(() => useNotif.unreadCountFor(['ANNONCE', 'ANNONCE_PROF']))
</script>

<style lang="scss" scoped></style>

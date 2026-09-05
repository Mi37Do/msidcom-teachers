<template>
  <div class="w-full h-full overflow-hidden flex flex-col pt-6">
    <div class="w-full flex items-center justify-between px-6">
      <nav class="w-fit rounded-xl flex gap-1 p-1 pixa-border">
        <router-link :to="{ name: 'chats-panel' }"
          class="btn btn-sm pixa-btn-navigation btn-ghost relative">
          <span v-if="messagesCount" class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute -top-1 -right-1 rounded-full text-xs text-white flex items-center justify-center z-10">{{ messagesCount > 99 ? '99+' : messagesCount }}</span>
          {{ t('translation.messaging') }}</router-link>
        <router-link :to="{ name: 'interview-view' }" class="btn btn-sm pixa-btn-navigation btn-ghost relative">
          <span v-if="interviewsCount" class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute -top-1 -right-1 rounded-full text-xs text-white flex items-center justify-center z-10">{{ interviewsCount > 99 ? '99+' : interviewsCount }}</span>
          {{ t('translation.scheduledInterview') }}</router-link>
      </nav>
    </div>

    <div class="relative flex-1 overflow-hidden">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotificationBadge } from '@/stores/notifications';

const { t } = useI18n()
const useNotif = useNotificationBadge()

const messagesCount = computed(() => useNotif.unreadCountFor(['MESSAGE']))
const interviewsCount = computed(() =>
  useNotif.unreadCountFor(['ENTREVUE_DEMANDE', 'ENTREVUE_ACCEPTEE', 'ENTREVUE_REFUSEE']),
)
</script>


<style lang="scss" scoped>
nav {
  a {
    color: #313638;
    fill: #313638;
    font-weight: 400;
    text-transform: capitalize;

    &.router-link-exact-active {
      background-color: #475569;
      color: #fff;
      fill: #fff;

    }

    &.router-link-active {
      background: #49c5b1;
      color: #fff;
      fill: #fff;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease-out;
}
</style>

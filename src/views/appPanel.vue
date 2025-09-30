<template>
  <div class="w-full h-screen bg-[#F5F5F5] flex flex-col">
    <div class="w-full h-28 pt-10  bg-primary-2/30 p-3 flex items-center">
      <img src="@/assets/pics/inlineLogo.png" class="w-40" alt="">

      <div class="flex gap-3 items-center ml-auto">
        <router-link :to="{ name: 'notifications-panel' }"
          class="btn btn-sm w-[44px] h-[44px] bg-transparent shadow-none  p-0 relative">
          <span class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute top-1 right-1.5 rounded-full text-xs text-white">{{
            unreadCount }}</span>
          <BellIcon class="w-[30px] h-[30px]" />
        </router-link>
        <div class="w-12 h-12 bg-secondary-2 rounded-full p-0.5 relative flex items-center justify-center">
          <router-link :to="{ name: 'profile-panel' }" class="w-11 h-11 absolute z-10"></router-link>
          <img v-if="useWidget.authUser.
            userDetail.image" :src="useWidget.authUser.
              userDetail.image" class="w-full h-full object-cover rounded-full" alt="">

          <span v-else class="text-white text-lg font-semibold mb-0.5">{{ useWidget.authUser.
            userDetail.first_name[0] }}{{ useWidget.authUser.
              userDetail.last_name[0] }}</span>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <router-view></router-view>
    </div>
    <nav class="w-full h-16 bg-white border-t border-border-color grid grid-cols-4 py-1.5 px-6 gap-3">
      <router-link :to="{ name: 'classes-panel' }" class="btn m-auto w-full btn-ghost">
        <ruler class="w-5" />
      </router-link>
      <router-link :to="{ name: 'calendar-panel' }" class="btn m-auto w-full btn-ghost">
        <calendar class="w-5" />
      </router-link>
      <router-link :to="{ name: 'events-panel' }" class="btn m-auto w-full btn-ghost">
        <schedule class="w-5" />
      </router-link>
      <router-link :to="{ name: 'messages-panel' }" class="btn m-auto w-full btn-ghost">
        <comments class="w-5" />
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import calendar from '@/assets/icons/calendar.vue';
import ruler from '@/assets/icons/ruler.vue';
import schedule from '@/assets/icons/schedule.vue';
import comments from '@/assets/icons/comments.vue';
import { onMounted, onUnmounted } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import BellIcon from '@/assets/icons/bellIcon.vue';
import { useNotificationBadge } from '@/stores/notifications';

const useWidget = useWidgetStore()
const { initialize,
  startPolling,
  stopPolling,
  markAsRead,
  unreadCount,
  notifications } = useNotificationBadge()
let pollingInterval = null
onMounted(async () => {
  await initialize()
  pollingInterval = startPolling(30000)
  /**
  setInterval(async () => {
    await getNotifications()
  }, 10000)*/// 60000
})

const handleNotificationInApp = async (notification) => {
  await markAsRead([notification.id])

  // Navigate based on type
  if (notification.type === 'ENTREVUE_DEMANDE' && notification.entrevue_id) {
    //   router.push(`/entrevues/${notification.entrevue_id}`)
  }
}

onUnmounted(() => {
  stopPolling(pollingInterval)
})

</script>


<style lang="scss" scoped>
nav {
  a {
    color: #313638;
    fill: #313638;
    font-weight: 500;
    text-transform: capitalize;

    &.router-link-exact-active {
      background-color: #475569;
      color: #fff;
      fill: #fff;

    }

    &.router-link-active {
      background: #CEEE5E;
      color: #313638;
      fill: #313638;
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

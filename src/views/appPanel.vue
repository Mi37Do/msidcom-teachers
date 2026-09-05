<template>
  <div class="w-full h-screen flex flex-col ">
    <div class="flex h-fit pt-safe-top bg-[#e9f3c7]">
      <div class="w-full  h-fit p-3 flex items-center">

        <div class="flex-1">
          <img src="@/assets/pics/inlineLogo.png" class="w-40" alt="">
        </div>


        <div class="flex gap-3 items-center ml-auto">
          <router-link :to="{ name: 'notifications-panel' }"
            class="btn btn-sm w-[44px] h-[44px] bg-transparent shadow-none  p-0 relative">
            <span v-if="useNotif.unreadCount > 0"
              class="w-[1.125rem] h-[1.125rem] bg-red-500 absolute top-1 right-1.5 rounded-full text-xs text-white flex items-center justify-center">{{
                useNotif.unreadCount > 99 ? '99+' : useNotif.unreadCount }}</span>
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
    </div>

    <div class="flex-1 overflow-hidden  bg-[#F5F5F5]">
      <router-view></router-view>
    </div>

    <div class="flex h-fit bg-white   pb-safe-bottom">

      <nav class="w-full h-fit border-t border-border-color grid grid-cols-4 py-1.5 px-6 gap-3">
        <router-link :to="{ name: 'classes-panel' }" class="btn m-auto w-full btn-ghost relative">
          <ruler class="w-5" />
          <span v-if="useNotif.studentsUnreadCount > 0" class="nav-badge">{{
            useNotif.studentsUnreadCount > 99 ? '99+' : useNotif.studentsUnreadCount }}</span>
        </router-link>
        <router-link :to="{ name: 'calendar-panel' }" class="btn m-auto w-full btn-ghost relative">
          <calendar class="w-5" />
          <span v-if="useNotif.calendarUnreadCount > 0" class="nav-badge">{{
            useNotif.calendarUnreadCount > 99 ? '99+' : useNotif.calendarUnreadCount }}</span>
        </router-link>
        <router-link :to="{ name: 'events-panel' }" class="btn m-auto w-full btn-ghost relative">
          <schedule class="w-5" />
          <span v-if="useNotif.eventsUnreadCount > 0" class="nav-badge">{{
            useNotif.eventsUnreadCount > 99 ? '99+' : useNotif.eventsUnreadCount }}</span>
        </router-link>
        <router-link :to="{ name: 'messages-panel' }" class="btn m-auto w-full btn-ghost relative">
          <comments class="w-5" />
          <span v-if="useNotif.messagesUnreadCount > 0" class="nav-badge">{{
            useNotif.messagesUnreadCount > 99 ? '99+' : useNotif.messagesUnreadCount }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import ruler from '@/assets/icons/ruler.vue';
import schedule from '@/assets/icons/schedule.vue';
import calendar from '@/assets/icons/calendar.vue';
import comments from '@/assets/icons/comments.vue';
import { onMounted, watch } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import BellIcon from '@/assets/icons/bellIcon.vue';
import { useNotificationBadge } from '@/stores/notifications';
import { useFirebaseMessaging } from '@/composables/useFirebaseMessaging';
import { useSafeArea } from '@/composables/useSafeArea';
import { useRouter } from 'vue-router';

useSafeArea();
const { fcmToken, notification, error, attachMessagingListeners } = useFirebaseMessaging();
const useWidget = useWidgetStore();
const useNotif = useNotificationBadge();
const router = useRouter();

onMounted(async () => {
  console.log('App mounted, initializing...');

  await useNotif.initialize();

  // Registration happens once, right after login. Here we only re-attach the
  // push listeners for an already registered device — no permission prompt and
  // no /device/register/ call unless the FCM token actually rotated.
  await attachMessagingListeners();
});

// Watch for new push notifications
watch(notification, async (newNotification) => {
  if (newNotification) {
    console.log('New push notification received:', newNotification);

    // Refresh notification badge count using non-paginated endpoint
    await useNotif.initializeBadge();

    // Let the view the user is currently on refetch its own data
    useNotif.pushReceived(newNotification.data);

    // Handle navigation if notification contains action data
    if (newNotification.data) {
      const { type, entrevue_id, discussion_id, annonce_id } = newNotification.data;

      // Optionally navigate or show in-app notification
      // You can add a toast/alert here if needed
    }

    // Clear notification reference after handling
    setTimeout(() => {
      notification.value = null;
    }, 5000);
  }
});

// Watch for FCM errors
watch(error, (newError) => {
  if (newError) {
    console.error('FCM Error:', newError);
  }
});

</script>


<style lang="scss" scoped>
.nav-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  border-radius: 9999px;
  background-color: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

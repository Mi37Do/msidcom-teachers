<template>
  <div class="w-full h-screen bg-[#F5F5F5] flex flex-col">
    <div class="w-full h-20 bg-primary-2/30 p-3 flex items-center">
      <img src="@/assets/pics/inlineLogo.png" class="w-40" alt="">

      <div class="flex gap-3 items-center ml-auto">
        <button class="btn btn-sm w-[44px] h-[44px] bg-transparent shadow-none  p-0">
          <BellIcon class="w-[30px] h-[30px]" />
        </button>
        <div class="w-12 h-12 bg-secondary-2 rounded-full p-0.5 relative">
          <router-link :to="{ name: 'profile-panel' }" class="w-11 h-11 absolute z-10"></router-link>
          <img :src="useWidget.authUser.
            userDetail.image" class="w-full h-full object-cover rounded-full" alt="">
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <router-view></router-view>
    </div>
    <nav class="w-full h-20 bg-white border-t border-border-color grid grid-cols-4 py-3 px-6 gap-3">
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
import { onMounted } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import BellIcon from '@/assets/icons/bellIcon.vue';

const useWidget = useWidgetStore()

onMounted(() => {
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

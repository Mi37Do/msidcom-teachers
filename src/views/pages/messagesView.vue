<template>
  <div class="w-full h-full overflow-hidden flex flex-col pt-6">
    <div class="w-full flex items-center justify-between px-6">
      <nav class="w-fit rounded-xl flex gap-1 p-1 pixa-border">
        <router-link :to="{ name: 'chats-panel' }"
          class="btn btn-sm pixa-btn-navigation btn-ghost">messagerie</router-link>
        <router-link :to="{ name: 'interview-view' }" class="btn btn-sm pixa-btn-navigation btn-ghost">entrevue
          programmé</router-link>
      </nav>
    </div>

    <div class="relative flex-1 overflow-hidden">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n()
const route = useRoute()
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

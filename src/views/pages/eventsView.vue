<template>
  <div class="w-full h-full overflow-hidden flex flex-col pt-6">
    <div class="w-full flex items-center justify-between px-6">
      <div class="w-fit rounded-xl flex gap-1 p-1 pixa-border">
        <router-link :to="{ name: 'schedule-view' }"
          :class="route.name === 'schedule-view' ? 'btn-primary' : 'btn-ghost'"
          class="btn btn-sm pixa-btn-navigation">{{
            t('translation.events')
          }}</router-link>
        <router-link :to="{ name: 'exams-annoncements-view' }"
          :class="route.name === 'exams-annoncements-view' ? ' btn-primary' : 'btn-ghost'"
          class="btn btn-sm pixa-btn-navigation">{{
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
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n()
const route = useRoute()
</script>

<style lang="scss" scoped></style>

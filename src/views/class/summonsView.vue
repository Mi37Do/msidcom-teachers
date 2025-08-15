<template>
  <div class="w-full h-full flex flex-col gap-3 pb-3 px-6">

    <div class="h-[39px] grid grid-cols-2 gap-[5px] w-fit">

      <router-link :to="{ name: 'add-summon-view' }"
        :class="route.name === 'add-summon-view' ? 'bg-secondary-2/10 text-secondary-2 border-secondary-2' : 'bg-trensparent border-border-color-full'"
        class="px-[16px] py-[10px] h-full capitalize border-b cursor-pointer text-center">

        <span> {{ t('translation.summons') }}</span>
      </router-link>

      <router-link :to="{ name: 'historique-summon-view' }"
        :class="route.name === 'historique-summon-view' ? 'bg-secondary-2/10 text-secondary-2 border-secondary-2' : 'bg-trensparent border-border-color-full'"
        class="px-[16px] py-[10px] h-full capitalize border-b cursor-pointer text-center">

        <span> {{ t('translation.historique') }}</span>
      </router-link>
    </div>

    <div class="flex-1 overflow-hidden">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from "vue-router";
const { t } = useI18n()
const route = useRoute()


</script>

<style lang="scss" scoped></style>

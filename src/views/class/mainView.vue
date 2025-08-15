<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="h-full overflow-auto">
    <div class="h-fit pb-6 flex flex-col gap-1.5 px-6">

      <router-link :to="{ name: 'abscences-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <stop-watch class="w-8" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.abscences') }}</span>
      </router-link>
      <router-link :to="{ name: 'program-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <percent class="w-8 fill-slate-700" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.programAdvance') }}</span>
      </router-link>
      <router-link :to="{ name: 'annoncements-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <Megaphone class="w-8 fill-slate-700" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.annoncements') }}</span>
      </router-link>
      <router-link :to="{ name: 'summons-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <FileAlt class="w-8 fill-slate-700" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.summons') }}</span>
      </router-link>
      <router-link :to="{ name: 'notes-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <Note class="w-8 fill-slate-700" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.enteringNotes') }}</span>
      </router-link>
      <router-link :to="{ name: 'students-classes-view' }"
        class="h-20 bg-white border border-border-color rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center">
          <user class="w-8 fill-slate-700" />
        </div>
        <span class="pixa-title-3 truncate">
          {{ t('translation.studentPerProfile') }}</span>
      </router-link>


    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import stopWatch from '@/assets/icons/stopWatch.vue';
import percent from '@/assets/icons/percent.vue';
import Megaphone from '@/assets/icons/megaphone.vue';
import FileAlt from '@/assets/icons/fileAlt.vue';
import Note from '@/assets/icons/note.vue';
import user from '@/assets/icons/user.vue';
import { onMounted, ref } from 'vue';

const { t } = useI18n()
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 300)
})
</script>

<style lang="scss" scoped></style>

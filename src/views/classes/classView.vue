<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full px-6">
      <router-link :to="{ name: route.name === 'main-classes-view' ? 'list-classes-view' : 'main-classes-view' }"
        class=" flex  gap-[10px] capitalize">
        <div
          class="w-[32px] h-[32px] bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center">
          <arrow-icon :class="useWidget.userLanguage === 'ar' ? '' : '-rotate-180'"
            class="w-[24px] h-[24px]  fill-primary" />
        </div>
        <!---->
        <span class="pixa-title-2 flex-1 leading-loose">
          {{ t('translation.class') + ' : ' }}
          <span class="text-primary-3">{{ currentClass
            }}
          </span><span v-if="route.meta.section"> / {{ t('translation.' + route.meta.section) }}</span>
        </span>
      </router-link>
    </div>

    <div class="flex-1 overflow-hidden">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/rooms';
import { useSubjectStore } from '@/stores/subjects';
import { useWidgetStore } from '@/stores/widget';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import arrowIcon from '@/assets/icons/arrowIcon.vue';

const loading = ref(true)
const useRoom = useRoomStore()
const useWidget = useWidgetStore()
const useSubject = useSubjectStore()
const { t } = useI18n()
const route = useRoute()
const currentClass = ref('')

onMounted(async () => {
  try {
    currentClass.value = localStorage.getItem('current_class')
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  localStorage.removeItem('current_class')
  localStorage.removeItem('current_specialite')
  loading.value = true
})
</script>

<style lang="scss" scoped></style>

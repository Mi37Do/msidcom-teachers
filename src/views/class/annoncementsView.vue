<template>

  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full px-6">
    <div class="w-full h-full flex flex-col gap-3">

      <div class="w-full flex  h-fit items-center justify-end gap-4">

        <button @click="
          Object.assign(useWidget.addEditAnnoncement,
            {
              add: true,
              open: true,
            })
          " class="btn btn-sm pixa-btn btn-primary">
          <plus class="w-5 h-5" />
          <span>{{ t('translation.create') }} {{ t('translation.annoncement') }}</span>
        </button>
      </div>
      <commun-no-data v-if="useEvent.filtredAnnoncements.length <= 0" />
      <div v-else class="w-full flex-1 flex items-center overflow-hidden">
        <div class="flex-1 h-full overflow-hidden">
          <div class="w-full h-full overflow-auto hidden-scrollbar">
            <div class="h-fit flex flex-col gap-3 pb-3">
              <itemData v-for="item in useEvent.filtredAnnoncements" :key="item.id" :item="item" />
            </div>
          </div>
        </div>
      </div>

      <add-edit-item :classe="route.params.id" />
    </div>
  </div>
</template>

<script setup>
import plus from '@/assets/icons/plus.vue';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEventStore } from '@/stores/events';
import { useWidgetStore } from '@/stores/widget';
import addEditItem from '@/components/annoncements/addEditItem.vue';
import itemData from '@/components/annoncements/itemData.vue'
import { useSubjectStore } from '@/stores/subjects';
import { useRoomStore } from '@/stores/rooms';
import communNoData from '@/components/commun/communNoData.vue';
import { useRoute } from 'vue-router';

const { t } = useI18n()
const loading = ref(true)
const useEvent = useEventStore()
const useWidget = useWidgetStore()
const useSubject = useSubjectStore()
const useRoom = useRoomStore()
const route = useRoute()

onMounted(async () => {
  try {
    await useEvent.getAnnoncements()
    console.log(useEvent.filtredAnnoncements);

    loading.value = false
  } catch (error) {
    console.error(error)
  }
})
</script>

<style lang="scss" scoped></style>

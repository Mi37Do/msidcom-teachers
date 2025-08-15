<template>
  <div class="w-full h-full flex flex-col gap-3 py-3 ">
    <span class="pixa-title-2 px-6">{{ t('translation.schedulerTime') }}</span>

    <div class="w-full h-8 relative overflow-x-auto hidden-scrollbar px-6">
      <div class="w-fit flex gap-1 h-full">
        <div v-for="i in week" :key="i" @click="selectedDay = i.id"
          :class="selectedDay === i.id ? 'bg-secondary-2/10 text-secondary-2 border-secondary-2' : 'bg-trensparent border-border-color-full'"
          class=" w-fit px-4 h-full uppercase flex items-center justify-center border-b truncate text-xs">
          {{ i.designation }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <span class="loading loading-spinner loading-sm"></span>
    </div>

    <div v-else class="flex-1 bg-white border-y border-border-color  overflow-hidden">
      <div v-if="useRoom.filtredContent.filter(i => i.cours_days === selectedDay).length > 0"
        class="w-full h-full overflow-y-auto py-3 px-6">
        <div class="h-fit flex flex-col">
          <calendar-item v-for="item in useRoom.filtredContent.filter(i => i.cours_days === selectedDay)" :item="item"
            :key="item.id" />
        </div>
      </div>
      <commun-no-data v-else />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useSubjectStore } from "@/stores/subjects";
import { useRoomStore } from "@/stores/rooms";
import calendarItem from "@/components/calendar/calendarItem.vue";
import { onMounted } from "vue";
import { useWidgetStore } from "@/stores/widget";
import { ref } from "vue";
import communNoData from "@/components/commun/communNoData.vue";

const useWidget = useWidgetStore()
const loading = ref(true)
const useRoom = useRoomStore()
const useSubject = useSubjectStore()
let week = ref([])
const { t } = useI18n()
const selectedDay = ref('Dimanche')

onMounted(async () => {
  try {
    await useRoom.getRooms()
    await useRoom.getContent(null, `&prof=${useWidget.authUser.userDetail.id}`)
    await useSubject.getSubjects()

    console.log(useRoom.filtredContent)

    week.value = useWidget.daysOfWeek.filter(item => item.id !== 'Vendredi' &&
      item.id !== 'Samedi')

    console.log(week.value);


    loading.value = false
  } catch (error) {
    console.error(error)

  }

})
</script>

<style lang="scss" scoped></style>

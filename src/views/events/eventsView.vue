<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-3 relative">

    <subscription-modal />

    <div class="h-14 flex items-center px-6">
      <span class="pixa-title-2">{{ t('translation.events') }}</span>
    </div>

    <div class="w-full h-96 flex flex-col bg-secondary-2/30">
      <div class="h-16 w-full  bg-secondary-2 flex items-center px-4 justify-center">
        <div class="flex justify-between items-center w-full">
          <div class="space-x-1 flex w-full h-full items-center">
            <button @click="navigate('prev')"
              class=" flex items-center justify-center border-2 w-10 h-10 rounded-full fill-white">
              <AngleIcon :class="[useWidget.userLanguage === 'ar' ? '-rotate-90' : 'rotate-90']" class="w-5 " />
            </button>
            <div class="flex-1 flex flex-col">

              <h2 class="text-2xl font-semibold text-white capitalize flex-1 text-center">
                {{ format(currentDate, 'MMMM', { locale: useWidget.userLanguage === 'ar' ? arDZ : fr }) }}
              </h2>
              <h2 class="font-medium text-white capitalize flex-1 text-center">
                {{ format(currentDate, 'yyyy', { locale: useWidget.userLanguage === 'ar' ? arDZ : fr }) }}
              </h2>
            </div>
            <button @click="navigate('next')"
              class=" flex items-center justify-center border-2 w-10 h-10 rounded-full fill-white">
              <AngleIcon :class="[useWidget.userLanguage === 'ar' ? 'rotate-90' : '-rotate-90']" class="w-5 " />
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="grid grid-cols-7 h-full gap-px">
          <div v-for="day in monthDays" :key="day.toString()" class="p-2 relative group flex flex-col" :class="{

            'text-gray-500': !isSameMonth(day, currentDate),
            '  ': isSameMonth(day, currentDate),
            '': isSameDay(day, new Date())
          }">
            <div class="flex justify-center items-center mb-1">
              <span class="font-medium text-lg">

                <span v-if="isSameDay(day, new Date())"
                  class="w-7 h-7 bg-white rounded-full inline-flex items-center justify-center">
                  {{ format(day, 'd') }}
                </span>
                <span v-else> {{ format(day, 'd') }}</span>
              </span>
            </div>
            <div class="flex-1 flex flex-wrap gap-1 justify-center items-end">
              <span v-for="event in getEventsForDate(day, useEvent.filtredEvents)" :key="event.id"
                class="w-1 h-1 bg-primary-3 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div :class="openEvents ? 'h-[70%]' : 'h-32'"
      class="w-full absolute bottom-0 bg-white rounded-t-xl border-x border-t border-border-color transition-all duration-400 ease-in-out">
      <div class="w-full h-full relative flex justify-center px-3 pt-3 ">
        <div @click="openEvents = !openEvents"
          class="w-10 h-10 bg-white absolute -top-3 rounded-full flex items-center justify-center">
          <AngleIcon class="w-5 rotate-180 mb-2" />
        </div>

        <div class="w-full h-full bg-white z-10 overflow-hidden">
          <div class="w-full h-full overflow-auto">
            <div class="h-fit flex flex-col gap-2 pb-3">
              <EventIem v-for="event in useEvent.filtredEvents" :key="event.id" :item="event"
                @openEvents="openEvents = true" :open="openEvents" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed, onMounted } from 'vue';
import subscriptionModal from '@/components/events/subscriptionModal.vue';
import { arDZ, fr } from 'date-fns/locale'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addWeeks,
  subWeeks,
} from 'date-fns';
import AngleIcon from '@/assets/icons/angleIcon.vue';
import { useEventStore } from '@/stores/events';
import EventIem from '@/components/events/eventIem.vue';
import { useWidgetStore } from '@/stores/widget';


const currentDate = ref(new Date())
const loading = ref(true)
const useEvent = useEventStore()
const view = ref('month')
const { t } = useI18n()
const useWidget = useWidgetStore()
const openEvents = ref(false)

const navigate = (direction) => {
  if (view.value === 'month') {
    currentDate.value = direction === 'prev'
      ? subMonths(currentDate.value, 1)
      : addMonths(currentDate.value, 1);
  } else {
    currentDate.value = direction === 'prev'
      ? subWeeks(currentDate.value, 1)
      : addWeeks(currentDate.value, 1);
  }
};
const monthDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(monthStart);
  const start = startOfWeek(monthStart, { weekStartsOn: 0 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
});

const getEventsForDate = (date, events) => {
  return events.filter(event =>
    isSameDay(event.date_event, format(date, 'yyyy-MM-dd'))
  );
};


onMounted(async () => {
  try {
    await useEvent.getEvents(null, `concernee=Prof`)
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})
</script>

<style lang="scss" scoped></style>

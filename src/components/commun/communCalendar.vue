<template>
  <div class="w-full h-full flex flex-col gap-3 mx-auto">
    <!-- Controls -->
    <div class="flex justify-between items-center">
      <div class="space-x-1 flex">
        <h2 class="text-2xl font-semibold text-gray-800 capitalize min-w-40">
          {{ format(currentDate, 'MMMM yyyy', { locale: fr }) }}
        </h2>
        <button @click="navigate('prev')"
          class=" bg-gray-100 hover:bg-gray-200 btn btn-sm btn-square pixa-btn-nofloat ">
          <AngleIcon class="w-5 rotate-90" />
        </button>
        <button @click="navigate('next')" class=" bg-gray-100 hover:bg-gray-200 btn btn-sm btn-square pixa-btn-nofloat">
          <AngleIcon class="w-5 -rotate-90" />
        </button>
      </div>
      <div class="space-x-2 flex">

        <commun-dropdown :list="timeTypes" :selected="view" class="capitalize min-w-40" @on-selected-item="(id) => {
          view = id
          setView(id)
        }">

          <template #prefix>
            <div class="flex items-center gap-[10px]">
              <calendar class="w-[20px]" />
            </div>
          </template>

        </commun-dropdown>

        <commun-dropdown :list="types" :selected="selectedType" class="capitalize min-w-72" @on-selected-item="(id) => {
          selectedType = id
          if (id === 'Tout') {
            useEvent.filtredEvents = useEvent.events
          } else {

            useEvent.filtredEvents = useEvent.events.filter(i => i.type_event === id)
          }
        }">

          <template #prefix>
            <div class="flex items-center gap-[10px]">
              <filter-icon class="w-[24px]" />
              <!-- -->
              <span class="capitalize"> {{ t('translation.filterBy') }} {{ t('translation.type') }}</span>
            </div>
          </template>

        </commun-dropdown>
      </div>
    </div>



    <div class="w-full h-10 bg-primary-3/10 rounded-lg border border-border-color grid grid-cols-7">
      <span v-for="(day, index) in useWidget.daysOfWeek" :key="day.id"
        :class="index < 6 ? 'border-r border-border-color' : ''" class="w-full h-full px-3 flex items-center">{{
          day.designation
        }} </span>
    </div>

    <!-- Calendar Grid -->
    <div class="border rounded-lg overflow-hidden shadow-sm flex-1">
      <div v-if="view === 'month'" class="grid grid-cols-7 h-full gap-px bg-gray-200">
        <div v-for="day in monthDays" :key="day.toString()" class="min-h-20 p-2 relative group flex flex-col" :class="{

          'text-gray-400 bg-slate-100': !isSameMonth(day, currentDate),
          ' bg-white ': isSameMonth(day, currentDate),
          'bg-blue-50': isSameDay(day, new Date())
        }">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium">

              <span v-if="isSameDay(day, new Date())"
                class="w-7 h-5 bg-primary-3/30 rounded-full inline-flex items-center justify-center">
                {{ format(day, 'd') }}
              </span>
              <span v-else> {{ format(day, 'd') }}</span>
            </span>
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="w-full h-full overflow-auto hidden-scrollbar">
              <div class="w-full h-fit flex flex-col">
                <calendar-item v-for="event in getEventsForDate(day)" :key="event.id" draggable="true"
                  @dragstart="dragStart(event)" :event="event" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-if="view === 'week'" class="grid h-full grid-cols-7 gap-px bg-gray-200">
        <div v-for="day in weekDays" :key="day.toString()" @dragover.prevent="dragOver" @drop="dropEvent(day)"
          class="min-h-full bg-white p-2" :class="{
            'bg-blue-50': isSameDay(day, new Date())
          }">
          <div class="font-medium mb-1">
            {{ format(day, 'd') }}
          </div>

          <calendar-item v-for="event in getEventsForDate(day)" :key="event.id" draggable="true"
            @dragstart="dragStart(event)" :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fr } from 'date-fns/locale'
import communDropdown from './communDropdown.vue';
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
import { useWidgetStore } from '@/stores/widget';
import calendar from '@/assets/icons/calendar.vue';
import AngleIcon from '@/assets/icons/angleIcon.vue';
import filterIcon from '@/assets/icons/filterIcon.vue';
import { useI18n } from 'vue-i18n';
import calendarItem from '../calendar/calendarItem.vue';
import { useEventStore } from '@/stores/events';

// Reactive state
const props = defineProps(['events'])
const useEvent = useEventStore()
const currentDate = ref(new Date());
const view = ref('month');
const useWidget = useWidgetStore()
const draggedEvent = ref(null);
const { t } = useI18n()
const emits = defineEmits(['currentDate'])

onMounted(() => {
  emits('currentDate', currentDate.value)
})


const timeTypes = ref(
  [
    {
      id: 'month',
      designation: 'Mois'
    }, {
      id: 'week',
      designation: 'Semaine'
    }
  ]
)

const types = ref([
  { id: 'Tout', designation: 'Tout' },
  { id: 'Fete', designation: 'Fête' },
  { id: 'Reunion', designation: 'Reunion' },
  { id: 'Festival', designation: 'Festival' },
  { id: 'Seminaire', designation: 'Seminaire' },
  { id: 'Autre', designation: 'Autre' },
])


const selectedType = ref('Tout')
// Date calculations
const monthDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(monthStart);
  const start = startOfWeek(monthStart, { weekStartsOn: 0 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
});

const weekDays = computed(() => {
  const start = startOfWeek(currentDate.value, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate.value, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
});

// Event handling
const getEventsForDate = (date) => {
  return props.events.filter(event =>
    isSameDay(event.date_event, format(date, 'yyyy-MM-dd'))
  );
};

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
  emits('currentDate', currentDate.value)
};

const setView = (newView) => {
  view.value = newView;
};

// Drag and drop
const dragStart = (event) => {
  draggedEvent.value = event;
};

const dragOver = (e) => {
  e.preventDefault();
};
/**
const dropEvent = (date) => {
  if (draggedEvent.value) {
    const eventIndex = props.events.findIndex(e => e.id === draggedEvent.value.id);
    props.events[eventIndex].date_event = date;
    draggedEvent.value = null;
  }
};*/
</script>

<style>
/* Add custom scrollbar if needed */
</style>

<template>

  <div class="w-full flex flex-col gap-4 h-full">
    <div class="flex-1 flex flex-col justify-center gap-3">
      <div class="flex justify-between items-center w-full">
        <div class="space-x-1 flex w-full h-full items-center">
          <button type="button" @click="navigate('prev')"
            class="flex items-center justify-center border-2 w-10 h-10 rounded-full">
            <angleIcon class="w-5 rotate-90" />
          </button>
          <div class="flex-1 flex flex-col">
            <h2 class="text-2xl font-semibold capitalize flex-1 text-center">
              {{ format(currentDate, 'MMMM yyyy', { locale: fr }) }}
            </h2>
          </div>
          <button type="button" @click="navigate('next')"
            class="flex items-center justify-center border-2 w-10 h-10 rounded-full">
            <angleIcon class="w-5 -rotate-90" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div v-for="day in weekdayNames" :key="day" class="text-center font-medium text-sm py-1">
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7  rounded-xl overflow-hidden">
        <div v-for="day in monthDays" :key="day.toString()" class="h-full relative group flex flex-col"
          @click="tempDate = day" :class="{
            'text-slate-300': !isSameMonth(day, currentDate),
            'bg-white': isSameMonth(day, tempDate),
            'bg-blue-50': isSameDay(day, new Date())
          }">
          <div class="flex justify-center items-center h-full">
            <span v-if="isSameDay(day, tempDate)"
              class="w-full aspect-square rounded-xl flex items-center justify-center bg-primary text-white font-semibold">
              {{ format(day, 'd') }}
            </span>
            <span class="w-full aspect-square flex items-center justify-center" v-else>
              {{ format(day, 'd') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <button type="button" @click="selectDate" class="btn btn-primary w-full">
      Sélectionnez la date
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useWidgetStore } from '@/stores/widget';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import angleIcon from '@/assets/icons/angleIcon.vue';
import { fr } from 'date-fns/locale'

const props = defineProps(['options'])
const emits = defineEmits(['onSelectDate'])
const tempDate = ref(new Date())
const useWidget = useWidgetStore()
const loading = ref(true)
const currentDate = ref(new Date())

/**
watch(() => props.options, () => {
  loading.value = true
  if (!props.options.load) setTimeout(() => {
    loading.value = false
  }, 100)
}, { deep: true })
*/
const weekdayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const monthDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(monthStart);
  const start = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday as first day
  const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

watch(() => props.options.date, (newDate) => {
  if (newDate) {
    tempDate.value = new Date(newDate);
    console.log('Temp date set to:', tempDate.value);
  } else {
    tempDate.value = null;
  }
}, { immediate: true });

const selectDate = () => {
  console.log('Selected date:', tempDate.value);
  if (tempDate.value) {
    // Format as YYYY-MM-DD
    emits('onSelectDate', tempDate.value);
  } else {
    emits('onSelectDate', null);
  }
  closeModal()
}

const closeModal = () => {
  useWidget.communCaledarModal = false
  tempDate.value = null
}


const navigate = (direction) => {
  currentDate.value = direction === 'prev'
    ? subMonths(currentDate.value, 1)
    : addMonths(currentDate.value, 1);
};
</script>

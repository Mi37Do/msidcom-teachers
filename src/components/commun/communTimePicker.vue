<template>
  <div class="flex flex-col gap-3 h-full">
    <div class="flex items-center gap-4 w-full justify-center flex-1" role="group" aria-label="Time picker">
      <PickerColumn :options="hourOptions" :selected="localHours" @increment="incrementHours"
        @decrement="decrementHours" aria-label="Hours" />
      <span class="text-xl font-bold" aria-hidden="true">:</span>
      <PickerColumn :options="minuteOptions" :selected="localMinutes" @increment="incrementMinutes"
        @decrement="decrementMinutes" aria-label="Minutes" />
    </div>

    <button type="button" @click="emit('hideTimePicker', {
      hours: localHours,
      minutes: localMinutes
    })" class="btn btn-primary">{{ t('translation.validate') }}</button>
  </div>

</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PickerColumn from './PickerColumn.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ hours: 0, minutes: 0 })
  }
});

const emit = defineEmits(['update:modelValue', 'hideTimePicker']);

// Constants
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MINUTE_STEP = 5;

// Format helpers
const formatTwoDigits = (val) => val.toString().padStart(2, '0');
const roundToNearest = (val, step) => Math.round(val / step) * step;

// Options
const hourOptions = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);
const minuteOptions = Array.from(
  { length: MINUTES_IN_HOUR / MINUTE_STEP },
  (_, i) => i * MINUTE_STEP
);

// Local state - always stored as numbers
const localHours = ref(0);
const localMinutes = ref(0);

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    localHours.value = typeof val.hours === 'string'
      ? parseInt(val.hours)
      : val.hours;

    localMinutes.value = typeof val.minutes === 'string'
      ? roundToNearest(parseInt(val.minutes), MINUTE_STEP)
      : roundToNearest(val.minutes, MINUTE_STEP);
  },
  { immediate: true }
);

const emitChange = () => {
  emit('update:modelValue', {
    hours: localHours.value,
    minutes: localMinutes.value
  });
};

// Time manipulation
const incrementHours = () => {
  localHours.value = (localHours.value + 1) % HOURS_IN_DAY;
  emitChange();
};

const decrementHours = () => {
  localHours.value = (localHours.value - 1 + HOURS_IN_DAY) % HOURS_IN_DAY;
  emitChange();
};

const incrementMinutes = () => {
  localMinutes.value = (localMinutes.value + MINUTE_STEP) % MINUTES_IN_HOUR;
  emitChange();
};

const decrementMinutes = () => {
  localMinutes.value = (localMinutes.value - MINUTE_STEP + MINUTES_IN_HOUR) % MINUTES_IN_HOUR;
  emitChange();
};
</script>

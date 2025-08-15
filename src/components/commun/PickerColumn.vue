<template>
  <div class="flex flex-col items-center h-60 w-14 relative" role="listbox" :aria-label="ariaLabel">
    <button aria-label="Increment" type="button"
      class="btn btn-ghost btn-square focus:outline-none focus:ring-2 focus:ring-primary" @click="$emit('increment')">
      <angle-icon class="w-5 h-5 rotate-180" />
    </button>

    <div class="flex-1 flex items-center justify-center relative overflow-hidden w-full">
      <div class="absolute grid grid-rows-3 gap-5 transition-transform duration-300 ease-in-out w-full">

        <span v-if="selected === options[0]" class="text-xl opacity-40 text-center">{{
          formatValue(options[options.length - 1])
          }}</span>
        <span v-else class="text-xl opacity-40 text-center">{{ formatValue(options[options.indexOf(selected) - 1])
          }}</span>
        <span class="w-full text-center" :class="'text-3xl font-semibold'
          ">
          {{ formatValue(selected) }}
        </span> <!---->
        <span v-if="selected === options[options.length - 1]" class="text-xl opacity-40 text-center">{{
          formatValue(options[0])
          }}</span>

        <span v-else class="text-xl opacity-40 text-center">{{ formatValue(options[options.indexOf(selected) + 1])
          }}</span>
      </div>
    </div>

    <button aria-label="Decrement" type="button"
      class="btn btn-ghost btn-square focus:outline-none focus:ring-2 focus:ring-primary" @click="$emit('decrement')">
      <angle-icon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import angleIcon from '@/assets/icons/angleIcon.vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  selected: {
    type: Number,
    required: true
  },
  ariaLabel: {
    type: String,
    default: ''
  }
});

console.log(props.options);

console.log(props.selected);

const formatValue = (val) => {
  // Add null check to prevent the error
  if (val === undefined || val === null) return '00';
  return val.toString().padStart(2, '0');
};
</script>

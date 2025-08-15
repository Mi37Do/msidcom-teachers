<template>
  <div :class="[
    item.color === 'red' ? ' border-error text-error' : ' border-emerald-500 text-emerald-500'
  ]" class="w-80 h-fit bg-white rounded-lg transition-all duration-200 p-2.5 flex-none border">
    {{ item.msg }}
    <!-- :class="[item.open ? 'translate-y-0' : '-tralate-y-24', item.entry ? 'translate-x-0' : '-translate-x-16']" -->
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';

const props = defineProps(['item'])
const useWidget = useWidgetStore()

setTimeout(() => {
  useWidget.toasts = useWidget.toasts.filter(item => item.id !== props.item.id)
}, 6000)

</script>

<style lang="scss" scoped></style>

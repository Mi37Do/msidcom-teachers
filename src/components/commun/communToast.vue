<template>
  <div :class="[
    item.color === 'red' ? ' border-error text-error' : ' border-emerald-500 text-emerald-600'
  ]" class="w-full max-w-80 h-fit bg-white rounded-lg shadow-lg transition-all duration-200 p-2.5 flex-none border pointer-events-auto auto-dir break-words"
    @click="fermer">
    {{ item.msg }}
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { useWidgetStore } from '@/stores/widget';

const props = defineProps(['item'])
const useWidget = useWidgetStore()

// Un appui ferme le message ; sinon il disparaît seul après 6 secondes
const fermer = () => {
  useWidget.toasts = useWidget.toasts.filter(item => item.id !== props.item.id)
}
const minuteur = setTimeout(fermer, 6000)
onBeforeUnmount(() => clearTimeout(minuteur))
</script>

<style lang="scss" scoped></style>

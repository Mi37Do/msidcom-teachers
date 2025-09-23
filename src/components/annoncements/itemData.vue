<template>
  <div class="w-full h-fit rounded-xl border border-border-color bg-white  p-4 flex flex-col gap-3 overflow-hidden">
    <div class="w-full flex gap-4 items-center">
      <span class="truncate font-medium text-[1.05rem] flex-1 capitalize">{{ item.designation }}</span>

      <div
        :class="item.type === 'Annonce' ? 'bg-warning/20 text-warning' : item.type === 'Devoir' ? 'bg-primary-3/20 text-primary-3' : 'bg-primary/20 text-primary'"
        class="h-6 w-20  rounded-full flex items-center justify-center text-xs  font-medium">{{
          item.type }}</div>
    </div>

    <span class=" font-medium">Posté le {{ format(item.created
      , 'dd/MM/yyyy - HH:mm') }}</span>

    <span>{{ item.description }}</span>
    <div
      class="px-2.5 py-1.5 w-fit text-primary bg-primary/20 rounded-md text-xs font-medium flex gap-1.5 items-center">
      <file-alt class="w-5 fill-primary" />
      Piéces jointe
    </div>
    <span v-if="item.date_limite" class=" font-medium text-error">Date limite {{ format(item.date_limite
      , 'dd/MM/yyyy') }}</span>
  </div>
</template>

<script setup>
import Trash from '@/assets/icons/trash.vue';
import { useWidgetStore } from '@/stores/widget';
import { format } from 'date-fns';
import fileAlt from '@/assets/icons/fileAlt.vue';

const props = defineProps(['item', 'classes'])
const useWidget = useWidgetStore()

</script>

<style lang="scss" scoped></style>

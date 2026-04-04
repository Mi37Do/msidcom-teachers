<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-3"
    :class="`grid gap-1.5 grid-cols-2`">
    <span class="my-auto truncate flex items-center gap-3">
      <div class=" flex items-center justify-center overflow-hidden">
        <slot name="studentCheckbox" />
      </div>
      <span class="font-medium truncate auto-dir">
        {{ item.prenom }} {{ item.nom }}</span>
    </span>


    <div class="w-full flex items-center justify-between">
      <span
        :class="item.present ? 'bg-[#00778B1A] text-[#00778B] fill-[#00778B]' : 'bg-[#EF60791A] text-[#EF6079] fill-[#EF6079]'"
        class="my-auto px-[12px] py-[6px]  flex w-fit rounded-r-full  justify-between font-medium min-w-20">
        <span>{{ item.present ? t('translation.present') : t('translation.absent') }}</span>
      </span>

      <button @click="() => {
        useStudent.focusedStudent = item
        useWidget.lateModal = true
      }"
        class="btn btn-sm btn-square text-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
        <no-time-warning class="w-4" />
      </button>
    </div>

  </div>
</template>

<script setup>
import checkIcon from '@/assets/icons/checkIcon.vue';
import { format } from 'date-fns';
import { ref, computed } from 'vue';
import { useRoomStore } from '@/stores/rooms';
import angleIcon from '@/assets/icons/angleIcon.vue';
import noTimeWarning from '@/assets/icons/noTimeWarning.vue';
const route = useRoute()
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import axios from 'axios';
import { useStudentStore } from '@/stores/students';
import { useRoute } from 'vue-router';
import { useWidgetStore } from '@/stores/widget';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const props = defineProps(['item'])
const selectedItem = ref(props.item ? props.item.groupe : null)
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
const emits = defineEmits(['loadData'])

const filters = computed(() => [
  {
    id: 'Présent',
    designation: t('translation.present')
  }, {
    id: 'Absent',
    designation: t('translation.absent')
  }
])

</script>

<style lang="scss" scoped></style>

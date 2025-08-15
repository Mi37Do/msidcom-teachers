<template>
  <div ref="rootElement" class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-3"
    :class="`grid gap-1.5 grid-cols-2`">
    <span class="my-auto truncate flex items-center gap-3">
      <div class=" flex items-center justify-center overflow-hidden">
        <slot name="studentCheckbox" />
      </div>
      <span class="font-medium truncate">
        {{ item.prenom }} {{ item.nom }}</span>
    </span>


    <div class="w-full flex items-center justify-between">
      <Listbox v-model="selectedItem">
        <div class="relative">
          <ListboxButton class="relative w-full flex items-center gap-[10px]">
            <span
              :class="item.present ? 'bg-[#00778B1A] text-[#00778B] fill-[#00778B]' : 'bg-[#EF60791A] text-[#EF6079] fill-[#EF6079]'"
              class="my-auto px-[12px] py-[6px]  flex w-fit rounded-r-full  justify-between font-medium min-w-20">
              <span>{{ item.present ? 'Présent' : 'Absent' }}</span>
              <angle-icon class="w-5" />
            </span>
          </ListboxButton>

          <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <ListboxOptions
              class="absolute z-10 max-h-32 mt-1 w-32 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" v-for="i in filters" :key="i.id" :value="i.designation"
                as="template" @click="async () => {
                  selectedItem = i.id
                  let response = await axios.patch(`/api/Eleve/${item.id}/`, {
                    present: selectedItem === 'Présent' ? true : false
                  })


                  item.present = selectedItem === 'Présent' ? true : false

                }">
                <li :class="[
                  active ? 'bg-primary/20 text-primary fill-primary' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]">
                  <span :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]">{{ i.designation }}</span>

                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <checkIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>

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
import comments from '@/assets/icons/comments.vue';
import checkIcon from '@/assets/icons/checkIcon.vue';
import { format } from 'date-fns';
import { ref } from 'vue';
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

const props = defineProps(['item'])
const selectedItem = ref(props.item ? props.item.groupe : null)
const useStudent = useStudentStore()
const useWidget = useWidgetStore()

const filters = ref([
  {
    id: 'Présent',
    designation: 'Présent'
  }, {
    id: 'Absent',
    designation: 'Absent'
  }
])
</script>

<style lang="scss" scoped></style>

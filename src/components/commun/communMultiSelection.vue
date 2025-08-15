<template>
  <div>
    <Listbox v-model="selectedPerson">
      <div class="relative mt-1">
        <ListboxButton class="relative w-full cursor-default rounded-lg pixa-input flex justify-between">
          <div class="flex-1 h-full pl-1 pr-8 overflow-hidden">
            <div class="w-full h-full overflow-x-auto hidden-scrollbar">
              <div class="w-fit flex gap-1 items-center h-full">
                <div class="py-1 px-2 bg-amber-500 w-fit text-white rounded-md flex gap-2 capitalize items-center">art
                  <times class="w-5 h-5 fill-white" />
                </div>
              </div>
            </div>
          </div>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <sort-icon class="h-5 w-5 fill-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            <ListboxOption v-slot="{ active, selected }" v-for="person in people" :key="person.name" :value="person"
              as="template">
              <div :class="[
                active ? 'bg-amber-100 text-amber-600' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]">
                <span :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]">{{ person.name }}</span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 fill-amber-600">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import times from '@/assets/icons/times.vue'

import sortIcon from '@/assets/icons/sortIcon.vue'
import CheckIcon from '@/assets/icons/checkIcon.vue'

const people = [
  { name: 'Wade Cooper' },
  { name: 'Arlene Mccoy' },
  { name: 'Devon Webb' },
  { name: 'Tom Cook' },
  { name: 'Tanya Fox' },
  { name: 'Hellen Schmidt' },
]
const selectedPerson = ref(people[0])
</script>

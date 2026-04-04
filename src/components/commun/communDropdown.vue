<template>
  <div>
    <Listbox v-model="selectedItem">
      <div class="relative" ref="triggerRef">
        <ListboxButton class="relative w-full commun-dropdown flex items-center gap-[10px]">
          <slot name="prefix"></slot>
          <span class="block truncate flex-1 text-start">
            {{ list.find(i => i.id === selectedItem) ? list.find(i => i.id === selectedItem).designation : 'N/A' }}
          </span>
          <span :class="useWidget.userLanguage === 'ar' ? 'left-0' : 'right-0'"
            class="pointer-events-none absolute inset-y-0 flex items-center pr-2">
            <angle-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <Teleport to="body">
            <ListboxOptions
              :style="dropdownStyle"
              class="fixed z-[9999] max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" v-for="item in list" :key="item.id" :value="item.id"
                as="template" @click="emits('onSelectedItem', item.id)">
                <li :class="[
                  active ? 'bg-primary/20 text-primary fill-primary' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]">
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ item.designation }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <checkIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </Teleport>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import angleIcon from '@/assets/icons/angleIcon.vue'
import checkIcon from '@/assets/icons/checkIcon.vue'
import { useWidgetStore } from '@/stores/widget'

const props = defineProps(['list', 'selected', 'top'])
const emits = defineEmits(['onSelectedItem'])
const useWidget = useWidgetStore()

const selectedItem = ref(props.selected)
const triggerRef = ref(null)

watch(() => props.selected, () => {
  selectedItem.value = props.selected
})

const dropdownStyle = computed(() => {
  if (!triggerRef.value) return {}
  const rect = triggerRef.value.getBoundingClientRect()
  return {
    top: props.top ? `${rect.top - 240}px` : `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
})
</script>

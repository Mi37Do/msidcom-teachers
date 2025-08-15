<template>
  <div>
    <Combobox v-model="selected">
      <div class="relative">
        <div class="relative w-full">
          <ComboboxInput autocomplete="off" :required="required"
            class="w-full pixa-input placeholder:capitalize ring-inset focus:ring-0 pl-4 pr-8"
            :displayValue="(item) => item.designation" @change="query = $event.target.value" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <angle-icon class="h-5 w-5 fill-slate-500" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
          @after-leave="query = ''">
          <ComboboxOptions :class="top ? 'bottom-12 ' : 'top-12'"
            class="absolute  max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
            <div v-if="filteredList.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700">
              Nothing found.
            </div>

            <ComboboxOption v-for="item in filteredList" as="template" :key="item.id" @click="selectItem(item.id)"
              @keypress.enter="selectItem(item.id)" :value="item" v-slot="{ selected, active }">
              <div class="relative cursor-default select-none py-2 pl-10 pr-4 w-full" :class="{
                'bg-primary/20 text-primary fill-primary': active,
                'text-gray-900': !active,
              }">
                <!---->
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ item.designation }}
                </span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <checkIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import checkIcon from '@/assets/icons/checkIcon.vue'
import angleIcon from '@/assets/icons/angleIcon.vue'

const props = defineProps(['list', 'required', 'selected', 'placehonder', 'top'])
const emits = defineEmits(['onSelectedItem'])
let query = ref('')
const selected = ref('')

onMounted(() => {
  if (props.selected) selected.value = props.list.find(item => item.id === props.selected)

})

watch(() => props.selected, () => {
  selected.value = props.selected ? props.list.find(item => item.id === props.selected) : ''
})

let filteredList = computed(() =>
  query.value === ''
    ? props.list
    : props.list.filter((item) =>
      item.designation
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    )
)

watch(() => selected.value, () => {
  emits('onSelectedItem', selected.value.id)
})

const selectItem = (id) => {
  selected.value = props.list.find(item => item.id === id)
  emits('onSelectedItem', id)
}

</script>

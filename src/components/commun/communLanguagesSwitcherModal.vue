<template>
  <TransitionRoot appear :show="useWidget.changeLanguage" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-sm min-h-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">

              <RadioGroup :model-value="selected">
                <RadioGroupLabel class="sr-only">Language</RadioGroupLabel>
                <div class="space-y-2">
                  <RadioGroupOption as="template" v-for="language in useWidget.languages" :key="language.desingation"
                    :value="language" v-slot="{ active, checked }" @click="useWidget.setLanguage(language.id)">
                    <div :class="[
                      active
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                        : '',
                      checked ? 'bg-sky-900/75 text-white ' : 'bg-white ',
                    ]" class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none">
                      <div class="flex w-full items-center justify-between">
                        <div class="flex items-center">
                          <div class="text-sm">
                            <RadioGroupLabel as="p" :class="checked ? 'text-white' : 'text-gray-900'"
                              class="font-medium">
                              {{ language.desingation }}
                            </RadioGroupLabel>
                            <RadioGroupDescription as="span" :class="checked ? 'text-sky-100' : 'text-gray-500'"
                              class="inline">
                            </RadioGroupDescription>
                          </div>
                        </div>
                        <div v-show="checked" class="shrink-0 text-white">
                          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.2" />
                            <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </DialogPanel>
          </TransitionChild>
        </div>


      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import { computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from '@headlessui/vue'

const useWidget = useWidgetStore()

const selected = computed(() => {
  return useWidget.languages.find(lang => lang.id === useWidget.userLanguage)
})
</script>

<style lang="scss" scoped></style>

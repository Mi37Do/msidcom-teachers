<template>
  <div :style="{ background: currentTheme.primary }" class="w-full  rounded-xl overflow-hidden flex ">
    <div class="w-3 h-full relative flex-none">
      <div :style="{ background: currentTheme.secondary }" class="w-full h-96  absolute inset-0"></div>
    </div>
    <div class="flex-1 overflow-hidden">
      <Disclosure v-slot="{ open }">
        <DisclosureButton @click="() => {
          emits('openEvents')
        }"
          class="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring  h-16 items-center">
          <div class="flex-1 h-full flex flex-col overflow-hidden">
            <span :style="{ color: currentTheme.secondary }" class="text-lg font-medium truncate capitalize">{{
              item.titre
              }} </span>

            <div class="w-full flex gap-3 font-medium">
              <span>le {{ item.date_event }} {{ t('translation.from') }} {{ item.from_time ?
                format(parse(item.from_time, 'HH:mm:ss', new Date()), 'HH:mm') : 'N/A' }}
                {{
                  t('translation.to') }} {{
                  item.to_time ?
                    format(parse(item.to_time, 'HH:mm:ss', new Date()), 'HH:mm') : 'N/A' }}</span>
              <!--
              <span> {{
                item.concernee }}</span>-->

            </div>
          </div>
          <angle-icon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-purple-500" />
        </DisclosureButton>
        <DisclosurePanel
          class="px-4 pb-2 pt-4 text-sm text-gray-500 flex flex-col gap-3 items-end overflow-hidden w-full">
          <div class="max-h-60 overflow-auto text-left w-full">
            <p class="w-full break-words">
              {{ item.description }}</p>
          </div>

          <button v-if="!item.sous_inscription" @click="() => {
            useEvent.focusedEvents = item
            useWidget.subscriptionModal = true
          }" :style="{ background: currentTheme.secondary }"
            class="btn btn-sm pixa-btn text-white border-0">s'inscrire</button>

        </DisclosurePanel>
      </Disclosure>
    </div>
  </div>
</template>

<script setup>
import angleIcon from '@/assets/icons/angleIcon.vue';
import { useEventStore } from '@/stores/events';
import { useWidgetStore } from '@/stores/widget';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { format, parse } from 'date-fns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps(['item'])
const emits = defineEmits(['openEvents'])
const useWidget = useWidgetStore()
const useEvent = useEventStore()
const { t } = useI18n()

const themes = [
  { id: 1, primary: '#D4E5FF', secondary: '#002D72' },
  { id: 2, primary: '#FFECC5', secondary: '#F1B434' },
  { id: 3, primary: '#E5DDFF', secondary: '#7E5EEE' },
  { id: 4, primary: '#FFBABE', secondary: '#EF6079' },
  { id: 5, primary: '#D0EDF2', secondary: '#00778B' },
];

const currentTheme = ref(themes[Math.floor(Math.random() * themes.length)]);
</script>

<style lang="scss" scoped></style>

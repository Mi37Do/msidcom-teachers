<template>
  <div :style="variablesCarte(couleur)" class="carte-pastel carte-fond w-full  rounded-xl overflow-hidden flex ">
    <div class="w-3 h-full relative flex-none">
      <div class="carte-accent-fond w-full h-96  absolute inset-0"></div>
    </div>
    <div class="flex-1 overflow-hidden">
      <Disclosure v-slot="{ open }">
        <DisclosureButton @click="() => {
          emits('openEvents')
        }"
          class="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring  h-16 items-center">
          <div class="flex-1 h-full flex flex-col overflow-hidden">
            <span class="carte-accent text-lg font-medium truncate capitalize">{{
              item.titre
              }} </span>

            <div class="w-full flex gap-3 font-medium">
              <span>{{ t('translation.onDate') }} {{ item.date_event ? format(parse(item.date_event, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') : t('translation.notApplicable') }} {{ t('translation.from') }} {{ item.from_time ?
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

          <button
            v-if="item.sous_inscription && (!item.Subscribed_details.subscribed_prof_details.find(i => i.prof_id === useWidget.authUser.userDetail.id))"
            @click="() => {
              useEvent.focusedEvents = item
              useWidget.subscriptionModal = true
            }"
            class="carte-accent-fond carte-bouton btn btn-sm pixa-btn text-white border-0">{{ t('translation.register') }}</button>
          <span
            v-if="item.sous_inscription && (item.Subscribed_details.subscribed_prof_details.find(i => i.prof_id === useWidget.authUser.userDetail.id))"
            class="font-semibold uppercase">{{ t('translation.alreadyRegistered') }}</span>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </div>
</template>

<script setup>
import { couleurCarteAuHasard, variablesCarte } from '@/utils/couleursCartes'
import angleIcon from '@/assets/icons/angleIcon.vue';
import { useEventStore } from '@/stores/events';
import { useWidgetStore } from '@/stores/widget';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { format, parse } from 'date-fns';
import { useI18n } from 'vue-i18n';

const props = defineProps(['item'])
const emits = defineEmits(['openEvents'])
const useWidget = useWidgetStore()
const useEvent = useEventStore()
const { t } = useI18n()


const couleur = couleurCarteAuHasard()
</script>

<style lang="scss" scoped></style>

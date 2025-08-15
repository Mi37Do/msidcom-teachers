<template>
  <TransitionRoot appear :show="useWidget.summonDetail" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
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
              class="w-full max-w-2xl min-h-60 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col ">

              <div class="w-full h-fit flex gap-3 items-center border-b border-secondary-2 pb-3">
                <span class="flex-1 pixa-title-3">Détaille De La Convocation</span>
                <times-square @click="closeModal" class="w-8 fill-slate-600" />
              </div>

              <span class="capitalize font-medium text-[18px] pt-3">élève concerné</span>
              <span class="text-secondary-2">{{ item.eleve_designations.eleve_designations_nom }} {{
                item.eleve_designations.eleve_designations_prenom }}</span>

              <span class="capitalize font-medium text-[18px] pt-3">motif De la convocation</span>
              <span class="text-secondary-2 w-full break-words max-h-32 overflow-auto"> {{ item.motif }}</span>

              <span class="capitalize font-medium text-[18px] pt-3">tuteur légal de l’élève</span>

              <div class="flex items-center gap-3 w-full mt-1.5">

                <div class="w-11 h-11 bg-[#F5F5F5] p-0.5 rounded-lg">
                  <img src="" alt="">
                </div>

                <span class="text-[18px]">{{ item.eleve_designations.eleve_parent_first_name }} {{
                  item.eleve_designations.eleve_parent_last_name }}</span>
              </div>

              <span class="mt-3">Signalé Le {{ format(item.date, 'dd-MM-yyyy HH:mm') }}</span>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import timesSquare from '@/assets/icons/timesSquare.vue';
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { format } from 'date-fns';

const useWidget = useWidgetStore()
const props = defineProps(['item'])
const { t } = useI18n()
const loading = ref(false)


function closeModal() {
  useWidget.summonDetail = false
}


</script>

<style lang="scss" scoped></style>

<template>
  <TransitionRoot appear :show="useWidget.addNote.open" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <form @submit.prevent="addItem" class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-2xl min-h-60 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col items-center gap-3">

              <exclamation-icon class="w-12 fill-primary" />

              <span class="pixa-title-2">{{ t('translation.areYouSure') }}</span>

              <span class="text-center">{{ t('translation.confirmAddNote') }}</span>


              <div class="w-full flex flex-col">
                <div class="form-control w-full">
                  <div class="label">
                    <span class="label-text capitalize">{{ t('translation.' + useWidget.addNote.type) }} <span
                        class="text-red-500">*</span></span>
                  </div>
                  <input required type="number" v-model="useWidget.addNote.note[useWidget.addNote.type_fr]" :min="0"
                    @input="
                      useWidget.addNote.note[useWidget.addNote.type_fr] = useWidget.addNote.note[useWidget.addNote.type_fr] < 0 ? 0 : useWidget.addNote.note[useWidget.addNote.type_fr] > 20 ? 20 : useWidget.addNote.note[useWidget.addNote.type_fr]"
                    step="0.05" placeholder="N/A" class="pixa-input">
                </div>
              </div>

              <div class="flex gap-3 justify-end w-full mt-3">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-primary w-40">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>{{ t('translation.addNote') }}</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </form>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import exclamationIcon from '@/assets/icons/exclamationIcon.vue';
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const useWidget = useWidgetStore()
const props = defineProps(['student', 'type'])
const emits = defineEmits(['loadData'])
const { t } = useI18n()
const loading = ref(false)


function closeModal() {
  Object.assign(useWidget.addNote, {
    add: true,
    open: false,
    type: '',
    note: {
      moyenne: null,
      assiduite: null,
      test_1: null,
      devoir_1: null,
      test_2: null,
      devoir_2: null,
      examens: null,
    },
    student: null,
  })
  loading.value = false
}



const addItem = async () => {
  loading.value = true
  try {
    if (!useWidget.addNote.add) {

      useWidget.addNote.note.eleve = useWidget.addNote.student
      let response = await axios.post(`/api/Notes/`, useWidget.addNote.note)
    } else {
      let response = await axios.patch(`/api/Notes/${useWidget.addNote.note.id}/`, useWidget.addNote.note)
    }

    emits('loadData')

    closeModal()

  } catch (error) {
    console.error(error)

    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })

  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>

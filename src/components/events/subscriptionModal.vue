<template>
  <TransitionRoot appear :show="useWidget.subscriptionModal" as="template">
    <Dialog as="div" class="relative z-10">
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
              class="w-full max-w-2xl h-[250px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                {{ t('translation.eventRegistration') }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-2"></div>

              <div class="flex-1 flex flex-col gap-3 items-center overflow-hidden">
                <span>{{ t('translation.confirmEventRegistration') }}</span>

              </div>



              <div class="flex gap-3 justify-end">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-primary w-40">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>
                    {{ t('translation.register') }}</span>
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
import communDropdown from '../commun/communDropdown.vue';
import plus from '@/assets/icons/plus.vue';
import communCombobox from '../commun/communCombobox.vue';
import uploadCloud from '@/assets/icons/uploadCloud.vue';
import { reactive, ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Trash from '@/assets/icons/trash.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64'
import { format } from 'date-fns';
import { useStudentStore } from '@/stores/students';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/events';

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const { convertToBase64 } = useFileToBase64()
const emits = defineEmits(['loadData'])
const useStudent = useStudentStore()
const route = useRoute()
const selectedStudents = ref([])
const useEvent = useEventStore()
const itemToAdd = reactive(
  {
    file: null
  }
)

const closeModal = () => {
  Object.assign(itemToAdd, {
    file: null
  })
  useStudent.focusedStudent = null
  useWidget.subscriptionModal = false
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const base64 = await convertToBase64(file)
    itemToAdd.file = base64  // Base64 string like "data:application/pdf;base64,JVBERi0xLjcK..."
  }
}

const addItem = async () => {
  try {
    loading.value = true
    let response = await axios.post(`/api/EventInscription/`,
      {
        event: useEvent.focusedEvents.id,
        professeur: useWidget.authUser.userDetail.id,
        eleve: null,
        inscrit_par: useWidget.authUser.userDetail.id,
        participant_type: 'PROF'
      }
    )
    console.log(response.data)
    emits('loadData')
    closeModal()
  } catch (error) {
    console.error(error);

  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>

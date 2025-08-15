<template>
  <TransitionRoot appear :show="useWidget.addJustify" as="template">
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
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">

                {{ t('translation.add') }} {{
                  t('translation.justify') }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-2"></div>

              <div class="flex-1 flex overflow-hidden flex-col gap-3 items-center">

                <div class="btn btn-sm pixa-btn-form btn-ghost w-20 border border-primary relative">
                  <input type="file" @change="onFileChange" required class="absolute opacity-0 inset-0 h-full">
                  <upload-cloud />

                </div>

                <span class="truncate w-full">{{ tempFile }}</span>

              </div>



              <div class="flex gap-3 justify-end">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-primary w-32">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>
                    {{ t('translation.save') }}</span>
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

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const { convertToBase64 } = useFileToBase64()
const emits = defineEmits(['loadData'])
const useStudent = useStudentStore()
const route = useRoute()
const itemToAdd = reactive(
  {
    file: null
  }
)
const tempFile = ref('')

const closeModal = () => {
  Object.assign(itemToAdd, {
    file: null
  })
  useStudent.focusedStudent = null
  useWidget.addJustify = false
  tempFile.value = ''
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    tempFile.value = file.name
    const base64 = await convertToBase64(file)
    itemToAdd.file = base64  // Base64 string like "data:application/pdf;base64,JVBERi0xLjcK..."
  }
}

const addItem = async () => {
  try {
    let response = await axios.patch(`/api/Abs_Retard_Prof/${useStudent.focusedAbscence.id}/`,
      {
        justification: itemToAdd.file
      }
    )
    emits('loadData')
    closeModal()
  } catch (error) {
    console.error(error);

  }
}
</script>

<style lang="scss" scoped></style>

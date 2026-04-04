<template>
  <TransitionRoot appear :show="useWidget.addJustify" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <form @submit.prevent="addItem" class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
            :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto', fontWeight: useWidget.userLanguage === 'ar' ? 500 : 400 }"
            as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                {{ t('translation.add') }} {{ t('translation.justify') }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-2"></div>

              <div class="flex-1 flex flex-col gap-3 items-center">

                <div class="form-control w-full">
                  <div class="label">
                    <span class="label-text capitalize">{{ t('translation.comment') }}</span>
                  </div>
                  <textarea v-model="itemToAdd.commentaire" class="pixa-textarea"
                    :class="{ 'border-red-500': validationError }"></textarea>
                </div>

                <div class="btn btn-sm pixa-btn-form btn-ghost w-20 border border-primary relative"
                  :class="{ 'border-red-500': validationError }">
                  <input type="file" @change="onFileChange" class="absolute opacity-0 inset-0 h-full">
                  <upload-cloud />
                </div>

                <p v-if="validationError" class="text-red-500 text-sm">{{ t('translation.comment_or_file_required') }}</p>

              </div>

              <div class="flex gap-3 justify-end">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-primary w-32">
                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>{{ t('translation.save') }}</span>
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
import { useFileToBase64 } from '@/composables/useFileToBase64'
import { useStudentStore } from '@/stores/students';

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const validationError = ref(false)
const { convertToBase64 } = useFileToBase64()
const emits = defineEmits(['loadData'])
const useStudent = useStudentStore()

const itemToAdd = reactive({
  file: null,
  commentaire: '',
})

const closeModal = () => {
  Object.assign(itemToAdd, {
    file: null,
    commentaire: ''
  })
  validationError.value = false
  useStudent.focusedAbscence = null
  useWidget.addJustify = false
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const base64 = await convertToBase64(file)
    itemToAdd.file = base64
    validationError.value = false
  }
}

watch(() => itemToAdd.commentaire, () => {
  if (validationError.value) {
    validationError.value = false
  }
})

const addItem = async () => {
  if (!itemToAdd.commentaire?.trim() && !itemToAdd.file) {
    validationError.value = true
    return
  }
  validationError.value = false

  loading.value = true
  try {
    await axios.patch(`/api/Abs_Retard_Prof/${useStudent.focusedAbscence.id}/`, {
      justification: itemToAdd.file,
      commentaire: itemToAdd.commentaire
    })
    emits('loadData')
    closeModal()
  } catch (error) {
    console.error(error);
  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>

<template>
  <TransitionRoot appear :show="useWidget.justifyModal" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild :dir="useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'"
            :style="{ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto', fontWeight: useWidget.userLanguage === 'ar' ? 500 : 400 }"
            as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3 min-h-56">

              <div class="flex w-full items-center justify-between">
                <DialogTitle as="h3" class="flex items-center pixa-title-2">
                  {{ t('translation.justify') }}
                </DialogTitle>
                <times-square @click="closeModal" class="w-8 fill-slate-600 cursor-pointer" />
              </div>

              <div class="w-full h-px bg-primary mt-2"></div>

              <div class="flex-1 flex flex-col gap-3 items-center">

                <div v-if="useStudent.focusedAbscence?.commentaire" class="form-control w-full">
                  <div class="label">
                    <span class="label-text capitalize">{{ t('translation.comment') }}</span>
                  </div>
                  {{ useStudent.focusedAbscence.commentaire }}
                </div>

                <div v-if="useStudent.focusedAbscence?.justification" class="form-control w-full">
                  <div class="label">
                    <span class="label-text capitalize">{{ t('translation.justification_file') }}</span>
                  </div>
                  <button type="button"
                    class="btn btn-sm pixa-btn-form btn-ghost w-20 border border-primary relative"
                    @click="handleDownload(useStudent.focusedAbscence.justification)">
                    <upload-cloud />
                  </button>
                </div>

              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import { useStudentStore } from '@/stores/students';
import uploadCloud from '@/assets/icons/uploadCloud.vue';
import timesSquare from '@/assets/icons/timesSquare.vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import { useDownloadBase64 } from '@/composables/useDownloadBase64';

const useWidget = useWidgetStore()
const useStudent = useStudentStore()
const { t } = useI18n()
const { downloadBase64 } = useDownloadBase64()

const closeModal = () => {
  useStudent.focusedAbscence = null
  useWidget.justifyModal = false
}

const handleDownload = (base64String) => {
  downloadBase64(base64String, 'justification')
}
</script>

<style lang="scss" scoped></style>

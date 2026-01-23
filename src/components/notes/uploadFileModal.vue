<template>
  <TransitionRoot appear :show="useWidget.uploadFile" as="template">
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
              class="w-full max-w-md min-h-[300px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">

                {{ t('translation.upload') }} {{ t('translation.file') }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-3"></div>

              <div
                class="flex-1 rounded-lg border border-border-color hover:border-primary/60 relative flex flex-col gap-2 items-center justify-center">
                <input type="file" accept=".pdf" @change="async (event) => {
                  loading = true
                  const file = event.target.files[0];

                  if (!file) {
                    null
                    return;
                  } else {
                    const base64 = await convertToBase64(file)
                    emits('addBulletin', base64)
                  }
                }" class="w-full h-full absolute inset-0 opacity-0">
                <upload-cloud class="w-12" />
                <span class="uppercase">{{ t('translation.attachFile') }}</span>
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
import uploadCloud from '@/assets/icons/uploadCloud.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64'
import {  ref,  watchEffect } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import { useSubjectStore } from '@/stores/subjects';

const useWidget = useWidgetStore()
const emits = defineEmits(['addBulletin'])
const useSubject = useSubjectStore()
const { convertToBase64 } = useFileToBase64()
const { t } = useI18n()
const loading = ref(false)

const closeModal = () => {
  useWidget.uploadFile = false
}

watchEffect(() => {
  if (!useWidget.uploadFile) {
    useSubject.focusedBulletin = null
    loading.value = false
  }
})
</script>

<style lang="scss" scoped></style>

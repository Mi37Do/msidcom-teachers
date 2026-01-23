<template>
  <TransitionRoot appear :show="useWidget.addSummonModal" as="template">
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

              <exclamation-icon class="w-12 fill-error" />

              <span class="pixa-title-2">{{ t('translation.areYouSure') }}</span>

              <span class="text-center">{{ t('translation.confirmSummon') }}</span>


              <div class="w-full flex flex-col">
                <div class="form-control w-full">
                  <div class="label">
                    <span class="label-text capitalize">{{ t('translation.motif') }} <span
                        class="text-red-500">*</span></span>
                  </div>
                  <textarea required v-model="motif" class="pixa-textarea focus:border-error"></textarea>
                </div>
              </div>

              <div class="flex gap-3 justify-end w-full mt-3">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-error w-52">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>{{ t('translation.signalSummon') }}</span>
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
const { t } = useI18n()
const loading = ref(false)


const motif = ref('')


function closeModal() {
  useWidget.addSummonModal = false
  motif.value = ''
  loading.value = false
}



const addItem = async () => {
  loading.value = true
  try {
    let response = await axios.post(`/api/Convocations_eleve/`, {
      prof: useWidget.authUser.userDetail.id,
      date: new Date(),
      motif: motif.value,
      eleve: props.student.eleve_id
    })

    //emits('loadData')

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

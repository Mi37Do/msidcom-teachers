<template>
  <TransitionRoot appear :show="useWidget.addChatPassive.open" as="template">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                créer une discussion
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-2"></div>

              <div class="flex-1 flex flex-col ">
                Voulez-vous vraiment créer une discussion avec :
                <span class="font-semibold uppercase">
                  {{ useWidget.addChatPassive.designation }}</span>
              </div>



              <div class="flex gap-3 justify-end mt-3">
                <button type="reset" class="btn btn-sm  pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm  pixa-btn-form btn-primary w-44">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>
                    lancer discussion</span>
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
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { useRouter } from 'vue-router';

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const router = useRouter()

const closeModal = () => {
  Object.assign(useWidget.addChatPassive, {
    open: false,
    to: null,
    designation: ''
  })
}

const addItem = async () => {
  loading.value = true
  try {
    let response = await axios.post(`/api/discussions/`, {
      to_user: useWidget.addChatPassive.to,
      from_user: useWidget.authUser.userDetail.id
    })

    router.push({ name: 'chat-view', params: { id: response.data.id } })
    closeModal()
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

</script>

<style lang="scss" scoped></style>

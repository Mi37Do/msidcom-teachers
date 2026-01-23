<template>
  <TransitionRoot appear :show="useWidget.editPassword" as="template">
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
              class="w-full max-w-sm min-h-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                {{ t('translation.changePassword') }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-3"></div>


              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text capitalize">{{ t('translation.newPassword') }} <span
                      class="text-red-500">*</span></span>
                </div>
                <div class="relative flex items-center w-full">
                  <password-icon class="w-5 absolute left-2" />
                  <input v-model="password" required :placeholder="t('translation.new') + ' ....'"
                    class=" pixa-input-icon px-3 placeholder:capitalize w-full" />
                </div>
              </label>
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text capitalize">{{ t('translation.confirmation') }} <span
                      class="text-red-500">*</span></span>
                </div>
                <div class="relative flex items-center w-full">
                  <password-icon class="w-5 absolute left-2" />
                  <input v-model="confirmation" required :placeholder="t('translation.confirmation') + ' ....'"
                    class=" pixa-input-icon px-3 placeholder:capitalize w-full" />
                </div>
              </label>

              <span v-if="message" class="text-error capitalize text-xs">{{ message }}</span>

              <div class="flex gap-3 justify-end mt-auto">
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
import { onMounted, reactive, ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import passwordIcon from '@/assets/icons/passwordIcon.vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const designation = ref('')

const password = ref('')
const confirmation = ref('')
const message = ref('')

const itemToAdd = reactive(
  {
    designation: null,
    matiere_specialite: null
  }
)


function closeModal() {
  useWidget.editPassword = false
  Object.assign(itemToAdd, {
    designation: null,
    matiere_specialite: null
  })
  designation.value = ''
  loading.value = false
}

onMounted(() => {

})


let response = null
const addItem = async () => {
  loading.value = true
  if (password.value === confirmation.value) {
    message.value = ''
    try {
      response = await axios.patch(`/api/GET_or_PUT_User/${useWidget.authUser.userDetail.id}/`, {
        password: password.value
      })

      closeModal()

      Object.assign(itemToAdd, {
        designation: null,
        matiere_specialite: null
      })

      useWidget.addToast({
        msg: t('translation.passwordChangedSuccess'),
        color: 'green'
      })

    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red'
      })
    }
  }
  else {
    message.value = t('translation.pleaseConfirmPassword')
  }
  loading.value = false
}

</script>

<style lang="scss" scoped></style>

<template>
  <TransitionRoot appear :show="useWidget.addImage" as="template">
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
              class="w-full max-w-sm min-h-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                Changement la photo
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-3"></div>

              <div class="w-40 h-40 bg-primary/20 rounded-xl p-1 mx-auto">
                <div v-if="tempImage"
                  class="w-full h-full overflow-hidden rounded-lg flex items-center justify-center bg-white relative">
                  <button type="button" @click="tempImage = null"
                    class="btn btn-sm btn-square absolute right-2 top-2 pixa-btn-nofloat-red">
                    <Trash class="w-5 h-5" />
                  </button>
                  <img :src="tempImage" class="object-cover" alt="">
                </div>

                <div v-else class="w-full h-full bg-white rounded-lg flex items-center justify-center relative">
                  <input type="file" accept="image/*" @change="onChangeHandler"
                    class="w-full h-full absolute inset-0 opacity-0">
                  <plus class="w-8 h-8 fill-slate-500" />
                </div>
              </div>



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
import Trash from '@/assets/icons/trash.vue';
import plus from '@/assets/icons/plus.vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const useWidget = useWidgetStore()
const { t } = useI18n()
const loading = ref(false)
const designation = ref('')

const password = ref('')
const confirmation = ref('')
const message = ref('')
const tempImage = ref(null)

const itemToAdd = reactive(
  {
    designation: null,
    matiere_specialite: null
  }
)

console.log(useWidget.authUser.userDetail);


function closeModal() {
  useWidget.addImage = false
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
  message.value = ''

  console.log(tempImage.value);


  try {
    response = await axios.patch(`/api/GET_or_PUT_User/${useWidget.authUser.userDetail.id}/`, {
      image: tempImage.value
    })

    closeModal()

    Object.assign(itemToAdd, {
      designation: null,
      matiere_specialite: null
    })

    useWidget.addToast({
      msg: 'Image ajouter avec succès!',
      color: 'green'
    })

  } catch (error) {
    console.error(error)

    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })
  }
  loading.value = false
}

const onChangeHandler = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      tempImage.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

</script>

<style lang="scss" scoped></style>

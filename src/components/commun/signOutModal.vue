<template>
  <TransitionRoot appear :show="useWidget.signOutModal" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">

              <div v-if="!useWidget.signOutModal" class="w-full flex flex-col h-52 gap-2 items-center justify-center">
              </div>

              <div v-else class="w-full flex flex-col h-fit gap-2 items-center justify-center">

                <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <exclamationIcon class="w-8 h-8 mb-1 fill-red-500" />
                </div>

                <span class="uppercase text-lg mt-2 font-medium">{{ t('translation.areYouSure') }}</span>
                <span class="mb-6">{{ t('translation.confirmSignOut') }}</span>

                <div class="w-full h-10 grid grid-cols-2 gap-4">
                  <button :disabled="loadingDelete" @click="closeModal"
                    class="btn btn-sm pixa-btn pixa-btn-nofloat-red">{{
                      t('translation.discard') }}</button>

                  <button :disabled="loadingDelete" @click="deleteItem(useWidget.deleteModal.id)"
                    class="btn btn-sm pixa-btn bg-red-500 hover:bg-red-600 text-white border-0">

                    <span v-if="loadingDelete" class="loading loading-ring loading-sm"></span>
                    <span v-else>{{
                      t('translation.signOut') }}</span>
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
import { useWidgetStore } from '@/stores/widget'
import exclamationIcon from '@/assets/icons/exclamationIcon.vue';
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import { Preferences } from '@capacitor/preferences';

const props = defineProps(['item', 'token'])
const useWidget = useWidgetStore()
const loadingDelete = ref(false)
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const closeModal = () => {
  useWidget.signOutModal = false
}

const deleteItem = async () => {
  console.log(props.token);

  try {
    let reponseRemove = await axios.post('/api/device/unregister/', {
      token: props.token
    })
    await Preferences.remove({ key: 'authToken-prof' });
    let response = await axios.post('/api/Logout')
    closeModal()
    router.push({ name: 'login-view' })
  } catch (error) {
    console.error(error)

  }
}



</script>


<style lang="scss" scoped></style>

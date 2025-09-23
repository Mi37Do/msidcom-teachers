<template>
  <TransitionRoot appear :show="useWidget.addEditAnnoncement.open" as="template">
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
              class="w-full max-w-md min-h-[650px] h-[80%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">

                {{ useWidget.addEditAnnoncement.open ? t('translation.create') : '' }} {{ t('translation.une')
                }} {{ t('translation.annoncement')
                }}
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-3"></div>

              <div v-if="showDatePicker" class="h-full w-full flex flex-col gap-1.5">
                <commun-calendar-modal :options="{
                  date: tempDate
                }" @onSelectDate="(date) => {
                  tempDate = date
                  showDatePicker = false
                }" />
              </div>

              <div v-else class="w-full h-full flex flex-col gap-3">
                <div class="flex flex-col gap-1.5 flex-1">
                  <label class="form-control w-full">
                    <div class="label">
                      <span class="label-text capitalize">{{ t('translation.type') }} <span
                          class="text-red-500">*</span></span>
                    </div>
                    <commun-dropdown :list="types" :selected="itemToAdd.type" :required="true" @onSelectedItem="(id) => {
                      itemToAdd.type = id
                    }" />
                  </label>

                  <label class="form-control w-full">
                    <div class="label">
                      <span class="label-text capitalize">{{ t('translation.annoncementTitle') }} <span
                          class="text-red-500">*</span></span>

                    </div>
                    <input type="text" required v-model="itemToAdd.designation"
                      :placeholder="t('translation.annoncementTitle') + ' ....'"
                      class=" pixa-input px-3 placeholder:capitalize" />
                  </label>


                  <div class="w-full flex flex-col">
                    <div class="form-control w-full">
                      <div class="label">
                        <span class="label-text capitalize">{{ t('translation.description') }} <span
                            class="text-red-500">*</span></span>
                      </div>
                      <textarea required v-model="itemToAdd.description" class="pixa-textarea"></textarea>
                    </div>
                  </div>


                  <div class="form-control w-full">
                    <div class="label">
                      <span class="label-text capitalize">date limite (optionnel)</span>
                    </div>
                    <button type="button" @click="showDatePicker = true"
                      class="pixa-input pb-0.5 text-slate-700 w-full flex items-center justify-between">
                      <span>{{ tempDate ? format(tempDate, 'PPP', { locale: fr }) : '' }}</span>
                      <Calendar class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="form-control w-full max-w-60">
                    <div class="label">
                      <span class="label-text capitalize">piece jointe (optionnel)</span>
                    </div>
                    <div class="flex-1 flex overflow-hidden flex-col gap-3 items-center">

                      <div class="btn btn-sm pixa-btn-form btn-ghost w-20 border border-primary relative">
                        <input type="file" @change="onFileChange" class="absolute opacity-0 inset-0 h-full">
                        <upload-cloud />

                      </div>

                      <span class="truncate w-full">{{ tempFileName }}</span>

                    </div>
                  </div>
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
import { reactive, ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import Calendar from '@/assets/icons/calendar.vue';
import { fr } from 'date-fns/locale'
import axios from 'axios';
import { useRoomStore } from '@/stores/rooms';
import { useEventStore } from '@/stores/events';
import uploadCloud from '@/assets/icons/uploadCloud.vue';
import communCalendarModal from '../commun/communCalendarModal.vue';
import { useRoute } from 'vue-router';

import { useFileToBase64 } from '@/composables/useFileToBase64'
import { format } from 'date-fns';


const useWidget = useWidgetStore()
const props = defineProps(['classe'])
const { t } = useI18n()
const loading = ref(false)
const designation = ref('')
const useRoom = useRoomStore()
const route = useRoute()
const useEvent = useEventStore()
const tempDate = ref(null);
const mask = ref({ input: 'DD-MM-YYYY' })
const rangeTo = ref(null)
const tempFileName = ref('')
const { convertToBase64 } = useFileToBase64()
const showDatePicker = ref(false)
const uploadFile = ref(false)
const itemToAdd = reactive(
  {
    piece_juinte: null,
    type: 'Annonce',
    designation: '',
    description: '',
    classe: props.classe,
    date_limite: null,
    Prof: useWidget.authUser.userDetail.id
  }
)
const types = ref([
  {
    id: 'Annonce', designation: 'Annonce'
  }, {
    id: 'Devoir', designation: 'Devoir'
  }, {
    id: 'Autre', designation: 'Autre'
  }
])

function closeModal() {
  Object.assign(useWidget.addEditAnnoncement,
    {
      add: true,
      open: false,
    })

  Object.assign(itemToAdd, {
    piece_juinte: null,
    type: 'Annonce',
    designation: '',
    description: '',
    classe: props.classe,
    date_limite: null,
    Prof: useWidget.authUser.userDetail.id
  })
  tempDate.value = null
  designation.value = ''
  loading.value = false
}


const addItem = async () => {
  loading.value = true
  let response = null
  try {
    itemToAdd.date_limite = tempDate.value ? format(tempDate.value, 'yyyy-MM-dd') : null
    if (useWidget.addEditAnnoncement.add) {
      response = await axios.post(`/api/Annonce_prof/`, itemToAdd)
    } else {
      response = await axios.put(`/api/Annonce_prof/${useRoom.focusedRoom.id}/`, itemToAdd)
    }

    await useEvent.getAnnoncements(null, `Prof=${useWidget.authUser.userDetail.id}`)
    closeModal()

  } catch (error) {
    console.error(error);

  }
  loading.value = false
}

const onFileChange = async (event) => {
  uploadFile.value = true
  const file = event.target.files[0]
  if (file) {
    tempFileName.value = file.name
    const base64 = await convertToBase64(file)
    itemToAdd.piece_juinte = base64  // Base64 string like "data:application/pdf;base64,JVBERi0xLjcK..."

    uploadFile.value = false
  }
}
</script>

<style lang="scss" scoped></style>

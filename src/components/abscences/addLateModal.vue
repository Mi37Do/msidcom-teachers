<template>
  <TransitionRoot appear :show="useWidget.addLateProf" as="template">
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
              class="w-full max-w-2xl h-[560px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                {{ t('translation.signaleAbs/Late') }}
              </DialogTitle>

              <div class="w-full h-px bg-warning mt-2"></div>

              <div class="flex-1 flex flex-col gap-3 items-center">
                <div v-if="showDatePicker" class="h-full w-full flex flex-col gap-1.5">
                  <commun-calendar-modal :options="{
                    date: tempDate
                  }" @onSelectDate="(date) => {
                    tempDate = date
                    showDatePicker = false
                  }" />
                </div>
                <div v-else-if="showTimePicker" class="h-full w-full flex flex-col gap-1.5">
                  <CommunTimePicker v-model="hoursTime" @hideTimePicker="(time) => {
                    hoursTime.hours = time.hours
                    tempHours = time.hours
                    hoursTime.minutes = time.minutes
                    tempMinutes = time.minutes
                    console.log(hoursTime);
                    showTimePicker = false
                  }" />
                </div>
                <div v-else class="flex flex-col gap-1.5 w-full h-full">
                  <div class="flex flex-col gap-3 flex-1">
                    <div class="form-control w-full">
                      <div class="label">
                        <span class="label-text capitalize">{{ t('translation.type') }} <span
                            class="text-red-500">*</span></span>
                      </div>
                      <communDropdown :list="types" :selected="itemToAdd.type"
                        @on-selected-item="(id) => itemToAdd.type = id" :required="true" />
                    </div>

                    <label class="form-control w-full">
                      <div class="label">
                        <span class="label-text capitalize">{{ t('translation.signalDate') }} <span
                            class="text-red-500">*</span></span>
                      </div>
                      <div class="flex gap-3 w-full items-center">
                        <button type="button" @click="showDatePicker = true"
                          class="pixa-input pb-0.5 text-slate-700 w-full flex items-center justify-between">
                          <span>{{ format(tempDate, 'PPP', { locale: fr }) }}</span>
                          <Calendar class="w-5 h-5" />
                        </button>
                      </div>
                    </label>

                    <div class="flex gap-3 w-full items-center mt-3">
                      <span class="uppercase">à</span>
                      <!--
                      <div class="flex gap-1.5 items-center w-60">
                        <communDropdown :list="useWidget.generateArrayFromRange(0, 23)" :selected="hoursTime.hours"
                          @on-selected-item="(id) => hoursTime.hours = id" class="flex-1" />
                        <span>:</span>
                        <communDropdown :list="useWidget.generateArrayFromRange(0, 59)" :selected="hoursTime.minutes"
                          @on-selected-item="(id) => hoursTime.minutes = id" class="flex-1" />
                      </div> -->

                      <button type="button" @click="showTimePicker = true"
                        class="pixa-input pb-0.5 text-slate-700 w-full flex items-center justify-between">
                        <span>{{ hoursTime.hours.toString().padStart(2, '0') }}:{{
                          hoursTime.minutes.toString().padStart(2, '0') }}</span>
                        <Clock class="w-5 h-5 fill-slate-600" />
                      </button>
                    </div>

                    <div class="form-control w-full mt-3">
                      <div class="label">
                        <span class="label-text capitalize">{{ t('translation.justify') }}</span>
                      </div>
                      <div class="flex gap-3 items-center">
                        <div class="btn btn-sm pixa-btn-form btn-ghost w-20 border border-primary relative">
                          <input type="file" @change="onFileChange" :disabled="uploadFile"
                            class="absolute opacity-0 inset-0 h-full">
                          <span v-if="uploadFile" class="loading loading-spinner loading-sm"></span>
                          <upload-cloud v-else />
                        </div>
                        <span class="truncate">{{ tempFileName }}</span>
                      </div>
                    </div>

                    <div class="flex gap-3 justify-end mt-auto">
                      <button type="button" :disabled="uploadFile" class="btn btn-sm pixa-btn-form btn-ghost w-32"
                        @click="closeModal">
                        {{ t('translation.cancel') }}
                      </button>
                      <button type="submit" :disabled="loading || uploadFile"
                        class="btn btn-sm pixa-btn-form btn-warning w-32">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else>{{ t('translation.save') }}</span>
                      </button>
                    </div>
                  </div>
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
import { fr } from 'date-fns/locale'
import { computed, reactive, ref, watch } from 'vue'
import uploadCloud from '@/assets/icons/uploadCloud.vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { useUserStore } from '@/stores/users';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns';
import Calendar from '@/assets/icons/calendar.vue';
import communCalendarModal from '../commun/communCalendarModal.vue';
import CommunTimePicker from '../commun/communTimePicker.vue';
import Clock from '@/assets/icons/clock.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64'

const useWidget = useWidgetStore();
const props = defineProps(['id', 'type']);
const emits = defineEmits(['loadData']);
const { t } = useI18n();
const loading = ref(false);
const useUser = useUserStore();
const showDatePicker = ref(false);
const showTimePicker = ref(false)
const tempDate = ref(new Date());
const currentDate = ref(new Date());
const { convertToBase64 } = useFileToBase64()
const uploadFile = ref(false)


const types = ref([
  { id: 'Absence', designation: 'Absence' },
  { id: 'Retard', designation: 'Retard' }
]);

const itemToAdd = reactive({
  agent: null,
  date_heure_abs: new Date(),
  type: 'Absence',
  justification: ''
});
const tempFileName = ref('')


const roundToNearest = (val, step) => Math.round(val / step) * step;

const tempHours = ref('')
const tempMinutes = ref('')
const hoursTime = reactive({
  hours: 7,
  minutes: roundToNearest(format(new Date(), 'mm'), 5)
});


function closeModal() {
  useWidget.addLateProf = false;
  Object.assign(itemToAdd, {
    agent: null,
    date_heure_abs: new Date(),
    type: 'Absence',
    justification: ''
  });
  tempDate.value = new Date()
  tempFileName.value = ''
  loading.value = false;
}

const addItem = async () => {
  if (!itemToAdd.type) {
    useWidget.addToast({
      msg: t('translation.pleaseSelectType'),
      color: 'red'
    });
    return;
  }

  loading.value = true;

  try {
    // Combine date and time
    console.log(hoursTime);

    const dateWithTime = new Date(tempDate.value);
    dateWithTime.setHours(parseInt(tempHours.value));
    dateWithTime.setMinutes(parseInt(tempMinutes.value));

    /***/
    const response = await axios.post(`/api/Abs_Retard_Prof/`, {
      agent: useWidget.authUser.userDetail.id,
      date_heure_abs: dateWithTime.toISOString(),
      type: itemToAdd.type,
      prof: props.id,
      justification: itemToAdd.justification
    });

    emits('loadData');
    closeModal();
    useWidget.addToast({
      msg: t('translation.savedSuccessfully'),
      color: 'green'
    });
  } catch (error) {
    console.error(error);
    useWidget.addToast({
      msg: error.response?.data?.message || error.message,
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
}

const onFileChange = async (event) => {
  uploadFile.value = true
  const file = event.target.files[0]
  if (file) {
    tempFileName.value = file.name
    const base64 = await convertToBase64(file)
    itemToAdd.justification = base64  // Base64 string like "data:application/pdf;base64,JVBERi0xLjcK..."
    console.log(itemToAdd.justification)

    uploadFile.value = false
  }
}
</script>

<style lang="scss" scoped>
/* Add any custom styles here if needed */
</style>

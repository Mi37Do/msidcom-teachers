<template>
  <TransitionRoot appear :show="useWidget.lateModal" as="template">
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

              <exclamation-icon class="w-12 fill-warning" />

              <span class="pixa-title-2">êtes-vous sûr?</span>

              <span class="text-center">Êtes-vous sûr(e) de vouloir signaler cette élève comme en retard ?</span>

              <div class="flex gap-3 justify-end w-full mt-3">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-warning w-40">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>signaler retard</span>
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
import Trash from '@/assets/icons/trash.vue';
import { useUserStore } from '@/stores/users';
import { format, setHours, setMinutes } from 'date-fns';
import Calendar from '@/assets/icons/calendar.vue';
import { useRoute } from 'vue-router';
import { useStudentStore } from '@/stores/students';

const useWidget = useWidgetStore()
const props = defineProps(['student', 'type'])
const emits = defineEmits(['loadData'])
const { t } = useI18n()
const loading = ref(false)
const route = useRoute()
const useStudent = useStudentStore()
const designation = ref('')
const useUser = useUserStore()
const types = ref(
  [
    {
      id: 'Absence', designation: 'Absence'
    },
    {
      id: 'Retard', designation: 'Retard'
    }
  ]
)



const itemToAdd = reactive(
  {
    agent: null,
    date_heure_abs: new Date(),
    type: 'Retard',
    last_name: '', justification: ''
  }
)

const hoursTime = reactive(
  {
    hours: '00',
    minutes: '00',
  }
)

const mask = ref({
  input: 'DD-MM-YYYY'
})


function closeModal() {
  useWidget.lateModal = false

  Object.assign(itemToAdd, {

    agent: null,
    date_heure_abs: new Date(),
    type: 'Absence',
    last_name: '', justification: ''
  })
  designation.value = ''
  loading.value = false
}



const addItem = async () => {
  console.log(new Date());

  /***/
  loading.value = true
  try {
    let response = await axios.post(`/api/Abs_Retard_Eleve/`, {
      agent: useWidget.authUser.userDetail.id,
      date_heure_abs: itemToAdd.date_heure_abs,
      type: itemToAdd.type,
      eleve: props.student.id
    })

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

<template>
  <TransitionRoot appear :show="useWidget.lateModal" as="template">
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
              class="w-full max-w-2xl min-h-60 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col items-center gap-3">

              <exclamation-icon class="w-12 fill-warning" />

              <span class="pixa-title-2">{{ t('translation.signaleAbs/Late') }}</span>

              <!-- Avant : « signaler cet élève comme en retard », même pour une absence -->
              <span class="text-center auto-dir">{{ t('translation.confirmSignalStudent', { name: nomEleve }) }}</span>

              <div class="flex gap-3 justify-end w-full mt-3">

                <button type="button" :disabled="loading !== null" class="btn btn-sm pixa-btn-form btn-error flex-1"
                  @click="signaler('Absence')">
                  <span v-if="loading === 'Absence'" class="loading loading-spinner loading-sm"></span>
                  <span v-else class="truncate">{{ t('translation.signalAbsence') }}</span>
                </button>
                <button type="button" :disabled="loading !== null" class="btn btn-sm pixa-btn-form btn-warning flex-1"
                  @click="signaler('Retard')">
                  <span v-if="loading === 'Retard'" class="loading loading-spinner loading-sm"></span>
                  <span v-else class="truncate">{{ t('translation.signalLate') }}</span>
                </button>
              </div>

              <button type="button" :disabled="loading !== null" class="btn btn-sm pixa-btn-form btn-ghost w-32"
                @click="closeModal">
                {{ t('translation.cancel') }}
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import exclamationIcon from '@/assets/icons/exclamationIcon.vue';
import { useWidgetStore } from '@/stores/widget';

const useWidget = useWidgetStore()
const props = defineProps(['student', 'type'])
const emits = defineEmits(['loadData'])
const { t } = useI18n()
// Le type en cours d'envoi ('Absence' ou 'Retard'), null sinon : un seul envoi à la fois
const loading = ref(null)

const nomEleve = computed(() =>
  [props.student?.prenom, props.student?.nom].filter(Boolean).join(' ')
)

function closeModal() {
  // Pas de fermeture pendant l'envoi : le résultat s'afficherait sans contexte
  if (loading.value) return
  useWidget.lateModal = false
}

const signaler = async (type) => {
  const eleve = props.student?.eleve_id ?? props.student?.id
  if (!eleve || loading.value) return
  loading.value = type
  try {
    await axios.post(`/api/Abs_Retard_Eleve/`, {
      agent: useWidget.authUser.userDetail?.id,
      // Heure du signalement
      date_heure_abs: new Date(),
      type,
      eleve,
    })
    loading.value = null
    useWidget.lateModal = false
    useWidget.addToast({
      msg: type === 'Absence' ? t('translation.absenceSignaled') : t('translation.lateSignaled'),
      color: 'green',
    })
    emits('loadData')
  } catch (error) {
    console.error(error)
    loading.value = null
    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })
  }
}
</script>

<style lang="scss" scoped></style>

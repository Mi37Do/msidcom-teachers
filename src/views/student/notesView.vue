<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <!-- Aucune matière de l'enseignant pour cette classe : message au lieu d'un écran planté -->
  <commun-no-data v-else-if="tempSpecialites.length <= 0" />

  <div v-else class="w-full h-full flex flex-col gap-[20px] overflow-hidden px-6">


    <commun-dropdown :list="tempSpecialites" :selected="selectedSpecialite" @on-selected-item="async (id) => {
      selectedSpecialite = id
      specialiteFilter = tempSpecialites.find(i => i.id === id)?.specialite ?? null
      await loadNotes(selectedSpecialite)
    }"></commun-dropdown>


    <add-note-modal @load-data="async () => {
      await loadNotes(selectedSpecialite)
    }" />

    <div class="h-[39px] grid grid-cols-3 gap-[5px] w-fit">
      <div v-for="i in trimesters" :key="i" @click="() => {
        selectedTrimester = i
        tempNotes = notes.filter(item => item.Trimestre === selectedTrimester)
      }"
        :class="selectedTrimester === i ? 'bg-secondary-2/10 text-secondary-2 border-secondary-2' : 'bg-trensparent border-border-color-full'"
        class="px-[16px] py-[10px] h-full capitalize border-b cursor-pointer text-center">
        <span>{{
          t('translation.trimester') }} {{ i === 'First' ? '1' : i === 'Second' ? 2 :
            3 }} </span>
      </div>
    </div>
    <div class="w-full flex-1 overflow-hidden">

      <communTable>

        <template #table_header>
          <div
            :class="`w-full h-[55px] bg-secondary border-b border-border-color grid grid-cols-2 gap-1.5 p-[16px] capitalize font-medium`">
            <div class="my-auto truncate">
              {{ t('translation.evaluation') }}
            </div>
            <div class="my-auto truncate">
              {{ t('translation.notes') }}
            </div>
          </div>

        </template>

        <template #table_items>

          <div class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2 capitalize">
            <span class="my-auto"> {{ t(`translation.attendance`) }}</span>
            <div class="flex items-center justify-between">
              <span> {{ valeur('assiduite') }}</span>

            </div>
          </div>

          <div class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.test`) }} {{ matiereChoisie?.nbr_test > 1 ? 1 : null }}</span>
            <div class="flex items-center justify-between">

              <span> {{ valeur('test_1') }} </span>

            </div>
          </div>

          <div v-if="matiereChoisie?.nbr_test > 1"
            class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.test`) }} 2</span>

            <div class="flex items-center justify-between">

              <span> {{ valeur('test_2') }} </span>

            </div>


          </div>
          <div class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.homework`) }} {{ matiereChoisie?.nbr_devoir > 1 ? 1 : null
              }}</span>

            <div class="flex items-center justify-between">

              <span> {{ valeur('devoir_1') }} </span>

            </div>
          </div>
          <div v-if="matiereChoisie?.nbr_devoir > 1"
            class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.homework`) }} 2</span>

            <div class="flex items-center justify-between">


              <span> {{ valeur('devoir_2') }}</span>


            </div>
          </div>
          <div class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.exam`) }}</span>


            <div class="flex items-center justify-between">

              <span> {{ valeur('examens') }}</span>

            </div>


          </div>
          <div class="w-full h-12 border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.avg`) }}</span>

            <div class="flex items-center justify-between">

              <span> {{ valeur('moyenne') }}</span>

            </div>
          </div>
        </template>
      </communTable>
    </div>

  </div>
</template>

<script setup>
import communTable from '@/components/commun/communTable.vue';
import communDropdown from '@/components/commun/communDropdown.vue';
import communNoData from '@/components/commun/communNoData.vue';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWidgetStore } from '@/stores/widget';
import { useRoomStore } from '@/stores/rooms';
import addNoteModal from '@/components/notes/addNoteModal.vue';


const { t } = useI18n()
const route = useRoute()
const useWidget = useWidgetStore()
const useRoom = useRoomStore()
const loading = ref(true)
const selectedTrimester = ref('First')
const trimesters = ref(['First', 'Second', 'Third'])

const notes = ref([])
const tempNotes = ref([])
const tempSpecialites = ref([])
const selectedSpecialite = ref(null)
const specialiteFilter = ref(null)

const tempNote = reactive({
  moyenne: null,
  assiduite: null,
  test_1: null,
  devoir_1: null,
  test_2: null,
  Trimestre: null, matiere_spec: null,
  devoir_2: null, examens: null,
  anne: null
})

// Matière choisie et note correspondante du trimestre affiché
const matiereChoisie = computed(() => tempSpecialites.value.find((i) => i.id === selectedSpecialite.value))
const noteChoisie = computed(() => tempNotes.value.find((i) => i.matiere_spec === selectedSpecialite.value))
// Une note de 0 s'affiche (avant : « N/A » car 0 était traité comme vide)
const valeur = (champ) => noteChoisie.value?.[champ] ?? 'N/A'

onMounted(async () => {
  try {
    // Matières que le prof enseigne dans cette classe (emploi du temps)
    const responseMatiere = await axios.post(`/api/matiere_par_Prof_Classe_sql/`, {
      class_id: route.params.id
    })
    const matieresDeLaClasse = new Set((responseMatiere.data.Matiere ?? []).map((m) => m.matiere_id))
    const matieresDuProf = new Set(
      (useWidget.authUser.userDetail?.matieres?.matiere ?? []).map((m) => m.id),
    )

    // Niveau de la classe : mémorisé à l'ouverture de la classe, sinon relu
    let specialite = localStorage.getItem('specialite')
    if (!specialite || specialite === 'null' || specialite === 'undefined') {
      await useRoom.getClasses(route.params.id)
      specialite = useRoom.focusedClass?.specialite
    }

    // Une seule requête pour le niveau (avant : une requête par matière, qui écrivaient
    // toutes dans le même store ; sans niveau, la requête partait avec specialite=null)
    const responseSpec = specialite
      ? await axios.get('/api/Matiere_spec/', { params: { specialite } })
      : { data: [] }
    tempSpecialites.value = responseSpec.data
      .filter((spec) => matieresDeLaClasse.has(spec.matiere) && matieresDuProf.has(spec.matiere))
      .map((item) => ({
        id: item.id,
        designation: item.matiere_designations,
        specialite: item.specialite,
        nbr_test: item.nbr_test,
        nbr_devoir: item.nbr_devoir
      }))

    if (tempSpecialites.value.length > 0) {
      selectedSpecialite.value = tempSpecialites.value[0].id
      specialiteFilter.value = tempSpecialites.value[0].specialite
    }

    await loadNotes()
  } catch (error) {
    console.error(error)

    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })

  } finally {
    loading.value = false
  }
})



const addTempNote = (note, tab) => {
  tempNote.Trimestre = selectedTrimester.value
  tempNote.matiere_spec = selectedSpecialite.value
  // Année en cours (avant : un identifiant d'année écrit en dur)
  tempNote.anne = useWidget.currentYear?.id ?? null
  Object.assign(useWidget.addNote, {
    add: note ? true : false,
    type: tab,
    type_fr: tab === 'avrege' ? 'moyenne' : tab === 'attendance' ? 'assiduite' : (tab === 'test' || tab === 'test_1') ? 'test_1' : tab === 'test_2' ? 'test_2' : (tab === 'homework' || tab === 'homework_1') ? 'devoir_1' : tab === 'homework_2' ? 'devoir_2' : 'examens',
    open: true,
    note: note ? note : tempNote,
    student: route.params.studentId
  })
}

const loadNotes = async () => {
  try {
    // Année en cours seulement : un redoublant retrouvait sinon ses notes de l'an passé
    const params = { eleve: route.params.studentId }
    if (useWidget.currentYear?.id) params.anne = useWidget.currentYear.id
    let response = await axios.get(`/api/Notes/`, { params })
    notes.value = response.data

    tempNotes.value = response.data.filter(item => item.Trimestre === selectedTrimester.value)
  } catch (error) {
    console.error(error)
  }
}

defineExpose({ addTempNote })

</script>

<style lang="scss" scoped></style>

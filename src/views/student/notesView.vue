<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-[20px] overflow-hidden px-6">


    <commun-dropdown :list="tempSpecialites" :selected="selectedSpecialite" @on-selected-item="async (id) => {
      selectedSpecialite = id
      specialiteFilter = tempSpecialites.find(i => i.id === id).specialite
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

      <!--
      <commun-no-data v-if="abscences.length <= 0" />
v-else
 -->
      <communTable>

        <template #table_header>
          <div
            :class="`w-full h-[55px] bg-secondary border-b border-border-color grid grid-cols-2 gap-1.5 p-[16px] capitalize font-medium`">
            <div class="my-auto truncate">
              évalutaion
            </div>
            <div class="my-auto truncate">
              note
            </div>
          </div>

        </template>

        <template #table_items>

          <div class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2 capitalize">
            <span class="my-auto"> {{ t(`translation.attendance`) }}</span>
            <div class="flex items-center justify-between">
              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).assiduite ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).assiduite : 'N/A'}}</span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'attendance')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>
          </div>

          <div class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.test`) }} {{tempSpecialites.find(i => i.id ===
              selectedSpecialite).nbr_test > 1 ?
              1 : null}}</span>
            <div class="flex items-center justify-between">

              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).test_1 ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).test_1 : 'N/A'}} </span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'test_1')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>
          </div>

          <div v-if="tempSpecialites.find(i => i.id === selectedSpecialite).nbr_test > 1"
            class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.test`) }} 2</span>

            <div class="flex items-center justify-between">

              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).test_2 ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).test_2 : 'N/A'}} </span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'test_2')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>


          </div>
          <div class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.homework`) }} {{tempSpecialites.find(i => i.id ===
              selectedSpecialite).nbr_devoir >
              1 ?
              1 : null}}</span>

            <div class="flex items-center justify-between">

              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).devoir_1 ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).devoir_1 : 'N/A'}} </span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'homework_1')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>
          </div>
          <div v-if="tempSpecialites.find(i => i.id === selectedSpecialite).nbr_devoir > 1"
            class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.homework`) }} 2</span>

            <div class="flex items-center justify-between">


              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).devoir_2 ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).devoir_2 : 'N/A'}}</span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'homework_2')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>
          </div>
          <div class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.exam`) }}</span>


            <div class="flex items-center justify-between">

              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).examens ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).examens : 'N/A'}}</span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'exam')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
            </div>


          </div>
          <div class="w-full h-fit border-b border-border-color grid grid-cols-2 gap-1.5  px-[16px] py-2">
            <span class="my-auto"> {{ t(`translation.avg`) }}</span>

            <div class="flex items-center justify-between">

              <span> {{tempNotes.find(i => i.matiere_spec === selectedSpecialite) && tempNotes.find(i => i.matiere_spec
                ===
                selectedSpecialite).moyenne ? tempNotes.find(i => i.matiere_spec ===
                  selectedSpecialite).moyenne : 'N/A'}}</span>

              <button @click="addTempNote(tempNotes.find(i => i.matiere_spec === selectedSpecialite), 'avrege')
                "
                class="btn btn-sm btn-square fill-warning hover:border-warning  border border-warning bg-transparent hover:bg-warning/10">
                <edit class="w-5"></edit>
              </button>
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
import edit from '@/assets/icons/edit.vue';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStudentStore } from '@/stores/students';
import pdfIcon from '@/assets/icons/pdfIcon.vue';
import { useSubjectStore } from '@/stores/subjects';
import { useWidgetStore } from '@/stores/widget';
import { useRoomStore } from '@/stores/rooms';
import addNoteModal from '@/components/notes/addNoteModal.vue';


const { t } = useI18n()
const route = useRoute()
const fullColumns = ref(1)
const useStudent = useStudentStore()
const useWidget = useWidgetStore()
const useSubject = useSubjectStore()
const loading = ref(true)
const selectedTrimester = ref('First')
const trimesters = ref(['First', 'Second', 'Third'])

const notes = ref([])
const tempNotes = ref([])
const tempSpecialites = ref([])
const useRoom = useRoomStore()
const selectedSpecialite = ref(null)
const specialiteFilter = ref(null)
const matierSpecialites = ref([])

const tempNote = reactive({
  moyenne: null,
  assiduite: null,
  test_1: null,
  devoir_1: null,
  test_2: null,
  Trimestre: null, matiere_spec: null,
  devoir_2: null, examens: null,
  anne: '7e837ea2-228f-4826-a882-5ae56a1d895e'
})

onMounted(async () => {

  try {
    let response = await axios.get(`/api/Notes/?eleve=${route.params.studentId}`)
    notes.value = response.data

    for (let index = 0; index < useWidget.authUser.userDetail.matieres.matiere.length; index++) {
      const element = useWidget.authUser.userDetail.matieres.matiere[index].id
      await useSubject.getMatiereSpecialite(null, 'matiere=' + element + '&specialite=' + localStorage.getItem('specialite'))

      matierSpecialites.value = [...matierSpecialites.value, ...useSubject.matiereSpecialite]
    }

    tempSpecialites.value = matierSpecialites.value.map(item => {
      return {
        id: item.id,
        designation: item.matiere_designations,
        specialite: item.specialite,
        nbr_test: item.nbr_test,
        nbr_devoir: item.nbr_devoir
      }
    })


    selectedSpecialite.value = tempSpecialites.value[0].id
    specialiteFilter.value = tempSpecialites.value[0].specialite

    tempNotes.value = response.data.filter(item => item.Trimestre === selectedTrimester.value)



  } catch (error) {
    console.error(error)

    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })

  }

  loading.value = false
})



const addTempNote = (note, tab) => {
  console.log(note)

  tempNote.Trimestre = selectedTrimester.value
  tempNote.matiere_spec = selectedSpecialite.value
  Object.assign(useWidget.addNote, {
    add: note ? true : false,
    type: tab,
    type_fr: tab === 'avrege' ? 'moyenne' : tab === 'attendance' ? 'assiduite' : (tab === 'test' || tab === 'test_1') ? 'test_1' : tab === 'test_2' ? 'test_2' : (tab === 'homework' || tab === 'homework_1') ? 'devoir_1' : tab === 'homework_2' ? 'devoir_2' : 'examens',
    open: true,
    note: note ? note : tempNote,
    student: route.params.studentId
  })
  console.log(useWidget.addNote)

}

const loadNotes = async () => {
  try {
    let response = await axios.get(`/api/Notes/?eleve=${route.params.studentId}`)
    notes.value = response.data

    tempNotes.value = response.data.filter(item => item.Trimestre === selectedTrimester.value)
  } catch (error) {
    console.error(error)
  }
}

</script>

<style lang="scss" scoped></style>

<template>
  <div class="w-full h-full overflow-hidden pb-3 px-6">
    <!---->
    <div class="w-full h-full overflow-hidden">
      <div class="w-full h-full flex flex-col gap-3">

        <div v-if="loading" class="w-full h-full flex items-center justify-center">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

        <div v-else class="w-full h-full flex flex-col gap-3">

          <add-note-modal @load-data="async () => {
            await loadNotes(selectedSpecialite)
          }" />

          <commun-dropdown :list="tempSpecialite" :selected="selectedSpecialite" @on-selected-item="async (id) => {
            selectedSpecialite = id
            specialiteFilter = tempSpecialite.find(i => i.id === id).specialite
            await loadNotes(selectedSpecialite)
          }"></commun-dropdown>

          <div class="w-full flex-1 flex flex-col gap-3 overflow-hidden">
            <div class="flex items-center justify-between w-full">

              <nav class="w-fit rounded-xl grid grid-cols-3 gap-1 p-1 pixa-border">
                <button @click="async () => {
                  trimester = 1
                  await loadNotes(selectedSpecialite)
                }" :class="trimester === 1 ? 'btn-primary' : 'btn-ghost'"
                  class="btn btn-sm pixa-btn-navigation w-full">{{
                    t('translation.trimester')
                  }} 1</button>
                <button @click="async () => {
                  trimester = 2
                  await loadNotes(selectedSpecialite)
                }" :class="trimester === 2 ? ' btn-primary' : 'btn-ghost'"
                  class="btn btn-sm pixa-btn-navigation w-full">{{
                    t('translation.trimester')
                  }} 2</button>
                <button @click="async () => {
                  await loadNotes(selectedSpecialite)
                  trimester = 3
                }" :class="trimester === 3 ? ' btn-primary' : 'btn-ghost'"
                  class="btn btn-sm pixa-btn-navigation w-full">{{
                    t('translation.trimester')
                  }} 3</button>
              </nav>
            </div>

            <div class="w-full h-8 relative overflow-x-auto hidden-scrollbar">
              <div class="w-fit flex gap-1 h-full">
                <div v-for="i in tabs" :key="i" @click="selectedTab = i"
                  :class="selectedTab === i ? 'bg-secondary-2/10 text-secondary-2 border-secondary-2' : 'bg-trensparent border-border-color-full'"
                  class=" w-fit px-4 h-full uppercase flex items-center justify-center border-b truncate text-xs">
                  {{ t('translation.' + i) }}
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-hidden">


              <div class="w-full h-full flex flex-col gap-3">

                <div class="w-full flex items-center justify-between">

                  <div class="relative flex-1 flex gap-[10px] items-center">
                    <div class="flex-1 flex gap-[10px]">
                      <div class="relative w-full flex items-center">
                        <search class="w-5 h-5 absolute left-3 fill-slate-600" />
                        <input type="text" v-model="query" @input="() => {
                          useStudent.filterdStudents = useStudent.students.filter(i => i.prenom.toLowerCase().includes(query.toLowerCase()) || i.nom.toLowerCase().includes(query.toLowerCase()))

                        }" :placeholder="t('translation.search')" class="pixa-input-icon w-full pr-4 pl-10">
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="loadingData" class="w-full flex-1 flex items-center justify-center">
                  <span class="loading loading-spinner loading-sm"></span>
                </div>
                <div v-else class="w-full flex-1 overflow-hidden">
                  <commun-no-data v-if="useStudent.filterdStudents.length <= 0" />

                  <communTable v-else :grids="fullColumns">

                    <template #table_header>
                      <div
                        :class="['grid-cols-2',
                          `w-full h-[55px] bg-secondary border-b border-border-color grid gap-1.5 p-3 capitalize font-medium`]">

                        <div class="table_header flex items-center gap-3">
                          {{ t(`translation.student`) }}
                        </div>
                        <div class="table_header flex">
                          {{ t(`translation.` + selectedTab) }}
                        </div>
                      </div>
                    </template>
                    <template #table_items>
                      <itemData v-for="item in useStudent.filterdStudents" :key="item.eleve_id" :item="item"
                        :selectedNotes="useSubject.filtredNotes.find(i => i.eleve === item.eleve_id)" :tab="selectedTab"
                        :trimester="trimester === 1 ? 'First' : trimester === 2 ? 'Second' : 'Third'"
                        :specialite="selectedSpecialite">
                      </itemData>
                    </template>
                  </communTable>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<script setup>
import { useWidgetStore } from "@/stores/widget"
import itemData from '@/components/notes/itemData.vue'
import { onMounted, ref, } from "vue"
import communTable from "@/components/commun/communTable.vue"
import communNoData from "@/components/commun/communNoData.vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import search from "@/assets/icons/search.vue"
import { useRoomStore } from "@/stores/rooms"
import { useSubjectStore } from "@/stores/subjects"
import addNoteModal from "@/components/notes/addNoteModal.vue"
import { useStudentStore } from "@/stores/students"
import communDropdown from "@/components/commun/communDropdown.vue"
import axios from "axios"

const { t } = useI18n()
const route = useRoute()
const useWidget = useWidgetStore()
const fullColumns = ref(1)
const trimester = ref(1)
const loading = ref(true)

const query = ref('')
const loadingData = ref(false)
const useRoom = useRoomStore()
const useSubject = useSubjectStore()
const useStudent = useStudentStore()
const tabs = ref(['avrege', 'attendance'])
const selectedTab = ref('avrege')

const tempSpecialite = ref([])
const selectedSpecialite = ref(null)
const specialiteFilter = ref(null)

const matierSpecialites = ref([])

onMounted(async () => {
  try {
    // Fetch matieres for the class
    const response = await axios.post(`/api/matiere_par_Prof_Classe_sql/`, {
      class_id: route.params.id
    })

    const matieres = response.data.Matiere
    const specialite = localStorage.getItem('specialite')
    const userMatieres = useWidget.authUser.userDetail.matieres.matiere

    // Fetch all matiere specialites in parallel
    const promises = userMatieres.map(async (matiere) => {
      await useSubject.getMatiereSpecialite(
        null,
        `matiere=${matiere.id}&specialite=${specialite}`
      )

      // Filter items that match matieres
      return useSubject.matiereSpecialite.filter(spec =>
        matieres.some(m => m.matiere_id === spec.matiere)
      )
    })

    const results = await Promise.all(promises)
    matierSpecialites.value = results.flat()

    console.log(useSubject.matiereSpecialite)

    // Map to tempSpecialite
    tempSpecialite.value = matierSpecialites.value.map(item => ({
      id: item.id,
      designation: item.matiere_designations,
      specialite: item.specialite,
      nbr_test: item.nbr_test,
      nbr_devoir: item.nbr_devoir
    }))

    // Set default values with safety check
    if (tempSpecialite.value.length > 0) {
      selectedSpecialite.value = tempSpecialite.value[0].id
      specialiteFilter.value = tempSpecialite.value[0].specialite
    }

    await loadData()
    loading.value = false
  } catch (error) {
    console.error(error)
    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })
  }
})

const loadData = async () => {
  try {
    await useStudent.getStudents(null, route.params.id)
    console.log(useStudent.filterdStudents.length)

    await loadNotes(selectedSpecialite.value)

    const specialite = localStorage.getItem('specialite')
    const currentSpecialite = useSubject.matiereSpecialite.find(
      i => i.specialite === specialite
    )

    if (!currentSpecialite) {
      throw new Error('Specialite not found')
    }

    // Add test tabs
    const nbrTest = currentSpecialite.nbr_test
    for (let index = 0; index < nbrTest; index++) {
      tabs.value.push(nbrTest === 1 ? 'test' : `test_${index + 1}`)
    }

    // Add homework tabs
    const nbrDevoir = currentSpecialite.nbr_devoir
    for (let index = 0; index < nbrDevoir; index++) {
      tabs.value.push(nbrDevoir === 1 ? 'homework' : `homework_${index + 1}`)
    }

    tabs.value.push('exam')

  } catch (error) {
    console.error(error)
    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })
  }
}

const loadNotes = async (id) => {
  try {
    loadingData.value = true
    const trimesterMap = { 1: 'First', 2: 'Second', 3: 'Third' }
    const filter = `${id}&Trimestre=${trimesterMap[trimester.value]}`
    await useSubject.getNotes(filter)
    loadingData.value = false
  } catch (error) {
    console.error(error)
  }
}

</script>


<style lang="scss" scoped></style>

<template>
  <div class="w-full h-full overflow-hidden pb-3">

    <div class="w-full h-full overflow-hidden">
      <div class="w-full h-full flex flex-col gap-3">

        <div v-if="loading" class="w-full h-full flex items-center justify-center">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

        <div v-else class="w-full h-full flex flex-col gap-3 px-6">

          <div class="w-full flex-1 flex flex-col gap-3 overflow-hidden">

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
                        :class="['grid-cols-3',
                          `w-full h-[55px] bg-secondary border-b border-border-color grid gap-1.5 p-3 capitalize font-medium`]">

                        <div class="table_header flex items-center gap-3">
                          {{ t(`translation.student`) }}
                        </div>
                        <div class="table_header flex items-center gap-3">
                          {{ t(`translation.gender`) }}
                        </div>
                        <div class="table_header flex items-center gap-3">
                          {{ t(`translation.birthDay`) }}
                        </div>
                      </div>
                    </template>
                    <template #table_items>
                      <itemData v-for="item in useStudent.filterdStudents" :key="item.id" :item="item"
                        :selectedNotes="useSubject.filtredNotes.find(i => i.eleve === item.id)" :tab="selectedTab"
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
import itemData from '@/components/students/itemData.vue'
import { onMounted, ref, } from "vue"
import communTable from "@/components/commun/communTable.vue"
import communNoData from "@/components/commun/communNoData.vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import search from "@/assets/icons/search.vue"
import { useSubjectStore } from "@/stores/subjects"
import { useStudentStore } from "@/stores/students"

const { t } = useI18n()
const route = useRoute()
const useWidget = useWidgetStore()
const fullColumns = ref(1)
const trimester = ref(1)
const loading = ref(true)

const query = ref('')
const loadingData = ref(false)
const useSubject = useSubjectStore()
const useStudent = useStudentStore()
const selectedTab = ref('avrege')

const selectedSpecialite = ref(null)

onMounted(async () => {

  try {
    await loadData()
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})

const loadData = async () => {
  try {
    await useStudent.getStudents(null, route.params.id)
    console.log(useStudent.filterdStudents);

  } catch (error) {
    console.error(error)
    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })
  }
}
</script>


<style lang="scss" scoped></style>

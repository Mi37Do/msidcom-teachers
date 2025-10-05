<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-3 mt-1.5">
    <div class="px-6 w-full">
      <commun-dropdown :list="tempSpecialite" :selected="selectedSpecialite" @on-selected-item="async (id) => {
        selectedSpecialite = id

        specialiteFilter = tempSpecialite.find(i => i.id === selectedSpecialite).subject
        await loadData(id)
        console.log(programs)
      }"></commun-dropdown>
    </div>


    <div v-if="programs.find(i => i.matiere_id ===
      specialiteFilter)"
      class="flex-1 overflow-hidden flex flex-col gap-3 bg-white border-y border-border-color  px-6 py-3">

      <div class="h-14 flex gap-3 my-1.5 items-center">
        <div class="w-14 h-14 bg-primary/30 rounded-lg flex items-center justify-center">
          <book-icon class="w-8 h-8 fill-slate-700" />
        </div>
        <div class="flex-1 flex flex-col gap-1.5">
          <span class="font-medium">{{programs.find(i => i.matiere_id ===
            specialiteFilter).programe_designations}}</span>
          <div class="flex items-center gap-3 w-full ">
            <div class="flex-1">
              <commun-progress-bar :value="programs.find(i => i.matiere_id ===
                specialiteFilter)?.progress_percentage" />
            </div>
            <span class="text-primary font-semibold">{{programs.find(i => i.matiere_id ===
              specialiteFilter)?.progress_percentage}}%</span>
          </div>
        </div>
      </div>

      <div v-if="loadingData" class="w-full flex-1 flex items-center justify-center">
        <span class="loading loading-spinner loading-sm"></span>
      </div>
      <div v-else class="flex-1 overflow-hidden flex flex-col gap-3">
        <div class="w-full h-full overflow-auto">
          <div class="h-fit flex flex-col gap-3 pb-3">
            <div v-for="(program, index) in programs.find(i => i.matiere_id ===
              specialiteFilter)?.chapitres
          " :key="program" class="h-fit flex flex-col gap-3 border-b border-border-color pb-3">
              <span class="text-lg font-semibold text-secondary-2">{{ index + 1 }} - {{ program.chapitre_designation }}
                ( {{program.cours.filter(i => i.est_accompli === true)?.length}}/{{
                  program.cours.length }} )</span>
              <div v-for="cours in program.cours" :key="cours.cour_id"
                @click="validCours(cours.cour_id, !cours.est_accompli)" class="w-full h-10 flex gap-1.5 items-center">
                <span :class="cours.est_accompli ? 'text-secondary-2' : ''" class="flex-1 font-semibold truncate">- {{
                  cours.cour_designation }}</span>
                <div class="w-6 h-6 rounded-md">
                  <check-icon v-if="cours.est_accompli" class="fill-secondary-2" />
                  <times v-else class="fill-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <commun-no-data v-else />
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/rooms';
import checkIcon from '@/assets/icons/checkIcon.vue';
import times from '@/assets/icons/times.vue';
import { useSubjectStore } from '@/stores/subjects';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import communDropdown from '@/components/commun/communDropdown.vue';
import bookIcon from '@/assets/icons/bookIcon.vue';
import communProgressBar from '@/components/commun/communProgressBar.vue';
import { useRoute } from 'vue-router';
import { useWidgetStore } from '@/stores/widget';
import communNoData from '@/components/commun/communNoData.vue';

const useSubject = useSubjectStore()
const useRoom = useRoomStore()
const tempSpecialite = ref([])
const selectedSpecialite = ref(null)
const loading = ref(true)
const loadingData = ref(true)
const programs = ref([])
const route = useRoute()
const useWidget = useWidgetStore()
const matierSpecialites = ref([])
const specialiteFilter = ref(null)

onMounted(async () => {
  try {

    for (let index = 0; index < useWidget.authUser.userDetail.matieres.matiere.length; index++) {
      const element = useWidget.authUser.userDetail.matieres.matiere[index].id
      await useSubject.getMatiereSpecialite(null, 'matiere=' + element + '&specialite=' +
        localStorage.getItem('specialite'))

      matierSpecialites.value = [...matierSpecialites.value, ...useSubject.matiereSpecialite]
    }




    tempSpecialite.value = matierSpecialites.value.map(item => {
      return {
        id: item.id,
        designation: item.matiere_designations,
        specialite: item.specialite,
        subject: item.matiere,
      }
    })


    selectedSpecialite.value = tempSpecialite.value[0].id
    specialiteFilter.value = tempSpecialite.value[0].subject

    console.log(specialiteFilter.value);

    await loadData(route.params.id)
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})

const loadData = async (id) => {
  console.log(id);

  try {
    loadingData.value = true
    let response = await axios.post(`/api/Programe_Stats_classe_SQL/`, {
      class_id: id
    })
    console.log(response.data);

    programs.value = response.data.taux_avancement_class

    if (programs.value.length > 0) {
      loadingData.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

const validCours = async (id, status) => {
  console.log(status);

  console.log(id);
  try {
    let response = await axios.post(`/api/cours-avancement/mark-completed/`, {
      classe_id: route.params.id,
      cours_id: id,
      is_completed: status
    })
    console.log(response.data);

    await loadData(route.params.id)
  } catch (error) {
    console.error(error)

  }
}

</script>

<style lang="scss" scoped></style>

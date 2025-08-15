<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-3 mt-1.5 px-6">
    <commun-dropdown :list="tempSpecialite" :selected="selectedSpecialite" @on-selected-item="async (id) => {
      selectedSpecialite = id
      await loadData(id)
      console.log(programs)
    }"></commun-dropdown>

    <div class="flex-1 overflow-hidden flex flex-col gap-3">

      <div class="h-14 flex gap-3 my-1.5 items-center">
        <div class="w-14 h-14 bg-primary/30 rounded-lg flex items-center justify-center">
          <book-icon class="w-8 h-8 fill-slate-700" />
        </div>
        <div class="flex-1 flex flex-col gap-1.5">
          <span class="font-medium">Taux d’avancement du programme :</span>
          <div class="flex items-center gap-3 w-full px-3">
            <div class="flex-1">
              <commun-progress-bar />
            </div>
            <span class="text-primary font-semibold">66%</span>
          </div>
        </div>
      </div>

      <div v-if="loadingData" class="w-full flex-1 flex items-center justify-center">
        <span class="loading loading-spinner loading-sm"></span>
      </div>
      <div v-else class="flex-1 overflow-hidden flex flex-col gap-3">
        <div class="w-full h-full overflow-auto">
          <div class="h-fit flex flex-col gap-3 pb-3">
            <div v-for="(program, index) in programs[0].chapters
          " :key="program" class="h-fit flex flex-col gap-3 border-b border-border-color pb-3">
              <span class="text-lg font-semibold text-secondary-2">{{ index + 1 }} - {{ program.designation }} ( {{
                program.cours.length }} )</span>
              <div v-for="cours in program.cours" :key="cours.id" class="w-full h-6 flex gap-1.5 items-center">
                <span class="flex-1 font-medium">- {{ cours.designation }}</span>
                <div class="w-6 h-6 bg-secondary-2/20 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/rooms';
import { useSubjectStore } from '@/stores/subjects';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import communDropdown from '@/components/commun/communDropdown.vue';
import bookIcon from '@/assets/icons/bookIcon.vue';
import communProgressBar from '@/components/commun/communProgressBar.vue';

const useSubject = useSubjectStore()
const useRoom = useRoomStore()
const tempSpecialite = ref([])
const selectedSpecialite = ref(null)
const loading = ref(true)
const loadingData = ref(true)
const programs = ref([])

onMounted(async () => {
  try {
    tempSpecialite.value = useSubject.matiereSpecialite.filter(i => i.specialite
      === useRoom.focusedClass.specialite).map(item => {
        return {
          id: item.id,
          designation: item.matiere_designations
        }
      })
    selectedSpecialite.value = tempSpecialite.value[0].id
    await loadData(selectedSpecialite.value)
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})

const loadData = async (id) => {
  try {
    loadingData.value = true
    let response = await axios.get(`/api/Programe_chapter_cours/?matiere_specialite=${id}`)
    programs.value = response.data
    if (programs.value.length > 0) {
      loadingData.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

</script>

<style lang="scss" scoped></style>

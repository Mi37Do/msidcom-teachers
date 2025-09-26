<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-3">

    <SummonDetailModal :item="useStudent.focusedSummon" />

    <div class="relative flex items-center gap-3 w-full">
      <search class="w-5 h-5 absolute left-3 fill-slate-600" />
      <input type="text" v-model="query" @input="() => {
        filtredHistorique = historique.filter(i => i.eleve_designations.eleve_designations_prenom
          .toLowerCase().includes(query.toLowerCase()) || i.eleve_designations.
            eleve_designations_nom
            .toLowerCase().includes(query.toLowerCase()))

      }" :placeholder="t('translation.search')" class="pixa-input-icon w-full pr-4 pl-10">
    </div>

    <commun-table>
      <template #table_header>
        <div
          :class="[
            `w-full h-[55px] bg-secondary border-b border-border-color grid gap-1.5 p-[16px] capitalize font-medium grid-cols-2`]">
          <div class="table_header">
            {{ t(`translation.student`) }}
          </div>
          <div class="table_header">
            {{ t(`translation.date&hours`) }}
          </div>
        </div>
      </template>

      <!---->
      <template #table_items>
        <HistoriqueData v-for="item in filtredHistorique" :key="item.id" :item="item" />
      </template>
    </commun-table>
  </div>
</template>

<script setup>

import communTable from "@/components/commun/communTable.vue";
import search from '@/assets/icons/search.vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from "vue-router";
import { useStudentStore } from "@/stores/students";
import HistoriqueData from "@/components/summons/historiqueData.vue";
import axios from "axios";
import SummonDetailModal from "@/components/summons/summonDetailModal.vue";

const { t } = useI18n()
const query = ref('')
const route = useRoute()
const loading = ref(true)
const useStudent = useStudentStore()
const filtredHistorique = ref([])
const historique = ref([])

onMounted(async () => {
  try {
    let response = await axios.get(`/api/Convocations_eleve/?eleve__classe=${route.params.id}`)
    historique.value = response.data
    filtredHistorique.value = response.data
  } catch (error) {
    console.error(error)
  }
  loading.value = false
})

</script>

<style lang="scss" scoped></style>

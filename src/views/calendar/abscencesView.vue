<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-3 px-6 py-3 items-end">

    <addLateModal :id="useWidget.authUser.userDetail.id" :type="'prof'" @loadData="async (obj) => {
      await loadData()
    }" />

    <add-justify-modal @loadData="async (obj) => {
      await loadData()
    }" />

    <button @click=" useWidget.addLateProf = true"
      class="btn btn-sm pixa-btn border border-warning bg-transparent hover:bg-warning/10 w-14 text-warning hover:border-warning ">
      <no-time-warning class="w-5" />
    </button>

    <commun-table>
      <template #table_header>
        <div
          :class="[
            `w-full h-[55px] bg-secondary border-b border-border-color grid gap-1.5 p-[16px] capitalize font-medium grid-cols-3`]">
          <div class="table_header">
            {{ t(`translation.type`) }}
          </div>
          <div class="table_header">
            {{ t(`translation.date&hours`) }}
          </div>
          <div class="table_header">
            {{ t(`translation.justify`) }}
          </div>
        </div>
      </template>

      <template #table_items>
        <HistoriqueData v-for="item in filtredHistorique" :key="item.id" :item="item" />
      </template>
    </commun-table>
  </div>
</template>

<script setup>

import communTable from "@/components/commun/communTable.vue";
import search from '@/assets/icons/search.vue';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from "vue-router";
import { useStudentStore } from "@/stores/students";
import HistoriqueData from "@/components/calendar/historiqueData.vue";
import axios from "axios";
import { useWidgetStore } from "@/stores/widget";
import noTimeWarning from "@/assets/icons/noTimeWarning.vue";
import addLateModal from "@/components/abscences/addLateModal.vue";
import addJustifyModal from "@/components/abscences/addJustifyModal.vue";

const { t } = useI18n()
const query = ref('')
const route = useRoute()
const loading = ref(true)
const useStudent = useStudentStore()
const filtredHistorique = ref([])
const historique = ref([])
const useWidget = useWidgetStore()
const emits = defineEmits(['loadData'])

const dateOptions = reactive(
  {
    type: 'birth',
    min: null,
    max: null,
    date: null,
    title: '',
    message: '',
    load: false,
    pathValue: ''
  }
)

onMounted(async () => {
  await loadData()
  loading.value = false
})

const loadData = async () => {
  try {
    let response = await axios.get(`/api/Abs_Retard_Prof/?prof=${useWidget.authUser.userDetail.id}`)
    historique.value = response.data
    filtredHistorique.value = response.data

    console.log(response.data)

  } catch (error) {
    console.error(error)
  }
}

</script>

<style lang="scss" scoped></style>

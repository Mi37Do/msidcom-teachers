<template>
  <div class="w-full h-full flex flex-col gap-3 pb-3 px-6">
    <div class="relative flex items-center gap-3 w-full">
      <search class="w-5 h-5 absolute left-3 fill-slate-600" />
      <input type="text" v-model="query" @input="() => {
        useStudent.filterdStudents = useStudent.students.filter(i => i.prenom.toLowerCase().includes(query.toLowerCase()) || i.nom.toLowerCase().includes(query.toLowerCase()))

      }" :placeholder="t('translation.search')" class="pixa-input-icon w-full pr-4 pl-10">
    </div>
    <commun-late-modal :student="useStudent.focusedStudent" :type="'student'" />
    <commun-table>
      <template #table_header>
        <div
          :class="`w-full h-[55px] bg-secondary border-b border-border-color grid grid-cols-2 gap-1.5 p-[16px] capitalize font-medium`">
          <div class="table_header">
            {{ t(`translation.student`) }}
          </div>
          <div class="table_header">
            {{ t(`translation.presence`) }}
          </div>
        </div>
      </template>

      <template #table_items>
        <item-data v-for="item in useStudent.filterdStudents" :key="item.id" :item="item" />
      </template>
    </commun-table>
  </div>
</template>

<script setup>

import communTable from "@/components/commun/communTable.vue";
import communNoData from "@/components/commun/communNoData.vue";
import search from '@/assets/icons/search.vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import itemData from "@/components/abscences/itemData.vue";
import { useRoute } from "vue-router";
import { useStudentStore } from "@/stores/students";
import communLateModal from '@/components/commun/communLateModal.vue';

const { t } = useI18n()
const query = ref('')
const abscences = ref([])
const route = useRoute()
const filtredAbscences = ref([])
const loading = ref(true)
const useStudent = useStudentStore()

onMounted(async () => {

  await useStudent.getStudents(null, `&classe=${route.params.id}`)
  console.log(useStudent.filterdStudents)

  loading.value = false
})

</script>

<style lang="scss" scoped></style>

<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full flex flex-col gap-[16px] overflow-hidden px-6">
    <!-- Filter Controls -->
    <div class="flex gap-3 flex-col">
      <div class="flex relative flex-1">
        <commun-dropdown class="w-72" :list="filters" :selected="selectedType"
          @on-selected-item="handleTypeFilterChange">
          <template #prefix>
            <div class="flex items-center gap-[10px]">
              <filter-icon class="w-[24px]" />
              <span class="capitalize"> {{ t('translation.filterBy') }} {{ t('translation.type') }}</span>
            </div>
          </template>
        </commun-dropdown>
      </div>


    </div>

    <!-- Data Table -->
    <div class="w-full flex-1 overflow-hidden">
      <commun-no-data v-if="filteredAbsences.length <= 0" />
      <communTable v-else :columns="columns" :grids="fullColumns">
        <template #table_header>
          <div
            :class="`w-full h-[55px] bg-secondary border-b border-border-color grid grid-cols-3 gap-1.5 p-[16px] capitalize font-medium`">
            <div class="table_header">
              {{ t(`translation.type`) }}
            </div>
            <div class="table_header col-span-1">
              {{ t(`translation.date&hours`) }}
            </div>
            <div class="justify-center table_header">
              {{ t(`translation.justify`) }}
            </div>
          </div>
        </template>

        <template #table_items>
          <item-data v-for="item in filteredAbsences" :key="item.id" :item="item" />
        </template>
      </communTable>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { parseISO, format, subDays } from 'date-fns';

// Components
import communTable from '@/components/commun/communTable.vue';
import communNoData from '@/components/commun/communNoData.vue';
import itemData from '@/components/students/abscences/itemData.vue';
import communDropdown from '@/components/commun/communDropdown.vue';
import Calendar from '@/assets/icons/calendar.vue';
import filterIcon from '@/assets/icons/filterIcon.vue';

// Stores
import { useStudentStore } from '@/stores/students';
import { useWidgetStore } from '@/stores/widget';

const { t } = useI18n();
const route = useRoute();
const useStudent = useStudentStore();
const useWidget = useWidgetStore();

const loading = ref(true);
const fullColumns = ref(1);
const selectedType = ref('All');
const mask = ref({ input: 'DD-MM-YYYY' });

const rangeFrom = ref(null)
const rangeTo = ref(null)

const filters = ref([
  { id: 'All', designation: 'Tout' },
  { id: 'Absence', designation: 'Absence' },
  { id: 'Retard', designation: 'Retard' }
]);

const columns = ref([
  { id: 1, title: "type", size: 1 },
  { id: 2, title: "date & heure", size: 1 },
  { id: 3, title: "justification", size: 1 },
]);


const filteredAbsences = computed(() => {
  let result = useStudent.abscences;
  // Filter by type
  if (selectedType.value !== 'All') {
    result = result.filter(item => item.type === selectedType.value);
  }

  return result;
});


// Methods
const handleTypeFilterChange = (id) => {
  selectedType.value = id;
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await useStudent.getAbscences(route.params.studentId, 'student')
  } catch (error) {
    console.error(error);
    useWidget.addToast({
      msg: error.message,
      color: 'red'
    });
  }
  loading.value = false;
})


</script>

<style lang="scss" scoped></style>

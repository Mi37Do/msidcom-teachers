<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full px-6 pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full">
      <div class=" flex items-center gap-[10px] capitalize">

        <span class="pixa-title-2 flex-1 leading-loose mb-2">
          {{ t('translation.examsAnnoncements') }} :
        </span>
      </div>
    </div>

    <div class="w-full">

      <commun-dropdown :list="tempSpecialite" :selected="selectedType" @on-selected-item="(id) => {
        if (id === 'Tout') {
          useRoom.filtredExams = useRoom.exams
        } else {
          useRoom.filtredExams = useRoom.exams.filter(item => item.specialite === id)
        }
        selectedType = id
      }">

        <template #prefix>
          <div class="flex items-center gap-[10px]">
            <filter-icon class="w-[24px]" />
            <span class="capitalize"> {{ t('translation.filterBy') }} {{ t('translation.levelTitle') }}</span>
          </div>
        </template>
      </commun-dropdown>
    </div>

    <commun-no-data v-if="useRoom.filtredExams.length <= 0" />

    <div v-else class="flex-1 overflow-hidden">
      <div class="h-full overflow-auto">
        <div v-if="useRoom.classes.length > 0" class="h-fit flex flex-col gap-2 pb-3">
          <item-data v-for="item in useRoom.filtredExams" :key="item.id" :item="item" />

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/rooms';
import { useSubjectStore } from '@/stores/subjects';
import { useWidgetStore } from '@/stores/widget';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import itemData from "@/components/exams/itemData.vue";
import communNoData from "@/components/commun/communNoData.vue";
import communDropdown from "@/components/commun/communDropdown.vue";
import filterIcon from "@/assets/icons/filterIcon.vue";


const loading = ref(true)
const useRoom = useRoomStore()
const useWidget = useWidgetStore()
const useSubject = useSubjectStore()
const { t } = useI18n()
const tempClasses = ref([])
const tempSpecialite = ref([])
const selectedType = ref('Tout')

onMounted(async () => {
  try {
    await useRoom.getExams()

    await useRoom.getClasses();

    tempSpecialite.value = useRoom.classes.map(item => {
      return {
        id: item.specialite_id,
        designation: item.specialite_designation
      }
    })


    tempSpecialite.value.unshift(
      {
        id: 'Tout',
        designation: t('translation.all')
      }
    )
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})


onBeforeUnmount(() => {
  loading.value = true
  tempClasses.value = []

})
</script>

<style lang="scss" scoped></style>

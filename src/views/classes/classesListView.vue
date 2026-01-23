<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full px-6 pt-6 flex flex-col gap-3">

    <div class="flex items-center justify-between w-full">
      <div class=" flex items-center gap-[10px] capitalize">

        <span class="pixa-title-2 flex-1 leading-loose mb-2">
          {{ t('translation.myClasses') }} :
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-auto">
        <div v-if="useRoom.classes.length > 0" class="h-fit flex flex-col gap-2 pb-3">
          <!----> <item-data-class v-for="classe in useRoom.classes" :key="classe.classe_id" :item="classe" />

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import itemDataClass from '@/components/classes/itemDataClass.vue';
import { useRoomStore } from '@/stores/rooms';
import { useSubjectStore } from '@/stores/subjects';

const { t } = useI18n();
const loading = ref(true);
const useRoom = useRoomStore();
const useSubject = useSubjectStore();

const filteredClasses = computed(() => {
  return useRoom.classes
    .filter(classItem =>
      useSubject.matiereSpecialite.some(spec =>
        spec.specialite === classItem.specialite
      )
    )
    .map(classItem => ({
      ...classItem,
      specialite: useSubject.matiereSpecialite.filter(
        spec => spec.specialite === classItem.specialite
      )
    }));
});

const hasClasses = computed(() =>
  useSubject.matiereSpecialite.length > 0 && filteredClasses.value.length > 0
);

onMounted(async () => {
  try {
    await useRoom.getClasses();
    console.log(useRoom.classes);

  } catch (error) {
    console.error('Failed to load classes:', error);
    // Consider adding error state handling here
  } finally {
    loading.value = false;
  }
});
onBeforeUnmount(() => {
  loading.value = true

})
</script>

<style lang="scss" scoped></style>

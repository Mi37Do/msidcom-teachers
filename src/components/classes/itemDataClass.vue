<template>
  <div class="flex flex-col gap-3 bg-white p-3 rounded-xl border  border-slate-200 font-medium h-fit">
    <div class="w-full  flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-primary/40 rounded-full flex items-center justify-center">
        <calendar class="w-5 h-5" />
      </div>
      <span class="truncate flex-1 text-lg font-medium capitalize">{{ t('translation.classe') }}: {{
        item.specialite_designation
      }} - {{ item?.class_num ?? 'N/A' }}</span>

      <slot name="options" />
    </div>


    <div class="w-full grid grid-cols-2 gap-3 px-3">
      <span class="capitlize font-semibold">{{ t('translation.students') }}</span>
      <!-- « Nom Prénom, 24 autres élèves » (texte traduit ; plus de « , 0 autres » pour un élève seul) -->
      <span class="truncate auto-dir">{{ item.premier_eleve_info?.first_eleve_nom }} {{
        item.premier_eleve_info?.first_eleve_prenom }}{{
          item.premier_eleve_info?.['nombre-eleve_dans_la_classe'] > 1
            ? `, ${item.premier_eleve_info['nombre-eleve_dans_la_classe'] - 1} ${t('translation.otherStudents')}`
            : '' }}</span>
    </div>

    <div class="w-full grid grid-cols-2 gap-3 px-3">
      <span class="capitlize font-semibold">{{ t('translation.subject') }}</span>
      <div class="flex gap-1 flex-wrap truncate auto-dir"> <span v-for="(mat, index) in item.matiere_designation" :key="mat">{{
        mat }}{{ index < item.matiere_designation.length - 1 ? ',' : '' }}</span></div>
    </div>

    <button @click="selectClass(item)" class="btn btn-sm pixa-btn w-fit pixa-btn-nofloat">{{
      t('translation.access') }}
      <angle-icon :class="useWidget.userLanguage === 'ar' ? '' : 'rotate-90'" class="w-5 h-5" />
    </button>
  </div>

</template>

<script setup>
import calendar from '@/assets/icons/calendar.vue';
import { useI18n } from 'vue-i18n';
import communProgressBar from '../commun/communProgressBar.vue';
import angleIcon from '@/assets/icons/angleIcon.vue';
import { useRouter } from 'vue-router';
import { useWidgetStore } from '@/stores/widget';

const props = defineProps(['item'])
const router = useRouter()
const useWidget = useWidgetStore()

const { t } = useI18n()

const selectClass = (item) => {
  let current = item.specialite_designation + ' - ' + item.class_num
  localStorage.setItem('current_class', current)
  localStorage.setItem('specialite', item.specialite_id)
  router.push({ name: 'class-panel', params: { id: item.classe_id } })
}
</script>

<style lang="scss" scoped></style>

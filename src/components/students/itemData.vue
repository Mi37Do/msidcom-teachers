<template>
  <router-link :to="{ name: 'student-view', params: { studentId: item.eleve_id } }"
    class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-3 grid gap-1.5 grid-cols-3 h-14">
    <span class="my-auto truncate flex items-center gap-3">
      <span class="truncate auto-dir">
        {{ item.prenom }} {{ item.nom }}</span>
    </span> <span class="my-auto truncate flex items-center gap-3">
      <span class="">
        {{ translatedGender }}</span>
    </span>
    <div class="my-auto truncate flex items-center gap-3">
      <span class="">
        {{ format(parse(item.birthday, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') }}</span>

      <angle-icon :class="useWidget.userLanguage === 'ar' ? '' : 'rotate-90'" class="w-5" />
    </div>
  </router-link>
</template>

<script setup>
import angleIcon from '@/assets/icons/angleIcon.vue';
import { useWidgetStore } from '@/stores/widget';
import { format, parse } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n()
const props = defineProps(['item'])
const useWidget = useWidgetStore()

const translatedGender = computed(() => {
  if (props.item.sexe === 'Masculin') return t('translation.male')
  if (props.item.sexe === 'Féminin') return t('translation.female')
  return props.item.sexe
})

</script>

<style lang="scss" scoped></style>

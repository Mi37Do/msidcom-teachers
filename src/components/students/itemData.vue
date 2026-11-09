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
        {{ dateNaissance }}</span>

      <angle-icon :class="useWidget.userLanguage === 'ar' ? '' : 'rotate-90'" class="w-5" />
    </div>
  </router-link>
</template>

<script setup>
import angleIcon from '@/assets/icons/angleIcon.vue';
import { useWidgetStore } from '@/stores/widget';
import { format, isValid, parse } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n()
const props = defineProps(['item'])
const useWidget = useWidgetStore()

// Le serveur enregistre « Feminin » sans accent
const translatedGender = computed(() => {
  if (props.item.sexe === 'Masculin') return t('translation.male')
  if (props.item.sexe === 'Feminin' || props.item.sexe === 'Féminin') return t('translation.female')
  return props.item.sexe || t('translation.notApplicable')
})

// Date de naissance facultative : sans elle, parse() plantait toute la liste
const dateNaissance = computed(() => {
  if (!props.item.birthday) return t('translation.notApplicable')
  const date = parse(props.item.birthday, 'yyyy-MM-dd', new Date())
  return isValid(date) ? format(date, 'dd-MM-yyyy') : t('translation.notApplicable')
})

</script>

<style lang="scss" scoped></style>

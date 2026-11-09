<template>
  <!-- Deux onglets : à venir (mois en cours et suivants) / anciens (avant le mois en cours) -->
  <div class="w-fit rounded-xl flex gap-1 p-1 pixa-border shrink-0">
    <button v-for="onglet in onglets" :key="onglet.id" type="button" @click="emit('update:modelValue', onglet.id)"
      :class="modelValue === onglet.id ? 'btn-primary' : 'btn-ghost'"
      class="btn btn-sm pixa-btn-navigation capitalize flex gap-2 items-center">
      <span>{{ onglet.libelle }}</span>
      <span class="badge badge-sm border-0"
        :class="modelValue === onglet.id ? 'bg-white/30 text-inherit' : 'bg-slate-200 text-slate-700'">{{
          onglet.nombre }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: { type: String, default: 'a_venir' },
  nombreAVenir: { type: Number, default: 0 },
  nombreAnciens: { type: Number, default: 0 },
  // 'anciennes' pour les annonces, 'anciens' pour les événements
  libelleAnciens: { type: String, default: 'anciennes' },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const onglets = computed(() => [
  { id: 'a_venir', libelle: t('translation.a_venir'), nombre: props.nombreAVenir },
  { id: 'anciens', libelle: t(`translation.${props.libelleAnciens}`), nombre: props.nombreAnciens },
])
</script>

<template>
  <!-- Mode jour / mode nuit (choix mémorisé sur l'appareil) : lune en mode jour, soleil en mode nuit.
       Taille et fond donnés par l'écran (en-tête à côté des notifications, page de connexion) -->
  <button type="button" class="btn p-0 shadow-none" :aria-label="t('translation.darkMode')" :aria-pressed="estNuit"
    @click="basculer">
    <svg v-if="estNuit" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { estNuit, basculer } = useTheme()
</script>

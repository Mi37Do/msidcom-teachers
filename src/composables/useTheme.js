import { computed, ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard'
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area'

// Mode jour / mode nuit, mémorisé sur l'appareil. Le thème est posé sur <html> :
// data-theme (couleurs daisyUI + src/assets/nuit.css), la classe theme-nuit et color-scheme
// (champs, listes et barres de défilement du système en sombre)
const CLE = 'msidcom-theme'
const NUIT = 'nuit'
const JOUR = 'mytheme'

const lire = () => {
  try {
    const valeur = localStorage.getItem(CLE)
    return valeur === NUIT || valeur === JOUR ? valeur : null
  } catch {
    return null
  }
}

const theme = ref(lire() ?? JOUR)
let clavierModifie = false

// Barre d'état et barre de navigation du téléphone : icônes claires sur l'en-tête sombre.
// Clavier sombre sur iPhone (Android suit seul le réglage du téléphone) ; en mode jour, le
// clavier n'est touché que pour revenir du mode nuit
export const styliserBarresSysteme = async () => {
  if (!Capacitor.isNativePlatform()) return
  const nuit = theme.value === NUIT
  try {
    await SafeArea.setSystemBarsStyle({ style: nuit ? SystemBarsStyle.Dark : SystemBarsStyle.Light })
  } catch (error) {
    console.error('SafeArea.setSystemBarsStyle failed:', error)
  }
  if (Capacitor.getPlatform() === 'ios' && (nuit || clavierModifie)) {
    clavierModifie = true
    try {
      await Keyboard.setStyle({ style: nuit ? KeyboardStyle.Dark : KeyboardStyle.Default })
    } catch (error) {
      console.error('Keyboard.setStyle failed:', error)
    }
  }
}

const appliquer = (valeur) => {
  const racine = document.documentElement
  racine.setAttribute('data-theme', valeur)
  racine.classList.toggle('theme-nuit', valeur === NUIT)
  racine.style.colorScheme = valeur === NUIT ? 'dark' : 'light'
  styliserBarresSysteme()
}

// Dès le chargement de l'application, avant le premier affichage (pas de flash blanc)
appliquer(theme.value)

// Le téléphone peut vider le stockage de la page (iOS, manque de place) : le choix est
// aussi gardé dans les préférences de l'application, relues dans ce cas
if (lire() === null) {
  Preferences.get({ key: CLE })
    .then(({ value }) => {
      if (value !== NUIT || lire() !== null) return
      theme.value = NUIT
      try {
        localStorage.setItem(CLE, NUIT)
      } catch {
        // Stockage indisponible : le choix vaut pour cette ouverture de l'application
      }
      appliquer(NUIT)
    })
    .catch(() => {})
}

export function useTheme() {
  const estNuit = computed(() => theme.value === NUIT)

  const basculer = () => {
    theme.value = estNuit.value ? JOUR : NUIT
    try {
      localStorage.setItem(CLE, theme.value)
    } catch {
      // Stockage indisponible : le choix reste gardé dans les préférences de l'application
    }
    Preferences.set({ key: CLE, value: theme.value }).catch(() => {})
    appliquer(theme.value)
  }

  return { theme, estNuit, basculer }
}

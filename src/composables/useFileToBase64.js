import { ref } from 'vue'
import { lireFichier } from '@/utils/fichiers'

export function useFileToBase64() {
  const base64Result = ref(null)

  // « data:<type>;base64,… » avec le type du fichier, même quand le téléphone ne le donne pas :
  // c'est lui qui permet de le rouvrir et de le télécharger dans son format d'origine
  const convertToBase64 = async (file) => {
    base64Result.value = await lireFichier(file)
    return base64Result.value
  }

  return {
    base64Result,
    convertToBase64,
  }
}

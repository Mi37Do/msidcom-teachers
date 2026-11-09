import { computed, ref } from 'vue'

// Annonces et événements en deux onglets : « à venir » = mois en cours et suivants,
// « anciens » = avant le 1er du mois en cours.

// 'YYYY-MM-DD' (date seule) = minuit local ; le reste (date et heure) est lu tel quel
const enDate = (valeur) => {
  if (!valeur) return null
  if (valeur instanceof Date) return valeur
  const jour = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur)
  if (jour) return new Date(Number(jour[1]), Number(jour[2]) - 1, Number(jour[3]))
  const date = new Date(valeur)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * @param liste    ref / computed d'un tableau
 * @param dateDe   (item) => date de référence de l'élément (texte ISO ou Date)
 * @param options  { trierAVenir: true } : à venir du plus proche au plus lointain,
 *                 anciens du plus récent au plus ancien (sinon l'ordre reçu est gardé)
 */
export function usePeriodes(liste, dateDe, { trierAVenir = false } = {}) {
  const periode = ref('a_venir')

  const separees = computed(() => {
    const maintenant = new Date()
    const debutDuMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1)
    const aVenir = []
    const anciens = []
    for (const item of liste.value ?? []) {
      const date = enDate(dateDe(item))
      // Sans date : rangé dans « à venir », pour rester visible
      ;(date && date < debutDuMois ? anciens : aVenir).push(item)
    }
    if (trierAVenir) {
      const temps = (item) => enDate(dateDe(item))?.getTime() ?? 0
      aVenir.sort((a, b) => temps(a) - temps(b))
      anciens.sort((a, b) => temps(b) - temps(a))
    }
    return { aVenir, anciens }
  })

  const affichees = computed(() =>
    periode.value === 'a_venir' ? separees.value.aVenir : separees.value.anciens,
  )

  return { periode, separees, affichees }
}

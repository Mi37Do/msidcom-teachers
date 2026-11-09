import { reactive } from 'vue'

// Fenêtre d'aperçu unique (montée dans App.vue) pour toutes les pièces jointes
const etat = reactive({ ouvert: false, chargement: false, erreur: false, nom: 'fichier', contenu: null })
let demande = 0

export function useApercuFichier() {
  /**
   * @param contenu  data URL / base64, ou fonction async qui le renvoie (fichier chargé à la demande)
   * @param nom      nom de base du fichier téléchargé (l'extension est ajoutée selon le format réel)
   */
  const ouvrirApercu = async (contenu, nom = 'fichier') => {
    const numero = ++demande
    Object.assign(etat, { ouvert: true, chargement: true, erreur: false, nom, contenu: null })
    try {
      const valeur = typeof contenu === 'function' ? await contenu() : contenu
      if (numero !== demande) return
      etat.contenu = valeur || null
      etat.erreur = !valeur
    } catch (error) {
      console.error(error)
      if (numero === demande) etat.erreur = true
    } finally {
      if (numero === demande) etat.chargement = false
    }
  }

  const fermerApercu = () => {
    demande++
    Object.assign(etat, { ouvert: false, chargement: false, erreur: false, contenu: null })
  }

  return { etat, ouvrirApercu, fermerApercu }
}

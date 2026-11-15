import { reactive, shallowReactive } from 'vue'
import axios from 'axios'

// Fenêtre d'aperçu unique (montée dans App.vue) pour toutes les pièces jointes
const etat = reactive({ ouvert: false, chargement: false, erreur: false, nom: 'fichier', contenu: null })
let demande = 0

// Les listes n'envoient que l'indication « fichier » à la place du fichier lui-même (souvent des
// centaines de Ko) : voir le paramètre fichiers=indication ajouté aux appels dans main.js
export const estUnFichier = (valeur) =>
  typeof valeur === 'string' && valeur !== 'fichier' && (valeur.startsWith('data:') || valeur.length > 200)

// Fichiers déjà ouverts, gardés en mémoire : les rouvrir est immédiat, sans nouveau chargement.
// Place limitée (les plus anciens sont oubliés en premier), durée limitée, et une modification
// envoyée au serveur pour la fiche les oublie (oublierFichiersModifies, appelée dans main.js).
const TAILLE_MAX = 15_000_000 // caractères, soit environ 11 Mo de fichiers
const DUREE_MAX = 15 * 60 * 1000
const fichiersOuverts = shallowReactive(new Map()) // clé → { contenu, garde: date }
const enCours = new Map()
let tailleTotale = 0

const cleDe = (ligne, { ressource, champ, id }) =>
  `${ressource}/${id ?? ligne?.id}/${champ}/${ligne?.edited ?? ''}`

const oublier = (cle) => {
  const entree = fichiersOuverts.get(cle)
  if (!entree) return
  fichiersOuverts.delete(cle)
  tailleTotale -= entree.contenu.length
}

const garder = (cle, contenu) => {
  if (typeof contenu !== 'string' || !contenu || contenu.length > TAILLE_MAX) return
  oublier(cle)
  fichiersOuverts.set(cle, { contenu, garde: Date.now() })
  tailleTotale += contenu.length
  for (const ancienne of fichiersOuverts.keys()) {
    if (tailleTotale <= TAILLE_MAX) break
    oublier(ancienne)
  }
}

const lire = (cle) => {
  const entree = fichiersOuverts.get(cle)
  if (!entree) return null
  if (Date.now() - entree.garde > DUREE_MAX) {
    oublier(cle)
    return null
  }
  return entree.contenu
}

/** Fichier d'une ligne s'il a déjà été ouvert (sinon null). Mêmes options que ouvrirFichierDe. */
export const fichierEnMemoire = (ligne, options) => lire(cleDe(ligne, options))

/** Modification envoyée au serveur (/api/<ressource>/<id>/...) : ses fichiers gardés en mémoire sont oubliés. */
export const oublierFichiersModifies = (url) => {
  const morceaux = /\/api\/([^/?]+)\/([^/?]+)\//.exec(url || '')
  if (!morceaux) return
  const prefixe = `${morceaux[1]}/${morceaux[2]}/`
  for (const cle of [...fichiersOuverts.keys()]) {
    if (cle.startsWith(prefixe)) oublier(cle)
  }
}

/**
 * Fichier d'une ligne de liste, chargé depuis sa fiche (/api/<ressource>/<id>/) la première fois
 * seulement, sauf si la ligne contient déjà le fichier.
 * @param valeur  la valeur de la ligne (fichier ou indication), si son nom diffère du champ de la fiche
 * @param id      l'identifiant de la fiche, s'il n'est pas dans ligne.id
 */
export const chargerFichierDe = async (ligne, { ressource, champ, valeur, id }) => {
  const contenu = valeur ?? ligne?.[champ]
  if (estUnFichier(contenu)) return contenu
  const cle = cleDe(ligne, { ressource, champ, id })
  const connu = lire(cle)
  if (connu) return connu
  // Deux touchers rapprochés : un seul chargement
  if (!enCours.has(cle)) {
    enCours.set(cle, axios
      .get(`/api/${ressource}/${id ?? ligne.id}/`)
      .then((response) => {
        const fichier = response.data?.[champ]
        garder(cle, fichier)
        return fichier
      })
      .finally(() => enCours.delete(cle)))
  }
  return enCours.get(cle)
}

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

  /**
   * Pièce jointe d'une ligne de liste, chargée seulement à l'ouverture (voir chargerFichierDe).
   * Ex. : ouvrirFichierDe(absence, { ressource: 'Abs_Retard_Eleve', champ: 'justification' })
   */
  const ouvrirFichierDe = (ligne, { ressource, champ, nom = 'fichier', valeur, id }) =>
    ouvrirApercu(() => chargerFichierDe(ligne, { ressource, champ, valeur, id }), nom)

  const fermerApercu = () => {
    demande++
    Object.assign(etat, { ouvert: false, chargement: false, erreur: false, contenu: null })
  }

  return { etat, ouvrirApercu, ouvrirFichierDe, fermerApercu }
}

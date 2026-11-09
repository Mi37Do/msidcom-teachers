<template>
  <!-- Aperçu plein écran de n'importe quelle pièce jointe, avec téléchargement dans son format
       d'origine. Placé directement dans <body> pour rester utilisable au-dessus d'une autre fenêtre -->
  <Teleport to="body">
    <div v-if="etat.ouvert" :dir="sens" :style="police" class="fixed inset-0 z-[60] bg-slate-800 flex flex-col"
      role="dialog" aria-modal="true" :aria-label="t('translation.apercu')">
      <div class="flex items-center gap-2 px-2 pb-2 bg-white border-b border-border-color"
        style="padding-top: calc(var(--safe-area-top, 0px) + 0.5rem)">
        <button type="button" class="btn btn-square btn-sm btn-ghost" :aria-label="t('translation.close')"
          @click="fermerApercu">
          <times class="w-6" />
        </button>
        <span class="flex-1 truncate font-medium" dir="auto">{{ nomTelechargement }}</span>
        <button type="button" class="btn btn-sm btn-primary text-white" :disabled="!fichier || enregistrement"
          @click="telecharger">
          <span v-if="enregistrement" class="loading loading-spinner loading-xs"></span>
          <download-icon v-else class="w-4 h-4 fill-white" />
          <span class="capitalize">{{ t('translation.download') }}</span>
        </button>
      </div>

      <!-- Sens de lecture gauche → droite dans la zone du document : défilement et zoom identiques en arabe -->
      <div ref="zone" dir="ltr" class="flex-1 overflow-auto"
        :style="{ paddingBottom: `calc(var(--safe-area-bottom, 0px) + ${zoomPossible ? '4.5rem' : '0.5rem'})` }">
        <div v-if="etat.chargement || (apercu === 'pdf' && pdfEnCours && !pagesPdf.length)"
          class="h-full flex items-center justify-center">
          <span class="loading loading-spinner loading-md text-white"></span>
        </div>
        <p v-else-if="etat.erreur || !fichier || (apercu === 'pdf' && erreurPdf && !pagesPdf.length)" :dir="sens"
          class="h-full flex items-center justify-center text-white p-6 text-center">
          {{ t('translation.fichierNonCharge') }}</p>

        <div v-else-if="apercu === 'pdf' || apercu === 'image'" class="min-w-full p-2 flex flex-col gap-2"
          :style="{ width: `${zoom * 100}%` }">
          <template v-if="apercu === 'pdf'">
            <img v-for="page in pagesPdf" :key="page.numero" :src="page.url" :alt="`${nomTelechargement} – ${page.numero}`"
              class="block w-full h-auto fond-document shadow" />
            <span v-if="pdfEnCours" class="loading loading-spinner loading-sm text-white mx-auto my-2"></span>
          </template>
          <img v-else :src="urlObjet" :alt="nomTelechargement" class="block mx-auto max-w-full h-auto fond-document" />
        </div>

        <pre v-else-if="apercu === 'texte'" dir="auto"
          class="min-h-full m-0 p-4 text-sm whitespace-pre-wrap break-words bg-white">{{ texte }}</pre>
        <div v-else-if="apercu === 'audio'" class="h-full flex items-center justify-center p-4">
          <audio :src="urlObjet" controls class="w-full max-w-lg"></audio>
        </div>
        <div v-else-if="apercu === 'video'" class="h-full flex items-center justify-center">
          <video :src="urlObjet" controls playsinline class="max-w-full max-h-full"></video>
        </div>
        <div v-else :dir="sens" class="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
          <file-alt class="w-12 fill-white" />
          <p class="text-white max-w-sm">{{ t('translation.apercuIndisponible') }}</p>
          <button type="button" class="btn btn-sm btn-primary text-white" :disabled="enregistrement"
            @click="telecharger">
            <span class="capitalize">{{ t('translation.download') }}</span> <span class="normal-case">(.{{ fichier.extension }})</span>
          </button>
        </div>
      </div>

      <div v-if="zoomPossible" dir="ltr"
        class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-white shadow-lg p-1"
        style="bottom: calc(var(--safe-area-bottom, 0px) + 1rem)">
        <button type="button" class="btn btn-circle btn-sm btn-ghost text-lg" :disabled="zoom === NIVEAUX_ZOOM[0]"
          :aria-label="t('translation.zoomArriere')" @click="changerZoom(-1)">−</button>
        <span class="w-14 text-center text-sm font-medium">{{ Math.round(zoom * 100) }} %</span>
        <button type="button" class="btn btn-circle btn-sm btn-ghost text-lg"
          :disabled="zoom === NIVEAUX_ZOOM[NIVEAUX_ZOOM.length - 1]" :aria-label="t('translation.zoomAvant')"
          @click="changerZoom(1)">+</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Capacitor } from '@capacitor/core'
import { App as AppMobile } from '@capacitor/app'
import { useWidgetStore } from '@/stores/widget'
import { useApercuFichier } from '@/composables/useApercuFichier'
import { useDownloadFile } from '@/composables/downloadFile'
import { analyserFichier, base64VersOctets, nomFichier, typeApercu } from '@/utils/fichiers'
import { ouvrirPdf, pageEnImage } from '@/utils/lecteurPdf'
import fileAlt from '@/assets/icons/fileAlt.vue'
import downloadIcon from '@/assets/icons/downloadFile.vue'
import times from '@/assets/icons/times.vue'

const { t } = useI18n()
const useWidget = useWidgetStore()
const { etat, fermerApercu } = useApercuFichier()
const { downloadFile } = useDownloadFile()

const sens = computed(() => (useWidget.userLanguage === 'ar' ? 'rtl' : 'ltr'))
const police = computed(() => ({ fontFamily: useWidget.userLanguage === 'ar' ? 'cairo' : 'Roboto' }))

const fichier = computed(() => (etat.contenu ? analyserFichier(etat.contenu) : null))
const apercu = computed(() => (fichier.value ? typeApercu(fichier.value.type) : null))
const nomTelechargement = computed(() => nomFichier(etat.nom, fichier.value?.extension ?? 'bin'))
const zone = ref(null)

// Image, audio, vidéo : affichés depuis un blob (libéré à la fermeture)
const urlObjet = ref(null)
const texte = computed(() =>
  apercu.value === 'texte' ? new TextDecoder('utf-8').decode(base64VersOctets(fichier.value.base64)) : '',
)

// PDF : chaque page est dessinée en image, l'une après l'autre (la première s'affiche vite)
const pagesPdf = ref([])
const pdfEnCours = ref(false)
const erreurPdf = ref(false)
let tachePdf = null
let lecture = 0

const arreterPdf = () => {
  lecture++
  tachePdf?.destroy().catch(() => {})
  tachePdf = null
  pagesPdf.value.forEach((page) => URL.revokeObjectURL(page.url))
  pagesPdf.value = []
  pdfEnCours.value = false
  erreurPdf.value = false
}

async function afficherPdf(octets) {
  const numero = ++lecture
  pdfEnCours.value = true
  try {
    const tache = await ouvrirPdf(octets)
    if (numero !== lecture) return tache.destroy().catch(() => {})
    tachePdf = tache
    const doc = await tache.promise
    if (numero !== lecture) return
    // Pages dessinées plus grandes que l'écran : elles restent nettes jusqu'au zoom × 2
    const largeurEcran = zone.value?.clientWidth || window.innerWidth
    const largeur = Math.min(largeurEcran * Math.min(window.devicePixelRatio || 1, 2) * 2, 2400)
    for (let page = 1; page <= doc.numPages; page++) {
      const { image } = await pageEnImage(doc, page, largeur)
      if (numero !== lecture) return
      pagesPdf.value.push({ numero: page, url: URL.createObjectURL(image) })
    }
  } catch (error) {
    if (numero !== lecture) return
    console.error('PDF preview failed:', error)
    erreurPdf.value = true
  } finally {
    if (numero === lecture) pdfEnCours.value = false
  }
}

// Zoom par boutons : le pincement agrandirait toute l'application
const NIVEAUX_ZOOM = [1, 1.5, 2, 3]
const zoom = ref(1)
const zoomPossible = computed(
  () => !etat.chargement && ((apercu.value === 'pdf' && pagesPdf.value.length > 0) || (apercu.value === 'image' && !!urlObjet.value)),
)
const changerZoom = async (pas) => {
  const niveau = NIVEAUX_ZOOM[NIVEAUX_ZOOM.indexOf(zoom.value) + pas]
  const el = zone.value
  if (!niveau || !el) return
  // Le même endroit du document reste au centre de l'écran
  const centreX = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth
  const centreY = (el.scrollTop + el.clientHeight / 2) / el.scrollHeight
  zoom.value = niveau
  await nextTick()
  el.scrollLeft = centreX * el.scrollWidth - el.clientWidth / 2
  el.scrollTop = centreY * el.scrollHeight - el.clientHeight / 2
}

watch(fichier, (f) => {
  arreterPdf()
  if (urlObjet.value) URL.revokeObjectURL(urlObjet.value)
  urlObjet.value = null
  zoom.value = 1
  const type = f && typeApercu(f.type)
  if (type === 'pdf') afficherPdf(base64VersOctets(f.base64))
  else if (type && type !== 'texte') {
    urlObjet.value = URL.createObjectURL(new Blob([base64VersOctets(f.base64)], { type: f.type }))
  }
})

// Sans aperçu possible (Word, Excel…), le fichier enregistré s'ouvre aussi avec une application du téléphone
const enregistrement = ref(false)
const telecharger = async () => {
  if (!fichier.value || enregistrement.value) return
  enregistrement.value = true
  try {
    await downloadFile(etat.nom, etat.contenu, null, !apercu.value)
  } catch {
    // Message déjà affiché par downloadFile
  } finally {
    enregistrement.value = false
  }
}

// Bouton retour d'Android : ferme l'aperçu au lieu de quitter l'écran (écouté seulement
// pendant l'aperçu, le comportement habituel revient ensuite)
let ecouteRetour = null
watch(
  () => etat.ouvert,
  (ouvert) => {
    if (Capacitor.getPlatform() !== 'android') return
    if (ouvert && !ecouteRetour) ecouteRetour = AppMobile.addListener('backButton', fermerApercu)
    if (!ouvert && ecouteRetour) {
      ecouteRetour.then((ecoute) => ecoute.remove())
      ecouteRetour = null
    }
  },
)

const surTouche = (event) => {
  if (event.key === 'Escape' && etat.ouvert) fermerApercu()
}
onMounted(() => window.addEventListener('keydown', surTouche))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', surTouche)
  arreterPdf()
  if (urlObjet.value) URL.revokeObjectURL(urlObjet.value)
  ecouteRetour?.then((ecoute) => ecoute.remove())
})
</script>

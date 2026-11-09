// Lecture des PDF dans l'application avec pdf.js : la WebView d'Android n'affiche pas les PDF
// et celle d'iOS les affiche mal. Le moteur n'est chargé qu'à l'ouverture du premier PDF.
import urlJbig2 from 'pdfjs-dist/wasm/jbig2.wasm?url'
import urlOpenjpeg from 'pdfjs-dist/wasm/openjpeg.wasm?url'
import urlSymbole from 'pdfjs-dist/standard_fonts/FoxitSymbol.pfb?url'
import urlDingbats from 'pdfjs-dist/standard_fonts/FoxitDingbats.pfb?url'

// Fichiers que pdf.js demande pendant la lecture : décodeurs des images des documents scannés
// (JBIG2, JPEG 2000) et polices de symboles, livrés avec l'application
const FICHIERS_PDFJS = {
  'jbig2.wasm': urlJbig2,
  'openjpeg.wasm': urlOpenjpeg,
  'FoxitSymbol.pfb': urlSymbole,
  'FoxitDingbats.pfb': urlDingbats,
}

class FichiersPdfjs {
  async fetch({ filename }) {
    const url = FICHIERS_PDFJS[filename]
    if (!url) throw new Error(`pdf.js : ${filename} non disponible`)
    const reponse = await fetch(url)
    if (!reponse.ok) throw new Error(`pdf.js : ${filename} introuvable (${reponse.status})`)
    return new Uint8Array(await reponse.arrayBuffer())
  }
}

// La lecture se fait dans la page, sans Worker : rien à servir à part côté Android / iOS
// (type des fichiers .mjs), et les documents concernés (bulletins, justificatifs…) sont légers
let moteur = null
function chargerMoteur() {
  moteur ??= Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
  ])
    .then(([pdfjs, { WorkerMessageHandler }]) => {
      globalThis.pdfjsWorker = { WorkerMessageHandler }
      return pdfjs
    })
    .catch((error) => {
      moteur = null
      throw error
    })
  return moteur
}

/**
 * Ouvre un PDF (Uint8Array, cédé à pdf.js : ne plus s'en servir).
 * Renvoie la tâche de chargement : `.promise` donne le document, `.destroy()` le ferme
 * (aussi pendant le chargement).
 */
export async function ouvrirPdf(octets) {
  const pdfjs = await chargerMoteur()
  return pdfjs.getDocument({ data: octets, BinaryDataFactory: FichiersPdfjs })
}

// Au-delà, iOS refuse de dessiner dans un canvas
const PIXELS_MAX = 16e6

/** Dessine une page en image JPEG d'environ `largeur` pixels → { image: Blob, ratio } */
export async function pageEnImage(documentPdf, numero, largeur) {
  const page = await documentPdf.getPage(numero)
  try {
    const base = page.getViewport({ scale: 1 })
    const echelle = Math.min(largeur / base.width, Math.sqrt(PIXELS_MAX / (base.width * base.height)))
    const viewport = page.getViewport({ scale: echelle })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    await page.render({ canvas, viewport }).promise
    const image = await new Promise((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('page non convertie'))), 'image/jpeg', 0.92),
    )
    // Une image prend bien moins de mémoire qu'un canvas, très limitée sur iOS
    canvas.width = 0
    canvas.height = 0
    return { image, ratio: viewport.height / viewport.width }
  } finally {
    page.cleanup()
  }
}

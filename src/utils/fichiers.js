// Fichiers stockés en base64 (pièces jointes, justificatifs, bulletins, examens) :
// type réel, extension, aperçu possible. Même fichier dans le dashboard et les apps.

export const EXTENSIONS = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/rtf': 'rtf',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/json': 'json',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/vnd.rar': 'rar',
  'application/x-rar-compressed': 'rar',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/3gpp': '3gp',
}

const TYPE_PAR_EXTENSION = { jpeg: 'image/jpeg', jpg: 'image/jpeg', zip: 'application/zip', rar: 'application/vnd.rar' }
for (const [type, extension] of Object.entries(EXTENSIONS)) {
  if (!TYPE_PAR_EXTENSION[extension]) TYPE_PAR_EXTENSION[extension] = type
}

// Type d'après le nom d'un fichier choisi (le navigateur ne le donne pas toujours, Word/Excel sur mobile)
export const typeDepuisNom = (nom) =>
  TYPE_PAR_EXTENSION[String(nom || '').split('.').pop().toLowerCase()] || null

// Fichier choisi par l'utilisateur → « data:<type>;base64,… », type toujours renseigné si on le connaît :
// sans lui, le fichier repartirait plus tard en « .bin » au lieu de son format d'origine
export const lireFichier = (file) =>
  new Promise((resolve, reject) => {
    const lecteur = new FileReader()
    lecteur.onload = () => {
      const type = file.type || typeDepuisNom(file.name)
      const url = String(lecteur.result)
      resolve(type ? url.replace(/^data:[^;,]*/, `data:${type}`) : url)
    }
    lecteur.onerror = () => reject(lecteur.error)
    lecteur.readAsDataURL(file)
  })

const debutEnTexte = (base64, nombreOctets) => {
  try {
    return atob(base64.slice(0, Math.ceil(nombreOctets / 3) * 4).replace(/[^A-Za-z0-9+/=]/g, ''))
  } catch {
    return ''
  }
}

// Type d'après les premiers octets, quand la chaîne n'a pas d'en-tête utile
function typeDepuisContenu(base64) {
  const debut = debutEnTexte(base64, 16)
  const o = [...debut].map((c) => c.charCodeAt(0))
  const commence = (...signature) => signature.every((valeur, i) => o[i] === valeur)
  if (commence(0x25, 0x50, 0x44, 0x46)) return 'application/pdf'
  if (commence(0x89, 0x50, 0x4e, 0x47)) return 'image/png'
  if (commence(0xff, 0xd8, 0xff)) return 'image/jpeg'
  if (commence(0x47, 0x49, 0x46, 0x38)) return 'image/gif'
  if (commence(0x52, 0x49, 0x46, 0x46)) {
    const forme = debut.slice(8, 12)
    if (forme === 'WEBP') return 'image/webp'
    if (forme === 'WAVE') return 'audio/wav'
  }
  if (commence(0x42, 0x4d)) return 'image/bmp'
  if (debut.slice(4, 8) === 'ftyp') {
    const marque = debut.slice(8, 12)
    if (['heic', 'heix', 'mif1', 'msf1'].includes(marque)) return 'image/heic'
    if (marque === 'qt  ') return 'video/quicktime'
    if (marque.startsWith('M4A')) return 'audio/mp4'
    if (marque.startsWith('3gp')) return 'video/3gpp'
    return 'video/mp4'
  }
  if (commence(0x49, 0x44, 0x33) || commence(0xff, 0xfb) || commence(0xff, 0xf3)) return 'audio/mpeg'
  if (commence(0x4f, 0x67, 0x67, 0x53)) return 'audio/ogg'
  if (commence(0x1a, 0x45, 0xdf, 0xa3)) return 'video/webm'
  if (commence(0x52, 0x61, 0x72, 0x21)) return 'application/vnd.rar'
  if (commence(0x7b, 0x5c, 0x72, 0x74)) return 'application/rtf'
  if (commence(0x50, 0x4b, 0x03, 0x04)) {
    // ZIP : Word, Excel, PowerPoint, OpenDocument ou simple archive (noms des entrées en clair)
    const contenu = debutEnTexte(base64, 64 * 1024)
    if (contenu.includes('mimetypeapplication/vnd.oasis.opendocument.text')) return 'application/vnd.oasis.opendocument.text'
    if (contenu.includes('mimetypeapplication/vnd.oasis.opendocument.spreadsheet')) return 'application/vnd.oasis.opendocument.spreadsheet'
    if (contenu.includes('mimetypeapplication/vnd.oasis.opendocument.presentation')) return 'application/vnd.oasis.opendocument.presentation'
    if (contenu.includes('word/')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (contenu.includes('xl/')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (contenu.includes('ppt/')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    return 'application/zip'
  }
  if (commence(0xd0, 0xcf, 0x11, 0xe0)) {
    // Office 97-2003 : noms des flux en UTF-16
    const contenu = debutEnTexte(base64, 64 * 1024)
    if (contenu.includes('W\0o\0r\0d\0D\0o\0c\0u\0m\0e\0n\0t')) return 'application/msword'
    if (contenu.includes('W\0o\0r\0k\0b\0o\0o\0k') || contenu.includes('B\0o\0o\0k')) return 'application/vnd.ms-excel'
    if (contenu.includes('P\0o\0w\0e\0r\0P\0o\0i\0n\0t')) return 'application/vnd.ms-powerpoint'
  }
  return null
}

/**
 * « data:<type>;base64,xxxx » ou base64 seul → { type, extension, base64 }.
 * Un en-tête vide ou « application/octet-stream » ne dit rien : on lit alors le contenu.
 */
export function analyserFichier(contenu, typeConnu = null) {
  let base64 = String(contenu || '')
  let typeEnTete = null
  const enTete = base64.match(/^data:([^;,]*)(;[^,]*)?,/)
  if (enTete) {
    typeEnTete = enTete[1] || null
    base64 = base64.slice(enTete[0].length)
  }
  const enTeteUtile = typeEnTete && typeEnTete !== 'application/octet-stream' ? typeEnTete : null
  const type = enTeteUtile || typeConnu || typeDepuisContenu(base64) || typeEnTete || 'application/octet-stream'
  return { type, extension: EXTENSIONS[type] || 'bin', base64 }
}

// Ce que l'on sait afficher directement
export function typeApercu(type) {
  if (type === 'application/pdf') return 'pdf'
  if (/^image\/(png|jpe?g|gif|webp|bmp|svg\+xml)$/.test(type)) return 'image'
  if (/^text\//.test(type) || type === 'application/json') return 'texte'
  if (/^audio\//.test(type)) return 'audio'
  if (/^video\//.test(type)) return 'video'
  return null
}

export function base64VersOctets(base64) {
  const binaire = atob(base64.replace(/[^A-Za-z0-9+/=]/g, ''))
  const octets = new Uint8Array(binaire.length)
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i)
  return octets
}

// Nom sans caractères interdits, avec l'extension du format réel
export function nomFichier(nom, extension) {
  const base = String(nom || `fichier_${Date.now()}`).replace(/[\\/:*?"<>|]+/g, '_').trim() || 'fichier'
  return /\.[a-z0-9]{2,5}$/i.test(base) ? base : `${base}.${extension}`
}

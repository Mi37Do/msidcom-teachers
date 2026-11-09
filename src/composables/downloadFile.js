import { Filesystem, Directory } from '@capacitor/filesystem'
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'
import { FileOpener } from '@capacitor-community/file-opener'
import i18n from '@/i18n'
import { analyserFichier, base64VersOctets, nomFichier } from '@/utils/fichiers'

const t = (cle) => i18n.global.t(`translation.${cle}`)

const toast = async (text, duration = 'short') => {
  try {
    await Toast.show({ text, duration })
  } catch (error) {
    console.error('Toast failed:', error)
  }
}

/**
 * Enregistre un fichier base64 sur l'appareil (Téléchargements sur Android, Documents sur iOS,
 * téléchargement du navigateur sur le web), puis l'ouvre si autoOpen.
 * Accepte « data:<type>;base64,xxxx » ou le contenu base64 seul.
 */
export function useDownloadFile() {
  const downloadFile = async (filename, base64String, mimeType = null, autoOpen = true) => {
    try {
      if (!base64String || typeof base64String !== 'string') {
        throw new Error('base64String is required')
      }

      await toast(t('downloadInProgress'))

      // Format d'origine : type lu dans l'en-tête « data: », sinon dans le contenu (avant, un
      // fichier sans en-tête repartait en PDF). Le nom porte l'extension de ce format : iOS et
      // Android en ont besoin pour l'ouvrir
      const { type, extension, base64: base64Content } = analyserFichier(base64String, mimeType)
      const fileName = nomFichier(filename, extension)

      const platform = Capacitor.getPlatform()

      if (platform === 'web') {
        const blob = new Blob([base64VersOctets(base64Content)], { type })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
        await toast(t('fileDownloaded'))
        return fileName
      }

      // Sans « encoding », Filesystem écrit les octets du base64 (avec Encoding.UTF8 le fichier
      // contenait le texte base64 et ne s'ouvrait pas)
      let result
      if (platform === 'android') {
        try {
          result = await Filesystem.writeFile({
            path: `Download/${fileName}`,
            data: base64Content,
            directory: Directory.ExternalStorage,
          })
        } catch (error) {
          // Dossier Téléchargements inaccessible sur certaines versions d'Android : copie
          // dans l'espace de l'app, que l'on peut quand même ouvrir
          console.error('Download folder not writable, using app storage:', error)
          result = await Filesystem.writeFile({ path: fileName, data: base64Content, directory: Directory.Cache })
        }
      } else {
        result = await Filesystem.writeFile({ path: fileName, data: base64Content, directory: Directory.Documents })
      }

      await toast(t('fileDownloaded'))

      if (autoOpen) {
        try {
          await FileOpener.open({ filePath: result.uri, contentType: type })
        } catch (openError) {
          console.error('Could not open file:', openError)
          await toast(t('fileNotOpened'), 'long')
        }
      }

      return result.uri
    } catch (e) {
      console.error('Unable to save file:', e)
      await toast(t('downloadFailed'), 'long')
      throw e
    }
  }

  return { downloadFile }
}

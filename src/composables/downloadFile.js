import { Filesystem, Directory } from '@capacitor/filesystem'
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'

/**
 * Composable to download a Base64 file
 */
export function useDownloadFile() {
  const downloadFile = async (filename, base64String, mimeType = 'application/pdf') => {
    try {
      await Toast.show({ text: 'Downloading...', duration: 'short' })

      // Extract MIME type and Base64 content
      const [metadata, base64Content] = base64String.split(',')

      // Infer file extension
      let extension = '.bin'
      if (metadata.includes('pdf')) extension = '.pdf'
      else if (metadata.includes('png')) extension = '.png'
      else if (metadata.includes('jpeg') || metadata.includes('jpg')) extension = '.jpg'

      const fileName = filename || `downloaded_file${extension}`

      if (Capacitor.getPlatform() === 'android') {
        // Save into Android Downloads folder
        await Filesystem.writeFile({
          path: `Download/${fileName}`,
          data: base64Content,
          directory: Directory.ExternalStorage,
        })
      } else {
        // iOS → Documents folder
        await Filesystem.writeFile({
          path: fileName,
          data: base64Content,
          directory: Directory.Documents,
        })
      }

      await Toast.show({ text: 'Download complete ✅', duration: 'short' })
      console.log('File saved:', fileName)
    } catch (e) {
      console.error('Unable to save file', e)
      await Toast.show({ text: 'Download failed ❌', duration: 'long' })
    }
  }

  return { downloadFile }
}

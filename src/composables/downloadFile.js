import { Filesystem, Directory } from '@capacitor/filesystem'
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'
import { FileOpener } from '@capacitor-community/file-opener'

/**
 * Composable to download a Base64 file
 */
export function useDownloadFile() {
  const downloadFile = async (
    filename,
    base64String,
    mimeType = 'application/pdf',
    autoOpen = true,
  ) => {
    try {
      await Toast.show({ text: 'Downloading...', duration: 'short' })

      // Extract MIME type and Base64 content
      const [metadata, base64Content] = base64String.split(',')

      // Infer file extension and MIME type
      let extension = '.bin'
      let detectedMimeType = mimeType

      if (metadata.includes('pdf')) {
        extension = '.pdf'
        detectedMimeType = 'application/pdf'
      } else if (metadata.includes('png')) {
        extension = '.png'
        detectedMimeType = 'image/png'
      } else if (metadata.includes('jpeg') || metadata.includes('jpg')) {
        extension = '.jpg'
        detectedMimeType = 'image/jpeg'
      }

      const fileName = filename || `downloaded_file${extension}`

      let result

      if (Capacitor.getPlatform() === 'android') {
        // Save into Android Downloads folder
        result = await Filesystem.writeFile({
          path: `Download/${fileName}`,
          data: base64Content,
          directory: Directory.ExternalStorage,
        })
      } else {
        // iOS → Documents folder
        result = await Filesystem.writeFile({
          path: fileName,
          data: base64Content,
          directory: Directory.Documents,
        })
      }

      await Toast.show({ text: 'Download complete ✅', duration: 'short' })
      console.log('File saved:', fileName, result.uri)

      // Open the file automatically if autoOpen is true
      if (autoOpen && Capacitor.isNativePlatform()) {
        try {
          // Remove 'file://' prefix for Android compatibility
          const filePath = result.uri.replace('file://', '')

          await FileOpener.open({
            filePath: filePath,
            contentType: detectedMimeType,
          })

          console.log('File opened successfully!')
        } catch (openError) {
          console.error('Could not open file:', openError)
          await Toast.show({
            text: 'File saved but could not be opened',
            duration: 'long',
          })
        }
      }

      return result.uri
    } catch (e) {
      console.error('Unable to save file', e)
      await Toast.show({ text: 'Download failed ❌', duration: 'long' })
      throw e
    }
  }

  return { downloadFile }
}

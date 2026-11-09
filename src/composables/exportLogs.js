import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'
import { FileOpener } from '@capacitor-community/file-opener'
import { getLogsAsText } from '@/utils/appLogger'

function buildFileName() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const time =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `msidcom_prof_logs_${time}.txt`
}

/**
 * Composable to export the in-memory app logs (captured since launch) to a file.
 */
export function useExportLogs() {
  const exportLogs = async () => {
    const fileName = buildFileName()
    const content = getLogsAsText()

    try {
      if (!Capacitor.isNativePlatform()) {
        const blob = new Blob([content], { type: 'text/plain' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
        return fileName
      }

      const result = await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })

      await Toast.show({ text: 'Logs saved: ' + fileName, duration: 'short' })

      try {
        const filePath = result.uri.replace('file://', '')
        await FileOpener.open({ filePath, contentType: 'text/plain' })
      } catch (openError) {
        console.error('Could not open log file:', openError)
      }

      return fileName
    } catch (e) {
      console.error('Unable to export logs:', e)
      await Toast.show({ text: `Log export failed: ${e.message}`, duration: 'long' })
      throw e
    }
  }

  return { exportLogs }
}

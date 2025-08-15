// composables/useDownloadBase64.js
export function useDownloadBase64() {
  function downloadBase64(base64, filename = 'download', mimeType = 'application/octet-stream') {
    // Create a blob from the base64 string
    const byteCharacters = atob(base64.split(',')[1] || base64) // handles base64 with data URL prefix
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    // Create a link and click it to start download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return { downloadBase64 }
}

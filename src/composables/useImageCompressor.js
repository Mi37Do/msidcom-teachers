import { ref } from 'vue'

export function useImageCompressor() {
  const compressImage = async (base64String, maxSizeKB = 50, quality = 0.7) => {
    // First check the current size
    const sizeInKB = (base64String.length * 0.75) / 1024

    if (sizeInKB <= maxSizeKB) {
      return base64String // No need to compress
    }

    try {
      // Create an image element to work with
      const img = new Image()
      img.src = base64String

      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Create canvas to resize/compress
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Calculate new dimensions while maintaining aspect ratio
      const maxDimension = 1024 // Maximum width or height
      let width = img.width
      let height = img.height

      if (width > height && width > maxDimension) {
        height *= maxDimension / width
        width = maxDimension
      } else if (height > maxDimension) {
        width *= maxDimension / height
        height = maxDimension
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to compressed base64
      const mimeType = base64String.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
      let compressedBase64 = canvas.toDataURL(mimeType, quality)

      // Check if we need to compress further
      let newSizeKB = (compressedBase64.length * 0.75) / 1024
      let currentQuality = quality

      // Gradually reduce quality until under max size
      while (newSizeKB > maxSizeKB && currentQuality > 0.1) {
        currentQuality -= 0.1
        compressedBase64 = canvas.toDataURL(mimeType, currentQuality)
        newSizeKB = (compressedBase64.length * 0.75) / 1024
      }

      return compressedBase64
    } catch (error) {
      console.error('Image compression failed:', error)
      return base64String // Return original if compression fails
    }
  }

  return { compressImage }
}

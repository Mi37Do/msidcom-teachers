import { ref } from 'vue'

export function useFileToBase64() {
  const base64Result = ref(null)

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        base64Result.value = reader.result
        resolve(reader.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  }

  return {
    base64Result,
    convertToBase64,
  }
}

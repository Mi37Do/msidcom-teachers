import { onMounted, onUnmounted } from 'vue'
import { SafeArea } from '@capacitor-community/safe-area'

export function useSafeArea() {
  const setVars = async () => {
    const insets = await SafeArea.getSafeAreaInsets()

    document.documentElement.style.setProperty('--safe-area-top', `${insets.top}px`)
    document.documentElement.style.setProperty('--safe-area-bottom', `${insets.bottom}px`)
    document.documentElement.style.setProperty('--safe-area-left', `${insets.left}px`)
    document.documentElement.style.setProperty('--safe-area-right', `${insets.right}px`)
  }

  onMounted(() => {
    setVars()
    SafeArea.addListener('safeAreaChanged', setVars)
  })

  onUnmounted(() => {
    SafeArea.removeAllListeners()
  })
}

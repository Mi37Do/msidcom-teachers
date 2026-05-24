import type { CapacitorConfig } from '@capacitor/cli'
import { SystemBarsStyle } from '@capacitor-community/safe-area'

const config: CapacitorConfig = {
  appId: 'msidcom.prof.app',
  appName: 'msidcom-prof.app',
  webDir: 'dist',
  backgroundColor: '#b2e9f6',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SafeArea: {
      statusBarStyle: SystemBarsStyle.Light,
      navigationBarStyle: SystemBarsStyle.Light,
    },
    Keyboard: {
      resize: 'none' as any,
      resizeOnFullScreen: true,
    },
  },
}

export default config

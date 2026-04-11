import type { CapacitorConfig } from '@capacitor/cli'
import { SystemBarsStyle } from '@capacitor-community/safe-area'

const config: CapacitorConfig = {
  appId: 'msidcom.prof.app',
  appName: 'msidcom-prof.app',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SafeArea: {
      statusBarStyle: SystemBarsStyle.Light,
      navigationBarStyle: SystemBarsStyle.Light,
    },
  },
}

export default config

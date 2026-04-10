import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'msidcom.prof.app',
  appName: 'msidcom-prof.app',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#49c5b1',
      overlaysWebView: false,
    },
  },
}

export default config

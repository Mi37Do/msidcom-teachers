import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'msidcom.prof.app',
  appName: 'msidcom-prof.app',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#488AFF',
    },
  },
}

export default config

// src/composables/useFirebaseMessaging.js
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { messaging, getToken, onMessage } from '@/firebase'
import axios from 'axios'
import { Preferences } from '@capacitor/preferences'

// Track if listeners are already set up (important!)
let listenersInitialized = false

export function useFirebaseMessaging() {
  const fcmToken = ref(null)
  const notification = ref(null)
  const error = ref(null)
  const isNative = Capacitor.isNativePlatform()

  // Web FCM implementation
  const requestWebPermission = async () => {
    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        console.log('Notification permission granted.')

        const token = await getToken(messaging, {
          vapidKey:
            'BPSsnEOZO3WW9VzujPJEKRL4cKkZZw2D-a-8g1MNwuxsgQUTb6bRzSb5GEkotCIDckJyH8Lh54GjtazSTLlM4Go',
        })

        if (token) {
          fcmToken.value = token
          await sendTokenToBackend(token)
        }
      } else {
        error.value = 'Notification permission denied'
      }
    } catch (err) {
      error.value = err.message
      console.error('Error retrieving token:', err)
    }
  }

  // Setup native push notification listeners
  // CRITICAL: This must be called BEFORE requestNativePermission
  const setupNativeListeners = () => {
    // Prevent duplicate listeners
    if (listenersInitialized) {
      console.log('Listeners already initialized, skipping...')
      return
    }

    console.log('Setting up native push notification listeners...')

    // On registration success, get the token
    PushNotifications.addListener('registration', async (token) => {
      fcmToken.value = token.value
      console.log('✅ Push registration success, token:', token.value)
      await sendTokenToBackend(token.value)
    })

    // On registration error
    PushNotifications.addListener('registrationError', (err) => {
      error.value = err.error
      console.error('❌ Push registration error:', err.error)
    })

    // When a notification is received (app in foreground)
    PushNotifications.addListener('pushNotificationReceived', (notif) => {
      console.log('📬 Push notification received (foreground):', notif)
      notification.value = {
        title: notif.title,
        body: notif.body,
        data: notif.data,
      }
    })

    // When user taps on a notification (app in background or closed)
    PushNotifications.addListener('pushNotificationActionPerformed', (notif) => {
      console.log('👆 Push notification clicked:', notif)
      notification.value = {
        title: notif.notification.title,
        body: notif.notification.body,
        data: notif.notification.data,
      }

      // Handle navigation based on notification data
      handleNotificationNavigation(notif.notification.data)
    })

    listenersInitialized = true
    console.log('✅ Native listeners initialized')
  }

  // Handle notification navigation
  const handleNotificationNavigation = (data) => {
    if (!data) return

    const { type, entrevue_id, discussion_id, annonce_id } = data

    // You can use router here or emit an event
    // For now, we'll just log and let the component handle it
    console.log('Navigate based on:', { type, entrevue_id, discussion_id, annonce_id })

    // If you want to navigate directly, import router:
    // import router from '@/router'
    // switch (type) {
    //   case 'ENTREVUE_DEMANDE':
    //     if (entrevue_id) router.push(`/entrevues/${entrevue_id}`)
    //     break
    //   case 'DISCUSSION':
    //     if (discussion_id) router.push(`/discussions/${discussion_id}`)
    //     break
    //   case 'ANNONCE':
    //     if (annonce_id) router.push(`/annonces/${annonce_id}`)
    //     break
    // }
  }

  // Native (Capacitor) implementation
  const requestNativePermission = async () => {
    try {
      console.log('Requesting native push notification permission...')

      // Request permission
      let permStatus = await PushNotifications.checkPermissions()
      console.log('Current permission status:', permStatus)

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions()
        console.log('Permission request result:', permStatus)
      }

      if (permStatus.receive !== 'granted') {
        error.value = 'Push notification permission denied'
        throw new Error('User denied permissions!')
      }

      // Register with Apple / Google to receive push via APNS/FCM
      console.log('Registering for push notifications...')
      await PushNotifications.register()

      console.log('✅ Push notifications registered successfully')
    } catch (err) {
      error.value = err.message
      console.error('❌ Error with push notifications:', err)
    }
  }

  // Listen for web foreground messages
  const listenForWebMessages = () => {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload)
      notification.value = payload

      if (payload.notification) {
        showNotification(payload.notification)
      }

      // Handle navigation for web
      if (payload.data) {
        handleNotificationNavigation(payload.data)
      }
    })
  }

  // Show browser notification
  const showNotification = async (notificationPayload) => {
    const { title, body, icon } = notificationPayload

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: icon || '/firebase-logo.png',
      })
    }
  }

  // Send token to Django backend
  const sendTokenToBackend = async (token) => {
    const { value } = await Preferences.get({ key: 'authToken-prof' })
    try {
      await axios.post(
        '/api/device/register/',
        {
          token: token,
          device_type: isNative ? 'mobile' : 'web',
          platform: Capacitor.getPlatform(), // 'ios', 'android', or 'web'
        },
        {
          headers: {
            Authorization: `Token ${value}`,
          },
        },
      )
      console.log('✅ Token sent to backend successfully')
    } catch (err) {
      console.error('❌ Error sending token to backend:', err)
    }
  }

  // Initialize FCM based on platform
  const initializeFCM = async () => {
    console.log('Initializing FCM...', { isNative, platform: Capacitor.getPlatform() })

    if (isNative) {
      // CRITICAL: Setup listeners FIRST, then request permission
      setupNativeListeners()
      await requestNativePermission()
    } else {
      // Web browser
      await requestWebPermission()
      listenForWebMessages()
    }
  }

  // Get delivered notifications (native only)
  const getDeliveredNotifications = async () => {
    if (isNative) {
      const notificationList = await PushNotifications.getDeliveredNotifications()
      console.log('Delivered notifications:', notificationList)
      return notificationList
    }
    return []
  }

  // Remove all delivered notifications (native only)
  const removeAllNotifications = async () => {
    if (isNative) {
      await PushNotifications.removeAllDeliveredNotifications()
    }
  }

  return {
    fcmToken,
    notification,
    error,
    isNative,
    initializeFCM,
    requestPermission: isNative ? requestNativePermission : requestWebPermission,
    getDeliveredNotifications,
    removeAllNotifications,
  }
}

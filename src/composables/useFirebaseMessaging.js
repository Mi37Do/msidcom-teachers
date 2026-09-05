// src/composables/useFirebaseMessaging.js
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { messaging, getToken, onMessage } from '@/firebase'
import axios from 'axios'
import { Preferences } from '@capacitor/preferences'
import router from '@/router'

// Singleton state — shared across all callers
const fcmToken = ref(null)
const notification = ref(null)
const error = ref(null)
let listenersInitialized = false
// Token last pushed to the backend in this app session — avoids re-registering
// the same device on every reload
let registeredToken = null

export function useFirebaseMessaging() {
  const isNative = Capacitor.isNativePlatform()

  // Web FCM implementation
  const requestWebPermission = async () => {
    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        console.log('Notification permission granted.')

        const token = await getToken(messaging, {
          vapidKey:
            'BNIgwV9x3pc0RuPO3fFm04tP7VIyDpzHHCUWuGtgsu0bvNExWoFCg3EMjI3Thnb0O_QPiG60OD2y5-hNMc4OPYw',
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

  // Where each notification type sends the user. Kept in sync with the
  // in-app notifications list (components/notifications/itemData.vue).
  const NOTIFICATION_ROUTES = {
    ABSENCE_RETARD_ELEVE: { name: 'list-classes-view' },
    STATUE_PRESENCE_ELEVE: { name: 'list-classes-view' },
    CONVOCATION: { name: 'list-classes-view' },
    BULLETIN_DISPONIBLE: { name: 'list-classes-view' },
    ANNONCE: { name: 'exams-annoncements-view' },
    ANNONCE_PROF: { name: 'exams-annoncements-view' },
    EVENT: { name: 'schedule-view' },
    ABSENCE_RETARD_PROF: { name: 'abscences-view' },
    ENTREVUE_DEMANDE: { name: 'interview-view' },
    ENTREVUE_ACCEPTEE: { name: 'interview-view' },
    ENTREVUE_REFUSEE: { name: 'interview-view' },
  }

  // Handle notification navigation - only ever called on an explicit click
  const handleNotificationNavigation = (data) => {
    if (!data) return

    const { type, discussion_id } = data

    if (type === 'MESSAGE') {
      router.push(
        discussion_id
          ? { name: 'chat-view', query: { discussion_id } }
          : { name: 'chats-panel' },
      )
      return
    }

    const route = NOTIFICATION_ROUTES[type]
    if (route) router.push(route)
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

      // No navigation here on purpose: the app is in the foreground and the user
      // has not clicked anything. Redirection only happens on an explicit click
      // (notification tap or the in-app notifications list).
    })
  }

  // Listen for clicks on notifications shown by the service worker
  // (app backgrounded/closed on web) - see public/firebase-messaging-sw.js
  const listenForServiceWorkerMessages = () => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type !== 'notification-click') return

      console.log('Notification clicked (service worker):', event.data)
      notification.value = { data: event.data.data }
      handleNotificationNavigation(event.data.data)
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

  // Send token to Django backend — only when it is actually new to the backend
  const sendTokenToBackend = async (token) => {
    if (registeredToken === token) return
    const { value: storedToken } = await Preferences.get({ key: 'fcmToken' })
    if (storedToken === token) {
      registeredToken = token
      console.log('Device already registered with this token, skipping')
      return
    }

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
      await Preferences.set({ key: 'fcmToken', value: token })
      registeredToken = token
      console.log('✅ Token sent to backend successfully')
    } catch (err) {
      console.error('❌ Error sending token to backend:', err)
    }
  }

  // Full FCM setup: asks for permission, registers the device and posts the
  // token to the backend. Call this ONCE, right after a successful login.
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
      listenForServiceWorkerMessages()
    }
  }

  // App start-up path for an already logged-in user: attach the message
  // listeners so incoming pushes are handled, but never prompt for permission
  // and never re-register a device whose token has not changed.
  const attachMessagingListeners = async () => {
    if (isNative) {
      setupNativeListeners()
      const permStatus = await PushNotifications.checkPermissions()
      if (permStatus.receive !== 'granted') return
      // Re-registering is what surfaces a rotated token; the backend call in
      // the `registration` listener is skipped when the token is unchanged.
      await PushNotifications.register()
    } else {
      if (Notification.permission !== 'granted') return
      if (listenersInitialized) return
      listenersInitialized = true
      listenForWebMessages()
      listenForServiceWorkerMessages()
      const { value } = await Preferences.get({ key: 'fcmToken' })
      if (value) fcmToken.value = value
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
    attachMessagingListeners,
    handleNotificationNavigation,
    requestPermission: isNative ? requestNativePermission : requestWebPermission,
    getDeliveredNotifications,
    removeAllNotifications,
  }
}

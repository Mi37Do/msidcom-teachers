import { ref, computed } from 'vue'
import axios from 'axios'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Badge } from '@capawesome/capacitor-badge'
import { Capacitor } from '@capacitor/core'
import { useRouter } from 'vue-router'

export function useNotificationBadge() {
  const notifications = ref([])
  const lastCheckedIds = ref(new Set())
  const hasPermission = ref(false)
  const router = useRouter()

  // Computed: Count of unread notifications
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.is_read).length
  })

  // Request notification permissions
  const requestPermissions = async () => {
    try {
      const result = await LocalNotifications.requestPermissions()
      hasPermission.value = result.display === 'granted'
      return hasPermission.value
    } catch (error) {
      console.error('Error requesting permissions:', error)
      return false
    }
  }

  // Check permissions
  const checkPermissions = async () => {
    try {
      const result = await LocalNotifications.checkPermissions()
      hasPermission.value = result.display === 'granted'
      return hasPermission.value
    } catch (error) {
      console.error('Error checking permissions:', error)
      return false
    }
  }

  // Get notifications from API
  const getNotifications = async () => {
    try {
      const response = await axios.get('/api/Notifications_sql')
      const newNotifications = response.data.Notifications

      // Get unread notifications
      const unreadNotifications = newNotifications.filter((n) => !n.is_read)
      const newUnreadCount = unreadNotifications.length

      // Update badge count
      await updateBadgeCount(newUnreadCount)

      // Find NEW unread notifications (ones we haven't shown yet)
      const newUnreadNotifs = unreadNotifications.filter((n) => !lastCheckedIds.value.has(n.id))

      // Show individual notifications for each new unread notification
      if (newUnreadNotifs.length > 0 && hasPermission.value) {
        await showIndividualNotifications(newUnreadNotifs)
      }

      // Update tracked IDs with all current unread notification IDs
      lastCheckedIds.value = new Set(unreadNotifications.map((n) => n.id))

      notifications.value = newNotifications

      return newNotifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Update app badge count
  const updateBadgeCount = async (count) => {
    try {
      if (Capacitor.isNativePlatform()) {
        if (count > 0) {
          await Badge.set({ count })
        } else {
          await Badge.clear()
        }
      }
    } catch (error) {
      console.error('Error updating badge:', error)
    }
  }

  // Show individual notifications for each new notification
  const showIndividualNotifications = async (notificationsList) => {
    try {
      if (!hasPermission.value) {
        console.warn('No notification permission')
        return
      }

      // Create an array of notification objects for LocalNotifications
      const localNotifs = notificationsList.map((notif) => ({
        title: notif.title,
        body: notif.message,
        id: hashStringToNumber(notif.id), // Convert UUID to number for notification ID
        smallIcon: 'ic_stat_icon_notification',
        iconColor: '#488AFF',
        extra: {
          notificationId: notif.id,
          type: notif.type,
          entrevue_id: notif.entrevue_id,
          discussion_id: notif.discussion_id,
          annonce_id: notif.annonce_id,
          created: notif.created,
        },
      }))

      // Schedule all notifications at once
      await LocalNotifications.schedule({
        notifications: localNotifs,
      })
    } catch (error) {
      console.error('Error showing notifications:', error)
    }
  }

  // Helper function to convert UUID string to number for notification ID
  const hashStringToNumber = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Show a single notification manually
  const showSingleNotification = async (notification) => {
    try {
      if (!hasPermission.value) {
        console.warn('No notification permission')
        return
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title,
            body: notification.message,
            id: hashStringToNumber(notification.id),
            smallIcon: 'ic_stat_icon_notification',
            iconColor: '#488AFF',
            extra: {
              notificationId: notification.id,
              type: notification.type,
              entrevue_id: notification.entrevue_id,
              discussion_id: notification.discussion_id,
              annonce_id: notification.annonce_id,
              created: notification.created,
            },
          },
        ],
      })
    } catch (error) {
      console.error('Error showing single notification:', error)
    }
  }

  // Clear specific notification by ID
  const clearNotification = async (notificationId) => {
    try {
      const numericId = hashStringToNumber(notificationId)
      await LocalNotifications.cancel({
        notifications: [{ id: numericId }],
      })
    } catch (error) {
      console.error('Error clearing notification:', error)
    }
  }

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      // Get all pending notifications
      const pending = await LocalNotifications.getPending()

      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications,
        })
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error)
    }
  }

  // Clear badge
  const clearBadge = async () => {
    try {
      await updateBadgeCount(0)
      await clearAllNotifications()
      lastCheckedIds.value.clear()
    } catch (error) {
      console.error('Error clearing badge:', error)
    }
  }

  // Mark notifications as read and update badge
  const markAsRead = async (notificationIds) => {
    try {
      // Your API call to mark as read
      // await axios.post('/api/notifications/mark-read', { ids: notificationIds })
      let response = await axios.patch(`/api/Notification/${notificationIds}/`, {
        is_read: true,
      })
      // Update local state
      notifications.value = notifications.value.map((n) =>
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n,
      )

      // Clear specific notifications from system tray
      for (const id of notificationIds) {
        await clearNotification(id)
        lastCheckedIds.value.delete(id)
      }

      // Update badge with new count
      await updateBadgeCount(unreadCount.value)

      router.push({ name: 'notifications-panel' })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Handle notification click and navigate based on type
  const handleNotificationClick = (notification) => {
    const extra = notification.notification.extra

    // Route based on notification type
    switch (extra.type) {
      case 'ENTREVUE_DEMANDE':
        if (extra.entrevue_id) {
          // Navigate to entrevue details
          console.log('Navigate to entrevue:', extra.entrevue_id)
          // router.push(`/entrevues/${extra.entrevue_id}`)
        }
        break
      case 'DISCUSSION':
        if (extra.discussion_id) {
          console.log('Navigate to discussion:', extra.discussion_id)
          // router.push(`/discussions/${extra.discussion_id}`)
        }
        break
      case 'ANNONCE':
        if (extra.annonce_id) {
          console.log('Navigate to annonce:', extra.annonce_id)
          // router.push(`/annonces/${extra.annonce_id}`)
        }
        break
      default:
        console.log('Unknown notification type:', extra.type)
    }

    // Mark as read when clicked
    if (extra.notificationId) {
      markAsRead([extra.notificationId])
    }
  }

  // Initialize - check permissions and get notifications
  const initialize = async () => {
    const permitted = await checkPermissions()

    if (!permitted) {
      console.log('Requesting permissions...')
      await requestPermissions()
    }

    await getNotifications()

    // Listen for notification clicks
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      handleNotificationClick,
    )
  }

  // Setup polling for new notifications
  const startPolling = (intervalMs = 30000) => {
    return setInterval(async () => {
      await getNotifications()
    }, intervalMs)
  }

  // Stop polling
  const stopPolling = (intervalId) => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  return {
    notifications,
    unreadCount,
    hasPermission,
    requestPermissions,
    checkPermissions,
    getNotifications,
    showSingleNotification,
    updateBadgeCount,
    clearBadge,
    clearNotification,
    clearAllNotifications,
    markAsRead,
    initialize,
    startPolling,
    stopPolling,
  }
}

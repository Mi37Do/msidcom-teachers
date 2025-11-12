import { ref, computed } from 'vue'
import axios from 'axios'
import { Badge } from '@capawesome/capacitor-badge'
import { Capacitor } from '@capacitor/core'
import { defineStore } from 'pinia'

export const useNotificationBadge = defineStore('notifications', () => {
  const notifications = ref([])
  const notificationsList = ref([])

  // Computed: Count of unread notifications
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.is_read).length
  })

  // Get notifications from API
  const getNotifications = async () => {
    try {
      const response = await axios.get('/api/Notifications_sql')
      const newNotifications = response.data.Notifications
      notificationsList.value = newNotifications
      notifications.value = newNotifications

      // Update badge count on native platforms
      const newUnreadCount = newNotifications.filter((n) => !n.is_read).length
      await updateBadgeCount(newUnreadCount)

      return newNotifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Update app badge count (native only)
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

  // Clear badge
  const clearBadge = async () => {
    try {
      await updateBadgeCount(0)
    } catch (error) {
      console.error('Error clearing badge:', error)
    }
  }

  // Mark notifications as read and update badge
  const markAsRead = async (notificationIds) => {
    try {
      // Mark each notification as read via API
      await Promise.all(
        notificationIds.map((id) => axios.patch(`/api/Notification/${id}/`, { is_read: true })),
      )

      // Update both local states
      notifications.value = notifications.value.map((n) =>
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n,
      )

      notificationsList.value = notificationsList.value.map((n) =>
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n,
      )

      // Update badge with new count
      await updateBadgeCount(unreadCount.value)
    } catch (error) {
      console.error('Error marking as read:', error)
      throw error
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.value.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds)
    }
  }

  // Initialize - fetch notifications
  const initialize = async () => {
    await getNotifications()
  }

  return {
    notifications,
    notificationsList,
    unreadCount,
    getNotifications,
    updateBadgeCount,
    clearBadge,
    markAsRead,
    markAllAsRead,
    initialize,
  }
})

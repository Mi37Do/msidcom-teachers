import { ref, computed } from 'vue'
import axios from 'axios'
import { Badge } from '@capawesome/capacitor-badge'
import { Capacitor } from '@capacitor/core'
import { defineStore } from 'pinia'

export const useNotificationBadge = defineStore('notifications', () => {
  const notifications = ref([])
  const notificationsList = ref([])
  const currentPage = ref(1)
  const hasNextPage = ref(true)
  const loadingMore = ref(false)

  // Computed: Count of unread notifications
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.is_read).length
  })

  const STUDENTS_TYPES = ['ABSENCE_RETARD_ELEVE', 'STATUE_PRESENCE_ELEVE', 'CONVOCATION', 'ANNONCE', 'BULLETIN_DISPONIBLE']
  const EVENTS_TYPES = ['ABSENCE_RETARD_PROF', 'ANNONCE_PROF', 'EVENT']
  const MESSAGES_TYPES = ['ENTREVUE_DEMANDE', 'ENTREVUE_ACCEPTEE', 'ENTREVUE_REFUSEE', 'MESSAGE']

  const studentsUnreadCount = computed(() =>
    notifications.value.filter((n) => !n.is_read && STUDENTS_TYPES.includes(n.type)).length
  )
  const eventsUnreadCount = computed(() =>
    notifications.value.filter((n) => !n.is_read && EVENTS_TYPES.includes(n.type)).length
  )
  const messagesUnreadCount = computed(() =>
    notifications.value.filter((n) => !n.is_read && MESSAGES_TYPES.includes(n.type)).length
  )

  // Get notifications from API
  const getNotifications = async (page = 1) => {
    try {
      const response = await axios.get('/api/Notifications_sql_paginations/', { params: { page } })
      const newNotifications = response.data.Notifications ?? response.data.results ?? []

      if (page === 1) {
        notifications.value = newNotifications
        notificationsList.value = newNotifications
      } else {
        notifications.value = [...notifications.value, ...newNotifications]
        notificationsList.value = [...notificationsList.value, ...newNotifications]
      }

      currentPage.value = page
      hasNextPage.value = !!response.data.next

      // Update badge count on native platforms (only on first page load)
      if (page === 1) {
        const newUnreadCount = notifications.value.filter((n) => !n.is_read).length
        await updateBadgeCount(newUnreadCount)
      }

      return newNotifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  const loadNextPage = async () => {
    if (!hasNextPage.value || loadingMore.value) return
    loadingMore.value = true
    await getNotifications(currentPage.value + 1)
    loadingMore.value = false
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
      await Promise.all(
        notificationIds.map((id) => axios.patch(`/api/Notification/${id}/`, { is_read: true })),
      )

      notifications.value = notifications.value.map((n) =>
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n,
      )

      notificationsList.value = notificationsList.value.map((n) =>
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n,
      )

      await updateBadgeCount(unreadCount.value)
    } catch (error) {
      console.error('Error marking as read:', error)
      throw error
    }
  }

  // Mark all notifications of given types as read via bulk endpoint
  const markTypesRead = async (types) => {
    try {
      await Promise.all(
        types.map((type) =>
          axios.post('/api/Update_notification_state/', { notification_state: type })
        )
      )
      await initialize()
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  // Initialize badge only - uses non-paginated endpoint for app launch
  const initializeBadge = async () => {
    try {
      const response = await axios.get('/api/Notifications_sql')
      notifications.value = response.data.Notifications ?? []
      const newUnreadCount = notifications.value.filter((n) => !n.is_read).length
      await updateBadgeCount(newUnreadCount)
    } catch (error) {
      console.error('Error fetching notifications badge:', error)
    }
  }

  // Initialize - fetch badge counts from non-paginated endpoint
  const initialize = async () => {
    await initializeBadge()
  }

  return {
    notifications,
    notificationsList,
    unreadCount,
    studentsUnreadCount,
    eventsUnreadCount,
    messagesUnreadCount,
    currentPage,
    hasNextPage,
    loadingMore,
    initializeBadge,
    getNotifications,
    loadNextPage,
    updateBadgeCount,
    clearBadge,
    markAsRead,
    markTypesRead,
    initialize,
  }
})

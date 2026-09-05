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

  // Types grouped by the section that actually displays them
  const STUDENTS_TYPES = ['ABSENCE_RETARD_ELEVE', 'STATUE_PRESENCE_ELEVE', 'CONVOCATION', 'BULLETIN_DISPONIBLE']
  // Absences/lates of the teacher are shown in the calendar section
  const CALENDAR_TYPES = ['ABSENCE_RETARD_PROF']
  // Announcements (school and teacher) live under the events section
  const EVENTS_TYPES = ['EVENT', 'ANNONCE', 'ANNONCE_PROF']
  const MESSAGES_TYPES = ['ENTREVUE_DEMANDE', 'ENTREVUE_ACCEPTEE', 'ENTREVUE_REFUSEE', 'MESSAGE']

  // Unread count for an arbitrary set of types (used by the tab badges)
  const unreadCountFor = (types) =>
    notifications.value.filter((n) => !n.is_read && types.includes(n.type)).length

  const studentsUnreadCount = computed(() => unreadCountFor(STUDENTS_TYPES))
  const calendarUnreadCount = computed(() => unreadCountFor(CALENDAR_TYPES))
  const eventsUnreadCount = computed(() => unreadCountFor(EVENTS_TYPES))
  const messagesUnreadCount = computed(() => unreadCountFor(MESSAGES_TYPES))

  // Last push received while the app was in the foreground. Views watch it
  // (see useLiveNotificationRefresh) to refetch their own data instead of
  // forcing the user to navigate away and back.
  const lastPush = ref(null)

  const pushReceived = (data) => {
    if (!data?.type) return
    lastPush.value = { ...data, receivedAt: Date.now() }
  }

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

  // Locally flag notifications of the given types as read + refresh badge
  const applyTypesRead = async (types) => {
    const mark = (n) => (types.includes(n.type) ? { ...n, is_read: true } : n)
    notifications.value = notifications.value.map(mark)
    notificationsList.value = notificationsList.value.map(mark)
    await updateBadgeCount(unreadCount.value)
  }

  // Mark given types as read — one bulk call, and only for types that are
  // actually unread (no request at all when there is nothing to mark)
  const markTypesRead = async (types) => {
    const unreadTypes = [...new Set(
      notifications.value.filter((n) => !n.is_read && types.includes(n.type)).map((n) => n.type)
    )]
    if (!unreadTypes.length) return
    try {
      await axios.post('/api/Update_notification_state_multiple_state/', {
        notification_states: unreadTypes,
      })
      await applyTypesRead(unreadTypes)
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  // Mark all unread types in one bulk call — used by notificationsView only
  const markAllUnreadTypes = async () => {
    const unreadTypes = [...new Set(
      notifications.value.filter((n) => !n.is_read).map((n) => n.type)
    )]
    if (!unreadTypes.length) return
    try {
      await axios.post('/api/Update_notification_state_multiple_state/', {
        notification_states: unreadTypes,
      })
      await applyTypesRead(unreadTypes)
    } catch (error) {
      console.error('Error marking all unread types as read:', error)
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
    calendarUnreadCount,
    eventsUnreadCount,
    messagesUnreadCount,
    unreadCountFor,
    lastPush,
    pushReceived,
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
    markAllUnreadTypes,
    initialize,
  }
})

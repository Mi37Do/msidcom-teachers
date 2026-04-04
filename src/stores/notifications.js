import { ref, computed } from 'vue'
import axios from 'axios'
import { Badge } from '@capawesome/capacitor-badge'
import { Capacitor } from '@capacitor/core'
import { defineStore } from 'pinia'

export const useNotificationBadge = defineStore('notifications', () => {
  // Used by polling — full list for badge/sidebar/push
  const notifications = ref([])

  // Used by the notifications view — paginated list
  const notificationsList = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const loadingMore = ref(false)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.is_read).length)

  // Called on login and by polling every 5s
  const fetchInitial = async () => {
    try {
      const response = await axios.get('/api/Notifications_sql')
      const newNotifications = response.data.Notifications

      // Trigger local push for newly unread items
      const prevIds = new Set(notifications.value.map((n) => n.id))
      const newUnread = newNotifications.filter((n) => !n.is_read && !prevIds.has(n.id))
      for (const n of newUnread) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(n.title || 'Notification', { body: n.message || '' })
        }
      }

      notifications.value = newNotifications
      await updateBadgeCount(newNotifications.filter((n) => !n.is_read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Called from notifications view on mount and page change
  const getNotifications = async (page = 1) => {
    try {
      const response = await axios.get(`/api/Notifications_sql_paginations/?page=${page}`)
      console.log('paginated response:', response.data)
      const data = response.data
      // Support both {Notifications: [...]} and {results: [...]} and direct array
      notificationsList.value = data.Notifications ?? data.results ?? (Array.isArray(data) ? data : [])
      currentPage.value = data.current_page ?? data.page ?? page
      totalPages.value = data.total_pages ?? data.num_pages ?? 1
    } catch (error) {
      console.error('Error fetching paginated notifications:', error)
    }
  }

  // Called on scroll — appends next page to notificationsList
  const loadNextPage = async () => {
    if (loadingMore.value || currentPage.value >= totalPages.value) return
    loadingMore.value = true
    try {
      const next = currentPage.value + 1
      const response = await axios.get(`/api/Notifications_sql_paginations/?page=${next}`)
      const data = response.data
      const items = data.Notifications ?? data.results ?? (Array.isArray(data) ? data : [])
      notificationsList.value = [...notificationsList.value, ...items]
      currentPage.value = data.current_page ?? data.page ?? next
      totalPages.value = data.total_pages ?? data.num_pages ?? totalPages.value
    } catch (error) {
      console.error('Error loading next page:', error)
    }
    loadingMore.value = false
  }

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

  const clearBadge = async () => {
    await updateBadgeCount(0)
  }

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

  const markAllAsRead = async () => {
    const unreadIds = notifications.value.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length > 0) await markAsRead(unreadIds)
  }

  // Called on login
  const initialize = async () => {
    await fetchInitial()
  }

  return {
    notifications,
    notificationsList,
    currentPage,
    totalPages,
    loadingMore,
    unreadCount,
    fetchInitial,
    getNotifications,
    loadNextPage,
    updateBadgeCount,
    clearBadge,
    markAsRead,
    markAllAsRead,
    initialize,
  }
})

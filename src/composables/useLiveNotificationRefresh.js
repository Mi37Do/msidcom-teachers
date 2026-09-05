import { watch } from 'vue'
import { useNotificationBadge } from '@/stores/notifications'

/**
 * Refetch the current view's data when a push of one of `types` arrives while
 * the user is already on that view.
 *
 * Without this the new item only shows up after navigating away and back, since
 * the list is only loaded on mount.
 *
 * @param {string[]} types    notification types this view displays
 * @param {Function} refresh  loader to run again (may be async)
 * @param {Object}  [options]
 * @param {boolean} [options.markRead=true] also clear those types, the user is looking at them
 */
export function useLiveNotificationRefresh(types, refresh, options = {}) {
  const { markRead = true } = options
  const useNotif = useNotificationBadge()

  watch(
    () => useNotif.lastPush,
    async (push) => {
      if (!push || !types.includes(push.type)) return

      try {
        await refresh(push)
      } catch (error) {
        console.error('Error refreshing after push:', error)
      }

      if (markRead) await useNotif.markTypesRead(types)
    },
  )
}

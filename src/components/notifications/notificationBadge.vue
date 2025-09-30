<template>
  <div class="notification-container">
    <!-- Notification Icon with Badge -->
    <div class="notification-icon" @click="handleClick">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>

      <!-- Badge showing unread count -->
      <span v-if="unreadCount > 0" class="badge" :class="{ 'pulse': hasNewNotifications }">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </div>

    <!-- Optional: Permission request button -->
    <button v-if="showPermissionButton && !hasPermission" class="permission-btn" @click="handlePermissionRequest">
      Activer les notifications
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useNotificationBadge } from '@/composables/useNotificationBadge';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  pollingInterval: {
    type: Number,
    default: 30000 // 30 seconds
  },
  showPermissionButton: {
    type: Boolean,
    default: true
  },
  navigateOnClick: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['click', 'permissionGranted', 'permissionDenied', 'newNotification']);

const router = useRouter();

const {
  unreadCount,
  hasPermission,
  notifications,
  requestPermissions,
  initialize,
  startPolling,
  stopPolling
} = useNotificationBadge();

let pollingIntervalId = null;
const hasNewNotifications = ref(false);
const previousUnreadCount = ref(0);

// Watch for new notifications and trigger pulse animation
watch(unreadCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    hasNewNotifications.value = true;
    emit('newNotification', notifications.value);

    // Remove pulse after animation
    setTimeout(() => {
      hasNewNotifications.value = false;
    }, 2000);
  }
  previousUnreadCount.value = newCount;
});

const handleClick = () => {
  emit('click');

  if (props.navigateOnClick) {
    router.push('/notifications');
  }
};

const handlePermissionRequest = async () => {
  const granted = await requestPermissions();

  if (granted) {
    emit('permissionGranted');
    // Start polling after permission is granted
    if (!pollingIntervalId) {
      pollingIntervalId = startPolling(props.pollingInterval);
    }
  } else {
    emit('permissionDenied');
  }
};

onMounted(async () => {
  // Initialize notifications
  await initialize();

  // Store initial count
  previousUnreadCount.value = unreadCount.value;

  // Start polling for new notifications if permission is granted
  if (hasPermission.value) {
    pollingIntervalId = startPolling(props.pollingInterval);
  }
});

onBeforeUnmount(() => {
  // Clear polling interval
  if (pollingIntervalId) {
    stopPolling(pollingIntervalId);
    pollingIntervalId = null;
  }
});

// Expose methods for parent component
defineExpose({
  refresh: async () => {
    const { getNotifications } = useNotificationBadge();
    await getNotifications();
  }
});
</script>

<style scoped>
.notification-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.notification-icon:active {
  transform: scale(0.95);
}

.notification-icon svg {
  display: block;
  color: #333;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #f44336;
  color: white;
  font-size: 11px;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.badge.pulse {
  animation: pulse 1s ease-in-out 2;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.permission-btn {
  padding: 6px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
}

.permission-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.permission-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .notification-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .notification-icon svg {
    color: #fff;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notification-icon {
    padding: 6px;
  }

  .badge {
    font-size: 10px;
    min-width: 16px;
    height: 16px;
  }

  .permission-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>

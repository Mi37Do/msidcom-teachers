import { createRouter, createWebHistory } from 'vue-router'
import classesRoutes from './classes'
import { useWidgetStore } from '@/stores/widget'
import eventsRoutes from './events'
import timeTableRoutes from './calendar'
import chatsRoutes from './chats'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login-view',
      component: () => import('@/views/auth/loginView.vue'),
    },
    {
      path: '/app',
      name: 'app-panel',
      component: () => import('../views/appPanel.vue'),
      redirect: { name: 'classes-panel' },
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: '/notifications',
          name: 'notifications-panel',
          component: () => import('../views/pages/notificationsView.vue'),
        },
        {
          path: '/profile',
          name: 'profile-panel',
          component: () => import('../views/pages/profileView.vue'),
        },
        {
          path: '/classes',
          name: 'classes-panel',
          component: () => import('../views/pages/classesView.vue'),
          children: classesRoutes,
          redirect: { name: 'list-classes-view' },
        },
        {
          path: '/calendar',
          name: 'calendar-panel',
          component: () => import('../views/pages/calendarView.vue'),
          /***/
          children: timeTableRoutes,
          redirect: { name: 'time-table-view' },
        },
        {
          path: '/events',
          name: 'events-panel',
          component: () => import('../views/pages/eventsView.vue'),
          /***/
          children: eventsRoutes,
          redirect: { name: 'schedule-view' },
        },
        {
          path: '/messages',
          name: 'messages-panel',
          component: () => import('../views/pages/messagesView.vue'),
          /***/
          children: chatsRoutes,
          redirect: { name: 'chats-panel' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const useWidget = useWidgetStore()
  try {
    await useWidget.initData()
    //  useWidget.getWebConfig()

    if (to.meta.requireAuth && !useWidget.authUser.isAuthenticated) {
      next({ name: 'login-view' })
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
    next(false)
    useWidget.addToast({
      msg: error.message,
      color: 'red',
    })
  }
})

export default router

const eventsRoutes = [
  {
    path: 'schedule',
    name: 'schedule-view',
    meta: {
      notificationTypes: ['EVENT'],
    },
    component: () => import('@/views/events/eventsView.vue'),
  },
  //examsAnnoncementsView.vue
  {
    path: 'exams-annoncements',
    name: 'exams-annoncements-view',
    meta: {
      notificationTypes: ['ANNONCE', 'ANNONCE_PROF'],
    },
    component: () => import('@/views/events/examsAnnoncementsView.vue'),
  },
]

export default eventsRoutes

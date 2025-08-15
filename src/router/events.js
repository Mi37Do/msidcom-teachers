const eventsRoutes = [
  {
    path: 'schedule',
    name: 'schedule-view',
    component: () => import('@/views/events/eventsView.vue'),
  },
  //examsAnnoncementsView.vue
  {
    path: 'exams-annoncements',
    name: 'exams-annoncements-view',
    component: () => import('@/views/events/examsAnnoncementsView.vue'),
  },
]

export default eventsRoutes

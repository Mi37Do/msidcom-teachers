const timeTableRoutes = [
  {
    path: 'time-table',
    name: 'time-table-view',
    component: () => import('@/views/calendar/timeTableView.vue'),
  },
  {
    path: 'abscences',
    name: 'abscences-view',
    component: () => import('@/views/calendar/abscencesView.vue'),
  },
]

export default timeTableRoutes

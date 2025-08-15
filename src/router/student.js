const studentRoutes = [
  {
    path: 'main',
    name: 'main-student-view',
    component: () => import('../views/student/mainView.vue'),
  },
  {
    path: 'abscences',
    name: 'abscences-student-view',
    component: () => import('../views/student/abscencesView.vue'),
  },
  {
    path: 'notes',
    name: 'notes-student-view',
    component: () => import('../views/student/notesView.vue'),
  },
]

export default studentRoutes

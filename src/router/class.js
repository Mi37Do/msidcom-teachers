import studentRoutes from './student'

const classRoutes = [
  {
    path: 'main',
    name: 'main-classes-view',
    component: () => import('@/views/class/mainView.vue'),
  },
  {
    path: 'abscences',
    name: 'abscences-classes-view',
    component: () => import('@/views/class/abscencesView.vue'),
    meta: {
      section: 'abscences',
    },
  },
  {
    path: 'annoncements',
    name: 'annoncements-classes-view',
    component: () => import('@/views/class/annoncementsView.vue'),
    meta: {
      section: 'annoncements',
    },
  },
  {
    path: 'notes',
    name: 'notes-classes-view',
    component: () => import('@/views/class/notesView.vue'),
    meta: {
      section: 'enteringNotes',
    },
  },
  {
    path: 'students',
    name: 'students-classes-view',
    component: () => import('@/views/class/studentsView.vue'),
    meta: {
      section: 'studentPerProfile',
    },
  },
  {
    path: 'student/:studentId',
    name: 'student-view',
    component: () => import('@/views/class/studentView.vue'),
    meta: {
      section: 'studentPerProfile',
    },
    redirect: { name: 'main-student-view' },
    children: studentRoutes,
  },
  {
    path: 'program',
    name: 'program-classes-view',
    component: () => import('@/views/class/programView.vue'),
    meta: {
      section: 'programAdvance',
    },
  },
  {
    path: 'summons',
    name: 'summons-classes-view',
    component: () => import('@/views/class/summonsView.vue'),
    meta: {
      section: 'summons',
    },
    redirect: { name: 'add-summon-view' },
    children: [
      {
        path: 'add',
        name: 'add-summon-view',
        component: () => import('@/views/class/summons/summonsView.vue'),
      },
      {
        path: 'historique',
        name: 'historique-summon-view',
        component: () => import('@/views/class/summons/historiqueView.vue'),
      },
    ],
  },
]

export default classRoutes

import classRoutes from './class'

const classesRoutes = [
  {
    path: 'list',
    name: 'list-classes-view',
    meta: {
      notificationTypes: ['ABSENCE_RETARD_ELEVE', 'STATUE_PRESENCE_ELEVE', 'CONVOCATION', 'BULLETIN_DISPONIBLE'],
    },
    component: () => import('@/views/classes/classesListView.vue'),
  },
  {
    path: 'class/:id',
    name: 'class-panel',
    component: () => import('@/views/classes/classView.vue'),
    children: classRoutes,
    redirect: { name: 'main-classes-view' },
  },
]

export default classesRoutes

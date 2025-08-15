import classRoutes from './class'

const classesRoutes = [
  {
    path: 'list',
    name: 'list-classes-view',
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

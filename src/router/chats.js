const chatsRoutes = [
  {
    path: '/chats-panel',
    name: 'chats-panel',
    component: () => import('@/views/messages/chatsPanel.vue'),
    redirect: { name: 'chat-view' },
    children: [
      {
        path: '/chat',
        name: 'chat-view',
        meta: {
          notificationTypes: ['MESSAGE'],
        },
        component: () => import('@/views/messages/chatView.vue'),
      },
    ],
  },
  {
    path: '/interview',
    name: 'interview-view',
    meta: {
      notificationTypes: ['ENTREVUE_DEMANDE', 'ENTREVUE_ACCEPTEE', 'ENTREVUE_REFUSEE'],
    },
    component: () => import('@/views/messages/interviewView.vue'),
  },
]

export default chatsRoutes

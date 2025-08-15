const chatsRoutes = [
  {
    path: '/chats-panel',
    name: 'chats-panel',
    component: () => import('@/views/messages/chatsPanel.vue'),
    redirect: { name: 'chats-view' },
    children: [
      {
        path: '/chats',
        name: 'chats-view',
        component: () => import('@/views/messages/chatsView.vue'),
      },
      {
        path: '/chat/:id',
        name: 'chat-view',
        component: () => import('@/views/messages/chatView.vue'),
      },
    ],
  },
  {
    path: '/interview',
    name: 'interview-view',
    component: () => import('@/views/messages/interviewView.vue'),
  },
]

export default chatsRoutes

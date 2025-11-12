// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAw7XYVCQBiLBGYw3Dd_f51RHkOJLF-YMc',
  authDomain: 'msidcom-6515f.firebaseapp.com',
  projectId: 'msidcom-6515f',
  storageBucket: 'msidcom-6515f.firebasestorage.app',
  messagingSenderId: '182888477835',
  appId: '1:182888477835:web:1e9ab1122ab7351a71108e',
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

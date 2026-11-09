// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { Capacitor } from '@capacitor/core'

const firebaseConfig = {
  apiKey: 'AIzaSyAw7XYVCQBiLBGYw3Dd_f51RHkOJLF-YMc',
  authDomain: 'msidcom-6515f.firebaseapp.com',
  projectId: 'msidcom-6515f',
  storageBucket: 'msidcom-6515f.firebasestorage.app',
  messagingSenderId: '182888477835',
  appId: '1:182888477835:web:1e9ab1122ab7351a71108e',
  measurementId: 'G-LN20JE15G7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firebase Cloud Messaging (Web SDK) only works in a real browser — it needs
// Service Worker/IndexedDB/PushManager, which aren't available the same way
// under Capacitor's WKWebView (capacitor://localhost). Calling getMessaging()
// there throws synchronously, which breaks the module graph for anything that
// imports this file. Native push goes through @capacitor-firebase/messaging
// instead, so only initialize the Web SDK messaging service on the web.
let messaging = null
if (!Capacitor.isNativePlatform()) {
  try {
    messaging = getMessaging(app)
  } catch (err) {
    console.error('Firebase Messaging unsupported in this environment:', err)
  }
}

export { messaging, getToken, onMessage }

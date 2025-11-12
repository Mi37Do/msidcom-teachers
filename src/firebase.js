// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

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

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }

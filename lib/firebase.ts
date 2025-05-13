// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializar Firebase solo en el cliente
let app;
let auth;

// Verificar que estamos en el cliente antes de inicializar
if (typeof window !== 'undefined') {
  // Inicializar solo si no hay apps ya inicializadas
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]; // Si ya hay una app inicializada, úsala
  }
  auth = getAuth(app);
}

// Exportar para uso en otros archivos
export { firebaseConfig, auth }

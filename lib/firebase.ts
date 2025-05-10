import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBflKTvTdE15bUuvvHmODRLYuzduDOmRNo",
  authDomain: "traderbloom-459308.firebaseapp.com",
  projectId: "traderbloom-459308",
  storageBucket: "traderbloom-459308.firebasestorage.app",
  messagingSenderId: "780329783215",
  appId: "1:780329783215:web:501ac5c70617fe9acea95a",
  measurementId: "G-2CZELR0SSB",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios de Firebase
export const auth = getAuth(app)

// Exportar la configuración para uso en otros archivos
export { firebaseConfig }

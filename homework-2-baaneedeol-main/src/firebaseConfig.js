import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4q2WoOTNz-S1fJ_KGoL_CCLr_L0MCB_o",
  authDomain: "todo-6f5d8.firebaseapp.com",
  projectId: "todo-6f5d8",
  storageBucket: "todo-6f5d8.firebasestorage.app",
  messagingSenderId: "1000972256043",
  appId: "1:1000972256043:web:757ada85608efde03e3b6e",
  measurementId: "G-XPJV08RS36"
};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { firebaseApp, auth, db }

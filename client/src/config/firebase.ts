// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7yze27YuesgIOiZomeMJq-ebeaP_NsvU",
  authDomain: "spacey-military.firebaseapp.com",
  projectId: "spacey-military",
  storageBucket: "spacey-military.firebasestorage.app",
  messagingSenderId: "618454858616",
  appId: "1:618454858616:web:dc25d2e7c125331f2ce68d",
  measurementId: "G-N7EBP8ET6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();


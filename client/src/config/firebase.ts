// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhG6XbZcSFyYEdqPQeTmJSjihTTx_QxW4",
  authDomain: "spacey-mail.firebaseapp.com",
  projectId: "spacey-mail",
  storageBucket: "spacey-mail.firebasestorage.app",
  messagingSenderId: "124953964156",
  appId: "1:124953964156:web:e3d25aa73edc4b969d23f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();


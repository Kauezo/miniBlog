// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3mtbxFMa5sXOpdd-_z_Sk4PzcTW7iVro",
  authDomain: "test-36209.firebaseapp.com",
  projectId: "test-36209",
  storageBucket: "test-36209.firebasestorage.app",
  messagingSenderId: "763229952464",
  appId: "1:763229952464:web:2357537f6b038aded501d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGTT4n9fk1CDdcapnih9LtTui3oAl5OHc",
  authDomain: "master-math-a2a11.firebaseapp.com",
  projectId: "master-math-a2a11",
  storageBucket: "master-math-a2a11.firebasestorage.app",
  messagingSenderId: "89603759343",
  appId: "1:89603759343:web:1cef71b0385d3fccc28f1a"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

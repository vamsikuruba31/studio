
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzwe1PVrKqQd7z7UWkLz0qOL6Dp_uVkfc",
  authDomain: "campusconnect-92d97.firebaseapp.com",
  projectId: "campusconnect-92d97",
  storageBucket: "campusconnect-92d97.appspot.com",
  messagingSenderId: "986369405803",
  appId: "1:986369405803:web:ce3822bda01d6b117b122e",
};

// Check if the config is loaded
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Firebase config is missing or incomplete. Check your .env file and restart the server.");
}

// Initialize Firebase for SSR
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

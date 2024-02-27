import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { IFirebaseConfig } from "../types";

const firebaseConfig: IFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  databaseURL: "https://menu-maker-f6ac6-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initializations
const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
export const db = getDatabase(app);

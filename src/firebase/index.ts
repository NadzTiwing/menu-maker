import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { IFirebaseConfig } from "../types";

const firebaseConfig: IFirebaseConfig = {
  apiKey: "AIzaSyCgxZanEhxUaduNLVZt8OlMJ6h5Nr0XSxo",
  authDomain: "menu-maker-f6ac6.firebaseapp.com",
  projectId: "menu-maker-f6ac6",
  storageBucket: "menu-maker-f6ac6.appspot.com",
  messagingSenderId: "472345358080",
  appId: "1:472345358080:web:591901a0651bc3572f4de5"
};

// Initializations
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // 본인의 Firebase Console에서 복사한 키를 넣으세요
  apiKey: "AIzaSyBZAPVaAvBJjrCSNvPgFP96IjNhv_Tr9Dw",
  authDomain: "modeutime.firebaseapp.com",
  projectId: "modeutime",
  storageBucket: "modeutime.firebasestorage.app",
  messagingSenderId: "789921247588",
  appId: "1:789921247588:web:ee3277bec0678e7c214a71",
  measurementId: "G-HH6CNYEQ6W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
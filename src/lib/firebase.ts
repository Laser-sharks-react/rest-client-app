import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';
import { serverTimestamp } from '@firebase/database';

type RequestLog = {
  userId: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  createdAt?: Date | Timestamp;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const login = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: cred.user.uid }),
  });

  return cred;
};

const register = async (name: string, email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  await addDoc(collection(db, 'users'), {
    uid: user.uid,
    name,
    authProvider: 'local',
    email,
  });
};

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

const logout = () => {
  void signOut(auth);
};

async function saveRequest(log: RequestLog) {
  await addDoc(collection(db, 'requests'), {
    ...log,
    createdAt: serverTimestamp(),
  });
}

export { auth, db, login, register, resetPassword, logout, saveRequest };

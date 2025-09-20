import { initializeApp } from 'firebase/app';
import {
  getAuth,
  updateProfile,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  type Timestamp,
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from 'firebase/firestore';
import { serverTimestamp } from '@firebase/database';
import { ROUTES } from './constants/routes';

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

const COLLECTIONS = {
  users: 'users',
  requests: 'requests',
};

const login = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await fetch(ROUTES.session, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: cred.user.uid }),
  });

  return cred;
};

const register = async (name: string, email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, COLLECTIONS.users, user.uid), {
    uid: user.uid,
    name,
    authProvider: 'local',
    email,
  });
  await updateProfile(user, { displayName: name });
};

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

const logout = () => {
  void signOut(auth);
  void fetch(ROUTES.session, {
    method: 'DELETE',
  });
};

async function saveRequest(log: RequestLog) {
  await addDoc(collection(db, COLLECTIONS.requests), {
    ...log,
    createdAt: serverTimestamp(),
  });
}

export {
  auth,
  db,
  login,
  register,
  resetPassword,
  logout,
  saveRequest,
  COLLECTIONS,
};

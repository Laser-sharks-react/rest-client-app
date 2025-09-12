import 'server-only';
import admin from 'firebase-admin';

const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
const privateKey = rawKey.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey,
    }),
  });
}

export const dbAdmin = admin.firestore();

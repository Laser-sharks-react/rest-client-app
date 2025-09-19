import 'server-only';
import admin from 'firebase-admin';
import type {
  RequestSuccessParams,
  RequestErrorParams,
  RequestRecord,
} from './types/request';
import { COLLECTIONS } from './firebase';
import { isRequestRecord } from './utils/is-request-record';
import { createRequestRecord } from './utils/create-request-record';

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
const dbAdmin = admin.firestore();

async function setUserRequest(
  params: RequestSuccessParams | RequestErrorParams
) {
  const restoreData = params.restore ?? {};
  const documentData = {
    uid: params.uid,
    latencyMs: params.latencyMs,
    time: params.time,
    endpoint: params.endpoint || 'proxy_error',
    method: params.method || null,
    status: params.status || null,
    reqBytes: params.reqBytes || 0,
    resBytes: params.resBytes || 0,
    error: 'error' in params ? params.error : null,
    restore: {
      url: restoreData.url || '',
      method: restoreData.method || null,
      headers:
        'headers' in restoreData && restoreData.headers !== undefined
          ? restoreData.headers
          : null,
      body: restoreData.body || '',
    },
  };

  await dbAdmin
    .collection(COLLECTIONS.users)
    .doc(params.uid)
    .collection(COLLECTIONS.requests)
    .add(documentData);
}

async function getUserRequests(
  uid: string,
  limit = 100
): Promise<RequestRecord[]> {
  const snapshots = await dbAdmin
    .collection(COLLECTIONS.users)
    .doc(uid)
    .collection(COLLECTIONS.requests)
    .orderBy('time', 'desc')
    .limit(limit)
    .get();

  return snapshots.docs.map(doc => {
    const data = { ...doc.data(), id: doc.id };
    if (isRequestRecord(data)) return data;

    return createRequestRecord(data, uid);
  });
}

export { dbAdmin, setUserRequest, getUserRequests };

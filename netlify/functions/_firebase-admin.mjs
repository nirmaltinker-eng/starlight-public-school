import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function credential() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return applicationDefault();
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  return cert(serviceAccount);
}

const app = getApps()[0] || initializeApp({ credential: credential(), projectId: process.env.FIREBASE_PROJECT_ID || undefined });
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export async function requireAdmin(event) {
  const authorization = event.headers.authorization || event.headers.Authorization || '';
  if (!authorization.startsWith('Bearer ')) throw Object.assign(new Error('Login required.'), { status: 401 });
  const decoded = await adminAuth.verifyIdToken(authorization.slice(7));
  const profile = await adminDb.collection('users').doc(decoded.uid).get();
  const data = profile.data();
  if (!profile.exists || data?.role !== 'admin' || data?.active === false) throw Object.assign(new Error('Admin access required.'), { status: 403 });
  return { uid: decoded.uid, ...data };
}

export const response = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });

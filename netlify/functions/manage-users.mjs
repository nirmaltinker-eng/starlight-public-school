import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, requireAdmin, response } from './_firebase-admin.mjs';

const clean = (value, max = 120) => String(value ?? '').trim().slice(0, max);
const validRole = (role) => role === 'admin' ? 'admin' : 'student';

export async function handler(event) {
  try {
    const admin = await requireAdmin(event);
    if (event.httpMethod === 'GET') {
      const snapshot = await adminDb.collection('users').get();
      const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() })).sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      return response(200, { users });
    }

    const body = JSON.parse(event.body || '{}');
    if (event.httpMethod === 'POST') {
      const email = clean(body.email).toLowerCase(), password = String(body.password || ''), name = clean(body.name);
      if (!email || !name || password.length < 6) return response(400, { error: 'Name, valid email and minimum 6-character password required.' });
      const created = await adminAuth.createUser({ email, password, displayName: name, disabled: body.active === false });
      try {
        await adminDb.collection('users').doc(created.uid).set({ name, email, className: clean(body.className, 20), roll: clean(body.roll, 30), role: validRole(body.role), active: body.active !== false, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      } catch (error) {
        await adminAuth.deleteUser(created.uid);
        throw error;
      }
      return response(201, { uid: created.uid });
    }

    if (event.httpMethod === 'PUT') {
      const uid = clean(body.uid, 128), email = clean(body.email).toLowerCase(), name = clean(body.name);
      if (!uid || !email || !name) return response(400, { error: 'UID, name and email required.' });
      if (uid === admin.uid && (body.active === false || validRole(body.role) !== 'admin')) return response(400, { error: 'You cannot disable or demote your own admin account.' });
      const authUpdate = { email, displayName: name, disabled: body.active === false };
      if (body.password) {
        if (String(body.password).length < 6) return response(400, { error: 'Password must contain at least 6 characters.' });
        authUpdate.password = String(body.password);
      }
      await adminAuth.updateUser(uid, authUpdate);
      await adminDb.collection('users').doc(uid).set({ name, email, className: clean(body.className, 20), roll: clean(body.roll, 30), role: validRole(body.role), active: body.active !== false, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return response(200, { uid });
    }

    if (event.httpMethod === 'DELETE') {
      const uid = clean(body.uid, 128);
      if (!uid) return response(400, { error: 'UID required.' });
      if (uid === admin.uid) return response(400, { error: 'You cannot delete your own admin account.' });
      await adminAuth.deleteUser(uid).catch((error) => { if (error.code !== 'auth/user-not-found') throw error; });
      await adminDb.collection('users').doc(uid).delete();
      return response(200, { uid });
    }
    return response(405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('manage-users error', error);
    return response(error.status || 500, { error: error.message || 'Server error.' });
  }
}

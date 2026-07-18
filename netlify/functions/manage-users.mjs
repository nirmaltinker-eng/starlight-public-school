import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, requireAdmin, response } from './_firebase-admin.mjs';

const clean = (value, max = 120) => String(value ?? '').trim().slice(0, max);
const validRole = (role) => role === 'admin' ? 'admin' : 'student';
const isMaster = (profile) => profile.role === 'admin' && clean(profile.roll, 30).toUpperCase() === 'ADMIN-01';

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
      if (body.action === 'bulk-create') {
        const rows = Array.isArray(body.users) ? body.users.slice(0, 100) : [];
        if (!rows.length) return response(400, { error: 'Excel import में कोई valid student नहीं मिला।' });
        const created = [], failed = [];
        for (let index = 0; index < rows.length; index += 1) {
          const row = rows[index];
          const email = clean(row.email).toLowerCase(), password = String(row.password || ''), name = clean(row.name);
          if (!email || !name || password.length < 6) {
            failed.push({ row: index + 2, email, error: 'Name, email और minimum 6-character password required है।' });
            continue;
          }
          try {
            const account = await adminAuth.createUser({ email, password, displayName: name, disabled: row.active === false });
            try {
              await adminDb.collection('users').doc(account.uid).set({ name, email, className: clean(row.className, 20), roll: clean(row.roll, 30), role: 'student', active: row.active !== false, createdBy: admin.uid, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
              created.push({ uid: account.uid, email });
            } catch (error) {
              await adminAuth.deleteUser(account.uid);
              throw error;
            }
          } catch (error) { failed.push({ row: index + 2, email, error: error.message || 'Account create नहीं हुआ।' }); }
        }
        return response(200, { created, failed });
      }
      const email = clean(body.email).toLowerCase(), password = String(body.password || ''), name = clean(body.name);
      if (!email || !name || password.length < 6) return response(400, { error: 'Name, valid email and minimum 6-character password required.' });
      if (validRole(body.role) === 'admin' && !isMaster(admin)) return response(403, { error: 'Only ADMIN-01 can create administrator accounts.' });
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
      const targetProfile = await adminDb.collection('users').doc(uid).get();
      if (targetProfile.data()?.role === 'admin' && uid !== admin.uid && !isMaster(admin)) return response(403, { error: 'Only ADMIN-01 can manage administrator accounts.' });
      if (validRole(body.role) === 'admin' && targetProfile.data()?.role !== 'admin' && !isMaster(admin)) return response(403, { error: 'Only ADMIN-01 can promote administrators.' });
      if (clean(body.roll, 30).toUpperCase() === 'ADMIN-01' && uid !== admin.uid) return response(400, { error: 'ADMIN-01 owner roll is reserved.' });
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
      const targetProfile = await adminDb.collection('users').doc(uid).get();
      if (targetProfile.data()?.role === 'admin' && !isMaster(admin)) return response(403, { error: 'Only ADMIN-01 can delete administrator accounts.' });
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

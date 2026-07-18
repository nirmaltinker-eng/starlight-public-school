import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, requireAdmin, response } from './_firebase-admin.mjs';

const defaults = {
  active: true,
  title: 'Admission Open 2026-27',
  message: 'Star Light Public School में नए सत्र के लिए प्रवेश प्रारम्भ हैं। सीमित सीटों के लिए आज ही संपर्क करें।',
  buttonText: 'Admission Enquiry',
  buttonLink: 'contact.html',
  frequency: 'session',
  version: 'admission-2026-27'
};
const clean = (value, max) => String(value ?? '').trim().slice(0, max);
const isMaster = (profile) => profile.role === 'admin' && clean(profile.roll, 30).toUpperCase() === 'ADMIN-01';

export async function handler(event) {
  try {
    const reference = adminDb.collection('siteSettings').doc('advertisement');
    if (event.httpMethod === 'GET') {
      const snapshot = await reference.get();
      return response(200, { ...defaults, ...(snapshot.exists ? snapshot.data() : {}) });
    }
    if (event.httpMethod !== 'PUT') return response(405, { error: 'Method not allowed.' });
    const admin = await requireAdmin(event);
    if (!isMaster(admin)) return response(403, { error: 'Advertisement settings केवल ADMIN-01 owner बदल सकता है।' });
    const body = JSON.parse(event.body || '{}');
    const settings = {
      active: body.active !== false,
      title: clean(body.title, 80) || defaults.title,
      message: clean(body.message, 400) || defaults.message,
      buttonText: clean(body.buttonText, 40) || defaults.buttonText,
      buttonLink: clean(body.buttonLink, 300) || defaults.buttonLink,
      frequency: body.frequency === 'page' ? 'page' : 'session',
      version: String(Date.now()),
      updatedBy: admin.uid,
      updatedAt: FieldValue.serverTimestamp()
    };
    await reference.set(settings, { merge: true });
    return response(200, settings);
  } catch (error) {
    console.error('site-settings error', error);
    return response(error.status || 500, { error: error.message || 'Server error.' });
  }
}

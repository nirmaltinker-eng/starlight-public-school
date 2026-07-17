export async function handler() {
  try {
    const config = JSON.parse(process.env.FIREBASE_WEB_CONFIG || '');
    const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
    if (!required.every((key) => config[key])) throw new Error('Incomplete Firebase web configuration.');
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(config) };
  } catch {
    return { statusCode: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Firebase configuration is not set.' }) };
  }
}

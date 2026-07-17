(function () {
  const authScript = document.currentScript;
  const siteRoot = authScript?.src ? new URL('../', authScript.src) : new URL('./', document.baseURI);
  const rootPath = document.documentElement.dataset.root || '';
  const requiresLogin = document.body?.dataset?.requiresLogin === 'true';
  const requiresAdmin = document.body?.dataset?.requiresAdmin === 'true';
  if (requiresLogin || requiresAdmin) document.documentElement.classList.add('auth-pending');

  let firebaseAuth = null;
  let firestore = null;
  let profile = null;
  let currentUser = null;
  let setupError = null;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.firebase) resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Firebase library load नहीं हो सकी।'));
    document.head.appendChild(script);
  });

  const fetchConfig = async () => {
    if (window.SLPS_FIREBASE_CONFIG) return window.SLPS_FIREBASE_CONFIG;
    const builtInConfig = {
      apiKey: 'AIzaSyAnhiCqFqSePIqvAfXaj_YATd4Lst8LTSU',
      authDomain: 'star-light-public-school.firebaseapp.com',
      projectId: 'star-light-public-school',
      storageBucket: 'star-light-public-school.firebasestorage.app',
      messagingSenderId: '712166304514',
      appId: '1:712166304514:web:29580e183d6bfe517df01b'
    };
    try {
      const response = await fetch(new URL('.netlify/functions/firebase-config', siteRoot), { cache: 'no-store' });
      if (response.ok) return response.json();
    } catch (_) { /* Static/local fallback below. */ }
    return builtInConfig;
  };

  const friendlyError = (error) => {
    const code = error?.code || '';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Email या password सही नहीं है।';
    if (code.includes('too-many-requests')) return 'बहुत अधिक attempts हुए हैं। थोड़ी देर बाद try करें।';
    if (code.includes('network-request-failed')) return 'Internet connection check करें।';
    if (code.includes('invalid-email')) return 'सही email address दर्ज करें।';
    return error?.message || 'Login पूरा नहीं हो सका।';
  };

  const readProfile = async (user) => {
    if (!user) return null;
    const snapshot = await firestore.collection('users').doc(user.uid).get();
    if (!snapshot.exists) throw new Error('इस account का student profile नहीं मिला। Admin से संपर्क करें।');
    const data = snapshot.data();
    if (data.active === false) throw new Error('यह account disabled है। Admin से संपर्क करें।');
    return { uid: user.uid, email: user.email, ...data };
  };

  const updatePage = () => {
    document.querySelectorAll('.test-nav').forEach((link) => {
      link.classList.toggle('unlocked', Boolean(profile));
      link.onclick = profile ? null : (event) => {
        event.preventDefault();
        location.href = rootPath + 'login.html?next=' + encodeURIComponent('tests.html');
      };
    });
    document.querySelectorAll('.login-nav').forEach((link) => {
      if (!profile) return;
      link.textContent = `${profile.name || profile.email} · Logout`;
      link.href = '#logout';
      link.title = 'Logout';
      link.onclick = async (event) => {
        event.preventDefault();
        await window.SLPS_AUTH.logout();
      };
    });
    document.querySelectorAll('[data-student-name]').forEach((node) => {
      node.textContent = profile ? `${profile.name} · Class ${profile.className || '-'} · Roll ${profile.roll || '-'}` : '';
    });
    if (profile?.role === 'admin') {
      document.querySelectorAll('nav,.nav,.lesson-nav').forEach((nav) => {
        if (nav.querySelector('.admin-nav')) return;
        const link = document.createElement('a');
        link.className = 'admin-nav';
        link.href = rootPath + 'admin.html';
        link.textContent = 'Admin';
        nav.appendChild(link);
      });
    }
  };

  const redirectToLogin = () => {
    const next = location.pathname + location.search;
    location.replace(rootPath + 'login.html?next=' + encodeURIComponent(next));
  };

  const ready = (async () => {
    try {
      const config = await fetchConfig();
      await loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore-compat.js');
      if (!window.firebase.apps.length) window.firebase.initializeApp(config);
      firebaseAuth = window.firebase.auth();
      firestore = window.firebase.firestore();
      currentUser = await new Promise((resolve) => {
        const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      });
      if (currentUser) {
        try {
          profile = await readProfile(currentUser);
        } catch (error) {
          await firebaseAuth.signOut();
          currentUser = null;
          throw error;
        }
      }
      if (requiresLogin && !profile) return redirectToLogin();
      if (requiresAdmin && profile?.role !== 'admin') {
        location.replace(rootPath + (profile ? 'index.html' : 'login.html?next=admin.html'));
        return;
      }
      updatePage();
      document.documentElement.classList.remove('auth-pending');
      return profile;
    } catch (error) {
      setupError = friendlyError(error);
      document.documentElement.classList.remove('auth-pending');
      window.dispatchEvent(new CustomEvent('slps-auth-error', { detail: setupError }));
      if ((requiresLogin || requiresAdmin) && !location.pathname.endsWith('/login.html')) redirectToLogin();
      return null;
    }
  })();

  window.SLPS_AUTH = {
    ready,
    get student() { return profile; },
    get user() { return currentUser; },
    get setupError() { return setupError; },
    friendlyError,
    async login({ email, password }) {
      await ready.catch(() => null);
      if (!firebaseAuth || !firestore) throw new Error('Firebase setup incomplete है।');
      const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const nextProfile = await readProfile(credential.user);
      currentUser = credential.user;
      profile = nextProfile;
      return nextProfile;
    },
    async resetPassword(email) {
      await ready.catch(() => null);
      if (!firebaseAuth) throw new Error('Firebase setup incomplete है।');
      return firebaseAuth.sendPasswordResetEmail(email);
    },
    async token() {
      await ready;
      if (!firebaseAuth?.currentUser) throw new Error('Login required.');
      return firebaseAuth.currentUser.getIdToken();
    },
    async logout() {
      if (firebaseAuth) await firebaseAuth.signOut();
      location.href = rootPath + 'login.html';
    }
  };
}());

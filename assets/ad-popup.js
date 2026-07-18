(function () {
  const script = document.currentScript;
  const siteRoot = script?.src ? new URL('../', script.src) : new URL('./', document.baseURI);
  const fallback = {
    active: true,
    title: 'Admission Open 2026-27',
    message: 'Star Light Public School में नए सत्र के लिए प्रवेश प्रारम्भ हैं। सीमित सीटों के लिए आज ही संपर्क करें।',
    buttonText: 'Admission Enquiry',
    buttonLink: 'contact.html',
    frequency: 'session',
    version: 'admission-2026-27'
  };

  const safeLink = (value) => {
    try {
      const url = new URL(String(value || 'contact.html'), siteRoot);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : new URL('contact.html', siteRoot).href;
    } catch (_) { return new URL('contact.html', siteRoot).href; }
  };

  const closePopup = (overlay) => {
    overlay.remove();
    document.body.classList.remove('ad-popup-open');
  };

  const show = (settings, preview = false) => {
    document.querySelector('.school-ad-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'school-ad-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'school-ad-title');
    const modal = document.createElement('section');
    modal.className = 'school-ad-modal';
    const badge = document.createElement('p');
    badge.className = 'school-ad-badge';
    badge.textContent = 'Star Light Public School';
    const title = document.createElement('h2');
    title.id = 'school-ad-title';
    title.textContent = settings.title;
    const message = document.createElement('p');
    message.className = 'school-ad-message';
    message.textContent = settings.message;
    const actions = document.createElement('div');
    actions.className = 'school-ad-actions';
    const link = document.createElement('a');
    link.href = safeLink(settings.buttonLink);
    link.textContent = settings.buttonText;
    link.className = 'school-ad-primary';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'school-ad-close';
    close.setAttribute('aria-label', 'Close advertisement');
    close.textContent = '×';
    const later = document.createElement('button');
    later.type = 'button';
    later.className = 'school-ad-later';
    later.textContent = preview ? 'Close Preview' : 'अभी नहीं';
    actions.append(link, later);
    modal.append(close, badge, title, message, actions);
    overlay.appendChild(modal);
    close.addEventListener('click', () => closePopup(overlay));
    later.addEventListener('click', () => closePopup(overlay));
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closePopup(overlay); });
    document.addEventListener('keydown', function escape(event) {
      if (event.key !== 'Escape' || !overlay.isConnected) return;
      document.removeEventListener('keydown', escape);
      closePopup(overlay);
    });
    document.body.appendChild(overlay);
    document.body.classList.add('ad-popup-open');
    close.focus();
  };

  const load = async () => {
    let settings = fallback;
    try {
      const response = await fetch(new URL('.netlify/functions/site-settings', siteRoot), { cache: 'no-store' });
      if (response.ok) settings = { ...fallback, ...(await response.json()) };
    } catch (_) { /* Default admission announcement remains available offline. */ }
    if (!settings.active) return;
    const key = `slpsAdSeen:${settings.version || settings.title}`;
    if (settings.frequency !== 'page' && sessionStorage.getItem(key)) return;
    if (settings.frequency !== 'page') sessionStorage.setItem(key, '1');
    show(settings);
  };

  window.SLPS_AD = { preview: (settings) => show({ ...fallback, ...settings }, true), defaults: fallback };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
}());

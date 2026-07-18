(function () {
  const key = 'slpsTheme';
  const themeScript = document.currentScript;
  const siteRoot = themeScript && themeScript.src
    ? new URL('../', themeScript.src)
    : new URL('./', document.baseURI);
  const saved = localStorage.getItem(key);
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      button.setAttribute('aria-pressed', String(theme === 'light'));
    });
  };

  const ensureThemeToggle = () => {
    if (document.querySelector('.theme-toggle')) return;
    const button = document.createElement('button');
    button.id = 'globalThemeToggle';
    button.className = 'theme-toggle global-theme-control';
    button.type = 'button';
    document.body.appendChild(button);
  };

  const ensureLogo = () => {
    const logos = document.querySelectorAll('img[src*="school-logo.png"]');
    if (logos.length) {
      logos.forEach((logo) => {
        logo.classList.add('site-school-logo');
        logo.loading = 'eager';
        logo.decoding = 'async';
      });
      return;
    }

    const header = document.querySelector('header') || document.body;
    if (!header) return;
    const link = document.createElement('a');
    link.className = 'global-page-logo';
    link.href = new URL('index.html', siteRoot).href;
    link.setAttribute('aria-label', 'Star Light Public School home');
    const image = document.createElement('img');
    image.className = 'site-school-logo';
    image.src = new URL('school-logo.png', siteRoot).href;
    image.alt = 'Star Light Public School logo';
    image.loading = 'eager';
    image.decoding = 'async';
    link.appendChild(image);
    header.prepend(link);
  };

  const ensurePageControls = () => {
    const currentUrl = new URL(location.href);
    const homeUrl = new URL('index.html', siteRoot);
    const currentPath = currentUrl.pathname.replace(/\/$/, '/index.html');
    const isHome = currentPath === homeUrl.pathname;

    if (!isHome && !document.getElementById('globalBackButton')) {
      const backButton = document.createElement('button');
      backButton.id = 'globalBackButton';
      backButton.className = 'global-page-control global-back-button';
      backButton.type = 'button';
      backButton.textContent = 'Back';
      backButton.setAttribute('aria-label', 'Go back to previous page');
      backButton.addEventListener('click', () => {
        const referrer = document.referrer ? new URL(document.referrer) : null;
        if (history.length > 1 && referrer && referrer.origin === location.origin) history.back();
        else location.href = homeUrl.href;
      });
      document.body.appendChild(backButton);
    }

    let topButton = document.getElementById('scrollToTopBtn');
    if (!topButton) {
      topButton = document.createElement('button');
      topButton.id = 'scrollToTopBtn';
      topButton.className = 'global-page-control global-top-button';
      topButton.type = 'button';
      topButton.textContent = 'Top';
      topButton.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(topButton);
    }
    const updateTopButton = () => topButton.classList.toggle('is-visible', scrollY > 280);
    topButton.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
  };

  ensureThemeToggle();
  apply(saved || preferred);
  ensureLogo();
  ensurePageControls();
  if (!document.querySelector('script[data-slps-translation]')) {
    const translationScript = document.createElement('script');
    translationScript.src = new URL('assets/translation.js', siteRoot).href;
    translationScript.dataset.slpsTranslation = 'true';
    document.body.appendChild(translationScript);
  }
  if (!document.querySelector('script[data-slps-ad-popup]')) {
    const adScript = document.createElement('script');
    adScript.src = new URL('assets/ad-popup.js', siteRoot).href;
    adScript.dataset.slpsAdPopup = 'true';
    document.body.appendChild(adScript);
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.theme-toggle');
    if (!button) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  });
}());

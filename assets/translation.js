(function () {
  const path = decodeURIComponent(location.pathname).toLowerCase();
  const isLearningPage = /\/(notes|tests)\//.test(path) || /(?:notes|tests)(?:-|\.)/.test(path);
  const isEnglishSubject = /\/(english|english-grammar|english-speaking)(?:\/|$)/.test(path) || /english(?:-|_)?(?:grammar|speaking|notes)/.test(path);
  const savedLanguage = localStorage.getItem('slpsLanguage');
  const defaultLanguage = isLearningPage && !isEnglishSubject ? 'hi' : 'en';
  const language = savedLanguage || defaultLanguage;

  const setCookie = (value) => {
    const cookie = `googtrans=${value};path=/;max-age=31536000;SameSite=Lax`;
    document.cookie = cookie;
    if (location.hostname.includes('.')) document.cookie = `${cookie};domain=${location.hostname}`;
  };
  const clearCookie = () => {
    document.cookie = 'googtrans=;path=/;max-age=0';
    if (location.hostname.includes('.')) document.cookie = `googtrans=;path=/;domain=${location.hostname};max-age=0`;
  };
  if (language === 'hi') setCookie('/en/hi'); else clearCookie();

  document.querySelectorAll('code,pre,.formula,.equation,[data-no-translate]').forEach((element) => {
    element.classList.add('notranslate');
    element.setAttribute('translate', 'no');
  });

  const control = document.createElement('div');
  control.className = 'language-control notranslate';
  control.setAttribute('translate', 'no');
  control.innerHTML = '<label for="site-language">भाषा</label><select id="site-language" aria-label="Page language"><option value="hi">हिंदी</option><option value="en">English</option></select><div id="google_translate_element" aria-hidden="true"></div>';
  document.body.appendChild(control);
  const selector = control.querySelector('#site-language');
  selector.value = language;
  selector.addEventListener('change', () => {
    localStorage.setItem('slpsLanguage', selector.value);
    if (selector.value === 'hi') setCookie('/en/hi'); else clearCookie();
    location.reload();
  });

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false }, 'google_translate_element');
  };
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.onerror = () => control.classList.add('translation-unavailable');
  document.head.appendChild(script);
}());

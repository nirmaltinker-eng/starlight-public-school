(function () {
  const key = 'slpsTheme';
  const saved = localStorage.getItem(key);
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    });
  };
  apply(saved || preferred);
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.theme-toggle');
    if (!button) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  });
}());


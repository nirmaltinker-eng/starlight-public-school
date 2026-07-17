(function () {
  const STORAGE_KEY = 'slpsStudent';
  const student = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { return null; } })();
  const root = document.documentElement.dataset.root || '';
  const isTestPage = document.body?.dataset?.requiresLogin === 'true';
  if (isTestPage && !student) {
    const next = location.pathname + location.search;
    location.replace(root + 'login.html?next=' + encodeURIComponent(next));
    return;
  }
  document.querySelectorAll('.test-nav').forEach((link) => {
    if (student) link.classList.add('unlocked');
    link.addEventListener('click', (event) => {
      if (!student) {
        event.preventDefault();
        location.href = root + 'login.html?next=tests.html';
      }
    });
  });
  document.querySelectorAll('.login-nav').forEach((link) => {
    if (student) {
      link.textContent = student.name;
      link.title = 'Student logged in';
    }
  });
  document.querySelectorAll('[data-student-name]').forEach((node) => {
    node.textContent = student ? `${student.name} · Class ${student.className} · Roll ${student.roll}` : '';
  });
  window.SLPS_AUTH = {
    student,
    login(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); },
    logout() { localStorage.removeItem(STORAGE_KEY); location.href = root + 'login.html'; }
  };
}());

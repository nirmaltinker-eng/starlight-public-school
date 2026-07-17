(function () {
  const form = document.getElementById('login-form');
  const email = document.getElementById('student-email');
  const password = document.getElementById('student-password');
  const errorBox = document.getElementById('form-error');
  const statusBox = document.getElementById('login-status');
  const submit = form.querySelector('button[type="submit"]');

  const showError = (error) => {
    errorBox.textContent = window.SLPS_AUTH.friendlyError(error);
    submit.disabled = false;
  };
  window.addEventListener('slps-auth-error', (event) => { statusBox.textContent = event.detail; });

  window.SLPS_AUTH.ready.then((student) => {
    statusBox.textContent = window.SLPS_AUTH.setupError || (student ? `${student.name} पहले से logged in हैं।` : 'Firebase secure login ready है।');
  }).catch(showError);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.textContent = '';
    submit.disabled = true;
    submit.textContent = 'Signing in…';
    try {
      const student = await window.SLPS_AUTH.login({ email: email.value.trim(), password: password.value });
      const next = new URLSearchParams(location.search).get('next');
      location.href = next || (student.role === 'admin' ? 'admin.html' : 'tests.html');
    } catch (error) {
      submit.textContent = 'Login & Open Tests';
      showError(error);
    }
  });

  document.getElementById('forgot-password').addEventListener('click', async () => {
    errorBox.textContent = '';
    if (!email.value.trim()) {
      errorBox.textContent = 'पहले अपना email address लिखें।';
      return;
    }
    try {
      await window.SLPS_AUTH.resetPassword(email.value.trim());
      statusBox.textContent = 'Password reset email भेज दी गई है।';
    } catch (error) { showError(error); }
  });
}());

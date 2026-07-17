(function () {
  const form = document.getElementById('student-form');
  const list = document.getElementById('user-list');
  const message = document.getElementById('admin-message');
  const search = document.getElementById('user-search');
  let users = [];

  const fields = {
    uid: document.getElementById('edit-uid'), name: document.getElementById('account-name'), email: document.getElementById('account-email'),
    className: document.getElementById('account-class'), roll: document.getElementById('account-roll'), role: document.getElementById('account-role'),
    password: document.getElementById('account-password'), active: document.getElementById('account-active')
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const showMessage = (text, error = false) => { message.textContent = text; message.style.color = error ? '#b3261e' : '#21733b'; };
  const api = async (method = 'GET', body) => {
    const token = await window.SLPS_AUTH.token();
    const response = await fetch('/.netlify/functions/manage-users', { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Admin request failed.');
    return data;
  };

  const render = () => {
    const query = search.value.trim().toLowerCase();
    const filtered = users.filter((user) => [user.name, user.email, user.roll, user.className, user.role].some((value) => String(value || '').toLowerCase().includes(query)));
    list.innerHTML = filtered.length ? filtered.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>Class ${escapeHtml(user.className || '-')}<br>Roll ${escapeHtml(user.roll || '-')}</td><td>${escapeHtml(user.role)}</td><td class="${user.active === false ? 'status-disabled' : 'status-active'}">${user.active === false ? 'Disabled' : 'Active'}</td><td><div class="account-actions"><button type="button" data-edit="${user.uid}">Edit</button><button type="button" data-toggle="${user.uid}">${user.active === false ? 'Enable' : 'Disable'}</button><button type="button" class="danger" data-delete="${user.uid}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="6">No matching accounts.</td></tr>';
  };

  const loadUsers = async () => {
    list.innerHTML = '<tr><td colspan="6">Loading accounts…</td></tr>';
    try { users = (await api()).users; render(); showMessage(`${users.length} account(s) loaded.`); }
    catch (error) { list.innerHTML = '<tr><td colspan="6">Accounts load नहीं हुए।</td></tr>'; showMessage(error.message, true); }
  };

  const resetForm = () => {
    form.reset(); fields.uid.value = ''; fields.active.checked = true; document.getElementById('form-title').textContent = 'Add Student'; document.getElementById('save-account').textContent = 'Add Account'; document.getElementById('cancel-edit').hidden = true; document.getElementById('password-help').textContent = 'Minimum 6 characters'; fields.password.required = true;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const editing = Boolean(fields.uid.value);
    const payload = { uid: fields.uid.value || undefined, name: fields.name.value.trim(), email: fields.email.value.trim(), className: fields.className.value, roll: fields.roll.value.trim(), role: fields.role.value, password: fields.password.value || undefined, active: fields.active.checked };
    if (!editing && !payload.password) return showMessage('New account के लिए password required है।', true);
    try { await api(editing ? 'PUT' : 'POST', payload); showMessage(editing ? 'Account updated.' : 'Account created.'); resetForm(); await loadUsers(); }
    catch (error) { showMessage(error.message, true); }
  });

  list.addEventListener('click', async (event) => {
    const editUid = event.target.dataset.edit, toggleUid = event.target.dataset.toggle, deleteUid = event.target.dataset.delete;
    const uid = editUid || toggleUid || deleteUid;
    if (!uid) return;
    const user = users.find((entry) => entry.uid === uid);
    if (editUid) {
      Object.entries({ uid:user.uid, name:user.name, email:user.email, className:user.className || '', roll:user.roll || '', role:user.role, active:user.active !== false }).forEach(([key,value]) => { if (key === 'active') fields[key].checked = value; else fields[key].value = value; });
      fields.password.value = ''; fields.password.required = false; document.getElementById('password-help').textContent = 'Blank छोड़ें तो password नहीं बदलेगा'; document.getElementById('form-title').textContent = 'Edit Account'; document.getElementById('save-account').textContent = 'Save Changes'; document.getElementById('cancel-edit').hidden = false; scrollTo({ top: 0, behavior: 'smooth' });
    } else if (toggleUid) {
      try { await api('PUT', { ...user, active: user.active === false }); await loadUsers(); }
      catch (error) { showMessage(error.message, true); }
    } else if (deleteUid && confirm(`${user.name} का account permanently delete करें?`)) {
      try { await api('DELETE', { uid }); await loadUsers(); }
      catch (error) { showMessage(error.message, true); }
    }
  });

  search.addEventListener('input', render);
  document.getElementById('refresh-users').addEventListener('click', loadUsers);
  document.getElementById('cancel-edit').addEventListener('click', resetForm);
  window.SLPS_AUTH.ready.then((profile) => { if (profile?.role === 'admin') loadUsers(); }).catch((error) => showMessage(error.message, true));
}());

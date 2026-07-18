(function () {
  const form = document.getElementById('student-form');
  const list = document.getElementById('user-list');
  const message = document.getElementById('admin-message');
  const search = document.getElementById('user-search');
  const excelInput = document.getElementById('student-excel');
  const importButton = document.getElementById('import-students');
  const importSummary = document.getElementById('import-summary');
  const importErrors = document.getElementById('import-errors');
  const adSection = document.getElementById('advertisement-settings');
  const adForm = document.getElementById('ad-form');
  const adMessage = document.getElementById('ad-admin-message');
  const gallerySection = document.getElementById('gallery-settings');
  const galleryForm = document.getElementById('gallery-form');
  const galleryList = document.getElementById('gallery-admin-list');
  const galleryMessage = document.getElementById('gallery-admin-message');
  let galleryItems = [];
  let users = [];
  let importRows = [];
  let currentProfile = null;

  const fields = {
    uid: document.getElementById('edit-uid'),
    name: document.getElementById('account-name'),
    email: document.getElementById('account-email'),
    className: document.getElementById('account-class'),
    roll: document.getElementById('account-roll'),
    role: document.getElementById('account-role'),
    password: document.getElementById('account-password'),
    active: document.getElementById('account-active')
  };

  const isMaster = () => currentProfile?.role === 'admin' && String(currentProfile?.roll || '').toUpperCase() === 'ADMIN-01';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const showMessage = (text, error = false) => { message.textContent = text; message.style.color = error ? '#b3261e' : '#21733b'; };
  const api = async (method = 'GET', body) => {
    const token = await window.SLPS_AUTH.token();
    const response = await fetch('/.netlify/functions/manage-users', {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Admin request failed.');
    return data;
  };
  const adFields = {
    title: document.getElementById('ad-title'),
    message: document.getElementById('ad-message'),
    buttonText: document.getElementById('ad-button-text'),
    buttonLink: document.getElementById('ad-button-link'),
    frequency: document.getElementById('ad-frequency'),
    active: document.getElementById('ad-active')
  };
  const galleryFields = {
    id: document.getElementById('gallery-id'), file: document.getElementById('gallery-file'), fileName: document.getElementById('gallery-file-name'), caption: document.getElementById('gallery-caption'), batch: document.getElementById('gallery-batch'), folder: document.getElementById('gallery-folder'), order: document.getElementById('gallery-order'), active: document.getElementById('gallery-active')
  };
  const galleryApi = async (method = 'GET', body) => {
    const headers = { 'Content-Type': 'application/json' };
    if (method !== 'GET') headers.Authorization = `Bearer ${await window.SLPS_AUTH.token()}`;
    const response = await fetch('/.netlify/functions/gallery-manage', { method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Gallery request failed.');
    return data;
  };
  const resetGalleryForm = () => {
    galleryForm.reset(); galleryFields.id.value = ''; galleryFields.batch.value = 'Batch 2026'; galleryFields.folder.value = '2026'; galleryFields.order.value = '0'; galleryFields.active.checked = true; document.getElementById('save-gallery-item').textContent = 'Add Gallery Image'; document.getElementById('cancel-gallery-edit').hidden = true;
  };
  const renderGalleryAdmin = () => {
    galleryList.innerHTML = galleryItems.length ? galleryItems.map(item => `<tr><td><img class="gallery-admin-thumb" src="${escapeHtml(item.src)}" alt=""></td><td><strong>${escapeHtml(item.fileName)}</strong><br>${escapeHtml(item.caption)}</td><td>${escapeHtml(item.batch)}<br><small>Folder: ${escapeHtml(item.folder)}</small></td><td>${Number(item.order) || 0}</td><td class="${item.active === false ? 'status-disabled' : 'status-active'}">${item.active === false ? 'Hidden' : 'Visible'}</td><td><div class="account-actions"><button type="button" data-gallery-edit="${item.id}">Edit</button><button type="button" data-gallery-toggle="${item.id}">${item.active === false ? 'Show' : 'Hide'}</button><button type="button" class="danger" data-gallery-delete="${item.id}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="6">No gallery images.</td></tr>';
  };
  const loadGalleryAdmin = async () => {
    try { galleryItems = (await galleryApi()).items; renderGalleryAdmin(); galleryMessage.textContent = `${galleryItems.length} gallery image(s) loaded.`; }
    catch (error) { galleryMessage.textContent = error.message; }
  };
  const compressGalleryImage = (file) => new Promise((resolve, reject) => {
    const image = new Image(); const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url);
      let quality = .84; let dataUrl = canvas.toDataURL('image/webp', quality);
      while (dataUrl.length > 1000000 && quality > .45) { quality -= .08; dataUrl = canvas.toDataURL('image/webp', quality); }
      const imageData = dataUrl.split(',')[1]; if (!imageData || imageData.length > 1100000) return reject(new Error('Image compress नहीं हो सकी; छोटी image चुनें।'));
      resolve({ imageData, mimeType: 'image/webp' });
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image file read नहीं हुई।')); };
    image.src = url;
  });
  const galleryPayload = () => ({ id: galleryFields.id.value || undefined, fileName: galleryFields.fileName.value.trim(), caption: galleryFields.caption.value.trim(), batch: galleryFields.batch.value.trim(), folder: galleryFields.folder.value.trim(), order: Number(galleryFields.order.value) || 0, active: galleryFields.active.checked });
  const initGalleryControls = () => { gallerySection.hidden = false; loadGalleryAdmin(); };

  galleryFields.file.addEventListener('change', () => { if (galleryFields.file.files?.[0] && !galleryFields.fileName.value) galleryFields.fileName.value = galleryFields.file.files[0].name; });
  galleryForm.addEventListener('submit', async (event) => {
    event.preventDefault(); const editing = Boolean(galleryFields.id.value); const file = galleryFields.file.files?.[0];
    if (!editing && !file) return (galleryMessage.textContent = 'नई gallery item के लिए image file चुनें।');
    const payload = galleryPayload();
    try {
      document.getElementById('save-gallery-item').disabled = true; galleryMessage.textContent = 'Image prepare और save हो रही है…';
      if (file) Object.assign(payload, await compressGalleryImage(file));
      await galleryApi(editing ? 'PUT' : 'POST', payload); galleryMessage.textContent = editing ? 'Gallery image updated.' : 'Gallery image added.'; resetGalleryForm(); await loadGalleryAdmin();
    } catch (error) { galleryMessage.textContent = error.message; }
    finally { document.getElementById('save-gallery-item').disabled = false; }
  });
  galleryList.addEventListener('click', async (event) => {
    const editId = event.target.dataset.galleryEdit, toggleId = event.target.dataset.galleryToggle, deleteId = event.target.dataset.galleryDelete; const id = editId || toggleId || deleteId; if (!id) return;
    const item = galleryItems.find(entry => entry.id === id); if (!item) return;
    if (editId) {
      Object.entries({ id: item.id, fileName: item.fileName, caption: item.caption, batch: item.batch, folder: item.folder, order: item.order, active: item.active !== false }).forEach(([key, value]) => { if (key === 'active') galleryFields[key].checked = value; else galleryFields[key].value = value; });
      document.getElementById('save-gallery-item').textContent = 'Save Gallery Changes'; document.getElementById('cancel-gallery-edit').hidden = false; gallerySection.scrollIntoView({ behavior: 'smooth' });
    } else if (toggleId) { try { await galleryApi('PUT', { ...item, active: item.active === false }); await loadGalleryAdmin(); } catch (error) { galleryMessage.textContent = error.message; } }
    else if (deleteId && confirm(`${item.caption} gallery से delete करें?`)) { try { await galleryApi('DELETE', { id }); await loadGalleryAdmin(); } catch (error) { galleryMessage.textContent = error.message; } }
  });
  document.getElementById('refresh-gallery').addEventListener('click', loadGalleryAdmin);
  document.getElementById('cancel-gallery-edit').addEventListener('click', resetGalleryForm);
  const adPayload = () => ({ title: adFields.title.value.trim(), message: adFields.message.value.trim(), buttonText: adFields.buttonText.value.trim(), buttonLink: adFields.buttonLink.value.trim(), frequency: adFields.frequency.value, active: adFields.active.checked });
  const initAdControls = async () => {
    adSection.hidden = false;
    try {
      const response = await fetch('/.netlify/functions/site-settings', { cache: 'no-store' });
      if (response.ok) {
        const settings = await response.json();
        Object.entries(settings).forEach(([key, value]) => { if (!adFields[key]) return; if (key === 'active') adFields[key].checked = value !== false; else adFields[key].value = value; });
      }
    } catch (_) { /* The visible defaults remain ready to save. */ }
  };

  adForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const token = await window.SLPS_AUTH.token();
      const response = await fetch('/.netlify/functions/site-settings', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(adPayload()) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Advertisement save नहीं हुआ।');
      adMessage.textContent = 'Advertisement saved. Updated popup अब सभी pages पर available है।';
      adMessage.style.color = '#21733b';
    } catch (error) { adMessage.textContent = error.message; adMessage.style.color = '#b3261e'; }
  });
  document.getElementById('preview-ad').addEventListener('click', () => {
    if (!window.SLPS_AD) return (adMessage.textContent = 'Popup preview तैयार हो रहा है; एक बार फिर click करें।');
    window.SLPS_AD.preview(adPayload());
  });

  const render = () => {
    const query = search.value.trim().toLowerCase();
    const filtered = users.filter((user) => [user.name, user.email, user.roll, user.className, user.role].some((value) => String(value || '').toLowerCase().includes(query)));
    list.innerHTML = filtered.length ? filtered.map((user) => {
      const protectedAdmin = user.role === 'admin' && !isMaster();
      const disabled = protectedAdmin ? ' disabled title="Only ADMIN-01 can manage administrator accounts"' : '';
      return `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>Class ${escapeHtml(user.className || '-')}<br>Roll ${escapeHtml(user.roll || '-')}</td><td>${escapeHtml(user.role)}</td><td class="${user.active === false ? 'status-disabled' : 'status-active'}">${user.active === false ? 'Disabled' : 'Active'}</td><td><div class="account-actions"><button type="button" data-edit="${user.uid}"${disabled}>Edit</button><button type="button" data-toggle="${user.uid}"${disabled}>${user.active === false ? 'Enable' : 'Disable'}</button><button type="button" class="danger" data-delete="${user.uid}"${disabled}>Delete</button></div></td></tr>`;
    }).join('') : '<tr><td colspan="6">No matching accounts.</td></tr>';
  };

  const loadUsers = async () => {
    list.innerHTML = '<tr><td colspan="6">Loading accounts…</td></tr>';
    try {
      users = (await api()).users;
      render();
      showMessage(`${users.length} account(s) loaded. ${isMaster() ? 'ADMIN-01 master access active.' : ''}`);
    } catch (error) {
      list.innerHTML = '<tr><td colspan="6">Accounts load नहीं हुए।</td></tr>';
      showMessage(error.message, true);
    }
  };

  const resetForm = () => {
    form.reset();
    fields.uid.value = '';
    fields.active.checked = true;
    fields.role.value = 'student';
    document.getElementById('form-title').textContent = 'Add Student';
    document.getElementById('save-account').textContent = 'Add Account';
    document.getElementById('cancel-edit').hidden = true;
    document.getElementById('password-help').textContent = 'Minimum 6 characters';
    fields.password.required = true;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const editing = Boolean(fields.uid.value);
    const payload = { uid: fields.uid.value || undefined, name: fields.name.value.trim(), email: fields.email.value.trim(), className: fields.className.value, roll: fields.roll.value.trim(), role: fields.role.value, password: fields.password.value || undefined, active: fields.active.checked };
    if (!editing && !payload.password) return showMessage('New account के लिए password required है।', true);
    try {
      await api(editing ? 'PUT' : 'POST', payload);
      showMessage(editing ? 'Account updated.' : 'Account created.');
      resetForm();
      await loadUsers();
    } catch (error) { showMessage(error.message, true); }
  });

  list.addEventListener('click', async (event) => {
    const editUid = event.target.dataset.edit;
    const toggleUid = event.target.dataset.toggle;
    const deleteUid = event.target.dataset.delete;
    const uid = editUid || toggleUid || deleteUid;
    if (!uid) return;
    const user = users.find((entry) => entry.uid === uid);
    if (!user) return;
    if (user.role === 'admin' && !isMaster()) return showMessage('Administrator account को केवल ADMIN-01 manage कर सकता है।', true);
    if (editUid) {
      Object.entries({ uid: user.uid, name: user.name, email: user.email, className: user.className || '', roll: user.roll || '', role: user.role, active: user.active !== false }).forEach(([key, value]) => { if (key === 'active') fields[key].checked = value; else fields[key].value = value; });
      fields.password.value = '';
      fields.password.required = false;
      document.getElementById('password-help').textContent = 'Blank छोड़ें तो password नहीं बदलेगा';
      document.getElementById('form-title').textContent = 'Edit Account';
      document.getElementById('save-account').textContent = 'Save Changes';
      document.getElementById('cancel-edit').hidden = false;
      scrollTo({ top: 0, behavior: 'smooth' });
    } else if (toggleUid) {
      try { await api('PUT', { ...user, active: user.active === false }); await loadUsers(); }
      catch (error) { showMessage(error.message, true); }
    } else if (deleteUid && confirm(`${user.name} का account permanently delete करें?`)) {
      try { await api('DELETE', { uid }); await loadUsers(); }
      catch (error) { showMessage(error.message, true); }
    }
  });

  const valueFrom = (row, names) => {
    const entries = Object.entries(row);
    const match = entries.find(([key]) => names.includes(String(key).trim().toLowerCase()));
    return match ? match[1] : '';
  };
  const activeValue = (value) => !['false', 'no', '0', 'disabled', 'inactive'].includes(String(value).trim().toLowerCase());
  const showImportErrors = (errors) => {
    importErrors.hidden = !errors.length;
    importErrors.innerHTML = errors.length ? `<strong>Fix these rows:</strong><ul>${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>` : '';
  };

  excelInput.addEventListener('change', async () => {
    importRows = [];
    importButton.disabled = true;
    showImportErrors([]);
    const file = excelInput.files?.[0];
    if (!file) return (importSummary.textContent = '');
    if (!window.XLSX) return (importSummary.textContent = 'Excel reader load नहीं हुआ। Internet connection check करें।');
    try {
      const workbook = window.XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const rawRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
      if (rawRows.length > 100) throw new Error('एक file में maximum 100 students allowed हैं।');
      const errors = [];
      const seenEmails = new Set();
      importRows = rawRows.map((row, index) => {
        const student = {
          name: String(valueFrom(row, ['name', 'student name'])).trim(),
          email: String(valueFrom(row, ['email', 'email address'])).trim().toLowerCase(),
          password: String(valueFrom(row, ['password'])),
          className: String(valueFrom(row, ['class', 'classname', 'class name'])).trim(),
          roll: String(valueFrom(row, ['roll', 'roll number', 'roll no'])).trim(),
          active: activeValue(valueFrom(row, ['active', 'status']))
        };
        if (!student.name || !student.email || student.password.length < 6) errors.push(`Row ${index + 2}: Name, email और minimum 6-character password required है।`);
        if (seenEmails.has(student.email)) errors.push(`Row ${index + 2}: duplicate email ${student.email}`);
        seenEmails.add(student.email);
        return student;
      });
      showImportErrors(errors);
      if (errors.length || !importRows.length) {
        importRows = [];
        importSummary.textContent = errors.length ? 'File में errors हैं; import शुरू नहीं हुआ।' : 'Sheet में कोई student row नहीं मिली।';
        return;
      }
      importSummary.textContent = `${importRows.length} valid student(s) ready to import.`;
      importButton.disabled = false;
    } catch (error) { importSummary.textContent = error.message; importRows = []; }
  });

  importButton.addEventListener('click', async () => {
    if (!importRows.length) return;
    importButton.disabled = true;
    importSummary.textContent = 'Accounts create हो रहे हैं…';
    try {
      const result = await api('POST', { action: 'bulk-create', users: importRows });
      importSummary.textContent = `${result.created.length} account(s) created; ${result.failed.length} failed.`;
      showImportErrors(result.failed.map((entry) => `${entry.email || `Row ${entry.row}`}: ${entry.error}`));
      excelInput.value = '';
      importRows = [];
      await loadUsers();
    } catch (error) { importSummary.textContent = error.message; importButton.disabled = false; }
  });

  document.getElementById('download-template').addEventListener('click', () => {
    if (!window.XLSX) return showMessage('Excel reader load नहीं हुआ।', true);
    const rows = [{ Name: 'Example Student', Email: 'student@example.com', Password: 'ChangeMe123', Class: '6', Roll: '601', Active: 'Yes' }];
    const workbook = window.XLSX.utils.book_new();
    const sheet = window.XLSX.utils.json_to_sheet(rows);
    window.XLSX.utils.book_append_sheet(workbook, sheet, 'Students');
    window.XLSX.writeFile(workbook, 'star-light-student-import-template.xlsx');
  });

  search.addEventListener('input', render);
  document.getElementById('refresh-users').addEventListener('click', loadUsers);
  document.getElementById('cancel-edit').addEventListener('click', resetForm);
  window.SLPS_AUTH.ready.then((profile) => {
    if (profile?.role !== 'admin') return;
    currentProfile = profile;
    if (!isMaster()) {
      const adminOption = fields.role.querySelector('option[value="admin"]');
      if (adminOption) adminOption.remove();
    } else { initAdControls(); initGalleryControls(); }
    loadUsers();
  }).catch((error) => showMessage(error.message, true));
}());

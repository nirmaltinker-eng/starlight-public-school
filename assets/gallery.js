(async function () {
  const section = document.querySelector('.gallery-section');
  const buttons = document.querySelector('.batch-buttons');

  try {
    const response = await fetch('/.netlify/functions/gallery-manage', { cache: 'no-store' });
    if (response.ok) {
      const items = (await response.json()).items.filter((item) => item.active !== false);
      const groups = new Map();
      items.forEach((item) => { if (!groups.has(item.batch)) groups.set(item.batch, []); groups.get(item.batch).push(item); });
      section.querySelectorAll('.year-title,.photo-gallery').forEach((node) => node.remove());
      buttons.replaceChildren();
      [...groups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0]))).forEach(([batch, entries], groupIndex) => {
        const id = `gallery-batch-${groupIndex}`;
        const button = document.createElement('a'); button.href = `#${id}`; button.textContent = batch; buttons.appendChild(button);
        const title = document.createElement('h3'); title.className = 'year-title'; title.id = id; title.textContent = batch;
        const grid = document.createElement('div'); grid.className = 'photo-gallery';
        entries.sort((a, b) => Number(a.order) - Number(b.order)).forEach((item) => {
          const card = document.createElement('div'); card.className = 'gallery-item'; card.dataset.folder = item.folder || '';
          const image = document.createElement('img'); image.loading = 'lazy'; image.src = item.src; image.alt = item.caption || item.fileName; image.dataset.fileName = item.fileName || '';
          image.addEventListener('load', () => card.classList.toggle('wide', image.naturalWidth / image.naturalHeight > 1.2), { once: true });
          const caption = document.createElement('div'); caption.className = 'image-caption'; caption.textContent = item.caption || item.fileName;
          card.append(image, caption); grid.appendChild(card);
        });
        section.append(title, grid);
      });
    }
  } catch (_) { /* Keep the built-in gallery when the online catalogue is unavailable. */ }

  const images = Array.from(document.querySelectorAll('.gallery-item img'));
  if (!images.length) return;
  const overlay = document.createElement('div'); overlay.className = 'gallery-lightbox'; overlay.hidden = true; overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'Full size gallery photo');
  overlay.innerHTML = '<figure class="gallery-lightbox-figure"><button class="gallery-lightbox-close" type="button" aria-label="Close full size photo">×</button><img alt=""><figcaption></figcaption></figure>';
  const fullImage = overlay.querySelector('img'), caption = overlay.querySelector('figcaption'), close = overlay.querySelector('.gallery-lightbox-close'); let previousFocus = null;
  const hide = () => { overlay.hidden = true; document.body.classList.remove('gallery-lightbox-open'); previousFocus?.focus(); };
  const show = (image) => { previousFocus = image; fullImage.src = image.currentSrc || image.src; fullImage.alt = image.alt; caption.textContent = image.closest('.gallery-item')?.querySelector('.image-caption')?.textContent || image.alt; overlay.hidden = false; document.body.classList.add('gallery-lightbox-open'); close.focus(); };
  images.forEach((image) => { image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', `${image.alt}. Open full size photo`); image.addEventListener('click', () => show(image)); image.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(image); } }); });
  close.addEventListener('click', hide); overlay.addEventListener('click', (event) => { if (event.target === overlay) hide(); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) hide(); }); document.body.appendChild(overlay);
}());

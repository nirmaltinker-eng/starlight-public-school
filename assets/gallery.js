(function () {
  const images = Array.from(document.querySelectorAll('.gallery-item img'));
  if (!images.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'gallery-lightbox';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Full size gallery photo');
  overlay.innerHTML = '<figure class="gallery-lightbox-figure"><button class="gallery-lightbox-close" type="button" aria-label="Close full size photo">×</button><img alt=""><figcaption></figcaption></figure>';
  const fullImage = overlay.querySelector('img');
  const caption = overlay.querySelector('figcaption');
  const close = overlay.querySelector('.gallery-lightbox-close');
  let previousFocus = null;
  const hide = () => {
    overlay.hidden = true;
    document.body.classList.remove('gallery-lightbox-open');
    previousFocus?.focus();
  };
  const show = (image) => {
    previousFocus = image;
    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt;
    caption.textContent = image.closest('.gallery-item')?.querySelector('.image-caption')?.textContent || image.alt;
    overlay.hidden = false;
    document.body.classList.add('gallery-lightbox-open');
    close.focus();
  };
  images.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt}. Open full size photo`);
    image.addEventListener('click', () => show(image));
    image.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(image); } });
  });
  close.addEventListener('click', hide);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) hide(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) hide(); });
  document.body.appendChild(overlay);
}());

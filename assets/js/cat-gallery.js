// Full-screen photo viewer for the cats album (PhotoSwipe).
// Swipe left/right to browse, pinch or double-tap to zoom, swipe down or press Back to close.
import PhotoSwipeLightbox from '../vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const album = document.getElementById('cat-album');

if (album) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: album,
    children: 'a.cat-tile',
    pswpModule: () => import('../vendor/photoswipe/photoswipe.esm.min.js'),
    bgOpacity: 1,
    loop: false,
    wheelToZoom: true,
    showHideAnimationType: 'zoom',
    imageClickAction: 'zoom-or-close',
    tapAction: 'toggle-controls',
    // Edge to edge on phones, a little breathing room on bigger screens.
    paddingFn: (viewport) => (viewport.x < 700
      ? { top: 0, bottom: 0, left: 0, right: 0 }
      : { top: 48, bottom: 72, left: 64, right: 64 }),
  });

  // Caption + date under the photo.
  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'cat-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        el.className = 'pswp__cat-caption';
        const update = () => {
          const link = pswp.currSlide && pswp.currSlide.data.element;
          const caption = link ? link.getAttribute('data-caption') || '' : '';
          const date = link ? link.getAttribute('data-date') || '' : '';
          el.textContent = '';
          if (caption) {
            const c = document.createElement('div');
            c.className = 'pswp__cat-caption-text';
            c.textContent = caption;
            el.appendChild(c);
          }
          if (date) {
            const d = document.createElement('div');
            d.className = 'pswp__cat-caption-date';
            d.textContent = date;
            el.appendChild(d);
          }
          el.hidden = !caption && !date;
        };
        pswp.on('change', update);
        update();
      },
    });
  });

  // Make the phone's Back gesture close the viewer instead of leaving the page.
  let pushed = false;
  lightbox.on('beforeOpen', () => {
    history.pushState({ catViewer: true }, '');
    pushed = true;
  });
  lightbox.on('close', () => {
    if (pushed) {
      pushed = false;
      history.back();
    }
  });
  window.addEventListener('popstate', () => {
    if (pushed && lightbox.pswp) {
      pushed = false;
      lightbox.pswp.close();
    }
  });

  lightbox.init();
}

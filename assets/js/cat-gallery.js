// Cats photo wall: shuffle the photos on every visit, lay them out in balanced
// Pinterest-style columns, and open a full-screen viewer (PhotoSwipe) on tap.
// Viewer: swipe left/right to browse, pinch or double-tap to zoom, swipe down or press Back to close.
import PhotoSwipeLightbox from '../vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const album = document.getElementById('cat-album');

if (album) {
  const tiles = Array.from(album.querySelectorAll('a.cat-tile'));

  // Mix the photos differently on every visit.
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Put each photo into the currently shortest column so the columns end at about the same height.
  const shape = (a) => (Number(a.dataset.pswpHeight) || 1) / (Number(a.dataset.pswpWidth) || 1);
  let columnCount = 0;
  function layout() {
    const n = window.matchMedia('(min-width: 600px)').matches ? 3 : 2;
    if (n === columnCount) return;
    columnCount = n;
    const cols = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'cat-col';
      return c;
    });
    const heights = new Array(n).fill(0);
    tiles.forEach((tile) => {
      const k = heights.indexOf(Math.min(...heights));
      cols[k].appendChild(tile);
      heights[k] += shape(tile);
    });
    album.replaceChildren(...cols);
    album.classList.add('is-js');
  }
  layout();
  window.addEventListener('resize', layout);

  // Viewer: browse in the same mixed order the photos were placed in.
  const lightbox = new PhotoSwipeLightbox({
    dataSource: tiles.map((tile) => ({
      src: tile.href,
      width: Number(tile.dataset.pswpWidth) || 1600,
      height: Number(tile.dataset.pswpHeight) || 1200,
      alt: tile.querySelector('img') ? tile.querySelector('img').alt : '',
      element: tile,
      msrc: tile.querySelector('img') ? tile.querySelector('img').currentSrc || tile.querySelector('img').src : undefined,
      caption: tile.dataset.caption || '',
    })),
    pswpModule: () => import('../vendor/photoswipe/photoswipe.esm.min.js'),
    bgOpacity: 1,
    loop: false,
    wheelToZoom: true,
    showHideAnimationType: 'zoom',
    imageClickAction: 'zoom-or-close',
    tapAction: 'toggle-controls',
    paddingFn: (viewport) => (viewport.x < 700
      ? { top: 0, bottom: 0, left: 0, right: 0 }
      : { top: 48, bottom: 72, left: 64, right: 64 }),
  });

  // Optional caption under the photo.
  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'cat-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        el.className = 'pswp__cat-caption';
        const update = () => {
          const caption = (pswp.currSlide && pswp.currSlide.data.caption) || '';
          el.textContent = caption;
          el.hidden = !caption;
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

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
      e.preventDefault();
      lightbox.loadAndOpen(index);
    });
  });
}

// Sticky top bar: highlight the section currently on screen (homepage only)
// and keep the highlighted link visible when the bar scrolls sideways on phones.
(function () {
  var nav = document.querySelector('.topnav');
  if (!nav) return;
  var list = nav.querySelector('.topnav-links');
  var pairs = [].slice.call(nav.querySelectorAll('a[data-target]'))
    .map(function (a) { return { link: a, target: document.getElementById(a.getAttribute('data-target')) }; })
    .filter(function (p) { return p.target; });

  function markOverflow() {
    nav.classList.toggle('is-overflowing', list.scrollWidth > list.clientWidth + 1);
  }

  function reveal(a) {
    if (list.scrollWidth <= list.clientWidth) return;
    var left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }

  var current = null;
  var lockUntil = 0; // after a click, keep the clicked item highlighted while the page scrolls there
  function setActive(p) {
    if (p === current) return;
    if (current) { current.link.classList.remove('active'); current.link.removeAttribute('aria-current'); }
    current = p;
    if (current) { current.link.classList.add('active'); current.link.setAttribute('aria-current', 'location'); reveal(current.link); }
  }
  pairs.forEach(function (p) {
    p.link.addEventListener('click', function () { setActive(p); lockUntil = Date.now() + 1200; });
  });
  function update() {
    if (!pairs.length || Date.now() < lockUntil) return;
    var line = nav.offsetHeight + 40;
    var active = pairs[0];
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i].target.getBoundingClientRect().top <= line) active = pairs[i];
    }
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) active = pairs[pairs.length - 1];
    setActive(active);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', function () { markOverflow(); update(); });
  window.addEventListener('load', function () { markOverflow(); update(); });
  markOverflow();
  update();

  var activeOnLoad = nav.querySelector('a[aria-current="page"]');
  if (activeOnLoad) reveal(activeOnLoad);
})();

'use strict';

/* ─── PRELOADER ─────────────────────────────────────────────── */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('preloading');

  setTimeout(() => {
    preloader.classList.add('preloader-done');
    document.body.classList.remove('preloading');
  }, 2700);

  preloader.addEventListener('transitionend', () => {
    if (preloader.classList.contains('preloader-done')) {
      preloader.remove();
    }
  }, { once: true });
})();

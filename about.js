'use strict';

/* ─── NAVBAR SCROLL ───────────────────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── MOBILE NAV ──────────────────────────────────────────── */
(function () {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
})();

/* ─── BLOCK REVEAL ON SCROLL ──────────────────────────────── */
(function () {
  const blocks = document.querySelectorAll('.block-reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  blocks.forEach((block) => observer.observe(block));
})();

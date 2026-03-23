'use strict';

/* ═══════════════════════════════════════════════════════════
   MUSIC PAGE — music-page.js
   Junior Ceranor Nelson / Ceranor
═══════════════════════════════════════════════════════════ */

/* ─── NAVBAR ────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ─── STAGGERED REVEAL FOR RELEASE CARDS ───────────────────── */
function initCardStagger() {
  const cards = document.querySelectorAll('.mp-release-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initCardStagger();
  initScrollReveal();
});

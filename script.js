/* ═══════════════════════════════════════════════════════════
   JUNIOR CERANOR NELSON — Personal Brand Website
   script.js
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. HERO ENTRANCE ANIMATIONS ─────────────────────────── */
function initHeroAnimation() {
  const heroFirst  = document.getElementById('heroFirst');
  const heroLast   = document.getElementById('heroLast');
  const heroPhoto  = document.getElementById('heroPhoto');
  const heroTagline = document.getElementById('heroTagline');
  const heroCta    = document.getElementById('heroCta');

  // Slight delay so the page feels intentional
  setTimeout(() => {
    heroFirst.classList.add('loaded');
    heroLast.classList.add('loaded');
  }, 180);

  setTimeout(() => {
    heroPhoto.classList.add('loaded');
  }, 340);

  setTimeout(() => {
    heroTagline.classList.add('loaded');
  }, 700);

  setTimeout(() => {
    heroCta.classList.add('loaded');
  }, 900);
}

/* ─── 2. STICKY NAVBAR ─────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─── 3. MOBILE NAV TOGGLE ─────────────────────────────────── */
function initMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

/* ─── 4. PARALLAX ──────────────────────────────────────────── */
function initParallax() {
  const heroBg   = document.getElementById('heroBg');
  const bannerBg = document.getElementById('bannerBg');

  function applyParallax() {
    const scrollY = window.scrollY;

    // Hero parallax: moves up at 40% scroll speed
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }

    // Banner parallax: calculate relative to banner position
    if (bannerBg) {
      const banner = bannerBg.closest('.banner');
      if (banner) {
        const rect   = banner.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2);
        bannerBg.style.transform = `translateY(${offset * 0.28}px)`;
      }
    }
  }

  window.addEventListener('scroll', applyParallax, { passive: true });
  applyParallax();
}

/* ─── 5. SCROLL REVEAL — INTERSECTION OBSERVER ─────────────── */
function initScrollReveal() {
  // Generic .reveal elements
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Heading line reveals
  const lineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          lineObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  document.querySelectorAll('.reveal-line').forEach(el => lineObserver.observe(el));
}

/* ─── 6. SMOOTH SCROLL FOR IN-PAGE ANCHORS ─────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* ─── 7. CONTACT FORM ───────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#2e6e44';
    btn.style.borderColor = '#2e6e44';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

/* ─── 8. ACTIVE NAV HIGHLIGHT ON SCROLL ─────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initNavbar();
  initMobileNav();
  initParallax();
  initScrollReveal();
  initSmoothScroll();
  initContactForm();
  initActiveNav();
});

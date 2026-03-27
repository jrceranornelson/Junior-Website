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

  if (!heroFirst || !heroLast || !heroPhoto || !heroTagline || !heroCta) return;
  // Individual null guards already in setTimeout blocks below

  // Slight delay so the page feels intentional
  setTimeout(() => {
    if (heroFirst) heroFirst.classList.add('loaded');
    if (heroLast)  heroLast.classList.add('loaded');
  }, 180);

  setTimeout(() => {
    if (heroPhoto) heroPhoto.classList.add('loaded');
  }, 340);

  setTimeout(() => {
    if (heroTagline) heroTagline.classList.add('loaded');
  }, 700);

  setTimeout(() => {
    if (heroCta) heroCta.classList.add('loaded');
  }, 900);
}

/* ─── 2. STICKY NAVBAR ─────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

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
  if (!toggle || !navLinks) return;

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
      const navEl = document.getElementById('navbar');
      const navHeight = navEl ? navEl.offsetHeight : 0;
      const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* ─── 7. CONTACT FORM ───────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn      = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    const name     = (form.querySelector('[name="name"]')  || form.querySelector('#contact-name'))?.value.trim()    || '';
    const email    = (form.querySelector('[name="email"]') || form.querySelector('#contact-email'))?.value.trim()   || '';
    const message  = (form.querySelector('[name="message"]') || form.querySelector('#contact-message'))?.value.trim() || '';

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      if (typeof db !== 'undefined') {
        await db.collection('messages').add({
          name,
          email,
          message,
          read:      false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      btn.textContent   = 'Message Sent ✓';
      btn.style.background  = '#2e6e44';
      btn.style.borderColor = '#2e6e44';
      setTimeout(() => {
        btn.textContent       = original;
        btn.style.background  = '';
        btn.style.borderColor = '';
        btn.disabled          = false;
        form.reset();
      }, 4000);
    } catch (err) {
      console.error('Contact form error:', err);
      btn.textContent = 'Error — try again';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled    = false;
      }, 3000);
    }
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

/* ─── 0. PRELOADER ──────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('preloading');

  // Dismiss after ~3s (animation completes at ~2.45s, fade-out takes 0.55s)
  setTimeout(() => {
    preloader.classList.add('preloader-done');
    document.body.classList.remove('preloading');
  }, 2700);

  // Remove from DOM after fade-out transition ends
  preloader.addEventListener('transitionend', () => {
    if (preloader.classList.contains('preloader-done')) {
      preloader.remove();
    }
  }, { once: true });
}

/* ─── GALLERY PHOTO MODAL ───────────────────────────────────── */
function initGalleryModal() {
  const modal    = document.getElementById('galleryModal');
  if (!modal) return;

  const backdrop  = modal.querySelector('.gallery-modal-backdrop');
  const closeBtn  = modal.querySelector('.gallery-modal-close');
  const gmCaption = document.getElementById('gm-caption');
  const gmPlace   = document.getElementById('gm-place');
  const gmDate    = document.getElementById('gm-date');
  const gmDetails = document.getElementById('gm-details');

  function openModal(item) {
    gmCaption.textContent = item.dataset.caption || 'Photo Details';
    gmPlace.textContent   = item.dataset.place   || '—';
    gmDate.textContent    = item.dataset.date     || '—';
    gmDetails.textContent = item.dataset.details  || '—';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.closest('.gallery-item'));
    });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ─── SUBSCRIBE FORM ─────────────────────────────────────────── */
function initSubscribeForm() {
  const form    = document.getElementById('subscribeForm');
  if (!form) return;
  const btn     = document.getElementById('subscribeBtn');
  const success = document.getElementById('subscribeSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = form.querySelector('#sub-name').value.trim();
    const email = form.querySelector('#sub-email').value.trim();
    const phone = form.querySelector('#sub-phone').value.trim();
    if (!name || !email || !phone) return;

    btn.disabled = true;
    btn.querySelector('.subscribe-btn-text').textContent = 'Subscribing…';

    try {
      if (typeof db !== 'undefined') {
        await db.collection('subscribers').add({
          name,
          email,
          phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      form.querySelectorAll('input').forEach(i => i.value = '');
      success.classList.add('visible');
      btn.querySelector('.subscribe-btn-text').textContent = 'Subscribed ✓';
      btn.style.background = '#2e6e44';
      btn.style.boxShadow  = 'none';

      setTimeout(() => {
        success.classList.remove('visible');
        btn.querySelector('.subscribe-btn-text').textContent = 'Subscribe';
        btn.style.background = '';
        btn.style.boxShadow  = '';
        btn.disabled = false;
      }, 6000);
    } catch (err) {
      console.error('Subscribe error:', err);
      btn.querySelector('.subscribe-btn-text').textContent = 'Error — try again';
      btn.style.background = '';
      setTimeout(() => {
        btn.querySelector('.subscribe-btn-text').textContent = 'Subscribe';
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* ─── VISITOR TRACKING ──────────────────────────────────────── */
function initVisitorTracking() {
  if (typeof firebase === 'undefined' || typeof db === 'undefined') return;
  const visitStart = Date.now();
  let visitDocId = null;

  const visitData = {
    page:      window.location.pathname,
    referrer:  document.referrer || '',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    duration:  0,
  };

  // Write initial visit record, then enrich with geo data
  db.collection('visitors').add(visitData)
    .then(ref => {
      visitDocId = ref.id;
      return fetch('https://ipapi.co/json/');
    })
    .then(r => r.json())
    .then(geo => {
      if (!visitDocId) return;
      db.collection('visitors').doc(visitDocId).update({
        country: geo.country_name || '',
        city:    geo.city         || '',
        region:  geo.region       || '',
      }).catch(() => {});
    })
    .catch(() => {});

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && visitDocId) {
      const secs = Math.round((Date.now() - visitStart) / 1000);
      if (secs > 0 && secs < 7200) {
        db.collection('visitors').doc(visitDocId).update({ duration: secs }).catch(() => {});
      }
    }
  });
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeroAnimation();
  initNavbar();
  initMobileNav();
  initParallax();
  initScrollReveal();
  initSmoothScroll();
  initContactForm();
  initActiveNav();
  initGalleryModal();
  initSubscribeForm();
  initVisitorTracking();
});

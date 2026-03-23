'use strict';

/* ═══════════════════════════════════════════════════════════
   GALLERY PAGE — gallery-page.js
   Junior Ceranor Nelson
═══════════════════════════════════════════════════════════ */

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

/* ─── GALLERY PHOTO MODAL ───────────────────────────────────── */
function initGalleryModal() {
  const modal = document.getElementById('galleryModal');
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

/* ─── ALBUM TOGGLE ──────────────────────────────────────────── */
function initAlbums() {
  document.querySelectorAll('.album-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.albumId;
      const panel = document.getElementById('album-panel-' + id);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');

      panel.classList.toggle('open', !isOpen);
      panel.setAttribute('aria-hidden', isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
      btn.firstChild.nodeValue = isOpen ? 'View Album' : 'Close Album';

      if (!isOpen) {
        /* Smooth scroll to the expanded panel */
        setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      }
    });
  });

  document.querySelectorAll('.album-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id      = btn.dataset.albumId;
      const panel   = document.getElementById('album-panel-' + id);
      const openBtn = document.querySelector(`.album-open-btn[data-album-id="${id}"]`);
      if (!panel) return;

      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      if (openBtn) {
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.firstChild.nodeValue = 'View Album';
      }
    });
  });
}

/* ─── WORLD MAP ─────────────────────────────────────────────── */
function initWorldMap() {
  const mapEl = document.getElementById('worldMap');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('worldMap', {
    center: [18, 10],
    zoom: 2,
    zoomControl: true,
    scrollWheelZoom: false,
    worldCopyJump: true,
    minZoom: 2
  });

  /* Dark / minimal tile layer */
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
      ' &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /* Gold dot custom icon */
  const goldDot = L.divIcon({
    className: 'gold-dot-icon',
    html: '<div class="gold-dot"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    tooltipAnchor: [0, -14]
  });

  /* ✏️ ADD NEW LOCATIONS HERE
     Each entry needs:
       name    — display label shown in the tooltip
       coords  — [latitude, longitude]
       photos  — array of image paths (one is picked at random for the tooltip preview)
                 Use real paths like 'gallery/photo7.jpg' or placeholder URLs
  ─────────────────────────────────────────────── */
  const locations = [
    {
      name: 'Bali, Indonesia',
      coords: [-8.3405, 115.0920],
      photos: [
        'gallery/photo2.png',
        'gallery/photo3.jpg',
        'gallery/photo4.jpg',
        'gallery/photo5.jpg',
        'gallery/photo6.jpg'
      ]
    },
    {
      name: 'Malden, Massachusetts, USA',
      coords: [42.4251, -71.0662],
      photos: [
        'gallery/photo-reading-kissinger.jpg'
      ]
    },
    {
      name: 'Everett, Massachusetts, USA',
      coords: [42.4084, -71.0537],
      photos: [
        'https://placehold.co/220x145/0b1d3a/c9a84c?text=Everett%2C+MA'
      ]
    },
    {
      name: 'Santo Domingo, Dominican Republic',
      coords: [18.4861, -69.9312],
      photos: [
        'gallery/photo-hotel-lobby-white.jpg'
      ]
    },
    {
      name: 'Pétion-Ville, Haiti',
      coords: [18.5127, -72.2851],
      photos: [
        'gallery/photo7.jpg',
        'gallery/photo-grey-suit-ornate.jpg',
        'gallery/photo-hotel-lobby-white.jpg',
        'gallery/photo-haiti-stole-my-heart.jpg'
      ]
    },
    {
      name: 'Brisbane, Australia',
      coords: [-27.4698, 153.0251],
      photos: [
        'gallery/photo-haiti-stole-my-heart.jpg'
      ]
    },
    {
      name: 'Melbourne, Australia',
      coords: [-37.8136, 144.9631],
      photos: [
        'gallery/photo-grey-suit-ornate.jpg'
      ]
    },
    {
      name: 'Sorrento, Victoria, Australia',
      coords: [-38.3428, 144.7433],
      photos: [
        'gallery/photo-red-chair-leather.jpg'
      ]
    },
    {
      name: 'Pandawa Cliff Estate, Bali, Indonesia',
      coords: [-8.8480, 115.1681],
      photos: [
        'gallery/vacation-bali-pandawa.jpg'
      ]
    }
  ];
  /* ─────────────────────────────────────────────── */

  /* Force Leaflet to recalculate size after fonts/layout settle */
  setTimeout(() => map.invalidateSize(), 300);

  locations.forEach(loc => {
    /* Pick a random photo from the array */
    const photo = loc.photos[Math.floor(Math.random() * loc.photos.length)];

    const tooltipHtml = `
      <div class="map-tooltip-inner">
        <img src="${photo}" alt="${loc.name}" class="map-tooltip-img" />
        <span class="map-tooltip-name">${loc.name}</span>
      </div>`;

    const marker = L.marker(loc.coords, { icon: goldDot });
    marker.bindTooltip(tooltipHtml, {
      permanent: false,
      direction: 'top',
      className: 'map-photo-tooltip',
      offset: [0, -4]
    });
    marker.addTo(map);
  });
}

/* ─── SINGLES CHRONOLOGICAL SORT ────────────────────────────── */
function initSinglesSort() {
  const grid = document.querySelector('.gp-singles-section .gp-grid');
  if (!grid) return;

  /* Parse data-date strings into a numeric timestamp for sorting.
     Handles: "Month Day, Year", "Month Year", "Late Month Year", "—" */
  function parseDate(str) {
    if (!str || str === '—') return Infinity; // unknown → end
    const cleaned = str.replace(/^(Late|Early|Mid)\s+/i, '');
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? Infinity : d.getTime();
  }

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  items.sort((a, b) => parseDate(a.dataset.date) - parseDate(b.dataset.date));
  items.forEach(item => grid.appendChild(item)); // re-attach in sorted order
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initSinglesSort();
  initScrollReveal();
  initGalleryModal();
  initAlbums();
  initWorldMap();
});

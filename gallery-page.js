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
  const gmImage   = document.getElementById('gm-image');
  const gmPlace   = document.getElementById('gm-place');
  const gmDate    = document.getElementById('gm-date');
  const gmDetails = document.getElementById('gm-details');

  function openModal(data) {
    /* data = { url, caption, place, date, details } */
    if (gmImage) {
      if (data.url) {
        gmImage.src = data.url;
        gmImage.alt = data.place || '';
        gmImage.style.display = 'block';
        modal.classList.add('has-photo');
      } else {
        gmImage.style.display = 'none';
        modal.classList.remove('has-photo');
      }
    }
    gmCaption.textContent = data.caption  || data.place || 'Photo';
    gmPlace.textContent   = data.place    || '—';
    gmDate.textContent    = data.date     || '—';
    gmDetails.textContent = data.details  || '—';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active', 'has-photo');
    document.body.style.overflow = '';
    if (gmImage) { gmImage.src = ''; gmImage.style.display = 'none'; }
  }

  /* All gallery items (albums + singles) — click anywhere on the item */
  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openModal({
      url:     item.querySelector('img')?.src || '',
      caption: item.dataset.caption,
      place:   item.dataset.place,
      date:    item.dataset.date,
      details: item.dataset.details
    });
  });

  /* Firestore gallery cards — click anywhere on the card */
  document.addEventListener('click', e => {
    const card = e.target.closest('.gallery-card');
    if (!card) return;
    openModal({
      url:     card.dataset.url,
      place:   card.dataset.place,
      date:    card.dataset.date,
      details: card.dataset.details
    });
  });

  /* Keyboard support for both item types */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.gallery-card') || e.target.closest('.gallery-item');
      if (card) {
        e.preventDefault();
        const isItem = card.classList.contains('gallery-item');
        openModal({
          url:     isItem ? (card.querySelector('img')?.src || '') : card.dataset.url,
          caption: card.dataset.caption,
          place:   card.dataset.place,
          date:    card.dataset.date,
          details: card.dataset.details
        });
      }
    }
    if (e.key === 'Escape') closeModal();
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
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

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
      ' &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  const goldDot = L.divIcon({
    className: 'gold-dot-icon',
    html: '<div class="gold-dot"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    tooltipAnchor: [0, -14]
  });

  /* Tracks all markers by normalised place name to prevent duplicates */
  const _markers = new Map();

  function placeMarker(name, coords, photos) {
    const key = name.trim().toLowerCase();
    if (_markers.has(key)) return; // already pinned
    const photo = photos[Math.floor(Math.random() * photos.length)];
    const tooltipHtml = `
      <div class="map-tooltip-inner">
        <img src="${photo}" alt="${name}" class="map-tooltip-img" />
        <span class="map-tooltip-name">${name}</span>
      </div>`;
    const marker = L.marker(coords, { icon: goldDot });
    marker.bindTooltip(tooltipHtml, {
      permanent: false,
      direction: 'top',
      className: 'map-photo-tooltip',
      offset: [0, -4]
    });
    marker.addTo(map);
    _markers.set(key, marker);
  }

  /* ── Static locations (for hardcoded album photos) ── */
  const staticLocations = [
    {
      name: 'Bali, Indonesia',
      coords: [-8.3405, 115.0920],
      photos: ['gallery/photo2.png','gallery/photo3.jpg','gallery/photo4.jpg','gallery/photo5.jpg','gallery/photo6.jpg']
    },
    {
      name: 'Malden, Massachusetts, USA',
      coords: [42.4251, -71.0662],
      photos: ['gallery/photo-reading-kissinger.jpg']
    },
    {
      name: 'Everett, Massachusetts, USA',
      coords: [42.4084, -71.0537],
      photos: ['https://placehold.co/220x145/0b1d3a/c9a84c?text=Everett%2C+MA']
    },
    {
      name: 'Santo Domingo, Dominican Republic',
      coords: [18.4861, -69.9312],
      photos: ['gallery/photo-hotel-lobby-white.jpg']
    },
    {
      name: 'Pétion-Ville, Haiti',
      coords: [18.5127, -72.2851],
      photos: ['gallery/photo7.jpg','gallery/photo-grey-suit-ornate.jpg','gallery/photo-hotel-lobby-white.jpg','gallery/photo-haiti-stole-my-heart.jpg']
    },
    {
      name: 'Brisbane, Australia',
      coords: [-27.4698, 153.0251],
      photos: ['gallery/photo-haiti-stole-my-heart.jpg']
    },
    {
      name: 'Melbourne, Australia',
      coords: [-37.8136, 144.9631],
      photos: ['gallery/photo-grey-suit-ornate.jpg']
    },
    {
      name: 'Sorrento, Victoria, Australia',
      coords: [-38.3428, 144.7433],
      photos: ['gallery/photo-red-chair-leather.jpg']
    },
    {
      name: 'Pandawa Cliff Estate, Bali, Indonesia',
      coords: [-8.8480, 115.1681],
      photos: ['gallery/vacation-bali-pandawa.jpg']
    },
    {
      name: 'Washington D.C., USA',
      coords: [38.9072, -77.0369],
      photos: ['https://placehold.co/220x145/0b1d3a/c9a84c?text=Washington+D.C.']
    },
    {
      name: 'Singapore',
      coords: [1.3521, 103.8198],
      photos: ['gallery/photo-ifly-singapore-2017.jpg']
    },
    {
      name: 'iFly Singapore, Singapore',
      coords: [1.2644, 103.8229],
      photos: ['gallery/photo-ifly-singapore-2017.jpg']
    }
  ];

  staticLocations.forEach(loc => placeMarker(loc.name, loc.coords, loc.photos));

  setTimeout(() => map.invalidateSize(), 300);

  /* ── Dynamic markers from Firestore ─────────────────────────
     Geocodes each unique place name entered when uploading a photo.
     Results are cached in sessionStorage (1 call per place per session).
  ──────────────────────────────────────────────────────────── */
  const _geoCache = (function () {
    try { return JSON.parse(sessionStorage.getItem('_geoCache') || '{}'); } catch(e) { return {}; }
  })();

  function saveGeoCache() {
    try { sessionStorage.setItem('_geoCache', JSON.stringify(_geoCache)); } catch(e) {}
  }

  /* Queue-based geocoder — respects Nominatim's 1 req/sec limit */
  const _geoQueue = [];
  let _geoRunning = false;

  function geocode(place) {
    return new Promise(resolve => {
      const key = place.trim().toLowerCase();
      if (_geoCache[key]) { resolve(_geoCache[key]); return; }
      _geoQueue.push({ place, key, resolve });
      if (!_geoRunning) _drainGeoQueue();
    });
  }

  function _nominatimFetch(query) {
    return fetch(
      'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query) + '&format=json&limit=1',
      { headers: { 'Accept-Language': 'en' } }
    ).then(r => r.json()).catch(() => []);
  }

  function _drainGeoQueue() {
    if (!_geoQueue.length) { _geoRunning = false; return; }
    _geoRunning = true;
    const { place, key, resolve } = _geoQueue.shift();

    /* Try full place name first; if no result, retry with last
       comma-separated part (e.g. "iFly Singapore, Singapore" → "Singapore") */
    _nominatimFetch(place).then(data => {
      if (data && data[0]) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        _geoCache[key] = coords;
        saveGeoCache();
        resolve(coords);
        setTimeout(_drainGeoQueue, 1100);
      } else {
        /* Fallback: strip everything before the last comma */
        const fallback = place.includes(',')
          ? place.split(',').pop().trim()
          : null;
        if (!fallback || fallback.toLowerCase() === key) {
          resolve(null);
          setTimeout(_drainGeoQueue, 1100);
          return;
        }
        setTimeout(() => {
          _nominatimFetch(fallback).then(data2 => {
            if (data2 && data2[0]) {
              const coords = [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];
              _geoCache[key] = coords;
              saveGeoCache();
              resolve(coords);
            } else {
              resolve(null);
            }
          }).finally(() => setTimeout(_drainGeoQueue, 1100));
        }, 1100);
      }
    });
  }

  /* Listen to gallery collection — add a dot for every new place.
     Prefers lat/lng stored on the doc (same as admin map); falls back
     to Nominatim geocoding when no coordinates are saved. */
  if (typeof firebase !== 'undefined' && firebase.apps.length) {
    const firestoreDb = window.db || firebase.firestore();

    /* Also listen to manual map_markers (added from Admin → Gallery Manager → Map) */
    firestoreDb.collection('map_markers').onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const d = doc.data();
        if (!d.name) return;
        const lat = parseFloat(d.lat), lng = parseFloat(d.lng);
        if (isNaN(lat) || isNaN(lng)) return;
        const key = d.name.trim().toLowerCase();
        if (_markers.has(key)) return;
        const photos = d.imageUrl ? [d.imageUrl] : ['https://placehold.co/220x145/0b1d3a/c9a84c?text=' + encodeURIComponent(d.name)];
        placeMarker(d.name, [lat, lng], photos);
      });
    });

    firestoreDb.collection('gallery').onSnapshot(snapshot => {
      /* Group by place; capture first available lat/lng per place */
      const byPlace = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        if (!d.place || !d.imageUrl) return;
        if (!byPlace[d.place]) byPlace[d.place] = { photos: [], lat: null, lng: null };
        byPlace[d.place].photos.push(d.imageUrl);
        if (!byPlace[d.place].lat && d.lat != null && d.lng != null) {
          byPlace[d.place].lat = parseFloat(d.lat);
          byPlace[d.place].lng = parseFloat(d.lng);
        }
      });

      Object.entries(byPlace).forEach(([place, data]) => {
        const key = place.trim().toLowerCase();
        if (_markers.has(key)) return; // already on the map
        if (data.lat !== null && data.lng !== null) {
          /* Instant — use stored coordinates, just like the admin map */
          placeMarker(place, [data.lat, data.lng], data.photos);
        } else {
          /* Fall back to geocoding if no coordinates were saved */
          geocode(place).then(coords => {
            if (coords) placeMarker(place, coords, data.photos);
          });
        }
      });
    });
  }
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

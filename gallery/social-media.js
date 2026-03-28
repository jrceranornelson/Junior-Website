'use strict';

/* ═══════════════════════════════════════════════════════════
   SOCIAL MEDIA PAGE — social-media.js
   Reads window.SOCIAL_CONFIG (set in social-config.js)
   and wires up all platform embeds + scroll animations.
═══════════════════════════════════════════════════════════ */

let cfg = window.SOCIAL_CONFIG || {};

/* ─── 0. FIRESTORE LIVE SYNC ────────────────────────────── */
/*
 * Listens to social/config in real-time with onSnapshot so
 * any change saved in the admin panel reflects on the page
 * immediately (on the next page load or within seconds).
 *
 * On first snapshot → calls callback() to render embeds.
 * On subsequent snapshots → re-renders only the Instagram embed
 * (other platforms show live timelines that don't need a re-render).
 */
let _socialInitDone = false;

function loadFirestoreSocialConfig(callback) {
  try {
    const firestoreDb = window.db ||
      (typeof firebase !== 'undefined' && firebase.apps.length
        ? firebase.firestore() : null);

    if (!firestoreDb) { callback(); return; }

    firestoreDb.collection('social').doc('config').onSnapshot(doc => {
      cfg = cfg || {};
      cfg.instagram = cfg.instagram || {};
      cfg.twitter   = cfg.twitter   || {};
      cfg.tiktok    = cfg.tiktok    || {};
      cfg.linkedin  = cfg.linkedin  || {};
      cfg.facebook  = cfg.facebook  || {};

      if (doc.exists) {
        const d = doc.data();
        if (d.instagramPostUrl)  cfg.instagram.latestPostUrl = d.instagramPostUrl;
        if (d.twitterPostUrl)    cfg.twitter.latestPostUrl   = d.twitterPostUrl;
        if (d.tiktokPostUrl)     cfg.tiktok.latestPostUrl    = d.tiktokPostUrl;
        if (d.twitterHandle)     cfg.twitter.handle          = d.twitterHandle;
        if (d.tiktokHandle)      cfg.tiktok.handle           = d.tiktokHandle;
        if (d.linkedinVanity)    cfg.linkedin.vanity         = d.linkedinVanity;
        if (d.facebookPageUrl)   cfg.facebook.pageUrl        = d.facebookPageUrl;
      }

      if (!_socialInitDone) {
        // First load — run full init
        _socialInitDone = true;
        callback();
      } else {
        // Admin changed a value — re-render Instagram only
        const igContainer = document.getElementById('ig-embed');
        const igFallback  = document.getElementById('ig-fallback');
        if (igContainer) igContainer.innerHTML = '';
        if (igFallback)  igFallback.classList.remove('visible');
        initInstagram();
      }
    }, () => {
      // Firestore unavailable — render with static config
      if (!_socialInitDone) { _socialInitDone = true; callback(); }
    });
  } catch(e) {
    if (!_socialInitDone) { _socialInitDone = true; callback(); }
  }
}

/* ─── 1. NAVBAR ─────────────────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ─── 2. INSTAGRAM EMBED ────────────────────────────────── */
/*
 * Instagram's official embed.js processes any <blockquote
 * class="instagram-media"> it finds on the page.
 * We inject the blockquote dynamically from the config URL,
 * then call window.instgrm.Embeds.process() to render it.
 *
 * To update: change latestPostUrl in social-config.js.
 */
function initInstagram() {
  const igCfg      = cfg.instagram || {};
  const postUrl    = igCfg.latestPostUrl || '';
  const container  = document.getElementById('ig-embed');
  const fallback   = document.getElementById('ig-fallback');
  // Detect placeholder URL
  const isPlaceholder =
    !postUrl ||
    postUrl.includes('REPLACE_WITH') ||
    postUrl === 'https://www.instagram.com/p/REPLACE_WITH_YOUR_POST_ID/';

  if (isPlaceholder) {
    if (fallback) fallback.classList.add('visible');
    return;
  }

  // Build Instagram blockquote and inject
  const normalizedUrl = postUrl.split('?')[0].replace(/\/$/, '') + '/';
  const bq = document.createElement('blockquote');
  bq.className = 'instagram-media';
  bq.setAttribute('data-instgrm-permalink', normalizedUrl + '?utm_source=ig_embed&utm_campaign=loading');
  bq.setAttribute('data-instgrm-version', '14');
  bq.style.cssText = [
    'background:#FFF',
    'border:0',
    'border-radius:16px',
    'box-shadow:none',
    'margin:0',
    'max-width:100%',
    'min-width:unset',
    'padding:0',
    'width:100%',
  ].join(';');

  if (container) container.appendChild(bq);

  // Process embed once Instagram SDK has loaded
  function processEmbed() {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      // SDK not ready yet — retry
      setTimeout(processEmbed, 300);
    }
  }
  processEmbed();
}

/* ─── 3. TWITTER / X TIMELINE ──────────────────────────── */
/*
 * Twitter's widgets.js processes any <a class="twitter-timeline">
 * element it finds. We create it here from config so handles
 * and settings come from one place.
 *
 * Auto-updates: YES — always shows the latest tweets.
 */
function initTwitter() {
  const twCfg   = cfg.twitter || {};
  const handle  = twCfg.handle  || 'jrceranornelson';
  const limit   = twCfg.tweetLimit || 4;
  const theme   = twCfg.theme   || 'light';
  const target  = document.getElementById('twitter-embed');

  if (!target) return;

  const link = document.createElement('a');
  link.className            = 'twitter-timeline';
  link.href                 = 'https://twitter.com/' + handle;
  link.setAttribute('data-tweet-limit', String(limit));
  link.setAttribute('data-theme',       theme);
  link.setAttribute('data-chrome',      'noheader nofooter noborders');
  link.setAttribute('data-width',       '');    // fills container
  link.setAttribute('data-dnt',         'true'); // do not track
  link.textContent = 'Tweets by ' + handle;

  target.appendChild(link);

  // Ask Twitter's SDK to process any new embed elements
  function processTwitter() {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(target);
    } else {
      setTimeout(processTwitter, 300);
    }
  }
  processTwitter();
}

/* ─── 4. TIKTOK PROFILE EMBED ───────────────────────────── */
/*
 * TikTok's embed.js processes <blockquote class="tiktok-embed">
 * elements. Using data-embed-type="user" displays the full
 * profile with the latest videos.
 *
 * Auto-updates: YES — always shows the user's current profile.
 */
function initTikTok() {
  const ttCfg  = cfg.tiktok || {};
  const handle = ttCfg.handle || 'jrceranornelson';
  const target = document.getElementById('tiktok-embed');

  if (!target) return;

  const bq = document.createElement('blockquote');
  bq.className = 'tiktok-embed';
  bq.setAttribute('cite',            'https://www.tiktok.com/@' + handle);
  bq.setAttribute('data-unique-id',  handle);
  bq.setAttribute('data-embed-type', 'creator');  // shows profile + recent videos

  const section = document.createElement('section');
  const link = document.createElement('a');
  link.target  = '_blank';
  link.title   = '@' + handle;
  link.href    = 'https://www.tiktok.com/@' + handle;
  link.textContent = '@' + handle;

  section.appendChild(link);
  bq.appendChild(section);
  target.appendChild(bq);

  // Process once TikTok SDK is ready
  function processTikTok() {
    if (window.__tiktok_widget_loaded) {
      // SDK reload — some implementations use this
    }
    // TikTok's embed.js auto-processes on load; reload if needed
    const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (!existingScript) {
      const s = document.createElement('script');
      s.async = true;
      s.src   = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(s);
    }
  }
  setTimeout(processTikTok, 500);
}

/* ─── 5. FACEBOOK PAGE PLUGIN ───────────────────────────── */
/*
 * The fb-page div is already in the HTML. We ensure the
 * Facebook SDK re-processes it if the SDK loaded before
 * our JS ran.
 *
 * Auto-updates: YES — shows live posts if profile is public.
 */
function initFacebook() {
  const fbCfg   = cfg.facebook || {};
  const pageUrl = fbCfg.pageUrl;
  if (pageUrl) {
    const fbDiv = document.querySelector('.fb-page');
    if (fbDiv) fbDiv.setAttribute('data-href', pageUrl);
  }
  function processFB() {
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
    } else {
      setTimeout(processFB, 400);
    }
  }
  processFB();
}

/* ─── 6. SCROLL REVEAL ──────────────────────────────────── */
function initReveal() {
  const blocks = document.querySelectorAll('.reveal');
  if (!blocks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  blocks.forEach((b) => observer.observe(b));
}

/* ─── INIT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();

  // Load Firestore overrides first, then render embeds
  loadFirestoreSocialConfig(() => {
    // Update LinkedIn badge vanity from config if set
    const liVanity = (cfg.linkedin || {}).vanity;
    if (liVanity) {
      const liDiv = document.querySelector('.LI-profile-badge');
      if (liDiv) liDiv.setAttribute('data-vanity', liVanity);
    }
    initInstagram();
    initTwitter();
    initTikTok();
    initFacebook();
  });
});

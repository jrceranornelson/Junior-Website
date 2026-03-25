(function () {
  'use strict';

  /* ── Platform config ── */
  var PLATFORMS = {
    youtube: {
      color: '#FF0000',
      gradient: null,
      label: 'YouTube',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    },
    tiktok: {
      color: '#000000',
      gradient: null,
      label: 'TikTok',
      icon: '<svg viewBox="0 0 24 24" fill="#00f2ea" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z"/></svg>'
    },
    instagram: {
      color: '#833ab4',
      gradient: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      label: 'Instagram',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>'
    },
    facebook: {
      color: '#1877F2',
      gradient: null,
      label: 'Facebook',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    }
  };

  /* ── Inject styles once ── */
  var styleId = '__live_btn_styles__';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '@keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(255,0,0,0.55)}60%{box-shadow:0 0 0 14px rgba(255,0,0,0)}}',
      '@keyframes liveDot{0%,100%{opacity:1}50%{opacity:0.35}}',
      '#__live_float_btn{',
        'position:fixed;bottom:28px;right:28px;z-index:99999;',
        'display:none;align-items:center;gap:9px;',
        'padding:11px 18px 11px 14px;',
        'border-radius:50px;border:none;cursor:pointer;',
        'font-family:"Montserrat","Inter",sans-serif;font-size:0.78rem;font-weight:800;',
        'letter-spacing:0.12em;text-transform:uppercase;color:#fff;',
        'animation:livePulse 1.8s ease-in-out infinite;',
        'transition:transform 0.18s,opacity 0.18s;',
        'text-decoration:none;',
      '}',
      '#__live_float_btn:hover{transform:scale(1.06);}',
      '#__live_float_btn .live-dot{',
        'width:9px;height:9px;border-radius:50%;background:#fff;',
        'flex-shrink:0;animation:liveDot 1s ease-in-out infinite;',
      '}',
      '#__live_float_btn .live-label{display:flex;flex-direction:column;align-items:flex-start;gap:1px;}',
      '#__live_float_btn .live-label-main{display:flex;align-items:center;gap:7px;line-height:1;}',
      '#__live_float_btn .live-title{font-size:0.65rem;font-weight:500;letter-spacing:0.06em;opacity:0.88;text-transform:none;margin-top:2px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
    ].join('');
    document.head.appendChild(style);
  }

  /* ── Create button ── */
  var btn = document.createElement('a');
  btn.id = '__live_float_btn';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  document.body.appendChild(btn);

  function applyPlatform(platform) {
    var p = PLATFORMS[platform] || PLATFORMS.youtube;
    if (p.gradient) {
      btn.style.background = p.gradient;
      btn.style.boxShadow = '';
    } else {
      btn.style.background = p.color;
    }
  }

  function updateButton(data) {
    if (!data || !data.isLive) {
      btn.style.display = 'none';
      return;
    }
    var platform = (data.platform || 'youtube').toLowerCase();
    var p = PLATFORMS[platform] || PLATFORMS.youtube;
    applyPlatform(platform);
    btn.href = data.liveUrl || '#';
    var titleHtml = data.title
      ? '<span class="live-title">' + escHtml(data.title) + '</span>'
      : '';
    btn.innerHTML =
      '<span class="live-dot"></span>' +
      '<span class="live-label">' +
        '<span class="live-label-main">' + p.icon + ' LIVE</span>' +
        titleHtml +
      '</span>';
    btn.style.display = 'flex';
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Wait for Firebase / db ── */
  function init() {
    if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) {
      setTimeout(init, 300);
      return;
    }
    var db;
    try { db = firebase.firestore(); } catch(e) { return; }

    db.collection('live_status').doc('current').onSnapshot(
      function(snap) { updateButton(snap.exists ? snap.data() : null); },
      function()     { btn.style.display = 'none'; }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

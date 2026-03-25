/* ═══════════════════════════════════════════════════
   dark-mode.js — dark/light toggle with localStorage
═══════════════════════════════════════════════════ */
(function () {
  'use strict';
  var LS_KEY = 'jcn_dark';
  var root = document.documentElement;

  function applyDark(on) {
    root.classList.toggle('dark-mode', on);
    var btn = document.getElementById('darkToggle');
    if (btn) btn.setAttribute('aria-label', on ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Apply immediately (before paint) to avoid flash
  var saved = localStorage.getItem(LS_KEY);
  if (saved === '1') root.classList.add('dark-mode');

  function init() {
    var btn = document.getElementById('darkToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isDark = root.classList.toggle('dark-mode');
      localStorage.setItem(LS_KEY, isDark ? '1' : '0');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

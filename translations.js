/* ═══════════════════════════════════════════════════
   translations.js — i18n for EN / FR / HT
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TRANSLATIONS = {
    en: {
      'nav-home':        'Home',
      'nav-about':       'About Me',
      'nav-projects':    'Projects',
      'nav-gallery':     'Gallery',
      'nav-music':       'Music',
      'nav-books':       'Books',
      'nav-academic':    'Academic',
      'nav-blog':        'Blog & Library',
      'nav-contact':     'Contact',
      'nav-cta':         'Contact',
      'tagline':         'Transforming Haiti through education, diplomacy, and ethical leadership',
      'about-title':     'About Me',
      'learn-more':      'Learn more',
      'get-in-touch':    'Get in Touch',
      'subscribe':       'Subscribe',
      'send-message':    'Send Message',
      'follow-me':       'Follow Me',
      'read-more':       'Read more',
      'view-album':      'View Album',
      'no-posts':        'No posts yet'
    },
    fr: {
      'nav-home':        'Accueil',
      'nav-about':       'À Propos',
      'nav-projects':    'Projets',
      'nav-gallery':     'Galerie',
      'nav-music':       'Musique',
      'nav-books':       'Livres',
      'nav-academic':    'Académique',
      'nav-blog':        'Blog & Bibliothèque',
      'nav-contact':     'Contact',
      'nav-cta':         'Me contacter',
      'tagline':         "Transformer Haïti par l'éducation, la diplomatie et le leadership éthique",
      'about-title':     'À Propos de moi',
      'learn-more':      'En savoir plus',
      'get-in-touch':    'Prendre Contact',
      'subscribe':       "S'abonner",
      'send-message':    'Envoyer',
      'follow-me':       'Suivez-moi',
      'read-more':       'Lire plus',
      'view-album':      "Voir l'album",
      'no-posts':        "Pas encore d'articles"
    },
    ht: {
      'nav-home':        'Akèy',
      'nav-about':       'Sou Mwen',
      'nav-projects':    'Pwojè',
      'nav-gallery':     'Galri',
      'nav-music':       'Mizik',
      'nav-books':       'Liv',
      'nav-academic':    'Akademik',
      'nav-blog':        'Blog & Bibliyotèk',
      'nav-contact':     'Kontak',
      'nav-cta':         'Kontakte M',
      'tagline':         'Transfòme Ayiti atravè edikasyon, diplomasi, ak lidèchip etik',
      'about-title':     'Sou Mwen',
      'learn-more':      'Aprann plis',
      'get-in-touch':    'Kontakte M',
      'subscribe':       'Abòne',
      'send-message':    'Voye Mesaj',
      'follow-me':       'Swiv Mwen',
      'read-more':       'Li plis',
      'view-album':      'Wè Albòm',
      'no-posts':        'Pa gen atik toujou'
    }
  };

  var LS_KEY = 'jcn_lang';

  function applyLang(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    var t = TRANSLATIONS[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    localStorage.setItem(LS_KEY, lang);
  }

  function initLang() {
    var saved = localStorage.getItem(LS_KEY) || 'en';
    applyLang(saved);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.dataset.lang);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }

  window.JCN_i18n = { apply: applyLang };
})();

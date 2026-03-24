/* ═══════════════════════════════════════════════════════════
   FIREBASE CONFIG — firebase-config.js
   Shared Firebase initialization for all pages.
   Load AFTER the three Firebase compat CDN scripts.
═══════════════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey:            "AIzaSyC6JxyAfS0TY02pGBMFFTNbbgF0xDuaT-A",
  authDomain:        "junior-website-10186.firebaseapp.com",
  projectId:         "junior-website-10186",
  storageBucket:     "junior-website-10186.firebasestorage.app",
  messagingSenderId: "553199484927",
  appId:             "1:553199484927:web:7b0ff3f311e49b550371ca",
  measurementId:     "G-2RQ0GPC6GC"
};

/* Prevent duplicate initialization (multi-page imports) */
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db      = firebase.firestore();
const auth    = (typeof firebase.auth    === 'function') ? firebase.auth()    : null;
const storage = (typeof firebase.storage === 'function') ? firebase.storage() : null;

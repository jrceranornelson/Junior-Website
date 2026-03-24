/**
 * firebase-config.js — Shared Firebase initialisation
 * Load AFTER the four Firebase CDN compat scripts.
 * Every page that needs Firebase imports this file.
 */

const firebaseConfig = {
  apiKey:            "AIzaSyC6JxyAfS0TY02pGBMFFTNbbgF0xDuaT-A",
  authDomain:        "junior-website-10186.firebaseapp.com",
  projectId:         "junior-website-10186",
  storageBucket:     "junior-website-10186.firebasestorage.app",
  messagingSenderId: "553199484927",
  appId:             "1:553199484927:web:7b0ff3f311e49b550371ca"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = firebase.storage();

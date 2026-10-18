
/*
 * EL Journal - Firebase Client
 * Firebase v12 browser module SDK
 */

import { initializeApp } from
  'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';

import { getFirestore } from
  'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';

import { getAuth } from
  'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBL3E6XSs84AhRYWU2vSWQGvRVttqVxK80',
  authDomain: 'el-journal-blogsite.firebaseapp.com',
  projectId: 'el-journal-blogsite',
  storageBucket: 'el-journal-blogsite.firebasestorage.app',
  messagingSenderId: '237178914655',
  appId: '1:237178914655:web:80c9638141d422622418ea',
  measurementId: 'G-R992YNTTHP'
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

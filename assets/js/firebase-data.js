/*
 * EL Journal — Firebase Firestore Data Adapter
 * Handles reading, creating, updating and deleting blog data.
 */

import { db } from './firebase-client.js';

import {
  collection,
  doc,
  getDocs
} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';

// Categories remain in Firestore; blog posts are static files.
export async function fetchCategoriesFromFirebase() {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(snapshot => ({
    ...snapshot.data(),
    id: snapshot.data().id ?? snapshot.id
  }));
}

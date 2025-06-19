// lib/firebase/client.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP8ng3025nPokVnCpAtcCkryrRj7m6KpU",
  authDomain: "roadmap-60145.firebaseapp.com",
  projectId: "roadmap-60145",
  storageBucket: "roadmap-60145.firebasestorage.app",
  messagingSenderId: "374466772794",
  appId: "1:374466772794:web:636ccf477b7546a6de9a03",
  measurementId: "G-BXMPSLQCCG",
  databaseURL: "https://roadmap-60145-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app, "https://roadmap-60145-default-rtdb.firebaseio.com");


export { app, auth, db };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAo5XcFdK2zVeP4XOPM6pERaELWSZzx_g",
  authDomain: "iaeco-9351d.firebaseapp.com",
  projectId: "iaeco-9351d",
  storageBucket: "iaeco-9351d.firebasestorage.app",
  messagingSenderId: "349929984523",
  appId: "1:349929984523:web:127aa773163d54dad3ad0e",
  measurementId: "G-K5N1838Q9G"
};
};

// Initialize Firebase only if config is valid to prevent crashes during dry run
let app;
let db;
let auth;

try {
    if (firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (error) {
    console.log("Firebase initialization skipped (missing config)");
}

export { app, db, auth };

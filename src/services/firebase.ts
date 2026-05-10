// Firebase Configuration for Temo Thuo Market
// This is a placeholder configuration - replace with your actual Firebase credentials

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging } from 'firebase/messaging';

// Firebase configuration object
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBiTIExBj0qaas0A-CV25P8-daWLr8JLYg",
  authDomain: "temo-thuo-market.firebaseapp.com",
  projectId: "temp-thuo-market",
  storageBucket: "temp-thuo-market.firebasestorage.app",
  messagingSenderId: "1034874419736",
  appId: "1:1034874419736:android:5a58375c58d2fa559be16d",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let messaging: Messaging;

export const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Messaging is only available on certain platforms
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.log('Firebase Messaging not available on this platform');
    }
  }
  return { app, auth, db, storage, messaging };
};

export const getFirebaseApp = () => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseDB = () => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

export const getFirebaseStorage = () => {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
};

export const getFirebaseMessaging = () => {
  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.log('Firebase Messaging not available');
      return null;
    }
  }
  return messaging;
};

// Export individual services
export { app, auth, db, storage, messaging };
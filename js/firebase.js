// js/firebase.js
// Firebase Modular SDK (v9+)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------------------------------
// Your Firebase Project Config
// -------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyA-HINhOFbNrzCtqrIwbXfvh-3L-c3r-gY",
  authDomain: "roofing-app-84ecc.firebaseapp.com",
  projectId: "roofing-app-84ecc",
  storageBucket: "roofing-app-84ecc.firebasestorage.app",
  messagingSenderId: "540049423746",
  appId: "1:540049423746:web:222f0508cf8229f4bda39b",
  measurementId: "G-9888FJXF0F"
};

// -------------------------------
// Initialize Firebase
// -------------------------------
const app = initializeApp(firebaseConfig);

// Auth + Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export everything your

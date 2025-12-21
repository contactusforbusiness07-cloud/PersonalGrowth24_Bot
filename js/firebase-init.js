/* js/firebase-init.js - CLEAN CONNECTION ONLY */

// 1. Firebase Libraries Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, runTransaction, serverTimestamp, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 2. YOUR CONFIGURATION (FinGamePro)
const firebaseConfig = {
    apiKey: "AIzaSyCg7hL0aFYWj7hRtP9cp9nqXYQQPzhHMMc",
    authDomain: "fingamepro.firebaseapp.com",
    projectId: "fingamepro",
    storageBucket: "fingamepro.firebasestorage.app",
    messagingSenderId: "479959446564",
    appId: "1:479959446564:web:1d0d9890d4f5501c4594b1"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase Initialized (Connection Only)");

// 4. Global Exports (Required for other files)
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.increment = increment;
window.serverTimestamp = serverTimestamp;
window.onSnapshot = onSnapshot;

// ⚠️ NOTE: Sync Logic Removed from here to prevent conflicts.
// Now js/main.js controls the balance protection.


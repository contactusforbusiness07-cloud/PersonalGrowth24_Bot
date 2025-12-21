// js/firebase-init.js

// 1. Firebase Libraries Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 2. YOUR NEW CONFIGURATION (FinGamePro)
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

console.log("🔥 Firebase Connected with FinGamePro!");

// 4. Global Functions (Taaki hum inhe dusri files me use kar sakein)
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.increment = increment;
window.onSnapshot = onSnapshot;

// 5. LIVE SYNC FUNCTION (Ye Wallet aur DB ko connect karega)
window.syncUserWithFirebase = function(telegramUserId) {
    if(!telegramUserId) return;

    console.log("🔄 Starting Sync for User:", telegramUserId);
    const userRef = doc(db, "users", telegramUserId.toString());

    // Listen for Real-time Updates
    onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Global User ko update karo
            window.currentUser = {
                id: telegramUserId,
                balance: data.balance || 0,
                rank: data.rank || 999,
                referrals: data.referralCounts || 0,
                name: data.name || "User"
            };

            // LocalStorage backup
            localStorage.setItem('local_balance', data.balance);
            
            // Agar Wallet UI khula hai to refresh karo
            if(typeof window.updateWalletUI === 'function') {
                window.updateWalletUI();
            }
            
            console.log("✅ Live Balance Updated:", data.balance);
        } else {
            console.log("⚠️ User document not found in Database yet. Creating new...");
            // Optional: Auto-create user logic can be added here if needed
        }
    }, (error) => {
        console.error("❌ Firebase Sync Error:", error);
    });
};


// js/firebase-init.js

// 1. Firebase Libraries Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 2. YOUR CONFIGURATION (Updated)
const firebaseConfig = {
    apiKey: "AIzaSyCPBt-Nx4LttaAtA_aX3xwOxFNCTK4zq0s",
    authDomain: "personal-growth24.firebaseapp.com",
    projectId: "personal-growth24",
    storageBucket: "personal-growth24.firebasestorage.app",
    messagingSenderId: "544758438122",
    appId: "1:544758438122:web:cc9cd9ce51ef329f949f93"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase Connected with PersonalGrowth24!");

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
            console.log("⚠️ User document not found in Database yet.");
        }
    }, (error) => {
        console.error("❌ Firebase Sync Error:", error);
    });
};


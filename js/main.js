/* js/main.js - CENTRAL BRAIN (Instant Updates + 6h Sync) */

// --- 1. FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, runTransaction, serverTimestamp, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCg7hL0aFYWj7hRtP9cp9nqXYQQPzhHMMc",
    authDomain: "fingamepro.firebaseapp.com",
    projectId: "fingamepro",
    storageBucket: "fingamepro.firebasestorage.app",
    messagingSenderId: "479959446564",
    appId: "1:479959446564:web:1d0d9890d4f5501c4594b1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
window.db = db; // Global access for Leaderboard
window.currentUser = null;

console.log("🔥 System Ready: Instant Sync Mode");

// --- 2. GLOBAL COIN MANAGER ---
// Ye function har jagah se call hoga (Games, Tasks, Refer)
window.addCoins = function(amount) {
    if(!amount) return;
    
    // 1. Local Update (Instant)
    let currentBal = parseFloat(localStorage.getItem('local_balance') || "0");
    let newBal = currentBal + amount;
    
    localStorage.setItem('local_balance', newBal);
    if(window.currentUser) window.currentUser.balance = newBal;

    // 2. UI Update (Sab jagah turant dikhega)
    updateAllUI(newBal);

    // 3. Wallet Animation Trigger (Agar wallet page khula hai)
    if(window.updateWalletUI) window.updateWalletUI(newBal);

    console.log(`💰 Added ${amount} Coins. New Bal: ${newBal}`);
};

// UI Updater Helper
function updateAllUI(balance) {
    const balStr = Math.floor(balance).toLocaleString();
    
    // Header
    const headerEl = document.getElementById('header-coin-balance');
    if(headerEl) headerEl.innerText = balStr;
    
    // Home Display
    const homeEl = document.getElementById('home-balance-display');
    if(homeEl) homeEl.innerText = balStr;

    // Game Mining HUD
    const gameEl = document.getElementById('display-balance');
    if(gameEl) gameEl.innerText = balStr;
}

// --- 3. AUTO-SAVE SYSTEM (Every 6 Hours) ---
const SAVE_INTERVAL = 6 * 60 * 60 * 1000; // 6 Hours

function startAutoSave() {
    setInterval(() => {
        saveBalanceToCloud();
    }, SAVE_INTERVAL);
    
    // Safety: Save on window close too
    window.addEventListener("beforeunload", () => {
        saveBalanceToCloud();
    });
}

async function saveBalanceToCloud() {
    if(!window.currentUser || !window.currentUser.id) return;
    
    const localBal = parseFloat(localStorage.getItem('local_balance'));
    console.log("☁️ Auto-Saving to Firebase...", localBal);

    try {
        const userRef = doc(db, "users", window.currentUser.id);
        await updateDoc(userRef, { 
            balance: localBal,
            lastSynced: serverTimestamp()
        });
        console.log("✅ Save Successful");
    } catch(e) {
        console.error("Save Failed:", e);
    }
}

// --- 4. LOGIN & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // Restore Balance Instantly from LocalStorage
    const savedBal = parseFloat(localStorage.getItem('local_balance') || "0");
    updateAllUI(savedBal);
    startAutoSave(); // Start the 6hr timer

    // Telegram Login
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#020617');
        
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) await loginUser(user);
    } else {
        // Browser Test Mode (Uncomment to test in browser)
        // await loginUser({ id: "TEST_USER", first_name: "Tester" });
    }
    
    // Default Navigation
    if(window.navigateTo) window.navigateTo('home');
});

async function loginUser(tgUser) {
    if(document.getElementById('display-name')) document.getElementById('display-name').innerText = tgUser.first_name;
    if(document.getElementById('display-id')) document.getElementById('display-id').innerText = tgUser.id;

    const userRef = doc(db, "users", String(tgUser.id));
    
    try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            
            // SMART SYNC: Local vs Server (Highest wins to prevent loss)
            const serverBal = data.balance || 0;
            const localBal = parseFloat(localStorage.getItem('local_balance') || "0");
            const finalBal = Math.max(serverBal, localBal);

            window.currentUser = { ...data, id: String(tgUser.id), balance: finalBal };
            localStorage.setItem('local_balance', finalBal);
            updateAllUI(finalBal);
            
            // Sync Profile Image
            if(data.profileImg) {
                localStorage.setItem('user_avatar', data.profileImg);
                if(document.getElementById('profile-img')) document.getElementById('profile-img').src = data.profileImg;
            }

            // Verify Referral if pending
            if (data.referralStatus === 'pending' && data.joined_via) {
                verifyReferral(String(tgUser.id), data.joined_via, tgUser.first_name);
            }
            
            passDataToReferralPage(window.currentUser, String(tgUser.id));

        } else {
            // New User
            const newUser = {
                id: String(tgUser.id),
                name: tgUser.first_name,
                username: tgUser.username || "none",
                balance: 0,
                referralStatus: 'none',
                profileImg: "assets/default-avatar.png",
                joinedAt: serverTimestamp()
            };
            await setDoc(userRef, newUser);
            window.currentUser = newUser;
            localStorage.setItem('local_balance', 0);
            updateAllUI(0);
        }
    } catch (e) {
        console.error("Login Error:", e);
    }
}

// --- 5. REFERRAL LOGIC ---
async function verifyReferral(userId, referrerId, userName) {
    try {
        await runTransaction(db, async (transaction) => {
            const refRef = doc(db, "users", referrerId);
            const userRef = doc(db, "users", userId);
            
            const rDoc = await transaction.get(refRef);
            if (!rDoc.exists()) return;

            // Update Referrer
            transaction.update(refRef, { 
                balance: increment(100), 
                referralCount: increment(1),
                totalEarnings: increment(100)
            });

            // Mark User Verified
            transaction.update(userRef, { referralStatus: 'verified' });
        });
        console.log("Referral Verified");
    } catch (e) { console.error(e); }
}

// Helper for UI navigation
window.navigateTo = function(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active'); // Remove active class from all
    });
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    
    const target = document.getElementById(sectionId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active'); // Add active class to current
    }

    // Update Bottom Nav State
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
    
    // If opening Wallet, force update UI from local storage
    if(sectionId === 'wallet' && window.updateWalletUI) {
        const bal = parseFloat(localStorage.getItem('local_balance') || "0");
        window.updateWalletUI(bal);
    }

    // If opening Leaderboard, ensure Init
    if(sectionId === 'leaderboard' && window.initLeaderboard) {
        window.initLeaderboard();
    }
};

window.openInternalPage = function(id) {
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden')); // Hide main sections too
    const t = document.getElementById(id);
    if(t) t.classList.remove('hidden');
    
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);
};

async function passDataToReferralPage(userData, userId) {
    setTimeout(() => {
        // Pass empty array for team initially to avoid delay, can load real team later
        if (window.updateReferralUI) window.updateReferralUI(userData, []);
    }, 500);
}

// Sync User Helper (Exported for other modules)
window.saveUserData = async function(uid, dataToUpdate) {
    if(!uid) return;
    try {
        const userRef = doc(db, "users", String(uid));
        await updateDoc(userRef, dataToUpdate);
    } catch(e) { console.error(e); }
};

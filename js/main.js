/* js/main.js - Smart Sync Integrated with Robust Logic */

// --- 1. FIREBASE IMPORTS & CONFIG (Fixed Version 10.13.1) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// ✅ ADDED: 'onSnapshot' for Live Sync
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, runTransaction, serverTimestamp, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCg7hL0aFYWj7hRtP9cp9nqXYQQPzhHMMc",
    authDomain: "fingamepro.firebaseapp.com",
    projectId: "fingamepro",
    storageBucket: "fingamepro.firebasestorage.app",
    messagingSenderId: "479959446564",
    appId: "1:479959446564:web:1d0d9890d4f5501c4594b1"
};

// Initialize
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Exporting for other modules
window.db = db; // Global access for debugging
window.currentUser = null; // Global State

console.log("🔥 Firebase Connected & Ready!");

// --- ✅ NEW HELPER: Smart Sync (Local vs Server Balance) ---
// Ye check karega ki LocalStorage me balance jyada hai ya Server pe.
function getSmartBalance(serverData) {
    const serverBal = serverData.balance || 0;
    const localBal = parseFloat(localStorage.getItem('local_balance'));

    // Agar Local Balance bada hai (Matlab user ne offline khela hai), to Local use karo
    if (!isNaN(localBal) && localBal > serverBal) {
        console.log(`📈 Keeping Local Progress: ${localBal} (Server: ${serverBal})`);
        return localBal;
    }
    // Nahi to Server sahi hai (matlab referral bonus ya dusre device se khela)
    return serverBal;
}

// --- ✅ NEW: LIVE SYNC (Real-time Updates) ---
window.syncUserWithFirebase = function(userId) {
    if(!userId) return;
    const userRef = doc(db, "users", String(userId));
    
    // onSnapshot se agar database me coin badhega to turant app me dikhega
    onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 🔥 SMART LOGIC: Compare Server vs Local
            const finalBalance = getSmartBalance(data); 
            
            // Global State Update
            window.currentUser = { ...data, balance: finalBalance };
            
            // LocalStorage backup update
            localStorage.setItem('local_balance', finalBalance);

            updateUIWithData(window.currentUser);
            
            // Agar Wallet UI khula hai to usko bhi update karo
            if(typeof window.updateWalletUI === 'function') window.updateWalletUI();
        }
    });
};

// --- 2. STARTUP LOGIC (User Login & Verify) ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Header Color Set
        window.Telegram.WebApp.setHeaderColor('#020617'); 
        
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        
        // Agar Telegram User hai to Login karo
        if (user) {
            // 🔥 ADDED: Start Firebase Live Sync immediately
            if(window.syncUserWithFirebase) {
                window.syncUserWithFirebase(user.id);
            }

            await loginUser(user);
        } else {
            // Testing ke liye (Agar browser me khola bina Telegram ke)
            console.log("No Telegram User. Running in Guest/Test Mode.");
            // Uncomment below to test
            // await loginUser({ id: "1078605976", first_name: "Test User", username: "tester" });
        }
    } else {
        console.log("Telegram WebApp not detected");
    }
    
    // 2. Default Navigation
    if(window.navigateTo) window.navigateTo('home');
});

// --- 3. LOGIN & DATA FETCHING (Updated with Smart Balance) ---
async function loginUser(tgUser) {
    console.log("👤 Logging in:", tgUser.id);
    
    // UI Update (Profile)
    if(document.getElementById('display-name')) document.getElementById('display-name').innerText = tgUser.first_name;
    if(document.getElementById('display-id')) document.getElementById('display-id').innerText = tgUser.id;

    const userRef = doc(db, "users", String(tgUser.id));
    
    try {
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            // OLD USER: Data Load karo
            const data = snap.data();
            
            // 🔥 APPLY SMART BALANCE LOGIC HERE TOO
            // Ye ensure karega ki login karte waqt agar local me jyada paise hain to wo 0 na ho jaye
            const finalBalance = getSmartBalance(data); 
            
            // Update Global & Local Storage
            window.currentUser = { ...data, balance: finalBalance };
            localStorage.setItem('local_balance', finalBalance);

            console.log("✅ User Found:", window.currentUser);

            // Start Game Engine
            if (typeof window.initGame === "function") {
                window.initGame(); 
                console.log("🚀 Game Engine Started");
            }

            // --- CHECK REFERRAL VERIFICATION ---
            if (data.referralStatus === 'pending' && data.joined_via) {
                console.log("⏳ Pending Referral Detected...");
                await verifyReferral(String(tgUser.id), data.joined_via, tgUser.first_name);
                
                // Verify hone ke baad naya data fresh fetch karo
                const newSnap = await getDoc(userRef);
                const newData = newSnap.data();
                
                // Re-apply smart balance logic on new data
                const newSmartBal = getSmartBalance(newData);
                window.currentUser = { ...newData, balance: newSmartBal };
                
                updateUIWithData(window.currentUser);
                passDataToReferralPage(window.currentUser, String(tgUser.id));
            } else {
                // Normal Load
                updateUIWithData(window.currentUser);
                passDataToReferralPage(window.currentUser, String(tgUser.id));
            }

        } else {
            // NEW USER: Create Account
            console.log("🆕 Creating New User...");
            const newUser = {
                id: String(tgUser.id),
                name: tgUser.first_name,
                username: tgUser.username || "none",
                balance: 0,
                referralCount: 0,
                totalEarnings: 0,
                energy: 1000, // Default Energy
                referralStatus: 'none',
                joinedAt: serverTimestamp()
            };
            
            await setDoc(userRef, newUser);
            
            // Set Global State
            window.currentUser = newUser;
            localStorage.setItem('local_balance', 0); // New user starts at 0

            if (typeof window.initGame === "function") {
                window.initGame(); 
                console.log("🚀 Game Engine Started (New User)");
            }

            updateUIWithData(newUser);
            passDataToReferralPage(newUser, String(tgUser.id));
        }
    } catch (e) {
        console.error("Login Error:", e);
    }
}

// --- 4. REFERRAL VERIFICATION (The Bridge) ---
async function verifyReferral(userId, referrerId, userName) {
    try {
        await runTransaction(db, async (transaction) => {
            const refRef = doc(db, "users", referrerId);
            const userRef = doc(db, "users", userId);
            const teamRef = doc(db, "users", referrerId, "my_team", userId);

            const rDoc = await transaction.get(refRef);
            if (!rDoc.exists()) return; // Referrer nahi mila to ignore

            // 1. Referrer ko Paisa do (100 Coins)
            transaction.update(refRef, {
                balance: increment(100),
                referralCount: increment(1),
                totalEarnings: increment(100)
            });

            // 2. Referrer ki Team list update karo
            transaction.set(teamRef, {
                id: userId,
                name: userName,
                earned_for_ref: 100,
                joinedAt: serverTimestamp()
            });

            // 3. User ko Verified mark karo
            transaction.update(userRef, { referralStatus: 'verified' });
        });
        
        console.log("🎉 Referral Verified Successfully!");
    } catch (e) {
        console.error("Verification Failed:", e);
    }
}

// --- 5. UI UPDATES & DATA PASSING ---
function updateUIWithData(data) {
    // Balance Update
    if(document.getElementById('home-balance-display')) 
        document.getElementById('home-balance-display').innerText = Math.floor(data.balance);
    if(document.getElementById('header-coin-balance')) 
        document.getElementById('header-coin-balance').innerText = Math.floor(data.balance);
}

async function passDataToReferralPage(userData, userId) {
    // Team Data Fetching
    let team = [];
    try {
        const teamRef = collection(db, "users", userId, "my_team");
        const snapshot = await getDocs(teamRef);
        snapshot.forEach(d => team.push(d.data()));
    } catch (e) {
        console.log("No team data yet.");
    }

    // Call Global Function in pro-refer.js
    setTimeout(() => {
        if (window.updateReferralUI) {
            window.updateReferralUI(userData, team);
        } else {
            console.warn("Referral UI function not found yet.");
        }
    }, 500);
}

// --- 6. GAME & DATA SAVING HELPER (Required for games.js) ---
window.saveUserData = async function(uid, dataToUpdate) {
    if(!uid) return;
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, dataToUpdate);
        
        // Update Local State Global
        if(window.currentUser) {
            Object.assign(window.currentUser, dataToUpdate);
        }
        // console.log("💾 Progress Saved to Firebase");
    } catch(e) {
        console.error("Save Error:", e);
    }
};

// --- 7. GLOBAL NAVIGATION SYSTEM ---
window.navigateTo = function(sectionId) {
    // Hide All Sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // Hide Overlay Pages
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    
    // Close Menu
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);

    // Show Target
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) item.classList.add('active');
    });
}

// ✅ FIXED: Menu Toggle (Updated to fix Contact Page redirect issue)
window.openInternalPage = function(pageId) {
    console.log("Opening Page:", pageId);

    // 1. Hide ALL internal pages first
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    
    // 2. Hide Main Sections (Home, Wallet etc)
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));

    // 3. Show the requested page
    const target = document.getElementById(pageId);
    if(target) {
        target.classList.remove('hidden');
    } else {
        console.error("Page not found:", pageId);
    }

    // 4. Close Menu & Overlay
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);
}

// --- 8. LOGOUT FUNCTION (The Fix) ---
window.handleLogout = function() {
    // 1. Force Close Menu First
    if(window.toggleProfileMenu) {
        window.toggleProfileMenu(false);
    }

    // 2. Show Popup after a tiny delay
    setTimeout(() => {
        Swal.fire({
            title: 'Exit App?',
            text: "Do you want to close FinGamePro?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ff4444',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, Exit',
            background: '#020617',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                // Close Telegram Web App
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.close();
                } else {
                    // Browser Fallback
                    window.close();
                    window.location.href = "about:blank"; 
                }
            }
        });
    }, 100);
}

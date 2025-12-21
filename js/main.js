/* js/main.js - Complete File with Smart Balance Protection */

// --- 1. FIREBASE IMPORTS & CONFIG ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, runTransaction, serverTimestamp, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase Config (FinGamePro)
const firebaseConfig = {
    apiKey: "AIzaSyCg7hL0aFYWj7hRtP9cp9nqXYQQPzhHMMc",
    authDomain: "fingamepro.firebaseapp.com",
    projectId: "fingamepro",
    storageBucket: "fingamepro.firebasestorage.app",
    messagingSenderId: "479959446564",
    appId: "1:479959446564:web:1d0d9890d4f5501c4594b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Export db
window.db = db; // Global access
window.currentUser = null; // Global State

console.log("🔥 Firebase Connected & Ready!");

// --- ✅ HELPER: Smart Balance Logic (The Fix) ---
// Ye function ensure karega ki agar Local Storage me coins jyada hain, to wo delete na hon.
function getSmartBalance(serverData) {
    const serverBal = serverData.balance || 0;
    const localBal = parseFloat(localStorage.getItem('local_balance'));
    
    // Agar Local Balance number hai aur Server se bada hai, to Local hi sahi hai
    if (!isNaN(localBal) && localBal > serverBal) {
        // console.log(`🛡️ Protecting Local Coins: ${localBal} (Server: ${serverBal})`);
        return localBal;
    }
    
    // Agar Server bada hai (Referral bonus mila ho), to Server sahi hai
    return serverBal;
}

// --- ✅ LIVE SYNC (Real-time Updates) ---
window.syncUserWithFirebase = function(userId) {
    if(!userId) return;
    const userRef = doc(db, "users", String(userId));
    
    // Real-time listener
    onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 🔥 SMART LOGIC: Apply protection
            const finalBalance = getSmartBalance(data);
            
            // Update Global State
            window.currentUser = { ...data, id: String(userId), balance: finalBalance };
            
            // Force Update Local Storage
            localStorage.setItem('local_balance', finalBalance);

            // Update UI
            updateUIWithData(window.currentUser);
            if(typeof window.updateWalletUI === 'function') window.updateWalletUI();
        }
    });
};

// --- 2. STARTUP LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    // 🚀 INSTANT UI RESTORE (Login ka wait kiye bina purana balance dikhao)
    const savedBal = localStorage.getItem('local_balance');
    if(savedBal) {
        const balNum = Math.floor(parseFloat(savedBal));
        if(document.getElementById('header-coin-balance')) 
            document.getElementById('header-coin-balance').innerText = balNum.toLocaleString();
        if(document.getElementById('display-balance')) 
            document.getElementById('display-balance').innerText = balNum.toLocaleString();
        if(document.getElementById('home-balance-display')) 
            document.getElementById('home-balance-display').innerText = balNum.toLocaleString();
    }

    // Telegram Init
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#020617'); 
        
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        
        if (user) {
            // Sync start turant kar do
            if(window.syncUserWithFirebase) window.syncUserWithFirebase(user.id);
            await loginUser(user);
        } else {
            console.log("Running in Browser Mode (No Telegram User)");
            // Testing ke liye niche wali line uncomment kar sakte hain
            // await loginUser({ id: "1078605976", first_name: "Test User" });
        }
    }
    
    // Default Navigation
    if(window.navigateTo) window.navigateTo('home');
});

// --- 3. LOGIN LOGIC ---
async function loginUser(tgUser) {
    console.log("👤 Logging in:", tgUser.id);
    
    // UI Update (Profile Name)
    if(document.getElementById('display-name')) document.getElementById('display-name').innerText = tgUser.first_name;
    if(document.getElementById('display-id')) document.getElementById('display-id').innerText = tgUser.id;

    const userRef = doc(db, "users", String(tgUser.id));
    
    try {
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            // OLD USER FOUND
            const data = snap.data();
            
            // 🔥 Apply Smart Balance Protection Here Too
            const finalBalance = getSmartBalance(data);
            
            window.currentUser = { ...data, balance: finalBalance };
            localStorage.setItem('local_balance', finalBalance); // Sync Local
            
            console.log("✅ User Loaded:", window.currentUser);
            
            // Start Game Engine
            if (typeof window.initGame === "function") window.initGame(); 
            
            // Pending Referral Check
            if (data.referralStatus === 'pending' && data.joined_via) {
                await verifyReferral(String(tgUser.id), data.joined_via, tgUser.first_name);
            }
            
            updateUIWithData(window.currentUser);
            passDataToReferralPage(window.currentUser, String(tgUser.id));

        } else {
            // NEW USER CREATION
            console.log("🆕 Creating New User...");
            const newUser = {
                id: String(tgUser.id),
                name: tgUser.first_name,
                username: tgUser.username || "none",
                balance: 0,
                referralCount: 0,
                totalEarnings: 0,
                energy: 1000,
                referralStatus: 'none',
                joinedAt: serverTimestamp()
            };
            
            await setDoc(userRef, newUser);
            window.currentUser = newUser;
            localStorage.setItem('local_balance', 0); // Reset local for new user
            
            if (typeof window.initGame === "function") window.initGame(); 
            
            updateUIWithData(newUser);
            passDataToReferralPage(newUser, String(tgUser.id));
        }
    } catch (e) {
        console.error("Login Error:", e);
    }
}

// --- 4. REFERRAL VERIFICATION ---
async function verifyReferral(userId, referrerId, userName) {
    try {
        await runTransaction(db, async (transaction) => {
            const refRef = doc(db, "users", referrerId);
            const userRef = doc(db, "users", userId);
            const teamRef = doc(db, "users", referrerId, "my_team", userId);

            const rDoc = await transaction.get(refRef);
            if (!rDoc.exists()) return;

            // Update Referrer (Server Side Instant Update)
            transaction.update(refRef, { 
                balance: increment(100), 
                referralCount: increment(1),
                totalEarnings: increment(100)
            });

            // Add to Team
            transaction.set(teamRef, { 
                id: userId, 
                name: userName, 
                earned_for_ref: 100, 
                joinedAt: serverTimestamp() 
            });

            // Mark User Verified
            transaction.update(userRef, { referralStatus: 'verified' });
        });
        console.log("🎉 Referral Verified!");
    } catch (e) {
        console.error("Referral Error:", e);
    }
}

// --- 5. DATA SAVING HELPER ---
window.saveUserData = async function(uid, dataToUpdate) {
    if(!uid) return;
    try {
        const userRef = doc(db, "users", String(uid));
        await updateDoc(userRef, dataToUpdate);
        
        // Update Local State Global
        if(window.currentUser) {
            Object.assign(window.currentUser, dataToUpdate);
            // Ensure LocalStorage stays synced
            if(dataToUpdate.balance !== undefined) {
                localStorage.setItem('local_balance', dataToUpdate.balance);
            }
        }
    } catch(e) {
        console.error("Save Error:", e);
    }
};

// --- 6. UI & DATA PASSING ---
function updateUIWithData(data) {
    // Round down balance for display
    const bal = Math.floor(data.balance).toLocaleString();
    
    if(document.getElementById('home-balance-display')) 
        document.getElementById('home-balance-display').innerText = bal;
    if(document.getElementById('header-coin-balance')) 
        document.getElementById('header-coin-balance').innerText = bal;
}

async function passDataToReferralPage(userData, userId) {
    // Fetch Team Data
    let team = [];
    try {
        const teamRef = collection(db, "users", userId, "my_team");
        const snapshot = await getDocs(teamRef);
        snapshot.forEach(d => team.push(d.data()));
    } catch (e) {
        console.log("No team yet.");
    }

    setTimeout(() => {
        if (window.updateReferralUI) window.updateReferralUI(userData, team);
    }, 500);
}

// --- 7. NAVIGATION SYSTEM ---
window.navigateTo = function(sectionId) {
    // Hide Sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });
    // Hide Internal Pages
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);

    // Show Target
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // Update Bottom Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

window.openInternalPage = function(pageId) {
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    
    const target = document.getElementById(pageId);
    if(target) target.classList.remove('hidden');
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);
}

// --- 8. LOGOUT LOGIC ---
window.handleLogout = function() {
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);
    
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
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.close();
                } else {
                    window.close();
                    window.location.href = "about:blank"; 
                }
            }
        });
    }, 100);
}

// js/leaderboard.js

// --- ⚙️ PRODUCTION CONFIGURATION ---
// 15 Minutes Cache (Quota Safety Active ✅)
const CACHE_DURATION_MS = 15 * 60 * 1000; 
const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';

// --- HELPER: Get Max Local Balance ---
function getLocalSmartBalance() {
    const keys = ['local_balance', 'coins', 'mining_balance', 'userBalance'];
    let maxBal = 0;
    keys.forEach(k => {
        const val = parseInt(localStorage.getItem(k) || "0");
        if (val > maxBal) maxBal = val;
    });
    return maxBal;
}

// ✅ STEP 1: INSTANT LOCAL LOAD (Visual Fix - Runs Immediately)
(function instantFix() {
    console.log("🚀 Force Starting Leaderboard...");

    setTimeout(() => {
        const localName = localStorage.getItem('userName') || "You";
        const localBal = getLocalSmartBalance(); // Use Smart Balance
        
        // Khud ko King banao local data ke saath (Visual only)
        updatePodium(1, localName, localBal, 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', true);
        
        // Rank 2 & 3 Waiting
        updatePodium(2, "Waiting...", 0, 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', false);
        updatePodium(3, "Waiting...", 0, 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png', false);
        
        // List clear
        const listEl = document.getElementById('lb-list-render');
        if(listEl) listEl.innerHTML = '<p style="text-align:center; color:#444; margin-top:10px; font-size:12px;">Waiting for challengers...</p>';

        // Wallet Rank Update
        forceUpdateWalletRank("1");
        
    }, 500); 
})();

// --- Helper: Podium Update ---
function updatePodium(rank, name, balance, img, isActive) {
    const pName = document.getElementById(`p${rank}-name`);
    const pScore = document.getElementById(`p${rank}-score`);
    const pImg = document.getElementById(`p${rank}-img`);
    const pContainer = document.querySelector(`.rank-${rank}`); 

    if (pName) {
        pName.innerText = name;
        pName.classList.remove('loading-anim');
    }
    // Format Score (e.g. 1.2k)
    if (pScore) pScore.innerText = isActive ? formatNumber(balance) : "--";
    if (pImg) pImg.src = img;
    
    if (pContainer) {
        pContainer.style.opacity = isActive ? '1' : '0.4';
        pContainer.style.transform = isActive ? 'scale(1.1)' : 'scale(0.9)';
    }
}

// --- Helper: Format Numbers ---
function formatNumber(num) {
    if(num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if(num >= 1000) return (num/1000).toFixed(1) + 'k';
    return num.toLocaleString();
}

// --- Helper: Wallet Rank Update ---
function forceUpdateWalletRank(rankStr) {
    localStorage.setItem('mySavedRank', rankStr);
    
    if(window.currentUser) window.currentUser.rank = parseInt(rankStr);
    else window.currentUser = { rank: parseInt(rankStr) };

    const rankCards = document.querySelectorAll('#rank-card-container span');
    rankCards.forEach(span => {
        if(span.innerText.includes("#")) {
            span.innerText = "#" + rankStr;
            span.style.color = "#4ade80"; 
        }
    });
}


// ✅ STEP 2: REAL FIREBASE SYNC (With Smart Merge & Caching)
setTimeout(async () => {
    if (typeof firebase === 'undefined') return;
    
    const db = firebase.firestore();
    const auth = firebase.auth();

    auth.onAuthStateChanged(async (user) => {
        if (!user) return; 

        // --- 💾 CACHE CHECK LOGIC START ---
        const cachedTime = localStorage.getItem(LB_TIME_KEY);
        const now = Date.now();

        // Agar Cache exist karta hai aur 15 min purana nahi hai
        if (cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION_MS)) {
            console.log("⚡ Using Cached Leaderboard Data (Quota Saved)");
            const cachedData = JSON.parse(localStorage.getItem(LB_CACHE_KEY));
            
            // Render Cache directly
            renderRealData(cachedData, user.uid);
            return; // STOP HERE (Do not read Firebase)
        }
        // --- 💾 CACHE CHECK LOGIC END ---

        try {
            console.log("🔥 Fetching Fresh Global Ranks...");
            const snapshot = await db.collection('users')
                .orderBy('balance', 'desc')
                .limit(100)
                .get();

            let leaderboardData = [];
            const localSmartBal = getLocalSmartBalance();

            snapshot.forEach(doc => {
                const d = doc.data();
                let finalBal = d.balance || 0;

                // 🧠 SMART MERGE: Agar ye 'Main' hu, to Highest Balance dikhao
                if(doc.id === user.uid) {
                    if(localSmartBal > finalBal) {
                        finalBal = localSmartBal; // Local zyada hai to wo dikhao
                        console.log("⚡ Updated Leaderboard with Local Balance:", finalBal);
                    }
                }

                leaderboardData.push({
                    id: doc.id,
                    name: d.firstName || "User",
                    balance: finalBal
                });
            });

            // Handle Empty / Solo Case
            if (leaderboardData.length === 0) {
                // Agar DB khali hai, to Local Data daal do
                leaderboardData.push({
                    id: user.uid,
                    name: localStorage.getItem('userName') || "You",
                    balance: localSmartBal
                });
            } else {
                // Check if I am in the list. If not (and list is small), add me.
                const myEntry = leaderboardData.find(u => u.id === user.uid);
                if (!myEntry && leaderboardData.length < 100) {
                     leaderboardData.push({
                        id: user.uid,
                        name: localStorage.getItem('userName') || "You",
                        balance: localSmartBal
                    });
                }
            }

            // Re-Sort (Kyunki humne local balance update kiya hai)
            leaderboardData.sort((a, b) => b.balance - a.balance);

            // 💾 SAVE TO CACHE
            localStorage.setItem(LB_CACHE_KEY, JSON.stringify(leaderboardData));
            localStorage.setItem(LB_TIME_KEY, now.toString());

            renderRealData(leaderboardData, user.uid);

        } catch (error) {
            console.error("Network Error, sticking to Local Fix.", error);
        }
    });

}, 2000); 


// --- REAL DATA RENDERER ---
function renderRealData(data, myId) {
    const listContainer = document.getElementById('lb-list-render');
    if(listContainer) listContainer.innerHTML = '';

    const IMGS = [
        'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', // King
        'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', // Silver
        'https://cdn-icons-png.flaticon.com/512/4140/4140037.png'  // Bronze
    ];

    // Podium Render
    if(data[0]) updatePodium(1, data[0].name, data[0].balance, IMGS[0], true);
    if(data[1]) updatePodium(2, data[1].name, data[1].balance, IMGS[1], true);
    if(data[2]) updatePodium(3, data[2].name, data[2].balance, IMGS[2], true);

    // List Render (Rank 4+)
    for (let i = 3; i < data.length; i++) {
        const u = data[i];
        const isMe = (u.id === myId);
        
        const div = document.createElement('div');
        div.className = `lb-card ${isMe ? 'highlight-me' : ''}`;
        div.innerHTML = `
            <span class="lb-rank">#${i+1}</span>
            <img src="assets/default_avatar.png" class="lb-avatar" onerror="this.src='assets/coin_main.jpg'">
            <span class="lb-username">${u.name} ${isMe ? '(You)' : ''}</span>
            <span class="lb-coins">${u.balance.toLocaleString()}</span>
        `;
        listContainer.appendChild(div);
    }

    // Wallet Rank Logic
    const myIndex = data.findIndex(u => u.id === myId);
    if(myIndex !== -1) {
        forceUpdateWalletRank((myIndex + 1).toString());
    } else {
        forceUpdateWalletRank("100+");
    }
}

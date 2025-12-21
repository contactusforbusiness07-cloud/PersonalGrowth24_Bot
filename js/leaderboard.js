// js/leaderboard.js

// Firebase references (Assuming firebase-init.js ran first)
const db = firebase.firestore(); 
const auth = firebase.auth(); 

const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';
// ⚠️ CHANGED: Cache 0 for instant updates during testing
const CACHE_DURATION_MS = 0; 

// --- Helper: Format Numbers ---
function formatK(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toLocaleString();
}

// --- Main Function: Open Leaderboard ---
async function openLeaderboard() {
    const listContainer = document.getElementById('lb-list-render');
    
    // Only show "Fetching" if container is visible and empty
    if(listContainer && listContainer.innerHTML.trim() === "") {
         listContainer.innerHTML = '<p style="text-align:center; color: #888; padding-top: 20px;">Fetching global ranks...</p>';
    }

    const now = Date.now();
    const cachedTime = localStorage.getItem(LB_TIME_KEY);
    let leaderboardData = [];

    // 1. Check Cache
    if (cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION_MS)) {
        console.log("Using Cached Leaderboard Data ⚡");
        try {
            leaderboardData = JSON.parse(localStorage.getItem(LB_CACHE_KEY));
            renderHitechLeaderboard(leaderboardData);
            updateMyRankInBackground(leaderboardData); // Update Wallet Rank
        } catch(e) {
            // Corrupt cache? Fetch fresh.
            fetchFromFirebase(listContainer);
        }
    } else {
        // 2. Fetch Fresh Data
        fetchFromFirebase(listContainer);
    }
}

// --- Fetch Logic (Separated for Stability) ---
async function fetchFromFirebase(listContainer) {
    console.log("Fetching Fresh Leaderboard Data from Firebase 🔥");
    const now = Date.now();

    try {
        const snapshot = await db.collection('users')
            .orderBy('balance', 'desc')
            .limit(100)
            .get();

        let leaderboardData = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            leaderboardData.push({
                id: doc.id,
                name: data.firstName ? data.firstName : `User_${doc.id.substring(0,4)}`,
                balance: data.balance || 0
            });
        });

        // Handle Empty DB Case
        if (leaderboardData.length === 0) {
            if(listContainer) listContainer.innerHTML = "<p style='text-align:center; color:#888;'>No players found.</p>";
            // Create a fake "Me" entry if logged in, just to fix UI
            const user = auth.currentUser;
            if(user) {
                leaderboardData.push({ 
                    id: user.uid, 
                    name: "You", 
                    balance: parseInt(localStorage.getItem('coins') || 0) 
                });
            }
        }

        // Save Cache
        localStorage.setItem(LB_CACHE_KEY, JSON.stringify(leaderboardData));
        localStorage.setItem(LB_TIME_KEY, now.toString());

        renderHitechLeaderboard(leaderboardData);
        updateMyRankInBackground(leaderboardData); // Crucial for Wallet

    } catch (error) {
        console.error("Leaderboard Error:", error);
        if(listContainer) listContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load. Check internet.</p>';
    }
}


// --- Renderer Function (Updates UI) ---
function renderHitechLeaderboard(data) {
    const listContainer = document.getElementById('lb-list-render');
    if(!listContainer) return; // Safety check

    listContainer.innerHTML = ''; 

    // --- STATIC IMAGES ---
    const IMG_RANK_1 = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png'; // King
    const IMG_RANK_2 = 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'; // Silver
    const IMG_RANK_3 = 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png'; // Bronze
    const IMG_DEFAULT = 'assets/default_avatar.png'; 

    // --- Update Podium ---
    if (data[0]) updatePodiumItem(1, data[0].name, data[0].balance, IMG_RANK_1, true);
    else updatePodiumItem(1, "Waiting...", 0, IMG_RANK_1, false);

    if (data[1]) updatePodiumItem(2, data[1].name, data[1].balance, IMG_RANK_2, true);
    else updatePodiumItem(2, "Waiting...", 0, IMG_RANK_2, false);

    if (data[2]) updatePodiumItem(3, data[2].name, data[2].balance, IMG_RANK_3, true);
    else updatePodiumItem(3, "Waiting...", 0, IMG_RANK_3, false);

    // --- Render List (Rank 4+) ---
    for (let i = 3; i < data.length; i++) {
        const user = data[i];
        const rank = i + 1;
        const card = document.createElement('div');
        card.className = 'lb-card';
        card.style.animation = `fadeInUp 0.5s ease backwards ${i * 0.05}s`;
        card.innerHTML = `
            <span class="lb-rank">#${rank}</span>
            <img src="${IMG_DEFAULT}" class="lb-avatar" alt="user" onerror="this.src='assets/coin_main.jpg'">
            <span class="lb-username">${user.name}</span>
            <span class="lb-coins">${user.balance.toLocaleString()}</span>
        `;
        listContainer.appendChild(card);
    }
}

// --- Helper: Update Podium Element ---
function updatePodiumItem(rank, name, balance, img, isActive) {
    const pName = document.getElementById(`p${rank}-name`);
    const pScore = document.getElementById(`p${rank}-score`);
    const pImg = document.getElementById(`p${rank}-img`);
    const pContainer = document.querySelector(`.rank-${rank}`);

    if(pName) pName.innerText = name;
    if(pScore) pScore.innerText = isActive ? formatK(balance) : "--";
    if(pImg) pImg.src = img;
    if(pContainer) pContainer.style.opacity = isActive ? '1' : '0.4';
}


// --- 🚀 CRITICAL: Update Wallet Rank (Runs in Background) ---
function updateMyRankInBackground(data) {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Find my index
    const myIndex = data.findIndex(u => u.id === currentUser.uid);
    let myDisplayRank = "100+"; 

    if (myIndex !== -1) {
        myDisplayRank = (myIndex + 1).toString();
    } else if (data.length < 100) {
        // If I'm not in list but list is small, it means I haven't synced yet.
        // Assume Rank = Last Rank + 1 for now
        myDisplayRank = (data.length + 1).toString();
    }
    
    // Save for Wallet
    localStorage.setItem('mySavedRank', myDisplayRank);
    console.log("✅ Rank Updated for Wallet: #" + myDisplayRank);
}


// ==========================================
// 🔥 AUTO-START ENGINE (Fixes Loading Issue)
// ==========================================
// Wait for Firebase Auth to be ready, THEN fetch
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Auth Ready. Starting Leaderboard Engine...");
        openLeaderboard(); // Run once automatically on load
    }
});


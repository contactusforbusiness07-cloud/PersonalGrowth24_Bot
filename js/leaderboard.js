// js/leaderboard.js

// --- 1. SAFE INITIALIZATION ---
// Hum check karenge ki Firebase load hua hai ya nahi
let db, auth;

function initFirebaseRefs() {
    if (typeof firebase !== 'undefined') {
        db = firebase.firestore();
        auth = firebase.auth();
        return true;
    }
    return false;
}

const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';
// LIVE FIX: Cache duration 0 kar diya hai taaki har baar fresh data dikhe
const CACHE_DURATION_MS = 0; 

// --- 2. MAIN ENGINE (RETRY LOGIC) ---
// Ye function tab tak chalega jab tak Leaderboard load na ho jaye
async function forceStartLeaderboard() {
    // Wait for Firebase to be ready
    if (!initFirebaseRefs()) {
        console.log("Firebase not ready yet... retrying in 500ms");
        setTimeout(forceStartLeaderboard, 500);
        return;
    }

    // Wait for User Login (Auth)
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("✅ User Found:", user.uid);
            openLeaderboard(); // Start Fetching
        } else {
            console.log("Waiting for user login...");
        }
    });
}

// --- 3. DATA FETCHING LOGIC ---
async function openLeaderboard() {
    const listContainer = document.getElementById('lb-list-render');
    
    // UI: Show loading if empty
    if(listContainer && listContainer.innerHTML.trim() === "") {
         listContainer.innerHTML = '<p style="text-align:center; color: #888; padding-top: 20px;">Fetching live ranks...</p>';
    }

    console.log("🚀 Fetching Leaderboard Data...");
    
    try {
        // --- REAL LOGIC: Fetch Top 100 ---
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

        // --- EMPTY STATE FIX (Agar aap akele user ho) ---
        if (leaderboardData.length === 0) {
            const currentUser = auth.currentUser;
            if(currentUser) {
                // Fake entry create karo taaki UI khali na dikhe
                leaderboardData.push({
                    id: currentUser.uid,
                    name: "You (King)",
                    balance: window.currentUser ? window.currentUser.balance : 0
                });
            }
        }

        // Render UI
        renderHitechLeaderboard(leaderboardData);
        
        // --- CRITICAL: Update Wallet Rank Immediately ---
        updateMyRankInBackground(leaderboardData);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        // Retry automatically if failed
        setTimeout(openLeaderboard, 2000);
    }
}


// --- 4. RENDER UI (HITECH LOOK) ---
function renderHitechLeaderboard(data) {
    const listContainer = document.getElementById('lb-list-render');
    if(!listContainer) return;

    listContainer.innerHTML = ''; // Clear "Loading..."

    // Images
    const IMG_RANK_1 = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png';
    const IMG_RANK_2 = 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png';
    const IMG_RANK_3 = 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png';
    const IMG_DEFAULT = 'assets/default_avatar.png'; 

    // --- Update Podium (Top 3) ---
    // Rank 1
    if (data[0]) updatePodiumItem(1, data[0].name, data[0].balance, IMG_RANK_1, true);
    
    // Rank 2
    if (data[1]) updatePodiumItem(2, data[1].name, data[1].balance, IMG_RANK_2, true);
    else updatePodiumItem(2, "Waiting...", 0, IMG_RANK_2, false); // Dim logic

    // Rank 3
    if (data[2]) updatePodiumItem(3, data[2].name, data[2].balance, IMG_RANK_3, true);
    else updatePodiumItem(3, "Waiting...", 0, IMG_RANK_3, false); // Dim logic

    // --- Update List (Rank 4-100) ---
    for (let i = 3; i < data.length; i++) {
        const user = data[i];
        const rank = i + 1;
        
        const card = document.createElement('div');
        card.className = 'lb-card';
        card.innerHTML = `
            <span class="lb-rank">#${rank}</span>
            <img src="${IMG_DEFAULT}" class="lb-avatar" onerror="this.src='assets/coin_main.jpg'">
            <span class="lb-username">${user.name}</span>
            <span class="lb-coins">${user.balance.toLocaleString()}</span>
        `;
        listContainer.appendChild(card);
    }
    
    // Hide Loading Text in Podium
    const loadingTexts = document.querySelectorAll('.podium-info span');
    loadingTexts.forEach(el => {
        if(el.innerText === "Loading...") el.innerText = "Waiting...";
    });
}

// Helper for Podium
function updatePodiumItem(rank, name, balance, img, isActive) {
    const pName = document.getElementById(`p${rank}-name`);
    const pScore = document.getElementById(`p${rank}-score`);
    const pImg = document.getElementById(`p${rank}-img`);
    const pDiv = document.querySelector(`.rank-${rank}`);

    if(pName) pName.innerText = name;
    if(pScore) pScore.innerText = isActive ? balance.toLocaleString() : "--";
    if(pImg) pImg.src = img;
    
    // Opacity control for empty slots
    if(pDiv) pDiv.style.opacity = isActive ? '1' : '0.4';
}


// --- 5. WALLET RANK SYNC (Background) ---
function updateMyRankInBackground(data) {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // List me apna naam dhoondo
    const myIndex = data.findIndex(u => u.id === currentUser.uid);
    let myRank = "100+";

    if (myIndex !== -1) {
        myRank = (myIndex + 1).toString(); // Example: "1"
    } else if (data.length < 100) {
        // Agar list me nahi ho aur list full nahi hai, mtlb tum last ho
        myRank = (data.length + 1).toString();
    }

    // Save Logic for Wallet Page
    localStorage.setItem('mySavedRank', myRank);
    
    // Agar user abhi Wallet page par hai, to turant update karo
    const rankDisplay = document.querySelector('#rank-card-container span[style*="font-size:1.2rem"]');
    if(rankDisplay) {
        rankDisplay.innerText = "#" + myRank;
    }
    
    // Unlock button bhi update karo
    if(window.updateWalletUI) {
        window.currentUser.rank = parseInt(myRank); // Update Global Memory
        window.updateWalletUI(); // Force Refresh Wallet UI
    }

    console.log("✅ Wallet Rank Updated to: #" + myRank);
}


// --- 6. AUTO START TRIGGER ---
// Ye line script load hote hi engine start kar degi
forceStartLeaderboard();

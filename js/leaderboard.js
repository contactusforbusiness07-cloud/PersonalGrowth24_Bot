// js/leaderboard.js

// Ensure Firebase is initialized
const db = firebase.firestore(); 
const auth = firebase.auth(); 

const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';
// Optimization: 15 Minutes Cache (Balance between "Live" and "Quota Saving")
const CACHE_DURATION_MS = 15 * 60 * 1000; 

// --- Helper: Format Numbers (1.2k, 1M) ---
function formatK(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toLocaleString();
}

// --- Main Function: Open Leaderboard ---
async function openLeaderboard() {
    const listContainer = document.getElementById('lb-list-render');
    
    // Clear old list & show loading
    listContainer.innerHTML = '<p style="text-align:center; color: #888; padding-top: 20px;">Fetching global ranks...</p>';

    const now = Date.now();
    const cachedTime = localStorage.getItem(LB_TIME_KEY);
    let leaderboardData = [];

    // 1. Check Cache (Save Money/Quota)
    if (cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION_MS)) {
        console.log("Using Cached Leaderboard Data ⚡");
        leaderboardData = JSON.parse(localStorage.getItem(LB_CACHE_KEY));
        renderHitechLeaderboard(leaderboardData);
    } else {
        // 2. Fetch Fresh Data from Firestore
        console.log("Fetching Fresh Leaderboard Data from Firebase 🔥");
        
        try {
            // Logic: Pure Database se Top 100 users nikalo jinke paas sabse zyada coins hain
            const snapshot = await db.collection('users')
                .orderBy('balance', 'desc')
                .limit(100)
                .get();

            leaderboardData = [];
            
            snapshot.forEach(doc => {
                const data = doc.data();
                leaderboardData.push({
                    id: doc.id,
                    name: data.firstName ? data.firstName : `User_${doc.id.substring(0,4)}`,
                    balance: data.balance || 0
                });
            });

            // Save to LocalStorage Cache
            localStorage.setItem(LB_CACHE_KEY, JSON.stringify(leaderboardData));
            localStorage.setItem(LB_TIME_KEY, now.toString());

            renderHitechLeaderboard(leaderboardData);

        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            listContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load ranks. Check internet.</p>';
        }
    }
}

// --- Renderer Function (Updates UI) ---
function renderHitechLeaderboard(data) {
    const listContainer = document.getElementById('lb-list-render');
    listContainer.innerHTML = ''; // Clear loading text

    // Handle Empty Game State (0 Users)
    if (data.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; color:#888;'>No players yet!</p>";
        resetPodium();
        return;
    }

    // --- STATIC IMAGES SETUP ---
    const IMG_RANK_1 = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png'; // King
    const IMG_RANK_2 = 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'; // Silver
    const IMG_RANK_3 = 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png'; // Bronze
    const IMG_DEFAULT = 'assets/default_avatar.png'; 

    // --- 1. Update Top 3 Podium (Dynamic Logic) ---
    // Yeh logic check karega user hai ya nahi. Agar hai to dikhayega, nahi to "Waiting..."
    
    // Rank 1 (King)
    if (data[0]) {
        updatePodiumItem(1, data[0].name, data[0].balance, IMG_RANK_1, true);
    }

    // Rank 2 (Silver)
    if (data[1]) {
        updatePodiumItem(2, data[1].name, data[1].balance, IMG_RANK_2, true);
    } else {
        updatePodiumItem(2, "Waiting...", 0, IMG_RANK_2, false);
    }

    // Rank 3 (Bronze)
    if (data[2]) {
        updatePodiumItem(3, data[2].name, data[2].balance, IMG_RANK_3, true);
    } else {
        updatePodiumItem(3, "Waiting...", 0, IMG_RANK_3, false);
    }


    // --- 2. Render List (Rank 4 to 100) ---
    // Loop wahan tak chalega jitne users hain (Max 100)
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

    // --- 3. AUTO-FIX: Update My Personal Rank ---
    // Yeh check karega ki "Main" is list mein hoon ya nahi
    const currentUser = auth.currentUser;
    
    if (currentUser) {
        // Find my index in the top 100 list
        const myIndex = data.findIndex(u => u.id === currentUser.uid);
        
        let myDisplayRank = "100+"; // Default agar Top 100 mein nahi ho
        
        if (myIndex !== -1) {
            // Agar Top 100 mein ho, to sahi Rank dikhao
            myDisplayRank = (myIndex + 1).toString();
        } 
        // Note: Agar user akela hai, to myIndex 0 hoga, aur rank "1" save hoga.
        
        // Save to Storage for Wallet Page
        localStorage.setItem('mySavedRank', myDisplayRank);
        console.log("My Updated Rank:", myDisplayRank);
        
        // Agar Wallet Page ka element abhi screen par hai, to turant update kar do
        const walletRankEl = document.getElementById('rank-status-card'); // Element ID check kar lena
        // Ya agar koi specific span hai jisme #999 likha hai
    }
}

// Helper to clean up code
function updatePodiumItem(rank, name, balance, img, isActive) {
    const prefix = `p${rank}`;
    document.getElementById(`${prefix}-name`).innerText = name;
    document.getElementById(`${prefix}-score`).innerText = isActive ? formatK(balance) : "--";
    document.getElementById(`${prefix}-img`).src = img;
    
    const container = document.querySelector(`.rank-${rank}`);
    if(container) container.style.opacity = isActive ? '1' : '0.5';
}

function resetPodium() {
    updatePodiumItem(1, "No Data", 0, "", false);
    updatePodiumItem(2, "No Data", 0, "", false);
    updatePodiumItem(3, "No Data", 0, "", false);
}


// js/leaderboard.js

// Ensure Firebase is initialized
const db = firebase.firestore(); 

const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';
const CACHE_DURATION_MS = 20 * 60 * 1000; // 20 Minutes Cache

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
    listContainer.innerHTML = '<p style="text-align:center; color: #888; padding-top: 20px;">Updating live ranks...</p>';

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
            const snapshot = await db.collection('users')
                .orderBy('balance', 'desc')
                .limit(100)
                .get();

            leaderboardData = [];
            
            snapshot.forEach(doc => {
                const data = doc.data();
                
                // Hum ab photoURL fetch hi nahi kar rahe, seedha static image lagayenge render ke time.
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
            listContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load ranks.</p>';
        }
    }
}

// --- Renderer Function (Updates UI) ---
function renderHitechLeaderboard(data) {
    const listContainer = document.getElementById('lb-list-render');
    listContainer.innerHTML = ''; // Clear loading text

    if (data.length < 3) {
        listContainer.innerHTML = "<p style='text-align:center; color:#888;'>Not enough players yet!</p>";
        return;
    }

    // --- STATIC IMAGES SETUP ---
    // Top 3 ke liye Special High-Quality Icons
    const IMG_RANK_1 = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png'; // King
    const IMG_RANK_2 = 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'; // Silver
    const IMG_RANK_3 = 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png'; // Bronze
    
    // Rank 4+ ke liye Common Avatar (Aapka Coin image ya Default Avatar)
    const IMG_DEFAULT = 'assets/default_avatar.png'; 

    // --- 1. Update Top 3 Podium (The Kings) ---
    
    // Rank 1
    document.getElementById('p1-name').innerText = data[0].name;
    document.getElementById('p1-score').innerText = formatK(data[0].balance);
    document.getElementById('p1-img').src = IMG_RANK_1;

    // Rank 2
    document.getElementById('p2-name').innerText = data[1].name;
    document.getElementById('p2-score').innerText = formatK(data[1].balance);
    document.getElementById('p2-img').src = IMG_RANK_2;

    // Rank 3
    document.getElementById('p3-name').innerText = data[2].name;
    document.getElementById('p3-score').innerText = formatK(data[2].balance);
    document.getElementById('p3-img').src = IMG_RANK_3;


    // --- 2. Render List (Rank 4 to 100) ---
    for (let i = 3; i < data.length; i++) {
        const user = data[i];
        const rank = i + 1;

        const card = document.createElement('div');
        card.className = 'lb-card';
        // Animation delay for cool effect
        card.style.animation = `fadeInUp 0.5s ease backwards ${i * 0.05}s`;

        // Yahan 'src' mein humne fix 'IMG_DEFAULT' laga diya hai
        card.innerHTML = `
            <span class="lb-rank">#${rank}</span>
            <img src="${IMG_DEFAULT}" class="lb-avatar" alt="user" onerror="this.src='assets/coin_main.jpg'">
            <span class="lb-username">${user.name}</span>
            <span class="lb-coins">${user.balance.toLocaleString()}</span>
        `;
        listContainer.appendChild(card);
    }
}


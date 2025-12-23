/* js/leaderboard.js - REAL-TIME FIREBASE ARENA */

// --- CONFIGURATION ---
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 Minutes
let syncTimerInterval = null;

const AD_PROTOCOL = {
    isAd: true,
    name: "SYSTEM UPGRADE",
    desc: "Speed Boost +20%",
    img: "assets/coin_main.jpg", 
    url: "https://google.com"
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    initLeaderboard();
});

// Expose to window
window.initLeaderboard = function() {
    fetchRealLeaderboard();
    startSyncTimer();
};

// 1. FETCH REAL DATA FROM FIREBASE
async function fetchRealLeaderboard() {
    // Show Loading State (Scan Effect)
    const listContainer = document.getElementById('rank-list-feed');
    if(listContainer) {
        listContainer.innerHTML = `
            <div style="text-align:center; padding:20px; color:#00f3ff; font-family:'Orbitron';">
                <i class="fa-solid fa-satellite-dish fa-spin"></i> SCANNING NETWORK...
            </div>`;
    }

    try {
        // Using window.db from firebase-init.js
        const { collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
        
        // Query Top 50 Players
        const q = query(collection(window.db, "users"), orderBy("balance", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        
        let players = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            players.push({
                id: doc.id,
                name: data.name || "Unknown",
                score: Math.floor(data.balance || 0),
                img: data.profileImg || "assets/default-avatar.png",
                isUser: (window.currentUser && String(window.currentUser.id) === doc.id)
            });
        });

        // Ensure Current User is in the list (even if Rank > 50) locally for display
        if (window.currentUser && !players.find(p => p.isUser)) {
            // If user not in top 50, we handle them in sticky footer separately
        }

        renderArena(players);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        if(listContainer) listContainer.innerHTML = `<div style="text-align:center; color:#ef4444;">CONNECTION ERROR</div>`;
    }
}

// 2. RENDER THE ARENA
function renderArena(allPlayers) {
    // --- A. Render Podium (Top 3) ---
    const top3 = allPlayers.slice(0, 3);
    
    const updatePodium = (rank, player) => {
        if(!player) return; // Empty slot
        document.getElementById(`podium-p${rank}-name`).innerText = player.isUser ? "YOU" : player.name;
        document.getElementById(`podium-p${rank}-score`).innerText = player.score.toLocaleString();
        
        const imgEl = document.getElementById(`podium-p${rank}-img`);
        if(imgEl) imgEl.src = player.img;
        
        // User Highlight Color
        if(player.isUser) {
            document.getElementById(`podium-p${rank}-name`).style.color = "#00f3ff";
            document.getElementById(`podium-p${rank}-score`).style.color = "#00f3ff";
        }
    };

    updatePodium(1, top3[0]);
    updatePodium(2, top3[1]);
    updatePodium(3, top3[2]);

    // --- B. Render List (Rank 4+) ---
    const listContainer = document.getElementById('rank-list-feed');
    listContainer.innerHTML = ''; 

    let listData = allPlayers.slice(3);
    
    // Inject Ad at Index 1 (Visually Rank 5)
    if(listData.length > 0) {
        listData.splice(1, 0, AD_PROTOCOL);
    }

    listData.forEach((player, index) => {
        const visualRank = player.isAd ? '<i class="fa-solid fa-bolt text-gold"></i>' : (index + 4); 
        
        if (player.isAd) {
            // AD CARD
            listContainer.innerHTML += `
            <div class="rank-card native-ad" onclick="window.open('${player.url}', '_blank')">
                <div class="r-pos">${visualRank}</div>
                <img src="${player.img}" class="r-avatar" style="border:1px dashed #ffd700">
                <div class="r-info">
                    <div class="r-name" style="color:#ffd700">${player.name}</div>
                    <div class="r-score">${player.desc}</div>
                </div>
                <button class="btn-boost-ad">BOOST</button>
            </div>`;
        } else {
            // REAL PLAYER CARD
            const isUserClass = player.isUser ? 'user-highlight' : '';
            const nameColor = player.isUser ? '#00f3ff' : '#f1f5f9';
            
            listContainer.innerHTML += `
            <div class="rank-card ${isUserClass}">
                <div class="r-pos">#${visualRank}</div>
                <img src="${player.img}" class="r-avatar">
                <div class="r-info">
                    <div class="r-name" style="color:${nameColor}">${player.isUser ? "YOU" : player.name}</div>
                    <div class="r-score">${player.score.toLocaleString()}</div>
                </div>
            </div>`;
        }
    });

    // --- C. Update Sticky Footer ---
    updateStickyFooter(allPlayers);
}

function updateStickyFooter(allPlayers) {
    if(!window.currentUser) return;

    // Find User Rank
    const userIndex = allPlayers.findIndex(p => p.isUser);
    let rankText = "50+";
    let gapText = "KEEP GRINDING";
    let myScore = window.currentUser.balance;

    if (userIndex !== -1) {
        rankText = `#${userIndex + 1}`;
        if (userIndex > 0) {
            const playerAbove = allPlayers[userIndex - 1];
            const gap = playerAbove.score - myScore;
            gapText = `+${Math.floor(gap).toLocaleString()} TO RANK #${userIndex}`;
        } else {
             gapText = "BOSS OF THE ARENA";
        }
    } else {
        // User is outside top 50, calculate gap to Rank 50
        if(allPlayers.length > 0) {
            const lastPlayer = allPlayers[allPlayers.length - 1];
            const gap = lastPlayer.score - myScore;
            gapText = `+${Math.floor(gap).toLocaleString()} TO ENTER TOP 50`;
        }
    }

    // Update DOM
    document.getElementById('sticky-user-img').src = localStorage.getItem('user_avatar') || "assets/default-avatar.png";
    document.getElementById('my-rank-val').innerText = rankText;
    document.getElementById('gap-val').innerText = gapText;
}

// 3. SYNC TIMER (5 Minutes)
function startSyncTimer() {
    if(syncTimerInterval) clearInterval(syncTimerInterval);

    let secondsLeft = 300; // 5 mins
    const timerEl = document.getElementById('sync-countdown');
    
    syncTimerInterval = setInterval(() => {
        secondsLeft--;
        
        // Format Time 00:00
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        if(timerEl) timerEl.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;

        if (secondsLeft <= 0) {
            fetchRealLeaderboard(); // Auto Refresh
            secondsLeft = 300; // Reset
        }
    }, 1000);
}

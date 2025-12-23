/* js/leaderboard.js - ROBUST REAL-TIME ARENA */

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
    waitForFirebase(); // 🔥 NEW: Wait logic added
    startSyncTimer();
};

// --- 🔥 WAIT FOR FIREBASE TO BE READY ---
function waitForFirebase() {
    const listContainer = document.getElementById('rank-list-feed');
    
    // Check if window.db exists
    if (window.db) {
        // Database is ready! Fetch data.
        fetchRealLeaderboard();
    } else {
        // Not ready yet. Show Loading... and retry in 500ms
        if(listContainer) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; color:#64748b; font-family:'Orbitron'; font-size: 12px;">
                    <i class="fa-solid fa-circle-notch fa-spin text-cyan"></i> ESTABLISHING LINK...
                </div>`;
        }
        setTimeout(waitForFirebase, 1000); // Retry after 1 second
    }
}

// 1. FETCH REAL DATA FROM FIREBASE
async function fetchRealLeaderboard() {
    const listContainer = document.getElementById('rank-list-feed');

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

        // Agar Database Khali hai (0 Users)
        if (players.length === 0) {
            if(listContainer) listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#aaa;">No Players Found. Be the first!</div>`;
            return;
        }

        renderArena(players);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        // Only show error if container exists
        if(listContainer) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; border:1px solid #330000; background: rgba(50,0,0,0.5); border-radius: 8px;">
                    <div style="color:#ef4444; font-weight:bold; margin-bottom:5px;">CONNECTION ERROR</div>
                    <div style="color:#999; font-size:10px;">Check Firebase Rules or Internet</div>
                </div>`;
        }
    }
}

// 2. RENDER THE ARENA
function renderArena(allPlayers) {
    // --- A. Render Podium (Top 3) ---
    // Safe check if less than 3 players exist
    const top3 = allPlayers.slice(0, 3);
    
    const updatePodium = (rank, player) => {
        const nameEl = document.getElementById(`podium-p${rank}-name`);
        const scoreEl = document.getElementById(`podium-p${rank}-score`);
        const imgEl = document.getElementById(`podium-p${rank}-img`);

        if(!player) {
            // Empty State if no player for this rank
            if(nameEl) nameEl.innerText = "--";
            if(scoreEl) scoreEl.innerText = "0";
            return;
        } 
        
        if(nameEl) {
            nameEl.innerText = player.isUser ? "YOU" : player.name;
            // Highlight User
            nameEl.style.color = player.isUser ? "#00f3ff" : (rank === 1 ? "#ffd700" : "#cbd5e1");
        }
        
        if(scoreEl) {
            scoreEl.innerText = player.score.toLocaleString();
            scoreEl.style.color = player.isUser ? "#00f3ff" : (rank === 1 ? "#ffd700" : "#64748b");
        }
        
        if(imgEl) imgEl.src = player.img;
    };

    updatePodium(1, top3[0]);
    updatePodium(2, top3[1]);
    updatePodium(3, top3[2]);

    // --- B. Render List (Rank 4+) ---
    const listContainer = document.getElementById('rank-list-feed');
    if(listContainer) {
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
    }

    // --- C. Update Sticky Footer ---
    updateStickyFooter(allPlayers);
}

function updateStickyFooter(allPlayers) {
    if(!window.currentUser) return;

    // Find User Rank
    const userIndex = allPlayers.findIndex(p => p.isUser);
    let rankText = "50+";
    let gapText = "KEEP GRINDING";
    let myScore = window.currentUser.balance || 0;

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
        // User is outside top 50
        if(allPlayers.length > 0) {
            const lastPlayer = allPlayers[allPlayers.length - 1];
            const gap = lastPlayer.score - myScore;
            gapText = `+${Math.floor(gap).toLocaleString()} TO ENTER TOP 50`;
        }
    }

    // Update DOM
    const stickyImg = document.getElementById('sticky-user-img');
    const myRankEl = document.getElementById('my-rank-val');
    const gapEl = document.getElementById('gap-val');

    if(stickyImg) stickyImg.src = localStorage.getItem('user_avatar') || "assets/default-avatar.png";
    if(myRankEl) myRankEl.innerText = rankText;
    if(gapEl) gapEl.innerText = gapText;
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
            // Auto Refresh: Check DB connection again before fetching
            if(window.db) fetchRealLeaderboard(); 
            secondsLeft = 300; // Reset
        }
    }, 1000);
}

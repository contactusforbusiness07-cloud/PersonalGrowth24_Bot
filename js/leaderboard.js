/* js/leaderboard.js - LEADERBOARD WITH NATIVE-STYLE ADS */

// --- CONFIGURATION ---
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 Minutes
let syncTimerInterval = null;

// 🔥 NATIVE AD CONFIGURATION (Camouflaged as Players)
// Inhe hum list ke beech me insert karenge
const AD_INJECTIONS = [
    {
        rankPosition: 4,  // 4th rank ke baad dikhega
        name: "Premium Member",
        desc: "Tap to Claim Bonus",
        img: "assets/coin_main.jpg.png", // Game coin icon use karenge trust ke liye
        url: "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a" // Smartlink
    },
    {
        rankPosition: 15, // 15th rank ke baad
        name: "System Update",
        desc: "Boost Mining Speed",
        img: "https://cdn-icons-png.flaticon.com/512/6001/6001368.png", 
        url: "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

window.initLeaderboard = function() {
    waitForFirebase();
    startSyncTimer();
};

function waitForFirebase() {
    const listContainer = document.getElementById('rank-list-feed');
    if (window.db) {
        fetchRealLeaderboard();
    } else {
        if(listContainer) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; color:#64748b; font-family:'Orbitron'; font-size: 12px;">
                    <i class="fa-solid fa-circle-notch fa-spin text-cyan"></i> SYNCING DATA...
                </div>`;
        }
        setTimeout(waitForFirebase, 1000);
    }
}

// 1. FETCH DATA
async function fetchRealLeaderboard() {
    const listContainer = document.getElementById('rank-list-feed');

    try {
        const { collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
        
        const q = query(collection(window.db, "users"), orderBy("balance", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        
        let players = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const isCurrentUser = (window.currentUser && String(window.currentUser.id) === doc.id);
            
            let displayScore = Math.floor(data.balance || 0);
            if (isCurrentUser) {
                const localBal = parseFloat(localStorage.getItem('local_balance'));
                if (!isNaN(localBal)) displayScore = Math.floor(localBal);
            }

            players.push({
                id: doc.id,
                name: data.name || "Unknown",
                score: displayScore,
                img: data.profileImg || "assets/default-avatar.png",
                isUser: isCurrentUser
            });
        });

        if (players.length === 0) {
            if(listContainer) listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#aaa;">No Players Found.</div>`;
            return;
        }

        renderArena(players);

    } catch (error) {
        console.error("Leaderboard Error:", error);
    }
}

// 2. RENDER ARENA (Mixed Players + Ads)
function renderArena(allPlayers) {
    // A. Podium (Top 3) - No Ads Here
    const top3 = allPlayers.slice(0, 3);
    updatePodium(1, top3[0]);
    updatePodium(2, top3[1]);
    updatePodium(3, top3[2]);

    // B. List (Rank 4+)
    const listContainer = document.getElementById('rank-list-feed');
    if(listContainer) {
        listContainer.innerHTML = ''; 
        
        // 🟢 1. Inject Ads into Player List
        // Hum asli list ko copy karenge taaki original data kharab na ho
        let renderList = [];
        let playerIndex = 3; // Start from Rank 4
        
        // Loop through remaining players
        for(let i=3; i<allPlayers.length; i++) {
            renderList.push({ type: 'player', data: allPlayers[i], rank: i+1 });
        }

        // Insert Ads at fixed positions
        AD_INJECTIONS.forEach(ad => {
            if (renderList.length >= ad.rankPosition) {
                // Array splice se beech me ghusa rahe hain
                renderList.splice(ad.rankPosition, 0, { type: 'ad', data: ad });
            }
        });

        // 🟢 2. Render HTML
        renderList.forEach(item => {
            if (item.type === 'ad') {
                // --- AD RENDER (LOOKS LIKE PLAYER) ---
                const ad = item.data;
                listContainer.innerHTML += `
                <div class="rank-card ad-row" onclick="window.open('${ad.url}', '_blank')" 
                     style="border: 1px solid rgba(255, 215, 0, 0.3); background: rgba(255, 215, 0, 0.05);">
                    
                    <div class="r-pos" style="color: #ffd700;"><i class="fa-solid fa-bolt"></i></div>
                    
                    <img src="${ad.img}" class="r-avatar" style="border: 1px solid #ffd700;">
                    
                    <div class="r-info">
                        <div class="r-name" style="color: #ffd700; font-weight:bold;">${ad.name} <span style="font-size:8px; background:#ffd700; color:black; padding:1px 4px; border-radius:4px; margin-left:5px;">AD</span></div>
                        <div class="r-score" style="color: #aaa; font-size:10px;">${ad.desc}</div>
                    </div>
                    
                    <button style="background: linear-gradient(45deg, #ffd700, #b45309); border:none; color:black; font-weight:bold; font-size:10px; padding: 5px 10px; border-radius:20px; cursor:pointer;">
                        OPEN
                    </button>
                </div>`;
            } else {
                // --- PLAYER RENDER ---
                const p = item.data;
                const isUserClass = p.isUser ? 'user-highlight' : '';
                const nameColor = p.isUser ? '#00f3ff' : '#f1f5f9';
                
                listContainer.innerHTML += `
                <div class="rank-card ${isUserClass}">
                    <div class="r-pos">#${item.rank}</div>
                    <img src="${p.img}" class="r-avatar">
                    <div class="r-info">
                        <div class="r-name" style="color:${nameColor}">${p.isUser ? "YOU" : p.name}</div>
                        <div class="r-score">${p.score.toLocaleString()}</div>
                    </div>
                </div>`;
            }
        });
    }

    updateStickyFooter(allPlayers);
}

function updatePodium(rank, player) {
    const nameEl = document.getElementById(`podium-p${rank}-name`);
    const scoreEl = document.getElementById(`podium-p${rank}-score`);
    const imgEl = document.getElementById(`podium-p${rank}-img`);

    if(!player) {
        if(nameEl) nameEl.innerText = "--";
        if(scoreEl) scoreEl.innerText = "0";
        return;
    } 
    
    if(nameEl) {
        nameEl.innerText = player.isUser ? "YOU" : player.name;
        nameEl.style.color = player.isUser ? "#00f3ff" : (rank === 1 ? "#ffd700" : "#cbd5e1");
    }
    
    if(scoreEl) scoreEl.innerText = player.score.toLocaleString();
    if(imgEl) imgEl.src = player.img;
}

function updateStickyFooter(allPlayers) {
    if(!window.currentUser) return;
    let myScore = parseFloat(localStorage.getItem('local_balance')) || window.currentUser.balance || 0;
    const userIndex = allPlayers.findIndex(p => String(p.id) === String(window.currentUser.id));
    
    let rankText = "100+";
    let gapText = "KEEP GRINDING";

    if (userIndex !== -1) {
        rankText = `#${userIndex + 1}`;
        if (userIndex > 0) {
            const gap = allPlayers[userIndex - 1].score - myScore;
            gapText = gap > 0 ? `+${Math.floor(gap).toLocaleString()} TO RANK #${userIndex}` : "ALMOST THERE!";
        } else {
             gapText = "BOSS OF THE ARENA";
        }
    }

    const stickyImg = document.getElementById('sticky-user-img');
    const myRankEl = document.getElementById('my-rank-val');
    const gapEl = document.getElementById('gap-val');

    if(stickyImg) stickyImg.src = localStorage.getItem('user_avatar') || "assets/default-avatar.png";
    if(myRankEl) myRankEl.innerText = rankText;
    if(gapEl) gapEl.innerText = gapText;
}

function startSyncTimer() {
    if(syncTimerInterval) clearInterval(syncTimerInterval);
    let secondsLeft = 300;
    const timerEl = document.getElementById('sync-countdown');
    
    syncTimerInterval = setInterval(() => {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        if(timerEl) timerEl.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        if (secondsLeft <= 0) {
            if(window.db) fetchRealLeaderboard(); 
            secondsLeft = 300;
        }
    }, 1000);
}


/* js/leaderboard.js - ULTIMATE ARENA (SYNCED + 100 RANKS + MULTI-ADS) */

// --- CONFIGURATION ---
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 Minutes
let syncTimerInterval = null;

// 🔥 MULTIPLE ADS CONFIGURATION
const AD_PROTOCOLS = [
    {
        id: 'ad_1',
        rankPosition: 4, // Shows visually at Rank 5
        name: "SYSTEM UPGRADE",
        desc: "Speed Boost +20%",
        img: "assets/coin_main.jpg", 
        url: "https://google.com"
    },
    {
        id: 'ad_2',
        rankPosition: 19, // Shows visually at Rank 20
        name: "CRYPTO SIGNAL",
        desc: "Join VIP Channel",
        img: "https://cdn-icons-png.flaticon.com/512/6001/6001368.png", 
        url: "https://t.me/The_EnglishRoom5"
    },
    {
        id: 'ad_3',
        rankPosition: 49, // Shows visually at Rank 50
        name: "SECRET VAULT",
        desc: "Claim 5000 Bonus",
        img: "https://cdn-icons-png.flaticon.com/512/9326/9326967.png", 
        url: "https://binance.com"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

window.initLeaderboard = function() {
    waitForFirebase();
    startSyncTimer();
};

// --- 🔥 WAIT FOR FIREBASE (Fixes Connection Error) ---
function waitForFirebase() {
    const listContainer = document.getElementById('rank-list-feed');
    
    // Check global db connection
    if (window.db) {
        fetchRealLeaderboard();
    } else {
        if(listContainer) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; color:#64748b; font-family:'Orbitron'; font-size: 12px;">
                    <i class="fa-solid fa-circle-notch fa-spin text-cyan"></i> ESTABLISHING LINK...
                </div>`;
        }
        setTimeout(waitForFirebase, 1000); // Retry every 1 sec
    }
}

// 1. FETCH REAL DATA (Limit 100)
async function fetchRealLeaderboard() {
    const listContainer = document.getElementById('rank-list-feed');

    try {
        const { collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
        
        // 🔥 QUERY LIMIT INCREASED TO 100
        const q = query(collection(window.db, "users"), orderBy("balance", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        
        let players = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Check if this is the current user
            const isCurrentUser = (window.currentUser && String(window.currentUser.id) === doc.id);
            
            // 🔥 INSTANT SYNC LOGIC:
            // Agar ye current user hai, to Server ka balance ignore karke
            // LocalStorage ka balance use karo. Isse Header aur Leaderboard same dikhenge.
            let displayScore = Math.floor(data.balance || 0);
            if (isCurrentUser) {
                const localBal = parseFloat(localStorage.getItem('local_balance'));
                if (!isNaN(localBal)) {
                    displayScore = Math.floor(localBal);
                }
            }

            players.push({
                id: doc.id,
                name: data.name || "Unknown",
                score: displayScore, // Synced Score
                img: data.profileImg || "assets/default-avatar.png",
                isUser: isCurrentUser
            });
        });

        if (players.length === 0) {
            if(listContainer) listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#aaa;">No Players Found. Be the first!</div>`;
            return;
        }

        // Agar current user Top 100 me nahi hai, fir bhi UI ke liye logic handle karenge sticky footer me
        renderArena(players);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        if(listContainer) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; border:1px solid #330000; background: rgba(50,0,0,0.5); border-radius: 8px;">
                    <div style="color:#ef4444; font-weight:bold; margin-bottom:5px;">CONNECTION ERROR</div>
                    <div style="color:#999; font-size:10px;">Retrying...</div>
                </div>`;
        }
    }
}

// 2. RENDER ARENA (With Multi-Ads)
function renderArena(allPlayers) {
    // --- A. Render Podium (Top 3) ---
    const top3 = allPlayers.slice(0, 3);
    
    const updatePodium = (rank, player) => {
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
        
        if(scoreEl) {
            scoreEl.innerText = player.score.toLocaleString();
            scoreEl.style.color = player.isUser ? "#00f3ff" : (rank === 1 ? "#ffd700" : "#64748b");
        }
        
        if(imgEl) imgEl.src = player.img;
    };

    updatePodium(1, top3[0]);
    updatePodium(2, top3[1]);
    updatePodium(3, top3[2]);

    // --- B. Render List (Rank 4 to 100) ---
    const listContainer = document.getElementById('rank-list-feed');
    if(listContainer) {
        listContainer.innerHTML = ''; 

        // Clone list to avoid modifying original array references
        let listData = [...allPlayers.slice(3)]; 
        let finalRenderList = [];
        
        // 1. Build List with Players
        listData.forEach((p, i) => {
            finalRenderList.push({ ...p, type: 'player', originalIndex: i + 3 });
        });

        // 2. Inject Ads at specific positions
        AD_PROTOCOLS.forEach(ad => {
            if (finalRenderList.length >= ad.rankPosition) {
                finalRenderList.splice(ad.rankPosition, 0, { ...ad, type: 'ad' });
            }
        });

        // 3. Generate HTML
        finalRenderList.forEach((item, index) => {
            // Rank Calculation (Adjust for inserted ads)
            // Hum bas visual loop index use karenge list ke liye + 4 (kyunki top 3 podium pe hain)
            // Lekin Ads ko rank number nahi denge.
            
            if (item.type === 'ad') {
                // --- RENDER AD ---
                listContainer.innerHTML += `
                <div class="rank-card native-ad" onclick="window.open('${item.url}', '_blank')">
                    <div class="r-pos"><i class="fa-solid fa-bolt text-gold"></i></div>
                    <img src="${item.img}" class="r-avatar" style="border:1px dashed #ffd700" onerror="this.src='assets/coin_main.jpg'">
                    <div class="r-info">
                        <div class="r-name" style="color:#ffd700">${item.name}</div>
                        <div class="r-score">${item.desc}</div>
                    </div>
                    <button class="btn-boost-ad">BOOST</button>
                </div>`;
            } else {
                // --- RENDER PLAYER ---
                // Calculate actual rank: The item stores its original index from the sorted array
                const realRank = item.originalIndex + 1;
                const isUserClass = item.isUser ? 'user-highlight' : '';
                const nameColor = item.isUser ? '#00f3ff' : '#f1f5f9';
                
                listContainer.innerHTML += `
                <div class="rank-card ${isUserClass}">
                    <div class="r-pos">#${realRank}</div>
                    <img src="${item.img}" class="r-avatar">
                    <div class="r-info">
                        <div class="r-name" style="color:${nameColor}">${item.isUser ? "YOU" : item.name}</div>
                        <div class="r-score">${item.score.toLocaleString()}</div>
                    </div>
                </div>`;
            }
        });
    }

    // --- C. Update Sticky Footer ---
    updateStickyFooter(allPlayers);
}

// 3. STICKY FOOTER (User Stats)
function updateStickyFooter(allPlayers) {
    if(!window.currentUser) return;

    // 🔥 SYNC LOCAL BALANCE HERE TOO
    let myScore = parseFloat(localStorage.getItem('local_balance')) || window.currentUser.balance || 0;
    
    // Find User in the fetched list to determine Rank
    // Note: We match by ID because scores might differ slightly if sync is pending
    const userIndex = allPlayers.findIndex(p => String(p.id) === String(window.currentUser.id));
    
    let rankText = "100+";
    let gapText = "KEEP GRINDING";

    if (userIndex !== -1) {
        rankText = `#${userIndex + 1}`;
        if (userIndex > 0) {
            const playerAbove = allPlayers[userIndex - 1];
            const gap = playerAbove.score - myScore;
            // Agar gap negative hai (matlab humne just overtake kiya par list refresh nahi hui), to 0 dikhao
            gapText = gap > 0 ? `+${Math.floor(gap).toLocaleString()} TO RANK #${userIndex}` : "ALMOST THERE!";
        } else {
             gapText = "BOSS OF THE ARENA";
        }
    } else {
        // User outside Top 100
        if(allPlayers.length > 0) {
            const lastPlayer = allPlayers[allPlayers.length - 1];
            const gap = lastPlayer.score - myScore;
            gapText = `+${Math.floor(gap).toLocaleString()} TO ENTER TOP 100`;
        }
    }

    // DOM Updates
    const stickyImg = document.getElementById('sticky-user-img');
    const myRankEl = document.getElementById('my-rank-val');
    const gapEl = document.getElementById('gap-val');

    if(stickyImg) stickyImg.src = localStorage.getItem('user_avatar') || "assets/default-avatar.png";
    if(myRankEl) myRankEl.innerText = rankText;
    if(gapEl) gapEl.innerText = gapText;
}

// 4. TIMER LOGIC
function startSyncTimer() {
    if(syncTimerInterval) clearInterval(syncTimerInterval);

    let secondsLeft = 300; // 5 mins
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

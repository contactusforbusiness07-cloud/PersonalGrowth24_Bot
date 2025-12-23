/* js/leaderboard.js - NEON NEXUS ARENA ENGINE */

// 1. DATA CONFIGURATION
const MOCK_BOTS = [
    { name: "CryptoViper", score: 98500, img: "assets/avatars/1.png" },
    { name: "NeonGhost", score: 89200, img: "assets/avatars/2.png" },
    { name: "AlphaWolf", score: 81000, img: "assets/avatars/3.png" },
    { name: "Satoshi_V2", score: 76500, img: "assets/avatars/4.png" },
    { name: "PixelHunter", score: 72000, img: "assets/avatars/5.png" },
    { name: "VoidWalker", score: 65400, img: "assets/avatars/6.png" },
    { name: "Quantum_X", score: 61000, img: "assets/avatars/7.png" },
    { name: "CyberNinja", score: 55800, img: "assets/avatars/8.png" },
    { name: "BlockMaster", score: 49000, img: "assets/avatars/2.png" },
    { name: "MoonRover", score: 42000, img: "assets/avatars/3.png" }
];

const AD_PROTOCOL = {
    isAd: true,
    name: "SYSTEM UPGRADE",
    desc: "Speed Boost +20%",
    img: "assets/coin_main.jpg", // Uses coin image as system icon
    url: "https://google.com"
};

let allPlayers = [];
let liveInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

// Expose to window so navigation can trigger it
window.initLeaderboard = function() {
    buildData();
    renderArena();
    startLiveEnvironment();
};

// 2. DATA BUILDER (Merge User + Bots)
function buildData() {
    // A. Get Real User Data
    // We check multiple sources for robustness
    let userProfile = JSON.parse(localStorage.getItem('finGameProfile')) || {};
    let userName = localStorage.getItem('user_name') || userProfile.name || "You";
    let userImg = localStorage.getItem('user_avatar') || userProfile.image || "assets/default-avatar.png";
    let userScore = parseFloat(localStorage.getItem('local_balance')) || 0;

    const realUser = {
        name: userName,
        score: Math.floor(userScore),
        img: userImg,
        isUser: true
    };

    // B. Merge & Sort
    allPlayers = [...MOCK_BOTS, realUser];
    allPlayers.sort((a, b) => b.score - a.score);
}

// 3. RENDER FUNCTION
function renderArena() {
    // --- A. Render Podium (Top 3) ---
    const top3 = allPlayers.slice(0, 3);
    
    // Helper to safely update podium
    const updatePodium = (rank, player) => {
        if(!player) return;
        document.getElementById(`podium-p${rank}-name`).innerText = player.isUser ? "YOU" : player.name;
        document.getElementById(`podium-p${rank}-score`).innerText = player.score.toLocaleString();
        const imgEl = document.getElementById(`podium-p${rank}-img`);
        if(imgEl) imgEl.src = player.img;
        
        // Highlight if user is on podium
        if(player.isUser) {
            document.getElementById(`podium-p${rank}-name`).style.color = "#00f3ff";
        }
    };

    updatePodium(1, top3[0]);
    updatePodium(2, top3[1]);
    updatePodium(3, top3[2]);

    // --- B. Render List (Rank 4+) ---
    const listContainer = document.getElementById('rank-list-feed');
    listContainer.innerHTML = ''; // Clear

    let listData = allPlayers.slice(3);
    
    // Inject Ad disguised as Rank #5 (Index 1 in this sliced list)
    // We insert it visually, but don't mess up the rank calculation logic too much
    listData.splice(1, 0, AD_PROTOCOL);

    listData.forEach((player, index) => {
        // Calculate Real Rank (Offset by 3 podium spots + index + 1)
        // If it's an ad, we give it a fake symbol
        const visualRank = player.isAd ? '<i class="fa-solid fa-bolt text-gold"></i>' : (index + 4); 
        
        if (player.isAd) {
            // RENDER AD CARD
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
            // RENDER PLAYER CARD
            const isUserClass = player.isUser ? 'user-highlight' : '';
            const nameColor = player.isUser ? '#00f3ff' : '#f1f5f9';
            
            listContainer.innerHTML += `
            <div class="rank-card ${isUserClass}">
                <div class="r-pos">#${visualRank}</div>
                <img src="${player.img}" class="r-avatar">
                <div class="r-info">
                    <div class="r-name" style="color:${nameColor}">${player.name}</div>
                    <div class="r-score">${player.score.toLocaleString()}</div>
                </div>
            </div>`;
        }
    });

    // --- C. Update Sticky Footer ---
    updateStickyFooter();
}

function updateStickyFooter() {
    // Find User in the sorted list
    const userIndex = allPlayers.findIndex(p => p.isUser);
    const user = allPlayers[userIndex];
    const rank = userIndex + 1;

    // Update Footer visuals
    document.getElementById('sticky-user-img').src = user.img;
    document.getElementById('my-rank-val').innerText = `#${rank}`;
    
    // Calculate Gap
    const gapEl = document.getElementById('gap-val');
    if (rank === 1) {
        gapEl.innerText = "BOSS OF THE ARENA";
        gapEl.style.color = "#ffd700";
    } else {
        const playerAbove = allPlayers[userIndex - 1];
        const gap = playerAbove.score - user.score;
        gapEl.innerText = `+${gap.toLocaleString()} TO RANK #${rank-1}`;
        gapEl.style.color = "#94a3b8";
    }
}

// 4. LIVE ENVIRONMENT SIMULATION
function startLiveEnvironment() {
    if(liveInterval) clearInterval(liveInterval);

    liveInterval = setInterval(() => {
        // 1. Randomly boost a few bots
        MOCK_BOTS.forEach(bot => {
            if(Math.random() > 0.7) {
                bot.score += Math.floor(Math.random() * 150);
            }
        });

        // 2. Re-sort & Re-render
        // Note: In a real heavy app, we'd update DOM elements individually. 
        // Here, re-running buildData() preserves the user's latest score from local storage too.
        buildData();
        renderArena();

    }, 3500); // Update every 3.5 seconds
}

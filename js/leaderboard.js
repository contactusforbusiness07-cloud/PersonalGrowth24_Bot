/* js/leaderboard.js - LIVE ARENA ENGINE */

// 1. MOCK DATA (The Players)
const players = [
    { name: "CyberKing", score: 95400, img: "assets/avatars/1.png" },
    { name: "CryptoViper", score: 88200, img: "assets/avatars/2.png" },
    { name: "NeonGhost", score: 81000, img: "assets/avatars/3.png" },
    { name: "AlphaWolf", score: 76500, img: "assets/avatars/4.png" },
    { name: "Satoshi_V2", score: 72100, img: "assets/avatars/5.png" },
    { name: "PixelHunter", score: 68900, img: "assets/avatars/6.png" },
    { name: "VoidWalker", score: 65400, img: "assets/avatars/7.png" },
    { name: "Quantum_X", score: 61000, img: "assets/avatars/8.png" },
];

// 2. NATIVE AD CONFIG (The "Challengers")
const nativeAds = [
    {
        name: "SYSTEM UPGRADE",
        desc: "Boost Mining Speed +20%",
        img: "assets/icons/rocket.png", // Use a generic icon
        url: "https://google.com",
        isAd: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

function initLeaderboard() {
    renderArena();
    startLiveUpdates();
}

function renderArena() {
    // 1. Sort Players
    players.sort((a, b) => b.score - a.score);

    // 2. Render Podium (Top 3)
    const top3 = players.slice(0, 3);
    document.getElementById('podium-p1-name').innerText = top3[0].name;
    document.getElementById('podium-p1-score').innerText = top3[0].score.toLocaleString();
    
    document.getElementById('podium-p2-name').innerText = top3[1].name;
    document.getElementById('podium-p2-score').innerText = top3[1].score.toLocaleString();
    
    document.getElementById('podium-p3-name').innerText = top3[2].name;
    document.getElementById('podium-p3-score').innerText = top3[2].score.toLocaleString();

    // 3. Render List (Rest) + Inject Ad
    const listContainer = document.getElementById('rank-list-feed');
    listContainer.innerHTML = ''; // Clear

    let displayList = players.slice(3);
    
    // INJECT AD at Position 2 (Visually Rank 5/6)
    // This makes it look like a high-ranking player
    displayList.splice(1, 0, nativeAds[0]);

    displayList.forEach((item, index) => {
        const realRank = index + 4; // Starting from 4
        
        let cardHTML = '';

        if(item.isAd) {
            // NATIVE AD CARD (Looks like a player)
            cardHTML = `
                <div class="rank-card native-ad" onclick="window.open('${item.url}', '_blank')">
                    <div class="r-pos"><i class="fa-solid fa-bolt"></i></div>
                    <img src="${item.img}" class="r-avatar" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1665/1665731.png'">
                    <div class="r-info">
                        <div class="r-name" style="color:var(--arena-purple)">${item.name}</div>
                        <div class="r-score">${item.desc}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:#fff; opacity:0.5; font-size:12px;"></i>
                </div>
            `;
        } else {
            // NORMAL PLAYER CARD
            cardHTML = `
                <div class="rank-card">
                    <div class="r-pos">#${realRank}</div>
                    <img src="${item.img}" class="r-avatar" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'">
                    <div class="r-info">
                        <div class="r-name">${item.name}</div>
                        <div class="r-score">${item.score.toLocaleString()} PTS</div>
                    </div>
                </div>
            `;
        }
        listContainer.innerHTML += cardHTML;
    });

    // 4. Update User Sticky Footer
    updateUserSticky(players[6]); // Simulating user is Rank 7
}

function updateUserSticky(userData) {
    const gap = players[5].score - userData.score; // Gap to next rank
    document.getElementById('my-rank-val').innerText = "#" + (players.indexOf(userData) + 1);
    document.getElementById('gap-val').innerText = `+${gap.toLocaleString()} to overtake`;
}

// SIMULATE LIVE DATA
function startLiveUpdates() {
    setInterval(() => {
        // Randomly add points to top 3 to make them "fight"
        players[0].score += Math.floor(Math.random() * 50);
        players[1].score += Math.floor(Math.random() * 80); // Rank 2 catches up
        
        // Re-render only text to avoid flickering, or full re-render for sorting
        // For smoothness, we update text directly here
        document.getElementById('podium-p1-score').innerText = players[0].score.toLocaleString();
        document.getElementById('podium-p2-score').innerText = players[1].score.toLocaleString();
        
    }, 2000);
}


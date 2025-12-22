// arena.js

// 1. MOCK USER DATA (The "Real" Players)
let users = [
    { id: 'u1', name: 'CyberWolf', score: 95020, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 'u2', name: 'PixelHunt_x', score: 88400, avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 'u3', name: 'NeonSamurai', score: 82100, avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 'u4', name: 'CryptoWraith', score: 75000, avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 'u5', name: 'StarGlider', score: 69500, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 'u6', name: 'QuantumKate', score: 62000, avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: 'u7', name: 'Vector_Zero', score: 58000, avatar: 'https://i.pravatar.cc/150?img=7' },
];

// 2. NATIVE AD CONFIGURATION (The "System Challengers")
// Designed to share the EXACT same data structure as users
const nativeAds = [
    {
        id: 'ad1',
        isAd: true,
        name: 'SYSTEM CHALLENGER',
        avatar: 'https://cdn-icons-png.flaticon.com/512/9647/9647221.png', // AI icon
        ctaText: 'ENGAGE BOOST',
        ctaUrl: 'https://google.com' // Replace with actual ad link
    },
    {
        id: 'ad2',
        isAd: true,
        name: 'NEXUS EVENT',
        avatar: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', // Event icon
        ctaText: 'JOIN PROTOCOL',
        ctaUrl: 'https://bing.com'
    }
];

// 3. THE RENDERING ENGINE
const arenaStage = document.getElementById('arena-stage');

function renderArena() {
    // Sort users by score desc
    users.sort((a, b) => b.score - a.score);

    // Combine users and ads for rendering
    let displayList = [...users];

    // INVISIBLE AD INJECTION:
    // Insert ads at specific "rank positions" so they feel natural.
    // E.g., Insert an ad at position 3 (after top 3) and position 7.
    displayList.splice(3, 0, nativeAds[0]);
    displayList.splice(7, 0, nativeAds[1]);
    // Slice to keep the arena clean (e.g., top 9 nodes total)
    displayList = displayList.slice(0, 9);

    arenaStage.innerHTML = ''; // Clear current stage

    displayList.forEach((node, index) => {
        const rank = index + 1;
        const isAlpha = rank === 1;
        const isAd = node.isAd;

        // Determine classes based on node type
        let nodeClasses = `arena-node rank-pos-${rank}`;
        if (isAlpha && !isAd) nodeClasses += ' alpha-rank';
        if (isAd) nodeClasses += ' system-challenger';

        // Dynamic HTML generation based on whether it's a user or an ad
        let nodeHTML = `
            <div class="${nodeClasses}" style="z-index: ${100 - rank}">
                ${isAlpha && !isAd ? '<div class="crown-holo"><i class="fa-solid fa-crown"></i></div><div class="alpha-aura"></div>' : ''}
                
                <div class="node-ring-container">
                    <div class="energy-ring"></div>
                    <div class="avatar-core">
                        <img src="${node.avatar}" alt="${node.name}">
                    </div>
                </div>

                <div class="node-data">
                    ${!isAd ? `<div class="rank-badge">RANK ${rank}</div>` : ''}
                    <div class="user-name">${node.name}</div>
                    
                    ${isAd ? 
                        `<button class="boost-btn" onclick="window.open('${node.ctaUrl}')">${node.ctaText}</button>` : 
                        `<div class="user-score">${node.score.toLocaleString()}</div>`
                    }
                </div>
            </div>
        `;
        
        arenaStage.innerHTML += nodeHTML;
    });
}


// 4. LIVE SIMULATION LOOP
// Randomly update scores to show live movement and re-render
function simulateLiveActivity() {
    users.forEach(user => {
        // Random score fluctuation (+/- 500 points)
        const change = Math.floor(Math.random() * 1000) - 500;
        user.score = Math.max(0, user.score + change); // Ensure score isn't negative
    });
    renderArena();
    resetSyncTimer();
}

// Update timer visual
function resetSyncTimer() {
    let sec = 5;
    const timerEl = document.getElementById('sync-timer');
    const countdown = setInterval(() => {
        sec--;
        timerEl.innerText = `00:0${sec}`;
        if(sec <= 0) clearInterval(countdown);
    }, 1000);
}

// Initialize
renderArena();
resetSyncTimer();

// Start the live simulation every 5 seconds
setInterval(simulateLiveActivity, 5000);

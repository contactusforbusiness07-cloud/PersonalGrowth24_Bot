document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

function initLeaderboard() {
    startCountdown();
    generateList();
}

// --- 1. COUNTDOWN TIMER ---
function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    // Set target to next midnight
    let now = new Date();
    let midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    setInterval(() => {
        let currentTime = new Date().getTime();
        let distance = midnight - currentTime;
        
        // Time calculations
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timerElement.innerHTML = 
            (hours < 10 ? "0" + hours : hours) + ":" + 
            (minutes < 10 ? "0" + minutes : minutes) + ":" + 
            (seconds < 10 ? "0" + seconds : seconds);
            
    }, 1000);
}

// --- 2. GENERATE RANK LIST ---
function generateList() {
    const listContainer = document.getElementById('lb-list-container');
    listContainer.innerHTML = ''; // Clear loading spinner
    
    // Generate 20 Dummy Users starting from Rank 4
    let startCoins = 62000;
    
    for(let i = 4; i <= 20; i++) {
        // Decrease coins randomly to look real
        startCoins -= Math.floor(Math.random() * 2000) + 500;
        
        const row = document.createElement('div');
        row.className = 'lb-row';
        row.innerHTML = `
            <div class="lb-left">
                <div class="lb-rank">#${i}</div>
                <img src="https://i.pravatar.cc/150?img=${i + 10}" class="lb-avatar-small">
                <div class="lb-username">User_${9000 + i * 5}</div>
            </div>
            <div class="lb-coins">${startCoins.toLocaleString()}</div>
        `;
        listContainer.appendChild(row);
    }
}

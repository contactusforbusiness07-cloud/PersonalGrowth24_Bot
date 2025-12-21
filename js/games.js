/* js/games.js - Fixed Layout, Tap Engine & Ad Timer Logic */

// Settings
const EARN_PER_TAP = 2;
const MAX_ENERGY = 1000;
const ENERGY_REFILL = 3; // Energy per second

let currentEnergy = MAX_ENERGY;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Tap Listeners
    const coinBtn = document.getElementById('tap-coin');
    if(coinBtn) {
        coinBtn.addEventListener('pointerdown', handleTap); 
    }
});

function initGame() {
    updateDisplayBalance();
    
    // Restore Energy Logic
    const savedEnergy = localStorage.getItem('gameEnergy');
    const lastTime = localStorage.getItem('lastEnergyTime');
    
    if(savedEnergy && lastTime) {
        const diff = Math.floor((Date.now() - parseInt(lastTime)) / 1000);
        const recovered = diff * ENERGY_REFILL;
        currentEnergy = Math.min(MAX_ENERGY, parseInt(savedEnergy) + recovered);
    } else {
        currentEnergy = MAX_ENERGY;
    }
    
    updateEnergyUI();
    setInterval(regenerateEnergy, 1000);
}

function handleTap(e) {
    if(currentEnergy < EARN_PER_TAP) {
        if(window.Telegram?.WebApp?.HapticFeedback) 
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        return;
    }

    // Logic
    currentEnergy -= EARN_PER_TAP;
    updateEnergyUI();

    // Balance Update
    let currentBal = parseFloat(localStorage.getItem('local_balance') || "0");
    currentBal += EARN_PER_TAP;
    localStorage.setItem('local_balance', currentBal);
    
    // Global State Sync
    if(window.currentUser) window.currentUser.balance = currentBal;
    
    updateDisplayBalance();
    spawnFloatingText(e.clientX, e.clientY);
    
    // Haptic
    if(window.Telegram?.WebApp?.HapticFeedback) 
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
}

function spawnFloatingText(x, y) {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    floatEl.innerText = `+${EARN_PER_TAP}`;
    
    // Fallback for click coordinates
    if(!x) {
        const rect = document.getElementById('tap-coin').getBoundingClientRect();
        x = rect.left + rect.width/2;
        y = rect.top + rect.height/2;
    }
    
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    document.body.appendChild(floatEl);

    setTimeout(() => floatEl.remove(), 800);
}

function regenerateEnergy() {
    if(currentEnergy < MAX_ENERGY) {
        currentEnergy = Math.min(MAX_ENERGY, currentEnergy + ENERGY_REFILL);
        updateEnergyUI();
        localStorage.setItem('gameEnergy', currentEnergy);
        localStorage.setItem('lastEnergyTime', Date.now());
    }
}

function updateEnergyUI() {
    const text = document.getElementById('energy-text');
    const fill = document.getElementById('energy-fill');
    if(text) text.innerText = `${Math.floor(currentEnergy)} / ${MAX_ENERGY}`;
    if(fill) fill.style.width = `${(currentEnergy / MAX_ENERGY) * 100}%`;
}

function updateDisplayBalance() {
    const el = document.getElementById('display-balance');
    const bal = localStorage.getItem('local_balance') || "0";
    if(el) {
        el.innerText = Math.floor(parseFloat(bal)).toLocaleString();
        el.style.transform = "scale(1.05)";
        setTimeout(() => el.style.transform = "scale(1)", 100);
    }
}

// ==========================================
// 📺 15-SECOND AD TIMER LOGIC
// ==========================================
window.handleRefill = function() {
    if(currentEnergy >= MAX_ENERGY) {
        Swal.fire({
            icon: 'info',
            title: 'Energy Full',
            text: 'You don\'t need a boost yet!',
            background: '#0f172a', color: '#fff'
        });
        return;
    }

    // 1. Create Ad Overlay
    const overlay = document.createElement('div');
    overlay.className = 'ad-overlay';
    overlay.innerHTML = `
        <div style="text-align:center;">
            <div id="ad-spinner" class="ad-timer-circle"></div>
            <h2 class="ad-status-text">WATCHING AD...</h2>
            <p style="color:#888; font-size:12px;">Do not close the app</p>
            <div id="ad-close-btn" style="display:none; margin-top:20px;">
                <button onclick="window.finishAdReward(this)" style="padding:15px 30px; background:#22c55e; color:white; border:none; border-radius:10px; font-weight:bold; font-size:16px;">
                    CLAIM REWARD ⚡
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Start Countdown
    let timeLeft = 15;
    const spinner = overlay.querySelector('#ad-spinner');
    
    const timer = setInterval(() => {
        timeLeft--;
        spinner.innerText = timeLeft;
        
        if(timeLeft <= 0) {
            clearInterval(timer);
            // Show Close Button
            spinner.style.display = 'none';
            document.querySelector('.ad-status-text').innerText = "AD COMPLETED";
            document.getElementById('ad-close-btn').style.display = 'block';
        }
    }, 1000);
};

window.finishAdReward = function(btn) {
    // 3. Give Reward
    const overlay = document.querySelector('.ad-overlay');
    if(overlay) overlay.remove();
    
    currentEnergy = MAX_ENERGY;
    updateEnergyUI();
    
    Swal.fire({
        icon: 'success',
        title: 'Energy Refilled!',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a', color: '#fff'
    });
};


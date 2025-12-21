/* js/games.js - Anti-Cheat Engine & Metaverse Physics */

// --- CONFIGURATION ---
const EARN_PER_TAP = 2;
const MAX_ENERGY = 1000;
const REFILL_RATE = 3; 

// --- ANTI-CHEAT SETTINGS ---
const MAX_CPS = 14;           // Human Limit (Clicks Per Second)
const WARNING_THRESHOLD = 3;  // 3 Warnings before Ban
const BAN_DURATION_MS = 5 * 60 * 1000; // 5 Minutes Ban

// --- STATE VARIABLES ---
let currentEnergy = MAX_ENERGY;
let tapTimestamps = [];       // To track click speed
let warningCount = 0;
let isBanned = false;
let banEndTime = 0;

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    
    const coinBtn = document.getElementById('tap-coin');
    if(coinBtn) {
        // Use pointerdown for instant response
        coinBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault(); // Stop zoom/scroll
            handleTap(e);
        });
        
        // 3D Tilt Effect on Move
        coinBtn.addEventListener('pointermove', handleTilt);
        coinBtn.addEventListener('pointerup', resetTilt);
        coinBtn.addEventListener('pointerleave', resetTilt);
    }

    // Start Energy Loop
    setInterval(gameLoop, 1000);
});

// --- CORE GAME LOOP ---
function gameLoop() {
    // 1. Handle Ban Timer
    if (isBanned) {
        const remaining = banEndTime - Date.now();
        if (remaining <= 0) {
            liftBan();
        } else {
            updateBanUI(remaining);
            return; // Stop Energy Refill if Banned
        }
    }

    // 2. Refill Energy
    if (currentEnergy < MAX_ENERGY) {
        currentEnergy = Math.min(MAX_ENERGY, currentEnergy + REFILL_RATE);
        updateEnergyUI();
        saveGameState();
    }
}

// --- TAP HANDLER (Strict) ---
function handleTap(e) {
    if (isBanned) return;

    // 1. ANTI-CHEAT CHECK
    const now = Date.now();
    // Filter clicks older than 1 second
    tapTimestamps = tapTimestamps.filter(t => now - t < 1000);
    tapTimestamps.push(now);

    // Check CPS (Clicks Per Second)
    if (tapTimestamps.length > MAX_CPS) {
        triggerWarning();
        return;
    }

    // 2. ENERGY CHECK
    if (currentEnergy < EARN_PER_TAP) {
        hapticFeedback('error');
        return;
    }

    // 3. SUCCESSFUL TAP
    currentEnergy -= EARN_PER_TAP;
    updateEnergyUI();

    // Add Balance
    let bal = parseFloat(localStorage.getItem('local_balance') || "0");
    bal += EARN_PER_TAP;
    localStorage.setItem('local_balance', bal);
    if(window.currentUser) window.currentUser.balance = bal;
    
    updateDisplay();
    
    // VFX
    spawnFloatingText(e.clientX, e.clientY);
    hapticFeedback('light');
    
    // Tilt Coin towards click
    tiltCoin(e);
}

// --- ANTI-CHEAT LOGIC ---
function triggerWarning() {
    warningCount++;
    hapticFeedback('heavy');

    if (warningCount >= WARNING_THRESHOLD) {
        activateBan();
    } else {
        // Show Warning Toast
        Swal.fire({
            icon: 'warning',
            title: 'TOO FAST!',
            text: 'Please tap slower. Auto-clickers are detected.',
            toast: true, position: 'top', timer: 2000,
            showConfirmButton: false, background: '#ef4444', color: '#fff'
        });
    }
}

function activateBan() {
    isBanned = true;
    banEndTime = Date.now() + BAN_DURATION_MS;
    localStorage.setItem('banEndTime', banEndTime);
    
    // UI Update
    const coin = document.getElementById('tap-coin');
    if(coin) coin.classList.add('coin-banned');
    
    // Create Ban Overlay if not exists
    let overlay = document.getElementById('ban-msg');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ban-msg';
        overlay.className = 'ban-overlay';
        document.querySelector('.tap-arena').appendChild(overlay);
        overlay.style.display = 'block';
    }
}

function liftBan() {
    isBanned = false;
    warningCount = 0;
    localStorage.removeItem('banEndTime');
    
    const coin = document.getElementById('tap-coin');
    if(coin) coin.classList.remove('coin-banned');
    
    const overlay = document.getElementById('ban-msg');
    if(overlay) overlay.style.display = 'none';
    
    Swal.fire({
        icon: 'success',
        title: 'Ban Lifted',
        text: 'You can play again. Play fair!',
        timer: 2000, showConfirmButton: false,
        background: '#0f172a', color: '#fff'
    });
}

function updateBanUI(ms) {
    const overlay = document.getElementById('ban-msg');
    if(overlay) {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        overlay.innerHTML = `<i class="fa-solid fa-ban"></i> RESTRICTED<br>${mins}:${secs < 10 ? '0'+secs : secs}`;
    }
}

// --- 3D TILT PHYSICS ---
function tiltCoin(e) {
    const coin = e.target;
    const rect = coin.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation (Max 20deg)
    const rotateX = (y / rect.height) * -30; 
    const rotateY = (x / rect.width) * 30;

    coin.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.95)`;
    setTimeout(() => coin.style.transform = `perspective(500px) rotateX(0) rotateY(0) scale(1)`, 100);
}

function handleTilt(e) {
    // Subtle movement when hovering/dragging finger
    if(isBanned) return;
    const coin = e.target;
    const rect = coin.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -15; 
    const rotateY = (x / rect.width) * 15;
    coin.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(e) {
    e.target.style.transform = `perspective(500px) rotateX(0) rotateY(0)`;
}

// --- UI & STATE MANAGEMENT ---
function loadGameState() {
    // Load Energy
    const saved = localStorage.getItem('gameEnergy');
    const time = localStorage.getItem('lastEnergyTime');
    if (saved && time) {
        const diff = Math.floor((Date.now() - parseInt(time)) / 1000);
        currentEnergy = Math.min(MAX_ENERGY, parseInt(saved) + (diff * REFILL_RATE));
    }
    
    // Check Ban
    const savedBan = localStorage.getItem('banEndTime');
    if (savedBan && parseInt(savedBan) > Date.now()) {
        activateBan();
        banEndTime = parseInt(savedBan);
    }

    updateDisplay();
    updateEnergyUI();
}

function saveGameState() {
    localStorage.setItem('gameEnergy', currentEnergy);
    localStorage.setItem('lastEnergyTime', Date.now());
}

function updateDisplay() {
    const el = document.getElementById('display-balance');
    const bal = localStorage.getItem('local_balance') || "0";
    if(el) el.innerText = Math.floor(parseFloat(bal)).toLocaleString();
}

function updateEnergyUI() {
    const txt = document.getElementById('energy-text');
    const bar = document.getElementById('energy-fill');
    if(txt) txt.innerText = `${Math.floor(currentEnergy)} / ${MAX_ENERGY}`;
    if(bar) bar.style.width = `${(currentEnergy / MAX_ENERGY) * 100}%`;
}

function spawnFloatingText(x, y) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.innerText = `+${EARN_PER_TAP}`;
    // Mobile center fix
    if(!x || x === 0) {
        const rect = document.getElementById('tap-coin').getBoundingClientRect();
        x = rect.left + rect.width/2;
        y = rect.top + rect.height/2;
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function hapticFeedback(style) {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        if(style === 'error') window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        else window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    } else if (navigator.vibrate) {
        // Fallback for browser
        if(style === 'heavy') navigator.vibrate(200);
        else navigator.vibrate(10);
    }
}

// --- AD TIMER (Unchanged, kept as requested) ---
window.handleRefill = function() {
    if(currentEnergy >= MAX_ENERGY) return; // No refill if full
    
    // Show Ad Overlay
    const div = document.createElement('div');
    div.className = 'ad-overlay';
    div.innerHTML = `<div style="text-align:center; color:white;">
        <div class="ad-timer-circle" id="ad-spinner" style="margin:0 auto 20px auto;">15</div>
        <h3>WATCHING AD...</h3>
        <p>Wait to verify reward</p>
        <button id="claim-btn" style="display:none; margin-top:20px; padding:10px 20px; background:#22c55e; border:none; border-radius:5px; font-weight:bold;" onclick="finishAd()">CLAIM ⚡</button>
    </div>`;
    document.body.appendChild(div);

    let t = 15;
    const interval = setInterval(() => {
        t--;
        div.querySelector('#ad-spinner').innerText = t;
        if(t <= 0) {
            clearInterval(interval);
            div.querySelector('#claim-btn').style.display = 'inline-block';
            div.querySelector('h3').innerText = "AD COMPLETE";
        }
    }, 1000);

    window.finishAd = function() {
        div.remove();
        currentEnergy = MAX_ENERGY;
        updateEnergyUI();
    };
};


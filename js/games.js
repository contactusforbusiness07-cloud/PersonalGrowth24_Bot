/* js/games.js - FINAL SECURE ENGINE */

// --- CONFIGURATION ---
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 3; 
const ADSTERRA_LINK = "https://www.google.com"; // Apna link dalein
const NATIVE_AD_LINK = "https://www.binance.com"; 

const LIMITS = { FREE: 3, ADS: 6, TOTAL: 9 };
const ANTI_CHEAT = {
    WARN_CPS: 12, // Warning at 12 clicks/sec
    BAN_CPS: 16,  // Ban at 16 clicks/sec
    BAN_TIME: 5 * 60 * 1000 // 5 Minutes
};

// State
let energy = 1000;
let clickTimes = [];
let isBanned = false;
let boostMultiplier = 1;
let boostTimer = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initGameEngine();
});

function initGameEngine() {
    // 1. FIX IMAGE PATH (HTML change mana hai, JS se fix kar rahe hain)
    const coinImg = document.getElementById('tap-coin');
    if(coinImg) {
        coinImg.src = "assets/coin_main.jpg.png"; // 🔥 FIXED PATH
        
        // Remove old listeners & Add New
        const newCoin = coinImg.cloneNode(true);
        coinImg.parentNode.replaceChild(newCoin, coinImg);
        newCoin.addEventListener('pointerdown', handleSecureTap);
        // Disable drag/context
        newCoin.oncontextmenu = () => false;
        newCoin.ondragstart = () => false;
    }

    // 2. RESTORE BAN STATE
    checkBanStatus();

    // 3. START LOOPS
    setInterval(rechargeLoop, 1000);
    updatePowerUpUI();

    // 4. AD LISTENER
    const adBanner = document.getElementById('game-native-ad');
    if(adBanner) adBanner.onclick = () => window.open(NATIVE_AD_LINK, '_blank');
}

// --- SECURE TAP SYSTEM ---
function handleSecureTap(e) {
    if (isBanned) {
        // Haptic Error Feedback
        if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
        return;
    }

    const now = Date.now();
    
    // 1. ANTI-CHEAT CALCULATIONS
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 1000); // Only keep last 1 sec
    
    const cps = clickTimes.length;

    // Strict Ban Trigger
    if (cps >= ANTI_CHEAT.BAN_CPS) {
        triggerBanSystem();
        return;
    }
    
    // Warning Trigger
    if (cps >= ANTI_CHEAT.WARN_CPS) {
        showRedWarning();
    }

    // 2. GAMEPLAY
    if (energy <= 0) {
        if(navigator.vibrate) navigator.vibrate(50);
        return;
    }

    // Process Tap
    const earned = 2 * boostMultiplier;
    energy = Math.max(0, energy - 2);
    updateEnergyUI();

    // Global Sync
    if(window.addCoins) window.addCoins(earned);

    // Visuals
    showFloatingText(e.clientX, e.clientY, `+${earned}`);
    animateCoin(e.target);
    if(navigator.vibrate) navigator.vibrate(10);
}

// --- PROFESSIONAL WARNING SYSTEM ---
function showRedWarning() {
    // UI Feedback: Make text flash RED
    const statusText = document.getElementById('security-status');
    if(statusText) {
        statusText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> HIGH TRAFFIC DETECTED`;
        statusText.className = "text-red-glow";
        
        // Reset after 2 sec
        setTimeout(() => {
            statusText.className = "";
            statusText.innerHTML = `<i class="fa-solid fa-shield-halved"></i> SECURED`;
        }, 2000);
    }

    // Red Toast
    Swal.fire({
        toast: true, position: 'top', icon: 'error',
        title: '⚠️ SYSTEM ALERT',
        text: 'Tapping speed exceeding human limits. Slow down to avoid ban.',
        background: '#450a0a', color: '#ff4444', // Dark Red Background
        showConfirmButton: false, timer: 2000
    });
}

// --- BAN SYSTEM (Red Glow + Timer) ---
function triggerBanSystem() {
    isBanned = true;
    const banEnd = Date.now() + ANTI_CHEAT.BAN_TIME;
    localStorage.setItem('game_ban_end', banEnd);
    
    applyBanVisuals(banEnd);
}

function checkBanStatus() {
    const savedEnd = localStorage.getItem('game_ban_end');
    if (savedEnd) {
        const remaining = parseInt(savedEnd) - Date.now();
        if (remaining > 0) {
            isBanned = true;
            applyBanVisuals(parseInt(savedEnd));
        } else {
            liftBan();
        }
    }
}

function applyBanVisuals(endTime) {
    // 1. Show Overlay
    const overlay = document.getElementById('ban-overlay');
    const timerText = document.getElementById('ban-timer');
    if(overlay) {
        overlay.classList.remove('hidden'); 
        overlay.classList.add('active'); // CSS Force show
    }

    // 2. Red Glow Effect on Ring
    const ring = document.querySelector('.cyber-ring');
    if(ring) ring.classList.add('danger-state');

    // 3. Timer Loop
    const interval = setInterval(() => {
        const left = endTime - Date.now();
        if (left <= 0) {
            clearInterval(interval);
            liftBan();
            return;
        }
        
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        if(timerText) timerText.innerText = `${m}:${s < 10 ? '0'+s : s}`;
    }, 1000);
}

function liftBan() {
    isBanned = false;
    localStorage.removeItem('game_ban_end');
    
    document.getElementById('ban-overlay').classList.add('hidden');
    document.getElementById('ban-overlay').classList.remove('active');
    
    const ring = document.querySelector('.cyber-ring');
    if(ring) ring.classList.remove('danger-state');
}

// --- POWER UP SYSTEM (FIXED) ---
window.handlePowerUp = function(type) {
    if (isBanned) return;

    const today = new Date().toDateString();
    if (localStorage.getItem(`pwr_${type}_date`) !== today) {
        localStorage.setItem(`pwr_${type}_date`, today);
        localStorage.setItem(`pwr_${type}_count`, 0);
    }

    let count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");

    if (count >= LIMITS.TOTAL) {
        Swal.fire({
            icon: 'error', title: 'Limit Reached',
            text: 'Daily limit exhausted. Reset at 00:00 UTC.',
            background: '#020617', color: '#fff'
        });
        return;
    }

    if (count < LIMITS.FREE) {
        activatePowerUp(type);
        incrementPowerUp(type, count);
    } else {
        // Ad Logic
        Swal.fire({
            title: 'Watch Ad?',
            text: `Free ${type} used. Watch 15s ad to refill?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Watch Video',
            confirmButtonColor: '#fbbf24',
            background: '#020617', color: '#fff'
        }).then((res) => {
            if (res.isConfirmed) {
                window.open(ADSTERRA_LINK, '_blank');
                
                let timer = 15;
                Swal.fire({
                    title: 'Verifying...',
                    html: `Reward in <b>${timer}</b>s`,
                    timer: 15000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); },
                    background: '#020617', color: '#fff'
                }).then(() => {
                    activatePowerUp(type);
                    incrementPowerUp(type, count);
                });
            }
        });
    }
};

function activatePowerUp(type) {
    if (type === 'refill') {
        energy = MAX_ENERGY;
        updateEnergyUI();
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Energy Refilled!', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false });
    } else {
        boostMultiplier = 2;
        // Visual Boost
        const ring = document.querySelector('.cyber-ring');
        if(ring) ring.style.boxShadow = "0 0 50px rgba(74, 222, 128, 0.5)";
        
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: '2x Boost Active!', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false });

        if(boostTimer) clearTimeout(boostTimer);
        boostTimer = setTimeout(() => {
            boostMultiplier = 1;
            if(ring) ring.style.boxShadow = "";
        }, 30000);
    }
}

function incrementPowerUp(type, current) {
    localStorage.setItem(`pwr_${type}_count`, current + 1);
    updatePowerUpUI();
}

function updatePowerUpUI() {
    ['booster', 'refill'].forEach(type => {
        const count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");
        const el = document.getElementById(`btn-${type}-badge`);
        if(el) {
            let txt = `${LIMITS.TOTAL - count}/${LIMITS.TOTAL}`;
            if (count >= LIMITS.FREE && count < LIMITS.TOTAL) txt += " (AD)";
            if (count >= LIMITS.TOTAL) txt = "MAX";
            el.innerText = txt;
        }
    });
}

// --- UTILS ---
function rechargeLoop() {
    if (energy < MAX_ENERGY && !isBanned) {
        energy += RECHARGE_RATE;
        updateEnergyUI();
    }
}

function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    const txt = document.getElementById('energy-text');
    if(fill) fill.style.width = `${(energy / MAX_ENERGY) * 100}%`;
    if(txt) txt.innerText = `${Math.floor(energy)} / ${MAX_ENERGY}`;
}

function showFloatingText(x, y, txt) {
    const el = document.createElement('div');
    el.innerText = txt;
    el.className = 'floating-text';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function animateCoin(el) {
    el.style.transform = "scale(0.95)";
    setTimeout(() => el.style.transform = "scale(1)", 50);
}

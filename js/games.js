/* js/games.js - FINAL SECURE ENGINE WITH RED TIMER */

// --- CONFIGURATION ---
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 2; 
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
let banInterval = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initGameEngine();
});

function initGameEngine() {
    // 1. FIX IMAGE PATH
    const coinImg = document.getElementById('tap-coin');
    if(coinImg) {
        coinImg.src = "assets/coin_main.jpg.png"; // 🔥 FIXED PATH
        
        const newCoin = coinImg.cloneNode(true);
        coinImg.parentNode.replaceChild(newCoin, coinImg);
        newCoin.addEventListener('pointerdown', handleSecureTap);
        newCoin.oncontextmenu = () => false;
        newCoin.ondragstart = () => false;
    }

    // 2. ATTACH BUTTON LISTENERS (FIX FOR CLICKS)
    const boosterBtn = document.getElementById('btn-booster-action');
    const refillBtn = document.getElementById('btn-refill-action');
    if(boosterBtn) boosterBtn.addEventListener('click', () => handlePowerUp('booster'));
    if(refillBtn) refillBtn.addEventListener('click', () => handlePowerUp('refill'));


    // 3. RESTORE STATE & START LOOPS
    checkBanStatus();
    setInterval(rechargeLoop, 1000);
    updatePowerUpUI();

    // 4. AD LISTENER
    const adBanner = document.getElementById('game-native-ad');
    if(adBanner) adBanner.onclick = () => window.open(NATIVE_AD_LINK, '_blank');
}

// --- SECURE TAP SYSTEM ---
function handleSecureTap(e) {
    if (isBanned) {
        if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
        return;
    }

    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 1000); // Keep last 1 sec
    
    const cps = clickTimes.length;

    if (cps >= ANTI_CHEAT.BAN_CPS) {
        triggerBanSystem();
        return;
    }
    
    if (cps >= ANTI_CHEAT.WARN_CPS) {
        showRedWarning();
    }

    if (energy <= 0) {
        if(navigator.vibrate) navigator.vibrate(50);
        return;
    }

    // Process Tap
    const earned = 2 * boostMultiplier;
    energy = Math.max(0, energy - 2);
    updateEnergyUI();
    if(window.addCoins) window.addCoins(earned);

    // Visuals
    showFloatingText(e.clientX, e.clientY, `+${earned}`);
    animateCoin(e.target);
    if(navigator.vibrate) navigator.vibrate(10);
}

// --- PROFESSIONAL WARNING SYSTEM ---
function showRedWarning() {
    const statusText = document.getElementById('security-status');
    if(statusText) {
        statusText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> HIGH TRAFFIC DETECTED`;
        statusText.className = "text-red-glow";
        setTimeout(() => {
            statusText.className = "";
            statusText.innerHTML = `<i class="fa-solid fa-shield-halved"></i> SECURED`;
        }, 2000);
    }
    Swal.fire({ toast: true, position: 'top', icon: 'error', title: '⚠️ TAP SLOWER', background: '#450a0a', color: '#ff4444', showConfirmButton: false, timer: 1500 });
}

// --- BAN SYSTEM (Red Glow + Coin Timer) ---
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
    // 1. Red Glow on Ring
    const ring = document.querySelector('.cyber-ring');
    const coin = document.getElementById('tap-coin');
    if(ring) ring.classList.add('danger-state');
    if(coin) coin.classList.add('coin-banned');

    // 2. Show Red Timer over Coin
    const coinTimer = document.getElementById('coin-ban-timer');
    if(coinTimer) coinTimer.classList.remove('hidden');

    // 3. Start Timer Loop
    if(banInterval) clearInterval(banInterval);
    banInterval = setInterval(() => {
        const left = endTime - Date.now();
        if (left <= 0) {
            liftBan();
            return;
        }
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        if(coinTimer) coinTimer.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }, 1000);
}

function liftBan() {
    isBanned = false;
    localStorage.removeItem('game_ban_end');
    if(banInterval) clearInterval(banInterval);
    
    const ring = document.querySelector('.cyber-ring');
    const coin = document.getElementById('tap-coin');
    const coinTimer = document.getElementById('coin-ban-timer');
    
    if(ring) ring.classList.remove('danger-state');
    if(coin) coin.classList.remove('coin-banned');
    if(coinTimer) coinTimer.classList.add('hidden');
}

// --- POWER UP SYSTEM (FIXED) ---
// NOTE: Using window scope to ensure click handlers work
window.handlePowerUp = function(type) {
    if (isBanned) return;

    const today = new Date().toDateString();
    if (localStorage.getItem(`pwr_${type}_date`) !== today) {
        localStorage.setItem(`pwr_${type}_date`, today);
        localStorage.setItem(`pwr_${type}_count`, 0);
    }

    let count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");

    if (count >= LIMITS.TOTAL) {
        Swal.fire({ icon: 'error', title: 'Daily Limit Reached', text: 'Come back tomorrow!', background: '#020617', color: '#fff' });
        return;
    }

    if (count < LIMITS.FREE) {
        activatePowerUp(type);
        incrementPowerUp(type, count);
    } else {
        // Ad Logic
        Swal.fire({
            title: 'Watch Ad?',
            text: `Free limit used. Watch 15s ad for ${type}?`,
            icon: 'info', showCancelButton: true, confirmButtonText: 'Watch', confirmButtonColor: '#fbbf24', background: '#020617', color: '#fff'
        }).then((res) => {
            if (res.isConfirmed) {
                window.open(ADSTERRA_LINK, '_blank');
                let timer = 15;
                Swal.fire({ title: 'Verifying...', html: `Reward in <b>${timer}</b>s`, timer: 15000, timerProgressBar: true, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }, background: '#020617', color: '#fff' }).then(() => {
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

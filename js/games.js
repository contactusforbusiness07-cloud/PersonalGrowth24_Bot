/* js/games.js - SECURE MINING ENGINE (Strict Anti-Cheat + Ads) */

// --- CONFIGURATION ---
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 3; // Energy per second
const ADSTERRA_LINK = "https://www.google.com"; // CHANGE THIS TO YOUR LINK
const NATIVE_AD_LINK = "https://www.binance.com"; // Top "Sponsored System" Link

const DAILY_LIMIT_FREE = 3;
const DAILY_LIMIT_ADS = 6;
const TOTAL_LIMIT = 9;

// Anti-Cheat Settings
const CPS_WARNING_THRESHOLD = 12; // Warn at 12 clicks/sec
const CPS_BAN_THRESHOLD = 15;     // Ban at 15 clicks/sec
const BAN_DURATION_MS = 5 * 60 * 1000; // 5 Minutes

// State
let energy = 1000;
let clickTimes = [];
let isBanned = false;
let boostMultiplier = 1;
let boostTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    initGameEngine();
});

function initGameEngine() {
    // 1. Check Previous Ban
    checkBanStatus();

    // 2. Setup Click Listener
    const coin = document.getElementById('tap-coin');
    if(coin) {
        const newCoin = coin.cloneNode(true);
        coin.parentNode.replaceChild(newCoin, coin);
        newCoin.addEventListener('pointerdown', handleSecureTap);
    }

    // 3. Start Energy Recharge
    setInterval(rechargeLoop, 1000);

    // 4. Init UI
    updatePowerUpBadges();
    
    // 5. Native Ad Click Listener
    const nativeAd = document.getElementById('game-native-ad');
    if(nativeAd) {
        nativeAd.onclick = () => window.open(NATIVE_AD_LINK, '_blank');
    }
}

// --- CORE: SECURE TAP LOGIC ---
function handleSecureTap(e) {
    if (isBanned) return;

    const now = Date.now();
    
    // A. ANTI-CHEAT: Calculate Clicks Per Second
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 1000); // Keep last 1 sec
    
    const cps = clickTimes.length;

    if (cps >= CPS_BAN_THRESHOLD) {
        triggerBanSystem();
        return;
    }
    
    if (cps >= CPS_WARNING_THRESHOLD) {
        showSecurityWarning();
    }

    // B. GAMEPLAY
    if (energy <= 0) {
        if(window.navigator.vibrate) window.navigator.vibrate(50); // Error vibe
        return;
    }

    // Earn Logic
    const earnings = 2 * boostMultiplier;
    energy -= 2;
    updateEnergyUI();

    // Global Wallet Update
    if(window.addCoins) window.addCoins(earnings);

    // Visuals
    showFloatingText(e.clientX, e.clientY, `+${earnings}`);
    animateCoinPress(e.target);

    // Good Vibe
    if(window.navigator.vibrate) window.navigator.vibrate(10);
}

// --- ANTI-CHEAT ACTIONS ---
function showSecurityWarning() {
    const badge = document.getElementById('security-status');
    if(badge) {
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> WARNING`;
        badge.className = "text-gold blink-anim";
    }

    Swal.fire({
        toast: true, position: 'top', icon: 'warning',
        title: 'TAP SLOWER!',
        text: 'System detects inhuman speed. Ban imminent.',
        background: '#330000', color: '#ff4444',
        showConfirmButton: false, timer: 1500
    });
}

function triggerBanSystem() {
    isBanned = true;
    const banEndTime = Date.now() + BAN_DURATION_MS;
    localStorage.setItem('game_ban_end', banEndTime);

    showBanOverlay(banEndTime);
    
    const badge = document.getElementById('security-status');
    if(badge) {
        badge.innerHTML = `<i class="fa-solid fa-lock"></i> ACCOUNT FLAGGED`;
        badge.className = "text-red";
    }
}

function checkBanStatus() {
    const savedBanEnd = localStorage.getItem('game_ban_end');
    if (savedBanEnd) {
        const timeLeft = parseInt(savedBanEnd) - Date.now();
        if (timeLeft > 0) {
            isBanned = true;
            showBanOverlay(parseInt(savedBanEnd));
        } else {
            // Unban
            localStorage.removeItem('game_ban_end');
            isBanned = false;
            document.getElementById('ban-overlay').classList.add('hidden');
        }
    }
}

function showBanOverlay(endTime) {
    const overlay = document.getElementById('ban-overlay');
    const timerEl = document.getElementById('ban-timer');
    if(!overlay) return;

    overlay.classList.remove('hidden');

    const interval = setInterval(() => {
        const left = endTime - Date.now();
        if (left <= 0) {
            clearInterval(interval);
            checkBanStatus(); // Reload state
            return;
        }
        
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        timerEl.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }, 1000);
}

// --- POWER UP SYSTEM (3 Free -> 6 Ads) ---
window.handlePowerUp = function(type) {
    if (isBanned) return;

    // Reset Daily
    const today = new Date().toDateString();
    if (localStorage.getItem(`pwr_${type}_date`) !== today) {
        localStorage.setItem(`pwr_${type}_date`, today);
        localStorage.setItem(`pwr_${type}_count`, 0);
    }

    let count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");

    // 1. Check Total Limit (9)
    if (count >= TOTAL_LIMIT) {
        Swal.fire({
            icon: 'error', title: 'Daily Limit Reached',
            text: 'Come back tomorrow for more!',
            background: '#020617', color: '#fff'
        });
        return;
    }

    // 2. Logic: Free vs Ad
    if (count < DAILY_LIMIT_FREE) {
        // FREE (0, 1, 2)
        activateEffect(type);
        incrementCount(type, count);
    } else {
        // ADS (3 to 8)
        startAdFlow(type, count);
    }
};

function startAdFlow(type, currentCount) {
    Swal.fire({
        title: 'Locked Feature',
        text: `Free limit used. Watch Ad to unlock ${type.toUpperCase()}?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Watch Ad',
        confirmButtonColor: '#eab308',
        background: '#020617', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(ADSTERRA_LINK, '_blank');
            
            let seconds = 15;
            Swal.fire({
                title: 'Verifying Ad...',
                html: `Reward unlocks in <b>${seconds}</b>s`,
                timer: 15000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); },
                background: '#020617', color: '#fff'
            }).then(() => {
                activateEffect(type);
                incrementCount(type, currentCount);
            });
        }
    });
}

function activateEffect(type) {
    if (type === 'refill') {
        energy = MAX_ENERGY;
        updateEnergyUI();
        Swal.fire({
            toast: true, position: 'top', icon: 'success', 
            title: 'Energy Full!', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false
        });
    } else if (type === 'booster') {
        boostMultiplier = 2;
        document.querySelector('.tap-arena').style.boxShadow = "0 0 50px rgba(255, 215, 0, 0.4)";
        const badge = document.getElementById('btn-booster-badge');
        if(badge) badge.style.color = "#ffd700";

        Swal.fire({
            toast: true, position: 'top', icon: 'success', 
            title: '2x Boost Active (30s)', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false
        });

        if(boostTimer) clearTimeout(boostTimer);
        boostTimer = setTimeout(() => {
            boostMultiplier = 1;
            document.querySelector('.tap-arena').style.boxShadow = "";
            if(badge) badge.style.color = "";
        }, 30000);
    }
}

function incrementCount(type, current) {
    localStorage.setItem(`pwr_${type}_count`, current + 1);
    updatePowerUpBadges();
}

function updatePowerUpBadges() {
    ['booster', 'refill'].forEach(type => {
        const count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");
        const el = document.getElementById(`btn-${type}-badge`);
        if(el) {
            let text = `${TOTAL_LIMIT - count}/${TOTAL_LIMIT}`;
            if (count >= 3 && count < 9) text += " (AD)";
            if (count >= 9) text = "MAX";
            el.innerText = text;
        }
    });
}

// --- HELPERS ---
function rechargeLoop() {
    if (energy < MAX_ENERGY && !isBanned) {
        energy += RECHARGE_RATE;
        if(energy > MAX_ENERGY) energy = MAX_ENERGY;
        updateEnergyUI();
    }
}

function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    const text = document.getElementById('energy-text');
    if(fill) fill.style.width = `${(energy / MAX_ENERGY) * 100}%`;
    if(text) text.innerText = `${Math.floor(energy)} / ${MAX_ENERGY}`;
}

function showFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.innerText = text;
    el.className = 'floating-score';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function animateCoinPress(coin) {
    coin.style.transform = "scale(0.95)";
    setTimeout(() => coin.style.transform = "scale(1)", 50);
}


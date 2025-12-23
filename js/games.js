/* js/games.js - SECURE ENGINE (Fixed Buttons + Pro Warnings) */

// --- CONFIGURATION ---
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 2; // Energy per second
const ADSTERRA_LINK = "https://www.google.com"; // UPDATE THIS
const NATIVE_AD_LINK = "https://www.binance.com"; 

const LIMITS = { FREE: 3, ADS: 6, TOTAL: 9 };
const ANTI_CHEAT = {
    WARN_CPS: 12, 
    BAN_CPS: 16,  
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
    // 1. INJECT BAN TIMER (Without changing HTML)
    const arena = document.querySelector('.tap-arena');
    if(arena && !document.getElementById('injected-ban-timer')) {
        const timerDiv = document.createElement('div');
        timerDiv.id = 'injected-ban-timer';
        timerDiv.className = 'ban-timer-overlay hidden';
        timerDiv.innerHTML = `
            <div class="ban-icon"><i class="fa-solid fa-ban"></i></div>
            <div class="ban-countdown" id="ban-countdown-text">05:00</div>
            <div class="ban-text">SYSTEM LOCKDOWN</div>
        `;
        arena.appendChild(timerDiv);
    }

    // 2. FIX IMAGE PATH & LISTENER
    const coinImg = document.getElementById('tap-coin');
    if(coinImg) {
        coinImg.src = "assets/coin_main.jpg.png"; // 🔥 FIXED PATH
        
        const newCoin = coinImg.cloneNode(true);
        coinImg.parentNode.replaceChild(newCoin, coinImg);
        newCoin.addEventListener('pointerdown', handleSecureTap);
        newCoin.oncontextmenu = () => false;
        newCoin.ondragstart = () => false;
    }

    // 3. FORCE FIX BUTTONS (Global attach)
    // Hum sidha buttons dhoondh ke unpe onclick laga rahe hain
    const boosters = document.querySelectorAll('.hitech-icon-btn.booster');
    const refills = document.querySelectorAll('.hitech-icon-btn.refill');
    
    boosters.forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); handlePowerUp('booster'); };
    });
    refills.forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); handlePowerUp('refill'); };
    });

    // 4. RESTORE STATE & LOOPS
    checkBanStatus();
    setInterval(rechargeLoop, 1000);
    updatePowerUpUI();

    // 5. AD LISTENER
    const adBanner = document.getElementById('game-native-ad');
    if(adBanner) adBanner.onclick = () => window.open(NATIVE_AD_LINK, '_blank');
}

// --- SECURE TAP SYSTEM ---
function handleSecureTap(e) {
    if (isBanned) {
        if(navigator.vibrate) navigator.vibrate(50);
        return;
    }

    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 1000); 
    
    const cps = clickTimes.length;

    // Ban Trigger
    if (cps >= ANTI_CHEAT.BAN_CPS) {
        triggerBanSystem();
        return;
    }
    
    // Warning Trigger
    if (cps >= ANTI_CHEAT.WARN_CPS) {
        showRedWarning();
    }

    if (energy <= 0) return;

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

// --- PROFESSIONAL WARNING ---
function showRedWarning() {
    const statusText = document.getElementById('security-status');
    if(statusText) {
        statusText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> TRAFFIC ANOMALY DETECTED`;
        statusText.className = "text-red-alert";
        setTimeout(() => {
            statusText.className = "";
            statusText.innerHTML = `<i class="fa-solid fa-shield-halved"></i> SECURED`;
        }, 2000);
    }
    
    // Toast Warning
    Swal.fire({ 
        toast: true, position: 'top', icon: 'error', 
        title: '⚠️ SECURITY ALERT', 
        text: 'Abnormal activity detected. Reduce speed to prevent protocol suspension.',
        background: '#450a0a', color: '#ff4444', 
        showConfirmButton: false, timer: 2500 
    });
}

// --- BAN SYSTEM ---
function triggerBanSystem() {
    isBanned = true;
    const banEnd = Date.now() + ANTI_CHEAT.BAN_TIME;
    localStorage.setItem('game_ban_end', banEnd);
    applyBanVisuals(banEnd);
    
    // Modal Alert
    Swal.fire({ 
        icon: 'error', 
        title: 'ACCESS DENIED', 
        text: 'Automated clicking patterns detected. Mining protocols suspended for 5 minutes.',
        background: '#020617', color: '#fff', confirmButtonColor: '#ef4444'
    });
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
    const timerDiv = document.getElementById('injected-ban-timer');
    const ring = document.querySelector('.cyber-ring');
    const coin = document.getElementById('tap-coin');
    
    if(timerDiv) timerDiv.classList.remove('hidden');
    if(ring) ring.classList.add('danger-state');
    if(coin) coin.classList.add('banned');

    if(banInterval) clearInterval(banInterval);
    banInterval = setInterval(() => {
        const left = endTime - Date.now();
        if (left <= 0) {
            liftBan();
            return;
        }
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        const txt = document.getElementById('ban-countdown-text');
        if(txt) txt.innerText = `0${m}:${s < 10 ? '0'+s : s}`;
    }, 1000);
}

function liftBan() {
    isBanned = false;
    localStorage.removeItem('game_ban_end');
    if(banInterval) clearInterval(banInterval);
    
    const ring = document.querySelector('.cyber-ring');
    const coin = document.getElementById('tap-coin');
    const timerDiv = document.getElementById('injected-ban-timer');

    if(ring) ring.classList.remove('danger-state');
    if(coin) coin.classList.remove('banned');
    if(timerDiv) timerDiv.classList.add('hidden');
}

// --- POWER UP SYSTEM ---
window.handlePowerUp = function(type) {
    if (isBanned) return;

    const today = new Date().toDateString();
    if (localStorage.getItem(`pwr_${type}_date`) !== today) {
        localStorage.setItem(`pwr_${type}_date`, today);
        localStorage.setItem(`pwr_${type}_count`, 0);
    }

    let count = parseInt(localStorage.getItem(`pwr_${type}_count`) || "0");

    if (count >= LIMITS.TOTAL) {
        Swal.fire({ icon: 'error', title: 'Limit Reached', text: 'Daily limit exhausted.', background: '#020617', color: '#fff' });
        return;
    }

    if (count < LIMITS.FREE) {
        activatePowerUp(type);
        incrementPowerUp(type, count);
    } else {
        // Ads Logic
        Swal.fire({
            title: 'Locked Protocol',
            text: `Free allocation used. View 15s content to unlock ${type.toUpperCase()}?`,
            icon: 'info', showCancelButton: true, confirmButtonText: 'View Content', confirmButtonColor: '#fbbf24', background: '#020617', color: '#fff'
        }).then((res) => {
            if (res.isConfirmed) {
                window.open(ADSTERRA_LINK, '_blank');
                let t = 15;
                Swal.fire({ title: 'Verifying...', html: `Access granted in <b>${t}</b>s`, timer: 15000, timerProgressBar: true, didOpen: () => Swal.showLoading(), background: '#020617', color: '#fff' })
                .then(() => {
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
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'System Charged!', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false });
    } else {
        boostMultiplier = 2;
        const ring = document.querySelector('.cyber-ring');
        if(ring) ring.style.boxShadow = "0 0 50px rgba(74, 222, 128, 0.5)";
        
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Overclock Active (2x)', background: '#020617', color: '#fff', timer: 1500, showConfirmButton: false });
        
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

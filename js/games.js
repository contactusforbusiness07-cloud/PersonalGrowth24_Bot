/* js/games.js - SECURE ENGINE (WITH SMARTLINK & 320x50 BANNER) */

// --- CONFIGURATION ---
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 2; // Energy per second

// ⚠️ AD LINKS (UPDATED)
const SMARTLINK_URL = "https://www.effectivegatecpm.com/q3zxkem7?key=8dba0d1f9c1ff4fd04c8eec011b1bf87"; // For Booster/Refill
// Banner Ad Configuration (320x50)
const BANNER_CONFIG = {
    key: 'da50611c22ea409fabf6255e80467cc4',
    format: 'iframe',
    height: 50,
    width: 320,
    params: {}
};

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
    console.log("🎮 Game Engine: Starting...");

    // 🟢 1. INJECT 320x50 BANNER AD (ABOVE COIN)
    const adPlaceholder = document.getElementById('game-native-ad');
    if (adPlaceholder) {
        // Clear & Style Container for 320x50
        adPlaceholder.innerHTML = "";
        adPlaceholder.style.height = "60px"; // Slightly larger than 50px for padding
        adPlaceholder.style.minHeight = "60px";
        adPlaceholder.style.marginBottom = "10px";
        adPlaceholder.style.display = "flex";
        adPlaceholder.style.justifyContent = "center";
        adPlaceholder.style.alignItems = "center";
        adPlaceholder.style.background = "transparent"; // Clean look
        
        // Inject Banner using Script (Dynamic Creation)
        const bannerScript = document.createElement('script');
        bannerScript.type = 'text/javascript';
        bannerScript.innerHTML = `
            atOptions = {
                'key' : '${BANNER_CONFIG.key}',
                'format' : '${BANNER_CONFIG.format}',
                'height' : ${BANNER_CONFIG.height},
                'width' : ${BANNER_CONFIG.width},
                'params' : {}
            };
        `;
        adPlaceholder.appendChild(bannerScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `//www.highperformanceformat.com/${BANNER_CONFIG.key}/invoke.js`;
        adPlaceholder.appendChild(invokeScript);
    }

    // 2. INJECT BAN TIMER (Without changing HTML)
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

    // 3. FIX IMAGE PATH & LISTENER
    const coinImg = document.getElementById('tap-coin');
    if(coinImg) {
        coinImg.src = "assets/coin_main.jpg.png"; 
        
        const newCoin = coinImg.cloneNode(true);
        coinImg.parentNode.replaceChild(newCoin, coinImg);
        newCoin.addEventListener('pointerdown', handleSecureTap);
        newCoin.oncontextmenu = () => false;
        newCoin.ondragstart = () => false;
    }

    // 4. FORCE FIX BUTTONS (Global attach)
    const boosters = document.querySelectorAll('.hitech-icon-btn.booster');
    const refills = document.querySelectorAll('.hitech-icon-btn.refill');
    
    boosters.forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); handlePowerUp('booster'); };
    });
    refills.forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); handlePowerUp('refill'); };
    });

    // 5. RESTORE STATE & LOOPS
    checkBanStatus();
    setInterval(rechargeLoop, 1000);
    updatePowerUpUI();
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

    if (cps >= ANTI_CHEAT.BAN_CPS) {
        triggerBanSystem();
        return;
    }
    
    if (cps >= ANTI_CHEAT.WARN_CPS) {
        showRedWarning();
    }

    if (energy <= 0) return;

    const earned = 2 * boostMultiplier;
    energy = Math.max(0, energy - 2);
    updateEnergyUI();
    if(window.addCoins) window.addCoins(earned);

    showFloatingText(e.clientX, e.clientY, `+${earned}`);
    animateCoin(e.target);
    if(navigator.vibrate) navigator.vibrate(10);
}

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
    
    Swal.fire({ 
        toast: true, position: 'top', icon: 'error', 
        title: '⚠️ SECURITY ALERT', 
        text: 'Abnormal activity detected. Reduce speed to prevent protocol suspension.',
        background: '#450a0a', color: '#ff4444', 
        showConfirmButton: false, timer: 2500 
    });
}

function triggerBanSystem() {
    isBanned = true;
    const banEnd = Date.now() + ANTI_CHEAT.BAN_TIME;
    localStorage.setItem('game_ban_end', banEnd);
    applyBanVisuals(banEnd);
    
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

// --- POWER UP SYSTEM (WITH SMARTLINK) ---
window.handlePowerUp = function(type) {
    if (isBanned) return;

    // 🟢 1. ALWAYS OPEN SMARTLINK ON CLICK (EARNING LOGIC)
    if (SMARTLINK_URL) window.open(SMARTLINK_URL, '_blank');

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
        // Ads Logic Confirmation (Wait Logic)
        Swal.fire({
            title: 'Protocol Syncing...',
            text: `Validating ad view for ${type.toUpperCase()}...`,
            icon: 'info', 
            background: '#020617', color: '#fff',
            timer: 5000, // 5 sec wait to simulate ad watch
            timerProgressBar: true,
            didOpen: () => Swal.showLoading()
        }).then(() => {
            activatePowerUp(type);
            incrementPowerUp(type, count);
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

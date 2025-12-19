/* =========================================
   CORE GAMEPLAY & REFILL LOGIC
   ========================================= */

let energy = 1000;
const MAX_ENERGY = 1000;
const ENERGY_REGEN_RATE = 1; 
const TAP_VALUE = 1;
const SYNC_INTERVAL = 60000;
const MIN_TAPS_TO_SYNC = 50; 

// Refill Limits
const MAX_FREE_REFILLS = 3;
const MAX_AD_REFILLS = 15;

// State Variables
let tapTimes = [];
let isBanned = false;
let unsavedTaps = 0;
let lastSyncTime = Date.now();

// DOM Elements
const balanceEl = document.getElementById('display-balance');
const energyTextEl = document.getElementById('energy-text');
const energyFillEl = document.getElementById('energy-fill');
const coinBtn = document.querySelector('.coin-container');
const refillBtn = document.getElementById('btn-refill');
const refillLabel = document.getElementById('refill-label');

// 1. Initialization
function initGame() {
    // Load Local Data
    const localBalance = localStorage.getItem('local_balance');
    const localEnergy = localStorage.getItem('local_energy');
    
    // Load Refill Data (Reset if new day)
    checkDailyReset();

    if (localBalance && currentUser) {
        if(parseInt(localBalance) > currentUser.balance) currentUser.balance = parseInt(localBalance);
    }
    
    if (currentUser) {
        energy = localEnergy ? parseInt(localEnergy) : (currentUser.energy || MAX_ENERGY);
        updateUI();
        updateRefillUI();
    }
    
    setInterval(regenEnergy, 1000);
    setInterval(saveProgress, SYNC_INTERVAL);

    // Visibility Save
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') saveProgress(true);
    });
}

// 2. Refill Logic (3 Free + 15 Ads)
function checkDailyReset() {
    const lastDate = localStorage.getItem('refill_date');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        // New Day! Reset Counts
        localStorage.setItem('refill_date', today);
        localStorage.setItem('free_refills_used', 0);
        localStorage.setItem('ad_refills_used', 0);
    }
}

window.handleRefill = function() {
    checkDailyReset();
    let freeUsed = parseInt(localStorage.getItem('free_refills_used') || 0);
    let adUsed = parseInt(localStorage.getItem('ad_refills_used') || 0);

    if (freeUsed < MAX_FREE_REFILLS) {
        // Use Free Refill
        energy = MAX_ENERGY;
        localStorage.setItem('free_refills_used', freeUsed + 1);
        showWarning("⚡ Energy Refilled (Free)!");
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        // Use Ad Refill
        // Yahan Adsterra/Google Ad show karne ka code aayega.
        // Abhi ke liye direct refill kar rahe hain simulation ke liye.
        console.log("Show Ad Here..."); 
        
        // Ad Success hone ke baad:
        energy = MAX_ENERGY;
        localStorage.setItem('ad_refills_used', adUsed + 1);
        showWarning("⚡ Energy Refilled (Ad Watched)!");
    } 
    else {
        showWarning("🚫 Daily limit reached! Come back tomorrow.");
    }

    updateUI();
    updateRefillUI();
    saveProgress(true); // Save usage to DB
}

function updateRefillUI() {
    if(!refillBtn || !refillLabel) return;

    let freeUsed = parseInt(localStorage.getItem('free_refills_used') || 0);
    let adUsed = parseInt(localStorage.getItem('ad_refills_used') || 0);

    if (freeUsed < MAX_FREE_REFILLS) {
        refillLabel.innerText = `Free Boost (${MAX_FREE_REFILLS - freeUsed} Left)`;
        refillBtn.classList.remove('disabled');
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        refillLabel.innerText = `Watch Ad (${MAX_AD_REFILLS - adUsed} Left)`;
        refillBtn.classList.remove('disabled');
        // Change button color for Ad
        refillBtn.style.background = "linear-gradient(135deg, #a855f7, #9333ea)";
    } 
    else {
        refillLabel.innerText = "Limit Reached";
        refillBtn.classList.add('disabled');
    }
}

// 3. The Tap Event
if (coinBtn) {
    coinBtn.addEventListener('pointerdown', handleTap); 
}

function handleTap(e) {
    if (isBanned) return showWarning("Account Restricted.");
    if (energy < TAP_VALUE) {
        // Haptic Error
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
        return; 
    }

    // Security & Logic
    const now = Date.now();
    tapTimes.push(now);
    if (tapTimes.length > 10) tapTimes.shift();
    if (tapTimes.length >= 10 && (now - tapTimes[0] < 400)) {
        detectBot("Speed Hacking");
        return;
    }

    energy -= TAP_VALUE;
    if (!currentUser.balance) currentUser.balance = 0;
    currentUser.balance += TAP_VALUE;
    unsavedTaps += TAP_VALUE;

    localStorage.setItem('local_balance', currentUser.balance);
    localStorage.setItem('local_energy', energy);

    updateUI();
    spawnFloatingText(e.clientX, e.clientY);
    
    // Tilt
    const rect = coinBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.95)`;
    setTimeout(() => {
        coinBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 100);

    // Haptic
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
}

// 4. Helpers
function spawnFloatingText(x, y) {
    const floatEl = document.createElement('div');
    floatEl.className = 'float-text';
    floatEl.innerText = `+${TAP_VALUE}`;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    const layer = document.getElementById('click-effects-layer');
    if(layer) layer.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1000);
}

function updateUI() {
    if(!balanceEl || !currentUser) return;
    balanceEl.innerText = Math.floor(currentUser.balance).toLocaleString();
    
    if(energyTextEl) energyTextEl.innerText = `${Math.floor(energy)} / ${MAX_ENERGY}`;
    if(energyFillEl) {
        const percent = (energy / MAX_ENERGY) * 100;
        energyFillEl.style.width = `${percent}%`;
    }
}

function regenEnergy() {
    if (energy < MAX_ENERGY) {
        energy += ENERGY_REGEN_RATE;
        if (energy > MAX_ENERGY) energy = MAX_ENERGY;
        if (energy % 10 === 0) localStorage.setItem('local_energy', energy);
        updateUI();
    }
}

// 5. Saving
function detectBot(reason) {
    isBanned = true;
    showWarning("⚠️ Bot detected. Stop.");
}

function showWarning(msg) {
    if(window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({ title: 'Game Info', message: msg });
    } else {
        // Fallback custom toast instead of ugly alert
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:20px; z-index:10000; font-size:12px;";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(()=>toast.remove(), 2000);
    }
}

async function saveProgress(force = false) {
    if (unsavedTaps === 0) return;
    if (!force && unsavedTaps < MIN_TAPS_TO_SYNC) return;

    try {
        if(window.saveUserData && currentUser && currentUser.uid) {
            await saveUserData(currentUser.uid, {
                balance: currentUser.balance,
                energy: energy,
                lastActive: new Date()
            });
            unsavedTaps = 0; 
            lastSyncTime = Date.now();
        }
    } catch (e) { console.error("Save failed", e); }
}



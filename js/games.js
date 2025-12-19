/* =========================================
   PRO GAMEPLAY + ANTI-CHEAT + ADSTERRA
   ========================================= */

// 🔥 UPDATE THIS WITH YOUR ADSTERRA DIRECT LINK
const ADSTERRA_DIRECT_LINK = "https://www.google.com"; // Replace with your actual Direct Link (e.g., https://bit.ly/...)

let energy = 1000;
const MAX_ENERGY = 1000;
const ENERGY_REGEN_RATE = 2; 
const TAP_VALUE = 1;
const SYNC_INTERVAL = 60000;
const MIN_TAPS_TO_SYNC = 50; 

// Refill Limits
const MAX_FREE_REFILLS = 3;
const MAX_AD_REFILLS = 15;

// Anti-Cheat Variables
let tapTimes = [];
let isBanned = false;
let warningCount = 0;
let unsavedTaps = 0;

// DOM Elements
const balanceEl = document.getElementById('display-balance');
const energyTextEl = document.getElementById('energy-text');
const energyFillEl = document.getElementById('energy-fill');
const coinBtn = document.querySelector('.coin-container');
const refillBtn = document.getElementById('btn-refill');
const refillLabel = document.getElementById('refill-label');

// 1. Initialization
function initGame() {
    checkDailyReset();
    
    // Load Local Data
    const localBalance = localStorage.getItem('local_balance');
    const localEnergy = localStorage.getItem('local_energy');

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

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') saveProgress(true);
    });
}

// 2. Refill Logic (Adsterra Integration)
function checkDailyReset() {
    const lastDate = localStorage.getItem('refill_date');
    const today = new Date().toDateString();

    if (lastDate !== today) {
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
        // Free Boost
        performRefill('free', freeUsed);
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        // 💰 ADSTERRA DIRECT LINK LOGIC
        if(ADSTERRA_DIRECT_LINK) {
            window.open(ADSTERRA_DIRECT_LINK, '_blank'); // Open Ad
            
            // Fake Verify (Give reward after 5 seconds)
            refillBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying Ad...';
            setTimeout(() => {
                performRefill('ad', adUsed);
            }, 5000); // 5 sec delay to simulate watching
        } else {
            showWarning("Ad Link not configured!");
        }
    } 
    else {
        showWarning("🚫 Daily limit reached! Come back tomorrow.");
    }
}

function performRefill(type, currentCount) {
    energy = MAX_ENERGY;
    updateUI();
    
    if(type === 'free') {
        localStorage.setItem('free_refills_used', currentCount + 1);
        showToast("⚡ Full Energy Restored (Free)");
    } else {
        localStorage.setItem('ad_refills_used', currentCount + 1);
        showToast("💰 Energy Restored (Ad Bonus)");
    }
    
    updateRefillUI();
    saveProgress(true);
}

function updateRefillUI() {
    if(!refillBtn || !refillLabel) return;

    let freeUsed = parseInt(localStorage.getItem('free_refills_used') || 0);
    let adUsed = parseInt(localStorage.getItem('ad_refills_used') || 0);

    if (freeUsed < MAX_FREE_REFILLS) {
        refillLabel.innerText = `Free Boost (${MAX_FREE_REFILLS - freeUsed} Left)`;
        refillBtn.classList.remove('disabled');
        refillBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        refillLabel.innerText = `Watch Ad to Refill (${MAX_AD_REFILLS - adUsed} Left)`;
        refillBtn.classList.remove('disabled');
        refillBtn.style.background = "linear-gradient(135deg, #a855f7, #9333ea)"; // Purple for Ads
    } 
    else {
        refillLabel.innerText = "Daily Limit Reached";
        refillBtn.classList.add('disabled');
    }
}

// 3. The Tap Event (With Anti-Cheat)
if (coinBtn) {
    coinBtn.addEventListener('pointerdown', handleTap); 
}

function handleTap(e) {
    if (isBanned) return showWarning("Account Restricted.");
    if (energy < TAP_VALUE) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
        return; 
    }

    // 🛡️ ANTI-CHEAT LOGIC 🛡️
    const now = Date.now();
    tapTimes.push(now);
    
    // Clean old taps (> 1 sec ago)
    tapTimes = tapTimes.filter(t => now - t < 1000);

    // Limit: 15 Taps per second (Human Limit ~8-10)
    if (tapTimes.length > 15) {
        warningCount++;
        if(warningCount > 3) {
            detectBot("CPS Limit Exceeded");
            return;
        }
        showWarning("⚠️ Too Fast! Slow down.");
        return; // Skip this tap
    }

    // Logic
    energy -= TAP_VALUE;
    if (!currentUser.balance) currentUser.balance = 0;
    currentUser.balance += TAP_VALUE;
    unsavedTaps += TAP_VALUE;

    localStorage.setItem('local_balance', currentUser.balance);
    localStorage.setItem('local_energy', energy);

    updateUI();
    spawnFloatingText(e.clientX, e.clientY);
    
    // Tilt Effect
    const rect = coinBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.96)`;
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
    setTimeout(() => floatEl.remove(), 600);
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

// 5. Saving & Warnings
function detectBot(reason) {
    isBanned = true;
    showWarning("🚫 Cheat Detected! Account Flagged.");
    // Optional: Send to Firebase
}

function showWarning(msg) {
    // Custom Toast
    showToast(msg);
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = "position:fixed; top:100px; left:50%; transform:translateX(-50%); background:rgba(255,0,0,0.9); color:#fff; padding:10px 20px; border-radius:12px; z-index:10000; font-size:14px; font-weight:bold; box-shadow: 0 5px 15px rgba(0,0,0,0.5);";
    if(msg.includes("Restored")) toast.style.background = "rgba(0,200,0,0.9)"; // Green for success
    
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 2500);
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
        }
    } catch (e) { console.error("Save failed", e); }
}


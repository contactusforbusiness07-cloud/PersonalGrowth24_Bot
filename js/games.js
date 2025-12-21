/* js/games.js - Pro Gameplay, Anti-Cheat & Adsterra Integration */

/* =========================================
   CONFIG & SETTINGS
   ========================================= */

// 🔥 UPDATE THIS WITH YOUR ADSTERRA DIRECT LINK
const ADSTERRA_DIRECT_LINK = "https://www.google.com"; // Yaha apna Direct Link lagana

// Game Constants
const MAX_ENERGY = 1000;
const ENERGY_REGEN_RATE = 2; // Energy per second
const TAP_VALUE = 1;         // Coins per tap
const SYNC_INTERVAL = 5000;  // Save to Firebase every 5 seconds
const MIN_TAPS_TO_SYNC = 10; // Minimum taps before auto-save

// Refill Limits
const MAX_FREE_REFILLS = 3;
const MAX_AD_REFILLS = 15;

// Variables
let energy = 1000;
let tapTimes = [];   // For Anti-Cheat
let isBanned = false;
let warningCount = 0;
let unsavedTaps = 0; // Batch update queue

/* =========================================
   INITIALIZATION
   ========================================= */

function initGame() {
    console.log("🎮 Game Engine Loaded");
    checkDailyReset();
    
    // 1. Load Local Data (Fast Load)
    const localBalance = localStorage.getItem('local_balance');
    const localEnergy = localStorage.getItem('local_energy');

    // Sync Local Storage with Global User
    if (window.currentUser) {
        if (localBalance && parseInt(localBalance) > window.currentUser.balance) {
            window.currentUser.balance = parseInt(localBalance);
        }
        energy = localEnergy ? parseInt(localEnergy) : (window.currentUser.energy || MAX_ENERGY);
    } else {
        // Fallback if user not loaded yet
        if(localEnergy) energy = parseInt(localEnergy);
    }
    
    // 2. Start Loops
    updateUI();
    updateRefillUI();
    
    // Energy Regeneration Loop
    setInterval(regenEnergy, 1000);
    
    // Auto-Save Loop
    setInterval(() => saveProgress(false), SYNC_INTERVAL);

    // Save on Close/Minimize
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') saveProgress(true);
    });

    // 3. Attach Event Listeners
    const coinBtn = document.querySelector('.coin-container');
    if (coinBtn) {
        // Remove old listeners to prevent duplicates
        const newBtn = coinBtn.cloneNode(true);
        coinBtn.parentNode.replaceChild(newBtn, coinBtn);
        newBtn.addEventListener('pointerdown', handleTap);
        // Tilt Effect reset on mouse leave
        newBtn.addEventListener('mouseleave', () => {
            newBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
}

/* =========================================
   REFILL & ADSTERRA LOGIC
   ========================================= */

function checkDailyReset() {
    const lastDate = localStorage.getItem('refill_date');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        localStorage.setItem('refill_date', today);
        localStorage.setItem('free_refills_used', 0);
        localStorage.setItem('ad_refills_used', 0);
    }
}

// Global function linked to HTML button
window.handleRefill = function() {
    checkDailyReset();
    let freeUsed = parseInt(localStorage.getItem('free_refills_used') || 0);
    let adUsed = parseInt(localStorage.getItem('ad_refills_used') || 0);
    const refillBtn = document.getElementById('btn-refill');

    if (freeUsed < MAX_FREE_REFILLS) {
        // Free Boost
        performRefill('free', freeUsed);
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        // 💰 ADSTERRA LOGIC
        if(ADSTERRA_DIRECT_LINK) {
            window.open(ADSTERRA_DIRECT_LINK, '_blank'); // Open Ad
            
            // Fake Loading UI
            if(refillBtn) refillBtn.innerHTML = 'Verifying Ad...';
            
            // Give reward after 5 seconds
            setTimeout(() => {
                performRefill('ad', adUsed);
            }, 5000); 
        } else {
            showToast("Ad Link not configured!");
        }
    } 
    else {
        showToast("🚫 Daily limit reached! Come back tomorrow.");
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
    saveProgress(true); // Immediate Save
}

function updateRefillUI() {
    const refillBtn = document.getElementById('btn-refill');
    const refillLabel = document.getElementById('refill-label');
    
    if(!refillBtn || !refillLabel) return;

    let freeUsed = parseInt(localStorage.getItem('free_refills_used') || 0);
    let adUsed = parseInt(localStorage.getItem('ad_refills_used') || 0);

    if (freeUsed < MAX_FREE_REFILLS) {
        refillLabel.innerText = `Free Boost (${MAX_FREE_REFILLS - freeUsed} Left)`;
        refillBtn.classList.remove('disabled');
        refillBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)"; // Blue
        refillBtn.innerHTML = 'Recharge';
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        refillLabel.innerText = `Watch Ad (${MAX_AD_REFILLS - adUsed} Left)`;
        refillBtn.classList.remove('disabled');
        refillBtn.style.background = "linear-gradient(135deg, #a855f7, #9333ea)"; // Purple
        refillBtn.innerHTML = 'Watch Ad';
    } 
    else {
        refillLabel.innerText = "Limit Reached";
        refillBtn.classList.add('disabled');
        refillBtn.innerHTML = 'No Refills';
    }
}

/* =========================================
   TAP LOGIC & ANTI-CHEAT
   ========================================= */

function handleTap(e) {
    // 1. Basic Checks
    if (isBanned) return showToast("Account Restricted.");
    if (energy < TAP_VALUE) {
        // Haptic Error
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
        return; 
    }

    // 2. 🛡️ ANTI-CHEAT: CPS (Clicks Per Second) Check
    const now = Date.now();
    tapTimes.push(now);
    // Remove taps older than 1 second
    tapTimes = tapTimes.filter(t => now - t < 1000);

    // Limit: Max 15 taps per second (Humanly impossible to sustain)
    if (tapTimes.length > 18) {
        warningCount++;
        if(warningCount > 5) {
            detectBot("CPS Limit Exceeded");
            return;
        }
        showToast("⚠️ Too Fast! Slow down.");
        return; // Ignore this tap
    }

    // 3. Game Logic
    energy -= TAP_VALUE;
    unsavedTaps += TAP_VALUE;
    
    if (window.currentUser) {
        window.currentUser.balance = (window.currentUser.balance || 0) + TAP_VALUE;
        localStorage.setItem('local_balance', window.currentUser.balance);
    }
    localStorage.setItem('local_energy', energy);

    // 4. UI Updates & Effects
    updateUI();
    
    // Fix: Handle touch vs mouse event for coordinates
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    spawnFloatingText(clientX, clientY);
    
    // 3D Tilt Effect on Coin
    const coinBtn = e.currentTarget;
    const rect = coinBtn.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.96)`;
    setTimeout(() => {
        coinBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 100);

    // Haptic Feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
}

/* =========================================
   UI & ANIMATIONS
   ========================================= */

function updateUI() {
    const balanceEl = document.getElementById('display-balance');
    const headerBal = document.getElementById('header-coin-balance'); // Sync Header
    const energyTextEl = document.getElementById('energy-text');
    const energyFillEl = document.getElementById('energy-fill');

    if (window.currentUser) {
        const bal = Math.floor(window.currentUser.balance).toLocaleString();
        if(balanceEl) balanceEl.innerText = bal;
        if(headerBal) headerBal.innerText = bal;
    }
    
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
        // Only save to local storage occasionally to save performance
        if (energy % 10 === 0) localStorage.setItem('local_energy', energy);
        updateUI();
    }
}

function spawnFloatingText(x, y) {
    const floatEl = document.createElement('div');
    floatEl.className = 'float-text neon-text-gold'; // Added neon class back
    floatEl.innerText = `+${TAP_VALUE}`;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    
    // Try to append to specific layer, else body
    const layer = document.getElementById('click-effects-layer') || document.body;
    layer.appendChild(floatEl);
    
    setTimeout(() => floatEl.remove(), 800);
}

// 🛑 IMPORTANT: Inject CSS Styles for Floating Text (From Old Code)
const style = document.createElement('style');
style.innerHTML = `
.float-text { 
    position: absolute; 
    pointer-events: none; 
    color: #ffd700; 
    font-weight: bold; 
    font-size: 26px; 
    animation: floatUp 0.8s ease-out forwards; 
    z-index: 9999; 
    text-shadow: 0 0 10px rgba(255,215,0,0.8); 
}
@keyframes floatUp { 
    0% { opacity: 1; transform: translateY(0) scale(1); } 
    100% { opacity: 0; transform: translateY(-80px) scale(1.2); } 
}
`;
document.head.appendChild(style);

/* =========================================
   SAVE & ALERTS
   ========================================= */

function detectBot(reason) {
    isBanned = true;
    showToast("🚫 Cheat Detected! Account Flagged.");
    console.error("Bot detected:", reason);
}

// Custom Toast Notification
function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; 
        top: 20px; 
        left: 50%; 
        transform: translateX(-50%); 
        background: rgba(20, 20, 20, 0.95); 
        color: #fff; 
        padding: 12px 24px; 
        border-radius: 12px; 
        z-index: 10000; 
        font-size: 14px; 
        font-weight: bold; 
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        border: 1px solid #333;
    `;
    
    if(msg.includes("Restored")) toast.style.borderColor = "#00ff00"; // Green for success
    if(msg.includes("Limit") || msg.includes("Cheat")) toast.style.borderColor = "#ff0000"; // Red for error

    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 2500);
}

async function saveProgress(force = false) {
    if (unsavedTaps === 0) return;
    if (!force && unsavedTaps < MIN_TAPS_TO_SYNC) return;

    // Use window.currentUser ID or UID safely
    const uid = window.currentUser?.id || window.currentUser?.uid;

    if(window.saveUserData && uid) {
        try {
            // Send TOTAL balance, not just increment
            await window.saveUserData(uid, {
                balance: window.currentUser.balance,
                energy: energy,
                lastActive: new Date().toISOString()
            });
            console.log(`💾 Saved +${unsavedTaps} taps`);
            unsavedTaps = 0; 
        } catch (e) { 
            console.error("Save failed", e); 
        }
    }
}

// Start Game Logic
if(document.readyState === 'complete') initGame();
else window.addEventListener('load', initGame);

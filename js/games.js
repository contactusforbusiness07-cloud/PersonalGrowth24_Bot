/* js/games.js - Merged: 100% Local Storage Fix + Adsterra + Pro Features */

/* =========================================
   CONFIG & SETTINGS
   ========================================= */

// 🔥 UPDATE THIS WITH YOUR ADSTERRA DIRECT LINK
const ADSTERRA_DIRECT_LINK = "https://www.google.com"; // Yaha apna Direct Link lagana

const CLOUD_SAVE_INTERVAL = 21600000; // 6 Hours
const ENERGY_MAX = 1000;
const ENERGY_REGEN_RATE = 2; 
const TAP_VALUE = 1;

// Refill Limits
const MAX_FREE_REFILLS = 3;
const MAX_AD_REFILLS = 15;

// Variables
let energy = 1000;
let localGameBalance = 0; // 🔥 CRITICAL: Manages Balance Locally First
let tapTimes = [];        // For Anti-Cheat
let isBanned = false;
let warningCount = 0;

/* =========================================
   INITIALIZATION
   ========================================= */

function initGame() {
    console.log("🎮 Game Engine Started: Local Storage + Adsterra Ready");
    
    checkDailyReset(); // Check for refill reset

    // 1. Load Data from Phone immediately (PRIORITY)
    const savedBal = localStorage.getItem('local_balance');
    const savedEnergy = localStorage.getItem('local_energy');
    
    if(savedBal) localGameBalance = parseFloat(savedBal);
    if(savedEnergy) energy = parseInt(savedEnergy);
    
    // UI Update immediately
    updateUI();
    updateRefillUI();
    
    // 2. Attach Event Listeners
    const coinBtn = document.querySelector('.coin-container');
    if(coinBtn) {
        const newBtn = coinBtn.cloneNode(true);
        coinBtn.parentNode.replaceChild(newBtn, coinBtn);
        newBtn.addEventListener('pointerdown', handleTap);
        
        // Tilt Effect Reset
        newBtn.addEventListener('mouseleave', () => {
            newBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // 3. Start Loops
    
    // 🔥 Sync Loop (6 Hours) - Uploads Local Data to Firebase
    setInterval(checkAndSyncToFirebase, 60000);
    setTimeout(checkAndSyncToFirebase, 5000); // Try syncing once on load

    // Energy Regen Loop
    setInterval(regenEnergy, 1000);
    
    // 🔥 Watcher: Logic to sync Refer Bonus from Server to Local
    // Agar server par balance jyada hai (Referral ki wajah se), to local update karo.
    // Agar local jyada hai (Gameplay ki wajah se), to local hi rakho.
    setInterval(() => {
        if(window.currentUser && window.currentUser.balance) {
            if(window.currentUser.balance > localGameBalance) {
                localGameBalance = window.currentUser.balance;
                localStorage.setItem('local_balance', localGameBalance);
                updateUI();
            } else if (localGameBalance > window.currentUser.balance) {
                // Main.js ko batao ki local jyada hai
                window.currentUser.balance = localGameBalance;
            }
        }
    }, 2000);

    // Save on Close (Safety Backup)
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') {
            localStorage.setItem('local_balance', localGameBalance);
            localStorage.setItem('local_energy', energy);
        }
    });
}

/* =========================================
   TAP LOGIC & ANTI-CHEAT
   ========================================= */

function handleTap(e) {
    if (isBanned) return showToast("🚫 Account Restricted.");
    
    // 1. Energy Check
    if(energy < TAP_VALUE) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
        return;
    }

    // 2. 🛡️ ANTI-CHEAT: CPS Check
    const now = Date.now();
    tapTimes.push(now);
    tapTimes = tapTimes.filter(t => now - t < 1000); // Keep last 1 sec

    if (tapTimes.length > 18) {
        warningCount++;
        if(warningCount > 5) detectBot("CPS Limit Exceeded");
        showToast("⚠️ Too Fast! Slow down.");
        return;
    }

    // 3. Logic Update (Local Variable Priority)
    energy -= TAP_VALUE;
    localGameBalance += TAP_VALUE; 

    // 4. Save to Phone Storage INSTANTLY (Fixes Disappearing Coins)
    localStorage.setItem('local_balance', localGameBalance); 
    localStorage.setItem('local_energy', energy);

    // 5. Update Global State
    if(window.currentUser) {
        window.currentUser.balance = localGameBalance;
    }

    // 6. Visuals & Effects
    updateUI();
    
    // Handle touch/mouse coordinates
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    spawnFloatingText(clientX, clientY);
    
    // 3D Tilt Effect
    const coinBtn = e.currentTarget;
    const rect = coinBtn.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.96)`;
    setTimeout(() => {
        coinBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 100);
    
    if(typeof window.updateWalletUI === 'function') window.updateWalletUI();
    
    // Haptics
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
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
        performRefill('free', freeUsed);
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        // 💰 ADSTERRA LOGIC
        if(ADSTERRA_DIRECT_LINK) {
            window.open(ADSTERRA_DIRECT_LINK, '_blank');
            if(refillBtn) refillBtn.innerHTML = 'Verifying Ad...';
            
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
    energy = ENERGY_MAX;
    updateUI();
    
    if(type === 'free') {
        localStorage.setItem('free_refills_used', currentCount + 1);
        showToast("⚡ Full Energy Restored (Free)");
    } else {
        localStorage.setItem('ad_refills_used', currentCount + 1);
        showToast("💰 Energy Restored (Ad Bonus)");
    }
    
    updateRefillUI();
    localStorage.setItem('local_energy', energy);
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
        refillBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
        refillBtn.innerHTML = 'Recharge';
    } 
    else if (adUsed < MAX_AD_REFILLS) {
        refillLabel.innerText = `Watch Ad (${MAX_AD_REFILLS - adUsed} Left)`;
        refillBtn.classList.remove('disabled');
        refillBtn.style.background = "linear-gradient(135deg, #a855f7, #9333ea)";
        refillBtn.innerHTML = 'Watch Ad';
    } 
    else {
        refillLabel.innerText = "Limit Reached";
        refillBtn.classList.add('disabled');
        refillBtn.innerHTML = 'No Refills';
    }
}

/* =========================================
   SYNC LOGIC (6-Hour Batching)
   ========================================= */

async function checkAndSyncToFirebase() {
    if(!window.currentUser || !window.currentUser.id) return;

    const lastSync = parseInt(localStorage.getItem('last_cloud_sync') || '0');
    const now = Date.now();

    if (now - lastSync > CLOUD_SAVE_INTERVAL) {
        console.log("⏳ 6 Hours Passed. Syncing to Firebase...");
        
        try {
            if(window.saveUserData) {
                // IMPORTANT: Send 'localGameBalance' as it's the source of truth
                await window.saveUserData(window.currentUser.id, {
                    balance: localGameBalance, 
                    energy: energy,
                    last_active: new Date().toISOString()
                });
                
                localStorage.setItem('last_cloud_sync', now);
                console.log("✅ Data Secured on Cloud.");
                showToast("✅ Progress Saved to Cloud");
            }
        } catch(e) {
            console.error("Sync Failed:", e);
        }
    }
}

/* =========================================
   UI & ANIMATIONS
   ========================================= */

function updateUI() {
    const display = document.getElementById('display-balance');
    const header = document.getElementById('header-coin-balance');
    const eText = document.getElementById('energy-text');
    const eFill = document.getElementById('energy-fill');
    
    // Show Local Balance (It is always fastest)
    const bal = Math.floor(localGameBalance);
    
    if(display) display.innerText = bal.toLocaleString();
    if(header) header.innerText = bal.toLocaleString();

    if(eText) eText.innerText = `${Math.floor(energy)} / ${ENERGY_MAX}`;
    if(eFill) eFill.style.width = `${(energy / ENERGY_MAX) * 100}%`;
}

function regenEnergy() {
    if (energy < ENERGY_MAX) {
        energy += ENERGY_REGEN_RATE;
        if (energy > ENERGY_MAX) energy = ENERGY_MAX;
        // Optimization: Don't save on every tick, save occasionally
        if (Math.floor(energy) % 10 === 0) localStorage.setItem('local_energy', energy);
        updateUI();
    }
}

function spawnFloatingText(x, y) {
    const floatEl = document.createElement('div');
    floatEl.className = 'float-text neon-text-gold';
    floatEl.innerText = `+${TAP_VALUE}`;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    
    const layer = document.getElementById('click-effects-layer') || document.body;
    layer.appendChild(floatEl);
    
    setTimeout(() => floatEl.remove(), 800);
}

function detectBot(reason) {
    isBanned = true;
    showToast("🚫 Cheat Detected! Account Flagged.");
    console.error("Bot detected:", reason);
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'game-toast';
    toast.innerText = msg;
    
    // Dynamic Border Color
    if(msg.includes("Restored") || msg.includes("Saved")) toast.style.borderColor = "#00ff00";
    else if(msg.includes("Limit") || msg.includes("Cheat")) toast.style.borderColor = "#ff0000";
    else toast.style.borderColor = "#333";

    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 2500);
}

// 🛑 INJECT STYLES
const style = document.createElement('style');
style.innerHTML = `
.float-text { position: absolute; pointer-events: none; color: #ffd700; font-weight: bold; font-size: 26px; animation: floatUp 0.8s ease-out forwards; z-index: 9999; text-shadow: 0 0 10px rgba(255,215,0,0.8); }
@keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-80px) scale(1.2); } }
.game-toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(20, 20, 20, 0.95); color: #fff; padding: 12px 24px;
    border-radius: 12px; z-index: 10000; font-size: 14px; font-weight: bold;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); border: 1px solid #333;
}
`;
document.head.appendChild(style);

if(document.readyState === 'complete') initGame();
else window.addEventListener('load', initGame);

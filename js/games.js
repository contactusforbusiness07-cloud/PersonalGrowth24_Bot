/* =========================================
   CORE GAMEPLAY LOGIC (HIGH PERFORMANCE MODE)
   ========================================= */

let energy = 1000;
const MAX_ENERGY = 1000;
const ENERGY_REGEN_RATE = 2; // Energy per second
const TAP_VALUE = 1;

// --- OPTIMIZATION CONFIG ---
const SYNC_INTERVAL = 60000; // 60 Seconds (Aggressive Batching)
const MIN_TAPS_TO_SYNC = 50; // Kam se kam itne tap hone par hi DB call jayegi

// Anti-Cheat Variables
let tapTimes = [];
let isBanned = false;
let unsavedTaps = 0; // Batching for Firebase
let lastSyncTime = Date.now();

// DOM Elements
const balanceEl = document.getElementById('display-balance');
const energyTextEl = document.getElementById('energy-text');
const energyFillEl = document.getElementById('energy-fill');
const coinBtn = document.querySelector('.coin-container');

// 1. Initialization
function initGame() {
    // A. Local Storage se load karo (Fastest)
    const localBalance = localStorage.getItem('local_balance');
    const localEnergy = localStorage.getItem('local_energy');

    if (localBalance) {
        if(currentUser) currentUser.balance = parseInt(localBalance);
    }
    
    // B. Firebase User State Overlay (Authority)
    if (currentUser) {
        // Agar local balance server se kam hai, to server wala maano
        if (!localBalance || parseInt(localBalance) < currentUser.balance) {
            localStorage.setItem('local_balance', currentUser.balance);
        }
        
        // Energy Sync
        if (localEnergy) {
            energy = parseInt(localEnergy);
        } else {
            energy = currentUser.energy !== undefined ? currentUser.energy : MAX_ENERGY;
        }
        
        updateUI();
    }
    
    // Start Regen Loop
    setInterval(regenEnergy, 1000);
    
    // Start Server Sync Loop (Every 60 Seconds)
    setInterval(saveProgress, SYNC_INTERVAL);

    // Save on Window Close/Minimize (Mobile optimized)
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') {
            saveProgress(true); // Force Save
        }
    });
}

// 2. The Tap Event
if (coinBtn) {
    coinBtn.addEventListener('pointerdown', handleTap); 
}

function handleTap(e) {
    if (isBanned) return showWarning("Account Restricted: Suspicious Activity detected.");
    if (energy < TAP_VALUE) return; // Not enough energy

    // --- SECURITY CHECK: Click Speed ---
    const now = Date.now();
    tapTimes.push(now);
    if (tapTimes.length > 10) tapTimes.shift();
    if (tapTimes.length >= 10 && (now - tapTimes[0] < 400)) {
        detectBot("Speed Hacking");
        return;
    }

    // --- GAMEPLAY LOGIC ---
    
    // 1. Deduct Energy
    energy -= TAP_VALUE;
    
    // 2. Add Coins (Update Local State Immediately)
    if (!currentUser.balance) currentUser.balance = 0;
    currentUser.balance += TAP_VALUE;
    unsavedTaps += TAP_VALUE;

    // 3. Save to LocalStorage (Instant & Free)
    localStorage.setItem('local_balance', currentUser.balance);
    localStorage.setItem('local_energy', energy);

    // 4. UI Updates
    updateUI();
    
    // 5. Visual Effects
    spawnFloatingText(e.clientX, e.clientY);
    
    // 3D Tilt Effect
    const rect = coinBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.95)`;
    setTimeout(() => {
        coinBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 100);

    // Haptic Feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
}

// 3. Helper Functions

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
    
    // Balance
    balanceEl.innerText = Math.floor(currentUser.balance).toLocaleString();
    
    // Energy
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
        
        // Update LocalStorage occasionally (not every second to save CPU)
        if (energy % 10 === 0) {
            localStorage.setItem('local_energy', energy);
        }
        updateUI();
    }
}

// 4. Security & Saving (Optimized for 50k Users)

function detectBot(reason) {
    isBanned = true;
    console.warn(`BOT DETECTED: ${reason}`);
    showWarning("⚠️ Warning: Auto-clicker detected. Stop or risk ban.");
}

function showWarning(msg) {
    // Simple alert for now, can be upgraded to Toast
    if(window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({ title: 'Alert', message: msg });
    } else {
        alert(msg);
    }
}

// 🔥 CRITICAL: THE SAVE LOGIC 🔥
async function saveProgress(force = false) {
    // Condition 1: Agar unsaved taps 0 hai, to save mat karo (Save DB Write)
    if (unsavedTaps === 0) return;

    // Condition 2: Agar unsaved taps kam hain (e.g. < 50) aur Force save nahi hai, to wait karo
    if (!force && unsavedTaps < MIN_TAPS_TO_SYNC) return;

    console.log(`Saving ${unsavedTaps} taps to Firebase...`);

    try {
        // Use the global saving function from main.js
        if(window.saveUserData && currentUser && currentUser.uid) {
            await saveUserData(currentUser.uid, {
                balance: currentUser.balance,
                energy: energy,
                lastActive: new Date() // Updates 'lastActive' timestamp
            });
            unsavedTaps = 0; // Reset counter after successful save
            lastSyncTime = Date.now();
        }
    } catch (e) {
        console.error("Save failed, will retry next cycle", e);
        // Retry logic is built-in: unsavedTaps won't reset, so it tries again later.
    }
}


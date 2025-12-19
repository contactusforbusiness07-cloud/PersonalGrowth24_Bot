/* =========================================
   CORE GAMEPLAY LOGIC
   ========================================= */

let energy = 1000;
const MAX_ENERGY = 1000;
const ENERGY_REGEN_RATE = 2; // Energy per second
const TAP_VALUE = 1;

// Anti-Cheat Variables
let tapTimes = [];
let isBanned = false;
let unsavedTaps = 0; // Batching for Firebase

// DOM Elements
const balanceEl = document.getElementById('display-balance');
const energyTextEl = document.getElementById('energy-text');
const energyFillEl = document.getElementById('energy-fill');
const coinBtn = document.querySelector('.coin-container');

// 1. Initialization
function initGame() {
    // Load from currentUser state
    if (currentUser) {
        energy = currentUser.energy !== undefined ? currentUser.energy : MAX_ENERGY;
        updateUI();
    }
    
    // Start Regen Loop
    setInterval(regenEnergy, 1000);
    
    // Start Auto-Save Loop (Save every 5 seconds to reduce DB writes)
    setInterval(saveProgress, 5000);
}

// 2. The Tap Event (attached in HTML or here)
if (coinBtn) {
    coinBtn.addEventListener('pointerdown', handleTap); // pointerdown is faster than click
}

function handleTap(e) {
    if (isBanned) return showWarning("Account Restricted: Suspicious Activity detected.");
    if (energy < TAP_VALUE) return; // Not enough energy

    // --- SECURITY CHECK 1: Click Speed ---
    const now = Date.now();
    tapTimes.push(now);
    // Keep only last 10 taps
    if (tapTimes.length > 10) tapTimes.shift();
    
    // If user did 10 taps in under 400ms (Impossible for humans) -> Block
    if (tapTimes.length >= 10 && (now - tapTimes[0] < 400)) {
        detectBot("Speed Hacking");
        return;
    }

    // --- SECURITY CHECK 2: Coordinate Consistency (Bot check) ---
    // Bots often click the EXACT same pixel (e.g., X:150, Y:150) repeatedly.
    // Real users vary slightly. We will implement this in V2 if needed.
    
    // --- GAMEPLAY LOGIC ---
    
    // 1. Deduct Energy
    energy -= TAP_VALUE;
    
    // 2. Add Coins (Local State)
    currentUser.balance += TAP_VALUE;
    unsavedTaps += TAP_VALUE;

    // 3. UI Updates
    updateUI();
    
    // 4. Visual Effects (Floating +1)
    spawnFloatingText(e.clientX, e.clientY);
    
    // 5. 3D Tilt Effect
    const rect = coinBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    coinBtn.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(0.95)`;
    setTimeout(() => {
        coinBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 100);

    // 6. Haptic Feedback (Telegram Native)
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
    document.getElementById('click-effects-layer').appendChild(floatEl);
    
    // Clean up DOM
    setTimeout(() => floatEl.remove(), 1000);
}

function updateUI() {
    // Balance
    balanceEl.innerText = Math.floor(currentUser.balance).toLocaleString();
    
    // Energy
    energyTextEl.innerText = `${Math.floor(energy)} / ${MAX_ENERGY}`;
    const percent = (energy / MAX_ENERGY) * 100;
    energyFillEl.style.width = `${percent}%`;
}

function regenEnergy() {
    if (energy < MAX_ENERGY) {
        energy += ENERGY_REGEN_RATE;
        if (energy > MAX_ENERGY) energy = MAX_ENERGY;
        updateUI();
    }
}

// 4. Security & Saving

function detectBot(reason) {
    isBanned = true;
    console.warn(`BOT DETECTED: ${reason}`);
    showWarning("⚠️ Warning: Auto-clicker detected. Stop or risk ban.");
    // In production, send a flag to Firebase to mark this user
}

function showWarning(msg) {
    // Simple alert or custom toast
    alert(msg);
}

async function saveProgress() {
    if (unsavedTaps > 0) {
        // Save to Firebase via main.js function
        try {
            await saveUserData(currentUser.uid, {
                balance: currentUser.balance,
                energy: energy,
                lastActive: new Date()
            });
            unsavedTaps = 0; // Reset batch
        } catch (e) {
            console.error("Save failed", e);
        }
    }
}

// Initialize when file loads (or call initGame() from main.js)
// initGame(); 


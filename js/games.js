// --- TAP TO EARN LOGIC ---

// Configuration
const CONFIG = {
    coinsPerTap: 1,
    maxEnergy: 1000,
    regenRate: 3 // Energy per second
};

// State
let currentEnergy = 1000;
let localScore = 0; 

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    updateEnergyUI();
    
    // Regenerate Energy Loop
    setInterval(() => {
        if(currentEnergy < CONFIG.maxEnergy) {
            currentEnergy += CONFIG.regenRate;
            if(currentEnergy > CONFIG.maxEnergy) currentEnergy = CONFIG.maxEnergy;
            updateEnergyUI();
        }
    }, 1000);
});

// --- TAP HANDLER ---
window.handleTap = function(event) {
    // 1. Check Energy
    if (currentEnergy < CONFIG.coinsPerTap) {
        // Haptic Feedback (Error)
        if(window.navigator.vibrate) window.navigator.vibrate(50);
        return; 
    }

    // 2. Reduce Energy
    currentEnergy -= CONFIG.coinsPerTap;
    updateEnergyUI();

    // 3. Add Score (Visually)
    localScore += CONFIG.coinsPerTap;
    // Note: Isko Firebase me save karna hai to main.js ke through karna hoga.
    // Abhi ke liye hum sirf UI update kar rahe hain.
    const headerBalance = document.getElementById('header-coin-balance');
    if(headerBalance) {
        let current = parseInt(headerBalance.innerText || '0');
        headerBalance.innerText = current + CONFIG.coinsPerTap;
    }

    // 4. Visual Effects (Floating +1)
    showFloatingText(event.clientX, event.clientY);
    animateCoinButton();

    // 5. Haptic Feedback (Success)
    if(window.navigator.vibrate) window.navigator.vibrate(15);
};

// --- UI UPDATES ---
function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    const current = document.getElementById('energy-current');
    
    if(fill) fill.style.width = `${(currentEnergy / CONFIG.maxEnergy) * 100}%`;
    if(current) current.innerText = Math.floor(currentEnergy);
}

function animateCoinButton() {
    const coin = document.getElementById('big-coin');
    coin.style.transform = "scale(0.95)";
    setTimeout(() => coin.style.transform = "scale(1)", 100);
}

function showFloatingText(x, y) {
    const text = document.createElement('div');
    text.className = 'floating-text';
    text.innerText = `+${CONFIG.coinsPerTap}`;
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;
    
    document.body.appendChild(text);
    
    setTimeout(() => {
        text.remove();
    }, 1000);
}


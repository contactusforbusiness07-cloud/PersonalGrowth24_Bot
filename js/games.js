/* js/games.js - TAP TAP ENGINE (Instant Wallet Update) */

let energy = 1000;
const MAX_ENERGY = 1000;
const RECHARGE_RATE = 2; // Energy per second

document.addEventListener('DOMContentLoaded', () => {
    initTapGame();
});

function initTapGame() {
    const coin = document.getElementById('tap-coin');
    if(coin) {
        // Fix: Remove old listeners to prevent duplicates if any
        const newCoin = coin.cloneNode(true);
        coin.parentNode.replaceChild(newCoin, coin);
        
        // Multi-touch support
        newCoin.addEventListener('pointerdown', handleTap);
    }
    
    setInterval(rechargeEnergy, 1000);
}

function handleTap(e) {
    if (energy <= 0) return;

    // 1. Calculate Earnings (Rank based multiplier logic can be added here)
    const earnings = 5; 
    energy -= 2;
    updateEnergyUI();

    // 2. 🔥 INSTANT WALLET UPDATE
    if(window.addCoins) window.addCoins(earnings);

    // 3. Visual Effects
    showFloatingText(e.clientX, e.clientY, `+${earnings}`);
    animateCoinPress(e.target);
}

function showFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.innerText = text;
    el.className = 'floating-score';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => { el.remove(); }, 800);
}

function animateCoinPress(coin) {
    coin.style.transform = "scale(0.95)";
    setTimeout(() => coin.style.transform = "scale(1)", 50);
}

function rechargeEnergy() {
    if (energy < MAX_ENERGY) {
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

// Power Ups (Placeholder Logic)
window.activatePower = function(type) {
    Swal.fire({
        title: 'Activated!',
        text: type === 'booster' ? '2x Multiplier Active' : 'Energy Refilled',
        icon: 'success',
        background: '#020617', color: '#fff',
        timer: 1500, showConfirmButton: false
    });
    
    if(type === 'refill') {
        energy = MAX_ENERGY;
        updateEnergyUI();
    }
};

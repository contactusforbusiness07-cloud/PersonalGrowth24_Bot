/* js/wallet.js - METAVERSE MINING ENGINE */

// --- CONFIGURATION ---
const EXCHANGE_RATE = 100000; // 100k = 1 Unit
const MINING_SPEED_MS = 2000; // Visual update speed

// --- NATIVE ADS (The "Boosters") ---
// Add your Adsterra/Affiliate links here disguised as "Boosts"
const walletBoosters = [
    {
        title: "Activate Cloud Node",
        desc: "Boost mining speed by 1.5x",
        url: "https://www.binance.com/en", // Replace with Ad Link
        icon: "fa-solid fa-server",
        tag: "BOOST"
    },
    {
        title: "Claim Phase 1 Bonus",
        desc: "Secure 5,000 Coin Allocation",
        url: "https://google.com", // Replace with Ad Link
        icon: "fa-solid fa-gift",
        tag: "BONUS"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initWallet();
});

function initWallet() {
    updateBalanceDisplay();
    renderNativeAd();
    startMiningSimulation();
}

// --- 1. UI UPDATE ---
function updateBalanceDisplay() {
    const bal = localStorage.getItem('local_balance') || "0";
    const balanceEl = document.getElementById('wallet-balance');
    const usdEl = document.getElementById('wallet-usd');
    
    if(balanceEl) {
        // Format with commas
        balanceEl.innerText = Math.floor(parseFloat(bal)).toLocaleString();
        
        // Update USD Estimate
        const usd = (parseFloat(bal) / EXCHANGE_RATE).toFixed(4);
        if(usdEl) usdEl.innerText = `≈ $${usd} USDT`;
    }

    updateRank(parseFloat(bal));
}

// --- 2. RANK SYSTEM ---
function updateRank(balance) {
    const rankEl = document.getElementById('wallet-rank');
    if(!rankEl) return;

    if(balance < 10000) rankEl.innerText = "SCOUT NODE";
    else if(balance < 50000) rankEl.innerText = "MINER CLASS";
    else if(balance < 200000) rankEl.innerText = "OPERATOR";
    else rankEl.innerText = "WHALE NODE";
}

// --- 3. NATIVE AD INJECTION (Stealth Mode) ---
function renderNativeAd() {
    const container = document.getElementById('wallet-ad-container');
    if(!container) return;

    // Pick a random booster/ad
    const ad = walletBoosters[Math.floor(Math.random() * walletBoosters.length)];

    container.innerHTML = `
        <div class="wallet-booster-card" onclick="window.open('${ad.url}', '_blank')">
            <div class="booster-tag">${ad.tag}</div>
            <div class="booster-icon">
                <i class="${ad.icon}"></i>
            </div>
            <div class="booster-info">
                <h4>${ad.title}</h4>
                <p>${ad.desc}</p>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#fff; opacity:0.5; margin-left:auto;"></i>
        </div>
    `;
}

// --- 4. MINING SIMULATION (Visual Only) ---
// This creates the "Live" feeling without spamming the database
function startMiningSimulation() {
    setInterval(() => {
        const sparkContainer = document.querySelector('.balance-val');
        if(!sparkContainer) return;

        // Create a visual spark element
        const spark = document.createElement('span');
        spark.className = 'mining-spark';
        spark.innerText = '+0.01';
        sparkContainer.appendChild(spark);

        // Remove it after animation
        setTimeout(() => spark.remove(), 2000);

    }, MINING_SPEED_MS);
}

// --- 5. WITHDRAWAL HANDLER ---
window.handleLockedWithdraw = function() {
    Swal.fire({
        icon: 'info',
        title: 'PHASE 1: ACCUMULATION',
        html: `
            <div style="text-align:left; font-size:13px; color:#cbd5e1;">
                <p><i class="fa-solid fa-lock text-red"></i> <b>Transfers Locked</b></p>
                <p style="margin-top:10px;">Mining phase is currently active. Withdrawals will open after the <b>Token Generation Event (TGE)</b>.</p>
                <br>
                <p style="color:#eab308; text-align:center;">Keep mining to maximize allocation!</p>
            </div>
        `,
        background: '#020617',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'ACKNOWLEDGED'
    });
}

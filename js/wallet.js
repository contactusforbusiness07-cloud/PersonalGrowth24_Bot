/* js/wallet.js - SECURE VAULT LOGIC (WITHDRAWAL PAUSED) */

const EXCHANGE_RATE = 100000; // 100k Coins = 1 INR (Example)
const MIN_WITHDRAW = 500000; // Minimum coins needed

document.addEventListener('DOMContentLoaded', () => {
    updateWalletUI();
});

// --- UI UPDATER ---
function updateWalletUI() {
    const bal = localStorage.getItem('local_balance') || "0";
    
    // Update Hero Balance
    const heroBal = document.getElementById('wallet-coins');
    if(heroBal) {
        heroBal.innerText = Math.floor(parseFloat(bal)).toLocaleString();
    }

    // Determine Rank
    updateRankCard(parseFloat(bal));
    
    // Update Button State
    updateWithdrawButton(parseFloat(bal));
}

// --- RANK LOGIC ---
function updateRankCard(balance) {
    const rankName = document.getElementById('user-rank-name');
    const rankIcon = document.getElementById('user-rank-icon');
    
    if(!rankName) return;

    if(balance < 10000) {
        rankName.innerText = "ROOKIE SCOUT";
        rankName.style.color = "#94a3b8";
    } else if(balance < 100000) {
        rankName.innerText = "ELITE OPERATOR";
        rankName.style.color = "#3b82f6";
    } else {
        rankName.innerText = "COMMANDER";
        rankName.style.color = "#eab308"; // Gold
    }
}

// --- CALCULATOR LOGIC ---
window.calculateRealMoney = function(coins) {
    const resultEl = document.getElementById('calc-result');
    if(!coins) {
        resultEl.innerText = "₹0.00";
        return;
    }
    const inr = (parseInt(coins) / EXCHANGE_RATE).toFixed(2);
    resultEl.innerText = `₹${inr}`;
}

// --- BUTTON STATE (UPDATED: COMING SOON) ---
function updateWithdrawButton(balance) {
    const container = document.getElementById('action-btn-container');
    if(!container) return;

    if(balance >= MIN_WITHDRAW) {
        // CASE 1: Balance Pura Hai -> Lekin Withdrawal "Coming Soon" Hai
        // Humne Green button hata kar Blue/Purple "System Update" button laga diya
        container.innerHTML = `
            <button class="btn-withdraw" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);" onclick="handleComingSoon()">
                <i class="fa-solid fa-rocket"></i> WITHDRAWAL COMING SOON
            </button>
        `;
    } else {
        // CASE 2: Balance Kam Hai -> Locked Dikhana zaruri hai motivation ke liye
        const progress = Math.min((balance / MIN_WITHDRAW) * 100, 100).toFixed(0);
        container.innerHTML = `
            <button class="btn-withdraw btn-locked" onclick="Swal.fire({icon:'info', title:'Locked', text:'Reach 500k coins to unlock the vault.', background:'#020617', color:'#fff'})">
                <i class="fa-solid fa-lock"></i> LOCKED (${progress}%)
            </button>
        `;
    }
}

// --- COMING SOON HANDLER ---
window.handleComingSoon = function() {
    Swal.fire({
        icon: 'info',
        title: 'Phase 2 Loading...',
        html: '<p>Direct withdrawals are temporarily paused as we prepare for the <b>Token Generation Event</b>.</p><br><p style="color:#fbbf24">Keep mining to increase your allocation!</p>',
        background: '#020617',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'OK, I WILL WAIT'
    });
}

// (Old Withdrawal Handler Removed for Safety)

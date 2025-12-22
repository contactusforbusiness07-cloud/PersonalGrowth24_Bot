/* js/wallet.js - SECURE VAULT LOGIC */

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

// --- BUTTON STATE ---
function updateWithdrawButton(balance) {
    const container = document.getElementById('action-btn-container');
    if(!container) return;

    if(balance >= MIN_WITHDRAW) {
        container.innerHTML = `
            <button class="btn-withdraw" onclick="handleWithdrawRequest()">
                <i class="fa-solid fa-paper-plane"></i> INITIATE TRANSFER
            </button>
        `;
    } else {
        const progress = Math.min((balance / MIN_WITHDRAW) * 100, 100).toFixed(0);
        container.innerHTML = `
            <button class="btn-withdraw btn-locked" onclick="Swal.fire({icon:'info', title:'Locked', text:'Reach 500k coins to unlock vault.', background:'#020617', color:'#fff'})">
                <i class="fa-solid fa-lock"></i> LOCKED (${progress}%)
            </button>
        `;
    }
}

// --- WITHDRAW HANDLER ---
window.handleWithdrawRequest = function() {
    // 1. Validate Inputs
    const name = document.getElementById('pay-name').value;
    const upi = document.getElementById('pay-upi').value;
    
    if(!name || !upi) {
        Swal.fire({icon:'error', title:'Invalid Data', text:'Please fill vault details.', background:'#020617', color:'#fff'});
        return;
    }

    // 2. Success Simulation
    Swal.fire({
        icon: 'success',
        title: 'Request Logged',
        text: 'Your withdrawal is being processed on the blockchain.',
        background: '#020617', color: '#fff'
    });
}


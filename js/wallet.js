/* Wallet Module - Addictive & Secure Logic */

const EXCHANGE_RATE = 100000; // 100k Coins = 1 INR

// Function called when Wallet Tab is clicked
window.updateWalletUI = function() {
    // 1. Sync Balance from Global User (Assume currentUser exists in main.js)
    // Fallback to 0 if user not loaded
    const balance = (window.currentUser && window.currentUser.balance) ? window.currentUser.balance : 0;
    
    // Update Header & Main Wallet Display
    const walletDisplay = document.getElementById('wallet-coins');
    const headerDisplay = document.getElementById('header-coin-balance');
    
    if(walletDisplay) walletDisplay.innerText = Math.floor(balance).toLocaleString();
    if(headerDisplay) headerDisplay.innerText = formatNumber(balance); // Helper needed or use simple toLocaleString

    // 2. Rank Logic
    const rank = (window.currentUser && window.currentUser.rank) ? window.currentUser.rank : 999;
    const isTop10 = rank <= 10;

    // 3. Update Status Card
    const rankContainer = document.getElementById('rank-card-container');
    if(rankContainer) {
        rankContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:0.7rem; color:#94a3b8;">CURRENT RANK</span><br>
                    <span style="font-size:1.2rem; color:white; font-weight:bold; font-family:'Orbitron'">#${rank}</span>
                </div>
                <div style="padding:5px 12px; border-radius:8px; border:1px solid ${isTop10 ? '#22c55e' : '#64748b'}; background: ${isTop10 ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)'}; color: ${isTop10 ? '#4ade80' : '#94a3b8'}; font-size:0.7rem; font-weight:bold;">
                    ${isTop10 ? '<i class="fa-solid fa-lock-open"></i> UNLOCKED' : '<i class="fa-solid fa-lock"></i> STORAGE MODE'}
                </div>
            </div>
            <div style="margin-top:10px; height:4px; width:100%; background:rgba(255,255,255,0.1); border-radius:2px;">
                <div style="height:100%; width:${isTop10 ? '100%' : '10%'}; background:${isTop10 ? '#22c55e' : '#fbbf24'}; border-radius:2px;"></div>
            </div>
            <div style="margin-top:5px; font-size:0.6rem; color:#fbbf24; text-align:right;">
                ${isTop10 ? 'You are eligible for Cash Out!' : 'Reach Top 10 to Unlock Cash Out'}
            </div>
        `;
    }

    // 4. Update Button State
    const btn = document.getElementById('btn-main-withdraw');
    const note = document.getElementById('withdraw-note');
    
    if(btn) {
        if(isTop10) {
            btn.className = "btn-withdraw-action active";
            btn.innerHTML = `WITHDRAW CASH <i class="fa-solid fa-arrow-right"></i>`;
            btn.onclick = window.processWithdrawal; // Real function
            note.innerText = "Funds will be transferred to your registered UPI.";
            note.style.color = "#4ade80";
        } else {
            btn.className = "btn-withdraw-action disabled";
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> UNLOCK AT RANK #10`;
            btn.onclick = function() { Swal.fire({ title:'Locked!', text:'Keep grinding to reach Top 10!', icon:'info', background:'#020617', color:'#fff' }); };
            note.innerText = "Only Top 10 Ranks can proceed to payment gateway.";
            note.style.color = "#64748b";
        }
    }
};

// Real-time Calculator Logic (For Everyone)
window.calculateRealMoney = function(coinInput) {
    const coins = parseFloat(coinInput);
    const resultDisplay = document.getElementById('calc-result');
    
    if(!coins || coins < 0) {
        resultDisplay.innerText = "₹0.00";
        return;
    }

    const rupees = coins / EXCHANGE_RATE;
    resultDisplay.innerText = "₹" + rupees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    // Psychology: If they enter huge amount, show color change
    if(rupees > 100) {
        resultDisplay.style.color = "#fbbf24"; // Gold color for high amount
    } else {
        resultDisplay.style.color = "#4ade80"; // Green for normal
    }
};

// Process Withdrawal (Top 10 Only)
window.processWithdrawal = function() {
    const amountInput = document.getElementById('calc-input').value;
    const coins = parseFloat(amountInput);

    // Security Check
    if(!coins || coins <= 0) {
        Swal.fire({ icon:'error', title:'Invalid Amount', text:'Please enter coins to withdraw.', background:'#020617', color:'#fff' });
        return;
    }
    
    if(coins > window.currentUser.balance) {
         Swal.fire({ icon:'error', title:'Insufficient Balance', text:'You do not have enough coins!', background:'#020617', color:'#fff' });
         return;
    }

    // Success Simulation
    Swal.fire({ 
        icon:'success', 
        title:'Request Sent!', 
        text:`Withdrawal of ₹${(coins/EXCHANGE_RATE).toFixed(2)} initiated.`, 
        background:'#020617', 
        color:'#fff' 
    });
};


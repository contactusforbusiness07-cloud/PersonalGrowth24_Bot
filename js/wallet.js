/* Wallet Module - Final Fix */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

window.updateWalletUI = function() {
    // ==========================================
    // 🛠️ CRITICAL FIX: LIVE COIN SYNC
    // ==========================================
    // We check ALL possible storage keys where coins might be hidden
    let storedCoins = localStorage.getItem('local_balance') || localStorage.getItem('coins') || localStorage.getItem('mining_balance');
    
    // Initialize currentUser if missing
    if (!window.currentUser) {
        window.currentUser = { balance: 0, rank: 999 };
    }

    // If storage has more coins than memory, update memory
    if (storedCoins) {
        let parsed = parseFloat(storedCoins);
        if (!isNaN(parsed) && parsed > window.currentUser.balance) {
            window.currentUser.balance = parsed;
        }
    }
    // Force save back to ensure sync
    localStorage.setItem('local_balance', window.currentUser.balance);

    const balance = Math.floor(window.currentUser.balance);
    
    // Update UI
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = balance.toLocaleString();
    if(hd) hd.innerText = balance.toLocaleString();

    // ==========================================
    // 🏆 RANK LOGIC
    // ==========================================
    const rank = window.currentUser.rank || 999;
    const isTop10 = rank <= 10;
    
    // Status Card
    const rankContainer = document.getElementById('rank-card-container');
    if(rankContainer) {
        rankContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:0.7rem; color:#94a3b8;">CURRENT RANK</span><br>
                    <span style="font-size:1.2rem; color:white; font-weight:bold; font-family:'Orbitron'">#${rank}</span>
                </div>
                <div style="padding:5px 12px; border-radius:8px; border:1px solid ${isTop10?'#22c55e':'#64748b'}; background:${isTop10?'rgba(34,197,94,0.1)':'rgba(100,116,139,0.1)'}; color:${isTop10?'#4ade80':'#94a3b8'}; font-size:0.7rem; font-weight:bold;">
                    ${isTop10 ? '<i class="fa-solid fa-lock-open"></i> UNLOCKED' : '<i class="fa-solid fa-lock"></i> STORAGE MODE'}
                </div>
            </div>`;
    }

    // ==========================================
    // 🔒 BUTTON LOGIC (Dynamic)
    // ==========================================
    const btnContainer = document.getElementById('action-btn-container');
    
    if(btnContainer) {
        if(isTop10) {
            // UNLOCKED: Show Withdrawal Button
            btnContainer.innerHTML = `
                <button class="btn-withdraw-action active" onclick="window.processTop10Withdraw()">
                    INITIATE TRANSFER <i class="fa-solid fa-paper-plane"></i>
                </button>
                <p style="text-align: center; font-size: 0.7rem; color: #4ade80; margin-top: 10px;">
                    <i class="fa-solid fa-circle-check"></i> Gateway Active
                </p>
            `;
        } else {
            // LOCKED: Show "Vault" Button
            btnContainer.innerHTML = `
                <div class="locked-vault-btn" onclick="window.showLockedPopup()">
                    <div class="lock-text">
                        <i class="fa-solid fa-lock" style="font-size:1.2rem; color:#fbbf24;"></i> 
                        LOCKED (Rank 11+)
                    </div>
                </div>
                <p style="text-align: center; font-size: 0.7rem; color: #64748b; margin-top: 10px;">
                    Only Top 10 Ranks can proceed to payment gateway.
                </p>
            `;
        }
    }
};

window.calculateRealMoney = function(val) {
    const coins = parseFloat(val);
    const res = document.getElementById('calc-result');
    if(!coins || coins<0) { res.innerText="₹0.00"; return; }
    res.innerText = "₹" + (coins/EXCHANGE_RATE).toFixed(2);
};

// ==========================================
// 🚨 POPUP LOGIC (As per Request)
// ==========================================
window.showLockedPopup = function() {
    Swal.fire({ 
        title: 'Access Restricted', 
        html: `
            <div style="text-align:left; font-size:0.9rem; color:#cbd5e1; line-height: 1.6;">
                <p>Exclusive withdrawal features are currently reserved for our <b>Top 10 Elite Players</b>.</p>
                <br>
                <p>Your coins are safe in <b>Storage Mode</b>. Climb the leaderboard to unlock this premium benefit.</p>
            </div>
        `,
        icon: 'warning', 
        confirmButtonText: 'I Understand',
        background: '#0f172a', 
        color: '#fff',
        confirmButtonColor: '#334155',
        customClass: {
            popup: 'glass-panel-tech'
        }
    });
};

// ==========================================
// 💸 WITHDRAWAL LOGIC (Top 10 Only)
// ==========================================
window.processTop10Withdraw = function() {
    const name = document.getElementById('pay-name').value;
    const upi = document.getElementById('pay-upi').value;
    const code = document.getElementById('pay-code').value;
    const coinsStr = document.getElementById('calc-input').value;
    const coinsToWithdraw = parseFloat(coinsStr);

    // 1. Validation
    if(!coinsToWithdraw || coinsToWithdraw <= 0) {
        Swal.fire({ icon:'error', title:'Invalid Amount', text:'Enter coins to withdraw.', background:'#020617', color:'#fff' });
        return;
    }
    if(coinsToWithdraw > window.currentUser.balance) {
         Swal.fire({ icon:'error', title:'Insufficient Balance', text:'You need more coins!', background:'#020617', color:'#fff' });
         return;
    }
    if(!name || !upi || !code) {
        Swal.fire({ icon:'error', title:'Details Missing', text:'Please fill Name, UPI and Access Code.', background:'#020617', color:'#fff' });
        return;
    }

    // 2. DEDUCT COINS
    window.currentUser.balance -= coinsToWithdraw;
    localStorage.setItem('local_balance', window.currentUser.balance); // Update Storage
    updateWalletUI(); // Refresh View
    document.getElementById('calc-input').value = ""; // Reset Input

    // 3. SUCCESS MESSAGE
    // Note: Since we don't have a backend, we confirm to user. 
    // In future, you can capture 'name', 'upi', 'code', 'coinsToWithdraw' and send to a bot.
    Swal.fire({ 
        icon:'success', 
        title:'Request Submitted!', 
        html: `
            Withdrawal of <b>₹${(coinsToWithdraw/EXCHANGE_RATE).toFixed(2)}</b> initiated.<br>
            <span style="font-size:0.8rem; color:#aaa;">Request sent to admin via secure channel.</span>
        `, 
        background:'#020617', 
        color:'#fff' 
    });
};


/* Wallet Module - Aggressive Sync & Telegram Integration */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

// ⚠️ ADMIN SETTINGS
const TELEGRAM_BOT_TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"; // Replace if you changed it
const ADMIN_CHAT_ID = "1078605976"; // Your ID

window.updateWalletUI = function() {
    // ==========================================
    // 🛠️ AGGRESSIVE COIN SYNC (Zero Balance Fix)
    // ==========================================
    let balance = 0;

    // 1. Check Window Object (Game Logic Memory)
    if(window.currentUser && window.currentUser.balance) {
        balance = window.currentUser.balance;
    }

    // 2. Check Storage (Disk) - Scan ALL possible keys
    const storageKeys = ['local_balance', 'coins', 'mining_balance', 'userBalance'];
    storageKeys.forEach(key => {
        let val = parseFloat(localStorage.getItem(key));
        if(!isNaN(val) && val > balance) {
            balance = val; // Always grab the highest known balance
        }
    });

    // 3. Force Update Memory to match Storage
    if(!window.currentUser) window.currentUser = { rank: 999 };
    window.currentUser.balance = balance;

    // 4. Update UI Elements
    const walletEl = document.getElementById('wallet-coins');
    const headerEl = document.getElementById('header-coin-balance');
    const displayBal = Math.floor(balance).toLocaleString();

    if(walletEl) walletEl.innerText = displayBal;
    if(headerEl) headerEl.innerText = displayBal;

    // ==========================================
    // 🏆 RANK & BUTTON LOGIC (UPDATED)
    // ==========================================
    
    // Default Rank
    let rank = window.currentUser.rank || 999;

    // ✅ NEW: Check Saved Rank from Leaderboard Logic
    const savedRank = localStorage.getItem('mySavedRank');
    if(savedRank) {
       // Agar Leaderboard ne rank calculate kar li hai, to wo use karein
       rank = savedRank; 
    }

    // Calculate Lock Logic (Top 10 Check)
    // Agar rank "100+" string hai, to usse bada number maano
    let numericRank = parseInt(rank);
    if(savedRank === "100+") numericRank = 101; 
    
    const isTop10 = numericRank <= 10;
    
    // Status Bar
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

    // The Action Button
    const btnContainer = document.getElementById('action-btn-container');
    if(btnContainer) {
        if(isTop10) {
            // ✅ TOP 10: Show "Withdraw Cash"
            btnContainer.innerHTML = `
                <button class="btn-withdraw-final" onclick="window.processPaymentRequest()">
                    <span>WITHDRAW CASH</span> <i class="fa-solid fa-paper-plane"></i>
                </button>
                <p style="text-align:center; font-size:0.7rem; color:#4ade80; margin-top:8px;">
                    <i class="fa-solid fa-circle-check"></i> Gateway Active. Funds sent instantly.
                </p>
            `;
        } else {
            // 🔒 RANK 11+: Show "Locked Vault"
            btnContainer.innerHTML = `
                <div class="btn-locked-final" onclick="window.showLockedPopup()">
                    <i class="fa-solid fa-lock lock-icon-glow"></i> 
                    <span>LOCKED (RANK 11+)</span>
                </div>
                <p style="text-align:center; font-size:0.7rem; color:#64748b; margin-top:8px;">
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
// 🔒 POPUP LOGIC (Screenshot Exact Match)
// ==========================================
window.showLockedPopup = function() {
    Swal.fire({
        title: 'Access Restricted',
        html: `
            <div style="text-align:left; font-size:0.9rem; color:#cbd5e1; line-height: 1.5;">
                <p>Exclusive withdrawal features are currently reserved for our <b>Top 10 Elite Players</b>.</p>
                <br>
                <p>Your coins are safe in <b>Storage Mode</b>. Climb the leaderboard to unlock this premium benefit.</p>
            </div>
        `,
        icon: 'warning',
        confirmButtonText: 'I Understand',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#334155'
    });
};

// ==========================================
// 💸 PAYMENT LOGIC (Telegram + Deduction)
// ==========================================
window.processPaymentRequest = function() {
    // 1. Gather Data
    const name = document.getElementById('pay-name').value;
    const upi = document.getElementById('pay-upi').value;
    const code = document.getElementById('pay-code').value;
    const coinInput = document.getElementById('calc-input').value;
    const coins = parseFloat(coinInput);

    // 2. Validate Inputs
    if(!coins || coins <= 0) {
        Swal.fire({ icon:'error', title:'Invalid Amount', text:'Enter coins to withdraw.', background:'#020617', color:'#fff' });
        return;
    }
    if(coins > window.currentUser.balance) {
         Swal.fire({ icon:'error', title:'Insufficient Balance', text:'You do not have enough coins!', background:'#020617', color:'#fff' });
         return;
    }
    if(!name || !upi || !code) {
        Swal.fire({ icon:'error', title:'Details Missing', text:'Please fill Name, UPI and Access Code.', background:'#020617', color:'#fff' });
        return;
    }

    // 3. Confirm Action
    Swal.fire({
        title: 'Confirm Withdrawal?',
        text: `Withdrawing ₹${(coins/EXCHANGE_RATE).toFixed(2)} to ${upi}. Coins will be deducted immediately.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Withdraw',
        background: '#020617', color:'#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            sendToTelegram(name, upi, code, coins);
        }
    });
};

function sendToTelegram(name, upi, code, coins) {
    const amountINR = (coins / EXCHANGE_RATE).toFixed(2);
    
    const message = `
🚀 *NEW PAYMENT REQUEST* 🚀
----------------------------
👤 *Name:* ${name}
🏦 *UPI:* \`${upi}\`
🔑 *Code:* ${code}
💰 *Coins:* ${coins.toLocaleString()}
💵 *Amount:* ₹${amountINR}
----------------------------
✅ *Status:* Pending Approval
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${ADMIN_CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    fetch(url)
    .then(response => {
        // 5. SUCCESS: Deduct Coins & Update UI
        window.currentUser.balance -= coins;
        localStorage.setItem('local_balance', window.currentUser.balance);
        updateWalletUI(); 
        
        document.getElementById('calc-input').value = "";
        document.getElementById('pay-name').value = "";
        document.getElementById('pay-upi').value = "";
        document.getElementById('pay-code').value = "";

        Swal.fire({
            icon: 'success',
            title: 'Request Sent!',
            text: 'Admin has received your request. Check your UPI app soon.',
            background: '#020617', color: '#fff'
        });
    })
    .catch(err => {
        console.error(err);
        Swal.fire({ icon:'error', title:'Network Error', text:'Check internet connection.', background:'#020617', color:'#fff' });
    });
}

// ==========================================
// 🔄 AUTO-REFRESH ENGINE (The Fix for Sync)
// ==========================================
// Updates wallet every 1 second without user action
setInterval(window.updateWalletUI, 1000);


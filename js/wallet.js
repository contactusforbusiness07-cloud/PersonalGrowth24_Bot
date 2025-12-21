/* Wallet Module - Live Sync, Telegram & UX Fix */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

// ⚠️⚠️ IMPORTANT: REPLACE THESE WITH YOUR DETAILS ⚠️⚠️
const TELEGRAM_BOT_TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"; // Put your Token here
const ADMIN_CHAT_ID = "1078605976"; // Your Chat ID

window.updateWalletUI = function() {
    // ==========================================
    // 🛠️ FORCE COIN SYNC (Zero Balance Fix)
    // ==========================================
    // We check ALL possible storage keys used by games.js
    let storedCoins = localStorage.getItem('local_balance') || localStorage.getItem('coins');
    
    // Ensure currentUser object exists
    if (!window.currentUser) {
        window.currentUser = { balance: 0, rank: 999 };
    }

    // Force update from storage if it exists
    if (storedCoins) {
        let parsed = parseFloat(storedCoins);
        if (!isNaN(parsed)) {
            // Always take the higher value (Game vs Memory)
            if(parsed > window.currentUser.balance) {
                window.currentUser.balance = parsed;
            }
        }
    }
    // Save back to ensure consistency
    localStorage.setItem('local_balance', window.currentUser.balance);

    const balance = Math.floor(window.currentUser.balance);
    
    // UI Update
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = balance.toLocaleString();
    if(hd) hd.innerText = balance.toLocaleString();

    // ==========================================
    // 🏆 RANK LOGIC
    // ==========================================
    const rank = window.currentUser.rank || 999;
    const isTop10 = rank <= 10;
    
    // 1. Rank Status Bar
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

    // 2. THE MAIN ACTION BUTTON (Submit or Locked)
    const btnContainer = document.getElementById('action-btn-container');
    if(btnContainer) {
        if(isTop10) {
            // ✅ TOP 10: Show "Withdraw Now" (This is the missing Submit Button)
            btnContainer.innerHTML = `
                <button class="btn-withdraw-final" onclick="window.processPaymentRequest()">
                    <span>WITHDRAW CASH</span> <i class="fa-solid fa-paper-plane"></i>
                </button>
                <p style="text-align:center; font-size:0.7rem; color:#4ade80; margin-top:8px;">
                    <i class="fa-solid fa-circle-check"></i> Gateway Active
                </p>
            `;
        } else {
            // 🔒 RANK 11+: Show "Locked Vault" (This is the screenshot box)
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
// 🔒 POPUP LOGIC (Screenshot Replica)
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
// 💸 PROCESS PAYMENT (Telegram + Deduction)
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
    
    // Telegram Message Format
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

    // 4. Send to API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${ADMIN_CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    fetch(url)
    .then(response => {
        // 5. SUCCESS: Deduct Coins & Update UI
        window.currentUser.balance -= coins;
        localStorage.setItem('local_balance', window.currentUser.balance);
        updateWalletUI(); // Live Refresh
        
        // Clear Inputs
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
        // Fallback if offline
        Swal.fire({ icon:'error', title:'Network Error', text:'Could not connect to Telegram server.', background:'#020617', color:'#fff' });
    });
}


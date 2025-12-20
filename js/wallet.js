/* Wallet Module - Sync, Design & Telegram Integration */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

// ⚠️⚠️ ADMIN SETUP: FILL THESE TO RECEIVE PAYMENTS ⚠️⚠️
const TELEGRAM_BOT_TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"; // Example: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
const ADMIN_CHAT_ID = "1078605976"; // Your Chat ID: 1078605976

window.updateWalletUI = function() {
    // ==========================================
    // 🛠️ COIN SYNC FIX (Load from Game Storage)
    // ==========================================
    let savedCoins = localStorage.getItem('local_balance');
    let gameEnergy = localStorage.getItem('local_energy'); // Sometimes data hides here
    
    // Ensure currentUser exists
    if (!window.currentUser) {
        window.currentUser = { balance: 0, rank: 999, referrals: 0 };
    }

    // Update memory if storage is newer
    if (savedCoins) {
        let parsed = parseFloat(savedCoins);
        if (!isNaN(parsed)) window.currentUser.balance = parsed;
    }

    const balance = Math.floor(window.currentUser.balance);
    
    // UI Update
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = balance.toLocaleString();
    if(hd) hd.innerText = balance.toLocaleString();

    // ==========================================
    // 🏆 RANK & BUTTON LOGIC
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
                    ${isTop10 ? '<i class="fa-solid fa-lock-open"></i> UNLOCKED' : '<i class="fa-solid fa-lock"></i> STORAGE'}
                </div>
            </div>`;
    }

    // 2. The Main Action Button (Submit or Locked)
    const btnContainer = document.getElementById('action-btn-container');
    if(btnContainer) {
        if(isTop10) {
            // ✅ TOP 10: Show "Withdraw Now" (Submit Button)
            btnContainer.innerHTML = `
                <button class="btn-withdraw-final" onclick="window.processPaymentRequest()">
                    <span>Withdraw Cash</span> <i class="fa-solid fa-paper-plane"></i>
                </button>
                <p style="text-align:center; font-size:0.7rem; color:#4ade80; margin-top:8px;">
                    <i class="fa-solid fa-circle-check"></i> You are eligible for payout
                </p>
            `;
        } else {
            // 🔒 RANK 11+: Show "Locked" (Popup Trigger)
            btnContainer.innerHTML = `
                <button class="btn-locked-final" onclick="window.showLockedPopup()">
                    <i class="fa-solid fa-lock" style="color:#fbbf24;"></i> Locked (Rank 11+)
                </button>
                <p style="text-align:center; font-size:0.7rem; color:#64748b; margin-top:8px;">
                    Only Top 10 Ranks can submit request
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
// 🔒 POPUP LOGIC (As per Screenshot)
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
// 💸 PAYMENT LOGIC (Send to Telegram)
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
        Swal.fire({ icon:'error', title:'Missing Details', text:'Please fill Name, UPI and Access Code.', background:'#020617', color:'#fff' });
        return;
    }

    // 3. Confirm
    Swal.fire({
        title: 'Confirm Withdrawal?',
        text: `Withdrawing ₹${(coins/EXCHANGE_RATE).toFixed(2)} to ${upi}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Send Request',
        background: '#020617', color:'#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            sendTelegramMessage(name, upi, code, coins);
        }
    });
};

function sendTelegramMessage(name, upi, code, coins) {
    const amountINR = (coins / EXCHANGE_RATE).toFixed(2);
    const message = `
🚀 *NEW WITHDRAWAL REQUEST* 🚀
----------------------------
👤 *Name:* ${name}
UPI: \`${upi}\`
🔑 *Code:* ${code}
💰 *Coins:* ${coins.toLocaleString()}
💵 *Amount:* ₹${amountINR}
----------------------------
Please verify and process.
    `;

    // 4. Send to Telegram API
    // Note: If you don't set Token, it will simulate success.
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${ADMIN_CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    fetch(url)
    .then(response => {
        // 5. SUCCESS: Deduct Coins & Update UI
        window.currentUser.balance -= coins;
        localStorage.setItem('local_balance', window.currentUser.balance);
        updateWalletUI();
        document.getElementById('calc-input').value = ""; // Clear input

        Swal.fire({
            icon: 'success',
            title: 'Request Sent!',
            text: 'Your withdrawal request has been sent to the admin for processing.',
            background: '#020617', color: '#fff'
        });
    })
    .catch(err => {
        console.error(err);
        Swal.fire({ icon:'error', title:'Network Error', text:'Could not connect to server.', background:'#020617', color:'#fff' });
    });
}

/* Wallet Module - Live Sync & Pro Logic */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

window.updateWalletUI = function() {
    // --- 1. LIVE SYNC FIX ---
    // Forcefully read from localStorage to get the exact coin count from the Game
    const localCoins = localStorage.getItem('local_balance'); // Matches games.js save logic
    
    if (window.currentUser) {
        // If localStorage has newer data than currentUser (common when switching tabs), update it.
        if(localCoins) {
            const parsedCoins = parseFloat(localCoins);
            if(!isNaN(parsedCoins)) {
                window.currentUser.balance = parsedCoins;
            }
        }
    } else {
        // Initialize if missing
        window.currentUser = { 
            balance: localCoins ? parseFloat(localCoins) : 0, 
            rank: 999 
        };
    }

    const balance = Math.floor(window.currentUser.balance);
    
    // Update UI Displays
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = balance.toLocaleString();
    if(hd) hd.innerText = balance.toLocaleString();

    // --- 2. Rank Logic ---
    const rank = window.currentUser.rank || 999;
    const isTop10 = rank <= 10;
    
    // Update Rank Card
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

    // --- 3. Button Logic (Design Match) ---
    const btn = document.getElementById('btn-main-withdraw');
    const note = document.getElementById('withdraw-note');
    
    if(btn) {
        if(isTop10) {
            // Enabled for Top 10
            btn.className = "btn-withdraw-action active";
            btn.innerHTML = `INITIATE TRANSFER <i class="fa-solid fa-paper-plane"></i>`;
            btn.onclick = window.tryWithdraw; 
            note.innerText = "Funds will be sent to your UPI instantly.";
            note.style.color = "#4ade80";
        } else {
            // "Look Locked" for Rank 11+ (But still clickable to show Popup)
            btn.className = "btn-withdraw-action disabled";
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> LOCKED (RANK 11+)`;
            btn.onclick = window.tryWithdraw; // Still calls function to show rejection popup
            note.innerText = "Only Top 10 Ranks can proceed to payment gateway.";
            note.style.color = "#64748b";
        }
    }
};

window.calculateRealMoney = function(val) {
    const coins = parseFloat(val);
    const res = document.getElementById('calc-result');
    if(!coins || coins<0) { res.innerText="₹0.00"; return; }
    res.innerText = "₹" + (coins/EXCHANGE_RATE).toFixed(2);
};

// --- WITHDRAWAL & POPUP LOGIC ---
window.tryWithdraw = function() {
    const amountInput = document.getElementById('calc-input').value;
    const upiInput = document.getElementById('upi-id-input').value;
    const coinsToWithdraw = parseFloat(amountInput);
    const rank = window.currentUser.rank || 999;
    const isTop10 = rank <= 10;

    // 1. NON-TOP 10 REJECTION (Professional English)
    if(!isTop10) {
        Swal.fire({ 
            title: 'Access Restricted', 
            html: `
                <div style="text-align:left; font-size:0.9rem; color:#cbd5e1;">
                    <p>Exclusive withdrawal features are currently reserved for our <b>Top 10 Elite Players</b>.</p>
                    <p style="margin-top:10px;">Your coins are safe in <b>Storage Mode</b>. Climb the leaderboard to unlock this premium benefit.</p>
                </div>
            `,
            icon: 'lock', 
            confirmButtonText: 'I Understand',
            background: '#0f172a', 
            color: '#fff',
            confirmButtonColor: '#334155'
        });
        return;
    }

    // 2. Validate Amount
    if(!coinsToWithdraw || coinsToWithdraw <= 0) {
        Swal.fire({ icon:'error', title:'Invalid Amount', text:'Enter coins to withdraw.', background:'#020617', color:'#fff' });
        return;
    }
    if(coinsToWithdraw > window.currentUser.balance) {
         Swal.fire({ icon:'error', title:'Insufficient Balance', text:'You need more coins!', background:'#020617', color:'#fff' });
         return;
    }

    // 3. Validate UPI
    if(upiInput.length < 5 || !upiInput.includes('@')) {
        Swal.fire({ icon:'error', title:'Invalid Payment Details', text:'Please enter a valid UPI ID.', background:'#020617', color:'#fff' });
        return;
    }

    // 4. SUCCESS: Deduct Coins & Process
    window.currentUser.balance -= coinsToWithdraw; // Deduct from memory
    localStorage.setItem('local_balance', window.currentUser.balance); // Save to storage
    
    // Update UI immediately
    updateWalletUI(); 
    document.getElementById('calc-input').value = ""; // Clear input

    Swal.fire({ 
        icon:'success', 
        title:'Transfer Initiated', 
        text:`₹${(coinsToWithdraw/EXCHANGE_RATE).toFixed(2)} is being processed.`, 
        background:'#020617', 
        color:'#fff' 
    });
};

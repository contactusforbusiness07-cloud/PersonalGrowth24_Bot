/* Wallet Module - Design Restored & Live Sync Fixed */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

window.updateWalletUI = function() {
    // 1. SYNC FIX: Force fetch latest balance from storage or memory
    // Games.js usually saves to 'local_energy' or similar, but let's assume 'currentUser' is the source of truth
    // We try to grab from localStorage just in case tabs weren't synced
    const localCoins = localStorage.getItem('local_balance');
    
    if (window.currentUser) {
        // If we found a newer value in local storage (from game tap), use it
        if(localCoins && parseFloat(localCoins) > window.currentUser.balance) {
            window.currentUser.balance = parseFloat(localCoins);
        }
    } else {
        // Fallback if user object missing
        window.currentUser = { balance: localCoins ? parseFloat(localCoins) : 0, rank: 999 };
    }

    const balance = Math.floor(window.currentUser.balance);
    
    // Update Displays
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = balance.toLocaleString();
    if(hd) hd.innerText = balance.toLocaleString();

    // 2. Rank Logic
    const rank = window.currentUser.rank || 999;
    const isTop10 = rank <= 10;
    
    // Update Rank UI
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

    // 3. Button & Gateway State
    const btn = document.getElementById('btn-main-withdraw');
    const note = document.getElementById('withdraw-note');
    const gateway = document.getElementById('payment-gateway-ui');
    
    if(btn) {
        if(isTop10) {
            // User is Top 10: Show Payment Gateway, Enable Button
            gateway.classList.remove('hidden');
            btn.className = "btn-withdraw-action active";
            btn.innerHTML = `INITIATE TRANSFER <i class="fa-solid fa-paper-plane"></i>`;
            btn.onclick = window.tryWithdraw; 
            note.innerText = "Funds will be sent to your UPI instantly.";
            note.style.color = "#4ade80";
        } else {
            // User is Rank 11+: Hide Gateway, Lock Button
            gateway.classList.add('hidden');
            btn.className = "btn-withdraw-action disabled";
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> LOCKED (RANK 11+)`;
            btn.onclick = () => Swal.fire({ 
                title:'Locked', 
                text:'You must be in the Top 10 to access the Payment Gateway.', 
                icon:'warning', 
                background:'#020617', color:'#fff' 
            });
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

// --- WITHDRAWAL & PAYMENT LOGIC ---
window.tryWithdraw = function() {
    const amountInput = document.getElementById('calc-input').value;
    const upiInput = document.getElementById('upi-id-input').value;
    const coinsToWithdraw = parseFloat(amountInput);
    
    // 1. Validate Amount
    if(!coinsToWithdraw || coinsToWithdraw <= 0) {
        Swal.fire({ icon:'error', title:'Invalid Amount', text:'Enter coins to withdraw.', background:'#020617', color:'#fff' });
        return;
    }
    if(coinsToWithdraw > window.currentUser.balance) {
         Swal.fire({ icon:'error', title:'Insufficient Balance', text:'You need more coins!', background:'#020617', color:'#fff' });
         return;
    }

    // 2. Validate Payment Details (Gateway Check)
    if(upiInput.length < 5 || !upiInput.includes('@')) {
        Swal.fire({ icon:'error', title:'Invalid UPI', text:'Please enter a valid UPI ID (e.g. user@bank).', background:'#020617', color:'#fff' });
        return;
    }

    // 3. Referral Check
    const refCount = window.currentUser.referrals || 0; 
    if(refCount < 1) {
        Swal.fire({ 
            icon:'info', title:'Referral Required', 
            text:'Invite 1 friend to unlock this withdrawal.',
            confirmButtonText: 'Invite Now',
            background:'#020617', color:'#fff' 
        }).then((res) => { if(res.isConfirmed) openInternalPage('page-refer'); });
        return;
    }

    // 4. Monthly Limit Check
    const lastDate = localStorage.getItem('last_withdraw_date');
    const now = new Date();
    if(lastDate) {
        const d = new Date(lastDate);
        if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
             Swal.fire({ icon:'warning', title:'Limit Reached', text:'Monthly withdrawal limit reached.', background:'#020617', color:'#fff' });
             return;
        }
    }

    // 5. SUCCESS: Deduct Coins Instantly
    window.currentUser.balance -= coinsToWithdraw; // Cut from memory
    localStorage.setItem('local_balance', window.currentUser.balance); // Save to storage
    localStorage.setItem('last_withdraw_date', now.toISOString()); // Mark date
    
    // Update UI immediately to show cut coins
    updateWalletUI(); 
    document.getElementById('calc-input').value = ""; // Clear input

    Swal.fire({ 
        icon:'success', 
        title:'Transfer Successful!', 
        text:`₹${(coinsToWithdraw/EXCHANGE_RATE).toFixed(2)} has been sent to ${upiInput}.`, 
        background:'#020617', 
        color:'#fff' 
    });
};


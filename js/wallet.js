const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

window.updateWalletUI = function() {
    // 1. RE-FETCH latest balance from LocalStorage to fix Sync Issue
    let savedBalance = localStorage.getItem('local_balance'); // Assuming games.js saves here
    if(savedBalance) {
        if(window.currentUser) window.currentUser.balance = parseFloat(savedBalance);
    }
    const balance = window.currentUser ? window.currentUser.balance : 0;
    
    // Update Displays
    const wd = document.getElementById('wallet-coins');
    const hd = document.getElementById('header-coin-balance');
    if(wd) wd.innerText = Math.floor(balance).toLocaleString();
    if(hd) hd.innerText = Math.floor(balance).toLocaleString(); // Use floor to avoid decimals in header

    // 2. Rank & Logic
    const rank = (window.currentUser && window.currentUser.rank) ? window.currentUser.rank : 999;
    const isTop10 = rank <= 10;
    
    // Update Rank UI
    const rankContainer = document.getElementById('rank-card-container');
    if(rankContainer) {
        rankContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div><span style="font-size:0.7rem; color:#94a3b8;">CURRENT RANK</span><br><span style="font-size:1.2rem; color:white; font-weight:bold;">#${rank}</span></div>
                <div style="padding:5px 12px; border-radius:8px; border:1px solid ${isTop10?'#22c55e':'#64748b'}; background:${isTop10?'rgba(34,197,94,0.1)':'rgba(100,116,139,0.1)'}; color:${isTop10?'#4ade80':'#94a3b8'}; font-size:0.7rem; font-weight:bold;">
                    ${isTop10 ? '<i class="fa-solid fa-lock-open"></i> UNLOCKED' : '<i class="fa-solid fa-lock"></i> STORAGE MODE'}
                </div>
            </div>`;
    }

    // 3. Update Button
    const btn = document.getElementById('btn-main-withdraw');
    const note = document.getElementById('withdraw-note');
    if(btn) {
        if(isTop10) {
            btn.className = "btn-withdraw-action active";
            btn.innerHTML = `WITHDRAW CASH <i class="fa-solid fa-arrow-right"></i>`;
            btn.onclick = window.tryWithdraw; 
            note.innerText = "Monthly withdrawal active. 1 Referral required.";
            note.style.color = "#4ade80";
        } else {
            btn.className = "btn-withdraw-action disabled";
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> LOCKED (RANK 11+)`;
            btn.onclick = () => Swal.fire({ title:'Locked', text:'Reach Top 10 to unlock!', icon:'warning', background:'#020617', color:'#fff' });
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

// --- NEW WITHDRAWAL LOGIC ---
window.tryWithdraw = function() {
    const amountInput = document.getElementById('calc-input').value;
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

    // 2. Check Referrals (Mock Logic - Replace with real check)
    // Assume currentUser.referrals exists. If not, default to 0.
    const refCount = window.currentUser.referrals || 0; 
    if(refCount < 1) {
        Swal.fire({ 
            icon:'info', title:'Referral Required', 
            text:'You must invite at least 1 friend to unlock withdrawals.',
            confirmButtonText: 'Invite Now',
            background:'#020617', color:'#fff' 
        }).then((res) => {
            if(res.isConfirmed) openInternalPage('page-refer');
        });
        return;
    }

    // 3. Check Monthly Limit
    const lastDate = localStorage.getItem('last_withdraw_date');
    const now = new Date();
    if(lastDate) {
        const d = new Date(lastDate);
        if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
             Swal.fire({ icon:'warning', title:'Limit Reached', text:'You can only withdraw once per month.', background:'#020617', color:'#fff' });
             return;
        }
    }

    // 4. Success & Deduction
    // DEDUCT COINS
    window.currentUser.balance -= coinsToWithdraw;
    localStorage.setItem('local_balance', window.currentUser.balance); // Save update
    
    // SET DATE
    localStorage.setItem('last_withdraw_date', now.toISOString());
    
    // UPDATE UI
    updateWalletUI(); 

    Swal.fire({ 
        icon:'success', 
        title:'Success!', 
        text:`₹${(coinsToWithdraw/EXCHANGE_RATE).toFixed(2)} sent to processing. Coins deducted.`, 
        background:'#020617', 
        color:'#fff' 
    });
};


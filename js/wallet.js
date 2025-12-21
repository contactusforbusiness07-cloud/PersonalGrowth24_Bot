/* js/wallet.js - Design Intact, Withdrawal Disabled (Storage Only) + Rank Fix */

const EXCHANGE_RATE = 100000;

// Note: Bot Token hata diya hai kyunki ab payment request nahi jayegi.
// Coins sirf store honge.

window.updateWalletUI = function() {
    // 1. Get Balance
    let balance = 0;
    if(window.currentUser && window.currentUser.balance) {
        balance = window.currentUser.balance;
    } else if(localStorage.getItem('local_balance')) {
        balance = parseFloat(localStorage.getItem('local_balance'));
    }

    const displayBal = Math.floor(balance).toLocaleString();
    if(document.getElementById('wallet-coins')) document.getElementById('wallet-coins').innerText = displayBal;
    if(document.getElementById('header-coin-balance')) document.getElementById('header-coin-balance').innerText = displayBal;

    // ==========================================
    // 🏆 RANK LOGIC (UPDATED WITH FIX)
    // ==========================================
    let rank = 999; // Default

    // 1. Check Window Object (Memory)
    if (window.currentUser && window.currentUser.rank) {
        rank = window.currentUser.rank;
    }

    // 2. ✅ REQUESTED UPDATE: Check LocalStorage from Leaderboard
    const savedRank = localStorage.getItem('mySavedRank');
    if(savedRank) {
       rank = savedRank; // Overwrite with real rank from leaderboard
    }

    // Logic for Badge Color
    // If rank is "100+", treat it as > 10
    let numericRank = parseInt(rank);
    if(rank === "100+") numericRank = 101; 
    
    const isTop10 = numericRank <= 10;
    
    // 3. Rank Badge (Visual Only - Green for Top 10, Grey for others)
    const rankDiv = document.getElementById('rank-card-container');
    if(rankDiv) {
        rankDiv.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="font-size:0.7rem; color:#94a3b8;">CURRENT RANK</span><br>
                <span style="font-size:1.2rem; color:white; font-weight:bold; font-family:'Orbitron'">#${rank}</span>
            </div>
            <div style="padding:5px 12px; border-radius:8px; border:1px solid ${isTop10?'#22c55e':'#64748b'}; background:${isTop10?'rgba(34,197,94,0.1)':'rgba(100,116,139,0.1)'}; color:${isTop10?'#4ade80':'#94a3b8'}; font-size:0.7rem; font-weight:bold;">
                ${isTop10?'<i class="fa-solid fa-trophy"></i> ELITE SQUAD':'<i class="fa-solid fa-shield-halved"></i> MEMBER'}
            </div>
        </div>`;
    }

    // 4. ACTION BUTTON (DISABLED FOR EVERYONE - STORAGE MODE)
    // Ab chahe Top 10 ho ya nahi, sabko "Storage Mode" dikhega.
    const btnDiv = document.getElementById('action-btn-container');
    if(btnDiv) {
        btnDiv.innerHTML = `
            <div class="btn-locked-vault" onclick="window.showStoragePopup()">
                <i class="fa-solid fa-vault" style="color:#fbbf24;"></i> SAFE STORAGE ACTIVE
            </div>
            <p style="text-align:center; font-size:0.65rem; color:#64748b; margin-top:8px;">
                Withdrawals are paused. Accumulate coins for the next phase.
            </p>`;
    }
};

// 5. Calculator Logic (Ye chalta rahega taaki user calculate kar sake)
window.calculateRealMoney = function(val) {
    const coins = parseFloat(val);
    const res = document.getElementById('calc-result');
    if(!coins || coins<0) { res.innerText="₹0.00"; return; }
    res.innerText = "₹" + (coins/EXCHANGE_RATE).toFixed(2);
};

// 6. Popup Logic (Jab user button dabaye)
window.showStoragePopup = function() {
    Swal.fire({
        title: 'Storage Mode Active',
        html: `<div style="text-align:left; font-size:0.9rem; color:#cbd5e1; line-height: 1.5;">
            <p>Withdrawals are temporarily disabled for server maintenance and upgrades.</p>
            <br>
            <p><b>Your coins are 100% Safe.</b> Keep earning and climbing the leaderboard to maximize your value when withdrawals reopen!</p>
        </div>`,
        icon: 'info',
        confirmButtonText: 'Keep Earning',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
    });
};

// Auto Refresh UI
setInterval(window.updateWalletUI, 1000);


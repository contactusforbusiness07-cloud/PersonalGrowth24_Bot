/* =========================================
   GAME REWARD WALLET LOGIC
   ========================================= */

const CONVERSION_DIVISOR = 100000; // 100,000 Coins = 1 Unit (Rupee)
// NOTE: For testing, you can manually set window.currentUser.rank in console

function initWallet() {
    updateWalletUI();
    renderHistory();
}

function updateWalletUI() {
    if(!currentUser) return;

    // 1. Update Coins (Real-time look)
    const coins = Math.floor(currentUser.balance || 0);
    const coinDisplay = document.getElementById('wallet-coins-display');
    if(coinDisplay) coinDisplay.innerText = coins.toLocaleString();

    // 2. Rank Logic
    // Default to rank 999 if not set
    const userRank = currentUser.rank || 105; 
    document.getElementById('user-rank-display').innerText = userRank;

    const rankContainer = document.getElementById('rank-status-container');
    const withdrawView = document.getElementById('withdrawal-view');
    const storageView = document.getElementById('storage-view');

    // Reset Classes
    rankContainer.innerHTML = '';
    withdrawView.classList.add('hidden');
    storageView.classList.add('hidden');

    if (userRank <= 10) {
        // ✅ TOP 10: ELIGIBLE
        rankContainer.innerHTML = `
            <div class="rank-status-card eligible">
                <div class="rs-info">
                    <h4>You are Top 10! 🏆</h4>
                    <p>Cash withdrawal enabled.</p>
                </div>
                <div class="rs-badge">Cash Active</div>
            </div>
        `;
        withdrawView.classList.remove('hidden');
    } else {
        // 🔒 RANK 11+: STORAGE MODE
        rankContainer.innerHTML = `
            <div class="rank-status-card locked">
                <div class="rs-info">
                    <h4>Current Rank: #${userRank}</h4>
                    <p>Reach Top 10 to unlock cash.</p>
                </div>
                <div class="rs-badge">Storage Mode</div>
            </div>
        `;
        storageView.classList.remove('hidden');
    }
}

// --- WITHDRAWAL LOGIC (Top 10 Only) ---
window.calculateCoinCost = function(inrAmount) {
    const cost = Math.floor(inrAmount * CONVERSION_DIVISOR);
    document.getElementById('coin-cost-display').innerText = cost.toLocaleString();
    
    const displayEl = document.getElementById('coin-cost-display');
    if(currentUser.balance < cost) {
        displayEl.style.color = '#ef4444'; // Red
    } else {
        displayEl.style.color = '#fff'; // White
    }
}

window.handleWithdraw = async function() {
    const inrAmount = parseFloat(document.getElementById('withdraw-inr').value);
    
    if(!inrAmount || inrAmount <= 0) {
        showToast("⚠️ Enter valid amount");
        return;
    }

    const coinCost = inrAmount * CONVERSION_DIVISOR;

    if(currentUser.balance < coinCost) {
        showToast("🚫 Not enough coins!");
        return;
    }

    // Processing Simulation
    Swal.fire({
        title: 'Processing...',
        text: 'Verifying Rank & Balance',
        background: '#020617',
        color: '#fff',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(async () => {
        // Deduct Coins
        currentUser.balance -= coinCost;
        
        // Save to Firebase (Simulated Backend Update)
        if(window.saveUserData) {
            await saveUserData(currentUser.uid, { 
                balance: currentUser.balance,
                lastWithdrawal: new Date()
            });
        }

        updateWalletUI(); // Refresh UI
        document.getElementById('withdraw-inr').value = '';
        document.getElementById('coin-cost-display').innerText = '0';
        
        // Add to History
        addHistoryItem("Cash Withdrawal", "Processing", `-${coinCost.toLocaleString()}`, false);

        Swal.fire({
            icon: 'success',
            title: 'Request Sent!',
            text: `₹${inrAmount} withdrawal request submitted. Status: Pending Approval.`,
            background: '#020617',
            color: '#fff',
            confirmButtonColor: '#22c55e'
        });

    }, 2000);
}

// --- HISTORY LOGIC ---
function renderHistory() {
    const list = document.getElementById('wallet-history-list');
    list.innerHTML = ''; // Clear
    
    // Fake Data for Demo
    const mockHistory = [
        { title: "Tap Game Reward", date: "Today, 10:00 AM", amount: "+500", type: "earn" },
        { title: "Referral Bonus", date: "Yesterday", amount: "+1,000", type: "earn" }
    ];

    mockHistory.forEach(item => {
        addHistoryItem(item.title, item.date, item.amount, true);
    });
}

function addHistoryItem(title, date, amount, isEarn) {
    const list = document.getElementById('wallet-history-list');
    const div = document.createElement('div');
    div.className = 'hist-item';
    div.innerHTML = `
        <div class="hi-left">
            <h4>${title}</h4>
            <span>${date}</span>
        </div>
        <div class="hi-amount ${isEarn ? 'text-gold' : 'text-red'}">${amount}</div>
    `;
    list.prepend(div);
}

// Call init on load
// initWallet();


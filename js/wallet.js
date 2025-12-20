/* Wallet Module - Metaverse Edition */

const EXCHANGE_RATE = 100000; // 100k coins = 1 Rupee

export function initWallet() {
    console.log("Metaverse Wallet Initialized");
    updateWalletUI();
    loadTransactionHistory();
}

function updateWalletUI() {
    if (!currentUser) return;

    // 1. Update Main Balance (Animated)
    document.getElementById('wallet-coins').innerText = Math.floor(currentUser.balance).toLocaleString();

    // 2. Rank & Eligibility Logic
    const rank = currentUser.rank || 999; 
    const isEligible = rank <= 10;
    
    // Render Rank Card
    const rankHTML = `
        <div class="r-info">
            <span class="r-label">CURRENT RANK</span>
            <span class="r-val">#${rank}</span>
        </div>
        <div class="status-badge ${isEligible ? 'unlocked' : 'locked'}">
            ${isEligible ? '<i class="fa-solid fa-lock-open"></i> Cash Eligible' : '<i class="fa-solid fa-database"></i> Storage Mode'}
        </div>
    `;
    document.getElementById('rank-card-container').innerHTML = rankHTML;

    // 3. Render Action Zone (The Switch)
    const actionZone = document.getElementById('action-zone');
    
    if (isEligible) {
        // --- TOP 10 VIEW (WITHDRAWAL) ---
        actionZone.innerHTML = `
            <div class="meta-input-group">
                <label class="meta-input-label">WITHDRAW FUNDS (INR)</label>
                <div class="meta-input-wrapper">
                    <span class="currency-symbol">₹</span>
                    <input type="number" id="withdraw-amount" class="meta-input" placeholder="0" oninput="calculateConversion(this.value)">
                </div>
                <div class="conversion-preview" id="conversion-display">Cost: 0 Coins</div>
            </div>
            <button class="btn-withdraw-meta" onclick="processWithdrawal()">
                INITIATE TRANSFER <i class="fa-solid fa-arrow-right"></i>
            </button>
            <p style="text-align:center; font-size:0.7rem; color:#64748b; margin-top:10px;">
                Rate: 100k Coins = ₹1.00
            </p>
        `;
    } else {
        // --- RANK 11+ VIEW (STORAGE) ---
        actionZone.innerHTML = `
            <div class="vault-message">
                <i class="fa-solid fa-shield-cat vault-icon"></i>
                <div class="vault-text">
                    <strong>Wallet in Safe Storage Mode</strong><br>
                    Only Top 10 players can access the cash bridge.<br>
                    <span style="color: #fbbf24; font-size: 0.75rem;">Your coins are safe for future rewards.</span>
                </div>
            </div>
        `;
    }
}

// Global function for input calculation
window.calculateConversion = function(amount) {
    const val = parseFloat(amount);
    const costDisplay = document.getElementById('conversion-display');
    if (isNaN(val) || val <= 0) {
        costDisplay.innerText = "Cost: 0 Coins";
        return;
    }
    const cost = Math.floor(val * EXCHANGE_RATE);
    costDisplay.innerHTML = `Cost: <span style="color:#fff">${cost.toLocaleString()}</span> Coins`;
    
    // Validations (Visual Only)
    if(cost > currentUser.balance) {
        costDisplay.innerHTML += ` <span style="color:#f43f5e">(Insufficient)</span>`;
    }
};

window.processWithdrawal = function() {
    const amount = document.getElementById('withdraw-amount').value;
    const cost = Math.floor(parseFloat(amount) * EXCHANGE_RATE);

    if (cost > currentUser.balance) {
        Swal.fire({
            background: '#0f172a', color: '#fff', icon: 'error', 
            title: 'Insufficient Balance', text: 'You need more coins!'
        });
        return;
    }

    // Success Simulation
    Swal.fire({
        background: '#0f172a', color: '#fff', icon: 'success',
        title: 'Processing', text: 'Funds requested successfully!'
    });
    // In real backend, you would deduct here and send API request
};

function loadTransactionHistory() {
    // Simulated History (Lightweight)
    const historyData = [
        { type: 'Tap Mining', val: '+500', icon: 'fa-hand-pointer' },
        { type: 'Daily Task', val: '+2000', icon: 'fa-list-check' },
        { type: 'Referral', val: '+5000', icon: 'fa-user-plus' }
    ];

    let html = '';
    historyData.forEach(item => {
        html += `
        <div class="mh-item">
            <div class="mh-left">
                <div class="mh-icon"><i class="fa-solid ${item.icon}"></i></div>
                <div class="mh-info"><h5>${item.type}</h5><span>Today</span></div>
            </div>
            <div class="mh-val plus">${item.val}</div>
        </div>`;
    });
    document.getElementById('wallet-history-list').innerHTML = html;
}


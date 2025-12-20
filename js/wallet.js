/* =========================================
   SMART WALLET LOGIC (Live Calc + Rank)
   ========================================= */

const EXCHANGE_RATE = 100000; // 100k Coins = ₹1
const MIN_WITHDRAWAL = 50;    // Minimum ₹50
let selectedMethod = 'UPI';

// 1. Initialize Wallet
function initWallet() {
    updateWalletDisplay();
}

// 2. Main Display Logic
function updateWalletDisplay() {
    if(!currentUser) return;

    // Coins
    document.getElementById('wallet-balance-display').innerText = Math.floor(currentUser.balance).toLocaleString();
    
    // Rank
    const rank = currentUser.rank || 999; // Default to low rank
    document.getElementById('wallet-rank-display').innerText = rank;

    const statusBar = document.getElementById('rank-status-bar');
    const statusBadge = document.getElementById('wallet-status-badge');
    const withdrawDiv = document.getElementById('withdraw-interface');
    const lockedDiv = document.getElementById('locked-interface');

    // Logic: Rank 1-10 Unlocked
    if (rank <= 10) {
        statusBar.className = 'rank-strip unlocked';
        statusBadge.innerText = 'Unlocked';
        statusBadge.innerHTML = '<i class="fa-solid fa-unlock"></i> Unlocked';
        
        withdrawDiv.classList.remove('hidden');
        lockedDiv.classList.add('hidden');
    } else {
        statusBar.className = 'rank-strip locked';
        statusBadge.innerText = 'Locked';
        statusBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Locked';
        
        withdrawDiv.classList.add('hidden');
        lockedDiv.classList.remove('hidden');
    }
}

// 3. Live Calculator
window.calculateLiveCost = function(inrAmount) {
    const amount = parseFloat(inrAmount);
    const display = document.getElementById('live-coin-cost');
    const btn = document.getElementById('btn-final-withdraw');

    if (!amount || amount <= 0) {
        display.innerText = "0 Coins";
        display.style.color = "#fbbf24";
        return;
    }

    const cost = Math.floor(amount * EXCHANGE_RATE);
    display.innerText = `- ${cost.toLocaleString()} Coins`;

    // Validation Color
    if (currentUser.balance < cost) {
        display.style.color = "#ef4444"; // Red (Not enough)
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.innerText = "Insufficient Coins";
    } else {
        display.style.color = "#22c55e"; // Green (Good)
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerText = "Transfer Funds";
    }
};

// 4. Select Method
window.selectPaymentMethod = function(el, method) {
    document.querySelectorAll('.pm-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedMethod = method;
    
    // Placeholder update
    const input = document.getElementById('payment-id');
    if(method === 'UPI') input.placeholder = "Enter UPI ID (e.g. name@okhdfcbank)";
    else if(method === 'Paytm') input.placeholder = "Enter Paytm Number";
    else input.placeholder = "Enter Account Number";
};

// 5. Process Withdraw
window.processWithdrawal = function() {
    const amount = parseFloat(document.getElementById('withdraw-inr-input').value);
    const payId = document.getElementById('payment-id').value;
    
    if(!amount || amount < MIN_WITHDRAWAL) {
        showToast(`⚠️ Minimum withdrawal is ₹${MIN_WITHDRAWAL}`);
        return;
    }
    
    if(!payId || payId.length < 5) {
        showToast("⚠️ Enter valid Payment ID");
        return;
    }

    const cost = amount * EXCHANGE_RATE;

    // Simulate Processing
    const btn = document.getElementById('btn-final-withdraw');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        // Deduct Logic
        currentUser.balance -= cost;
        updateWalletDisplay(); // Refresh UI
        
        // Save to Firebase (Simulated)
        if(window.saveUserData) {
            saveUserData(currentUser.uid, { balance: currentUser.balance });
        }

        // Reset Form
        document.getElementById('withdraw-inr-input').value = '';
        document.getElementById('live-coin-cost').innerText = '0 Coins';
        btn.innerHTML = 'Transfer Funds';

        Swal.fire({
            icon: 'success',
            title: 'Withdrawal Successful!',
            text: `₹${amount} has been sent to your ${selectedMethod}.`,
            background: '#020617',
            color: '#fff',
            confirmButtonColor: '#22c55e'
        });

    }, 2000);
};


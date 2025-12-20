/* =========================================
   WALLET PRO LOGIC
   ========================================= */

const MIN_WITHDRAW_INR = 100;
const COIN_RATE = 0.001; // 1000 Coins = ₹1
let isBalanceHidden = false;
let currentPin = "";
const CORRECT_PIN = "1234"; // Default PIN (User setting can change this)

// 1. Initialization
function initWallet() {
    // Check if locked
    if(localStorage.getItem('wallet_locked') === 'true') {
        document.getElementById('wallet-lock-screen').classList.remove('hidden');
    }
    
    updateWalletUI();
    renderHistory();
}

// 2. PIN Logic
window.enterPin = function(num) {
    if(currentPin.length < 4) {
        currentPin += num;
        updatePinDots();
    }
    
    if(currentPin.length === 4) {
        setTimeout(() => {
            if(currentPin === CORRECT_PIN) {
                // Unlock
                document.getElementById('wallet-lock-screen').classList.add('hidden');
                currentPin = "";
                updatePinDots();
                showToast("🔓 Wallet Unlocked");
            } else {
                // Fail
                currentPin = "";
                updatePinDots();
                if(window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
                showToast("❌ Incorrect PIN");
            }
        }, 200);
    }
};

window.clearPin = function() {
    currentPin = "";
    updatePinDots();
};

function updatePinDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if(index < currentPin.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });
}

// 3. Privacy Toggle
window.toggleBalancePrivacy = function() {
    isBalanceHidden = !isBalanceHidden;
    const balanceEl = document.getElementById('main-balance-display');
    const eyeIcon = document.getElementById('eye-icon');
    
    if(isBalanceHidden) {
        balanceEl.classList.add('blur-balance');
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        balanceEl.classList.remove('blur-balance');
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
};

// 4. Update UI & Progress
function updateWalletUI() {
    if(!currentUser) return;

    const coins = Math.floor(currentUser.balance || 0);
    const inr = (coins * COIN_RATE).toFixed(2);
    
    // Update Text
    document.getElementById('main-balance-display').innerText = `₹${inr}`;
    document.getElementById('wallet-coins').innerText = coins.toLocaleString();
    
    // Progress Bar
    const progress = Math.min((inr / MIN_WITHDRAW_INR) * 100, 100);
    document.getElementById('withdraw-progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').innerText = `₹${inr} / ₹${MIN_WITHDRAW_INR}`;
    
    // Change color if ready
    if(progress >= 100) {
        document.getElementById('withdraw-progress-bar').style.background = '#22c55e';
    }
}

// 5. Withdraw Request
window.handleWithdrawRequest = function() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const coinsNeeded = amount / COIN_RATE;
    
    if(!amount || amount < MIN_WITHDRAW_INR) {
        showToast(`⚠️ Minimum withdrawal is ₹${MIN_WITHDRAW_INR}`);
        return;
    }
    
    if(currentUser.balance < coinsNeeded) {
        showToast("🚫 Insufficient Balance");
        return;
    }

    // Success Simulation
    const btn = document.getElementById('btn-withdraw-action');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    
    setTimeout(() => {
        // Update State
        currentUser.balance -= coinsNeeded;
        updateWalletUI();
        
        // Add to History
        addTxCard("Withdrawal Request", "Under Review", `- ₹${amount}`, "pending");
        
        btn.innerHTML = 'Request Payout';
        
        Swal.fire({
            title: 'Request Submitted',
            text: 'Your payout is under review. Estimated time: 24 Hours.',
            icon: 'success',
            background: '#020617',
            color: '#fff',
            confirmButtonColor: '#22c55e'
        });
        
        // Save to Firebase
        if(window.saveUserData) {
            saveUserData(currentUser.uid, { balance: currentUser.balance });
        }
    }, 2000);
};

// 6. Helper: Add Transaction
function addTxCard(title, status, amount, type) {
    const list = document.getElementById('wallet-history-list');
    const div = document.createElement('div');
    
    let colorClass = type === 'credit' ? 'credit' : (type === 'debit' ? 'debit' : 'pending');
    let amountClass = type === 'credit' ? 'text-green' : (type === 'debit' ? 'text-red' : 'text-gold');
    let icon = type === 'credit' ? 'fa-arrow-down' : (type === 'debit' ? 'fa-arrow-up' : 'fa-clock');

    div.className = `tx-card ${colorClass}`;
    div.innerHTML = `
        <div class="tx-left">
            <div class="tx-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="tx-details">
                <h4>${title}</h4>
                <span>${status}</span>
            </div>
        </div>
        <div class="tx-amount ${amountClass}">${amount}</div>
    `;
    list.prepend(div);
}

// Dummy History Load
function renderHistory() {
    // Ideally fetch from Firebase 'transactions' collection
    // For now, static
}

// Initialize on Load
// initWallet();


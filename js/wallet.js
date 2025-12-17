document.addEventListener('DOMContentLoaded', () => {
    updateWalletUI();
});

// --- UPDATE UI DATA ---
function updateWalletUI() {
    // Get Balance from LocalStorage (Simulated Backend)
    const balance = parseInt(localStorage.getItem('userBalance')) || 0;
    
    // Update Text
    document.getElementById('wallet-total-coins').innerText = balance.toLocaleString();
    
    // Calculate INR Value (100k coins = 1 unit for non-rankers example)
    const inrValue = (balance / 100000).toFixed(2);
    document.getElementById('wallet-inr-value').innerText = inrValue;
}

// --- METHOD SELECTION ---
function selectMethod(element, method) {
    // Remove active class from all
    document.querySelectorAll('.method-chip').forEach(chip => chip.classList.remove('active'));
    // Add active to clicked
    element.classList.add('active');
}

// --- INPUT CALCULATION ---
function calculateWithdrawValue(coins) {
    // Logic: 10,000 Coins = 1 INR (Example Rate)
    const val = (coins / 10000).toFixed(2);
    document.getElementById('calc-value').innerText = val;
}

// --- HANDLE WITHDRAW ---
function handleWithdraw() {
    const amount = document.getElementById('withdraw-amount').value;
    const currentBal = parseInt(localStorage.getItem('userBalance')) || 0;

    if (!amount || amount <= 0) {
        Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter valid coins', background: '#1e293b', color: '#fff' });
        return;
    }

    if (amount > currentBal) {
        Swal.fire({ icon: 'error', title: 'Insufficient Funds', text: 'You do not have enough coins', background: '#1e293b', color: '#fff' });
        return;
    }

    // Simulate Processing
    const btn = document.getElementById('btn-withdraw-action');
    const originalText = btn.innerText;
    
    btn.disabled = true;
    btn.innerText = 'Processing...';

    setTimeout(() => {
        // Success
        btn.disabled = false;
        btn.innerText = originalText;
        
        // Deduct Coins
        const newBal = currentBal - parseInt(amount);
        localStorage.setItem('userBalance', newBal);
        updateWalletUI(); // Refresh UI
        
        // Also update header
        document.getElementById('header-coin-balance').innerText = newBal;

        Swal.fire({
            icon: 'success',
            title: 'Withdrawal Request Sent',
            text: 'Funds will be transferred within 24 hours.',
            background: '#1e293b', color: '#fff',
            confirmButtonColor: '#10b981'
        });

    }, 2000);
}

// --- TOAST HELPER ---
function showToast(msg) {
    const Toast = Swal.mixin({
        toast: true, position: 'top', showConfirmButton: false, timer: 2000,
        background: '#334155', color: '#fff'
    });
    Toast.fire({ icon: 'info', title: msg });
}

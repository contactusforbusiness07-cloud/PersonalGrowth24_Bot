// --- 1. CONFIGURATION ---
const firebaseConfig = {
    // ⚠️ REPLACE THIS WITH YOUR REAL FIREBASE CONFIG FROM CONSOLE ⚠️
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// --- 2. GLOBAL STATE ---
let db; // Firebase DB instance
let userRef; // Current User Reference
let userData = { balance: 0, referrals: 0, rank: 9999, joined_channels: [] };
const CONFIG = {
    verifTime: 5000, // 5 sec for task verification
    adTime: 15000,   // 15 sec for ads
    rankerRate: 10000, // 10k = 1 unit
    normalRate: 100000 // 100k = 1 unit
};

const CHANNELS = [
    {id: 'ch1', name: 'English Room', url: 'https://t.me/The_EnglishRoom5'},
    {id: 'ch2', name: 'UPSC Notes', url: 'https://t.me/UPSC_Notes_Official'},
    {id: 'ch3', name: 'Govt Schemes', url: 'https://t.me/GovernmentSchemesIndia'}
    // Add rest of the 8 channels here...
];

// --- 3. INIT FUNCTION ---
document.addEventListener("DOMContentLoaded", () => {
    AOS.init(); // Animations
    initFirebase();
    renderTasks();
    startTimer();
});

// --- 4. FIREBASE LOGIC (STUB) ---
function initFirebase() {
    // ⚠️ REAL IMPLEMENTATION WOULD IMPORT FIREBASE MODULES HERE
    // For this code to run without error in "Preview", I will simulate data.
    // IN PRODUCTION: Uncomment imports and use real firebase logic provided in previous response.
    
    console.log("Firebase Initialized (Simulation for Structure)");
    
    // Simulate User Fetch
    userData.balance = parseInt(localStorage.getItem('coins')) || 500;
    updateUI();
}

function updateBalance(amount) {
    userData.balance += amount;
    localStorage.setItem('coins', userData.balance); // Fallback
    // Firebase: update(userRef, { balance: userData.balance });
    updateUI();
    Swal.fire({
        icon: 'success',
        title: `+${amount} Coins`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#020617',
        color: '#fff'
    });
}

// --- 5. UI UPDATES ---
function updateUI() {
    document.getElementById('display-balance').innerText = userData.balance.toLocaleString();
    document.getElementById('header-coins').innerText = userData.balance.toLocaleString();
    document.getElementById('today-coins').innerText = "150"; // Dummy logic for daily
    
    // Wallet Math
    let rate = (userData.rank <= 10) ? CONFIG.rankerRate : CONFIG.normalRate;
    document.getElementById('fiat-value').innerText = (userData.balance / rate).toFixed(2);
    document.getElementById('w-avail').innerText = (userData.balance * 0.8).toFixed(0); // 80% available
}

// --- 6. NAVIGATION ---
window.switchTab = function(tabId) {
    // Hide all tabs
    document.querySelectorAll('section').forEach(el => {
        el.classList.remove('active-tab');
        el.classList.add('hidden-tab');
    });
    // Show selected
    document.getElementById(tabId).classList.remove('hidden-tab');
    document.getElementById(tabId).classList.add('active-tab');
    
    // Update Icons
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

// --- 7. FEATURE LOGIC ---

// A. Locked Tools
window.openTool = function(toolId) {
    const isLocked = document.getElementById('lock-' + toolId.split('_')[0]); // Simple check
    if(isLocked) {
        Swal.fire({
            title: 'Feature Locked 🔒',
            html: `
                <div style="text-align:left">
                    <p>Unlock this premium tool by:</p>
                    <button class="btn-action w-100 mt-10" onclick="swal.clickConfirm()">📺 Watch 30s Ad</button>
                    <button class="btn-action w-100 mt-10" style="background:#333">👥 Invite 2 Friends</button>
                </div>
            `,
            background: '#0f172a',
            color: '#fff',
            showConfirmButton: false
        });
    } else {
        // Open Tool Modal logic
        alert("Opening Tool: " + toolId);
    }
};

// B. Tasks
function renderTasks() {
    const list = document.getElementById('task-list');
    CHANNELS.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'glass-card task-row';
        div.innerHTML = `
            <div class="task-icon bg-blue"><i class="fab fa-telegram-plane"></i></div>
            <div class="task-info"><h4>${ch.name}</h4><small>Join Channel</small></div>
            <button class="btn-task" onclick="doTask('${ch.url}')">+1000</button>
        `;
        list.appendChild(div);
    });
}

window.doTask = function(url) {
    window.open(url, '_blank');
    Swal.fire({
        title: 'Verifying...',
        text: 'Please wait 5 seconds',
        timer: 5000,
        timerProgressBar: true,
        background: '#020617',
        color: '#fff',
        didOpen: () => { Swal.showLoading() }
    }).then((result) => {
        if(result.dismiss === Swal.DismissReason.timer) {
            updateBalance(1000);
        }
    });
};

// C. Games
window.playGame = function(name, url) {
    Swal.fire({
        title: 'Loading Ad...',
        text: 'Game starts in 5s',
        timer: 5000,
        timerProgressBar: true,
        background: '#020617',
        color: '#fff',
        didOpen: () => Swal.showLoading()
    }).then(() => {
        const modal = document.getElementById('tool-modal');
        const body = document.getElementById('tool-body');
        body.innerHTML = `<iframe src="${url}" style="width:100%; height:100vh; border:none;"></iframe>`;
        modal.classList.remove('hidden');
        // Add verification timer for game reward here
        setTimeout(() => updateBalance(100), 15000); // 15s play required
    });
};

window.closeTool = function() {
    document.getElementById('tool-modal').classList.add('hidden');
    document.getElementById('tool-body').innerHTML = '';
};

// D. Wallet
window.handleWithdraw = function() {
    const amount = 500; // Example
    const minWithdraw = (userData.rank <= 10) ? 10000 : 100000;
    
    if(userData.balance < minWithdraw) {
        Swal.fire({
            icon: 'error',
            title: 'Locked',
            text: `Minimum withdrawal is ${minWithdraw.toLocaleString()} Coins.`,
            background: '#020617',
            color: '#fff'
        });
    } else {
        Swal.fire({icon: 'success', title: 'Request Sent', background: '#020617', color: '#fff'});
    }
};

// E. Leaderboard Timer
function startTimer() {
    // Simple 24h countdown logic
    setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24,0,0,0);
        const diff = midnight - now;
        const h = Math.floor(diff / 1000 / 60 / 60);
        const m = Math.floor((diff / 1000 / 60) % 60);
        document.getElementById('countdown-timer').innerText = `${h}h ${m}m`;
    }, 60000);
}

// F. Profile
window.toggleProfileModal = function() {
    const m = document.getElementById('profile-modal');
    m.classList.toggle('hidden');
};

window.switchProfileTab = function(tabId) {
    document.getElementById('p-refer').classList.add('hidden');
    document.getElementById('p-sponsor').classList.add('hidden');
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('.p-tab').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};


// Import Firebase (v9 CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// --- ⚠️ PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DB_URL.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Telegram Init
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Current User Info
const tgUser = tg.initDataUnsafe.user || { id: 123456, first_name: "TestUser", username: "tester" };
const uid = tgUser.id.toString();
let userData = {};

// Config
const CONFIG = {
    adReward: 500, gameReward: 100, channelReward: 1000,
    rankerRate: 10000, normalRate: 100000
};

// --- CORE FUNCTIONS ---

// 1. Initialize User & Check Referral
async function initUser() {
    const userRef = ref(db, 'users/' + uid);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        // New User - Create Profile
        const startParam = tg.initDataUnsafe.start_param;
        let referrerId = null;

        if (startParam && startParam.startsWith('ref_')) {
            referrerId = startParam.split('_')[1];
            // Credit Referrer
            if(referrerId && referrerId !== uid) {
                const refUserRef = ref(db, 'users/' + referrerId);
                const refSnap = await get(refUserRef);
                if(refSnap.exists()) {
                    const rData = refSnap.val();
                    const newCount = (rData.referrals || 0) + 1;
                    let bonus = 0;
                    
                    // Viral Milestones
                    if(newCount === 3) bonus = 1000;
                    if(newCount === 5) bonus = 1500;
                    
                    update(refUserRef, {
                        referrals: newCount,
                        balance: (rData.balance || 0) + bonus
                    });
                }
            }
        }

        // Set Default Data
        await set(userRef, {
            name: tgUser.first_name,
            balance: 500, // Welcome Bonus
            referrals: 0,
            joined_channels: [],
            rank: 9999
        });
    }
    
    // Listen for Realtime Updates
    onValue(userRef, (snap) => {
        userData = snap.val();
        updateUI();
    });
}

// 2. UI Updates
function updateUI() {
    // Header
    document.getElementById('header-coins').innerText = userData.balance.toLocaleString();
    document.getElementById('username').innerText = userData.name;
    document.getElementById('user-rank').innerText = userData.rank || "999+";
    
    // Profile
    document.getElementById('profile-name').innerText = userData.name;
    document.getElementById('profile-rank').innerText = userData.rank || "999+";
    document.getElementById('wallet-coins').innerText = userData.balance.toLocaleString();
    
    // Wallet Logic
    let divisor = (userData.rank <= 10) ? CONFIG.rankerRate : CONFIG.normalRate;
    document.getElementById('wallet-fiat').innerText = (userData.balance / divisor).toFixed(2);
    
    const msg = document.getElementById('withdraw-msg');
    msg.innerHTML = (userData.rank <= 10) ? 
        "<span style='color:var(--green)'>Eligible for Instant Withdrawal</span>" : 
        "<span style='color:var(--red)'>Low Rank. Withdraw on 30th.</span>";

    // Progress
    let progress = Math.min(100, (userData.balance / 5000) * 100);
    document.getElementById('daily-progress').style.width = `${progress}%`;
    
    // Ref Link
    document.getElementById('my-ref-link').innerText = `t.me/PersonalGrowth24_Bot?start=ref_${uid}`;
}

// 3. Leaderboard (Real Backend)
function loadLeaderboard() {
    const usersRef = query(ref(db, 'users'), orderByChild('balance'), limitToLast(100));
    onValue(usersRef, (snapshot) => {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = "";
        let lbData = [];
        
        snapshot.forEach((child) => {
            lbData.push(child.val());
        });
        
        lbData.reverse(); // Highest first
        
        // Find my rank
        const myIndex = lbData.findIndex(u => u.name === userData.name);
        if(myIndex !== -1) {
            update(ref(db, 'users/' + uid), { rank: myIndex + 1 });
        }

        // Render Top 10
        lbData.slice(0, 10).forEach((u, i) => {
            let html = `
            <div class="leaderboard-item">
                <div style="display:flex;align-items:center;">
                    <div class="rank-num ${i===0?'rank-1':''}" style="width:25px; height:25px; background:${i===0?'#fbbf24':'#334155'}; border-radius:50%; display:flex; justify-content:center; align-items:center; margin-right:10px; font-size:12px; color:${i===0?'black':'white'}">${i+1}</div> 
                    <span>${u.name}</span>
                </div>
                <span class="text-gold">${u.balance.toLocaleString()}</span>
            </div>`;
            list.innerHTML += html;
        });
    });
}

// 4. Earn Logic
window.watchAd = function(id) {
    Swal.fire({
        title: 'Loading Ad...', html: 'Watch for <b>15</b> seconds.', timer: 15000, timerProgressBar: true, 
        allowOutsideClick: false, didOpen: () => Swal.showLoading()
    }).then((r) => {
        if(r.dismiss === Swal.DismissReason.timer) {
            const newBal = userData.balance + CONFIG.adReward;
            update(ref(db, 'users/' + uid), { balance: newBal });
            Swal.fire('Success!', `+${CONFIG.adReward} Coins`, 'success');
        }
    });
};

// 5. Game Logic
window.launchGame = function(name, url) {
    Swal.fire({
        title: 'Game Loading...', html: 'Watch Ad (10s) to start <b>'+name+'</b>', timer: 10000, timerProgressBar: true,
        allowOutsideClick: false, didOpen: () => Swal.showLoading()
    }).then((r) => {
        if(r.dismiss === Swal.DismissReason.timer) {
            const newBal = userData.balance + CONFIG.gameReward;
            update(ref(db, 'users/' + uid), { balance: newBal });
            
            document.getElementById('game-frame').src = url;
            document.getElementById('game-overlay').classList.remove('hidden');
        }
    });
};

// 6. Navigation
window.switchTab = function(tabId) {
    document.querySelectorAll('.active-section').forEach(el => el.classList.remove('active-section', 'fade-in'));
    document.querySelectorAll('.hidden').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-${tabId}`).classList.add('active-section', 'fade-in');
    
    const tabs = ['hub', 'games', 'profile']; // Profile is index 2 here if Oracle removed or 3 if kept
    // Manual mapping for nav highlighting
    if(tabId === 'hub') document.getElementById('nav-hub').classList.add('active');
    if(tabId === 'games') document.getElementById('nav-games').classList.add('active');
    if(tabId === 'profile') document.getElementById('nav-profile').classList.add('active');
};

// Event Listeners for Elements
document.getElementById('btn-ad-1').onclick = () => window.watchAd(1);
document.getElementById('btn-ad-2').onclick = () => window.watchAd(2);
document.getElementById('game-subway').onclick = () => window.launchGame('Subway Surfers', 'https://html5.gamedistribution.com/rvvASMiM/index.html');
document.getElementById('game-temple').onclick = () => window.launchGame('Temple Run', 'https://html5.gamedistribution.com/6817/index.html');
document.getElementById('game-ludo').onclick = () => window.launchGame('Ludo', 'https://html5.gamedistribution.com/5d2d480922834b6e9273574221c54848/');
document.getElementById('btn-close-game').onclick = () => {
    document.getElementById('game-overlay').classList.add('hidden');
    document.getElementById('game-frame').src = "";
};
document.getElementById('btn-copy-ref').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('my-ref-link').innerText);
    Swal.fire('Copied!', 'Share link to earn coins.', 'success');
};
document.getElementById('nav-hub').onclick = () => window.switchTab('hub');
document.getElementById('nav-games').onclick = () => window.switchTab('games');
document.getElementById('nav-profile').onclick = () => window.switchTab('profile');

// Withdraw
document.getElementById('btn-withdraw').onclick = function() {
    const upi = document.getElementById('upi-id').value;
    if(!upi) return Swal.fire('Error', 'Enter UPI ID', 'warning');
    if(userData.rank > 10) return Swal.fire('Locked', 'Top 10 Rankers only. Wait for month end.', 'info');
    if(userData.balance < 10000) return Swal.fire('Low Balance', 'Min 10,000 Coins.', 'error');
    Swal.fire('Request Sent', 'Processing...', 'success');
};

// Start
initUser();
loadLeaderboard();

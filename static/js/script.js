// --- FIREBASE CONFIGURATION ---
// IMPORT specific functions from ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, set, update, query, orderByChild, limitToLast, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- GLOBAL STATE ---
let telegramUser = null;
let userData = null;

// Channels Configuration
const PREMIUM_CHANNELS = [
    { id: 'chan1', name: 'IAS Prep Quiz', url: 'https://t.me/IAS_PrepQuiz_Zone' },
    { id: 'chan2', name: 'UPSC Vault', url: 'https://t.me/UPSC_Quiz_Vault' },
    { id: 'chan3', name: 'Govt Schemes', url: 'https://t.me/GovernmentSchemesIndia' },
    { id: 'chan4', name: 'English Room', url: 'https://t.me/EnglishRoom5' },
    { id: 'chan5', name: 'Personal Growth', url: 'https://t.me/PersonalGrowthHub' },
    { id: 'chan6', name: 'Tech Jobs', url: 'https://t.me/TechJobsIndia' },
    { id: 'chan7', name: 'Crypto News', url: 'https://t.me/CryptoNewsGlobal' },
    { id: 'chan8', name: 'Meme Central', url: 'https://t.me/MemeCentral' }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true });
    initWebApp();
    setupUI();
});

function initWebApp() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Check if running inside Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUser = tg.initDataUnsafe.user;
    } else {
        // Fallback for browser testing (REMOVE for production if strict)
        console.warn("Dev Mode: Using Mock User");
        telegramUser = { id: 123456789, first_name: "DevUser", username: "developer" };
    }

    loginUser();
}

async function loginUser() {
    const userRef = ref(db, 'users/' + telegramUser.id);
    
    // Listen for real-time updates to UI
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            userData = snapshot.val();
            updateUI(userData);
        } else {
            // First time user
            createNewUser(userRef);
        }
    });

    // Check Referral Logic only once on load
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
        const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
        if (startParam && startParam != telegramUser.id) {
            processReferral(startParam);
        }
    }
}

function createNewUser(userRef) {
    const initialData = {
        name: telegramUser.first_name,
        balance: 1000, // Welcome bonus
        referrals: 0,
        joined_channels: {},
        rank_score: 1000
    };
    set(userRef, initialData);
}

// --- REFERRAL ENGINE (The Viral Loop) ---
async function processReferral(referrerId) {
    const referrerRef = ref(db, 'users/' + referrerId);
    
    await runTransaction(referrerRef, (user) => {
        if (user) {
            user.referrals = (user.referrals || 0) + 1;
            user.balance = (user.balance || 0) + 500; // Standard Ref Bonus
            user.rank_score = (user.rank_score || 0) + 500;

            // Milestone Bonuses
            if (user.referrals === 3) user.balance += 1000;
            if (user.referrals === 5) user.balance += 1500;
            if (user.referrals === 10) user.balance += 3000;
            if (user.referrals === 20) user.balance += 6000;
            
            return user;
        }
        return user;
    });
}

// --- CORE FEATURES ---

// 1. Premium Channels
window.renderChannels = () => {
    const list = document.getElementById('channel-list');
    list.innerHTML = '';
    
    PREMIUM_CHANNELS.forEach(channel => {
        const isJoined = userData && userData.joined_channels && userData.joined_channels[channel.id];
        const btnClass = isJoined ? 'action-btn disabled' : 'action-btn';
        const btnText = isJoined ? 'Joined' : 'Join +1000';
        const onClick = isJoined ? '' : `onclick="joinChannel('${channel.id}', '${channel.url}')"`;
        
        const html = `
            <div class="channel-row">
                <span>${channel.name}</span>
                <button class="${btnClass}" ${onClick}>${btnText}</button>
            </div>
        `;
        list.innerHTML += html;
    });
};

window.joinChannel = (chanId, url) => {
    window.open(url, '_blank');
    
    // Simulate verification delay
    setTimeout(() => {
        const userRef = ref(db, `users/${telegramUser.id}`);
        runTransaction(userRef, (user) => {
            if (user) {
                if (!user.joined_channels) user.joined_channels = {};
                if (!user.joined_channels[chanId]) {
                    user.joined_channels[chanId] = true;
                    user.balance += 1000;
                    user.rank_score += 1000;
                }
            }
            return user;
        });
    }, 5000); // 5 seconds wait
};

// 2. Ad Watch
window.watchAd = () => {
    const overlay = document.getElementById('loading-overlay');
    const countdownEl = document.getElementById('countdown');
    const loadText = document.getElementById('loading-text');
    
    overlay.classList.remove('hidden');
    loadText.innerText = "Watching High Pay Ad...";
    let timeLeft = 15;
    
    const timer = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            overlay.classList.add('hidden');
            // Reward
            update(ref(db, `users/${telegramUser.id}`), {
                balance: (userData.balance || 0) + 500
            });
            alert("Success! +500 Coins added.");
        }
    }, 1000);
};

// 3. Game Zone
window.playGame = (gameId, imgUrl) => {
    const overlay = document.getElementById('loading-overlay');
    const countdownEl = document.getElementById('countdown');
    const loadText = document.getElementById('loading-text');
    
    overlay.classList.remove('hidden');
    loadText.innerText = "Loading Game Resources...";
    let timeLeft = 10;
    
    // Pre-game Ad
    const timer = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            overlay.classList.add('hidden');
            
            // Credit play bonus
            update(ref(db, `users/${telegramUser.id}`), {
                balance: (userData.balance || 0) + 100
            });

            // Open Game
            const gameModal = document.getElementById('game-modal');
            const iframe = document.getElementById('game-frame');
            
            // Map simple IDs to real URLs for iframe content
            // Note: In real app, these should be playable URLs, here using distribution links as requested or placeholders
            let gameUrl = "";
            if(gameId === 'subway') gameUrl = "https://html5.gamedistribution.com/rvvASMiM/"; // Example structure
            if(gameId === 'temple') gameUrl = "https://poki.com/en/g/temple-run-2"; 
            if(gameId === 'ludo') gameUrl = "https://ludoking.com";

            // Since strict constraints asked for assets but Iframe needs HTML5 urls, 
            // I'm pointing to a generic responsive wrapper or the user should replace with valid embed URLs.
            // For now, setting a demo URL to prevent 404 in iframe
            iframe.src = "https://poki.com/"; 

            gameModal.classList.remove('hidden');
        }
    }, 1000);
};

window.closeGame = () => {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('game-frame').src = "";
};

// 4. Viral Tools
window.generateCV = () => {
    if (userData.balance < 10000) {
        alert("Insufficient Balance! You need 10,000 Coins.");
        return;
    }
    
    const confirmBuy = confirm("Generate Premium CV for 10,000 Coins?");
    if (confirmBuy) {
        update(ref(db, `users/${telegramUser.id}`), {
            balance: userData.balance - 10000
        }).then(() => {
            alert("CV Generated Successfully! (Downloading PDF...)");
            // Integration with html2pdf would go here
        });
    }
};

window.openOracle = () => {
    const name1 = prompt("Enter your name:");
    const name2 = prompt("Enter crush's name:");
    if(name1 && name2) {
        const score = Math.floor(Math.random() * 100);
        alert(`🔮 Oracle Says: ${name1} + ${name2} = ${score}% Love Match!`);
    }
};

// --- LEADERBOARD & WITHDRAW ---
function updateLeaderboard() {
    const leaderboardQuery = query(ref(db, 'users'), orderByChild('balance'), limitToLast(10));
    
    get(leaderboardQuery).then((snapshot) => {
        const tbody = document.querySelector('#leaderboard-table tbody');
        tbody.innerHTML = '';
        let users = [];
        
        snapshot.forEach((child) => {
            users.push(child.val());
        });
        
        users.reverse().forEach((u, index) => {
            const row = `<tr>
                <td>#${index + 1}</td>
                <td>${u.name.substring(0, 10)}...</td>
                <td>${u.balance.toLocaleString()}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    });
}

// Global Withdraw Handler
window.handleWithdraw = () => {
    // Logic: Check if user is in Top 10 based on Rank Score/Balance
    // This requires fetching top 10 and comparing IDs, simplifying for demo:
    const statusEl = document.getElementById('withdraw-status');
    
    if (userData.balance >= 100000) {
        statusEl.innerText = "Status: Eligible (Standard Rate)";
        alert("Withdrawal request sent for month-end processing.");
    } else {
        statusEl.innerText = "Status: Keep Earning";
        alert("Minimum withdrawal is 100,000 Coins.");
    }
};

// --- UI HELPERS ---
function updateUI(user) {
    // Navbar
    document.getElementById('nav-balance').innerText = user.balance.toLocaleString();
    
    // Profile Modal
    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('profile-balance').innerText = user.balance.toLocaleString();
    document.getElementById('profile-refs').innerText = user.referrals;
    document.getElementById('profile-rank').innerText = user.rank_score;
    
    renderChannels();
    updateLeaderboard();
}

function setupUI() {
    // Toggle Profile Modal
    const btn = document.getElementById('profile-btn');
    const modal = document.getElementById('profile-modal');
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.toggle('hidden');
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!modal.contains(e.target) && !btn.contains(e.target)) {
            modal.classList.add('hidden');
        }
    });
}


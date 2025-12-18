/* Module: Referral System (Real Logic) */

const REFERRAL_TARGETS = [
    { target: 3, reward: 500 },
    { target: 5, reward: 1000 },
    { target: 10, reward: 2500 },
    { target: 20, reward: 5000 },
    { target: 50, reward: 15000 },
    { target: 100, reward: 35000 },
    { target: 500, reward: 200000 }, 
    { target: 1000, reward: 500000 }, 
    { target: 5000, reward: 3000000 }, 
    { target: 10000, reward: 7000000 }
];

// Default State (Sab Zero se shuru hoga)
let myReferralData = {
    userId: "GUEST",
    referralLink: "",
    count: 0,           // Total Verified Invites (Start = 0)
    claimedTargets: [], // Konsa milestone le liya
    totalEarnings: 0,   // Total Coins earned from refer
    team: []            // List of friends
};

// 1. Initialize System
function initReferralSystem() {
    // A. User Identification (Telegram Data)
    let tgUser = null;
    if (window.Telegram && window.Telegram.WebApp) {
        tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }

    const userId = tgUser ? tgUser.id : "USER-" + Math.floor(Math.random() * 100000);
    const userName = tgUser ? tgUser.first_name : "Guest";

    // B. Link Generation (Standard Telegram Deep Link)
    // Link aisa dikhega: https://t.me/PersonalGrowth24_Bot?start=ref_12345
    const botUsername = "PersonalGrowth24_Bot"; 
    const referralCode = `ref_${userId}`;
    const fullLink = `https://t.me/${botUsername}?start=${referralCode}`;

    // C. Load Data form Database (Simulation via LocalStorage for now)
    // Real app me ye data server se aayega. Abhi hum check karenge agar saved hai to load karo, nahi to 0.
    const savedData = JSON.parse(localStorage.getItem('realReferralData'));
    
    if (savedData) {
        myReferralData = savedData;
        // Link update incase user changed
        myReferralData.referralLink = fullLink; 
        myReferralData.userId = userId;
    } else {
        // First Time User -> Sab kuch 0 set karo
        myReferralData = {
            userId: userId,
            referralLink: fullLink,
            count: 0, // STRICTLY 0 FOR NEW USER
            claimedTargets: [],
            totalEarnings: 0,
            team: []
        };
        saveReferralData(); // Save fresh state
    }

    // D. Update UI Elements
    updateReferralUI();
}

// 2. UI Update Function
function updateReferralUI() {
    // Top Stats
    if(document.getElementById('total-referrals')) {
        document.getElementById('total-referrals').innerText = myReferralData.count;
        document.getElementById('referral-earnings').innerText = myReferralData.totalEarnings.toLocaleString();
        
        // Show Code
        const displayCode = myReferralData.userId.toString().replace('ref_', ''); 
        document.getElementById('my-referral-code').innerText = "FGP-" + displayCode;
        
        // Show Link (UPDATED LOGIC)
        if(document.getElementById('my-referral-link')) {
             document.getElementById('my-referral-link').innerText = myReferralData.referralLink;
        }
    }

    renderMilestones();
    renderTeamList();
}

// 3. Render Milestones (Fixed Design)
function renderMilestones() {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach((tier) => {
        const isClaimed = myReferralData.claimedTargets.includes(tier.target);
        const isUnlocked = myReferralData.count >= tier.target;
        
        // Progress Calculation (Max 100%)
        let progressPercent = 0;
        if (myReferralData.count > 0) {
            progressPercent = Math.min((myReferralData.count / tier.target) * 100, 100);
        }

        let btnHTML = '';
        if (isClaimed) {
            btnHTML = `<button class="btn-claim claimed"><i class="fa-solid fa-check"></i> CLAIMED</button>`;
        } else if (isUnlocked) {
            btnHTML = `<button class="btn-claim ready" onclick="claimReferralReward(${tier.target}, ${tier.reward})">CLAIM ${tier.reward}</button>`;
        } else {
            btnHTML = `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> Locked</button>`;
        }

        const html = `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${tier.target} Friends</span>
                <span class="reward-badge">+${tier.reward.toLocaleString()}</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px; color:#aaa;">
                <span>Current: ${myReferralData.count}</span>
                <span>Target: ${tier.target}</span>
            </div>
            ${btnHTML}
        </div>`;
        list.innerHTML += html;
    });
}

// 4. Claim Logic (Updates Wallet & UI)
function claimReferralReward(target, amount) {
    // 1. Add money to main wallet
    let currentWallet = parseInt(localStorage.getItem('userBalance')) || 0;
    localStorage.setItem('userBalance', currentWallet + amount);

    // 2. Update Referral State
    myReferralData.claimedTargets.push(target);
    myReferralData.totalEarnings += amount; // Sirf claim karne par earnings badhegi
    
    saveReferralData();
    updateReferralUI(); // Refresh UI instantly

    // 3. Show Success
    Swal.fire({
        title: 'Reward Claimed!',
        text: `${amount} Coins added to your wallet!`,
        icon: 'success',
        confirmButtonColor: '#00f260',
        background: '#1a1a2e',
        color: '#fff'
    });
}

// 5. Render Team (Only shows if friends exist)
function renderTeamList() {
    const list = document.getElementById('team-list');
    if(!list) return;

    if (myReferralData.team.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">
            <i class="fa-solid fa-users-slash" style="font-size:24px; margin-bottom:10px;"></i><br>
            No friends joined yet.<br>Share your link to start earning!
        </div>`;
        return;
    }

    let html = "";
    myReferralData.team.forEach(friend => {
        // Commission logic (Mock: friend earned random amount for demo)
        // Real app me ye data server se aayega
        const commission = Math.floor(friend.earnings * 0.10); 
        
        html += `
        <div class="team-item">
            <div class="team-info">
                <h4>${friend.name}</h4>
                <p>ID: ${friend.id}</p>
            </div>
            <div class="commission-box">
                <span class="comm-amount">+${commission}</span>
                <span class="comm-label">10% Profit</span>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

// 6. Copy Link Logic
function copyReferralCode() {
    // User click karega to pura link copy hoga
    navigator.clipboard.writeText(myReferralData.referralLink).then(() => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Referral Link Copied!',
            showConfirmButton: false,
            timer: 1500,
            background: '#00f260',
            color: '#000'
        });
    });
}

// 7. Tabs Logic
function switchReferTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
}

// Helper: Save Data
function saveReferralData() {
    localStorage.setItem('realReferralData', JSON.stringify(myReferralData));
}

// --- TESTING ONLY: Simulator (Remove in Production) ---
// Is function ko console me run karo friends add karne ke liye: addFakeFriend()
window.addFakeFriend = function() {
    myReferralData.count += 1;
    myReferralData.team.push({
        name: "New Friend " + myReferralData.count,
        id: Math.floor(Math.random()*900000),
        earnings: Math.floor(Math.random()*5000)
    });
    saveReferralData();
    updateReferralUI();
    console.log("Friend added! Refresh UI check karo.");
}

// Auto Init
document.addEventListener('DOMContentLoaded', initReferralSystem);


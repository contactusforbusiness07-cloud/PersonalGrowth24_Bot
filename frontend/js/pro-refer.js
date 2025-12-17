/* Module: Referral & Earn Logic (Hitech) */

// Configuration: Rewards for each target
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

// State Management
let myReferralData = {
    code: "",
    count: 0, // Kitne log join huye (Real logic)
    claimedTargets: [], // Kaunse rewards le liye
    totalEarnings: 0
};

// 1. Initialize System
function initReferralSystem() {
    const userProfile = JSON.parse(localStorage.getItem('finGameProfile')) || { id: '8739204', name: 'User' };
    
    // Generate Unique Code based on ID (e.g., FGP-8739204)
    myReferralData.code = `FGP-${userProfile.id}`;
    
    // Load Saved Data or Default
    const savedData = JSON.parse(localStorage.getItem('referralData'));
    if (savedData) {
        myReferralData = savedData;
    } else {
        // SIMULATION FOR DEMO: Let's assume 7 people joined so you can see the UI working
        myReferralData.count = 7; 
        saveReferralData();
    }

    // Update UI
    if(document.getElementById('my-referral-code')) {
        document.getElementById('my-referral-code').innerText = myReferralData.code;
        document.getElementById('total-referrals').innerText = myReferralData.count;
        document.getElementById('referral-earnings').innerText = myReferralData.totalEarnings.toLocaleString();

        renderMilestones();
        renderTeamList();
    }
}

// 2. Render Milestones Logic (Progress Bars)
function renderMilestones() {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = ""; // Clear current

    REFERRAL_TARGETS.forEach((tier, index) => {
        const isClaimed = myReferralData.claimedTargets.includes(tier.target);
        const progressPercent = Math.min((myReferralData.count / tier.target) * 100, 100);
        const isUnlocked = myReferralData.count >= tier.target;

        // Dynamic Button State
        let btnHTML = '';
        if (isClaimed) {
            btnHTML = `<button class="btn-claim claimed"><i class="fa-solid fa-check"></i> CLAIMED</button>`;
        } else if (isUnlocked) {
            btnHTML = `<button class="btn-claim ready" onclick="claimReferralReward(${tier.target}, ${tier.reward})">CLAIM ${tier.reward} COINS</button>`;
        } else {
            btnHTML = `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> Locked</button>`;
        }

        const html = `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${tier.target} Friends</span>
                <span class="reward-badge">+${tier.reward.toLocaleString()} Coins</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px; color:#aaa;">
                <span>Current: ${myReferralData.count}</span>
                <span>Target: ${tier.target}</span>
            </div>
            ${btnHTML}
        </div>
        `;
        list.innerHTML += html;
    });
}

// 3. Claim Reward Logic
function claimReferralReward(target, amount) {
    // Add to Wallet (Calls main wallet function)
    updateWalletBalance(amount); 
    
    // Update State
    myReferralData.claimedTargets.push(target);
    myReferralData.totalEarnings += amount;
    saveReferralData();

    // Refresh UI
    renderMilestones();
    document.getElementById('referral-earnings').innerText = myReferralData.totalEarnings.toLocaleString();
    
    // Show Success Animation
    Swal.fire({
        title: 'Success!',
        text: `You claimed ${amount} Coins!`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
    });
}

// 4. Render Team & 10% Commission Logic
function renderTeamList() {
    const list = document.getElementById('team-list');
    if(!list) return;
    // Mock Data
    const mockFriends = [
        { name: "Rahul K.", id: "9928..", earned: 5000 },
        { name: "CryptoKing", id: "1120..", earned: 12000 },
        { name: "Sarah J.", id: "3321..", earned: 200 },
    ];

    let html = "";
    let totalCommission = 0;

    mockFriends.forEach(friend => {
        const commission = Math.floor(friend.earned * 0.10);
        totalCommission += commission;

        html += `
        <div class="team-item">
            <div class="team-info">
                <h4>${friend.name}</h4>
                <p>ID: ${friend.id} • Earned: ${friend.earned}</p>
            </div>
            <div class="commission-box">
                <span class="comm-amount">+${commission}</span>
                <span class="comm-label">Your 10%</span>
            </div>
        </div>
        `;
    });

    list.innerHTML = html;
}

// 5. Utility: Copy Code
function copyReferralCode() {
    navigator.clipboard.writeText(myReferralData.code);
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Referral Code Copied!',
        showConfirmButton: false,
        timer: 1500
    });
}

// 6. Tabs Switcher
function switchReferTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
}

// Save to LocalStorage
function saveReferralData() {
    localStorage.setItem('referralData', JSON.stringify(myReferralData));
}

// Helper to update main wallet
function updateWalletBalance(amount) {
    let current = parseInt(localStorage.getItem('userBalance')) || 0;
    localStorage.setItem('userBalance', current + amount);
}

// Placeholder for team commission claim
function claimAllCommissions() {
    alert("This feature will be available once your team starts earning!");
}

// Auto-init
document.addEventListener('DOMContentLoaded', initReferralSystem);


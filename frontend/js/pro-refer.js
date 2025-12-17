/* Module: Referral & Earn Logic (Locked Design, Updated Logic) */

const REFERRAL_TARGETS = [
    { target: 3, reward: 500 },
    { target: 5, reward: 1000 },
    { target: 10, reward: 2500 },
    { target: 20, reward: 5000 },
    { target: 50, reward: 15000 },
    { target: 100, reward: 35000 },
    { target: 1000, reward: 500000 }
];

let myReferralData = {
    code: "",
    count: 0, 
    claimedTargets: [],
    totalEarnings: 0
};

// 1. Initialize System
function initReferralSystem() {
    const userProfile = JSON.parse(localStorage.getItem('finGameProfile')) || { id: '8739204' };
    
    // Load Saved Data or Default to 0
    const savedData = JSON.parse(localStorage.getItem('referralData'));
    
    if (savedData) {
        myReferralData = savedData;
    } else {
        // DEFAULT START STATE: 0 Joined
        myReferralData = {
            code: `FGP-${userProfile.id}`,
            count: 0, 
            claimedTargets: [],
            totalEarnings: 0
        };
        saveReferralData();
    }

    // Update UI Elements
    document.getElementById('my-referral-code').innerText = myReferralData.code;
    document.getElementById('total-referrals').innerText = myReferralData.count; // Shows 0 initially
    document.getElementById('referral-earnings').innerText = myReferralData.totalEarnings.toLocaleString();

    renderMilestones();
    renderTeamList();
}

// 2. Render Milestones (Locked/Unlocked Logic)
function renderMilestones() {
    const list = document.getElementById('milestone-list');
    list.innerHTML = ""; 

    REFERRAL_TARGETS.forEach((tier) => {
        const isClaimed = myReferralData.claimedTargets.includes(tier.target);
        // Progress Logic: Agar count 0 hai, to width 0% hogi
        const progressPercent = Math.min((myReferralData.count / tier.target) * 100, 100);
        const isUnlocked = myReferralData.count >= tier.target;

        let btnHTML = '';
        if (isClaimed) {
            btnHTML = `<button class="btn-claim claimed"><i class="fa-solid fa-check"></i> CLAIMED</button>`;
        } else if (isUnlocked) {
            btnHTML = `<button class="btn-claim ready" onclick="claimReferralReward(${tier.target}, ${tier.reward})">CLAIM ${tier.reward}</button>`;
        } else {
            // Locked State Design
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

// 3. Render Team (Only show list if friends exist)
function renderTeamList() {
    const list = document.getElementById('team-list');
    
    // Agar 0 referrals hain, to "No Team" message dikhao
    if (myReferralData.count === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:20px; color:#555;">
                <i class="fa-solid fa-users-slash" style="font-size:30px; margin-bottom:10px;"></i>
                <p>No partners yet. Share your link!</p>
            </div>
        `;
        return;
    }

    // Logic for Real Data Integration (Placeholder for future)
    // ... (Yaha real friends list aayegi jab backend connect hoga)
}

function saveReferralData() {
    localStorage.setItem('referralData', JSON.stringify(myReferralData));
}

// For Testing: Run console command 'addFakeReferral()' to test animation
function addFakeReferral() {
    myReferralData.count++;
    saveReferralData();
    initReferralSystem();
}

document.addEventListener('DOMContentLoaded', initReferralSystem);


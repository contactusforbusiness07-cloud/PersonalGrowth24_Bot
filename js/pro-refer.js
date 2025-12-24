/* js/pro-refer.js - INSTANT MILESTONES + FIREBASE BACKEND */

// ==========================================
// 1. DATA & CONFIGURATION
// ==========================================
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

// ==========================================
// 2. UI RENDER FUNCTIONS (Defined First)
// ==========================================

function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = ""; // Clear previous

    REFERRAL_TARGETS.forEach(tier => {
        const isUnlocked = count >= tier.target;
        // Progress Calculation
        let percent = 0;
        if(count > 0) {
            percent = Math.min((count / tier.target) * 100, 100);
        }

        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready" style="background:#4ade80; color:#000; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; font-size:10px;">CLAIMED</button>` 
            : `<button class="btn-claim locked" style="background:#334155; color:#94a3b8; border:1px solid #475569; padding:5px 10px; border-radius:4px; font-size:10px;"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card" style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="target-title" style="color:#fff; font-family:'Orbitron'; font-size:12px;">${tier.target} Friends</span>
                <span class="reward-badge" style="color:#ffd700; background:rgba(255, 215, 0, 0.1); padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold;">+${tier.reward.toLocaleString()}</span>
            </div>
            <div class="progress-track" style="height:6px; background:#1e293b; border-radius:3px; overflow:hidden; margin-bottom:8px;">
                <div class="progress-fill" style="width: ${percent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #06b6d4);"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#aaa; margin-top:5px;">
                <span>Progress: ${count}/${tier.target}</span>
                <span>${Math.floor(percent)}%</span>
            </div>
            <div style="margin-top:10px; text-align:right;">${btnHTML}</div>
        </div>`;
    });
}

function renderTeamList(team) {
    const list = document.getElementById('team-list');
    if(!list) return;

    if (!team || team.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No friends yet.</div>`;
        return;
    }

    let html = "";
    team.forEach(friend => {
        html += `
        <div class="team-item" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:8px;">
            <div class="team-info">
                <h4 style="margin:0; color:#fff; font-size:13px;">${friend.name || "Unknown"}</h4>
                <p style="margin:0; color:#aaa; font-size:10px;">ID: ${friend.id}</p>
            </div>
            <div class="commission-box" style="text-align:right;">
                <span class="comm-amount" style="color:#4ade80; font-weight:bold; font-size:12px;">+${friend.earned_for_ref || 0}</span>
                <span class="comm-label" style="display:block; font-size:9px; color:#aaa;">Earned</span>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

// ==========================================
// 3. INITIALIZATION (INSTANT & ASYNC)
// ==========================================

// A. INSTANT RENDER (Page Load hote hi dikhega)
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Referral UI Initializing...");
    
    // Default 0 par render kar do taaki user ko list dikhe
    renderMilestones(0); 
    
    // UI Reset
    if(document.getElementById('total-referrals')) document.getElementById('total-referrals').innerText = "0";
    if(document.getElementById('referral-earnings')) document.getElementById('referral-earnings').innerText = "0";
    
    // Tab Defaults
    const tab1 = document.getElementById('tab-milestones');
    if(tab1) tab1.classList.remove('hidden');
    const btn1 = document.querySelector('.tab-btn');
    if(btn1) btn1.classList.add('active');
});

// B. FIREBASE BACKEND (Data fetch karega)
(async function initFirebaseSystem() {
    try {
        // Dynamic Imports
        const { db } = await import("./firebase-init.js");
        const { doc, getDoc, collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js");

        const tg = window.Telegram.WebApp;
        const currentUserId = tg.initDataUnsafe?.user?.id?.toString() || "TEST_USER"; 
        
        console.log("👤 Fetching data for:", currentUserId);

        // Update Link
        setupReferralLink(currentUserId);

        // Fetch User Stats
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        let refCount = 0;
        let earnings = 0;

        if (userSnap.exists()) {
            const data = userSnap.data();
            refCount = data.referralCount || 0;
            earnings = refCount * 500;
        }

        // Update UI with Real Data
        if(document.getElementById('total-referrals')) document.getElementById('total-referrals').innerText = refCount;
        if(document.getElementById('referral-earnings')) document.getElementById('referral-earnings').innerText = earnings.toLocaleString();
        
        // Re-render Milestones with Real Count
        renderMilestones(refCount);

        // Fetch Team List
        let teamData = [];
        const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const friend = doc.data();
            teamData.push({
                name: friend.firstName || friend.name || "User",
                id: friend.userId || friend.id,
                earned_for_ref: 500
            });
        });
        renderTeamList(teamData);

    } catch (error) {
        console.error("🔥 Firebase Error:", error);
    }
})();

// ==========================================
// 4. GLOBAL UTILS (Tabs, Copy, etc.)
// ==========================================

function setupReferralLink(uid) {
    const botName = "PersonalGrowth24_Bot"; // APNA BOT NAME CHECK KAREIN
    const link = `https://t.me/${botName}?start=ref_${uid}`;
    
    if(document.getElementById('my-referral-code')) 
        document.getElementById('my-referral-code').innerText = "FGP-" + uid;
    
    if(document.getElementById('my-referral-link')) 
        document.getElementById('my-referral-link').innerText = link;
}

window.switchReferTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
    if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
}

window.copyReferralCode = function() {
    const linkElement = document.getElementById('my-referral-link');
    if(!linkElement) return;
    
    const textToCopy = linkElement.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector('.code-box i');
        if(btn) {
            btn.className = "fa-solid fa-check";
            setTimeout(() => btn.className = "fa-solid fa-share-nodes", 2000);
        }
        if(typeof Swal !== 'undefined') {
            Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Link Copied!', showConfirmButton: false, timer: 1500 });
        } else {
            alert("Copied!");
        }
    });
}

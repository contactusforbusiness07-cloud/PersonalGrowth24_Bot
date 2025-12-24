/* js/pro-refer.js - FIREBASE CONNECTED + ORIGINAL UI LOGIC */

// ==========================================
// 1. FIREBASE BACKEND CONTROLLER (ADDED)
// ==========================================
// Ye code background me chalega aur data laakar aapke UI functions ko dega
(async function initFirebaseSystem() {
    console.log("🚀 Initializing Referral Backend...");

    try {
        // --- A. DYNAMIC IMPORTS (No HTML Change Needed) ---
        const { db } = await import("./firebase-init.js");
        const { doc, getDoc, collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js");

        // --- B. USER ID DETECTION ---
        const tg = window.Telegram.WebApp;
        // Fallback to TEST_USER if running in browser/outside Telegram
        const currentUserId = tg.initDataUnsafe?.user?.id?.toString() || "TEST_USER"; 
        
        console.log("👤 Fetching data for:", currentUserId);

        // --- C. FETCH MAIN STATS ---
        let userData = {
            id: currentUserId,
            referralCount: 0,
            totalEarnings: 0
        };

        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            userData.referralCount = data.referralCount || 0;
            // Calculation: 500 coins per invite
            userData.totalEarnings = (userData.referralCount * 500); 
        }

        // --- D. FETCH TEAM LIST ---
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

        // --- E. UPDATE UI (Calling your existing function) ---
        // Thoda delay taaki DOM ready ho jaye
        setTimeout(() => {
            if (window.updateReferralUI) {
                window.updateReferralUI(userData, teamData);
            } else {
                console.error("❌ UI Function not found!");
            }
        }, 500);

    } catch (error) {
        console.error("🔥 Firebase Error:", error);
    }
})();


// ==========================================
// 2. YOUR ORIGINAL UI LOGIC (UNCHANGED)
// ==========================================

// --- PRO-REFER.JS (UI & Global Logic) ---

// 1. Render Tabs (Globally Accessible)
window.switchReferTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    // Button Active State Logic
    const btns = document.querySelectorAll('.tab-btn');
    // Simple index check based on your HTML structure
    if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
    if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
}

// 2. Copy Logic
window.copyReferralCode = function() {
    const linkElement = document.getElementById('my-referral-link');
    if(!linkElement) return;
    
    const textToCopy = linkElement.innerText;
    if(textToCopy.includes("Loading") || textToCopy.includes("Generating")) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Simple Alert or Toast
        const btn = document.querySelector('.code-box i');
        if(btn) {
            const originalClass = btn.className;
            btn.className = "fa-solid fa-check";
            setTimeout(() => btn.className = originalClass, 2000);
        }
        
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', 
                title: 'Link Copied!', showConfirmButton: false, timer: 1500,
                background: '#00f260', color: '#000'
            });
        } else {
            // Fallback
            console.log("Copied");
        }
    });
}

// 3. Render UI with Real Data (Called from main.js or Firebase Init)
window.updateReferralUI = function(userData, teamData) {
    console.log("📊 Updating Referral UI...", userData);

    // Update Counts
    if(document.getElementById('total-referrals')) 
        document.getElementById('total-referrals').innerText = userData.referralCount || 0;
    
    if(document.getElementById('referral-earnings')) 
        document.getElementById('referral-earnings').innerText = (userData.totalEarnings || 0).toLocaleString();

    // Update Codes & Links
    if(document.getElementById('my-referral-code')) 
        document.getElementById('my-referral-code').innerText = "FGP-" + userData.id;
    
    if(document.getElementById('my-referral-link')) {
        const botName = "PersonalGrowth24_Bot"; 
        document.getElementById('my-referral-link').innerText = `https://t.me/${botName}?start=ref_${userData.id}`;
    }

    // Render Sections
    renderMilestones(userData.referralCount || 0);
    renderTeamList(teamData || []);
}

// 4. Internal Render Helpers

// --- UPDATED TARGETS LIST ---
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

function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach(tier => {
        const isUnlocked = count >= tier.target;
        // Progress Calculation
        let percent = 0;
        if(count > 0) {
            percent = Math.min((count / tier.target) * 100, 100);
        }

        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready">CLAIMED</button>` // Logic for manual claim can be added later
            : `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${tier.target} Friends</span>
                <span class="reward-badge" style="color:#ffd700; background:rgba(255, 215, 0, 0.1);">+${tier.reward.toLocaleString()}</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#aaa; margin-top:5px;">
                <span>Progress: ${count}/${tier.target}</span>
                <span>${Math.floor(percent)}%</span>
            </div>
            <div style="margin-top:10px;">${btnHTML}</div>
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
        <div class="team-item">
            <div class="team-info">
                <h4>${friend.name || "Unknown"}</h4>
                <p>ID: ${friend.id}</p>
            </div>
            <div class="commission-box">
                <span class="comm-amount">+${friend.earned_for_ref || 0}</span>
                <span class="comm-label">Earned</span>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

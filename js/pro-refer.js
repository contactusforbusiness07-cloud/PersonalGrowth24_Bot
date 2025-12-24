/* js/pro-refer.js - FULL TARGETS (10k) + DYNAMIC IMPORT FIX */

// --- 1. INSTANT UI RESET (Page Load hote hi chalega) ---
(function instantFix() {
    console.log("🚀 Referral System Initializing...");
    
    // UI ko turant '0' set karo taaki broken squares na dikhein
    if(document.getElementById('total-referrals')) document.getElementById('total-referrals').innerText = "0";
    if(document.getElementById('referral-earnings')) document.getElementById('referral-earnings').innerText = "0";
    
    // Tabs Logic Activate karo
    setupTabs();
})();

// --- 2. MAIN BACKEND LOGIC (Async Wrapper) ---
// HTML change kiye bina Firebase load karne ke liye
(async function startBackend() {
    try {
        // --- DYNAMIC IMPORTS (Magical Part) ---
        const { db } = await import("./firebase-init.js");
        const { doc, getDoc, collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js");

        // --- SETUP VARIABLES ---
        const tg = window.Telegram.WebApp;
        // Fallback ID for testing
        const currentUserId = tg.initDataUnsafe?.user?.id?.toString() || "TEST_USER"; 
        const botUsername = "PersonalGrowth24_Bot"; // Apna Bot username

        console.log("✅ Backend Connected for:", currentUserId);

        // --- 3. LINK GENERATION & SHARE ---
        setupReferralLink(currentUserId, botUsername);

        // --- 4. FETCH DATA ---
        // A. Stats Load
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const count = data.referralCount || 0;
            const earnings = count * 500; // 500 coins per invite

            // Update UI with Real Data
            document.getElementById('total-referrals').innerText = count;
            document.getElementById('referral-earnings').innerText = earnings.toLocaleString();
            
            renderMilestones(count);
        } else {
            // New user, show 0 progress
            renderMilestones(0);
        }

        // B. Friend List Load
        const list = document.getElementById('team-list');
        if (list) {
            list.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b;">Checking team...</div>';
            
            const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
            const snap = await getDocs(q);

            if (snap.empty) {
                list.innerHTML = '<div style="padding:20px; text-align:center; color:#555;">No partners yet. Share link!</div>';
            } else {
                let html = "";
                snap.forEach(d => {
                    const friend = d.data();
                    html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:8px;">
                        <div style="font-size:13px; color:#fff;">${friend.firstName || friend.name || "User"} <span style="font-size:10px; color:#aaa;">(ID:${friend.userId || friend.id})</span></div>
                        <div style="color:#4ade80; font-size:12px;">+500</div>
                    </div>`;
                });
                list.innerHTML = html;
            }
        }

    } catch (error) {
        console.error("🔥 Error in Referral System:", error);
    }
})();

// --- 5. UI HELPER FUNCTIONS ---

function setupReferralLink(uid, botName) {
    const link = `https://t.me/${botName}?start=ref_${uid}`;
    
    if(document.getElementById('my-referral-code')) 
        document.getElementById('my-referral-code').innerText = "FGP-" + uid;
    
    const linkEl = document.getElementById('my-referral-link');
    if(linkEl) {
        linkEl.innerText = link;
        
        // Share Click Logic (Native Share)
        const linkBox = document.querySelector('.code-box.link-style');
        if(linkBox) {
            // Clone to remove old listeners
            const newBox = linkBox.cloneNode(true);
            linkBox.parentNode.replaceChild(newBox, linkBox);
            
            newBox.onclick = async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Join FinGamePro',
                            text: `🚀 Join my team! Earn real coins. Code: FGP-${uid}`,
                            url: link
                        });
                    } catch (err) {
                        // Share cancelled logic (optional)
                    }
                } else {
                    navigator.clipboard.writeText(link);
                    alert("Link Copied!");
                }
            };
        }
    }
}

function setupTabs() {
    window.switchReferTab = function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        // Show target tab
        const target = document.getElementById(`tab-${tabName}`);
        if(target) target.classList.remove('hidden');
        
        // Activate button
        const btns = document.querySelectorAll('.tab-btn');
        if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
        if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
    };
}

// --- FULL MILESTONE LIST (Up to 10k) ---
function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    // 🔥 FULL TARGET LIST RESTORED
    const tiers = [
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

    tiers.forEach(tier => {
        const isUnlocked = count >= tier.target;
        // Progress Calculation
        let percent = 0;
        if (count > 0) {
            percent = Math.min((count / tier.target) * 100, 100);
        }
        
        // Button Logic
        let btn = isUnlocked 
            ? `<span style="color:#4ade80; font-weight:bold; font-size:10px;">CLAIMED</span>` 
            : `<span style="color:#aaa; font-size:10px;"><i class="fa-solid fa-lock"></i> LOCKED</span>`;

        // Render Card
        list.innerHTML += `
        <div style="background:rgba(255,255,255,0.05); padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="color:#fff; font-size:12px; font-family:'Orbitron';">${tier.target} Friends</span>
                <span style="color:#ffd700; background:rgba(255, 215, 0, 0.1); padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold;">+${tier.reward.toLocaleString()}</span>
            </div>
            <div style="height:6px; background:#1e293b; border-radius:3px; overflow:hidden; margin-bottom:8px;">
                <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #06b6d4);"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#64748b; font-size:10px;">${count}/${tier.target} Joined</span>
                ${btn}
            </div>
        </div>`;
    });
}

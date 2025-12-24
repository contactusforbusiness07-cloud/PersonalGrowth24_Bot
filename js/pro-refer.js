/* js/pro-refer.js - FAIL-SAFE VERSION (FIXED LOADING & TABS) */

import { db } from "./firebase-init.js"; 
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 1. SAFE USER ID DETECTION ---
const tg = window.Telegram.WebApp;
let currentUserId = tg.initDataUnsafe?.user?.id?.toString(); 
const botUsername = "PersonalGrowth24_Bot"; // Apna Bot username yahan check karein

// ⚠️ FALLBACK: Agar browser me test kar rahe ho to ye Fake ID use karega
if (!currentUserId) {
    console.warn("⚠️ No Telegram User found. Using TEST_USER mode.");
    currentUserId = "TEST_USER_123";
}

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Referral System Starting...");
    
    // Step 1: UI ko turant unblock karein (Loading hatayein)
    forceResetUI();

    // Step 2: Tabs ko activate karein
    initTabs();

    // Step 3: Data Load karein
    initReferralSystem();
});

function forceResetUI() {
    // Header Stats fix
    const totalRef = document.getElementById('total-referrals');
    const totalEarn = document.getElementById('referral-earnings');
    
    if(totalRef) totalRef.innerText = "0";
    if(totalEarn) totalEarn.innerText = "0";

    // Link Text fix
    const codeEl = document.getElementById('my-referral-code');
    const linkEl = document.getElementById('my-referral-link');
    
    if(codeEl) codeEl.innerText = "FGP-" + currentUserId;
    if(linkEl) linkEl.innerText = `https://t.me/${botUsername}?start=ref_${currentUserId}`;
}

async function initReferralSystem() {
    setupShareLogic();       // Share button activate
    await loadReferralStats(); // Firebase data fetch
    await loadFriendList();    // Team list fetch
}

// --- 3. LINK & SOCIAL SHARE LOGIC ---
function setupShareLogic() {
    const linkBox = document.querySelector('.code-box.link-style');
    const linkText = `https://t.me/${botUsername}?start=ref_${currentUserId}`;
    
    if(linkBox) {
        // Cloning to remove old event listeners
        const newBox = linkBox.cloneNode(true);
        linkBox.parentNode.replaceChild(newBox, linkBox);
        
        // Native Share Click Event
        newBox.onclick = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Join FinGamePro',
                        text: `🚀 Join my team on FinGamePro and earn coins! Code: FGP-${currentUserId}`,
                        url: linkText
                    });
                } catch (err) {
                    console.log('Share closed/failed', err);
                    fallbackCopy(linkText);
                }
            } else {
                fallbackCopy(linkText);
            }
        };
    }
}

function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            toast: true, position: 'top', icon: 'success', 
            title: 'Link Copied!', background: '#020617', color: '#fff', 
            showConfirmButton: false, timer: 1500
        });
    });
}

// --- 4. FIREBASE DATA FETCHING ---
async function loadReferralStats() {
    try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const refCount = data.referralCount || 0;
            const earnings = refCount * 500; 

            // Update UI with Real Data
            document.getElementById('total-referrals').innerText = refCount;
            document.getElementById('referral-earnings').innerText = earnings.toLocaleString();

            renderMilestones(refCount);
        } else {
            console.log("New user (No DB record yet). Showing defaults.");
            renderMilestones(0);
        }
    } catch (error) {
        console.error("Stats Load Error:", error);
        // Error aaye tab bhi UI block mat karo
        renderMilestones(0); 
    }
}

async function loadFriendList() {
    const listContainer = document.getElementById('team-list');
    if(!listContainer) return;

    // Show Loader inside the list only
    listContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b;">Checking team...</div>';

    try {
        const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding:30px; color:#64748b;">
                    <i class="fa-solid fa-user-plus" style="font-size:24px; margin-bottom:10px; opacity:0.5;"></i><br>
                    No partners yet.<br>Share your link to start earning!
                </div>`;
            return;
        }

        let html = "";
        querySnapshot.forEach((doc) => {
            const friend = doc.data();
            html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:32px; height:32px; background:#1e293b; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <h4 style="margin:0; font-size:13px; color:#f1f5f9;">${friend.name || "User"}</h4>
                        <p style="margin:0; font-size:10px; color:#64748b;">ID: ${friend.id || "Unknown"}</p>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="color:#4ade80; font-weight:bold; font-size:12px;">+500</span>
                    <span style="display:block; font-size:9px; color:#64748b;">Coins</span>
                </div>
            </div>`;
        });
        listContainer.innerHTML = html;

    } catch (e) {
        console.error("Team Load Error:", e);
        listContainer.innerHTML = '<div style="text-align:center; color:#ef4444;">Failed to load team.</div>';
    }
}

// --- 5. TAB LOGIC (Make sure this runs) ---
function initTabs() {
    // Expose function globally
    window.switchReferTab = function(tabName) {
        // Hide all contents
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        // Show Target
        const target = document.getElementById(`tab-${tabName}`);
        if(target) target.classList.remove('hidden');
        
        // Highlight Button
        // Button Logic: Assume order 0=Milestones, 1=Team based on HTML
        const btns = document.querySelectorAll('.tab-btn');
        if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
        if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
    };
}

// --- 6. RENDER MILESTONES ---
const REFERRAL_TARGETS = [
    { target: 3, reward: 500 }, { target: 5, reward: 1000 },
    { target: 10, reward: 2500 }, { target: 20, reward: 5000 },
    { target: 50, reward: 15000 }, { target: 100, reward: 35000 },
    { target: 500, reward: 200000 }, { target: 1000, reward: 500000 }
];

function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach(tier => {
        const isUnlocked = count >= tier.target;
        let percent = 0;
        if(count > 0) percent = Math.min((count / tier.target) * 100, 100);

        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready" style="background:#4ade80; color:#000; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; font-size:10px;">CLAIMED</button>` 
            : `<button class="btn-claim locked" style="background:#334155; color:#94a3b8; border:1px solid #475569; padding:5px 10px; border-radius:4px; font-size:10px;"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card" style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-family:'Orbitron'; color:#fff; font-size:12px;">${tier.target} Friends</span>
                <span style="color:#ffd700; background:rgba(255, 215, 0, 0.1); padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold;">+${tier.reward.toLocaleString()}</span>
            </div>
            <div style="height:6px; background:#0f172a; border-radius:3px; overflow:hidden; margin-bottom:8px;">
                <div style="width: ${percent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #06b6d4);"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">
                <span>${count}/${tier.target} Joined</span>
                <span>${Math.floor(percent)}%</span>
            </div>
            <div style="margin-top:10px; text-align:right;">${btnHTML}</div>
        </div>`;
    });
}

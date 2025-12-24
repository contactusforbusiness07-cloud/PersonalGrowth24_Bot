/* js/pro-refer.js - FIXED LOADING & SOCIAL SHARE */

import { db } from "./firebase-init.js"; 
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 1. User ID Detection (Safe Mode)
const tg = window.Telegram.WebApp;
const currentUserId = tg.initDataUnsafe?.user?.id?.toString(); 
const botUsername = "PersonalGrowth24_Bot"; // Apna Bot Username Check karein

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // UI ko turant "0" set karein taaki broken icons na dikhein
    resetUI();

    if (currentUserId) {
        initReferralSystem();
    } else {
        console.warn("⚠️ Testing Mode: No Telegram ID found.");
        // Testing ke liye fake data dikha sakte hain agar chahiye
        document.getElementById('my-referral-code').innerText = "FGP-TEST";
        document.getElementById('my-referral-link').innerText = "https://t.me/test_link";
    }
});

function resetUI() {
    // Fix broken squares by setting default 0
    if(document.getElementById('total-referrals')) document.getElementById('total-referrals').innerText = "0";
    if(document.getElementById('referral-earnings')) document.getElementById('referral-earnings').innerText = "0";
}

async function initReferralSystem() {
    setupReferralLink();      // Link generate karo
    await loadReferralStats(); // Firebase se data lao
    await loadFriendList();    // Team list lao
}

// --- 2. LINK GENERATION & SOCIAL SHARE ---
function setupReferralLink() {
    const refCode = `ref_${currentUserId}`;
    const link = `https://t.me/${botUsername}?start=${refCode}`;
    
    // Set Text
    const codeEl = document.getElementById('my-referral-code');
    const linkEl = document.getElementById('my-referral-link');

    if(codeEl) codeEl.innerText = "FGP-" + currentUserId;
    if(linkEl) linkEl.innerText = link;

    // --- 🔥 NEW: NATIVE SOCIAL SHARE LOGIC ---
    // Jab user Link wale box pe click karega, Share Sheet khulegi
    const linkBox = document.querySelector('.code-box.link-style');
    if(linkBox) {
        // Purana onclick hatane ke liye clone (Optional safety)
        const newBox = linkBox.cloneNode(true);
        linkBox.parentNode.replaceChild(newBox, linkBox);
        
        newBox.onclick = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Join FinGamePro!',
                        text: `🚀 Join me on FinGamePro and earn coins! Use my code: FGP-${currentUserId}`,
                        url: link
                    });
                    console.log('Shared successfully');
                } catch (err) {
                    console.log('Error sharing:', err);
                    // Agar share fail ho (desktop), to copy karo
                    copyTextToClipboard(link);
                }
            } else {
                // Fallback for Desktop (Copy Link)
                copyTextToClipboard(link);
            }
        };
    }
}

// Helper: Copy Fallback
function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            toast: true, position: 'top', icon: 'success', 
            title: 'Link Copied!', background: '#020617', color: '#fff', 
            showConfirmButton: false, timer: 1500
        });
    });
}

// --- 3. DATA FETCHING (FIREBASE) ---
async function loadReferralStats() {
    try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const refCount = data.referralCount || 0;
            const earnings = refCount * 500; 

            // Update Header Stats (Fixing "Loading..." Issue)
            const countEl = document.getElementById('total-referrals');
            const earnEl = document.getElementById('referral-earnings');

            if(countEl) countEl.innerText = refCount;
            if(earnEl) earnEl.innerText = earnings.toLocaleString();

            renderMilestones(refCount);
        } else {
            // User DB me nahi hai (New User)
            console.log("User doc not found, creating default...");
            resetUI();
        }
    } catch (error) {
        console.error("Error loading stats:", error);
        resetUI(); // Error aaye to bhi 0 dikhao, broken icon nahi
    }
}

async function loadFriendList() {
    const listContainer = document.getElementById('team-list');
    if(!listContainer) return;
    
    // listContainer.innerHTML = '...'; // Loader styling preserved from CSS

    try {
        const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            renderTeamList([]); 
            return;
        }

        let teamData = [];
        querySnapshot.forEach((doc) => {
            const friend = doc.data();
            teamData.push({
                name: friend.firstName || friend.name || "Unknown", // Handle varied names
                id: friend.userId || friend.id,
                earned_for_ref: 500 
            });
        });

        renderTeamList(teamData);

    } catch (e) {
        console.error("Error fetching team:", e);
    }
}

// --- 4. RENDER UI HELPERS (Unchanged Logic) ---

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
            ? `<button class="btn-claim ready">CLAIMED</button>` 
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
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No friends yet. Share your link!</div>`;
        return;
    }

    let html = "";
    team.forEach(friend => {
        html += `
        <div class="team-item" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:8px;">
            <div class="team-info">
                <h4 style="margin:0; font-size:13px; color:#fff;">${friend.name}</h4>
                <p style="margin:0; font-size:10px; color:#aaa;">ID: ${friend.id}</p>
            </div>
            <div class="commission-box" style="text-align:right;">
                <span class="comm-amount" style="color:#4ade80; font-weight:bold; font-size:12px;">+${friend.earned_for_ref}</span>
                <span class="comm-label" style="display:block; font-size:9px; color:#aaa;">Earned</span>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

// --- GLOBAL UTILS ---
window.switchReferTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
    if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
}

// Note: copyReferralCode ki zaroorat ab shareLogic me handle ho gayi hai, par 'Code' copy karne ke liye rakh sakte hain
window.copyReferralCode = function() {
    const code = document.getElementById('my-referral-code')?.innerText;
    if(code) copyTextToClipboard(code);
}

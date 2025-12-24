/* js/pro-refer.js - BACKEND CONNECTED & STRICT VERIFICATION */

import { db } from "./firebase-init.js"; 
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Current User ID (Telegram WebApp se)
const tg = window.Telegram.WebApp;
const currentUserId = tg.initDataUnsafe?.user?.id?.toString();
const botUsername = "PersonalGrowth24_Bot"; // Apna Bot username yahan confirm karein

// --- 1. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (currentUserId) {
        initReferralSystem();
    } else {
        console.warn("No User ID found. Testing mode or outside Telegram.");
    }
});

async function initReferralSystem() {
    // UI Setup
    setupReferralLink();
    
    // Data Fetching (Strict Verification)
    await loadReferralStats();
    await loadFriendList();
}

// --- 2. DATA FETCHING (BACKEND) ---

// A. Load User Stats (Count & Earnings)
async function loadReferralStats() {
    try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const refCount = data.referralCount || 0;
            const earnings = refCount * 500; // 500 coins per refer formula

            // Update Header Stats
            if(document.getElementById('total-referrals')) 
                document.getElementById('total-referrals').innerText = refCount;
            
            if(document.getElementById('referral-earnings')) 
                document.getElementById('referral-earnings').innerText = earnings.toLocaleString();

            // Render Milestones based on Real Count
            renderMilestones(refCount);
        }
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// B. Load Team List (Querying Database)
async function loadFriendList() {
    const listContainer = document.getElementById('team-list');
    if(!listContainer) return;
    
    listContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#aaa;"><i class="fa-solid fa-circle-notch fa-spin"></i> Verifying partners...</div>';

    try {
        // Query: Find users where 'referredBy' == currentUserId
        const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            renderTeamList([]); // Empty list render
            return;
        }

        let teamData = [];
        querySnapshot.forEach((doc) => {
            const friend = doc.data();
            teamData.push({
                name: friend.firstName || "Unknown User",
                id: friend.userId,
                earned_for_ref: 500 // Static reward per user
            });
        });

        renderTeamList(teamData); // Pass real data to your UI renderer

    } catch (e) {
        console.error("Error fetching team:", e);
        listContainer.innerHTML = '<div style="text-align:center; color:#ef4444;">Error loading data.</div>';
    }
}

// --- 3. UI SETUP ---

function setupReferralLink() {
    const refCode = `ref_${currentUserId}`;
    const link = `https://t.me/${botUsername}?start=${refCode}`;
    
    if(document.getElementById('my-referral-code')) 
        document.getElementById('my-referral-code').innerText = "FGP-" + currentUserId;
    
    if(document.getElementById('my-referral-link')) 
        document.getElementById('my-referral-link').innerText = link;
}


// --- 4. RENDER LOGIC (YOUR ORIGINAL UI CODE PRESERVED) ---

// UPDATED TARGETS LIST
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


// --- 5. GLOBAL UTILS (Tabs & Copy) ---

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
    if(textToCopy.includes("Loading") || textToCopy.includes("Generating")) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector('.code-box i');
        if(btn) {
            const originalClass = btn.className;
            btn.className = "fa-solid fa-check";
            setTimeout(() => btn.className = originalClass, 2000);
        }
        
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true, position: 'top', icon: 'success', 
                title: 'Link Copied!', showConfirmButton: false, timer: 1500,
                background: '#020617', color: '#fff'
            });
        }
    });
}


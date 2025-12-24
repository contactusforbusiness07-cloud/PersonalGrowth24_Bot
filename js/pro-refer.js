/* js/pro-refer.js - INSTANT UI FIX VERSION */

import { db } from "./firebase-init.js"; 
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 1. SETUP VARIABLES ---
const tg = window.Telegram.WebApp;
// Agar Telegram ID nahi mili to 'TEST_USER' use karega taaki app atke nahi
const currentUserId = tg.initDataUnsafe?.user?.id?.toString() || "TEST_USER_123"; 
const botUsername = "PersonalGrowth24_Bot"; 

// --- 2. INSTANT EXECUTION (Wait mat karo) ---
// Jaise hi file load ho, ye functions turant chalenge
(function instantStart() {
    console.log("🚀 Referral System Started for:", currentUserId);
    
    // UI ko turant '0' kar do (Loading hatao)
    resetVisuals();
    
    // Tabs ke buttons ko chalu karo
    activateTabs();
    
    // Link banao
    renderLink();
    
    // Ab shanti se background me data fetch karo
    fetchDataBackground();
})();

// --- 3. UI FUNCTIONS (Ye turant chalenge) ---
function resetVisuals() {
    // Square boxes me 0 dikhao
    const totalRef = document.getElementById('total-referrals');
    const totalEarn = document.getElementById('referral-earnings');
    
    if(totalRef) totalRef.innerText = "0";
    if(totalEarn) totalEarn.innerText = "0";
    
    // Milestones ko default (0) pe render kar do taaki list dikhe
    renderMilestones(0);
}

function activateTabs() {
    // Window object pe function attach kar rahe hain taaki HTML button ise dhoondh sake
    window.switchReferTab = function(tabName) {
        // Hide all contents
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        // Show Target
        const target = document.getElementById(`tab-${tabName}`);
        if(target) target.classList.remove('hidden');
        
        // Highlight Button
        const btns = document.querySelectorAll('.tab-btn');
        if(tabName === 'milestones' && btns[0]) btns[0].classList.add('active');
        if(tabName === 'team' && btns[1]) btns[1].classList.add('active');
    };
}

function renderLink() {
    const codeEl = document.getElementById('my-referral-code');
    const linkEl = document.getElementById('my-referral-link');
    const link = `https://t.me/${botUsername}?start=ref_${currentUserId}`;

    if(codeEl) codeEl.innerText = "FGP-" + currentUserId;
    if(linkEl) {
        linkEl.innerText = link;
        
        // Share Click Logic
        const linkBox = document.querySelector('.code-box.link-style');
        if(linkBox) {
            linkBox.onclick = async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Join FinGamePro',
                            text: `🚀 Join my team and earn coins! Code: FGP-${currentUserId}`,
                            url: link
                        });
                    } catch (err) { copyText(link); }
                } else {
                    copyText(link);
                }
            };
        }
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text);
    if(typeof Swal !== 'undefined') {
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Link Copied', timer: 1000, showConfirmButton: false });
    } else {
        alert("Link Copied!");
    }
}

// --- 4. DATA LOGIC (Background me chalega) ---
async function fetchDataBackground() {
    try {
        // A. Stats
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const count = data.referralCount || 0;
            const earn = count * 500;
            
            // Ab UI update karo real data se
            document.getElementById('total-referrals').innerText = count;
            document.getElementById('referral-earnings').innerText = earn.toLocaleString();
            renderMilestones(count);
        }

        // B. Team List
        loadTeamList();

    } catch (e) {
        console.error("Data Error:", e);
    }
}

async function loadTeamList() {
    const list = document.getElementById('team-list');
    if(!list) return;
    
    list.innerHTML = '<div style="padding:20px; text-align:center;">Checking...</div>';

    try {
        const q = query(collection(db, "users"), where("referredBy", "==", currentUserId));
        const snap = await getDocs(q);

        if (snap.empty) {
            list.innerHTML = '<div style="padding:20px; text-align:center; color:#aaa;">No friends yet.</div>';
            return;
        }

        let html = "";
        snap.forEach(doc => {
            const d = doc.data();
            html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:8px;">
                <div style="font-size:13px; color:#fff;">${d.firstName || "User"} <span style="font-size:10px; color:#aaa;">(ID:${d.userId})</span></div>
                <div style="color:#4ade80; font-size:12px;">+500 Coins</div>
            </div>`;
        });
        list.innerHTML = html;
    } catch(e) {
        list.innerHTML = '<div style="padding:20px; text-align:center; color:red;">Error loading list.</div>';
    }
}

// --- 5. RENDER HELPERS ---
function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    const targets = [3, 5, 10, 20, 50, 100];
    const rewards = [500, 1000, 2500, 5000, 15000, 35000];

    targets.forEach((target, i) => {
        const isUnlocked = count >= target;
        let percent = Math.min((count / target) * 100, 100);
        
        // Simple Button HTML
        let btn = isUnlocked 
            ? `<span style="color:#4ade80; font-weight:bold; font-size:10px;">CLAIMED</span>` 
            : `<span style="color:#aaa; font-size:10px;"><i class="fa-solid fa-lock"></i> LOCKED</span>`;

        list.innerHTML += `
        <div style="background:rgba(255,255,255,0.05); padding:12px; margin-bottom:10px; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="color:#fff; font-size:12px;">${target} Friends</span>
                <span style="color:#ffd700; font-size:11px;">+${rewards[i]}</span>
            </div>
            <div style="height:4px; background:#1e293b; border-radius:2px; margin-bottom:5px;">
                <div style="width:${percent}%; height:100%; background:#3b82f6;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#64748b; font-size:10px;">${count}/${target}</span>
                ${btn}
            </div>
        </div>`;
    });
}

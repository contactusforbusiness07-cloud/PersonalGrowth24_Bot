import { db } from './main.js'; 
import { doc, getDoc, updateDoc, increment, collection, setDoc, serverTimestamp, runTransaction, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- CONFIG ---
let currentUser = null;
const REFERRAL_REWARD_PER_USER = 100; 
const BOT_USERNAME = "PersonalGrowth24_Bot"; // Apna Bot Username Check Karein

// --- MILESTONES DATA ---
const REFERRAL_TARGETS = [
    { target: 3, reward: 500 },
    { target: 5, reward: 1000 },
    { target: 10, reward: 2500 },
    { target: 20, reward: 5000 },
    { target: 50, reward: 15000 },
    { target: 100, reward: 35000 },
    { target: 500, reward: 200000 }, 
    { target: 1000, reward: 500000 }
];

// --- 1. INITIALIZE SYSTEM ---
export async function initReferralSystem(user) {
    currentUser = user;
    if (!currentUser) {
        console.error("User not found via Telegram!");
        return;
    }

    console.log("🔒 Initializing Referral System for:", currentUser.id);

    // A. UI Updates (Turant Loading Hatao)
    const inviteLink = `https://t.me/${BOT_USERNAME}?start=ref_${currentUser.id}`;
    
    if(document.getElementById('my-referral-code')) {
        document.getElementById('my-referral-code').innerText = "FGP-" + currentUser.id;
    }
    if(document.getElementById('my-referral-link')) {
        document.getElementById('my-referral-link').innerText = inviteLink;
    }

    // B. Verification Logic (Pending -> Verified)
    await verifyAndRewardReferrer();

    // C. Load Stats from Firebase
    loadReferralStats();
}

// --- 2. STRICT VERIFICATION LOGIC ---
async function verifyAndRewardReferrer() {
    // Agar status 'pending' hai to hi process karein
    if (currentUser.referralStatus === 'pending' && currentUser.joined_via) {
        const referrerId = currentUser.joined_via;
        console.log(`🔍 Verifying referral from: ${referrerId}`);

        const userRef = doc(db, "users", currentUser.id);
        const referrerRef = doc(db, "users", referrerId);
        const teamRef = doc(db, "users", referrerId, "my_team", currentUser.id);

        try {
            await runTransaction(db, async (transaction) => {
                const rDoc = await transaction.get(referrerRef);
                if (!rDoc.exists()) throw "Referrer does not exist!";

                // 1. User Verified Mark karo
                transaction.update(userRef, { referralStatus: 'verified' });

                // 2. Referrer ko Paisa do
                transaction.update(referrerRef, {
                    balance: increment(REFERRAL_REWARD_PER_USER),
                    referralCount: increment(1),
                    totalEarnings: increment(REFERRAL_REWARD_PER_USER)
                });

                // 3. Team List me add karo
                transaction.set(teamRef, {
                    name: currentUser.name,
                    id: currentUser.id,
                    joinedAt: serverTimestamp(),
                    earned_for_ref: REFERRAL_REWARD_PER_USER
                });
            });

            console.log("✅ Verified & Reward Sent!");
            Swal.fire({
                toast: true, position: 'top', icon: 'success', 
                title: 'Account Verified!', showConfirmButton: false, timer: 2000, 
                background: '#00f260', color: '#000'
            });
            
        } catch (e) {
            console.error("Verification Error:", e);
        }
    }
}

// --- 3. LOAD STATS & MILESTONES ---
async function loadReferralStats() {
    const userRef = doc(db, "users", currentUser.id);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
        const data = snap.data();
        
        // Stats Update
        if(document.getElementById('total-referrals')) {
            document.getElementById('total-referrals').innerText = data.referralCount || 0;
        }
        if(document.getElementById('referral-earnings')) {
            document.getElementById('referral-earnings').innerText = (data.totalEarnings || 0).toLocaleString();
        }
        // Render Milestones
        renderMilestones(data.referralCount || 0);
    }
}

// --- 4. RENDER MILESTONES (Fix) ---
function renderMilestones(currentCount) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = ""; // Clear Loading

    REFERRAL_TARGETS.forEach(tier => {
        const isUnlocked = currentCount >= tier.target;
        let percent = Math.min((currentCount / tier.target) * 100, 100);
        
        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready">CLAIMED (Auto)</button>` 
            : `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${tier.target} Friends</span>
                <span class="reward-badge">+${tier.reward.toLocaleString()}</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#aaa;">
                <span>Progress: ${currentCount}/${tier.target}</span>
                <span>${percent.toFixed(0)}%</span>
            </div>
            <div style="margin-top:10px;">${btnHTML}</div>
        </div>`;
    });
}

// --- 5. GLOBAL FUNCTIONS (Tabs Fix) ---
// Window object par attach karna zaroori hai taaki HTML onclick kaam kare
window.copyReferralCode = function() {
    const link = document.getElementById('my-referral-link').innerText;
    if(link.includes("Generating")) return;

    navigator.clipboard.writeText(link).then(() => {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success', 
            title: 'Copied!', showConfirmButton: false, timer: 1000, 
            background: '#00f260', color: '#000'
        });
    });
}

window.switchReferTab = function(tabName) {
    // UI toggle
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.currentTarget.classList.add('active'); // Fix: currentTarget use karein
    
    if(tabName === 'team') {
        loadTeamList();
    }
}

// --- 6. LOAD TEAM LIST ---
async function loadTeamList() {
    const list = document.getElementById('team-list');
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#00f2fe;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading Team...</div>';

    try {
        const teamRef = collection(db, "users", currentUser.id, "my_team");
        const snapshot = await getDocs(teamRef);

        if (snapshot.empty) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No friends joined yet.</div>`;
            return;
        }

        let html = "";
        snapshot.forEach(doc => {
            const friend = doc.data();
            html += `
            <div class="team-item">
                <div class="team-info">
                    <h4>${friend.name}</h4>
                    <p>ID: ${friend.id}</p>
                </div>
                <div class="commission-box">
                    <span class="comm-amount">+${friend.earned_for_ref}</span>
                    <span class="comm-label">Earned</span>
                </div>
            </div>`;
        });
        list.innerHTML = html;

    } catch (e) {
        console.error("Team Error:", e);
        list.innerHTML = `<div style="text-align:center; color:red;">Failed to load list</div>`;
    }
}



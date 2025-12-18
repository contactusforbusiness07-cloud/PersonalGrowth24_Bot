import { db } from './main.js'; // Ensure main.js exports 'db'
import { doc, getDoc, updateDoc, increment, collection, setDoc, serverTimestamp, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- GLOBAL VARIABLES ---
let currentUser = null;
const REFERRAL_REWARD_PER_USER = 100; // Ek refer ka kitna milega (Adjust karein)

// --- 1. INITIALIZE SYSTEM ---
export async function initReferralSystem(user) {
    currentUser = user;
    if (!currentUser) return;

    console.log("🔒 Initializing Strict Referral System...");

    // A. Generate Link
    const botUsername = "PersonalGrowth24_Bot"; // Apna Bot Username yahan dalein
    const inviteLink = `https://t.me/${botUsername}?start=ref_${currentUser.id}`;
    
    // UI Update (Link & Code)
    if(document.getElementById('my-referral-code')) {
        document.getElementById('my-referral-code').innerText = "FGP-" + currentUser.id;
    }
    if(document.getElementById('my-referral-link')) {
        document.getElementById('my-referral-link').innerText = inviteLink;
    }

    // B. Check & Execute Pending Referral (The Verification Step)
    await verifyAndRewardReferrer();

    // C. Load Real Data from Firebase
    loadReferralStats();
}

// --- 2. VERIFICATION LOGIC (The Anti-Cheat) ---
async function verifyAndRewardReferrer() {
    // Check agar user ka status 'pending' hai (Jo Bot ne set kiya tha)
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

                // 1. User ka status update karo (Verified)
                transaction.update(userRef, { 
                    referralStatus: 'verified' 
                });

                // 2. Referrer ko Reward do
                transaction.update(referrerRef, {
                    balance: increment(REFERRAL_REWARD_PER_USER),
                    referralCount: increment(1),
                    totalEarnings: increment(REFERRAL_REWARD_PER_USER)
                });

                // 3. Referrer ki Team List me User ko add karo
                transaction.set(teamRef, {
                    name: currentUser.name,
                    id: currentUser.id,
                    joinedAt: serverTimestamp(),
                    earned_for_ref: REFERRAL_REWARD_PER_USER
                });
            });

            console.log("✅ Referral Verified & Reward Sent!");
            // Optional: User ko bhi kuch bonus dena hai to yahan de sakte ho
            
        } catch (e) {
            console.error("Referral Transaction Failed:", e);
        }
    }
}

// --- 3. LOAD DATA FOR UI ---
async function loadReferralStats() {
    // Firebase se Data Read karo (Current User ka)
    const userRef = doc(db, "users", currentUser.id);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
        const data = snap.data();
        
        // Update Stats on Screen
        if(document.getElementById('total-referrals')) {
            document.getElementById('total-referrals').innerText = data.referralCount || 0;
        }
        if(document.getElementById('referral-earnings')) {
            document.getElementById('referral-earnings').innerText = (data.totalEarnings || 0).toLocaleString();
        }
    }
    
    // Milestones Render karo (Based on Count)
    renderMilestones(snap.data()?.referralCount || 0);
}

// --- 4. COPY FUNCTION ---
window.copyReferralCode = function() {
    const link = document.getElementById('my-referral-link').innerText;
    navigator.clipboard.writeText(link).then(() => {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success', 
            title: 'Link Copied!', showConfirmButton: false, timer: 1500,
            background: '#00f260', color: '#000'
        });
    });
}

// --- 5. TABS LOGIC ---
window.switchReferTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
    
    if(tabName === 'team') {
        loadTeamList(); // Load team only when tab is clicked
    }
}

// --- 6. LOAD TEAM LIST (Sub-collection fetch) ---
import { getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"; // Lazy import

async function loadTeamList() {
    const list = document.getElementById('team-list');
    list.innerHTML = '<div class="loading-spinner">Loading Team...</div>';

    try {
        const teamRef = collection(db, "users", currentUser.id, "my_team");
        const snapshot = await getDocs(teamRef);

        if (snapshot.empty) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No friends yet.</div>`;
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
                    <span class="comm-label">Verified</span>
                </div>
            </div>`;
        });
        list.innerHTML = html;

    } catch (e) {
        console.error("Error loading team:", e);
        list.innerHTML = "Error loading list.";
    }
}

// --- 7. MILESTONES RENDER (Visual Only) ---
const REFERRAL_TARGETS = [3, 5, 10, 20, 50, 100]; // Targets

function renderMilestones(currentCount) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach(target => {
        const isUnlocked = currentCount >= target;
        let percent = Math.min((currentCount / target) * 100, 100);
        let btnClass = isUnlocked ? "btn-claim ready" : "btn-claim locked";
        let btnText = isUnlocked ? "CLAIM BONUS" : "LOCKED";
        
        // Agar already claimed logic lagana ho to wo database me 'claimed_milestones' array bana kar check hoga
        // Abhi ke liye simple visual:
        
        list.innerHTML += `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${target} Friends</span>
                <span class="reward-badge">Bonus</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <div style="font-size:12px; color:#aaa;">Progress: ${currentCount}/${target}</div>
            <button class="${btnClass}">${btnText}</button>
        </div>`;
    });
}


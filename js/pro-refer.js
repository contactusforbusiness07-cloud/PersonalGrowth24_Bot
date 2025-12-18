import { db } from './main.js'; // Ensure main.js exports 'db'
import { doc, getDoc, updateDoc, increment, collection, setDoc, serverTimestamp, runTransaction, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- GLOBAL VARIABLES ---
let currentUser = null;
const REFERRAL_REWARD_PER_USER = 100; // Reward Amount

// --- 1. INITIALIZE SYSTEM ---
export async function initReferralSystem(user) {
    currentUser = user;
    if (!currentUser) return;

    console.log("🔒 Initializing Strict Referral System...");

    // A. Generate Link
    const botUsername = "PersonalGrowth24_Bot"; // Apna Bot Username verify kar lein
    const inviteLink = `https://t.me/${botUsername}?start=ref_${currentUser.id}`;
    
    // UI Update (Link & Code) - Ye ab "Loading" hatakar Real Data dikhayega
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
            // Optional: User ko bhi verified hone ka confirmation toast dikhayen
            Swal.fire({
                toast: true, position: 'top', icon: 'success', 
                title: 'Account Verified! Bonus Unlocked.', 
                showConfirmButton: false, timer: 3000, background: '#00f260', color: '#000'
            });
            
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
        // Milestones Render karo
        renderMilestones(data.referralCount || 0);
    }
}

// --- 4. COPY FUNCTION (Globally Attached) ---
window.copyReferralCode = function() {
    const linkElement = document.getElementById('my-referral-link');
    if(linkElement) {
        const link = linkElement.innerText;
        if(link.includes("Loading")) return; // Don't copy if loading

        navigator.clipboard.writeText(link).then(() => {
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', 
                title: 'Link Copied!', showConfirmButton: false, timer: 1500,
                background: '#00f260', color: '#000'
            });
        });
    }
}

// --- 5. TABS LOGIC (Globally Attached - Fixes Click Issue) ---
window.switchReferTab = function(tabName) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Show selected
    const targetContent = document.getElementById(`tab-${tabName}`);
    if(targetContent) targetContent.classList.remove('hidden');
    
    // Highlight button
    event.currentTarget.classList.add('active'); // Current clicked button
    
    if(tabName === 'team') {
        loadTeamList(); // Load team only when tab is clicked
    }
}

// --- 6. LOAD TEAM LIST ---
async function loadTeamList() {
    const list = document.getElementById('team-list');
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#00f2fe;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading...</div>';

    try {
        const teamRef = collection(db, "users", currentUser.id, "my_team");
        const snapshot = await getDocs(teamRef);

        if (snapshot.empty) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">
                <i class="fa-solid fa-users-slash" style="font-size:24px; margin-bottom:10px;"></i><br>
                No friends yet.
            </div>`;
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
        list.innerHTML = `<div style="text-align:center; color:red;">Error loading list</div>`;
    }
}

// --- 7. MILESTONES RENDER ---
const REFERRAL_TARGETS = [3, 5, 10, 20, 50, 100, 500, 1000]; 

function renderMilestones(currentCount) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach(target => {
        const isUnlocked = currentCount >= target;
        let percent = Math.min((currentCount / target) * 100, 100);
        
        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready">CLAIM BONUS</button>` 
            : `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${target} Friends</span>
                <span class="reward-badge">Bonus</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <div style="font-size:12px; color:#aaa; display:flex; justify-content:space-between;">
                <span>Progress: ${currentCount}/${target}</span>
                <span>${percent.toFixed(0)}%</span>
            </div>
            <div style="margin-top:10px;">${btnHTML}</div>
        </div>`;
    });
}


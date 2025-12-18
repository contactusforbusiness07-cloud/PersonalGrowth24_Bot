// --- PRO-REFER.JS (UI & Global Logic) ---

// 1. Render Tabs (Globally Accessible)
window.switchReferTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    // Button Active State
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'milestones') btns[0].classList.add('active');
    if(tabName === 'team') btns[1].classList.add('active');
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
            btn.className = "fa-solid fa-check";
            setTimeout(() => btn.className = "fa-regular fa-copy", 2000);
        }
        // Agar SweetAlert hai to wo use karein
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', 
                title: 'Link Copied!', showConfirmButton: false, timer: 1500,
                background: '#00f260', color: '#000'
            });
        } else {
            alert("Referral Link Copied!");
        }
    });
}

// 3. Render UI with Real Data (Called from main.js)
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
        // Link generate logic
        const botName = "PersonalGrowth24_Bot"; // Apna Bot Username confirm karein
        document.getElementById('my-referral-link').innerText = `https://t.me/${botName}?start=ref_${userData.id}`;
    }

    // Render Sections
    renderMilestones(userData.referralCount || 0);
    renderTeamList(teamData || []);
}

// 4. Internal Render Helpers
const REFERRAL_TARGETS = [3, 5, 10, 20, 50, 100]; 

function renderMilestones(count) {
    const list = document.getElementById('milestone-list');
    if(!list) return;
    list.innerHTML = "";

    REFERRAL_TARGETS.forEach(target => {
        const isUnlocked = count >= target;
        let percent = Math.min((count / target) * 100, 100);
        let btnHTML = isUnlocked 
            ? `<button class="btn-claim ready">CLAIMED</button>` 
            : `<button class="btn-claim locked"><i class="fa-solid fa-lock"></i> LOCKED</button>`;
        
        list.innerHTML += `
        <div class="milestone-card">
            <div class="milestone-header">
                <span class="target-title">${target} Friends</span>
                <span class="reward-badge">Bonus</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#aaa; margin-top:5px;">
                <span>Progress: ${count}/${target}</span>
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


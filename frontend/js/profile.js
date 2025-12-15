// --- 1. OPEN PROFILE PAGES (Fix Redirect Issue) ---
function openInternalPage(pageName) {
    // Menu band karo
    toggleProfileMenu(false);

    // Profile Container VISIBLE karo (Ye zaroori hai)
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Pehle saare internal pages chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Target Page dikhao
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// --- 2. BACK TO MENU LOGIC (The Fix) ---
function backToProfileMenu() {
    // Current Page Chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    // Container Chupao
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // MENU WAPAS KHOLO
    toggleProfileMenu(true);
}

// --- 3. BRAND LOGIC ---
function selectBudget(element, value) {
    document.querySelectorAll('.budget-chip').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('selected-budget').value = value;
}
function sendBrandProposal() {
    const promo = document.querySelector('input[name="promo_type"]:checked');
    const budget = document.getElementById('selected-budget').value;
    if(!promo || !budget) return Swal.fire({icon:'warning', title:'Select All Options', background:'#0f172a', color:'#fff'});
    
    Swal.fire({title:'Sending...', timer:1500, didOpen:()=>Swal.showLoading(), background:'#0f172a', color:'#fff'})
    .then(()=>{
        Swal.fire({icon:'success', title:'Sent!', text:'Admin will contact you.', background:'#0f172a', color:'#fff'})
        .then(()=> backToProfileMenu());
    });
}

// --- 4. REFERRAL LOGIC ---
const referTargets = [3, 5, 10, 20, 50, 100, 500, 1000];
const currentRefers = 7; 
function renderReferralTargets() {
    const container = document.getElementById('referral-targets-list');
    if(!container) return;
    container.innerHTML = '';
    referTargets.forEach(t => {
        let status = currentRefers >= t ? 'btn-claim' : 'btn-locked';
        let text = currentRefers >= t ? 'Claim 1000' : 'Locked';
        let progress = Math.min((currentRefers/t)*100, 100);
        container.innerHTML += `
            <div class="target-item">
                <div class="target-info"><h4>${t} Friends</h4><div style="width:100px;height:4px;background:#333;margin-top:5px"><div style="width:${progress}%;height:100%;background:#22c55e"></div></div></div>
                <button class="target-btn ${status}" onclick="claimReferReward(${t})">${text}</button>
            </div>`;
    });
}
function claimReferReward(t) {
    if(currentRefers < t) return;
    Swal.fire({icon:'success', title:'Claimed!', background:'#0f172a', color:'#fff'});
}
function switchReferTab(tab) {
    document.getElementById('tab-targets').classList.toggle('hidden', tab !== 'targets');
    document.getElementById('tab-list').classList.toggle('hidden', tab !== 'list');
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0 && tab==='targets') || (i===1 && tab==='list')));
}

// --- 5. CONTACT & INFO ---
function submitContactForm() {
    if(!document.getElementById('contact-message').value) return;
    Swal.fire({icon:'success', title:'Sent to Admin', background:'#0f172a', color:'#fff'}).then(()=>backToProfileMenu());
}
window.openInfoPage = function(type) {
    toggleProfileMenu(false);
    let content = type === 'withdraw_terms' ? "Top 10 Rankers: Instant Pay." : "Details here.";
    Swal.fire({title:'Info', text:content, background:'#0f172a', color:'#fff', confirmButtonText:'Back to Menu'})
    .then(()=> toggleProfileMenu(true));
}

renderReferralTargets();


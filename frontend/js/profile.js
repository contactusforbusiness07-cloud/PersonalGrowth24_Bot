// --- 1. OPEN INTERNAL PAGES (Profile, Brand, Refer, Contact) ---
function openInternalPage(pageName) {
    // Menu Band Karo
    toggleProfileMenu(false);

    // Profile Container Dikhao
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Pehle Saare Pages Chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Target Page Dikhao
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error("Page not found:", pageName);
    }
}

// --- 2. BACK BUTTON LOGIC (User Menu par wapas aayega) ---
function backToProfileMenu() {
    // Internal Pages Band Karo
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // Menu Wapas Kholo
    toggleProfileMenu(); 
}

// --- 3. INFO PAGES (Terms, Privacy, FAQ, Withdraw) ---
function openInfoPage(type) {
    toggleProfileMenu(false); // Menu temporarily band

    let title = "Info";
    let content = "Loading...";

    if(type === 'withdraw_terms') { 
        title = "Withdrawal Rules"; 
        content = "1. Top 10 Rankers: Instant Payment.<br>2. Others: Monthly Payment.<br>3. Minimum Withdraw: ₹50."; 
    }
    else if(type === 'terms') { title = "Terms & Conditions"; content = "Using bots or scripts will lead to a permanent ban."; }
    else if(type === 'privacy') { title = "Privacy Policy"; content = "We do not share your personal data with third parties."; }
    else if(type === 'disclaimer') { title = "Disclaimer"; content = "Rewards are distributed from Ad Revenue."; }
    else if(type === 'faq') { 
        title = "Help / FAQ"; 
        content = "<b>Q: How to earn?</b><br>A: Play games, complete tasks, and refer friends.<br><br><b>Q: Payment methods?</b><br>A: UPI and Paytm."; 
    }

    // Popup Dikhao
    Swal.fire({
        title: title,
        html: content,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Back to Menu'
    }).then(() => {
        // Popup band hone par wapas Menu khulega
        toggleProfileMenu();
    });
}

// --- 4. LOGOUT FUNCTION ---
function handleLogout() {
    toggleProfileMenu(false);
    Swal.fire({
        title: 'Logout?',
        text: "Are you sure you want to exit?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Exit',
        background: '#0f172a', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            if(window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.close();
            } else {
                window.close();
            }
        } else {
            toggleProfileMenu(); // Cancel kiya to wapas menu
        }
    });
}

// --- 5. BRAND PAGE LOGIC ---
function selectBudget(element, value) {
    document.querySelectorAll('.budget-chip').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('selected-budget').value = value;
}

function sendBrandProposal() {
    const promoType = document.querySelector('input[name="promo_type"]:checked');
    const budget = document.getElementById('selected-budget').value;
    const msg = document.getElementById('brand-message').value;

    if(!promoType || !budget) {
        Swal.fire({ icon: 'warning', title: 'Missing Details', text: 'Select Platform & Budget', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending...',
        text: 'Contacting Admin @Mr_MorningStar524',
        timer: 2000,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({ icon: 'success', title: 'Sent!', background: '#0f172a', color: '#fff' })
        .then(() => backToProfileMenu());
    });
}

// --- 6. CONTACT FORM LOGIC ---
function submitContactForm() {
    const msg = document.getElementById('contact-message').value;
    if(!msg) {
        Swal.fire({ icon: 'warning', title: 'Empty', background: '#0f172a', color: '#fff' });
        return;
    }
    Swal.fire({ icon: 'success', title: 'Sent to Admin', background: '#0f172a', color: '#fff' })
    .then(() => backToProfileMenu());
}

// --- 7. EDIT PROFILE LOGIC ---
function toggleEditMode(show) {
    if(show) {
        document.getElementById('page-profile').classList.add('hidden');
        document.getElementById('page-profile-edit').classList.remove('hidden');
    } else {
        document.getElementById('page-profile-edit').classList.add('hidden');
        document.getElementById('page-profile').classList.remove('hidden');
    }
}
function saveProfileChanges() {
    const newName = document.getElementById('edit-name-input').value;
    document.getElementById('display-name').innerHTML = `${newName} <i class="fa-solid fa-circle-check text-blue"></i>`;
    toggleEditMode(false);
}

// --- 8. REFERRAL LOGIC ---
// (Gamified Code included)
const referTargets = [3, 5, 10, 15, 20, 25, 50, 100, 500, 1000, 10000];
const currentRefers = 7;
function renderReferralTargets() {
    const container = document.getElementById('referral-targets-list');
    if(!container) return;
    container.innerHTML = '';
    referTargets.forEach(target => {
        let status = currentRefers >= target ? 'btn-claim' : 'btn-locked';
        let text = currentRefers >= target ? 'Claim Reward' : 'Locked';
        let progress = Math.min((currentRefers/target)*100, 100);
        
        container.innerHTML += `
            <div class="target-item">
                <div class="target-info"><h4>${target} Refers</h4><div style="width:100px;height:4px;background:#333"><div style="width:${progress}%;height:100%;background:#22c55e"></div></div></div>
                <button class="target-btn ${status}" onclick="claimReferReward(${target})">${text}</button>
            </div>`;
    });
}
function claimReferReward(t) {
    if(currentRefers < t) return;
    Swal.fire({icon:'success', title:'Claimed!', background:'#0f172a', color:'#fff'});
}
function switchReferTab(t) {
    document.getElementById('tab-targets').classList.toggle('hidden', t !== 'targets');
    document.getElementById('tab-list').classList.toggle('hidden', t !== 'list');
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0 && t==='targets') || (i===1 && t==='list')));
}
renderReferralTargets();


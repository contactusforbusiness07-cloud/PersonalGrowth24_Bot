// --- 1. OPEN PAGES (Logic Fix) ---
function openInternalPage(pageName) {
    // Menu band karo taaki overlap na ho
    toggleProfileMenu(false);

    // Profile Container ko visible karo
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Pehle saare pages chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Jo page chahiye use dikhao
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error("Page ID not found: page-" + pageName);
    }
}

// --- 2. BACK TO MENU (New Logic) ---
function backToProfileMenu() {
    // 1. Current Page Chupao
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    
    // 2. Container Chupao
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // 3. MENU WAPAS KHOLO (Taaki user Home par na gire)
    toggleProfileMenu(true); 
}

// --- 3. BRAND / SPONSORSHIP LOGIC ---
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
        Swal.fire({ icon: 'warning', title: 'Incomplete', text: 'Please select Platform & Budget', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending...',
        text: 'Contacting Admin @Mr_MorningStar524',
        timer: 2000,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({ 
            icon: 'success', 
            title: 'Proposal Sent!', 
            text: 'Admin will reply shortly.', 
            background: '#0f172a', color: '#fff' 
        }).then(() => {
            backToProfileMenu(); // Wapas Menu par
        });
    });
}

// --- 4. REFERRAL SYSTEM (Gamified) ---
const referTargets = [3, 5, 10, 15, 20, 25, 50, 100, 500, 1000];
const currentRefers = 7; // Demo Data

function renderReferralTargets() {
    const container = document.getElementById('referral-targets-list');
    if(!container) return;
    container.innerHTML = '';

    referTargets.forEach(target => {
        let isUnlocked = currentRefers >= target;
        let statusClass = isUnlocked ? 'btn-claim' : 'btn-locked';
        let btnText = isUnlocked ? 'Claim 1000 🪙' : `<i class="fa-solid fa-lock"></i> Locked`;
        let progress = Math.min((currentRefers / target) * 100, 100);

        const html = `
            <div class="target-item">
                <div class="target-info">
                    <h4>${target} Friends</h4>
                    <p>Reward: <span class="text-gold">1000 Coins</span></p>
                    <div style="width: 100px; height: 4px; background: #334155; margin-top: 5px; border-radius: 2px;">
                        <div style="width: ${progress}%; height: 100%; background: #22c55e; border-radius: 2px;"></div>
                    </div>
                </div>
                <button class="target-btn ${statusClass}" onclick="claimReferReward(${target})">${btnText}</button>
            </div>
        `;
        container.innerHTML += html;
    });
}

function switchReferTab(tabName) {
    document.getElementById('tab-targets').classList.add('hidden');
    document.getElementById('tab-list').classList.add('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if(tabName === 'targets') {
        document.getElementById('tab-targets').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('tab-list').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

function claimReferReward(target) {
    if(currentRefers < target) return;
    Swal.fire({ icon: 'success', title: 'Claimed!', text: '1000 Coins Added.', background: '#0f172a', color: '#fff' });
}

// --- 5. CONTACT SUPPORT ---
function submitContactForm() {
    const msg = document.getElementById('contact-message').value;
    if(!msg) return;
    Swal.fire({ icon: 'success', title: 'Sent!', text: 'Message sent to @Mr_MorningStar524', background: '#0f172a', color: '#fff' })
    .then(() => backToProfileMenu());
}

// --- 6. INFO PAGES (Menu Restore Fix) ---
window.openInfoPage = function(type) {
    toggleProfileMenu(false); 
    let title = "Info", content = "Loading...";

    if(type === 'withdraw_terms') { title = "Withdrawal Rules"; content = "Top 10 Rankers: Instant Payout.<br>Others: Monthly."; }
    else if(type === 'terms') { title = "Terms"; content = "No Cheating Allowed."; }
    else if(type === 'privacy') { title = "Privacy"; content = "Data is Safe."; }
    else if(type === 'faq') { title = "FAQ"; content = "Refer friends to earn more."; }
    else if(type === 'disclaimer') { title = "Disclaimer"; content = "Rewards depend on ads."; }

    Swal.fire({
        title: title, html: content, background: '#0f172a', color: '#fff', confirmButtonText: 'Back to Menu'
    }).then(() => {
        toggleProfileMenu(true); // Popup band hone par Menu wapas aayega
    });
}

// --- 7. EDIT PROFILE ---
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

// Init
renderReferralTargets();


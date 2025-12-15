// --- BACK BUTTON LOGIC (FIXED) ---
function backToProfileMenu() {
    // 1. Hide Internal Pages
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    
    // 2. Hide Main Container
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // 3. RE-OPEN MENU (Magic happens here)
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- BRAND PAGE ---
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
        Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Select Platform & Budget', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending...',
        text: 'Forwarding to @Mr_MorningStar524',
        timer: 2000,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({ 
            icon: 'success', 
            title: 'Sent!', 
            text: 'Admin will contact you soon.', 
            background: '#0f172a', color: '#fff' 
        }).then(() => {
            // Success ke baad bhi wapas menu par
            backToProfileMenu();
        });
    });
}

// --- CONTACT SUPPORT ---
function submitContactForm() {
    const msg = document.getElementById('contact-message').value;
    if(!msg) {
        Swal.fire({ icon: 'warning', title: 'Empty Message', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending...',
        didOpen: () => Swal.showLoading(),
        timer: 1500,
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Message Sent',
            text: 'Admin @Mr_MorningStar524 received your message.',
            background: '#0f172a', color: '#fff'
        }).then(() => {
            backToProfileMenu();
        });
    });
}

// --- PROFILE EDIT ---
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

// --- REFER GAMIFICATION ---
const referTargets = [3, 5, 10, 15, 20, 25, 50, 100, 500, 1000, 10000];
const currentRefers = 7;

function renderReferralTargets() {
    const container = document.getElementById('referral-targets-list');
    if(!container) return;
    container.innerHTML = '';

    referTargets.forEach(target => {
        let statusClass = 'btn-locked';
        let btnText = '<i class="fa-solid fa-lock"></i> Locked';
        let progress = 0;

        if (currentRefers >= target) {
            statusClass = 'btn-claim'; 
            btnText = 'Claim 1000 🪙';
            progress = 100;
        } else {
            progress = (currentRefers / target) * 100;
            btnText = `${currentRefers}/${target}`;
        }

        const html = `
            <div class="target-item">
                <div class="target-info">
                    <h4>${target} Referrals</h4>
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

function claimReferReward(target) {
    if(currentRefers < target) return;
    Swal.fire({ title: 'Verifying...', timer: 1000, didOpen: () => Swal.showLoading(), background: '#0f172a', color: '#fff' })
    .then(() => {
        Swal.fire({ icon: 'success', title: 'Claimed!', text: `Reward for ${target} referrals added.`, background: '#0f172a', color: '#fff' });
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

// --- INFO PAGES (Terms, FAQ etc) ---
// Note: Isko main.js me bhi override kar sakte hain, par yahan safe hai
window.openInfoPage = function(type) {
    toggleProfileMenu(); // Close menu
    let title = "Info";
    let content = "Details coming soon.";

    if(type === 'withdraw_terms') { title = "Withdrawal Rules"; content = "Top 10 rankers get instant payout."; }
    else if(type === 'terms') { title = "Terms & Conditions"; content = "No cheating allowed."; }
    else if(type === 'privacy') { title = "Privacy Policy"; content = "Data is encrypted."; }
    else if(type === 'faq') { title = "Help / FAQ"; content = "Complete tasks to earn."; }
    else if(type === 'disclaimer') { title = "Disclaimer"; content = "Earnings depend on ads."; }

    Swal.fire({
        title: title,
        text: content,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
    }).then(() => {
        // Alert band hone par wapas menu khulega
        toggleProfileMenu();
    });
}

// Init
renderReferralTargets();


// --- BACK NAVIGATION FIX (Crucial) ---
function backToProfileMenu() {
    // 1. Hide Current Internal Page
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    
    // 2. Hide The Container
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // 3. RE-OPEN MENU (Taaki user Home par na gire)
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- PROFILE EDIT LOGIC ---
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
    // Update Display
    document.getElementById('display-name').innerHTML = `${newName} <i class="fa-solid fa-circle-check text-blue"></i>`;
    
    Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes have been saved.',
        background: '#0f172a', color: '#fff',
        timer: 2000, showConfirmButton: false
    });
    toggleEditMode(false);
}

// --- BRAND PAGE LOGIC ---
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
        Swal.fire({ icon: 'error', title: 'Incomplete', text: 'Select Platform & Budget', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending to Admin...',
        html: 'Forwarding request to @Mr_MorningStar524...',
        timer: 2500,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({ icon: 'success', title: 'Sent!', text: 'Admin will contact you soon.', background: '#0f172a', color: '#fff' });
        backToProfileMenu();
    });
}

// --- CONTACT SUPPORT LOGIC ---
function submitContactForm() {
    const subject = document.getElementById('contact-subject').value;
    const msg = document.getElementById('contact-message').value;

    if(!msg) {
        Swal.fire({ icon: 'warning', title: 'Empty Message', background: '#0f172a', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sending Message...',
        text: 'Connecting to Admin Support...',
        timer: 2000,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({ 
            icon: 'success', 
            title: 'Message Sent', 
            text: 'Admin @Mr_MorningStar524 has received your query.', 
            background: '#0f172a', color: '#fff' 
        });
        backToProfileMenu();
    });
}

// --- REFERRAL GAMIFICATION LOGIC ---
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
    Swal.fire({ title: 'Verifying...', timer: 1000, didOpen: () => Swal.showLoading(), background: '#0f172a', color: '#fff' })
    .then(() => {
        Swal.fire({ icon: 'success', title: 'Claimed!', text: `1000 Coins added for ${target} referrals.`, background: '#0f172a', color: '#fff' });
    });
}

// Init
renderReferralTargets();


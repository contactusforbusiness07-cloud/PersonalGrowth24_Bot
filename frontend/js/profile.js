// --- NAVIGATION LOGIC (Fix for Video Issue) ---
function backToProfileMenu() {
    // 1. Hide Current Internal Page
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    
    // 2. Hide Container
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // 3. RE-OPEN MENU (Taaki user home par na gire)
    toggleProfileMenu(); 
}

// --- BRAND PAGE LOGIC ---
function selectBudget(element, value) {
    // Remove active class from all
    document.querySelectorAll('.budget-chip').forEach(el => el.classList.remove('active'));
    // Add to clicked
    element.classList.add('active');
    // Set Value
    document.getElementById('selected-budget').value = value;
}

function sendBrandProposal() {
    const promoType = document.querySelector('input[name="promo_type"]:checked');
    const budget = document.getElementById('selected-budget').value;
    const msg = document.getElementById('brand-message').value;

    if(!promoType || !budget) {
        Swal.fire({ icon: 'error', title: 'Incomplete', text: 'Please select Platform and Budget.', background: '#0f172a', color: '#fff' });
        return;
    }

    // Simulate sending to Admin (@Mr_MorningStar524)
    Swal.fire({
        title: 'Sending Proposal...',
        html: 'Encrypting data & sending to Admin...',
        timer: 2000,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Proposal Sent!',
            text: 'Admin has received your anonymous request. You will be contacted soon.',
            background: '#0f172a', color: '#fff'
        });
        backToProfileMenu();
    });
}

// --- REFERRAL GAMIFICATION LOGIC ---
const referTargets = [3, 5, 10, 15, 20, 25, 50, 100, 500, 1000, 10000];
const currentRefers = 7; // Example Data

function renderReferralTargets() {
    const container = document.getElementById('referral-targets-list');
    if(!container) return;
    container.innerHTML = '';

    referTargets.forEach(target => {
        let statusClass = 'btn-locked';
        let btnText = '<i class="fa-solid fa-lock"></i> Locked';
        let progress = 0;

        if (currentRefers >= target) {
            // Target Met
            statusClass = 'btn-claim'; // Claimable
            btnText = 'Claim 1000 🪙';
            progress = 100;
            // Check if already claimed (Logic needed)
            // statusClass = 'btn-done'; btnText = 'Claimed';
        } else {
            // In Progress
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
    if(currentRefers < target) return; // Locked

    Swal.fire({
        title: 'Verifying...',
        text: 'Checking for fake referrals...',
        timer: 1500,
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Claimed!',
            text: `1000 Coins added to wallet for hitting ${target} referrals!`,
            background: '#0f172a', color: '#fff'
        });
        // Update UI logic here
    });
}

function switchReferTab(tabName) {
    // Hide all
    document.getElementById('tab-targets').classList.add('hidden');
    document.getElementById('tab-list').classList.add('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // Show specific
    if(tabName === 'targets') {
        document.getElementById('tab-targets').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('tab-list').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

// --- INIT ---
// Render targets when file loads
renderReferralTargets();


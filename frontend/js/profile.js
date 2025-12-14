// --- HANDLE INTERNAL PAGES (Brand, Refer, etc.) ---

// This function overwrites the one in main.js if needed, 
// or main.js calls this if loaded.
window.openInternalPage = function(pageName) {
    // 1. Close Menu & Overlays
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('menu-overlay').classList.add('hidden');

    // 2. Show Container
    const container = document.getElementById('profile-section-container');
    container.classList.remove('hidden');

    // 3. Hide all specific internal pages first
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));

    // 4. Show Target Page
    if(pageName === 'brand') {
        document.getElementById('brand-page').classList.remove('hidden');
    } else if(pageName === 'refer') {
        document.getElementById('refer-page').classList.remove('hidden');
    }
}

function closeInternalPage() {
    // Hide Container
    document.getElementById('profile-section-container').classList.add('hidden');
    // Hide Pages
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
}

// --- BRAND FORM SUBMISSION ---
function submitBrandRequest(btn) {
    // 1. Validate (Simple check)
    const budget = document.getElementById('budget-select').value;
    
    // 2. Loading State
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Proposal...';

    // 3. Simulate Network Request
    setTimeout(() => {
        // Success
        btn.innerHTML = originalText;
        btn.disabled = false;

        Swal.fire({
            icon: 'success',
            title: 'Proposal Sent! 🚀',
            text: 'Our Admin team will review your request and contact you within 24 hours.',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#fbbf24',
            confirmButtonText: 'Great!'
        }).then(() => {
            closeInternalPage();
        });

    }, 2000);
}
// --- DYNAMIC INFO PAGES (Terms, Privacy, etc.) ---
function openInfoPage(type) {
    // 1. Close Menu
    toggleProfileMenu();
    
    // 2. Prepare Content
    let title = "Info";
    let content = "Loading...";

    if(type === 'withdraw_terms') {
        title = "Withdrawal Rules";
        content = `
            <ul style="list-style:disc; padding-left:20px; color:#cbd5e1; font-size:13px; line-height:1.6;">
                <li>Top 10 Rankers can withdraw instantly via UPI/Paytm.</li>
                <li>Rank 11+ users' earnings are saved and paid at Month End.</li>
                <li>Minimum withdrawal amount: ₹50.</li>
                <li>Fake referral activity leads to permanent ban.</li>
            </ul>
        `;
    } else if(type === 'terms') {
        title = "Terms & Conditions";
        content = "<p style='color:#cbd5e1'>By using FinGamePro, you agree to our fair usage policy. Bots and scripts are strictly prohibited.</p>";
    } else if(type === 'privacy') {
        title = "Privacy Policy";
        content = "<p style='color:#cbd5e1'>We do not share your personal data. Your Telegram ID is used only for identification.</p>";
    } else if(type === 'faq') {
        title = "Help / FAQ";
        content = `
            <div style="margin-bottom:10px"><b>Q: How to earn more?</b><br><span style="color:#94a3b8">A: Refer friends and complete daily tasks.</span></div>
            <div><b>Q: When do rankings reset?</b><br><span style="color:#94a3b8">A: Every night at 12:00 AM.</span></div>
        `;
    } else if(type === 'contact') {
        title = "Contact Us";
        content = "<p style='color:#cbd5e1'>Email: support@fingamepro.com<br>Telegram Support: @FinGameSupport</p>";
    }

    // 3. Show using SweetAlert2 (Best for text info)
    Swal.fire({
        title: title,
        html: content,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Close'
    });
}

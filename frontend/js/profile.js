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

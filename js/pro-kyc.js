// --- POINT 3: KYC VERIFICATION ---

function openKycPopup() {
    // Menu Close
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    Swal.fire({
        title: 'KYC Verification',
        text: 'KYC Module is currently under maintenance. Coming Soon!',
        icon: 'info',
        background: '#0f172a', color: '#fff',
        confirmButtonText: 'Back to Menu'
    }).then(() => {
        // Re-open Menu
        if(menu) menu.classList.add('open');
        if(overlay) overlay.classList.remove('hidden');
    });
}

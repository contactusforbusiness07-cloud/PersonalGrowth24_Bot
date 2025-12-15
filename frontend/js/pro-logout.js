// --- POINT 12: LOGOUT ---

function handleLogout() {
    // Menu Close
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    Swal.fire({
        title: 'Logout?',
        text: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Exit',
        confirmButtonColor: '#ef4444',
        background: '#0f172a', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            window.close();
        } else {
            // Cancel kiya to wapas menu
            if(menu) menu.classList.add('open');
            if(overlay) overlay.classList.remove('hidden');
        }
    });
}

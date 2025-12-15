// --- CORE: BACK BUTTON & NAVIGATION ---

// 1. Back Button Logic (Menu wapas layega)
function backToProfileMenu() {
    // Current Pages Chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // Menu Wapas Kholo (Magic Fix)
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// 2. Open Page Logic
function openInternalPage(pageName) {
    // Menu Force Close
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    // Container Show
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Hide All Pages
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Show Target Page
    const target = document.getElementById('page-' + pageName);
    if(target) {
        target.classList.remove('hidden');
    } else {
        console.error("Page Not Found: page-" + pageName);
    }
}

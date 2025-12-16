/* --- CORE LOGIC: FINAL MENU FIX --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Ready. Checking Menu...");
    // Force Home Screen Visible
    const home = document.getElementById('home') || document.getElementById('page-home');
    if(home) home.classList.remove('hidden');
});

/* 1. MENU TOGGLE FUNCTION */
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Debugging Alert (Agar menu na khule to ye batayega kyu)
    if (!menu || !overlay) {
        console.error("Menu HTML Missing!"); 
        // alert("Menu Error: HTML code missing at bottom of index.html"); 
        return;
    }

    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('active');
        overlay.classList.remove('hidden');
    }
}

/* 2. NAVIGATION */
function navigateTo(targetId) {
    // Menu Band Karo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        overlay.classList.add('hidden');
    }

    // Hide All
    document.querySelectorAll('.internal-page, .page-section, section').forEach(el => {
        if(!el.classList.contains('app-header') && !el.classList.contains('side-menu')) {
            el.classList.add('hidden');
        }
    });

    // Show Target
    let target = document.getElementById(targetId) || document.getElementById('page-' + targetId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0,0);
    } else {
        // Fallback to Home
        const home = document.getElementById('home');
        if(home) home.classList.remove('hidden');
    }
}

/* 3. HELPERS */
function openInternalPage(id) { navigateTo(id); }
function backToProfileMenu() { navigateTo('home'); }
function openInfoPage(type) { 
    toggleProfileMenu(); 
    setTimeout(() => alert(type + " Info"), 100); 
}
function handleLogout() {
    if(confirm("Logout?")) location.reload();
}


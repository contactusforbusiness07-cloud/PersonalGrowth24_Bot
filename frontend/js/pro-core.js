/* --- FIN GAME PRO: CORE LOGIC (RESCUE VERSION) --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System Loaded. Attempting to render Home...");
    
    // 1. Force Menu Button Cursor
    const trigger = document.querySelector('.menu-trigger');
    if(trigger) trigger.style.cursor = 'pointer';

    // 2. FORCE SHOW HOME (Fixes Blank Screen)
    // Ye check karega ki ID 'home' hai ya 'page-home' aur use dikhayega
    const homeSection = document.getElementById('home') || document.getElementById('page-home');
    if (homeSection) {
        homeSection.classList.remove('hidden');
        console.log("Home Section Restored.");
    } else {
        console.error("CRITICAL: Home ID not found! Check index.html");
    }
});

/* 1. HAMBURGER MENU TOGGLE */
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu && overlay) {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');   // Close
            overlay.classList.add('hidden');   // Hide Overlay
        } else {
            menu.classList.add('active');      // Open
            overlay.classList.remove('hidden'); // Show Overlay
        }
    } else {
        console.error("Menu elements missing in HTML");
    }
}

/* 2. NAVIGATION SYSTEM */
function navigateTo(targetId) {
    // A. Menu Close
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu && menu.classList.contains('active')) {
        toggleProfileMenu();
    }

    // B. Hide ALL Sections (Internal & Main)
    const allSections = document.querySelectorAll('.internal-page, .page-section, section');
    allSections.forEach(el => {
        // Ensure we don't hide the header or menu itself
        if (!el.classList.contains('app-header') && !el.classList.contains('side-menu')) {
            el.classList.add('hidden');
        }
    });

    // C. Show Target
    // Support for both 'wallet' and 'page-wallet' naming styles
    let target = document.getElementById(targetId);
    if (!target) target = document.getElementById('page-' + targetId);

    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0,0);
    } else {
        console.warn("Target ID not found:", targetId);
        // Fallback to Home if error
        const home = document.getElementById('home');
        if(home) home.classList.remove('hidden');
    }
}

/* 3. SUB-FUNCTIONS */
function openInternalPage(pageId) { navigateTo(pageId); }
function backToProfileMenu() { navigateTo('home'); }
function openInfoPage(type) { 
    toggleProfileMenu();
    setTimeout(() => alert(type + " - Content Loading..."), 200); 
}
function handleLogout() {
    if(confirm("Confirm Logout?")) location.reload();
}


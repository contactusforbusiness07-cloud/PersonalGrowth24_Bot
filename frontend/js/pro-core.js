/* --- FIN GAME PRO: CORE LOGIC (Final Version) --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Core Logic Loaded.");
    // Ensure header elements are interactive
    const trigger = document.querySelector('.menu-trigger');
    if (trigger) trigger.style.cursor = 'pointer';
});

/* 1. MENU TOGGLE (Strict Logic) */
function toggleProfileMenu() {
    console.log("Menu Toggle Triggered"); // Debugging

    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Safety Check
    if (!menu || !overlay) {
        console.error("Menu ID 'side-menu' or 'menu-overlay' not found in HTML");
        return;
    }

    // Toggle Action
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');   // Close
        overlay.classList.add('hidden');   // Hide Overlay
    } else {
        menu.classList.add('active');      // Open
        overlay.classList.remove('hidden');// Show Overlay
    }
}

/* 2. NAVIGATION SYSTEM (Page Switcher) */
function navigateTo(targetId) {
    // A. Agar Menu khula hai to band karo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu && menu.classList.contains('active')) {
        toggleProfileMenu(); 
    }

    // B. Saare Pages Hide karo (Internal & Main)
    const allPages = document.querySelectorAll('.internal-page, .page-section, .view-section');
    allPages.forEach(page => {
        page.classList.add('hidden');
    });

    // C. Specific ID Dhoondo
    // Try 1: Direct ID (e.g., 'wallet')
    let target = document.getElementById(targetId);
    
    // Try 2: Prefix ID (e.g., 'page-wallet')
    if (!target) {
        target = document.getElementById('page-' + targetId);
    }

    // D. Target Show karo
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0); // Scroll to top
    } else {
        console.warn("Page ID not found:", targetId);
        // Fallback: Agar page nahi mila to Home dikha do
        if(targetId !== 'home') navigateTo('home');
    }
}

/* 3. OPEN INTERNAL PAGES (Profile, Refer, etc.) */
function openInternalPage(pageName) {
    // Ye navigateTo function ko hi use karega
    navigateTo(pageName);
}

/* 4. BACK BUTTON LOGIC */
function backToProfileMenu() {
    navigateTo('home');
}

/* 5. INFO PAGES & LOGOUT */
function openInfoPage(type) {
    toggleProfileMenu(); // Close menu
    // Thoda delay taaki menu band ho jaye fir alert aaye
    setTimeout(() => {
        alert("Info Page: " + type); 
    }, 200);
}

function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        window.location.reload();
    }
}


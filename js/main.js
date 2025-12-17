// --- GLOBAL NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    console.log("Going to:", sectionId);

    // 1. Hide All Main Sections (Home, Tasks, etc.)
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide Profile Pages & Container
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 3. Force Close Menu
    toggleProfileMenu(false);

    // 4. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 5. Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) item.classList.add('active');
    });
}

// --- MENU TOGGLE CONTROL ---
function toggleProfileMenu(forceState) {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (!menu || !overlay) return;

    // Force Close
    if (forceState === false) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
        return;
    }
    // Force Open
    if (forceState === true) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
        return;
    }
    // Toggle
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- APP INIT ---
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});


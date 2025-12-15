// --- 1. GLOBAL NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    console.log("Navigating to:", sectionId);

    // 1. Hide all Main App Sections (Home, Tasks, etc.)
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide all Internal Profile Pages (Brand, Refer, etc.)
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 3. Hide The Profile Container itself
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 4. Force Close The Side Menu
    toggleProfileMenu(false); 

    // 5. Show The Requested Main Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 6. Update Bottom Navigation Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- 2. MENU TOGGLE CONTROL ---
function toggleProfileMenu(forceState) {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (!menu || !overlay) return;

    // Agar hum specific state chahte hain (e.g. Force Close)
    if (forceState === false) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
        return;
    }
    if (forceState === true) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
        return;
    }

    // Normal Toggle
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- 3. APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("FinGamePro Loaded 🚀");
    // Default Page
    navigateTo('home');
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});


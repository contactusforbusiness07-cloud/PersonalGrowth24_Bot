// --- 1. NAVIGATION SYSTEM (Global) ---
function navigateTo(sectionId) {
    console.log("Navigating to:", sectionId);

    // 1. Hide all main sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide all Internal Pages (Profile, Brand etc.)
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 3. Hide Profile Container
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 4. Close Menu (Agar khula hai)
    toggleProfileMenu(false); 

    // 5. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 6. Update Bottom Nav Active State
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- 2. MENU TOGGLE FUNCTION ---
function toggleProfileMenu(forceState) {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (!menu || !overlay) return;

    // Agar forceState 'false' diya hai to band karo
    if (forceState === false) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
        return;
    }

    // Toggle (Agar khula hai to band, band hai to kholo)
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- 3. APP STARTUP ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Loaded Successfully 🚀");

    // Telegram UI Setup
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try { tg.setHeaderColor('#020617'); } catch(e) {}
    }

    // Default Home Page
    navigateTo('home');
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand(); // Full screen
    tg.ready();

    // 2. Set Default Page
    navigateTo('home');

    // 3. Update Balance (Dummy for now)
    document.getElementById('header-coin-balance').innerText = "0";
});

// --- NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    
    // Hide Side Menu if open
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('menu-overlay').classList.add('hidden');

    // Show Target Section
    const target = document.getElementById(sectionId);
    if(target) {
        target.classList.remove('hidden');
        // Animation reset logic can go here
    }

    // Update Bottom Nav Active State
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- MENU TOGGLE FUNCTION ---
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Safety Check
    if (!menu || !overlay) {
        console.error("Menu elements not found");
        return;
    }

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    // 1. Hide all main sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide all internal profile pages
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 3. Hide Profile Container if open
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 4. Close Menu if open
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    }

    // 5. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 6. Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onClickAttr = item.getAttribute('onclick');
        if(onClickAttr && onClickAttr.includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized 🚀");

    // Telegram Setup
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try {
            tg.setHeaderColor('#020617'); 
        } catch(e) { console.log("Header color not supported"); }
    }

    // Load Default Page
    navigateTo('home');
});

// --- OPEN INTERNAL PAGE (Called from Menu) ---
function openInternalPage(pageName) {
    // Close Menu First
    toggleProfileMenu();

    // Show Container
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Hide all internal pages first
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Show specific page using ID
    // Brand Page Logic
    if (pageName === 'brand') {
        const brandPage = document.getElementById('page-brand');
        if(brandPage) brandPage.classList.remove('hidden');
        // Fix: Ye line pichli baar adhoori thi
        Swal.fire({
            title: 'Loading...',
            text: 'Opening Sponsorship Page',
            icon: 'info',
            timer: 800,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff'
        });
        return;
    }

    // Other Pages
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.warn("Page not found:", pageName);
    }
}


// --- NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    // 1. Hide all main sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide all internal profile pages
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 3. Hide Profile Container if open
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 4. Close Menu if open
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    }

    // 5. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 6. Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        // Check onclick attribute safely
        const onClickAttr = item.getAttribute('onclick');
        if(onClickAttr && onClickAttr.includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized 🚀");

    // Telegram Setup
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try {
            tg.setHeaderColor('#020617'); 
        } catch(e) { console.log("Header color not supported"); }
    }

    // Load Default Page
    navigateTo('home');
});

// --- OPEN INTERNAL PAGE (Called from Menu) ---
function openInternalPage(pageName) {
    // Close Menu First
    toggleProfileMenu();

    // Show Container
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Hide all internal pages first
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Show specific page using ID
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.warn("Page not found:", pageName);
    }
}


// --- NAVIGATION SYSTEM ---
function navigateTo(sectionId) {
    // 1. Hide all main sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide all internal profile pages
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 3. Hide Profile Container if open
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 4. Close Menu if open
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    // 5. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 6. Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");

    // Telegram Setup
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#020617'); // Matches theme
    }

    // Load Default Page
    navigateTo('home');
});

// --- OPEN INTERNAL PAGE (Called from Menu) ---
function openInternalPage(pageName) {
    // Close Menu First
    toggleProfileMenu();

    // Show Container
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Hide all internal pages first
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Show specific page
    const page = document.getElementById('page-' + pageName); // e.g., page-brand
    if(page) {
        page.classList.remove('hidden');
    } else {
        // Fallback for pages not using 'page-' prefix logic in HTML
        if(pageName === 'brand') document.getElementById('page-brand').classList.remove('hidden');
        if(pageName === 'refer') document.getElementById('page-refer').classList.remove('hidden');
        if(pageName === 'profile') document.getElementById('page-profile').classList.remove('hidden');
        if(pageName === 'contact') document.getElementById('page-contact').classList.remove('hidden');
    }
}


// --- INTERNAL PAGES (Brand/Profile) ---
function openInternalPage(pageName) {
    // Baad me hum specific Modals open karenge
    toggleProfileMenu(); // Close menu first
    if(pageName === 'brand') {
        // Logic to show Brand Page
        Swal.fire({ title: 'Loading...', text: 'Opening Sponsorship Page', timer: 1000, showConfirmButton: false });
        // Future: document.getElementById('brand-modal').classList.remove('hidden');
    } else {
        navigateTo('profile'); // Placeholder logic
    }
}

/* --- FIN GAME PRO: CORE LOGIC (FIXED) --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Loaded: Core Logic Ready");
});

/* 1. SIDE MENU TOGGLE LOGIC (3-Dot Fix) */
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu && overlay) {
        // Toggle Logic
        if (menu.classList.contains('active')) {
            menu.classList.remove('active'); // Close Menu
            overlay.classList.add('hidden'); // Hide Overlay
        } else {
            menu.classList.add('active');    // Open Menu
            overlay.classList.remove('hidden'); // Show Overlay
        }
    } else {
        console.error("Menu UI elements not found! Check IDs 'side-menu' and 'menu-overlay'");
    }
}

/* 2. MAIN NAVIGATION (Bottom Nav & Sections) */
function navigateTo(targetId) {
    console.log("Navigating to:", targetId);

    // Step A: Close Menu if open
    const menu = document.getElementById('side-menu');
    if (menu && menu.classList.contains('active')) {
        toggleProfileMenu();
    }

    // Step B: Hide ALL Pages & Sections
    // 1. Hide Internal Pages (Profile, Refer, etc.)
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });

    // 2. Hide Main Sections (Home, Wallet, Tasks etc.)
    // Hum 'page-section' class aur direct IDs dono ko target karenge
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Explicitly hide common IDs to be safe
    ['home', 'tasks', 'games', 'wallet', 'leaderboard'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });

    // Step C: Show the Target Page
    // Pehle direct ID check karo (e.g., 'wallet')
    let target = document.getElementById(targetId);
    
    // Agar direct ID nahi mila, to 'page-' prefix ke saath try karo (e.g., 'page-wallet')
    if (!target) {
        target = document.getElementById('page-' + targetId);
    }

    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0); // Reset scroll
        updateBottomNav(targetId); // Highlight icon
    } else {
        console.warn("Page not found:", targetId);
        // Fallback: Agar page exist nahi karta tabhi alert dikhao
        alert(targetId.toUpperCase() + " Page is under construction.");
    }
}

/* 3. OPEN INTERNAL PAGES (For Profile, Refer, Brand etc.) */
function openInternalPage(pageId) {
    // Re-use the smart navigation logic
    // Agar ID 'page-profile' hai, to ye direct open karega
    navigateTo(pageId.replace('page-', '')); 
    // Note: Agar aapke IDs 'page-profile' hain, to upar wala logic 'page-' prefix khud handle kar lega
}

/* 4. BACK BUTTON (Returns to Home) */
function backToProfileMenu() {
    navigateTo('home');
}

/* 5. HELPER: Update Bottom Nav Active State */
function updateBottomNav(activeId) {
    // Remove active class from all
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        
        // Check if onclick contains the activeId
        const onclickVal = item.getAttribute('onclick');
        if (onclickVal && onclickVal.includes(`'${activeId}'`)) {
            item.classList.add('active');
        }
    });
}

/* 6. INFO PAGES (Terms, Privacy) */
function openInfoPage(type) {
    alert("Info Page: " + type + " (Content Loading...)");
    toggleProfileMenu();
}

/* 7. LOGOUT */
function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        window.location.reload(); // Refresh app to simulate logout
    }
}


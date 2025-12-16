/* --- FIN GAME PRO: CORE LOGIC (Navigation & Menu) --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Pro-Core Module Loaded");
});

/* 1. SIDE MENU TOGGLE LOGIC */
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu && overlay) {
        menu.classList.toggle('active');
        // Overlay logic: agar hidden hai to hatao, nahi to lagao
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    } else {
        console.error("Menu UI elements (side-menu or menu-overlay) not found!");
    }
}

/* 2. OPEN INTERNAL PAGES (Profile, Refer, etc.) */
function openInternalPage(pageId) {
    // A. Menu band karo agar khula hai
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu && menu.classList.contains('active')) {
        toggleProfileMenu();
    }

    // B. Saare Pages Chupao
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });

    // C. Home Page / Main Content Chupao
    // (Aapke structure ke hisaab se main content ka wrapper)
    const mainContent = document.getElementById('page-home') || document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('hidden');
    }

    // D. Target Page Dikhao
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0); // Top par scroll karo
    } else {
        console.error(`Page ID '${pageId}' not found in HTML.`);
    }
}

/* 3. BACK BUTTON LOGIC (Return to Home) */
function backToProfileMenu() {
    // A. Saare Internal Pages Chupao
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });

    // B. Home Page Wapas Dikhao
    const mainContent = document.getElementById('page-home') || document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.remove('hidden');
    }
}

/* 4. INFO PAGES (Terms, Privacy etc.) */
function openInfoPage(type) {
    // Filhal alert, baad me iska alag page bana sakte hain
    alert("Opening Info Page: " + type);
    toggleProfileMenu(); // Menu band karo
}

/* 5. BOTTOM NAVIGATION (Home, Wallet, Tasks) */
function navigateTo(section) {
    console.log("Navigating to:", section);
    
    // Logic: Internal pages hide karo aur home dikhao
    if (section === 'home') {
        backToProfileMenu();
    } else if (section === 'wallet') {
        // Agar wallet page alag hai to usse open karo, nahi to alert
        alert("Wallet Section Loading...");
    } else {
        alert(section + " Coming Soon!");
    }
}

/* 6. LOGOUT LOGIC */
function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        alert("Logged Out Successfully");
        toggleProfileMenu();
    }
}


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

// --- MENU TOGGLE ---
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if(menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
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

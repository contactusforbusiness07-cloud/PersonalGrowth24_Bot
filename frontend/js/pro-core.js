/* --- CORE LOGIC: MENU FIX --- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Fix Loaded: Menu Button Ready");
});

/* FORCE TOGGLE FUNCTION */
function toggleProfileMenu() {
    console.log("Menu Button Clicked!"); // Debugging Log

    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');

    if (menu && overlay) {
        // Toggle Logic
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            overlay.classList.add('hidden');
        } else {
            menu.classList.add('active');
            overlay.classList.remove('hidden');
        }
    } else {
        alert("Error: Menu ID not found inside HTML. Please check IDs.");
    }
}

/* --- NAVIGATION LOGIC (Keep this) --- */
function navigateTo(targetId) {
    // Menu close karo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu && menu.classList.contains('active')) {
        toggleProfileMenu();
    }

    // Hide all pages
    document.querySelectorAll('.internal-page, .page-section').forEach(el => {
        el.classList.add('hidden');
    });

    // Show Target
    let target = document.getElementById(targetId) || document.getElementById('page-' + targetId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// Internal Pages Redirect
function openInternalPage(pageId) {
    navigateTo(pageId);
}
function backToProfileMenu() {
    navigateTo('home');
}
function openInfoPage(type) {
    toggleProfileMenu();
    setTimeout(() => alert(type), 200);
}
function handleLogout() {
    if(confirm("Logout?")) location.reload();
}


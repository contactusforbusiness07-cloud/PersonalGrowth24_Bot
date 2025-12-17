/* --- FINAL DIAGNOSTIC MENU LOGIC --- */

// 1. Ensure Menu Button works
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Ready. Linking Menu...");
    const trigger = document.querySelector('.menu-trigger');
    if(trigger) trigger.style.cursor = "pointer";
});

// 2. The Toggle Function
function toggleProfileMenu() {
    // Elements dhoondo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');

    // DEBUG CHECK: Agar HTML sahi jagah nahi hai to Alert aayega
    if (!menu || !overlay) {
        alert("ERROR FIX: Step 1 (HTML) sahi se paste nahi hua hai. 'side-menu' id nahi mil rahi.");
        return;
    }

    // Toggle Class
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('active');
        overlay.classList.remove('hidden');
    }
}

// 3. Navigation Helpers (Baaki app chalane ke liye)
function navigateTo(id) {
    // Menu band karo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('active');
    if(overlay) overlay.classList.add('hidden');

    // Page Change Logic
    document.querySelectorAll('.internal-page, .page-section').forEach(el => el.classList.add('hidden'));
    
    // Support 'wallet' and 'page-wallet' IDs
    let target = document.getElementById(id) || document.getElementById('page-'+id);
    if(target) target.classList.remove('hidden');
    else {
        const home = document.getElementById('home') || document.getElementById('page-home');
        if(home) home.classList.remove('hidden');
    }
}

function openInternalPage(id) { navigateTo(id); }
function openInfoPage(t) { toggleProfileMenu(); setTimeout(() => alert(t), 100); }
function handleLogout() { if(confirm("Logout?")) location.reload(); }


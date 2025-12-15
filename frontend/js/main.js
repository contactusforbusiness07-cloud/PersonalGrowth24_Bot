// --- MENU TOGGLE FUNCTION ---
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Safety Check
    if (!menu || !overlay) return;

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
    // 1. Hide All Sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // 2. Hide Profile Pages
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
    
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // 3. Close Menu
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    // 4. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 5. Update Bottom Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) item.classList.add('active');
    });
}

// --- OPEN INTERNAL PAGE (Brand, Refer, Profile, Contact) ---
function openInternalPage(pageName) {
    toggleProfileMenu(); // Close menu first

    // Show Container
    const container = document.getElementById('profile-section-container');
    if(container) container.classList.remove('hidden');

    // Hide all first
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Special Case: Brand Page Loading Effect
    if (pageName === 'brand') {
        const brandPage = document.getElementById('page-brand');
        if(brandPage) brandPage.classList.remove('hidden');
        
        // Yahan galti thi, ab fix hai
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

    // Standard Page Open
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// --- LOGOUT FUNCTION ---
function handleLogout() {
    toggleProfileMenu();
    Swal.fire({
        title: 'Logout?',
        text: "You will exit the app.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Exit',
        background: '#0f172a', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            if(window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.close();
            } else {
                window.close();
            }
        }
    });
}

// --- INFO PAGES (Terms, FAQ etc.) ---
function openInfoPage(type) {
    toggleProfileMenu();
    let title = "Info";
    let content = "Details coming soon.";

    if(type === 'withdraw_terms') {
        title = "Withdrawal Rules";
        content = "Top 10 Rankers get instant payout via UPI. Others monthly.";
    } else if(type === 'terms') {
        title = "Terms & Conditions";
        content = "Fair usage policy applies.";
    } else if(type === 'privacy') {
        title = "Privacy Policy";
        content = "Your data is safe and encrypted.";
    } else if(type === 'faq') {
        title = "Help / FAQ";
        content = "Complete tasks and refer friends to earn.";
    } else if(type === 'disclaimer') {
        title = "Disclaimer";
        content = "Rewards depend on ad revenue.";
    } else if(type === 'contact') {
         // Agar galti se contact yahan call hua
         openInternalPage('contact');
         return;
    }

    Swal.fire({
        title: title,
        text: content,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized 🚀");
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    navigateTo('home');
});


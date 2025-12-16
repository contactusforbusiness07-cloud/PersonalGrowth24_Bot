// --- CORE: NAVIGATION & MENU LOGIC ---

// 1. OPEN INTERNAL PAGE (Fix for Home Redirect Issue)
function openInternalPage(pageName) {
    console.log("Opening Internal Page:", pageName);

    // Step A: Menu & Overlay ko turant band karo
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    // Step B: MAIN APP SECTIONS (Home, Wallet, Tasks) KO CHUPAO
    // (Ye zaroori hai taaki home screen peeche se na dikhe)
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // Step C: Profile Container ko Visible karo
    const container = document.getElementById('profile-section-container');
    if(container) {
        container.classList.remove('hidden');
    } else {
        console.error("Error: 'profile-section-container' nahi mila!");
        return;
    }

    // Step D: Pehle saare internal pages (Brand, Refer, Profile) ko chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));

    // Step E: Sirf Target Page ko Dikhao
    const targetPage = document.getElementById('page-' + pageName);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error("Error: Target page nahi mila -> page-" + pageName);
    }
}

// 2. BACK BUTTON LOGIC (Wapas Menu par layega)
function backToProfileMenu() {
    // Current Internal Page Chupao
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    
    // Pura Container Chupao
    document.getElementById('profile-section-container').classList.add('hidden');
    
    // MENU WAPAS KHOLO
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu && overlay) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// 3. EDIT PROFILE LOGIC (Helper for Profile)
function toggleEditMode(show) {
    const viewMode = document.getElementById('page-profile');
    const editMode = document.getElementById('page-profile-edit');
    
    if(show) {
        if(viewMode) viewMode.classList.add('hidden');
        if(editMode) editMode.classList.remove('hidden');
    } else {
        if(editMode) editMode.classList.add('hidden');
        if(viewMode) viewMode.classList.remove('hidden');
    }
}

function saveProfileChanges() {
    const val = document.getElementById('edit-name-input').value;
    const display = document.getElementById('display-name');
    if(display) display.innerHTML = `${val} <i class="fa-solid fa-circle-check text-blue"></i>`;
    
    // SweetAlert agar load hai to use karo, warna alert
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success', title: 'Saved', text: 'Profile Updated!',
            toast: true, position: 'top', timer: 2000, showConfirmButton: false,
            background: '#0f172a', color: '#fff'
        });
    } else {
        alert("Profile Saved!");
    }
    toggleEditMode(false);
}

/* --- MENU TOGGLE LOGIC --- */
function toggleProfileMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu && overlay) {
        menu.classList.toggle('active');
        overlay.classList.toggle('hidden');
    } else {
        console.error("Menu elements not found in HTML!");
    }
}

// Function to open internal pages (Profile, Refer, etc.)
function openInternalPage(pageId) {
    // 1. Hide all pages
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 2. Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // 3. Hide Main Content (Home) if needed
    // (Adjust this ID based on your home container, e.g., 'main-content' or 'page-home')
    const home = document.getElementById('page-home'); 
    if(home) home.classList.add('hidden');
}

// Function to go BACK to Home/Menu
function backToProfileMenu() {
    // Hide all internal pages
    document.querySelectorAll('.internal-page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show Home Logic
    const home = document.getElementById('page-home');
    if(home) home.classList.remove('hidden');
}

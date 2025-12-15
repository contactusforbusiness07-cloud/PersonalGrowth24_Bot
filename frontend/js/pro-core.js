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


// --- NAVIGATION LOGIC ---
function openInternalPage(pageName) {
    // 1. Close Menu
    toggleProfileMenu(); 

    // 2. Show Container
    const container = document.getElementById('profile-section-container');
    container.classList.remove('hidden');

    // 3. Hide all specific pages first
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));

    // 4. Show Target Page
    if(pageName === 'profile') {
        document.getElementById('page-profile').classList.remove('hidden');
    } else if(pageName === 'brand') {
        document.getElementById('page-brand').classList.remove('hidden');
    } else if(pageName === 'refer') {
        document.getElementById('page-refer').classList.remove('hidden');
    } else if(pageName === 'contact') {
        document.getElementById('page-contact').classList.remove('hidden');
    }
}

function closeInternalPage() {
    document.getElementById('profile-section-container').classList.add('hidden');
    document.querySelectorAll('.internal-page').forEach(page => page.classList.add('hidden'));
}

// --- PROFILE EDIT LOGIC ---
function toggleEditMode(show) {
    if(show) {
        document.getElementById('page-profile').classList.add('hidden');
        document.getElementById('page-profile-edit').classList.remove('hidden');
    } else {
        document.getElementById('page-profile-edit').classList.add('hidden');
        document.getElementById('page-profile').classList.remove('hidden');
    }
}

function saveProfileChanges() {
    const newName = document.getElementById('edit-name-input').value;
    
    // Simulate API Call
    setTimeout(() => {
        document.getElementById('display-name').innerHTML = `${newName} <i class="fa-solid fa-circle-check text-blue"></i>`;
        
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            toast: true, position: 'top', showConfirmButton: false, timer: 2000,
            background: '#1e293b', color: '#fff'
        });
        
        toggleEditMode(false);
    }, 1000);
}

// --- LOGOUT LOGIC ---
function handleLogout() {
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
            // Close Telegram Web App
            if(window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.close();
            } else {
                window.close(); // Fallback for browser
            }
        }
    });
}

// --- CONTACT FORM LOGIC ---
function submitContactForm() {
    // 1. Get Data
    const subject = document.getElementById('contact-subject').value;
    const adminID = "Mr_MorningStar524"; 
    
    // 2. Simulate Sending
    Swal.fire({
        title: 'Sending to Admin...',
        didOpen: () => Swal.showLoading(),
        background: '#0f172a', color: '#fff'
    });

    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: `Admin (${adminID}) has received your anonymous message.`,
            background: '#0f172a', color: '#fff'
        }).then(() => {
            closeInternalPage();
        });
    }, 1500);
}

// --- BRAND FORM ---
function submitBrandRequest(btn) {
    btn.innerHTML = 'Sending...';
    setTimeout(() => {
        btn.innerHTML = '📩 Send Proposal';
        Swal.fire({ icon: 'success', title: 'Proposal Sent', background: '#0f172a', color: '#fff' });
        closeInternalPage();
    }, 1500);
}

// --- EXPORT TO GLOBAL SCOPE ---
// (Make sure logout is reachable)
window.handleLogout = handleLogout;


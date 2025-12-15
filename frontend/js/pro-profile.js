// --- POINT 1: MY PROFILE ---

function toggleEditMode(show) {
    document.getElementById('page-profile').classList.toggle('hidden', show);
    document.getElementById('page-profile-edit').classList.toggle('hidden', !show);
}

function saveProfileChanges() {
    const val = document.getElementById('edit-name-input').value;
    // Update Display Name
    document.getElementById('display-name').innerHTML = `${val} <i class="fa-solid fa-circle-check text-blue"></i>`;
    
    Swal.fire({
        icon: 'success', title: 'Saved', text: 'Profile Updated!',
        toast: true, position: 'top', timer: 2000, showConfirmButton: false,
        background: '#0f172a', color: '#fff'
    });
    toggleEditMode(false);
}

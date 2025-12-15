// --- MY PROFILE LOGIC (Real Gallery & Data Save) ---

// 1. Load Data on Startup (Refresh hone par data wapas layega)
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});

function loadProfileData() {
    // Check Local Storage for Name
    const savedName = localStorage.getItem('userName');
    if(savedName) {
        document.getElementById('display-name').innerHTML = `${savedName} <i class="fa-solid fa-circle-check text-blue"></i>`;
        const inputField = document.getElementById('edit-name-input');
        if(inputField) inputField.value = savedName;
    }

    // Check Local Storage for Image
    const savedImage = localStorage.getItem('userAvatar');
    if(savedImage) {
        const imgTag = document.getElementById('user-avatar-img');
        if(imgTag) imgTag.src = savedImage;
    }
}

// 2. Trigger Hidden Gallery Input
function triggerFileUpload() {
    const fileInput = document.getElementById('file-upload');
    if(fileInput) fileInput.click();
}

// 3. Handle File Selection (Real Gallery Logic)
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Show Loading
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Updating...',
                timer: 500, didOpen: () => Swal.showLoading(),
                background: '#0f172a', color: '#fff', showConfirmButton: false
            });
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target.result; // Base64 String (Real Image Data)
            
            // Update UI
            document.getElementById('user-avatar-img').src = imageData;
            
            // Save to Storage (Persistent)
            localStorage.setItem('userAvatar', imageData);
        };
        
        reader.readAsDataURL(file);
    }
}

// 4. Save Name Changes
function saveProfileChanges() {
    const newName = document.getElementById('edit-name-input').value;
    
    if(!newName.trim()) {
        if(typeof Swal !== 'undefined') {
            Swal.fire({toast: true, icon: 'warning', title: 'Name cannot be empty', background: '#0f172a', color: '#fff'});
        } else {
            alert("Name cannot be empty");
        }
        return;
    }

    // Update UI
    document.getElementById('display-name').innerHTML = `${newName} <i class="fa-solid fa-circle-check text-blue"></i>`;
    
    // Save to Storage
    localStorage.setItem('userName', newName);
    
    // Success Animation
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success', title: 'Profile Updated', 
            text: 'Changes saved successfully.',
            background: '#0f172a', color: '#fff',
            timer: 1500, showConfirmButton: false
        });
    } else {
        alert("Profile Updated Successfully!");
    }
}


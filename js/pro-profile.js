/* Module: Profile Logic (Firebase Sync + Compression) */

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// 1. Initialize Profile
function initProfile() {
    // Priority: Firebase State > LocalStorage > Telegram Default > Generic Default
    const storedName = localStorage.getItem('user_name');
    const storedImg = localStorage.getItem('user_avatar');
    
    let tgUser = null;
    if (window.Telegram && window.Telegram.WebApp) {
        tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }

    const finalName = storedName || (tgUser ? `${tgUser.first_name}` : "Guest Player");
    const finalID = (tgUser ? tgUser.id : "8739204"); 
    const finalImage = storedImg || defaultAvatar;

    // Update UI
    document.getElementById('display-name').innerText = finalName;
    document.getElementById('display-id').innerText = finalID;
    document.getElementById('profile-img').src = finalImage;
    
    // Also update sticky footer in leaderboard if it exists
    if(document.getElementById('sticky-user-img')) {
        document.getElementById('sticky-user-img').src = finalImage;
    }
}

// 2. Handle Image Upload (WITH COMPRESSION)
window.handleImageUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                // Compress Image Logic (Max width 200px to save DB space)
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 200; 
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Get Compressed Base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% Quality
                
                // 1. UI Update
                document.getElementById('profile-img').src = compressedBase64;
                if(document.getElementById('sticky-user-img')) document.getElementById('sticky-user-img').src = compressedBase64;

                // 2. Local Save
                localStorage.setItem('user_avatar', compressedBase64);
                
                // 3. Firebase Save (Real-time Cloud Sync)
                if(window.currentUser && window.saveUserData) {
                    window.saveUserData(window.currentUser.id, { profileImg: compressedBase64 });
                    
                    Swal.fire({
                        toast: true, position: 'top', icon: 'success', 
                        title: 'Profile Picture Updated!', showConfirmButton: false, timer: 1500,
                        background: '#020617', color: '#fff'
                    });
                }
            };
        };
        reader.readAsDataURL(file);
    }
}

// 3. Edit Name Logic
window.openEditModal = function() {
    const currentName = document.getElementById('display-name').innerText;
    document.getElementById('edit-name-input').value = currentName;
    document.getElementById('edit-modal').classList.remove('hidden');
}

window.closeEditModal = function() {
    document.getElementById('edit-modal').classList.add('hidden');
}

window.saveProfileChanges = function() {
    const newName = document.getElementById('edit-name-input').value;
    if (newName.trim() !== "") {
        // UI Update
        document.getElementById('display-name').innerText = newName;
        
        // Local Save
        localStorage.setItem('user_name', newName);
        
        // Firebase Save
        if(window.currentUser && window.saveUserData) {
            window.saveUserData(window.currentUser.id, { name: newName });
        }
        
        closeEditModal();
    } else {
        alert("Name cannot be empty!");
    }
}

// Auto-run
document.addEventListener('DOMContentLoaded', initProfile);

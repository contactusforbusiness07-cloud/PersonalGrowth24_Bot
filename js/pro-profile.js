/* Module: Profile Logic 
    Features: Telegram Sync, Gallery Upload, LocalStorage Persistence
*/

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// 1. Initialize Profile (Call this when page loads or profile section opens)
function initProfile() {
    const storedProfile = JSON.parse(localStorage.getItem('finGameProfile')) || {};
    
    // Check if we have Telegram WebApp Data available
    let tgUser = null;
    if (window.Telegram && window.Telegram.WebApp) {
        tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }

    // Logic: LocalStorage > Telegram Data > Default
    const finalName = storedProfile.name || (tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}` : "Guest Player");
    const finalID = storedProfile.id || (tgUser ? tgUser.id : "8739204"); // Fallback ID for testing
    const finalImage = storedProfile.image || defaultAvatar;

    // Update UI
    document.getElementById('display-name').innerText = finalName;
    document.getElementById('display-id').innerText = finalID;
    document.getElementById('profile-img').src = finalImage;

    // Initial Save if empty
    if (!storedProfile.name && tgUser) {
        saveToLocal(finalName, finalImage, finalID);
    }
}

// 2. Handle Real Gallery Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            
            // UI Update turant karein
            document.getElementById('profile-img').src = base64Image;
            
            // Data Save karein
            saveCurrentState();
        };
        
        reader.readAsDataURL(file); // Convert image to Base64 string
    }
}

// 3. Edit Modal Logic
function openEditModal() {
    const currentName = document.getElementById('display-name').innerText;
    document.getElementById('edit-name-input').value = currentName;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function saveProfileChanges() {
    const newName = document.getElementById('edit-name-input').value;
    if (newName.trim() !== "") {
        document.getElementById('display-name').innerText = newName;
        saveCurrentState();
        closeEditModal();
    } else {
        alert("Name cannot be empty!");
    }
}

// 4. Helper: Save to LocalStorage
function saveCurrentState() {
    const name = document.getElementById('display-name').innerText;
    const img = document.getElementById('profile-img').src;
    const id = document.getElementById('display-id').innerText;
    
    saveToLocal(name, img, id);
}

function saveToLocal(name, image, id) {
    const profileData = {
        name: name,
        image: image,
        id: id
    };
    localStorage.setItem('finGameProfile', JSON.stringify(profileData));
}

// Auto-run initialization
document.addEventListener('DOMContentLoaded', initProfile);


// --- CONTACT & SUPPORT LOGIC ---

// 1. Open Chat Options
window.openSupportChat = function(type) {
    const botUsername = "PersonalGrowth24_Bot"; // Apna Bot Username yahan check karein

    if (type === 'telegram') {
        // Direct Anonymous Chat via Bot
        // Hum ?start=support parameter bhejenge taaki bot samajh jaye
        window.open(`https://t.me/${botUsername}?start=support_chat`, '_blank');
    } 
    else if (type === 'whatsapp') {
        Swal.fire({
            title: 'Coming Soon!',
            text: 'WhatsApp support is under maintenance. Please use Live Chat.',
            icon: 'info',
            confirmButtonColor: '#25D366',
            background: '#020617', color: '#fff'
        });
    }
    else if (type === 'ai') {
        // AI Chat directly Bot me open hoga
        window.open(`https://t.me/${botUsername}?start=ask_ai`, '_blank');
    }
}

// 2. File Name Update
window.updateFileName = function(input) {
    const fileNameDisplay = document.getElementById('file-name');
    if (input.files && input.files[0]) {
        fileNameDisplay.innerText = "Selected: " + input.files[0].name;
        fileNameDisplay.style.color = "#00f2fe";
    }
}

// 3. Submit Ticket
window.submitSupportTicket = async function() {
    const name = document.getElementById('sup-name').value;
    const email = document.getElementById('sup-email').value;
    const mobile = document.getElementById('sup-mobile').value;
    const category = document.getElementById('sup-category').value;
    const message = document.getElementById('sup-message').value;

    // Validation
    if(!name || !email || !mobile || !category || !message) {
        return showError("Please fill all required fields.");
    }
    if(mobile.length < 10) return showError("Invalid Mobile Number.");

    // Loading State
    const btn = document.querySelector('.btn-submit-ticket');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
        // Get User ID
        let userId = "Guest";
        if (window.Telegram && window.Telegram.WebApp) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            if(tgUser) userId = tgUser.id;
        }

        // Send to Backend
        const backendURL = "https://fingamebot-backend.onrender.com/api/submit-support"; 

        const response = await fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: userId,
                name: name,
                email: email,
                mobile: mobile,
                category: category,
                message: message
            })
        });

        if(response.ok) {
            Swal.fire({
                title: 'Request Submitted! ✅',
                text: 'Your Ticket ID: #T' + Math.floor(Date.now() / 1000),
                icon: 'success',
                confirmButtonColor: '#00f2fe',
                background: '#020617', color: '#fff'
            });
            document.getElementById('support-form').reset();
            document.getElementById('file-name').innerText = "Tap to upload image";
        } else {
            throw new Error("Server Error");
        }

    } catch (e) {
        console.error(e);
        showError("Failed to submit. Please use Live Chat.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function showError(msg) {
    if(typeof Swal !== 'undefined') {
        Swal.fire({toast: true, position: 'top', icon: 'error', title: msg, showConfirmButton: false, timer: 3000, background: '#330000', color: '#fff'});
    } else {
        alert(msg);
    }
}


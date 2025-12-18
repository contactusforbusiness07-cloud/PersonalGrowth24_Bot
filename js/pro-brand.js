// --- PREMIUM BRAND LOGIC ---

let formData = {
    asset: "",
    format: "",
    duration: "",
    budget: ""
};

// 1. Generic Selection Logic (Handles all chips/cards)
window.selectOption = function(category, value, element) {
    formData[category] = value;
    document.getElementById(`input-${category}`).value = value;

    // UI Update: Remove active class from siblings
    const container = element.parentElement;
    Array.from(container.children).forEach(child => child.classList.remove('active'));
    
    // Add active to clicked
    element.classList.add('active');
}

// 2. Submit Proposal
window.sendPremiumProposal = async function() {
    const contact = document.getElementById('brand-contact').value;
    const message = document.getElementById('brand-message').value;

    // --- Validation ---
    if(!formData.asset) return showError("Please select a Promotion Placement 📍");
    if(!formData.format) return showError("Please select an Ad Format 🎯");
    if(!formData.duration) return showError("Select Duration ⏱");
    if(!formData.budget) return showError("Select Budget Range 💰");
    if(!contact || contact.length < 5) return showError("Provide valid contact info (Email/Phone) 📞");
    if(!message) return showError("Please write a brief message 📝");

    // --- Loading State ---
    const btn = document.querySelector('.btn-submit-proposal');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        // Get User Info
        let user = { id: "Guest", first_name: "Guest" };
        if (window.Telegram && window.Telegram.WebApp) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            if(tgUser) user = tgUser;
        }

        // Send to Render Backend
        const backendURL = "https://fingamebot-backend.onrender.com/api/submit-brand"; 

        const response = await fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user.id,
                name: user.first_name,
                contact: contact,
                asset: formData.asset,
                format: formData.format,
                duration: formData.duration,
                budget: formData.budget,
                message: message
            })
        });

        if(response.ok) {
            Swal.fire({
                title: 'Proposal Sent! 🚀',
                text: 'Our team will review and contact you within 24 hours.',
                icon: 'success',
                confirmButtonColor: '#ffd700',
                background: '#020617',
                color: '#fff'
            });
            // Reset Form
            document.getElementById('brand-form').reset();
            document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
            formData = { asset: "", format: "", duration: "", budget: "" };
        } else {
            throw new Error("Server Error");
        }

    } catch (e) {
        console.error(e);
        showError("Connection Failed. Try again.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Error Helper
function showError(msg) {
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true, position: 'top', icon: 'warning', 
            title: msg, showConfirmButton: false, timer: 3000,
            background: '#331100', color: '#fff'
        });
    } else {
        alert(msg);
    }
}


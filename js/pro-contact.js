// --- POINT 11: CONTACT SUPPORT ---

function submitContactForm() {
    const msg = document.getElementById('contact-message').value;
    if(!msg) return Swal.fire({icon:'warning', title:'Empty Message', background:'#0f172a', color:'#fff'});

    Swal.fire({title:'Sending...', timer:1000, didOpen:()=>Swal.showLoading(), background:'#0f172a', color:'#fff'})
    .then(() => {
        Swal.fire({icon:'success', title:'Message Sent', text:'Admin @Mr_MorningStar524 received it.', background:'#0f172a', color:'#fff'})
        .then(backToProfileMenu);
    });
}

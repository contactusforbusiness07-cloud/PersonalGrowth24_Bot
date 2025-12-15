// --- POINTS 6, 7, 8, 9, 10: INFO PAGES ---

function openInfoPage(type) {
    // Menu Close logic manually for popups
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu) menu.classList.remove('open');
    if(overlay) overlay.classList.add('hidden');

    let title = "Info", body = "";
    
    // Logic Mapping
    switch(type) {
        case 'withdraw_terms': // Point 6
            title = "Withdrawal Rules"; 
            body = "1. Top 10 Rankers: Instant Payout.<br>2. Others: Monthly Payout."; 
            break;
        case 'terms': // Point 7
            title = "Terms & Conditions"; 
            body = "No hacking, scripting, or fake referrals allowed."; 
            break;
        case 'privacy': // Point 8
            title = "Privacy Policy"; 
            body = "Your data is encrypted and secure."; 
            break;
        case 'disclaimer': // Point 9
            title = "Disclaimer"; 
            body = "Earnings depend on Ad Revenue availability."; 
            break;
        case 'faq': // Point 10
            title = "Help / FAQ"; 
            body = "<b>Q: How to earn?</b><br>A: Complete tasks and refer friends."; 
            break;
    }

    Swal.fire({
        title: title,
        html: body,
        background: '#0f172a',
        color: '#fff',
        confirmButtonText: 'Back to Menu'
    }).then(() => {
        // Re-open Menu on close
        if(menu) menu.classList.add('open');
        if(overlay) overlay.classList.remove('hidden');
    });
}

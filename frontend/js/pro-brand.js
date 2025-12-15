// --- POINT 5: BRAND / SPONSORSHIP ---

function selectBudget(el, val) {
    document.querySelectorAll('.budget-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selected-budget').value = val;
}

function sendBrandProposal() {
    const promo = document.querySelector('input[name="promo_type"]:checked');
    const budget = document.getElementById('selected-budget').value;
    
    if(!promo || !budget) return Swal.fire({icon:'warning', title:'Incomplete', text:'Select Platform & Budget', background:'#0f172a', color:'#fff'});

    Swal.fire({title:'Sending...', timer:1500, didOpen:()=>Swal.showLoading(), background:'#0f172a', color:'#fff'})
    .then(() => {
        Swal.fire({icon:'success', title:'Sent to Admin', background:'#0f172a', color:'#fff'})
        .then(backToProfileMenu);
    });
}

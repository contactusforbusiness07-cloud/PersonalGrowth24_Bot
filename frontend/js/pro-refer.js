// --- POINT 4: REFER & EARN ---

const targets = [3, 5, 10, 20, 50, 100, 1000];
const myRefers = 7; // Database se aayega

function renderReferralTargets() {
    const box = document.getElementById('referral-targets-list');
    if(!box) return;
    box.innerHTML = '';
    targets.forEach(t => {
        let active = myRefers >= t;
        let btnClass = active ? 'btn-claim' : 'btn-locked';
        let btnTxt = active ? 'Claim 1000' : 'Locked';
        let prog = Math.min((myRefers/t)*100, 100);
        
        box.innerHTML += `
        <div class="target-item">
            <div class="target-info"><h4>${t} Friends</h4><div style="width:100px;height:4px;background:#333;margin-top:5px"><div style="width:${prog}%;height:100%;background:#22c55e"></div></div></div>
            <button class="target-btn ${btnClass}" onclick="claimRefer(${t})">${btnTxt}</button>
        </div>`;
    });
}

function claimRefer(t) {
    if(myRefers < t) return;
    Swal.fire({icon:'success', title:'Claimed!', background:'#0f172a', color:'#fff'});
}

function switchReferTab(type) {
    document.getElementById('tab-targets').classList.toggle('hidden', type !== 'targets');
    document.getElementById('tab-list').classList.toggle('hidden', type !== 'list');
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0 && type==='targets')||(i===1 && type==='list')));
}

function copyCode() {
    navigator.clipboard.writeText('SHIV123');
    Swal.fire({toast:true, icon:'success', title:'Copied', position:'top', timer:1500, showConfirmButton:false, background:'#0f172a', color:'#fff'});
}

// Auto Load
document.addEventListener('DOMContentLoaded', renderReferralTargets);

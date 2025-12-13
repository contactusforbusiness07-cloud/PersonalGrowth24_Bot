const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

// CONFIG
const CONFIG = { adReward: 500, gameReward: 100, channelReward: 1000, cvCost: 10000, rankerRate: 10000, normalRate: 100000 };
let user = JSON.parse(localStorage.getItem('pg_user')) || {
    name: tg.initDataUnsafe?.user?.first_name || "Guest",
    coins: 0, rank: Math.floor(Math.random() * 500) + 1,
    joinedChannels: []
};

const channels = [
    {name: "English Room", id: "ch1", url: "https://t.me/The_EnglishRoom5"},
    {name: "Speaking Shots", id: "ch2", url: "https://t.me/English_Speaking_Grammar_Shots"},
    {name: "UPSC Notes", id: "ch3", url: "https://t.me/UPSC_Notes_Official"},
    {name: "Quiz Vault", id: "ch4", url: "https://t.me/UPSC_Quiz_Vault"},
    {name: "IAS Prep", id: "ch5", url: "https://t.me/IAS_PrepQuiz_Zone"},
    {name: "Tourism India", id: "ch6", url: "https://t.me/MinistryOfTourism"},
    {name: "Finance Tips", id: "ch7", url: "https://t.me/PersonalFinanceWithShiv"},
    {name: "Govt Schemes", id: "ch8", url: "https://t.me/GovernmentSchemesIndia"}
];

// INIT
updateUI();
renderChannels();
renderLeaderboard();
generateReferralLink();

function updateUI() {
    document.getElementById('header-coins').innerText = user.coins.toLocaleString();
    document.getElementById('username').innerText = user.name;
    document.getElementById('user-rank').innerText = user.rank;
    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('profile-rank').innerText = user.rank;
    document.getElementById('wallet-coins').innerText = user.coins.toLocaleString();
    
    let divisor = user.rank <= 10 ? CONFIG.rankerRate : CONFIG.normalRate;
    document.getElementById('wallet-fiat').innerText = (user.coins / divisor).toFixed(2);
    
    const msg = document.getElementById('withdraw-msg');
    msg.innerHTML = user.rank <= 10 ? 
        "<span style='color:var(--green)'>Eligible for Instant Withdrawal</span>" : 
        "<span style='color:var(--red)'>Low Rank. Withdraw on 30th.</span>";

    let progress = Math.min(100, (user.coins / 5000) * 100);
    document.getElementById('daily-progress').style.width = `${progress}%`;
    localStorage.setItem('pg_user', JSON.stringify(user));
}

function switchTab(tabId) {
    document.querySelectorAll('.active-section').forEach(el => el.classList.remove('active-section', 'fade-in'));
    document.querySelectorAll('.hidden').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-${tabId}`).classList.add('active-section', 'fade-in');
    
    const tabs = ['hub', 'games', 'oracle', 'profile'];
    document.querySelectorAll('.nav-item')[tabs.indexOf(tabId)].classList.add('active');
}

function addCoins(amount) {
    user.coins += amount;
    updateUI();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
}

function watchAd(id) {
    Swal.fire({
        title: 'Loading Ad...', html: 'Watch for <b>15</b> seconds.', timer: 15000, timerProgressBar: true, 
        allowOutsideClick: false, didOpen: () => Swal.showLoading()
    }).then((r) => {
        if(r.dismiss === Swal.DismissReason.timer) {
            Swal.fire('Success!', `+${CONFIG.adReward} Coins`, 'success');
            addCoins(CONFIG.adReward);
        }
    });
}

function renderChannels() {
    const list = document.getElementById('channel-list');
    list.innerHTML = '';
    channels.forEach(ch => {
        const isJoined = user.joinedChannels.includes(ch.id);
        const div = document.createElement('div');
        div.className = `channel-row glass-card ${isJoined ? 'claimed' : ''}`;
        div.innerHTML = `<span><i class="fab fa-telegram"></i> ${ch.name}</span><span class="tag">${isJoined ? 'Joined' : '+1000'}</span>`;
        if(!isJoined) div.onclick = () => joinChannel(ch);
        list.appendChild(div);
    });
}

function joinChannel(ch) {
    tg.openTelegramLink(ch.url);
    Swal.fire({
        title: 'Verifying...', text: 'Wait 10s for verification.', timer: 10000, timerProgressBar: true, 
        allowOutsideClick: false, didOpen: () => Swal.showLoading()
    }).then((r) => {
        if(r.dismiss === Swal.DismissReason.timer) {
            user.joinedChannels.push(ch.id);
            addCoins(CONFIG.channelReward);
            renderChannels();
            Swal.fire('Verified!', '+1000 Coins', 'success');
        }
    });
}

function launchGame(name, url) {
    Swal.fire({
        title: 'Game Loading...', html: 'Watch Ad (10s) to start <b>'+name+'</b>', timer: 10000, timerProgressBar: true,
        allowOutsideClick: false, didOpen: () => Swal.showLoading()
    }).then((r) => {
        if(r.dismiss === Swal.DismissReason.timer) {
            addCoins(CONFIG.gameReward);
            document.getElementById('game-frame').src = url;
            document.getElementById('game-overlay').classList.remove('hidden');
        }
    });
}
function closeGame() {
    document.getElementById('game-overlay').classList.add('hidden');
    document.getElementById('game-frame').src = "";
}

let currentOracle = "";
function openOracle(type) { currentOracle = type; document.getElementById('oracle-modal').classList.remove('hidden'); }
function generateOracleResult() {
    const name = document.getElementById('oracle-name').value;
    const file = document.getElementById('oracle-photo').files[0];
    if(!name) return Swal.fire('Error', 'Enter Name', 'warning');

    document.getElementById('capture-name').innerText = `Name: ${name}`;
    let res = currentOracle === 'love' ? (Math.floor(Math.random()*30)+70)+"% Match" : "Year " + (2025 + Math.floor(Math.random()*5));
    document.getElementById('capture-result').innerText = res;
    
    if(file) {
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById('capture-img').src = e.target.result; processDownload(); }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('capture-img').src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        processDownload();
    }
}
function processDownload() {
    document.getElementById('oracle-modal').classList.add('hidden');
    const el = document.getElementById('oracle-capture-area');
    el.style.position = 'fixed'; el.style.top = '50%'; el.style.left = '50%'; el.style.transform = 'translate(-50%,-50%)'; el.style.zIndex='3000';
    
    html2canvas(document.querySelector(".watermark-card")).then(canvas => {
        el.style.top = '-9999px';
        let link = document.createElement('a'); link.download = 'Result.png'; link.href = canvas.toDataURL(); link.click();
        Swal.fire('Downloaded!', 'Check Gallery.', 'success');
    });
}

function openCVModal() { document.getElementById('cv-modal').classList.remove('hidden'); }
function generateCV() {
    if (user.coins < CONFIG.cvCost) return Swal.fire('Insufficient Balance', 'You need 10,000 Coins.', 'error');
    user.coins -= CONFIG.cvCost;
    updateUI();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("CV Generated", 20, 20);
    doc.save("Resume.pdf");
    document.getElementById('cv-modal').classList.add('hidden');
    Swal.fire('Success', 'CV Downloaded!', 'success');
}

function attemptWithdraw() {
    const upi = document.getElementById('upi-id').value;
    if(!upi) return Swal.fire('Error', 'Enter UPI ID', 'warning');
    if(user.rank > 10) return Swal.fire('Locked', 'Top 10 Rankers only. Wait for month end.', 'info');
    if(user.coins < 10000) return Swal.fire('Low Balance', 'Min 10,000 Coins.', 'error');
    Swal.fire('Request Sent', 'Processing...', 'success');
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    let html = '';
    for(let i=1; i<=10; i++) {
        html += `<div class="leaderboard-item"><div style="display:flex;align-items:center;"><div class="rank-num ${i===1?'rank-1':''}">${i}</div><span>User_${Math.floor(Math.random()*9000)}</span></div><span class="text-gold">${(50000-i*1000).toLocaleString()}</span></div>`;
    }
    list.innerHTML = html;
}

function generateReferralLink() {
    const link = `https://t.me/PersonalGrowth24_Bot?start=${Math.floor(Math.random()*100000)}`;
    document.getElementById('my-ref-link').innerText = link;
}
function copyReferral() {
    navigator.clipboard.writeText(document.getElementById('my-ref-link').innerText);
    Swal.fire('Copied!', 'Share link to earn coins.', 'success');
}


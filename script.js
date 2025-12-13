// === INITIALIZATION & STATE ===
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Initialize LocalStorage Data
let user = JSON.parse(localStorage.getItem('pg_user')) || {
    name: tg.initDataUnsafe?.user?.first_name || "Guest User",
    coins: 0,
    rank: Math.floor(Math.random() * 500) + 1, // Simulated Rank
    joinedChannels: [],
    referralCount: 0
};

// Config
const CONFIG = {
    adReward: 500,
    gameReward: 100,
    channelReward: 1000,
    cvCost: 10000,
    rankerConversion: 10000, // 10k = 1 INR
    normalConversion: 100000 // 100k = 1 INR
};

const channels = [
    { name: "English Room", id: "ch1", url: "https://t.me/The_EnglishRoom5" },
    { name: "Speaking Shots", id: "ch2", url: "https://t.me/English_Speaking_Grammar_Shots" },
    { name: "UPSC Notes", id: "ch3", url: "https://t.me/UPSC_Notes_Official" },
    { name: "Quiz Vault", id: "ch4", url: "https://t.me/UPSC_Quiz_Vault" },
    { name: "IAS Prep", id: "ch5", url: "https://t.me/IAS_PrepQuiz_Zone" },
    { name: "Tourism India", id: "ch6", url: "https://t.me/MinistryOfTourism" },
    { name: "Finance Tips", id: "ch7", url: "https://t.me/PersonalFinanceWithShiv" },
    { name: "Govt Schemes", id: "ch8", url: "https://t.me/GovernmentSchemesIndia" }
];

// === CORE FUNCTIONS ===

function updateUI() {
    // Header
    document.getElementById('header-coins').innerText = user.coins.toLocaleString();
    document.getElementById('username').innerText = user.name;
    document.getElementById('user-rank').innerText = user.rank;
    
    // Profile
    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('profile-rank').innerText = user.rank;
    document.getElementById('wallet-coins').innerText = user.coins.toLocaleString();
    
    // Wallet Logic (Strict Req A)
    let divisor = user.rank <= 10 ? CONFIG.rankerConversion : CONFIG.normalConversion;
    let value = (user.coins / divisor).toFixed(2);
    document.getElementById('wallet-fiat').innerText = value;
    
    // Withdrawal Message
    const msg = document.getElementById('withdraw-msg');
    if(user.rank <= 10) {
        msg.innerHTML = `<span class='text-green'>Eligible for Instant Withdrawal (10k coins = ₹1)</span>`;
    } else {
        msg.innerHTML = `<span class='text-red'>Low Rank. Withdraw on 30th (100k coins = ₹1)</span>`;
    }

    // Daily Progress
    let progress = Math.min(100, (user.coins / 5000) * 100);
    document.getElementById('daily-progress').style.width = `${progress}%`;

    // Save
    localStorage.setItem('pg_user', JSON.stringify(user));
}

function switchTab(tabId) {
    document.querySelectorAll('.active-section').forEach(el => el.classList.remove('active-section', 'fade-in'));
    document.querySelectorAll('.hidden').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`tab-${tabId}`);
    target.classList.remove('hidden');
    target.classList.add('active-section', 'fade-in');
    
    // Highlight Nav
    event.currentTarget.classList.add('active'); // Needs event context or select by ID logic
}

// === EARNING LOGIC ===

function addCoins(amount) {
    user.coins += amount;
    updateUI();
    // Confetti effect
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// 1. Ad Watch (Strict 15s Timer)
function watchAd(id) {
    Swal.fire({
        title: 'Loading Ad...',
        html: 'Watch for <b>15</b> seconds to earn reward.',
        timer: 15000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire('Success!', `You earned ${CONFIG.adReward} Coins!`, 'success');
            addCoins(CONFIG.adReward);
        }
    });
}

// 2. Channel Logic (Strict 10s Timer)
function renderChannels() {
    const list = document.getElementById('channel-list');
    list.innerHTML = '';
    channels.forEach(ch => {
        const isJoined = user.joinedChannels.includes(ch.id);
        const div = document.createElement('div');
        div.className = `channel-row ${isJoined ? 'claimed' : ''}`;
        div.innerHTML = `
            <div><i class="fab fa-telegram"></i> ${ch.name}</div>
            <div class="tag">${isJoined ? 'Joined' : '+1000'}</div>
        `;
        if(!isJoined) {
            div.onclick = () => joinChannel(ch);
        }
        list.appendChild(div);
    });
}

function joinChannel(ch) {
    tg.openTelegramLink(ch.url);
    Swal.fire({
        title: 'Verifying...',
        text: 'Please wait 10 seconds while we verify your membership.',
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            user.joinedChannels.push(ch.id);
            addCoins(CONFIG.channelReward);
            renderChannels();
            Swal.fire('Verified!', '1000 Coins Added', 'success');
        }
    });
}

// === GAME LOGIC ===

function launchGame(name, url) {
    // 1. Show Ad Popup First (Strict Req B.5)
    Swal.fire({
        title: 'Game Loading...',
        html: 'Watch a quick ad (10s) to start <b>' + name + '</b>',
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            addCoins(CONFIG.gameReward); // Credit 100 coins
            document.getElementById('game-frame').src = url;
            document.getElementById('game-overlay').classList.remove('hidden');
        }
    });
}

function closeGame() {
    document.getElementById('game-overlay').classList.add('hidden');
    document.getElementById('game-frame').src = ""; // Stop audio/game
}

// === TOOLS LOGIC ===

// 1. CV Builder (Cost 10k)
function openCVModal() {
    document.getElementById('cv-modal').classList.remove('hidden');
}
function closeCVModal() {
    document.getElementById('cv-modal').classList.add('hidden');
}

function generateCV() {
    if (user.coins < CONFIG.cvCost) {
        return Swal.fire('Insufficient Balance', 'You need 10,000 Coins.', 'error');
    }

    const name = document.getElementById('cv-name').value;
    const email = document.getElementById('cv-email').value;
    const skills = document.getElementById('cv-skills').value;
    
    if(!name || !email) return Swal.fire('Error', 'Fill all fields', 'warning');

    // Deduct
    user.coins -= CONFIG.cvCost;
    updateUI();

    // Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Curriculum Vitae", 20, 20);
    doc.setFontSize(16);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text("Skills:", 20, 70);
    doc.setFontSize(12);
    doc.text(skills, 20, 80);
    doc.save("Resume.pdf");
    
    closeCVModal();
    Swal.fire('Success', 'CV Downloaded!', 'success');
}

// 2. Oracle Image Gen
let currentOracleType = "";
function openOracle(type) {
    currentOracleType = type;
    document.getElementById('oracle-modal').classList.remove('hidden');
}

function generateOracleResult() {
    const name = document.getElementById('oracle-name').value;
    const file = document.getElementById('oracle-photo').files[0];
    
    if(!name) return Swal.fire('Error', 'Enter Name', 'warning');

    // Setup Capture Area
    document.getElementById('capture-name').innerText = `Name: ${name}`;
    
    // Logic
    const results = ["CEO of Tech Giant", "Millionaire", "IAS Officer", "Travel Influencer"];
    const randomRes = results[Math.floor(Math.random() * results.length)];
    
    if(currentOracleType === 'love') document.getElementById('capture-result').innerText = (Math.floor(Math.random()*30)+70) + "% Match";
    else if (currentOracleType === 'marry') document.getElementById('capture-result').innerText = "Year " + (2025 + Math.floor(Math.random()*5));
    else document.getElementById('capture-result').innerText = randomRes;

    // Image Handling
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('capture-img').src = e.target.result;
            processDownload();
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('capture-img').src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        processDownload();
    }
}

function processDownload() {
    document.getElementById('oracle-modal').classList.add('hidden');
    const element = document.getElementById('oracle-capture-area');
    
    // Temporarily make visible for capture
    element.style.position = 'fixed';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.zIndex = '9999';

    html2canvas(document.querySelector(".watermark-card")).then(canvas => {
        // Hide again
        element.style.top = '-9999px';
        
        const link = document.createElement('a');
        link.download = 'Oracle_Result.png';
        link.href = canvas.toDataURL();
        link.click();
        Swal.fire('Downloaded!', 'Check your gallery.', 'success');
    });
}

// === LEADERBOARD & WITHDRAWAL ===

function attemptWithdraw() {
    const upi = document.getElementById('upi-id').value;
    if(!upi) return Swal.fire('Error', 'Enter UPI ID', 'warning');
    
    if(user.rank > 10) {
        return Swal.fire('Locked', 'Only Top 10 Rankers can withdraw instantly. Wait for month end.', 'info');
    }
    
    if(user.coins < 10000) {
        return Swal.fire('Low Balance', 'Min withdrawal is 10,000 Coins.', 'error');
    }

    Swal.fire('Request Sent', 'Payment processed in 24 hrs.', 'success');
}

function generateReferralLink() {
    const link = `https://t.me/PersonalGrowth24_Bot?start=${Math.floor(Math.random()*100000)}`;
    document.getElementById('my-ref-link').innerText = link;
}

function copyReferral() {
    navigator.clipboard.writeText(document.getElementById('my-ref-link').innerText);
    Swal.fire('Copied!', 'Share link to earn coins.', 'success');
}

// Leaderboard Dummy Data
function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    let html = '';
    for(let i=1; i<=10; i++) {
        html += `
        <div class="leaderboard-item">
            <div class="rank-num ${i===1?'rank-1':''}">${i}</div>
            <span>User_${Math.floor(Math.random()*9000)}</span>
            <span class="text-gold">${(50000 - i*1000).toLocaleString()}</span>
        </div>`;
    }
    // Add user
    html += `
    <div class="leaderboard-item" style="border: 1px solid var(--blue);">
        <div class="rank-num">${user.rank}</div>
        <span>YOU</span>
        <span class="text-gold">${user.coins.toLocaleString()}</span>
    </div>`;
    list.innerHTML = html;
}

// Init Calls
updateUI();
renderChannels();
renderLeaderboard();
generateReferralLink();

// Tab Handling
document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- DATABASE SIMULATION (Real Logic Placeholder) ---
const db = {
    user: {
        balance: 1500,
        earningsToday: 150,
        unlockedTools: [], // Agar 'CV Builder' isme hai to unlock hoga
        rank: 452
    }
};

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    updateUI();
    startCountdown();
    renderTasks();
    renderLeaderboard();
});

// --- UI UPDATER ---
function updateUI() {
    // Balance Animation
    const balanceEl = document.getElementById("user-balance");
    balanceEl.innerText = db.user.balance;
    document.getElementById("today-earnings").innerText = db.user.earningsToday;
    
    // Wallet Page Values
    document.getElementById("wallet-balance").innerText = db.user.balance;
    document.getElementById("wallet-inr").innerText = (db.user.balance / 100000).toFixed(2);

    // Tool Locking Logic
    const tools = ['CV Builder', 'Love Calc', 'Marriage', 'Career'];
    tools.forEach(tool => {
        if(db.user.unlockedTools.includes(tool)) {
            // Lock hatao
            const id = tool.split(' ')[0].toLowerCase(); // e.g., 'cv'
            const el = document.getElementById(`lock-${id === 'cv' ? 'cv' : id}`);
            if(el) el.parentElement.classList.add('unlocked');
        }
    });
}

// --- NAVIGATION ---
function navigateTo(sectionId) {
    // Sab chupao
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    // Target dikhao
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');

    // Bottom Nav Update
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const map = {'home':0, 'leaderboard':1, 'tasks':2, 'games':3, 'wallet':4};
    document.querySelectorAll('.nav-item')[map[sectionId]].classList.add('active');
}

// --- TOOL LOCKING SYSTEM ---
function accessTool(toolName) {
    if (db.user.unlockedTools.includes(toolName)) {
        Swal.fire({
            title: toolName,
            html: `<input type="text" class="swal2-input" placeholder="Enter Details"><br>Processing AI...`,
            confirmButtonText: 'Download Result',
            confirmButtonColor: '#3b82f6'
        });
    } else {
        Swal.fire({
            title: 'Feature Locked 🔒',
            text: 'Unlock this premium tool to use it.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Watch Ad (30s)',
            cancelButtonText: 'Invite 2 Friends',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#10b981'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ad Logic
                let timerInterval;
                Swal.fire({
                    title: 'Ad Playing...',
                    html: 'Reward in <b>5</b> seconds.',
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector('b');
                        timerInterval = setInterval(() => b.textContent = Math.ceil(Swal.getTimerLeft() / 1000), 100)
                    },
                    willClose: () => clearInterval(timerInterval)
                }).then((r) => {
                    if (r.dismiss === Swal.DismissReason.timer) {
                        db.user.unlockedTools.push(toolName);
                        updateUI();
                        Swal.fire('Unlocked!', `You can now use ${toolName}`, 'success');
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                openReferralModal();
            }
        });
    }
}

// --- TASKS SYSTEM ---
const channels = [
    { name: "English Room", link: "https://t.me/The_EnglishRoom5" },
    { name: "Grammar Shots", link: "https://t.me/English_Speaking_Grammar_Shots" },
    { name: "UPSC Notes", link: "https://t.me/UPSC_Notes_Official" },
    { name: "UPSC Quiz", link: "https://t.me/UPSC_Quiz_Vault" },
    { name: "IAS Prep", link: "https://t.me/IAS_PrepQuiz_Zone" },
    { name: "Tourism Min", link: "https://t.me/MinistryOfTourism" },
    { name: "Personal Finance", link: "https://t.me/PersonalFinanceWithShiv" },
    { name: "Gov Schemes", link: "https://t.me/GovernmentSchemesIndia" }
];

function renderTasks() {
    const list = document.getElementById('telegram-task-list');
    list.innerHTML = channels.map((ch, i) => `
        <div class="task-item" id="task-${i}">
            <div class="icon-box bg-blue" style="width:40px;height:40px;border-radius:10px;font-size:1rem;"><i class="fa-brands fa-telegram"></i></div>
            <div style="flex:1;margin-left:10px;">
                <h4 style="font-size:0.9rem;">${ch.name}</h4>
                <p class="text-accent" style="font-size:0.75rem;">+1000 Coins</p>
            </div>
            <button class="btn-action" onclick="verifyTask('${ch.link}', ${i})">Join</button>
        </div>
    `).join('');
}

function verifyTask(link, i) {
    window.open(link, '_blank');
    const btn = document.querySelector(`#task-${i} .btn-action`);
    btn.innerText = "Verifying...";
    btn.disabled = true;
    setTimeout(() => {
        db.user.balance += 1000;
        updateUI();
        btn.innerText = "Claimed";
        btn.classList.add('bg-green');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        Swal.fire({ icon: 'success', title: '+1000 Coins', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }, 4000);
}

// --- GAMES & ADS ---
function watchAdReward() {
    Swal.fire({ title: 'Loading Ad...', timer: 2000, didOpen: () => Swal.showLoading() }).then(() => {
        db.user.balance += 500; updateUI();
        Swal.fire('+500 Coins!', 'Ad watched.', 'success');
    });
}

function playGame(type) {
    let reward = type === 'trending' ? 500 : 100;
    Swal.fire({ title: 'Starting Game...', text: 'Loading assets', timer: 1500, didOpen: () => Swal.showLoading() }).then(() => {
        Swal.fire({
            title: 'Playing...',
            html: 'Play for <b>10</b> seconds...',
            timer: 10000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                const b = Swal.getHtmlContainer().querySelector('b');
                setInterval(() => b.textContent = Math.ceil(Swal.getTimerLeft() / 1000), 100)
            }
        }).then((res) => {
            if (res.dismiss === Swal.DismissReason.timer) {
                db.user.balance += reward; updateUI();
                Swal.fire('Game Over', `You earned ${reward} coins!`, 'success');
            }
        });
    });
}

// --- LEADERBOARD & WITHDRAWAL ---
function renderLeaderboard() {
    const list = document.getElementById('lb-list');
    let html = '';
    for(let i=4; i<=10; i++) {
        html += `
            <div class="glass-card" style="padding:10px; display:flex; align-items:center; margin-bottom:10px;">
                <div style="width:30px; font-weight:bold; color:#94a3b8;">#${i}</div>
                <img src="https://i.pravatar.cc/100?img=${i+10}" style="width:30px;height:30px;border-radius:50%;margin:0 10px;">
                <div style="flex:1;">User_${9900-(i*100)}</div>
                <div class="text-gold font-bold">${70000-(i*2000)}</div>
            </div>
        `;
    }
    list.innerHTML = html;
}

function startCountdown() {
    setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1); tomorrow.setHours(0,0,0,0);
        const diff = tomorrow - now;
        const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
        const m = Math.floor((diff%(1000*60*60))/(1000*60));
        const s = Math.floor((diff%(1000*60))/1000);
        document.getElementById('countdown').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

function attemptWithdraw() {
    Swal.fire({ icon: 'error', title: 'Withdrawal Locked', text: 'Only Top 10 users can withdraw instantly.', footer: 'Month-end payout for others.' });
}

// --- PROFILE EXTRAS ---
function openProfileMenu() {
    Swal.fire({
        title: 'Menu',
        html: `
            <button class="swal2-confirm swal2-styled" onclick="openReferralModal()" style="width:100%;margin-bottom:10px;">Refer & Earn</button>
            <button class="swal2-confirm swal2-styled" onclick="openSponsorship()" style="width:100%;background:#f59e0b;">Sponsorship</button>
        `,
        showConfirmButton: false
    });
}

function openReferralModal() {
    Swal.fire({ title: 'Refer & Earn', html: `Invite friends to unlock tools!<br><br>Link: <code>t.me/bot?start=123</code>`, confirmButtonText: 'Copy Link' });
}

function openSponsorship() {
    Swal.fire({
        title: 'Brand Collab',
        html: `<select class="swal2-input"><option>Telegram</option><option>App</option></select><input placeholder="Budget" class="swal2-input">`,
        confirmButtonText: 'Submit'
    }).then((r) => { if(r.isConfirmed) Swal.fire('Sent!', 'Admin will contact you.', 'success'); });
}

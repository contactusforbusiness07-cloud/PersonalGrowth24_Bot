// ================= FIREBASE STUB SERVICE =================
// Simulating Backend calls with Promises
const db = {
    user: {
        id: "user_123",
        balance: 1500,
        earningsToday: 150,
        referrals: 0,
        unlockedTools: [], // 'CV Builder', 'Love Calc' etc.
        rank: 452
    },
    
    // Simulate updating balance
    updateBalance: (amount) => {
        return new Promise((resolve) => {
            db.user.balance += amount;
            db.user.earningsToday += amount;
            updateUI();
            resolve(db.user.balance);
        });
    },

    // Unlock a tool
    unlockTool: (toolId) => {
        if(!db.user.unlockedTools.includes(toolId)){
            db.user.unlockedTools.push(toolId);
        }
    }
};

// ================= APP LOGIC =================

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    updateUI();
    startCountdown();
    renderTasks();
    renderLeaderboardList();
});

// UI Updater
function updateUI() {
    // Animate numbers
    animateValue("user-balance", parseInt(document.getElementById("user-balance").innerText), db.user.balance, 1000);
    document.getElementById("today-earnings").innerText = db.user.earningsToday;
    document.getElementById("wallet-balance").innerText = db.user.balance;
    document.getElementById("wallet-inr").innerText = (db.user.balance / 100000).toFixed(2);
    
    // Update Tool Locks
    const tools = ['CV Builder', 'Love Calc', 'Marriage', 'Career'];
    tools.forEach(tool => {
        if(db.user.unlockedTools.includes(tool)) {
            // Find the element and remove lock class
            // (Simple string matching for demo)
            const id = tool.split(' ')[0].toLowerCase();
            const el = document.getElementById(`lock-${id === 'cv' ? 'cv' : id}`);
            if(el) el.parentElement.classList.add('unlocked');
        }
    });
}

// Navigation Logic
function navigateTo(sectionId) {
    // Hide all
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    // Show Target
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');

    // Update Bottom Nav Visuals
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    // Find index based on simple mapping
    const map = {'home':0, 'leaderboard':1, 'tasks':2, 'games':3, 'wallet':4};
    document.querySelectorAll('.nav-item')[map[sectionId]].classList.add('active');
}

// ================= FEATURE LOGIC =================

// 1. Tool Locking System
function accessTool(toolName) {
    if (db.user.unlockedTools.includes(toolName)) {
        // Open Tool Logic (Simulated)
        Swal.fire({
            title: toolName,
            html: `
                <div style="text-align:left">
                    <label>Enter Name:</label>
                    <input type="text" class="swal2-input" placeholder="Your Name">
                    <div style="margin-top:10px; border: 1px dashed #ccc; padding: 20px; text-align:center;">
                        Processing AI...
                    </div>
                </div>
            `,
            confirmButtonText: 'Download Result',
            confirmButtonColor: '#3b82f6'
        });
    } else {
        // Locked Popup
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
                // Watch Ad Logic
                let timerInterval;
                Swal.fire({
                    title: 'Ad Playing...',
                    html: 'Reward in <b>5</b> seconds.',
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector('b');
                        timerInterval = setInterval(() => {
                            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        db.unlockTool(toolName);
                        updateUI();
                        Swal.fire('Unlocked!', `You can now use ${toolName}`, 'success');
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Referral Logic
                openReferralModal();
            }
        });
    }
}

// 2. Task Logic
const telegramChannels = [
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
    list.innerHTML = telegramChannels.map((channel, index) => `
        <div class="task-item" id="task-${index}">
            <div class="task-icon bg-blue"><i class="fa-brands fa-telegram"></i></div>
            <div class="task-info">
                <h4>${channel.name}</h4>
                <p>+1000 Coins</p>
            </div>
            <button class="btn-action" onclick="verifyTask('${channel.link}', ${index})">Join</button>
        </div>
    `).join('');
}

function verifyTask(link, index) {
    // 1. Open Link
    window.open(link, '_blank');
    
    // 2. Show Verifying state
    const btn = document.querySelector(`#task-${index} .btn-action`);
    const originalText = btn.innerText;
    btn.innerText = "Verifying...";
    btn.disabled = true;

    // 3. Fake Verification Delay
    setTimeout(() => {
        db.updateBalance(1000);
        btn.innerText = "Claimed";
        btn.classList.add('bg-green'); // Change color
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        Swal.fire({
            icon: 'success',
            title: '+1000 Coins',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    }, 5000);
}

function watchAdReward() {
    Swal.fire({
        title: 'Loading Ad...',
        timer: 3000,
        didOpen: () => Swal.showLoading()
    }).then(() => {
         db.updateBalance(500);
         Swal.fire('+500 Coins!', 'Ad watched successfully.', 'success');
    });
}

// 3. Games Logic
function playGame(type) {
    let reward = type === 'trending' ? 500 : 100;
    
    // Ad Overlay
    Swal.fire({
        title: 'Starting Game...',
        text: 'Loading assets',
        timer: 2000,
        didOpen: () => Swal.showLoading()
    }).then(() => {
        // Game Simulation
        Swal.fire({
            title: 'Game Running 🎮',
            html: 'Play for <b>15</b> seconds to earn reward.',
            timer: 15000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                const b = Swal.getHtmlContainer().querySelector('b');
                setInterval(() => {
                    if(b) b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 100)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                db.updateBalance(reward);
                Swal.fire('Game Over', `You earned ${reward} coins!`, 'success');
            }
        });
    });
}

// 4. Leaderboard Logic
function renderLeaderboardList() {
    const list = document.getElementById('lb-list');
    let html = '';
    // Generate fake rows for Rank 4-10
    for(let i=4; i<=10; i++) {
        html += `
            <div class="lb-item">
                <div class="lb-rank">#${i}</div>
                <div class="lb-user">
                    <img src="https://i.pravatar.cc/100?img=${i+10}" alt="">
                    <span>User_${9900 - (i*100)}</span>
                </div>
                <div class="lb-coins">${70000 - (i*2000)}</div>
            </div>
        `;
    }
    list.innerHTML = html;
}

function startCountdown() {
    // Reset at midnight logic
    setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0);
        
        const diff = tomorrow - now;
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

// 5. Withdrawal Logic
function attemptWithdraw() {
    const balance = db.user.balance;
    const rank = db.user.rank;

    if(rank <= 10) {
        Swal.fire('Success', 'Instant Withdraw Processed!', 'success');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Withdrawal Locked',
            text: 'Only Top 10 users can withdraw instantly. Your balance is safe for month-end payout.',
            footer: '<a href="#">Read Rules</a>'
        });
    }
}

// 6. Profile & Sponsorship
function openProfileMenu() {
    Swal.fire({
        title: 'Menu',
        html: `
            <button class="swal2-confirm swal2-styled" onclick="openReferralModal()" style="width:100%; margin-bottom:10px;">Refer & Earn</button>
            <button class="swal2-confirm swal2-styled" onclick="openSponsorship()" style="width:100%; background:#f59e0b;">Brand / Sponsorship</button>
            <button class="swal2-cancel swal2-styled" style="width:100%; background:#333;">Terms & Conditions</button>
        `,
        showConfirmButton: false
    });
}

function openReferralModal() {
    Swal.fire({
        title: 'Refer & Earn',
        html: `
            <div style="text-align:left">
                <p>Invite friends to unlock tools!</p>
                <div style="margin: 10px 0;">
                    <label>3 Refs (1000 Coins)</label>
                    <div style="background:#333; height:10px; border-radius:5px;"><div style="width:30%; background:#10b981; height:100%; border-radius:5px;"></div></div>
                </div>
                <div style="margin: 10px 0;">
                    <label>5 Refs (1500 Coins) <i class="fa-solid fa-lock"></i></label>
                    <div style="background:#333; height:10px; border-radius:5px;"><div style="width:0%; background:#10b981; height:100%; border-radius:5px;"></div></div>
                </div>
            </div>
            <br> Your Link: <code>t.me/bot?start=123</code>
        `,
        confirmButtonText: 'Copy Link'
    });
}

function openSponsorship() {
    Swal.fire({
        title: 'Brand Collaboration',
        html: `
            <select id="sp-type" class="swal2-input">
                <option value="Telegram">Telegram Channel Promotion</option>
                <option value="App">App Promotion</option>
                <option value="Product">Product Review</option>
            </select>
            <select id="sp-budget" class="swal2-input">
                <option value="500">₹500 - ₹2,000</option>
                <option value="5000">₹2,000 - ₹10,000</option>
                <option value="50000">₹10,000 - ₹50,000+</option>
            </select>
            <textarea id="sp-details" class="swal2-textarea" placeholder="Project Details & Links"></textarea>
        `,
        confirmButtonText: 'Submit Request',
        preConfirm: () => {
            // Fake API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Sent!', 'Admin will contact you shortly.', 'success');
        }
    });
}

// Utility: Number Animation
function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    if(stepTime < 1) stepTime = 1; // Faster for big numbers
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

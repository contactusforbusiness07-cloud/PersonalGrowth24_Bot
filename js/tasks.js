/* js/tasks.js - STRICT VERIFICATION & SMART PROMOTION ENGINE */

const TASKS_CACHE_KEY = 'fingamepro_tasks_v4';

// --- 1. PROMOTION CONFIGURATION ---
const PROMO_CONFIG = {
    youtubeVideoId: "", 
    // 🔥 SMARTLINK INTEGRATED HERE
    adsterraDirectLink: "https://www.effectivegatecpm.com/q3zxkem7?key=8dba0d1f9c1ff4fd04c8eec011b1bf87", 
    // Popunder Link for rotation
    popunderLink: "https://www.effectivegatecpm.com/q3zxkem7?key=8dba0d1f9c1ff4fd04c8eec011b1bf87", 
    reward: 500
};

// --- ADS CONFIGURATION ---
const ADS_CONFIG = {
    SOCIAL_BAR_URL: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js",
    NATIVE_KEY: "85c8e4eb0a60d8ad0292343f4d54b04b",
    BANNER_KEY: "da50611c22ea409fabf6255e80467cc4"
};

// --- 2. TASK LIST ---
const ALL_TASKS = [
    // --- SMARTLINK TASKS (Disappear after complete, Reappear on refresh) ---
    { id: 'smart_ad_1', type: 'smart_ad', name: '🌟 Special Offer 1', reward: 1000 },
    { id: 'smart_ad_2', type: 'smart_ad', name: '⚡ Quick Task: Install', reward: 1000 },
    { id: 'smart_ad_3', type: 'smart_ad', name: '🎁 Claim Bonus Reward', reward: 1000 },
    
    // --- TELEGRAM CHANNELS (is_bot_admin: false = Auto Verify) ---
    { 
        id: 'tg_english', 
        type: 'telegram',
        name: 'The English Room', 
        channel_id: '@The_EnglishRoom5', 
        url: 'https://t.me/The_EnglishRoom5', 
        reward: 1000,
        is_bot_admin: false // Set true ONLY if bot is admin
    },
    { 
        id: 'tg_grammar', 
        type: 'telegram',
        name: 'Grammar Shots', 
        channel_id: '@English_Speaking_Grammar_Shots', 
        url: 'https://t.me/English_Speaking_Grammar_Shots', 
        reward: 1000,
        is_bot_admin: false
    },
    
    // --- MORE SMARTLINK TASKS MIXED IN ---
    { id: 'smart_ad_4', type: 'smart_ad', name: '🔥 Hot Offer: Register', reward: 1000 },

    { 
        id: 'tg_upsc_notes', 
        type: 'telegram',
        name: 'UPSC Notes Official', 
        channel_id: '@UPSC_Notes_Official', 
        url: 'https://t.me/UPSC_Notes_Official', 
        reward: 1000,
        is_bot_admin: false
    },
    { 
        id: 'tg_upsc_quiz', 
        type: 'telegram',
        name: 'UPSC Quiz Vault', 
        channel_id: '@UPSC_Quiz_Vault', 
        url: 'https://t.me/UPSC_Quiz_Vault', 
        reward: 1000,
        is_bot_admin: false
    },
    
    // --- MORE SMARTLINK TASKS ---
    { id: 'smart_ad_5', type: 'smart_ad', name: '💎 Premium Survey', reward: 1000 },
    { id: 'smart_ad_6', type: 'smart_ad', name: '🚀 Launch Partner App', reward: 1000 },

    { 
        id: 'tg_ias_prep', 
        type: 'telegram',
        name: 'IAS Prep Quiz Zone', 
        channel_id: '@IAS_PrepQuiz_Zone', 
        url: 'https://t.me/IAS_PrepQuiz_Zone', 
        reward: 1000,
        is_bot_admin: false
    },
    { 
        id: 'tg_tourism', 
        type: 'telegram',
        name: 'Ministry of Tourism', 
        channel_id: '@MinistryOfTourism', 
        url: 'https://t.me/MinistryOfTourism', 
        reward: 1000,
        is_bot_admin: false 
    },
    { 
        id: 'tg_finance', 
        type: 'telegram',
        name: 'Personal Finance', 
        channel_id: '@PersonalFinanceWithShiv', 
        url: 'https://t.me/PersonalFinanceWithShiv', 
        reward: 1000,
        is_bot_admin: false
    },
    { 
        id: 'tg_schemes', 
        type: 'telegram',
        name: 'Govt Schemes India', 
        channel_id: '@GovernmentSchemesIndia', 
        url: 'https://t.me/GovernmentSchemesIndia', 
        reward: 1000,
        is_bot_admin: false
    },
    // --- Additional Promo Tasks ---
    { 
        id: 'insta_follow', 
        type: 'instagram',
        name: 'Follow on Instagram', 
        url: 'https://instagram.com/', 
        reward: 800 
    },
    { 
        id: 'promo_post', 
        type: 'post',
        name: 'Check Recent Post', 
        url: 'https://t.me/The_EnglishRoom5', 
        reward: 500 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderTasks, 300);
    injectSocialBar(); 
});

// --- RENDER ENGINE ---
function renderTasks() {
    const listContainer = document.getElementById('telegram-tasks-list');
    if(!listContainer) return;
    listContainer.innerHTML = ''; 

    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');

    // 1. RENDER WATCH HERO
    renderWatchHero();

    // 2. INJECT BANNER
    renderBanner320(listContainer);

    // 3. RENDER TASKS LOOP
    ALL_TASKS.forEach((task, index) => {
        // Special Logic for Smart Ad (Don't check LS, they reappear on reload)
        if(task.type === 'smart_ad') {
            const card = document.createElement('div');
            card.className = 'task-card smart-task';
            card.style.border = "1px solid #ffd700"; // Gold border for premium feel
            
            card.innerHTML = `
                <div class="task-icon"><i class="fa-solid fa-fire-flame-curved text-gold"></i></div>
                <div class="task-info">
                    <h4 style="color:#ffd700">${task.name}</h4>
                    <div class="reward-badge">+${task.reward}</div>
                </div>
                <button class="btn-join" onclick="handleSmartLinkTask('${task.id}', ${task.reward}, this)">START</button>
            `;
            listContainer.appendChild(card);
            return; // Continue to next iteration
        }

        // Standard Logic for Persistent Tasks
        const isDone = completedTasks.includes(task.id);
        
        let iconClass = "fa-brands fa-telegram tg-blue";
        if(task.type === 'instagram') iconClass = "fa-brands fa-instagram text-pink";
        if(task.type === 'post') iconClass = "fa-solid fa-note-sticky text-gold";
        
        const card = document.createElement('div');
        card.className = `task-card ${isDone ? 'completed-task' : ''}`;
        
        let btnHTML = '';
        if (isDone) {
            btnHTML = `<button class="btn-join" disabled><i class="fa-solid fa-check"></i></button>`;
        } else {
            if (task.type === 'telegram') {
                // Pass is_bot_admin flag
                btnHTML = `<button class="btn-join" onclick="handleTelegramVerify('${task.id}', '${task.channel_id}', '${task.url}', ${task.reward}, this, ${task.is_bot_admin})">JOIN</button>`;
            } else {
                btnHTML = `<button class="btn-join" onclick="handleTimeBasedTask('${task.id}', '${task.url}', ${task.reward}, this)">OPEN</button>`;
            }
        }

        card.innerHTML = `
            <div class="task-icon"><i class="${iconClass}"></i></div>
            <div class="task-info">
                <h4>${task.name}</h4>
                <div class="reward-badge"><i class="fa-solid fa-coins"></i> +${task.reward}</div>
            </div>
            ${btnHTML}
        `;
        listContainer.appendChild(card);

        // Inject Native Ad after 4th item
        if (index === 4) {
            renderNativeAd(listContainer);
        }
    });
}

// 🔥 BANNER 320x50 RENDERER
function renderBanner320(container) {
    const bannerBox = document.createElement('div');
    bannerBox.style.width = "100%";
    bannerBox.style.display = "flex";
    bannerBox.style.justifyContent = "center";
    bannerBox.style.marginBottom = "15px";
    
    const iframe = document.createElement('iframe');
    iframe.style.width = "320px";
    iframe.style.height = "50px";
    iframe.style.border = "none";
    iframe.scrolling = "no";
    
    bannerBox.appendChild(iframe);
    container.appendChild(bannerBox);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html><body style="margin:0;padding:0;">
        <script type="text/javascript">
            atOptions = {
                'key' : '${ADS_CONFIG.BANNER_KEY}',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/${ADS_CONFIG.BANNER_KEY}/invoke.js"></script>
        </body></html>
    `);
    doc.close();
}

// 🔥 NATIVE AD RENDERER
function renderNativeAd(container) {
    const adCard = document.createElement('div');
    adCard.className = 'native-ad-card';
    adCard.style.padding = "0";
    adCard.style.background = "transparent";
    adCard.style.border = "none";
    adCard.style.height = "auto";
    adCard.style.minHeight = "250px";

    const iframe = document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.minHeight = "250px";
    iframe.style.border = "none";
    iframe.scrolling = "no";

    adCard.appendChild(iframe);
    container.appendChild(adCard);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;} #container-${ADS_CONFIG.NATIVE_KEY} { transform: scale(1.0); }</style></head>
        <body>
            <div id="container-${ADS_CONFIG.NATIVE_KEY}"></div>
            <script async="async" data-cfasync="false" src="//pl28285595.effectivegatecpm.com/${ADS_CONFIG.NATIVE_KEY}/invoke.js"></script>
        </body>
        </html>
    `);
    doc.close();
}

function injectSocialBar() {
    const s = document.createElement('script');
    s.src = ADS_CONFIG.SOCIAL_BAR_URL;
    s.async = true;
    s.type = 'text/javascript';
    document.body.appendChild(s);
}

function renderWatchHero() {
    const heroContainer = document.querySelector('.watch-earn-hero');
    const isYT = PROMO_CONFIG.youtubeVideoId && PROMO_CONFIG.youtubeVideoId !== "";
    const title = isYT ? "Watch Premium Stream" : "View Partner Offer";
    const sub = isYT ? "WATCH 30s • HIGH PRIORITY" : "VISIT SITE • LIMITED TIME";
    const icon = isYT ? "fa-brands fa-youtube" : "fa-solid fa-globe";

    if(heroContainer) {
        heroContainer.innerHTML = `
        <div class="we-card-inner">
            <div class="play-icon-box"><i class="${icon}"></i></div>
            <div class="we-content">
                <h4>${title}</h4>
                <p>${sub}</p>
                <div class="progress-bar-container hidden" id="ad-progress-container">
                    <div class="progress-bar" id="ad-progress-bar"></div>
                </div>
            </div>
            <div class="reward-pill" onclick="startWatchTask(this)">
                +${PROMO_CONFIG.reward} <i class="fa-solid fa-coins"></i>
            </div>
        </div>`;
    }
}

// --- LOGIC 1: SMARTLINK TASKS (DISAPPEAR ON COMPLETE) ---
window.handleSmartLinkTask = function(taskId, reward, btn) {
    // 1. Rotate Links
    const links = [PROMO_CONFIG.adsterraDirectLink, PROMO_CONFIG.popunderLink];
    const targetLink = links[Math.floor(Math.random() * links.length)];
    
    window.open(targetLink, '_blank');

    btn.innerText = "VERIFYING...";
    btn.disabled = true;

    // 2. Wait 10 Seconds then Reward
    setTimeout(() => {
        if(window.addCoins) window.addCoins(reward);
        
        Swal.fire({
            icon: 'success', title: `+${reward} Coins`,
            text: 'Task Completed!',
            background: '#020617', color: '#fff'
        });

        // 3. Remove Card from Screen (No LocalStorage save)
        const card = btn.closest('.task-card');
        if(card) {
            card.style.transition = "opacity 0.5s";
            card.style.opacity = "0";
            setTimeout(() => card.remove(), 500);
        }
    }, 10000); // 10 seconds wait
};


// --- LOGIC 2: FIXED TELEGRAM VERIFICATION ---
window.handleTelegramVerify = async function(taskId, channelId, url, reward, btn, isBotAdmin) {
    // 1. Open Channel
    window.open(url, '_blank');

    btn.innerText = "VERIFYING...";
    btn.disabled = true;
    btn.style.background = "#475569";

    // 5 Seconds Delay
    setTimeout(async () => {
        // CASE A: Bot IS Admin (Strict Check)
        if (isBotAdmin) {
            try {
                if(!window.currentUser || !window.currentUser.id) {
                    if(location.hostname === "localhost") { completeTask(taskId, reward, btn); return; }
                    throw new Error("Login required");
                }

                const response = await fetch('/api/verify-channel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: window.currentUser.id, channel_id: channelId })
                });
                const result = await response.json();

                if (result.status === 'joined') {
                    completeTask(taskId, reward, btn);
                } else {
                    btn.innerText = "JOIN";
                    btn.disabled = false;
                    btn.style.background = "#ef4444";
                    Swal.fire({ icon: 'error', title: 'Not Joined!', text: 'Please join the channel first.', background: '#020617', color: '#fff' });
                }
            } catch (e) {
                // Fallback if API fails
                completeTask(taskId, reward, btn);
            }
        } 
        // CASE B: Bot NOT Admin (Auto Verify / Time Based)
        else {
            completeTask(taskId, reward, btn);
        }
    }, 5000);
};


// --- LOGIC 3: TIME-BASED TASKS (Instagram, Links) ---
window.handleTimeBasedTask = function(taskId, url, reward, btn) {
    const start = Date.now();
    window.open(url, '_blank');

    btn.innerText = "CHECKING...";
    btn.disabled = true;

    const checkReturn = () => {
        if (document.visibilityState === 'visible') {
            const elapsed = Date.now() - start;
            if (elapsed > 8000) { 
                completeTask(taskId, reward, btn);
            } else {
                Swal.fire({ icon: 'warning', title: 'Too Fast!', text: 'View for 8 seconds.', background: '#020617', color: '#fff' });
                btn.innerText = "OPEN";
                btn.disabled = false;
            }
            document.removeEventListener('visibilitychange', checkReturn);
        }
    };
    document.addEventListener('visibilitychange', checkReturn);
};


// --- LOGIC 4: WATCH STREAM ---
window.startWatchTask = function(btn) {
    const isYT = PROMO_CONFIG.youtubeVideoId && PROMO_CONFIG.youtubeVideoId !== "";
    const pContainer = document.getElementById('ad-progress-container');
    const pBar = document.getElementById('ad-progress-bar');
    
    if(!pContainer) return;

    if (isYT) {
        window.open(`https://www.youtube.com/watch?v=${PROMO_CONFIG.youtubeVideoId}`, '_blank');
    } else {
        window.open(PROMO_CONFIG.adsterraDirectLink, '_blank');
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> CHECKING...';
    pContainer.classList.remove('hidden');
    pBar.style.width = "0%";

    let width = 0;
    const interval = setInterval(() => {
        width += 100 / 30;
        pBar.style.width = width + "%";
        if (width >= 100) {
            clearInterval(interval);
            finishWatchTask(btn);
        }
    }, 1000);
};

function finishWatchTask(btn) {
    if(window.addCoins) window.addCoins(PROMO_CONFIG.reward);
    document.getElementById('ad-progress-container').classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = 'CLAIMED';
    Swal.fire({ icon: 'success', title: 'Reward Claimed!', background: '#020617', color: '#fff' });
    setTimeout(() => { btn.innerHTML = 'WATCH AGAIN'; btn.disabled = false; }, 10000); 
}

// --- HELPER: SAVE COMPLETION ---
function completeTask(taskId, reward, btn) {
    if(window.addCoins) window.addCoins(reward);
    
    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');
    if(!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(completedTasks));
    }

    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.className = "btn-join completed"; 
    btn.closest('.task-card').classList.add('completed-task');
    
    Swal.fire({
        icon: 'success', title: `+${reward} Coins`,
        toast: true, position: 'top', timer: 2000,
        showConfirmButton: false, background: '#020617', color: '#fff'
    });
}

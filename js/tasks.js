/* js/tasks.js - LINKED TO MAIN WALLET */

const TASKS_CACHE_KEY = 'fingamepro_tasks_v4';
const AD_REWARD = 500;

const telegramChannels = [
    { id: 'tg_english_room', name: 'The English Room', url: 'https://t.me/The_EnglishRoom5', reward: 1000 },
    { id: 'tg_grammar_shots', name: 'Grammar Shots', url: 'https://t.me/English_Speaking_Grammar_Shots', reward: 1000 },
    { id: 'tg_upsc_notes', name: 'UPSC Notes Official', url: 'https://t.me/UPSC_Notes_Official', reward: 1000 },
    { id: 'tg_upsc_quiz', name: 'UPSC Quiz Vault', url: 'https://t.me/UPSC_Quiz_Vault', reward: 1000 },
    { id: 'tg_ias_prep', name: 'IAS Prep Quiz Zone', url: 'https://t.me/IAS_PrepQuiz_Zone', reward: 1000 },
    { id: 'tg_tourism', name: 'Ministry of Tourism', url: 'https://t.me/MinistryOfTourism', reward: 1000 },
    { id: 'tg_finance', name: 'Personal Finance', url: 'https://t.me/PersonalFinanceWithShiv', reward: 1000 },
    { id: 'tg_schemes', name: 'Govt Schemes India', url: 'https://t.me/GovernmentSchemesIndia', reward: 1000 }
];

const nativeAds = [
    {
        title: "Exclusive: Trading Bonus",
        desc: "Sign up & Claim $50 Credit",
        url: "https://www.binance.com/en",
        icon: "fa-solid fa-chart-line",
        cta: "CLAIM"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderTasks, 300);
});

function renderTasks() {
    const listContainer = document.getElementById('telegram-tasks-list');
    if(!listContainer) return;
    listContainer.innerHTML = ''; 

    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');

    telegramChannels.forEach((channel, index) => {
        const isDone = completedTasks.includes(channel.id);
        
        const card = document.createElement('div');
        card.className = `task-card ${isDone ? 'completed-task' : ''}`;
        
        card.innerHTML = `
            <div class="task-icon"><i class="fa-brands fa-telegram tg-blue"></i></div>
            <div class="task-info">
                <h4>${channel.name}</h4>
                <div class="reward-badge"><i class="fa-solid fa-coins"></i> +${channel.reward}</div>
            </div>
            <button class="btn-join" onclick="handleTaskJoin('${channel.id}', '${channel.url}', ${channel.reward}, this)">
                ${isDone ? '<i class="fa-solid fa-check"></i>' : 'JOIN'}
            </button>
        `;
        listContainer.appendChild(card);

        if (index === 4) {
            const adData = nativeAds[0];
            const adCard = document.createElement('div');
            adCard.className = 'native-ad-card';
            adCard.onclick = () => window.open(adData.url, '_blank');
            adCard.innerHTML = `
                <div class="ad-badge">SPONSORED</div>
                <div class="ad-icon-box"><i class="${adData.icon}"></i></div>
                <div class="ad-content">
                    <h4>${adData.title}</h4>
                    <p>${adData.desc}</p>
                </div>
                <div class="ad-action-btn">${adData.cta} <i class="fa-solid fa-arrow-right"></i></div>
            `;
            listContainer.appendChild(adCard);
        }
    });
}

window.handleTaskJoin = function(id, url, reward, btn) {
    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');
    if(completedTasks.includes(id)) return;

    window.open(url, '_blank');

    btn.innerText = "CHECKING...";
    btn.style.background = "#475569";
    btn.disabled = true;
    
    setTimeout(() => {
        // 🔥 GLOBAL ADD COINS CALL
        if(window.addCoins) window.addCoins(reward);
        
        completedTasks.push(id);
        localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(completedTasks));
        
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.background = "#22c55e";
        btn.closest('.task-card').classList.add('completed-task');
        
        Swal.fire({
            icon: 'success', title: `+${reward} Coins`,
            toast: true, position: 'top', timer: 2000,
            showConfirmButton: false, background: '#020617', color: '#fff'
        });
    }, 5000);
};

window.startWatchTask = function(btn) {
    const pContainer = document.getElementById('ad-progress-container');
    const pBar = document.getElementById('ad-progress-bar');
    if(!pContainer) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> WATCHING...';
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
    if(window.addCoins) window.addCoins(AD_REWARD);
    
    document.getElementById('ad-progress-container').classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = 'CLAIMED';
    
    Swal.fire({
        icon: 'success', title: 'Reward Claimed!',
        background: '#020617', color: '#fff'
    });
    setTimeout(() => { btn.innerHTML = 'WATCH AGAIN'; }, 5000);
}


/* js/tasks.js - Metaverse Task Engine */

// --- CONFIGURATION ---
const TASKS_CACHE_KEY = 'fingamepro_tasks_v3';
const AD_REWARD = 500;

// --- TASK DATABASE (Updated Channel List) ---
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 0.5s delay for loading animation effect
    setTimeout(renderTasks, 500);
});

// --- RENDER TASKS (Dynamic Card Generation) ---
function renderTasks() {
    const listContainer = document.getElementById('telegram-tasks-list');
    if(!listContainer) return;

    listContainer.innerHTML = ''; // Clear loading spinner

    // Load Completed Tasks from LocalStorage
    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');

    telegramChannels.forEach((channel, index) => {
        const isDone = completedTasks.includes(channel.id);
        
        // CREATE CARD HTML
        const card = document.createElement('div');
        // Add classes for styling and animation
        card.className = `task-card ${isDone ? 'completed-task' : ''}`;
        
        // Stagger Animation (Cascading Effect via CSS delay)
        card.style.animationDelay = `${index * 0.1}s`;

        // Card Content Structure matches CSS
        card.innerHTML = `
            <div class="task-icon bg-blue">
                <i class="fa-brands fa-telegram"></i>
            </div>
            <div class="task-info">
                <h4>${channel.name}</h4>
                <div class="coin-tag">
                    <i class="fa-solid fa-coins"></i> +${channel.reward}
                </div>
            </div>
            <button class="btn-task-action" onclick="handleTaskJoin('${channel.id}', '${channel.url}', ${channel.reward}, this)">
                ${isDone ? '<i class="fa-solid fa-check"></i>' : 'JOIN'}
            </button>
        `;
        
        listContainer.appendChild(card);
    });
}

// --- HANDLE TASK CLICK (Join & Verify) ---
window.handleTaskJoin = function(id, url, reward, btn) {
    const completedTasks = JSON.parse(localStorage.getItem(TASKS_CACHE_KEY) || '[]');

    if(completedTasks.includes(id)) {
        return; // Already done, do nothing
    }

    // 1. Open Link
    window.open(url, '_blank');

    // 2. Simulate Verification UI (5 seconds)
    btn.innerText = "VERIFYING...";
    btn.style.background = "#475569"; // Slate Grey
    btn.style.boxShadow = "none";
    btn.disabled = true;
    
    setTimeout(() => {
        // 3. Reward User
        addCoins(reward);
        
        // 4. Mark Complete in Storage
        completedTasks.push(id);
        localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(completedTasks));
        
        // 5. Update Button UI
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.background = "#22c55e"; // Green
        btn.style.boxShadow = "0 0 15px rgba(34, 197, 94, 0.4)";
        
        // 6. Update Card Style (Dim it)
        const parentCard = btn.closest('.task-card');
        if(parentCard) parentCard.classList.add('completed-task');
        
        // 7. Success Alert
        Swal.fire({
            icon: 'success',
            title: `+${reward} Coins!`,
            text: 'Task Verified Successfully',
            toast: true, position: 'top', timer: 2000,
            showConfirmButton: false, background: '#020617', color: '#fff'
        });

    }, 5000); // 5 sec delay to simulate "checking"
};

// --- WATCH VIDEO TASK LOGIC ---
window.startWatchTask = function(btn) {
    const progressContainer = document.getElementById('ad-progress-container');
    const progressBar = document.getElementById('ad-progress-bar');
    
    if(!progressContainer) return;

    // 1. UI Changes
    btn.disabled = true;
    // Loading Spinner Icon
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    progressContainer.classList.remove('hidden');
    progressBar.style.width = "0%";

    // 2. Start Progress Animation (30 Seconds)
    let width = 0;
    // Update every 1 second (100% / 30s = 3.33% per sec)
    const interval = setInterval(() => {
        width += 100 / 30; 
        progressBar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            finishWatchTask(btn);
        }
    }, 1000);
};

function finishWatchTask(btn) {
    // Reward Logic
    addCoins(AD_REWARD);
    
    const progressContainer = document.getElementById('ad-progress-container');
    progressContainer.classList.add('hidden');
    
    // Update Button
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> CLAIMED';
    btn.style.background = "#22c55e"; // Green
    
    // Success Alert
    Swal.fire({
        icon: 'success', title: 'Ad Reward Claimed!',
        text: `You got +${AD_REWARD} Coins`,
        background: '#020617', color: '#fff'
    });

    // Reset Button after 5 seconds to allow re-watching (Optional)
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-play"></i> AGAIN';
        btn.style.background = ""; // Reset to default gradient
    }, 5000);
}

// --- SHARED HELPER: ADD COINS ---
function addCoins(amount) {
    let currentBal = parseFloat(localStorage.getItem('local_balance') || "0");
    currentBal += amount;
    localStorage.setItem('local_balance', currentBal);
    
    // Sync with global user object if exists (for other pages)
    if(window.currentUser) window.currentUser.balance = currentBal;
    
    // Update Header UI Balance
    const headerBal = document.getElementById('header-coin-balance');
    if(headerBal) headerBal.innerText = Math.floor(currentBal).toLocaleString();
}


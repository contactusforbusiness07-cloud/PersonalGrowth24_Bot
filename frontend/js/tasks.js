// --- TASK DATA (Configuration) ---
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

document.addEventListener('DOMContentLoaded', () => {
    renderTelegramTasks();
});

// --- RENDER TASKS ---
function renderTelegramTasks() {
    const container = document.getElementById('telegram-tasks-list');
    container.innerHTML = ''; // Clear loading

    // Get claimed tasks from LocalStorage
    const claimedTasks = JSON.parse(localStorage.getItem('claimedTasks')) || [];

    telegramChannels.forEach(channel => {
        const isClaimed = claimedTasks.includes(channel.id);
        
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-icon bg-telegram"><i class="fa-brands fa-telegram"></i></div>
            <div class="task-info">
                <h4>${channel.name}</h4>
                <span class="coin-tag"><i class="fa-solid fa-coins"></i> +${channel.reward}</span>
            </div>
            <button class="btn-task-action ${isClaimed ? 'claimed' : ''}" 
                id="btn-${channel.id}" 
                onclick="handleTaskClick('${channel.id}', '${channel.url}', ${channel.reward})">
                ${isClaimed ? '<i class="fa-solid fa-check"></i> Joined' : 'Join'}
            </button>
        `;
        container.appendChild(card);
    });
}

// --- HANDLE TASK CLICK (Join -> Verify -> Claim) ---
function handleTaskClick(taskId, url, reward) {
    const btn = document.getElementById(`btn-${taskId}`);
    
    // Prevent double clicking
    if (btn.classList.contains('claimed') || btn.classList.contains('verifying')) return;

    // 1. Open Link
    window.open(url, '_blank');

    // 2. Change UI to "Verifying"
    btn.innerText = 'Verifying...';
    btn.classList.add('verifying');

    // 3. Simulate Verification (5 Seconds)
    setTimeout(() => {
        // Success Logic
        completeTask(taskId, reward, btn);
    }, 5000); 
}

// --- COMPLETE TASK LOGIC ---
function completeTask(taskId, reward, btnElement) {
    // 1. Update UI
    btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Joined';
    btnElement.classList.remove('verifying');
    btnElement.classList.add('claimed');

    // 2. Save to LocalStorage (Persistence)
    let claimedTasks = JSON.parse(localStorage.getItem('claimedTasks')) || [];
    if (!claimedTasks.includes(taskId)) {
        claimedTasks.push(taskId);
        localStorage.setItem('claimedTasks', JSON.stringify(claimedTasks));

        // 3. Add Coins (Dummy Update - Replace with Firebase later)
        updateBalance(reward);
        
        // 4. Show Success Popup
        Swal.fire({
            icon: 'success',
            title: `+${reward} Coins`,
            text: 'Task Verified Successfully!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            background: '#1e293b',
            color: '#fff'
        });
    }
}

// --- WATCH & EARN LOGIC ---
function startWatchTask(btn) {
    const progressBar = document.getElementById('ad-progress-bar');
    const container = document.getElementById('ad-progress-container');
    
    // Disable Button
    btn.disabled = true;
    btn.innerText = 'Watching...';
    container.classList.remove('hidden');

    // Start Progress (Simulate 30s)
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        // Task Complete
        updateBalance(500);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Claimed';
        btn.classList.add('claimed');
        Swal.fire({ title: 'Ad Watched!', text: 'You earned 500 Coins', icon: 'success', background: '#0f172a', color: '#fff' });
    }, 30000); // 30 Seconds real timer
}

// --- HELPER TO UPDATE GLOBAL BALANCE ---
function updateBalance(amount) {
    // This is temporary until we link Firebase
    let currentBal = parseInt(document.getElementById('header-coin-balance').innerText);
    let newBal = currentBal + amount;
    document.getElementById('header-coin-balance').innerText = newBal;
    document.getElementById('home-balance-display').innerText = newBal;
    
    // Save locally for now
    localStorage.setItem('userBalance', newBal);
}

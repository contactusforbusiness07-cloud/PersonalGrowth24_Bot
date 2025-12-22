/* js/tasks.js - SECURE METAVERSE TASK ENGINE (FIREBASE CONNECTED) */

import { db, auth, doc, getDoc, updateDoc, arrayUnion, increment, onAuthStateChanged } from './firebase-init.js';

// --- CONFIGURATION ---
const AD_REWARD = 500;
let currentUser = null; // Stores Firebase User
let userDocRef = null;  // Reference to Database Document

// --- TASK DATABASE ---
const telegramChannels = [
    { id: 'tg_english_room', name: 'The English Room', url: 'https://t.me/The_EnglishRoom5', reward: 1000 },
    { id: 'tg_grammar_shots', name: 'Grammar Shots', url: 'https://t.me/English_Speaking_Grammar_Shots', reward: 1000 },
    { id: 'tg_upsc_notes', name: 'UPSC Notes Official', url: 'https://t.me/UPSC_Notes_Official', reward: 1000 },
    { id: 'tg_upsc_quiz', name: 'UPSC Quiz Vault', url: 'https://t.me/UPSC_Quiz_Vault', reward: 1000 },
    { id: 'tg_ias_prep', name: 'IAS Prep Quiz Zone', url: 'https://t.me/IAS_PrepQuiz_Zone', reward: 1000 },
    // Ad Injection Point
    { id: 'tg_tourism', name: 'Ministry of Tourism', url: 'https://t.me/MinistryOfTourism', reward: 1000 },
    { id: 'tg_finance', name: 'Personal Finance', url: 'https://t.me/PersonalFinanceWithShiv', reward: 1000 },
    { id: 'tg_schemes', name: 'Govt Schemes India', url: 'https://t.me/GovernmentSchemesIndia', reward: 1000 }
];

const nativeAds = [
    { title: "Exclusive: Trading Bonus", desc: "Sign up & Claim $50 Credit", url: "https://www.binance.com/en", icon: "fa-solid fa-chart-line", cta: "CLAIM" }
];

// --- INITIALIZATION (Auth Check) ---
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase Auth to identify user
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            userDocRef = doc(db, "users", user.uid);
            console.log("Secure Task Engine: User Connected ✅");
            loadUserDataAndRender();
        } else {
            console.log("Secure Task Engine: No User ❌");
            // Show Login Prompt or Redirect
            document.getElementById('telegram-tasks-list').innerHTML = '<div class="loading-spinner">PLEASE LOGIN TO VIEW TASKS</div>';
        }
    });
});

// --- LOAD DATA FROM FIRESTORE ---
async function loadUserDataAndRender() {
    try {
        const docSnap = await getDoc(userDocRef);
        
        let completedTasks = [];
        if (docSnap.exists()) {
            const data = docSnap.data();
            completedTasks = data.completed_tasks || [];
        }

        renderTasks(completedTasks);

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// --- RENDER UI ---
function renderTasks(completedTasks) {
    const listContainer = document.getElementById('telegram-tasks-list');
    if(!listContainer) return;
    listContainer.innerHTML = ''; 

    telegramChannels.forEach((channel, index) => {
        const isDone = completedTasks.includes(channel.id);
        
        // 1. Create Task Card
        const card = document.createElement('div');
        card.className = `task-card ${isDone ? 'completed-task' : ''}`;
        card.style.animation = `floatHero 0.5s ease-out backwards ${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="task-icon">
                <i class="fa-brands fa-telegram tg-blue"></i>
            </div>
            <div class="task-info">
                <h4>${channel.name}</h4>
                <div class="reward-badge"><i class="fa-solid fa-coins"></i> +${channel.reward}</div>
            </div>
            <button class="btn-join" id="btn-${channel.id}" onclick="handleSecureJoin('${channel.id}', '${channel.url}', ${channel.reward})">
                ${isDone ? '<i class="fa-solid fa-check"></i>' : 'JOIN'}
            </button>
        `;
        listContainer.appendChild(card);

        // 2. Inject Native Ad
        if (index === 4) {
            const adData = nativeAds[0];
            const adCard = document.createElement('div');
            adCard.className = 'native-ad-card';
            adCard.onclick = () => window.open(adData.url, '_blank');
            adCard.innerHTML = `
                <div class="ad-badge">SPONSORED</div>
                <div class="ad-icon-box"><i class="${adData.icon}"></i></div>
                <div class="ad-content"><h4>${adData.title}</h4><p>${adData.desc}</p></div>
                <div class="ad-action-btn">${adData.cta} <i class="fa-solid fa-arrow-right"></i></div>
            `;
            listContainer.appendChild(adCard);
        }
    });
}

// --- SECURE TASK HANDLING (The Main logic) ---
window.handleSecureJoin = async function(taskId, url, reward) {
    if (!currentUser) {
        Swal.fire({ icon: 'error', title: 'Login Required', background: '#020617', color: '#fff' });
        return;
    }

    const btn = document.getElementById(`btn-${taskId}`);
    
    // 1. UI Feedback
    window.open(url, '_blank');
    btn.innerText = "VERIFYING...";
    btn.style.background = "#475569";
    btn.disabled = true;

    // 2. Simulate Verification Delay (Psychology)
    setTimeout(async () => {
        try {
            // 3. SECURE WRITE TO FIRESTORE
            // Hum directly balance edit nahi kar rahe, hum DB ko instruct kar rahe hain
            await updateDoc(userDocRef, {
                balance: increment(reward),
                completed_tasks: arrayUnion(taskId)
            });

            // 4. Update Local UI (Success)
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = "#22c55e";
            btn.closest('.task-card').classList.add('completed-task');

            // Update Header Balance locally for instant feedback
            updateHeaderBalance(reward);

            Swal.fire({
                icon: 'success', title: `+${reward} Coins Mined!`,
                toast: true, position: 'top', timer: 2000,
                showConfirmButton: false, background: '#020617', color: '#fff'
            });

        } catch (error) {
            console.error("Transaction Failed:", error);
            btn.innerText = "RETRY";
            btn.disabled = false;
            btn.style.background = "#ef4444";
        }
    }, 5000); 
};

// --- SECURE WATCH AD LOGIC ---
window.startWatchTask = function(btn) {
    if (!currentUser) return;

    const pContainer = document.getElementById('ad-progress-container');
    const pBar = document.getElementById('ad-progress-bar');
    
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
            finishSecureWatch(btn);
        }
    }, 1000);
};

async function finishSecureWatch(btn) {
    try {
        // Secure Update
        await updateDoc(userDocRef, {
            balance: increment(AD_REWARD)
        });

        updateHeaderBalance(AD_REWARD);
        
        document.getElementById('ad-progress-container').classList.add('hidden');
        btn.disabled = false;
        btn.innerHTML = 'CLAIMED';
        
        Swal.fire({ icon: 'success', title: `+${AD_REWARD} Coins`, background: '#020617', color: '#fff' });

        setTimeout(() => { btn.innerHTML = 'WATCH AGAIN'; }, 5000);

    } catch (e) {
        console.error("Ad Reward Failed", e);
    }
}

// --- HELPER TO UPDATE UI HEADER ---
function updateHeaderBalance(amountToAdd) {
    const headerBal = document.getElementById('header-coin-balance');
    let current = parseInt(headerBal.innerText.replace(/,/g, '')) || 0;
    headerBal.innerText = (current + amountToAdd).toLocaleString();
}


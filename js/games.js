// --- GAMES CONFIG & ADSTERRA SMARTLINK ---

// ✅ CLEAN NO-AD GAME LINKS (Open Source)
const GAME_URLS = {
    'subway': 'https://iamkun.github.io/tower_game/', 
    'temple': 'https://hextris.github.io/hextris/',
    '2048': 'https://gabrielecirulli.github.io/2048/',
    'candy': 'https://mumuki.io/pacman/',
    'fruit': 'https://nebezb.com/floppybird/',
    'ludo': 'https://winterdust.github.io/web-t-rex/'
};

// 🔥 YOUR ADSTERRA SMARTLINK
const ADSTERRA_DIRECT_LINK = "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a"; 

let gameTimerInterval;
let timeLeft = 30;
let currentReward = 0;

// --- LAUNCH GAME ---
window.launchGame = function(gameKey, reward) {
    const url = GAME_URLS[gameKey];
    if (!url) return;

    // 💰 Open Smartlink
    if(ADSTERRA_DIRECT_LINK) {
        window.open(ADSTERRA_DIRECT_LINK, '_blank');
    }

    // Show Modal
    document.getElementById('game-modal').classList.remove('hidden');
    document.getElementById('game-loader').style.display = 'block';
    
    // Load Game
    const iframe = document.getElementById('game-frame');
    iframe.src = url;

    // Start Timer
    currentReward = reward;
    timeLeft = 30;
    document.getElementById('game-timer').innerText = timeLeft;
    startTimer();
}

// --- TIMER ---
function startTimer() {
    clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
        timeLeft--;
        const timerDisplay = document.getElementById('game-timer');
        if(timerDisplay) timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameTimerInterval);
            if(timerDisplay) {
                timerDisplay.innerHTML = "✅ CLAIM";
                timerDisplay.style.color = "#00ff88";
            }
        }
    }, 1000);
}

window.onGameLoad = function() {
    setTimeout(() => {
        document.getElementById('game-loader').style.display = 'none';
    }, 1500);
}

window.closeGame = function() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('game-frame').src = "about:blank";
    clearInterval(gameTimerInterval);

    if (timeLeft <= 0) {
        Swal.fire({
            title: 'Reward Unlocked!',
            text: `You earned +${currentReward} Coins!`,
            icon: 'success',
            background: '#020617', color: '#fff',
            confirmButtonColor: '#ffd700'
        });
    } else {
        Swal.fire({
            toast: true, position: 'top', icon: 'warning', 
            title: `Play ${timeLeft}s more!`,
            background: '#331100', color: '#fff', 
            showConfirmButton: false, timer: 2000
        });
    }
}


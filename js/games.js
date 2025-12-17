// --- GAME CONFIGURATION ---
const gamesLib = {
    'subway': 'https://html5.gamedistribution.com/rvvASMiM/index.html', // Subway Surfers Clone
    'temple': 'https://html5.gamedistribution.com/6817/index.html', // Temple Run Clone
    'stickman': 'https://html5.gamedistribution.com/5d2d480922834b6e9273574221c54848/index.html',
    'drive': 'https://html5.gamedistribution.com/0c2b2913508a467f814d48512406606a/index.html',
    'moto': 'https://html5.gamedistribution.com/34825/index.html',
    'ludo': 'https://html5.gamedistribution.com/8d998127387e49c7943d630d8800994f/index.html'
};

let gameTimerInterval;
let secondsPlayed = 0;
let currentGameReward = 0;

// --- LAUNCH GAME ---
function launchGame(gameId, reward) {
    const url = gamesLib[gameId];
    if(!url) return alert('Game loading...');

    currentGameReward = reward;
    
    // 1. Show Loading Ad First (Simulation)
    Swal.fire({
        title: 'Loading Game 🎮',
        text: 'Optimizing graphics...',
        timer: 2000,
        timerProgressBar: true,
        background: '#0f172a',
        color: '#fff',
        showConfirmButton: false,
        willClose: () => {
            openGameModal(url);
        }
    });
}

// --- OPEN PLAYER MODAL ---
function openGameModal(url) {
    const modal = document.getElementById('game-modal');
    const iframe = document.getElementById('game-frame');
    
    // Set Game URL
    iframe.src = url;
    modal.classList.remove('hidden');

    // Start Timer
    startPlayTimer();
}

// --- TIMER LOGIC ---
function startPlayTimer() {
    secondsPlayed = 0;
    const timerDisplay = document.getElementById('game-timer');
    timerDisplay.innerText = "15"; // Reset text
    
    clearInterval(gameTimerInterval);
    
    gameTimerInterval = setInterval(() => {
        secondsPlayed++;
        let remaining = 15 - secondsPlayed;
        
        if(remaining > 0) {
            timerDisplay.innerText = remaining;
        } else {
            timerDisplay.innerText = "✅";
            // Timer logic ends visually, but we keep tracking time if needed
        }
    }, 1000);
}

// --- CLOSE GAME & CHECK REWARD ---
function closeGame() {
    const modal = document.getElementById('game-modal');
    const iframe = document.getElementById('game-frame');
    
    // Stop Game
    iframe.src = ""; // Clear src to stop audio
    modal.classList.add('hidden');
    clearInterval(gameTimerInterval);

    // Check Verification
    if (secondsPlayed >= 15) {
        // Success
        updateBalance(currentGameReward);
        Swal.fire({
            icon: 'success',
            title: `+${currentGameReward} Coins`,
            text: 'Game Session Complete!',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#10b981'
        });
    } else {
        // Failed
        Swal.fire({
            icon: 'warning',
            title: 'No Coins Earned',
            text: 'You must play for at least 15 seconds to earn reward.',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#ef4444'
        });
    }
}

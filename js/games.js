/* =========================================
   GAMES MODULE - CORE LOGIC
   ========================================= */

// Game State
let currentEnergy = 1000;
let maxEnergy = 1000;
let miningBalance = 0; // Local display balance
let tapValue = 1; // Coins per tap
let energyRegenRate = 3; // Energy per second
let isBanned = false;
let lastTapTime = 0;
let tapCountRapid = 0;

// Power Ups State
let boostersLeft = 9;
let refillsLeft = 9;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    // UI Updates
    updateEnergyUI();
    updateBalanceUI();
    
    // Start Energy Regen Loop
    setInterval(() => {
        if (!isBanned && currentEnergy < maxEnergy) {
            currentEnergy = Math.min(currentEnergy + energyRegenRate, maxEnergy);
            updateEnergyUI();
        }
    }, 1000);

    // Coin Click Listener
    const coinBtn = document.getElementById('tap-coin');
    if(coinBtn) {
        coinBtn.addEventListener('mousedown', handleTap); // Desktop
        coinBtn.addEventListener('touchstart', handleTap, {passive: false}); // Mobile
    }

    // Init Badges
    document.getElementById('btn-booster-badge').innerText = `${boostersLeft}/9`;
    document.getElementById('btn-refill-badge').innerText = `${refillsLeft}/9`;
}

// --- TAP LOGIC ---
function handleTap(e) {
    if (e.type === 'touchstart') e.preventDefault(); // Zoom rokne ke liye
    if (isBanned) return;

    // Check Energy
    if (currentEnergy < tapValue) {
        // Haptic Feedback for error
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
        return;
    }

    // --- ANTI-CHEAT / BAN LOGIC ---
    const now = Date.now();
    if (now - lastTapTime < 60) { // < 60ms is inhumanly fast
        tapCountRapid++;
    } else {
        tapCountRapid = Math.max(0, tapCountRapid - 1);
    }
    lastTapTime = now;

    if (tapCountRapid > 15) { // Threshold reached
        triggerSecurityProtocol();
        return;
    }

    // Update State
    currentEnergy -= tapValue;
    miningBalance += tapValue;
    
    // UI Updates
    updateEnergyUI();
    updateBalanceUI();
    
    // Visual Effects
    showClickEffect(e);
    animateCoin();

    // Haptic Feedback (Success)
    if(window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
}

// --- UI UPDATES ---
function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    const text = document.getElementById('energy-text');
    
    if(fill && text) {
        const pct = (currentEnergy / maxEnergy) * 100;
        fill.style.width = `${pct}%`;
        text.innerText = `${Math.floor(currentEnergy)} / ${maxEnergy}`;
    }
}

function updateBalanceUI() {
    const disp = document.getElementById('display-balance');
    if(disp) {
        // Animation for numbers
        disp.innerText = miningBalance.toLocaleString();
    }
}

// --- VISUAL EFFECTS ---
function showClickEffect(e) {
    const layer = document.getElementById('click-effects-layer');
    if(!layer) return;

    // Coordinates calculation (Touch vs Mouse)
    let x, y;
    if (e.type === 'touchstart') {
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
    } else {
        x = e.offsetX;
        y = e.offsetY;
    }

    // Create Element
    const floatNum = document.createElement('div');
    floatNum.className = 'click-feedback';
    floatNum.innerText = `+${tapValue}`;
    floatNum.style.left = `${x}px`;
    floatNum.style.top = `${y}px`;

    layer.appendChild(floatNum);

    // Remove after animation
    setTimeout(() => {
        floatNum.remove();
    }, 1000);
}

function animateCoin() {
    const coin = document.getElementById('tap-coin');
    // CSS :active handle karta hai scale, par JS se tilt effect daal sakte hain future me
    // Currently using CSS scaling
}

// --- UPDATED: PROFESSIONAL SECURITY WARNING ---
function triggerSecurityProtocol() {
    isBanned = true;
    const banTime = 10; // 10 Seconds temporary block

    // Professional SweetAlert
    Swal.fire({
        title: '⚠️ SECURITY PROTOCOL ENGAGED',
        html: `
            <div style="text-align: left; font-family: 'Orbitron', sans-serif;">
                <p style="color: #ef4444; font-size: 14px; margin-bottom: 10px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> 
                    <strong>ABNORMAL ACTIVITY DETECTED</strong>
                </p>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    System detected irregular tapping patterns consistent with automated scripts. 
                    Mining is temporarily suspended to protect the economy.
                </p>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
                <p style="color: #fff; font-size: 14px; text-align: center;">
                    System Cooldown: <br>
                    <span id="ban-timer-disp" style="color: #ffd700; font-size: 24px; font-weight: bold;">00:10</span>
                </p>
            </div>
        `,
        icon: 'error',
        background: '#0f172a',
        color: '#fff',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            popup: 'glass-panel-tech'
        },
        didOpen: () => {
            // Internal timer for the popup
            let timeLeft = banTime;
            const timerInterval = setInterval(() => {
                timeLeft--;
                const disp = document.getElementById('ban-timer-disp');
                if(disp) disp.innerText = `00:0${timeLeft}`;
                
                if(timeLeft <= 0) {
                    clearInterval(timerInterval);
                    Swal.close();
                    isBanned = false;
                    tapCountRapid = 0; // Reset counter
                    
                    // Success Toast
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        background: '#0f172a',
                        color: '#fff'
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'System Restored'
                    });
                }
            }, 1000);
        }
    });
}

// --- BOOSTER & REFILL ACTIONS ---
window.activatePower = function(type) {
    if (type === 'refill') {
        if (refillsLeft > 0) {
            currentEnergy = maxEnergy;
            refillsLeft--;
            document.getElementById('btn-refill-badge').innerText = `${refillsLeft}/9`;
            updateEnergyUI();
            
            Swal.fire({
                icon: 'success',
                title: 'Energy Restored',
                text: 'System battery recharged to 100%',
                background: '#020617',
                color: '#fff',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Reached',
                text: 'Daily refills exhausted.',
                background: '#020617',
                color: '#fff'
            });
        }
    }
    
    if (type === 'booster') {
        if (boostersLeft > 0) {
            tapValue = tapValue * 2; // Double tap power
            boostersLeft--;
            document.getElementById('btn-booster-badge').innerText = `${boostersLeft}/9`;
            
            Swal.fire({
                icon: 'info',
                title: 'Turbo Mode Active',
                text: '2x Mining Speed for 30s',
                background: '#020617',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });

            // Reset after 30 sec
            setTimeout(() => {
                tapValue = 1; 
                // Optional: Toast to say ended
            }, 30000);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Reached',
                text: 'Daily boosters exhausted.',
                background: '#020617',
                color: '#fff'
            });
        }
    }
}

// Helper to close iframe modal (if used elsewhere)
window.closeGame = function() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('game-frame').src = '';
}

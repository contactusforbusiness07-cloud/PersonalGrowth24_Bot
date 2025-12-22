/* js/wallet.js - A.E.G.I.S. CORE LOGIC */

// --- CONFIGURATION ---
// Native Ads styled as "System Protocols"
const SYSTEM_PROTOCOLS = [
    {
        id: "OPT-992",
        title: "NEURAL NETWORK OPTIMIZER",
        desc: "Enhance mining efficiency by 15%.",
        icon: "fa-solid fa-microchip",
        url: "https://google.com", // Replace with Ad Link
        tag: "RECOMMENDED"
    },
    {
        id: "SEC-BETA",
        title: "QUANTUM SECURITY PATCH",
        desc: "Claim 5,000 Power Unit allocation.",
        icon: "fa-solid fa-shield-halved",
        url: "https://binance.com", // Replace with Ad Link
        tag: "PRIORITY"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // The wallet section is hidden by default in index.html. 
    // We hook into the navigation click to trigger the boot sequence.
    const walletNavBtn = document.querySelector('.bottom-nav .nav-item:nth-child(5)'); // Assuming Wallet is 5th item
    if(walletNavBtn) {
        walletNavBtn.addEventListener('click', triggerBootSequence);
    }
    
    // Also trigger if directly navigated (optional, depending on app flow)
    if(!document.getElementById('wallet').classList.contains('hidden')) {
         triggerBootSequence();
    }
});

let bootComplete = false;

function triggerBootSequence() {
    if(bootComplete) return; // Don't reboot if already loaded

    const bootOverlay = document.getElementById('boot-sequence');
    const terminal = document.getElementById('boot-terminal-text');
    const loaderFill = document.getElementById('boot-loader-fill');
    
    if(!bootOverlay) return;

    // 1. Reset & Show Overlay
    bootOverlay.classList.remove('hidden');
    loaderFill.style.width = "0%";
    terminal.innerHTML = "";
    
    const bootLog = [
        "> INITIALIZING A.E.G.I.S. KERNEL...",
        "> ESTABLISHING QUANTUM LINK...",
        "> VERIFYING BIOMETRICS... OK.",
        "> LOADING POWER MATRIX...",
        "> SYSTEM READY."
    ];

    // 2. Terminal Typing Effect
    let lineIndex = 0;
    function typeLine() {
        if(lineIndex < bootLog.length) {
            terminal.innerHTML += `<div>${bootLog[lineIndex]}</div>`;
            terminal.scrollTop = terminal.scrollHeight;
            lineIndex++;
            // Random typing speed for realism
            setTimeout(typeLine, Math.random() * 300 + 100); 
        } else {
             // 3. Fill Loading Bar after typing finished
             setTimeout(() => {
                loaderFill.style.width = "100%";
             }, 500);
        }
    }
    typeLine();

    // 4. HIDE BOOT & INITIALIZE CORE after 3.5s total
    setTimeout(() => {
        bootOverlay.classList.add('hidden');
        bootComplete = true;
        initializeCoreSystem();
    }, 3500);
}


function initializeCoreSystem() {
    renderPowerLevel();
    renderClearance();
    injectProtocols();
    startSystemMonitoring();
}

// --- 1. SCI-FI CALCULATION EFFECT ---
function renderPowerLevel() {
    const balStr = localStorage.getItem('local_balance') || "0";
    const targetValue = Math.floor(parseFloat(balStr));
    const powerEl = document.getElementById('core-power-val');
    
    if(!powerEl) return;

    let currentValue = 0;
    const duration = 2000; // 2 seconds calculation
    const steps = 50;
    const increment = targetValue / steps;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if(currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
             // Final stabilize effect
             powerEl.style.textShadow = "0 0 20px var(--aegis-gold)";
             setTimeout(() => { powerEl.style.textShadow = ""; }, 500);
        }
        // Generate random glitch numbers during calculation
        const glitchStr = Math.floor(currentValue).toLocaleString().split('').map(char => {
            return Math.random() > 0.8 && char !== ',' ? Math.floor(Math.random()*9) : char;
        }).join('');
        
        powerEl.innerText = glitchStr;

    }, duration / steps);
}

// --- 2. DETERMINE ACCESS CLEARANCE ---
function renderClearance() {
    const bal = parseFloat(localStorage.getItem('local_balance') || "0");
    const tierEl = document.getElementById('clearance-val');
    
    if(!tierEl) return;

    let clearance = "LEVEL 1 // ROOKIE";
    if(bal > 100000) clearance = "LEVEL 3 // ARCHITECT";
    else if(bal > 10000) clearance = "LEVEL 2 // OPERATOR";

    tierEl.innerText = clearance;
    // Add glitch effect on load
    tierEl.classList.add('glitch-text'); 
}

// --- 3. INJECT NATIVE ADS (Protocols) ---
function injectProtocols() {
    const container = document.getElementById('protocol-feed-container');
    if(!container || container.children.length > 0) return; // Don't double inject

    SYSTEM_PROTOCOLS.forEach(proto => {
        const card = document.createElement('div');
        card.className = 'sys-protocol-card';
        card.onclick = () => window.open(proto.url, '_blank');
        card.innerHTML = `
            <div class="proto-badge">${proto.tag}</div>
            <div style="display:flex; align-items:center;">
                <div class="proto-icon"><i class="${proto.icon}"></i></div>
                <div class="proto-info">
                    <h4>${proto.title}</h4>
                    <p>[${proto.id}] ${proto.desc}</p>
                </div>
            </div>
            <div class="proto-execute">EXECUTE</div>
        `;
        container.appendChild(card);
    });
}

// --- 4. SYSTEM MONITORING (Fake Activity) ---
function startSystemMonitoring() {
    const statusEl = document.getElementById('system-status-val');
    if(!statusEl) return;

    setInterval(() => {
        const states = ["STABLE", "OPTIMIZING", "SYNCING", "STABLE"];
        const randomState = states[Math.floor(Math.random() * states.length)];
        statusEl.innerText = randomState;
        statusEl.style.color = randomState === "SYNCING" ? "var(--aegis-gold)" : "var(--aegis-cyan)";
    }, 4000);
}


// --- 5. VAULT INTERACTION ---
window.handleVaultAccess = function() {
    // Haptic feedback pattern (if supported in Telegram WebApp)
    if(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }

    // Visual shake effect
    const gate = document.querySelector('.vault-gate-container');
    gate.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    setTimeout(() => { gate.style.animation = ''; }, 500);

    // Optional: Add a futuristic sound effect here
}

// Add shake animation to global CSS temporarily for this function
const style = document.createElement('style');
style.innerHTML = `@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`;
document.head.appendChild(style);


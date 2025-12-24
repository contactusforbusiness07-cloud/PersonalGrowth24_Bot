/* js/wallet.js - A.E.G.I.S. CORE (Synced Backend + Popunder Stealth) */

// --- ADS CONFIGURATION ---
const WALLET_ADS = {
    SMARTLINK: "https://www.effectivegatecpm.com/q3zxkem7?key=8dba0d1f9c1ff4fd04c8eec011b1bf87",
    POPUNDER_URL: "//pl28285579.effectivegatecpm.com/07/70/de/0770de70a94afbae9a035a80a0b520ce.js"
};

// --- CONFIGURATION ---
const SYSTEM_PROTOCOLS = [
    {
        id: "OPT-992",
        title: "NEURAL NETWORK OPTIMIZER",
        desc: "Enhance mining efficiency by 15%.",
        icon: "fa-solid fa-microchip",
        url: WALLET_ADS.SMARTLINK, // 🔥 Smartlink for High Earning
        tag: "RECOMMENDED"
    },
    {
        id: "SEC-BETA",
        title: "QUANTUM SECURITY PATCH",
        desc: "Claim 5,000 Power Unit allocation.",
        icon: "fa-solid fa-shield-halved",
        url: WALLET_ADS.SMARTLINK, // 🔥 Smartlink for High Earning
        tag: "PRIORITY"
    }
];

let bootComplete = false;

document.addEventListener('DOMContentLoaded', () => {
    // Hook into nav handled by main.js logic mostly, but we add listener for safety
    const walletNavBtn = document.querySelector('.nav-item:nth-child(5)');
    if(walletNavBtn) walletNavBtn.addEventListener('click', checkAndBoot);
});

function checkAndBoot() {
    if(!bootComplete) triggerBootSequence();
    else refreshWalletData(); // If already booted, just refresh numbers
}

// --- 1. BOOT SEQUENCE (First Time Load) ---
function triggerBootSequence() {
    const bootOverlay = document.getElementById('boot-sequence');
    const terminal = document.getElementById('boot-terminal-text');
    const loaderFill = document.getElementById('boot-loader-fill');
    
    if(!bootOverlay) return;

    bootOverlay.classList.remove('hidden');
    loaderFill.style.width = "0%";
    terminal.innerHTML = "";
    
    const bootLog = [
        "> INITIALIZING A.E.G.I.S. KERNEL...",
        "> ESTABLISHING QUANTUM LINK...",
        "> SYNCING WALLET PROTOCOLS...",
        "> SYSTEM READY."
    ];

    let lineIndex = 0;
    function typeLine() {
        if(lineIndex < bootLog.length) {
            terminal.innerHTML += `<div>${bootLog[lineIndex]}</div>`;
            terminal.scrollTop = terminal.scrollHeight;
            lineIndex++;
            setTimeout(typeLine, 200); 
        } else {
             setTimeout(() => {
                loaderFill.style.width = "100%";
             }, 300);
        }
    }
    typeLine();

    setTimeout(() => {
        bootOverlay.classList.add('hidden');
        bootComplete = true;
        initializeCoreSystem();
    }, 2500);
}

function initializeCoreSystem() {
    refreshWalletData();
    injectProtocols();
    startSystemMonitoring();
    triggerStealthPopunder(); // 🔥 Trigger Hidden Popunder (1/Day)
}

// --- 2. INSTANT UPDATE LOGIC ---
// Ye function main.js se call hota hai jab coins add hote hain
window.updateWalletUI = function(specificBalance) {
    if(!bootComplete) return; 
    
    const bal = specificBalance !== undefined ? specificBalance : parseFloat(localStorage.getItem('local_balance') || "0");
    const powerEl = document.getElementById('core-power-val');
    
    if(powerEl) {
        powerEl.innerText = Math.floor(bal).toLocaleString();
        powerEl.style.textShadow = "0 0 25px var(--aegis-gold)";
        setTimeout(() => { powerEl.style.textShadow = ""; }, 500);
    }
    
    updateClearance(bal);
};

function refreshWalletData() {
    const bal = parseFloat(localStorage.getItem('local_balance') || "0");
    
    // Animate Number Count
    const powerEl = document.getElementById('core-power-val');
    if(powerEl) {
        let start = 0;
        const end = Math.floor(bal);
        
        if(end > 1000) {
            powerEl.innerText = end.toLocaleString(); 
        } else {
            let timer = setInterval(() => {
                start += Math.ceil(end / 20);
                if(start >= end) {
                    start = end;
                    clearInterval(timer);
                }
                powerEl.innerText = start.toLocaleString();
            }, 50);
        }
    }
    updateClearance(bal);
}

function updateClearance(bal) {
    const tierEl = document.getElementById('clearance-val');
    if(!tierEl) return;

    let clearance = "LEVEL 1 // ROOKIE";
    if(bal > 100000) clearance = "LEVEL 3 // ARCHITECT";
    else if(bal > 10000) clearance = "LEVEL 2 // OPERATOR";

    tierEl.innerText = clearance;
}

// --- 3. PROTOCOLS & EXTRAS ---
function injectProtocols() {
    const container = document.getElementById('protocol-feed-container');
    if(!container || container.children.length > 0) return;

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

function startSystemMonitoring() {
    const statusEl = document.getElementById('system-status-val');
    if(!statusEl) return;
    setInterval(() => {
        const states = ["STABLE", "SYNCING", "ENCRYPTED"];
        const randomState = states[Math.floor(Math.random() * states.length)];
        statusEl.innerText = randomState;
        statusEl.style.color = randomState === "SYNCING" ? "var(--aegis-gold)" : "var(--aegis-cyan)";
    }, 4000);
}

window.handleVaultAccess = function() {
    const gate = document.querySelector('.vault-gate-container');
    if(gate) {
        gate.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => { gate.style.animation = ''; }, 500);
    }
}

// 🔥 STEALTH POPUNDER (Hidden Logic - 1 Per Day) 🔥
function triggerStealthPopunder() {
    const today = new Date().toDateString();
    const lastRun = localStorage.getItem('wallet_pop_date');

    // Check Frequency (Only run if not run today)
    if (lastRun !== today) {
        
        // Inject Popunder Script (Invisible to UI, runs in background)
        const s = document.createElement('script');
        s.src = WALLET_ADS.POPUNDER_URL;
        s.type = 'text/javascript';
        s.async = true;
        document.body.appendChild(s);

        // Save Date to prevent spamming
        localStorage.setItem('wallet_pop_date', today);
        console.log("A.E.G.I.S: Background Protocol Activated (1/24h)");
    } else {
        console.log("A.E.G.I.S: Protocol Cooldown Active");
    }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`;
document.head.appendChild(style);

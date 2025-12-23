/* js/home.js - METAVERSE DASHBOARD LOGIC */

document.addEventListener('DOMContentLoaded', () => {
    initHomeSystem();
});

function initHomeSystem() {
    // 1. Initialize Balance
    updateHomeBalance();
    
    // 2. Start Live Sync (Simulate Live Data)
    setInterval(updateHomeBalance, 2000);

    // 3. Init Motivation Ticker
    initTicker();
}

// --- VISUAL: LIVE BALANCE SYNC ---
function updateHomeBalance() {
    const bal = parseFloat(localStorage.getItem('local_balance') || "0");
    const displayEl = document.getElementById('home-balance-display');
    const headerEl = document.getElementById('header-coin-balance');
    
    if(displayEl) {
        // Simple counter effect could go here, but direct update is cleaner for precision
        displayEl.innerText = Math.floor(bal).toLocaleString();
        
        // Add subtle glow pulse on update
        displayEl.style.textShadow = "0 0 20px #fff";
        setTimeout(() => { displayEl.style.textShadow = "0 0 10px rgba(255,255,255,0.5)"; }, 200);
    }
    
    if(headerEl) headerEl.innerText = Math.floor(bal).toLocaleString();
}

// --- VISUAL: MOTIVATION TICKER ---
function initTicker() {
    const strip = document.querySelector('.motivation-strip');
    if(!strip) return;

    // Messages array
    const msgs = [
        "SYSTEM ONLINE: Earn 1200 coins to reach Level 2",
        "MARKET UPDATE: Coin value stable. Mining active.",
        "BOOST AVAILABLE: Check Games section for 2x Multiplier",
        "LIVE FEED: User409 just withdrew 5000 Coins"
    ];

    let i = 0;
    setInterval(() => {
        strip.style.opacity = 0;
        setTimeout(() => {
            strip.innerHTML = `Running Protocol... <b>${msgs[i]}</b>`;
            strip.style.opacity = 1;
            i = (i + 1) % msgs.length;
        }, 500);
    }, 5000); // Change every 5 seconds
}

// --- TOOLS: AI MODAL SYSTEM ---
window.openToolModal = function(toolType) {
    const modal = document.getElementById('tool-modal');
    const title = document.getElementById('tool-modal-title');
    const body = document.getElementById('tool-modal-body');
    
    if(!modal) return;

    modal.classList.remove('hidden');
    
    // Haptic Feedback
    if(navigator.vibrate) navigator.vibrate(20);

    // Dynamic Content based on Tool
    if (toolType === 'cv') {
        title.innerText = "AI CV ARCHITECT";
        body.innerHTML = `
            <p style="color:#94a3b8; font-size:11px; margin-bottom:15px;">Initializing neural network for resume generation...</p>
            <input type="text" id="cv-name" class="tool-input" placeholder="Operative Name">
            <input type="text" id="cv-job" class="tool-input" placeholder="Target Classification (Job)">
            <button class="btn-tool-action" onclick="runTool('cv')">INITIALIZE BUILD</button>
            <div id="tool-result" class="result-box"></div>
        `;
    } 
    else if (toolType === 'love') {
        title.innerText = "COMPATIBILITY MATRIX";
        body.innerHTML = `
            <p style="color:#94a3b8; font-size:11px; margin-bottom:15px;">Scanning biometric data for match probability.</p>
            <input type="text" id="name1" class="tool-input" placeholder="Subject A">
            <input type="text" id="name2" class="tool-input" placeholder="Subject B">
            <button class="btn-tool-action" style="background:#ec4899;" onclick="runTool('love')">RUN DIAGNOSTIC ❤️</button>
            <div id="tool-result" class="result-box" style="border-color:#ec4899; color:#ec4899;"></div>
        `;
    }
    // Add other tools (Marriage/Career) logic here if needed with similar HTML structure
};

window.closeToolModal = function() {
    document.getElementById('tool-modal').classList.add('hidden');
};

// --- TOOLS: FAKE AI PROCESSING ---
window.runTool = function(type) {
    const resultBox = document.getElementById('tool-result');
    resultBox.style.display = 'block';
    
    // Cyber Loading Animation
    resultBox.innerHTML = '<span style="color:#00f3ff; font-family:monospace;">[||||||||||] PROCESSING DATA...</span>';

    setTimeout(() => {
        if (type === 'cv') {
            const name = document.getElementById('cv-name').value;
            if(!name) { resultBox.innerText = "ERROR: MISSING DATA"; return; }
            resultBox.innerHTML = `✅ PROTOCOL COMPLETE.<br><span style="font-size:10px; color:#aaa;">CV for Agent <b>${name}</b> dispatched to secure server.</span>`;
        }
        else if (type === 'love') {
            const n1 = document.getElementById('name1').value;
            const n2 = document.getElementById('name2').value;
            if(!n1 || !n2) { resultBox.innerText = "ERROR: INPUT MISSING"; return; }
            const score = Math.floor(Math.random() * 30) + 70; // High score for motivation
            resultBox.innerHTML = `❤️ SYNC RATE: <b>${score}%</b><br><span style="font-size:10px;">Quantum entanglement detected.</span>`;
        }
    }, 2000); // 2 Second "Processing" Delay
};


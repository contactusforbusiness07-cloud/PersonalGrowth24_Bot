/* js/wallet.js - LIVING CORE LOGIC */

// --- CONFIGURATION ---
const CORE_STABILITY = "98.4%";
const REFRESH_RATE = 3000;

// --- NATIVE ADS (Disguised as System Protocols) ---
const systemProtocols = [
    {
        id: "P-772",
        title: "Energy Optimization",
        desc: "Increase Core Output by 12%",
        url: "https://google.com", // Ad Link
        type: "BOOST"
    },
    {
        id: "A-991",
        title: "External Node Sync",
        desc: "Secure 5,000 Power Units",
        url: "https://binance.com", // Ad Link
        type: "PATCH"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initCore();
});

function initCore() {
    renderCoreStats();
    injectProtocols();
    animateCore();
}

// --- 1. CORE RENDERER ---
function renderCoreStats() {
    const bal = localStorage.getItem('local_balance') || "0";
    const powerEl = document.getElementById('core-power');
    const tierEl = document.getElementById('access-tier');
    
    // Animate Number Count up (Visual only)
    if(powerEl) {
        powerEl.innerText = Math.floor(parseFloat(bal)).toLocaleString();
    }

    // Determine Access Tier
    const numericBal = parseFloat(bal);
    if(tierEl) {
        if(numericBal < 10000) tierEl.innerText = "SC-01 [ROOKIE]";
        else if(numericBal < 100000) {
            tierEl.innerText = "SC-02 [OPERATOR]";
            tierEl.style.color = "#00f3ff";
        } else {
            tierEl.innerText = "SC-03 [ARCHITECT]";
            tierEl.style.color = "#ffd700";
        }
    }
}

// --- 2. PROTOCOL INJECTION (Native Ads) ---
function injectProtocols() {
    const container = document.getElementById('protocol-feed');
    if(!container) return;

    // Pick random protocol
    const proto = systemProtocols[Math.floor(Math.random() * systemProtocols.length)];

    container.innerHTML = `
        <div class="protocol-card" onclick="window.open('${proto.url}', '_blank')">
            <div style="display:flex; align-items:center;">
                <span class="sys-badge">${proto.type}</span>
                <div class="protocol-data">
                    <h4>${proto.title}</h4>
                    <p>${proto.desc}</p>
                </div>
            </div>
            <div class="exec-btn">EXECUTE</div>
        </div>
    `;
}

// --- 3. LIVING ANIMATION (Simulation) ---
function animateCore() {
    setInterval(() => {
        // Randomly fluctuate stability visuals
        const stableEl = document.getElementById('stability-metric');
        if(stableEl) {
            const rand = (Math.random() * (99.9 - 97.0) + 97.0).toFixed(1);
            stableEl.innerText = rand + "%";
        }
    }, REFRESH_RATE);
}

// --- 4. GATE HANDLER ---
window.accessVaultGate = function() {
    // Sound effect trigger could go here
    
    Swal.fire({
        icon: 'warning',
        title: 'GATE SEALED',
        html: `
            <div style="font-family:'Rajdhani'; color:#fff;">
                <p>Synchronization with Mainnet incomplete.</p>
                <p style="color:#ff2a6d; margin-top:10px;">ESTIMATED UNLOCK: TGE PHASE 2</p>
            </div>
        `,
        background: '#000205',
        color: '#fff',
        confirmButtonColor: '#ff2a6d',
        confirmButtonText: 'ACKNOWLEDGED'
    });
}

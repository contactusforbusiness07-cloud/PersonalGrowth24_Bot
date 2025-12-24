/* js/home.js - HOME LOGIC CONNECTED TO ADS.JS (FINAL) */

// --- CONFIGURATION ---
const HOME_CONFIG = {
    SETTINGS: {
        TICKER_SPEED: 5000 // News ticker speed
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Force Layout Upgrade (Ads + Social Links)
    upgradeHomeLayout();

    // 2. Start Core Systems (Balance, Ticker)
    initHomeSystem();
});

// ==========================================
// 🛠️ DYNAMIC LAYOUT UPGRADE (MAGIC FUNCTION)
// ==========================================
function upgradeHomeLayout() {
    console.log("🛠️ FinGamePro: Upgrading Home Layout & Connecting Ads...");

    // 🟢 1. INJECT NATIVE AD SLOT (Connected to ads.js)
    // Check if ad slot already exists, if not, create it
    const hero = document.querySelector('.hero-card');
    let adSlot = document.getElementById('ad-home-native');

    if (hero && !adSlot) {
        // Create the container exactly as ads.js expects
        const adDiv = document.createElement('div');
        adDiv.id = 'ad-home-native'; // This ID matches ads.js target
        adDiv.className = 'native-ad-container';
        adDiv.style.marginTop = "20px";
        adDiv.style.marginBottom = "20px";
        
        // Insert after Hero Card
        hero.parentNode.insertBefore(adDiv, hero.nextSibling);

        // 🚀 SIGNAL TO ADS.JS
        // Agar ads.js load ho chuka hai, to use bolo ki isme ad bhar de
        setTimeout(() => {
            if (window.injectAdIntoContainer) {
                window.injectAdIntoContainer("ad-home-native");
            }
        }, 1000);
    }

    // 🟢 2. CHANGE HEADER & REPLACE GRID WITH WIDE BARS
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(t => {
        if (t.innerText.includes('Smart Tools') || t.innerText.includes('Tools') || t.innerText.includes('Official Comms')) {
            t.innerHTML = 'OFFICIAL UPDATES <span class="badge-viral">VERIFIED</span>';
        }
    });

    // Replace Smart Tools Grid with Wide List (Your Custom Design)
    const toolsGrid = document.querySelector('.tools-grid') || document.querySelector('.social-grid');
    
    if (toolsGrid) {
        const newContainer = document.createElement('div');
        newContainer.className = 'official-stack'; // Wide Stack Style

        newContainer.innerHTML = `
            <div class="wide-link-card telegram" onclick="window.open('https://t.me/The_EnglishRoom5', '_blank')">
                <i class="fa-brands fa-telegram"></i>
                <span>Official Telegram Announcement</span>
            </div>

            <div class="wide-link-card instagram" onclick="window.open('https://instagram.com/', '_blank')">
                <i class="fa-brands fa-instagram"></i>
                <span>Official Instagram</span>
            </div>

            <div class="wide-link-card youtube" onclick="window.open('https://youtube.com/', '_blank')">
                <i class="fa-brands fa-youtube"></i>
                <span>Official YouTube Channel</span>
            </div>

            <div class="wide-link-card facebook" onclick="window.open('https://facebook.com/', '_blank')">
                <i class="fa-brands fa-facebook"></i>
                <span>Official Facebook Page</span>
            </div>

            <div class="wide-link-card brand" onclick="openInternalPage('page-brand')">
                <i class="fa-solid fa-handshake"></i>
                <span>Partner (Brand / Sponsorship ⭐)</span>
            </div>
        `;

        toolsGrid.parentNode.replaceChild(newContainer, toolsGrid);
    }
}

// ==========================================
// ⚙️ CORE SYSTEMS
// ==========================================
function initHomeSystem() {
    updateHomeBalance();
    setInterval(updateHomeBalance, 2000); // Keep balance fresh
    initTicker();
}

function updateHomeBalance() {
    // Get balance from local storage (synced by main.js)
    const bal = parseFloat(localStorage.getItem('local_balance') || "0");
    const displayEl = document.getElementById('home-balance-display');
    const headerEl = document.getElementById('header-coin-balance');
    const formatted = Math.floor(bal).toLocaleString();
    
    if(displayEl) {
        // Animation effect if balance changes
        if(displayEl.innerText !== formatted) {
            displayEl.style.textShadow = "0 0 25px #fff";
            setTimeout(() => { displayEl.style.textShadow = "0 0 10px rgba(255,255,255,0.5)"; }, 300);
        }
        displayEl.innerText = formatted;
    }
    if(headerEl) headerEl.innerText = formatted;
}

function initTicker() {
    const strip = document.querySelector('.motivation-strip');
    if(!strip) return;
    const msgs = [
        "SYSTEM ONLINE: Earn 1200 coins to reach Level 2",
        "OFFICIAL: Join Telegram for daily crypto codes",
        "BOOST AVAILABLE: Check Games section for 2x Multiplier",
    ];
    let i = 0;
    setInterval(() => {
        strip.style.opacity = 0;
        setTimeout(() => {
            strip.innerHTML = `Running Protocol... <b style="color:#ffd700">${msgs[i]}</b>`;
            strip.style.opacity = 1;
            i = (i + 1) % msgs.length;
        }, 500);
    }, HOME_CONFIG.SETTINGS.TICKER_SPEED);
}

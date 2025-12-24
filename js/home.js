/* js/home.js - DYNAMIC DASHBOARD & MONETIZATION */

// --- CONFIGURATION ---
const HOME_CONFIG = {
    // ⚠️ PASTE YOUR ADSTERRA LINKS HERE
    // Maine yahan aapka Social Bar link daal diya hai
    SOCIAL_BAR_URL: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js", 
    
    SETTINGS: {
        SOCIAL_DELAY_MS: 6000,      // 6s wait
        SESSION_CAP: 2,             // Max 3 ads
        COOLDOWN_MS: 180000,        // 2 Mins gap
        TICKER_SPEED: 5000
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Force Layout Upgrade (No HTML Edit needed)
    upgradeHomeLayout();

    // 2. Start Core Systems
    initHomeSystem();
});

// ==========================================
// 🛠️ DYNAMIC LAYOUT UPGRADE (MAGIC FUNCTION)
// ==========================================
function upgradeHomeLayout() {
    console.log("🛠️ FinGamePro: Upgrading Home Layout...");

    // 1. INJECT NATIVE AD (After Hero Card)
    const hero = document.querySelector('.hero-card');
    if (hero && !document.getElementById('adsterra-native-slot')) {
        const adDiv = document.createElement('div');
        adDiv.id = 'adsterra-native-slot';
        adDiv.className = 'native-ad-module';
        
        // Yahan Native Ad ka Container ID set kar diya hai
        adDiv.innerHTML = `
            <div class="ad-label"><i class="fa-solid fa-bolt"></i> SPONSORED POWER BOOST</div>
            <div id="native-ad-container" style="text-align: center; min-height: 100px;">
                <div id="container-85c8e4eb0a60d8ad0292343f4d54b04b"></div>
            </div>
        `;
        hero.parentNode.insertBefore(adDiv, hero.nextSibling);

        // Inject Native Script Immediately
        const s = document.createElement('script');
        s.async = true;
        s.dataset.cfasync = "false";
        s.src = "//pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js";
        
        // Script ko container me append kar rahe hain
        // Thoda timeout diya taaki DOM ready ho jaye
        setTimeout(() => {
            const container = document.getElementById('native-ad-container');
            if(container) container.appendChild(s);
        }, 100);
    }

    // 2. CHANGE HEADER & REPLACE GRID WITH WIDE BARS
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(t => {
        if (t.innerText.includes('Smart Tools') || t.innerText.includes('Tools') || t.innerText.includes('Official Comms')) {
            t.innerHTML = 'OFFICIAL UPDATES <span class="badge-viral">VERIFIED</span>';
        }
    });

    // Replace Smart Tools Grid with Wide List
    const toolsGrid = document.querySelector('.tools-grid') || document.querySelector('.social-grid');
    
    if (toolsGrid) {
        const newContainer = document.createElement('div');
        newContainer.className = 'official-stack'; // Wide Stack Style

        // Exact Text & Structure as Requested
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
    setInterval(updateHomeBalance, 2000);
    initTicker();
    initAdEngine();
}

function updateHomeBalance() {
    const bal = parseFloat(localStorage.getItem('local_balance') || "0");
    const displayEl = document.getElementById('home-balance-display');
    const headerEl = document.getElementById('header-coin-balance');
    const formatted = Math.floor(bal).toLocaleString();
    
    if(displayEl) {
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

// ==========================================
// 💸 ADSTERRA ENGINE
// ==========================================
function initAdEngine() {
    // Show Native Ad Slot
    const nativeSlot = document.getElementById('adsterra-native-slot');
    if(nativeSlot) {
        nativeSlot.style.display = 'block';
        // Code already injected in upgradeHomeLayout
    }

    // Trigger Social Bar Logic
    const lastAdTime = parseInt(localStorage.getItem('ad_last_shown') || "0");
    const sessionAds = parseInt(sessionStorage.getItem('ad_session_count') || "0");
    const now = Date.now();

    if ((now - lastAdTime > HOME_CONFIG.SETTINGS.COOLDOWN_MS) && 
        (sessionAds < HOME_CONFIG.SETTINGS.SESSION_CAP)) {
        setTimeout(() => {
            triggerSocialBar();
        }, HOME_CONFIG.SETTINGS.SOCIAL_DELAY_MS);
    }
}

function triggerSocialBar() {
    console.log("Ads: Injecting Social Bar...");
    
    // 👇 SOCIAL BAR SCRIPT INJECTED HERE
    const script = document.createElement('script');
    script.src = HOME_CONFIG.SOCIAL_BAR_URL;
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    localStorage.setItem('ad_last_shown', Date.now());
    const count = parseInt(sessionStorage.getItem('ad_session_count') || "0");
    sessionStorage.setItem('ad_session_count', count + 1);
}


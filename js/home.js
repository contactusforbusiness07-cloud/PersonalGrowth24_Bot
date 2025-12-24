/* js/home.js - DYNAMIC HOME CONTROLLER & ADS */

// --- CONFIGURATION ---
const HOME_CONFIG = {
    // ⚠️ ADSTERRA LINKS YAHAN DALNA
    SOCIAL_BAR_URL: "//pl12345678.example.com/social_script.js", // Social Bar JS Link
    NATIVE_BANNER_ID: "container-123456", // Native Banner Container ID (if applicable)

    SETTINGS: {
        SOCIAL_DELAY_MS: 6000,      // 6 Sec wait
        SESSION_CAP: 2,             // Max 2 ads per session
        COOLDOWN_MS: 180000,        // 3 Mins cooldown
        TICKER_SPEED: 5000
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Modify HTML Structure Dynamically (No HTML file edit needed)
    upgradeHomeLayout();

    // 2. Start Systems
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
        adDiv.innerHTML = `
            <div class="ad-label"><i class="fa-solid fa-bolt"></i> SPONSORED POWER BOOST</div>
            <div id="native-ad-container">
                </div>
        `;
        hero.parentNode.insertBefore(adDiv, hero.nextSibling);
    }

    // 2. REPLACE "SMART TOOLS" WITH "OFFICIAL COMMS"
    // Find the section title
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(t => {
        if (t.innerText.includes('Smart Tools') || t.innerText.includes('Tools')) {
            t.innerHTML = 'Official Comms <span class="badge-viral">VERIFIED</span>';
        }
    });

    // Replace the Grid Content
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        const socialGrid = document.createElement('div');
        socialGrid.className = 'social-grid';
        socialGrid.innerHTML = `
            <div class="social-card telegram" onclick="window.open('https://t.me/The_EnglishRoom5', '_blank')">
                <i class="fa-brands fa-telegram"></i><span>Telegram</span>
            </div>
            <div class="social-card instagram" onclick="window.open('https://instagram.com/', '_blank')">
                <i class="fa-brands fa-instagram"></i><span>Instagram</span>
            </div>
            <div class="social-card youtube" onclick="window.open('https://youtube.com/', '_blank')">
                <i class="fa-brands fa-youtube"></i><span>YouTube</span>
            </div>
            <div class="social-card facebook" onclick="window.open('https://facebook.com/', '_blank')">
                <i class="fa-brands fa-facebook"></i><span>Facebook</span>
            </div>
            <div class="social-card pinterest" onclick="window.open('https://pinterest.com/', '_blank')">
                <i class="fa-brands fa-pinterest"></i><span>Pinterest</span>
            </div>
            <div class="social-card brand" onclick="openInternalPage('page-brand')">
                <i class="fa-solid fa-handshake"></i><span>Partner</span>
            </div>
        `;
        toolsGrid.parentNode.replaceChild(socialGrid, toolsGrid);
    }
}

// ==========================================
// ⚙️ CORE SYSTEMS
// ==========================================
function initHomeSystem() {
    // Balance Sync
    updateHomeBalance();
    setInterval(updateHomeBalance, 2000);

    // Motivation Ticker
    initTicker();

    // Monetization Engine
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
        "LIVE FEED: User409 just withdrew 5000 Coins"
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
// 💸 ADSTERRA MONETIZATION ENGINE
// ==========================================
function initAdEngine() {
    
    // A. Inject Native Ad Script
    const container = document.getElementById('native-ad-container');
    if(container && container.innerHTML.trim() === "") {
        console.log("Ads: Loading Native Banner...");
        
        // 👇 PASTE YOUR NATIVE AD SCRIPT HERE (Example below) 👇
        /*
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//pl123456.example.com/native_banner.js'; 
        container.appendChild(s);
        */
    }

    // B. Trigger Social Bar (With Logic)
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
    
    // 👇 PASTE SOCIAL BAR SCRIPT HERE 👇
    /*
    const script = document.createElement('script');
    script.src = HOME_CONFIG.SOCIAL_BAR_URL;
    script.async = true;
    document.body.appendChild(script);
    */

    // Update Limits
    localStorage.setItem('ad_last_shown', Date.now());
    const count = parseInt(sessionStorage.getItem('ad_session_count') || "0");
    sessionStorage.setItem('ad_session_count', count + 1);
}


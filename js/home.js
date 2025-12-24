/* js/home.js - DYNAMIC DASHBOARD & MONETIZATION (THIN CARD STYLE) */

// --- CONFIGURATION ---
const HOME_CONFIG = {
    SOCIAL_BAR_URL: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js", 
    
    SETTINGS: {
        SOCIAL_DELAY_MS: 6000,
        SESSION_CAP: 2,
        COOLDOWN_MS: 180000,
        TICKER_SPEED: 5000
    }
};

document.addEventListener('DOMContentLoaded', () => {
    upgradeHomeLayout();
    initHomeSystem();
});

// ==========================================
// 🛠️ DYNAMIC LAYOUT UPGRADE (THIN AD STYLE APPLIED)
// ==========================================
function upgradeHomeLayout() {
    console.log("🛠️ FinGamePro: Upgrading Home Layout (Thin Style)...");

    // 🟢 1. INJECT NATIVE AD (THIN CARD STYLE)
    const hero = document.querySelector('.hero-card');
    
    if (hero && !document.getElementById('adsterra-native-slot')) {
        
        // A. INJECT CUSTOM CSS FOR THIN CARD LOOK
        // Ye CSS ad ko zabardasti patla aur horizontal banayegi
        const thinStyle = document.createElement('style');
        thinStyle.innerHTML = `
            /* Outer Card Wrapper */
            .native-ad-thin-card {
                background: linear-gradient(145deg, rgba(25, 30, 50, 0.9), rgba(0, 0, 0, 0.6));
                border: 1px solid rgba(255, 215, 0, 0.25); /* Gold border subtle */
                border-radius: 16px;
                padding: 12px;
                margin: 20px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                position: relative;
                overflow: hidden;
            }
            
            /* The small "SPONSORED" Label */
            .ad-label-thin {
                font-size: 9px;
                color: #ffd700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
                display: block;
                opacity: 0.8;
            }

            /* FORCING ADSTERRA CONTAINER TO BE THIN & HORIZONTAL */
            #container-85c8e4eb0a60d8ad0292343f4d54b04b {
                 display: flex !important;
                 flex-direction: row !important; /* Image left, text right */
                 align-items: center !important;
                 justify-content: flex-start !important;
                 
                 min-height: auto !important;
                 max-height: 85px !important; /* HEIGHT CONTROL: Patla karne ke liye */
                 
                 overflow: hidden !important;
                 text-align: left !important;
                 gap: 15px !important;
            }

            /* Attempt to target internal Adsterra elements to ensure they fit */
            /* Note: Sometimes Adsterra ignores this, but we try to force it */
            #container-85c8e4eb0a60d8ad0292343f4d54b04b img {
                 height: 70px !important;
                 width: 70px !important;
                 object-fit: cover !important;
                 border-radius: 10px !important;
                 flex-shrink: 0 !important; /* Image ko dabne se bachao */
            }
            #container-85c8e4eb0a60d8ad0292343f4d54b04b a {
                 text-decoration: none !important;
                 color: white !important;
                 font-family: 'Inter', sans-serif !important;
            }
             #container-85c8e4eb0a60d8ad0292343f4d54b04b .headline {
                 font-size: 14px !important;
                 font-weight: 700 !important;
                 margin-bottom: 4px !important;
                 line-height: 1.2 !important;
                 display: -webkit-box !important;
                 -webkit-line-clamp: 2 !important; /* Max 2 lines title */
                 -webkit-box-orient: vertical !important;
                 overflow: hidden !important;
            }
            #container-85c8e4eb0a60d8ad0292343f4d54b04b .description {
                 font-size: 11px !important;
                 color: #aaa !important;
                 display: -webkit-box !important;
                 -webkit-line-clamp: 1 !important; /* Max 1 line description */
                 -webkit-box-orient: vertical !important;
                 overflow: hidden !important;
            }
        `;
        document.head.appendChild(thinStyle);


        // B. CREATE THE AD STRUCTURE
        const adDiv = document.createElement('div');
        adDiv.id = 'adsterra-native-slot';
        // Nayi class add ki hai thin look ke liye
        adDiv.className = 'native-ad-thin-card';
        
        adDiv.innerHTML = `
            <span class="ad-label-thin"><i class="fa-solid fa-bolt"></i> SPONSORED BOOST</span>
            <div id="container-85c8e4eb0a60d8ad0292343f4d54b04b"></div>
        `;
        
        hero.parentNode.insertBefore(adDiv, hero.nextSibling);

        // C. INJECT SCRIPT
        const s = document.createElement('script');
        s.async = true;
        s.dataset.cfasync = "false";
        s.src = "https://pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js";
        adDiv.appendChild(s);
    }

    // 2. CHANGE HEADER & REPLACE GRID WITH WIDE BARS
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(t => {
        if (t.innerText.includes('Smart Tools') || t.innerText.includes('Tools') || t.innerText.includes('Official Comms')) {
            t.innerHTML = 'OFFICIAL UPDATES <span class="badge-viral">VERIFIED</span>';
        }
    });

    const toolsGrid = document.querySelector('.tools-grid') || document.querySelector('.social-grid');
    if (toolsGrid) {
        const newContainer = document.createElement('div');
        newContainer.className = 'official-stack';

        newContainer.innerHTML = `
            <div class="wide-link-card telegram" onclick="window.open('https://t.me/The_EnglishRoom5', '_blank')">
                <i class="fa-brands fa-telegram"></i><span>Official Telegram Announcement</span>
            </div>
            <div class="wide-link-card instagram" onclick="window.open('https://instagram.com/', '_blank')">
                <i class="fa-brands fa-instagram"></i><span>Official Instagram</span>
            </div>
            <div class="wide-link-card youtube" onclick="window.open('https://youtube.com/', '_blank')">
                <i class="fa-brands fa-youtube"></i><span>Official YouTube Channel</span>
            </div>
            <div class="wide-link-card facebook" onclick="window.open('https://facebook.com/', '_blank')">
                <i class="fa-brands fa-facebook"></i><span>Official Facebook Page</span>
            </div>
            <div class="wide-link-card brand" onclick="openInternalPage('page-brand')">
                <i class="fa-solid fa-handshake"></i><span>Partner (Brand / Sponsorship ⭐)</span>
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
    const nativeSlot = document.getElementById('adsterra-native-slot');
    if(nativeSlot) {
        nativeSlot.style.display = 'block';
    }

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
    const script = document.createElement('script');
    script.src = HOME_CONFIG.SOCIAL_BAR_URL;
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    localStorage.setItem('ad_last_shown', Date.now());
    const count = parseInt(sessionStorage.getItem('ad_session_count') || "0");
    sessionStorage.setItem('ad_session_count', count + 1);
}

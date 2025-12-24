/* =========================================
   💎 FinGamePro: ADVANCED MONETIZATION ENGINE
   Target: 10x-15x Revenue | UX: Premium Metaverse
   ========================================= */

const AD_SYSTEM = {
    // 👇 Yahan Apne Adsterra Links Dalein
    CONFIG: {
        NATIVE_BANNER_SRC: "//pl25569834.online-advert.com/your-native-code.js", 
        SOCIAL_BAR_SRC: "//pl99887766.online-advert.com/your-social-code.js",
        DIRECT_LINK_URL: "https://www.highcpmgate.com/xyz123", // Smartlink for Boosters
        
        // Settings
        REFRESH_RATE: 30000,       // 30 Seconds
        INITIAL_DELAY: 2000,       // App load hone ke 2 sec baad ads aayenge
        SCROLL_PAUSE: true,        // Scroll karte waqt refresh nahi hoga
        SOCIAL_DELAY: 25000,       // 25 sec baad Social Bar aayega
        
        // Limits (Safety)
        BOOSTER_LIMIT: 6,          // Max 6 times per day
        REFILL_LIMIT: 6            // Max 6 times per day
    },

    // 📍 All Ad Placements
    SLOTS: [
        "ad-home-native",         // Home: "Special Offer" style
        "ad-leaderboard-native",  // Rank: "Sponsored Champion" style
        "ad-tasks-native",        // Task: "Premium Mission" style
        "ad-wallet-native",       // Wallet: "Finance Partner" style
        "game-native-ad",         // Game: "Arena Sponsor" style
        "menu-native-ad",         // Menu: If placeholder exists
        "legal-native-ad"         // For all Info pages
    ],

    // State Tracking
    timers: {},
    isScrolling: false
};

// --- 🚀 INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("💰 Monetization Engine: Warming up...");
    
    // 1. Inject Native Ads
    setTimeout(injectNativeAds, AD_SYSTEM.CONFIG.INITIAL_DELAY);

    // 2. Inject Social Bar (Delayed)
    setTimeout(injectSocialBar, AD_SYSTEM.CONFIG.SOCIAL_DELAY);

    // 3. Setup Scroll Listener (To pause refresh)
    setupScrollLogic();
    
    // 4. Setup Visibility Listener (Tab switch refresh)
    document.addEventListener("visibilitychange", handleTabSwitch);
});

// --- 🛠️ NATIVE AD INJECTION ---
function injectNativeAds() {
    AD_SYSTEM.SLOTS.forEach(slotId => {
        const container = document.getElementById(slotId);
        if (container) {
            renderAd(container, slotId);
            // Start Auto Refresh Timer
            startRefreshTimer(container, slotId);
        }
    });
}

function renderAd(container, id) {
    // Clear old ad
    container.innerHTML = "";
    
    // Styling to match Metaverse Theme
    container.classList.add('ad-loaded-container');
    
    // Script Injection
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = AD_SYSTEM.CONFIG.NATIVE_BANNER_SRC + `?t=${Date.now()}`; // Cache bust
    script.async = true;
    
    // Error Handling
    script.onerror = () => { container.style.display = 'none'; };
    
    container.appendChild(script);
    console.log(`✅ Ad Refreshed: ${id}`);
}

// --- 🔄 SMART REFRESH LOGIC ---
function startRefreshTimer(container, id) {
    // Clear existing timer if any
    if (AD_SYSTEM.timers[id]) clearInterval(AD_SYSTEM.timers[id]);

    AD_SYSTEM.timers[id] = setInterval(() => {
        // Refresh ONLY if user is NOT scrolling
        if (!AD_SYSTEM.isScrolling && document.visibilityState === 'visible') {
            // Blink Effect before refresh (Premium Feel)
            container.style.opacity = "0.5";
            setTimeout(() => {
                renderAd(container, id);
                container.style.opacity = "1";
            }, 300);
        }
    }, AD_SYSTEM.CONFIG.REFRESH_RATE);
}

function setupScrollLogic() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        AD_SYSTEM.isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            AD_SYSTEM.isScrolling = false;
        }, 1000); // Resume refresh 1 sec after scrolling stops
    });
}

function handleTabSwitch() {
    // User wapas aaya? Turant naye ads dikhao (High Revenue Trick)
    if (document.visibilityState === 'visible') {
        console.log("👀 User returned. Refreshing all ads...");
        injectNativeAds();
    }
}

// --- 🔔 SOCIAL BAR (IN-PAGE PUSH) ---
function injectSocialBar() {
    const script = document.createElement('script');
    script.src = AD_SYSTEM.CONFIG.SOCIAL_BAR_SRC;
    script.async = true;
    document.body.appendChild(script);
    console.log("🔔 Social Bar Active");
}

// --- ⚡ DIRECT LINK (GAME BOOSTERS) - THE MONEY MAKER ---
// Is function ko Game ke button onClick par call karein
window.handlePowerUp = function(type) {
    const today = new Date().toDateString();
    const storageKey = `ad_limit_${type}_${today}`;
    let count = parseInt(localStorage.getItem(storageKey) || "0");

    if (count >= AD_SYSTEM.CONFIG.BOOSTER_LIMIT) {
        // Limit Reached - Show Toast
        Swal.fire({
            icon: 'warning',
            title: 'Limit Reached',
            text: 'Come back tomorrow for more boosts!',
            background: '#020617', color: '#fff'
        });
        return;
    }

    // 1. Open Direct Link (Ad)
    window.open(AD_SYSTEM.CONFIG.DIRECT_LINK_URL, '_blank');

    // 2. Grant Reward (Simulated)
    count++;
    localStorage.setItem(storageKey, count);
    
    // Update Badge UI
    const badge = document.getElementById(`btn-${type}-badge`);
    if(badge) badge.innerText = `${count}/${AD_SYSTEM.CONFIG.BOOSTER_LIMIT}`;

    // Success Animation
    Swal.fire({
        icon: 'success',
        title: 'System Boosted!',
        text: 'Energy recharged successfully.',
        background: '#020617', color: '#fff',
        timer: 2000, showConfirmButton: false
    });
};

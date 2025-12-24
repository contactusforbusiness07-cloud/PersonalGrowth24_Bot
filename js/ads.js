/* js/ads.js - DEBUG VERSION (Testing ke liye) */

// --- CONFIGURATION ---
const ADS_CONFIG = {
    // Aapke diye huye original links
    SMARTLINK: "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a",
    NATIVE_URL: "//pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js",
    NATIVE_KEY: "85c8e4eb0a60d8ad0292343f4d54b04b",
    SOCIAL_BAR: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js"
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔥 Ads System Starting...");
    setTimeout(initGlobalAds, 2000);
});

function initGlobalAds() {
    console.log("💰 Injecting Social Bar...");
    
    // 1. Social Bar Inject
    const script = document.createElement('script');
    script.src = ADS_CONFIG.SOCIAL_BAR;
    script.async = true;
    script.onerror = () => console.error("❌ Social Bar Blocked by Browser!");
    document.body.appendChild(script);

    // 2. Native Ads Inject
    refreshAllAds();
}

// --- GLOBAL FUNCTIONS ---

window.injectAdIntoContainer = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`⚠️ Ad Slot Missing: ${containerId}`);
        return;
    }

    console.log(`✅ Filling Slot: ${containerId}`);

    // --- DEBUG STYLING (Taaki pata chale code chal raha hai) ---
    container.innerHTML = "";
    container.className = "native-ad-container"; 
    container.style.display = "block";
    container.style.minHeight = "100px";
    
    // RED BORDER (Testing ke liye - Agar ye dikha to code sahi hai)
    container.style.border = "2px dashed red"; 
    container.innerHTML = `<p style="color:red; font-size:10px; padding:10px;">⏳ AD LOADING...<br>(${containerId})</p>`;

    // Adsterra Structure
    const adWrapper = document.createElement('div');
    adWrapper.id = `container-${ADS_CONFIG.NATIVE_KEY}`;
    container.appendChild(adWrapper);

    // Script Create
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = ADS_CONFIG.NATIVE_URL;
    
    // Success/Error check
    script.onload = () => {
        // Ad load ho gaya to Red Border hata do
        container.style.border = "1px solid rgba(255,255,255,0.1)"; 
        container.querySelector('p').style.display = 'none'; // Loading text hatao
        console.log(`🎉 Ad Loaded Success: ${containerId}`);
    };

    script.onerror = () => {
        container.innerHTML = `<p style="color:red; padding:10px;">❌ AD BLOCKED BY BROWSER</p>`;
        console.error(`🚫 Ad Blocked in: ${containerId}`);
    };
    
    container.appendChild(script);
};

window.openSmartLink = function() {
    console.log("🚀 Opening Smartlink...");
    window.open(ADS_CONFIG.SMARTLINK, '_blank');
};

window.refreshAllAds = function() {
    const slots = [
        "ad-home-native", "ad-leaderboard-native", "ad-tasks-native", 
        "ad-wallet-native", "game-native-ad", "menu-native-ad",
        "legal-ad-top", "legal-ad-bottom"
    ];
    slots.forEach(id => window.injectAdIntoContainer(id));
};

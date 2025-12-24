/* js/ads.js - FINAL FORCE FIX VERSION */

// --- USER CONFIGURATION (Do not change keys unless necessary) ---
const ADS_CONFIG = {
    SMARTLINK: "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a",
    NATIVE_URL: "//pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js",
    NATIVE_KEY: "85c8e4eb0a60d8ad0292343f4d54b04b", 
    SOCIAL_BAR: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js"
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔥 Ad System: Initializing...");
    
    // 1. Social Bar ko turant inject karo
    injectSocialBar();

    // 2. Baaki Ads ko 2 second baad load karo
    setTimeout(initGlobalAds, 2000);
});

function initGlobalAds() {
    console.log("💰 Ad System: Filling Slots...");
    refreshAllAds();
}

// --- SOCIAL BAR ---
function injectSocialBar() {
    const s = document.createElement('script');
    s.src = ADS_CONFIG.SOCIAL_BAR;
    s.async = true;
    s.onerror = () => console.warn("⚠️ Social Bar blocked by browser.");
    document.body.appendChild(s);
}

// --- NATIVE ADS INJECTION ---
window.injectAdIntoContainer = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`❌ Slot Missing in HTML: ${containerId}`);
        return;
    }

    // 1. Clear & Style Container
    container.innerHTML = "";
    container.className = "native-ad-container"; 
    container.style.display = "block";
    container.style.minHeight = "100px";
    container.style.background = "rgba(255,255,255,0.05)";
    container.style.border = "1px solid rgba(255,255,255,0.1)";

    // 2. SHOW LOADING TEXT (Debugging ke liye)
    // Agar ye text dikhe, matlab JS sahi chal rahi hai
    const statusText = document.createElement('p');
    statusText.innerText = "⚡ LOADING SPONSORED AD...";
    statusText.style.color = "#ebd000";
    statusText.style.fontSize = "10px";
    statusText.style.padding = "10px";
    statusText.style.textAlign = "center";
    container.appendChild(statusText);

    // 3. Create Adsterra Specific Wrapper
    // Adsterra script looks for this EXACT ID
    const adWrapper = document.createElement('div');
    adWrapper.id = `container-${ADS_CONFIG.NATIVE_KEY}`;
    container.appendChild(adWrapper);

    // 4. Inject Script
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = ADS_CONFIG.NATIVE_URL;
    
    script.onload = () => {
        console.log(`✅ Script Loaded: ${containerId}`);
        statusText.style.display = 'none'; // Text hata do
    };

    script.onerror = () => {
        console.error(`🚫 Script Blocked: ${containerId}`);
        statusText.innerText = "❌ AD BLOCKED (Check Browser Settings)";
        statusText.style.color = "red";
    };
    
    container.appendChild(script);
};

// --- UTILS ---
window.openSmartLink = function() {
    window.open(ADS_CONFIG.SMARTLINK, '_blank');
};

window.refreshAllAds = function() {
    const slots = [
        "ad-home-native", 
        "ad-leaderboard-native", 
        "ad-tasks-native", 
        "ad-wallet-native", 
        "game-native-ad", 
        "menu-native-ad",
        "legal-ad-top", 
        "legal-ad-bottom"
    ];
    slots.forEach(id => window.injectAdIntoContainer(id));
};


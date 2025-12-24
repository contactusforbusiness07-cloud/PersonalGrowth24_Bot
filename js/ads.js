/* js/ads.js - 10X REVENUE LOGIC (UPDATED WITH YOUR LINKS) */

document.addEventListener('DOMContentLoaded', () => {
    // 2 second delay taaki pehle app load ho (User Experience Safe)
    setTimeout(initAdSystem, 2000);
});

// --- CONFIGURATION (YOUR LINKS) ---
const ADS_CONFIG = {
    // 1. SMARTLINK (High CPM)
    SMARTLINK_URL: "https://www.effectivegatecpm.com/qiwcegy4js?key=f1d39bc10aa8d8d13ec1985da83d996a",

    // 2. SOCIAL BAR (Script URL)
    SOCIAL_BAR_URL: "//pl28285623.effectivegatecpm.com/8f/bd/f6/8fbdf667a2a2e1609a5d4f38e0105d34.js",

    // 3. NATIVE BANNER (Key & Container ID from your code)
    NATIVE_KEY: "85c8e4eb0a60d8ad0292343f4d54b04b", 
    NATIVE_CONTAINER_ID: "container-85c8e4eb0a60d8ad0292343f4d54b04b"
};

function initAdSystem() {
    console.log("💰 AdManager: Injecting Premium Ads...");

    // A. Inject Social Bar (Global)
    injectSocialBar();

    // B. Inject Native Banners (Targeted Sections)
    const adSlots = [
        "ad-home-native",         // Home
        "ad-leaderboard-native",  // Rank
        "ad-tasks-native",        // Tasks
        "ad-wallet-native",       // Wallet
        "game-native-ad",         // Game
        "menu-native-ad",         // Menu
        "legal-ad-top",           // Legal Pages
        "legal-ad-bottom"
    ];

    adSlots.forEach(slotId => {
        const slot = document.getElementById(slotId);
        if (slot) {
            injectNativeAd(slot);
        }
    });
}

// --- 1. NATIVE AD INJECTION LOGIC ---
function injectNativeAd(container) {
    // Styling Reset
    container.innerHTML = "";
    container.className = "native-ad-container";
    container.style.display = "block";

    // Adsterra Native needs a specific DIV ID inside
    // Note: Since ID must be unique, we create a dynamic wrapper, 
    // but Adsterra script targets specific ID. We will try to clone it.
    
    // 1. Create the Div Adsterra looks for
    const adDiv = document.createElement('div');
    adDiv.id = ADS_CONFIG.NATIVE_CONTAINER_ID; 
    container.appendChild(adDiv);

    // 2. Create the Script
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = `//pl28285595.effectivegatecpm.com/${ADS_CONFIG.NATIVE_KEY}/invoke.js`;

    container.appendChild(script);
    console.log("✅ Native Ad Injected");
}

// --- 2. SOCIAL BAR LOGIC ---
function injectSocialBar() {
    const script = document.createElement('script');
    script.src = ADS_CONFIG.SOCIAL_BAR_URL;
    script.async = true;
    document.body.appendChild(script);
    console.log("🔔 Social Bar Active");
}

// --- 3. SMARTLINK LOGIC (HIGH REVENUE) ---
// Is function ko 'Claim Bonus' ya 'Power Up' button par lagana
window.openSmartLink = function() {
    console.log("🚀 Opening Smartlink...");
    window.open(ADS_CONFIG.SMARTLINK_URL, '_blank');
};

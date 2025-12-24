/* js/pro-info.js - Content Management System for Info Pages */
/* Optimized for Professional Layout, Legal Safety & Hitech UI */

// --- 1. REUSABLE COMPONENTS ---

// A. The Future Ecosystem Roadmap Box (Blue Neon)
const roadmapBox = `
<div class="roadmap-box" style="border: 1px solid #06b6d4; background: rgba(6,182,212,0.1); border-radius: 12px; padding: 20px; box-shadow: 0 0 20px rgba(6,182,212,0.15); margin-bottom: 20px;">
    <h3 style="color:#22d3ee; display:flex; align-items:center; gap:10px; margin-bottom:10px; font-family:'Orbitron', sans-serif; letter-spacing:1px;">
        <i class="fa-solid fa-microchip"></i> Future Ecosystem Roadmap
    </h3>
    <p style="color:#ecfeff; font-size:0.95rem; line-height:1.6; font-weight:400;">
        While FinGamePro is currently a rewards platform, we are building infrastructure for <b>Phase 2 (Web3 & Decentralization)</b>. Early high-volume coin holders may receive exclusive <b>Airdrop Allocations & Token Benefits</b> in the future. Keep stacking!
    </p>
</div>`;

// B. Native Ad Placeholders (HTML Structure Only - Script injected via JS)
// Note: We use unique IDs (_top, _bottom) so we can target them with JS
const adSpaceTop = `
<div class="native-ad-placeholder top-ad" style="background:rgba(15, 23, 42, 0.5); border:1px dashed #334155; padding:10px; margin-bottom:25px; text-align:center; border-radius:12px; overflow:hidden;">
    <div style="font-size:0.7rem; color:#64748b; margin-bottom:5px; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED</div>
    <div id="ad-injector-top"></div>
</div>`;

const adSpaceBottom = `
<div class="native-ad-placeholder bottom-ad" style="background:rgba(15, 23, 42, 0.5); border:1px dashed #334155; padding:10px; margin-top:35px; text-align:center; border-radius:12px; overflow:hidden;">
    <div style="font-size:0.7rem; color:#64748b; margin-bottom:5px; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED</div>
    <div id="ad-injector-bottom"></div>
</div>`;

// C. Hitech Red Disclaimer Box
const redAlertBox = `
<div class="legal-alert-box" style="border-left: 4px solid #ef4444; background: linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(15,23,42,0) 100%); padding: 20px; margin-bottom: 25px; border-radius: 6px;">
    <h4 style="color:#f87171; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-family:'Orbitron', sans-serif;">
        <i class="fa-solid fa-triangle-exclamation"></i> Important Legal Disclaimer
    </h4>
    <p style="color:#fca5a5; font-size:0.9rem;">Please read this document carefully before participating in the FinGamePro ecosystem.</p>
</div>`;

// --- 2. STYLE HELPER ---
const itemStyle = `margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;`;
const titleStyle = `color: #e2e8f0; font-size: 1.1rem; margin-bottom: 8px; font-weight: 600;`;
const textStyle = `color: #94a3b8; line-height: 1.7; font-size: 0.95rem;`;


// --- 3. CONTENT DATABASE ---
const infoContent = {
    // 1. WITHDRAWAL POLICY
    withdraw_terms: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Current Withdrawal Status: PAUSED</h4>
            <p style="${textStyle}">Direct INR/Fiat withdrawals are currently disabled for all users. We are in the "Accumulation Phase," transitioning our ledger from a standard database to a Blockchain-ready infrastructure.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Nature of Digital Assets</h4>
            <p style="${textStyle}">Coins earned on FinGamePro are "Promotional Reward Points". At this stage, they hold no guaranteed fixed monetary value until the official Phase 2 Token Listing event.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. The "Safe Storage" Protocol</h4>
            <p style="${textStyle}">To protect early adopters, we have activated "Storage Mode". This prevents inflationary dumping of coins and ensures that genuine users get maximum priority.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Phase 2: Liquidity & Airdrops</h4>
            <p style="${textStyle}">Upon the launch of Phase 2, a "Liquidity Pool" will be established. Users will be able to convert their points based on their Leaderboard Rank.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Verification Requirement (KYC)</h4>
            <p style="${textStyle}">Future withdrawals will require mandatory identity verification (KYC). Ensure your profile name matches your legal government ID.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Transaction Fees</h4>
            <p style="${textStyle}">A nominal network fee (Gas Fee) may be deducted from the total withdrawal amount to process the transaction on the blockchain.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Anti-Money Laundering (AML)</h4>
            <p style="${textStyle}">FinGamePro adheres to strict AML policies. Any attempt to cycle illicit funds will result in an immediate permanent ban.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Inactive Accounts</h4>
            <p style="${textStyle}">Accounts inactive for more than 90 days may be considered dormant, and their coin balance may be burned.</p>
        </div>
        ${adSpaceBottom}
    `,

    // 2. TERMS & CONDITIONS
    terms: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Acceptance of Terms</h4>
            <p style="${textStyle}">By accessing FinGamePro, you agree to be bound by these Terms. If you do not agree, please cease using the platform immediately.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Eligibility Criteria</h4>
            <p style="${textStyle}">You must be at least 18 years of age. Users under 18 may use the platform for educational purposes only.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Permitted Use</h4>
            <p style="${textStyle}">You agree to use the platform for personal, non-commercial purposes. Attacks on server infrastructure are criminal offenses.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Earning Mechanics</h4>
            <p style="${textStyle}">Coins are awarded for specific actions. We reserve the right to revoke coins if "Invalid Traffic" or "Bot Activity" is detected.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Prohibited Conduct</h4>
            <p style="${textStyle}">Using VPN/Proxy, Auto-Clickers, Scripts, or Multiple Accounts results in an instant ban.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Account Security</h4>
            <p style="${textStyle}">You are responsible for maintaining the confidentiality of your login credentials.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Termination</h4>
            <p style="${textStyle}">We reserve the right to suspend or terminate your account at any time for violation of these Terms.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Limitation of Liability</h4>
            <p style="${textStyle}">The platform provides services on an "As Is" basis. We are not liable for damages arising from app downtime.</p>
        </div>
        ${adSpaceBottom}
    `,

    // 3. PRIVACY POLICY
    privacy: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Information We Collect</h4>
            <p style="${textStyle}">We collect minimal data: Telegram User ID, Display Name, and Profile Picture. We do NOT access private messages.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Device Data</h4>
            <p style="${textStyle}">We collect IP Address and Device Model to prevent fraud and ensure fair play.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Usage of Data</h4>
            <p style="${textStyle}">Data is used to maintain balances, display rankings, and deliver ads.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Data Sharing</h4>
            <p style="${textStyle}">We DO NOT sell personal data. Data is shared only with ad partners for analytics.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Security</h4>
            <p style="${textStyle}">User data is encrypted and stored on secure Firebase servers.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. User Rights</h4>
            <p style="${textStyle}">You have the right to request account deletion, which results in coin forfeiture.</p>
        </div>
        ${adSpaceBottom}
    `,

    // 4. DISCLAIMER
    disclaimer: `
        ${roadmapBox}
        ${adSpaceTop}
        ${redAlertBox}
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Not a Bank</h4>
            <p style="${textStyle}">FinGamePro is a rewards app, not a bank. Coins are virtual tokens and do not represent a legal debt.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. No Investment Advice</h4>
            <p style="${textStyle}">Nothing on this platform constitutes financial or trading advice.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Compliance</h4>
            <p style="${textStyle}">This platform operates as a "Game of Skill". No real money is requested from users.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Speculative Nature</h4>
            <p style="${textStyle}">References to "Phase 2" or "Airdrops" are forward-looking and speculative.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Volatility</h4>
            <p style="${textStyle}">Digital reward points can be volatile. Conversion rates are subject to change.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Tax Liability</h4>
            <p style="${textStyle}">Users are responsible for reporting and paying taxes on rewards.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. No Guarantee</h4>
            <p style="${textStyle}">Participation does not guarantee a fixed income. Earnings are variable.</p>
        </div>
        ${adSpaceBottom}
    `,

    // 5. FAQ
    faq: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Can I withdraw to Bank/UPI?</h4>
            <p style="${textStyle}">Currently NO. Withdrawal is paused for Phase 2 upgrade. Coins are safe in Storage Mode.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Is this Crypto Mining?</h4>
            <p style="${textStyle}">No. You are earning allocations for a future token, not mining with hardware.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. How to rank up?</h4>
            <p style="${textStyle}">Increase balance by completing tasks, playing games, and referring friends.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Why did balance decrease?</h4>
            <p style="${textStyle}">Coins earned via bots or fake referrals are automatically burned.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Phase 2 Date?</h4>
            <p style="${textStyle}">Scheduled for late 2025. Follow Telegram for updates.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Multiple Accounts?</h4>
            <p style="${textStyle}">Strictly prohibited. Leads to permanent ban.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Ad didn't give coins?</h4>
            <p style="${textStyle}">Ensure you watch the full ad. Network verification takes time.</p>
        </div>
        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Contact Support?</h4>
            <p style="${textStyle}">Use the "Contact Support" page in the menu.</p>
        </div>
        ${adSpaceBottom}
    `
};

// --- LOGIC TO OPEN PAGES & INJECT ADS ---
function openInfoPage(pageKey) {
    const page = document.getElementById('page-info');
    const titleEl = document.getElementById('info-title');
    const contentEl = document.getElementById('info-content');
    
    const titles = {
        'withdraw_terms': 'Withdrawal Policy',
        'terms': 'Terms of Service',
        'privacy': 'Privacy Policy',
        'disclaimer': 'Legal Disclaimer',
        'faq': 'Help & FAQ'
    };

    if(page && contentEl) {
        // 1. Set Title & HTML Content
        titleEl.innerText = titles[pageKey] || 'Information';
        contentEl.innerHTML = infoContent[pageKey] || '<p>Content not found.</p>';
        
        // 2. Show Page
        page.classList.remove('hidden');
        if(window.toggleProfileMenu) window.toggleProfileMenu(false);

        // 3. ⚡ MANUAL AD INJECTION (Fix for innerHTML) ⚡
        // Timeout is needed to ensure DOM elements exist before we inject script
        setTimeout(() => {
            injectNativeAd('ad-injector-top', 'container-85c8e4eb0a60d8ad0292343f4d54b04b');
            injectNativeAd('ad-injector-bottom', 'container-85c8e4eb0a60d8ad0292343f4d54b04b'); 
        }, 100);
    }
}

// Helper Function to Create Ad Script dynamically
function injectNativeAd(wrapperId, adsterraContainerId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    // Clear previous ads if any
    wrapper.innerHTML = '';

    // A. Create the DIV Adsterra looks for
    // Note: HTML IDs must be unique. Using the same code twice on one page might cause conflict 
    // in some browsers, but we try to force it by clearing and re-appending.
    const adDiv = document.createElement('div');
    adDiv.id = adsterraContainerId; 
    wrapper.appendChild(adDiv);

    // B. Create and Run the Script
    const s = document.createElement('script');
    s.src = "//pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js";
    s.async = true;
    s.dataset.cfasync = "false";
    
    // Append script to the wrapper to execute it
    wrapper.appendChild(s);
    console.log("Native Ad Injected in: " + wrapperId);
}

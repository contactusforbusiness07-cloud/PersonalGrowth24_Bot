/* js/pro-info.js - Content Management System for Info Pages */
/* Optimized for Professional Layout, Legal Safety & Hitech UI */

// --- 1. REUSABLE COMPONENTS ---

// A. Roadmap Box
const roadmapBox = `
<div class="roadmap-box" style="border: 1px solid #06b6d4; background: rgba(6,182,212,0.1); border-radius: 12px; padding: 20px; box-shadow: 0 0 20px rgba(6,182,212,0.15); margin-bottom: 20px;">
    <h3 style="color:#22d3ee; display:flex; align-items:center; gap:10px; margin-bottom:10px; font-family:'Orbitron', sans-serif; letter-spacing:1px;">
        <i class="fa-solid fa-microchip"></i> Future Ecosystem Roadmap
    </h3>
    <p style="color:#ecfeff; font-size:0.95rem; line-height:1.6; font-weight:400;">
        While FinGamePro is currently a rewards platform, we are building infrastructure for <b>Phase 2 (Web3 & Decentralization)</b>. Early high-volume coin holders may receive exclusive <b>Airdrop Allocations & Token Benefits</b> in the future. Keep stacking!
    </p>
</div>`;

// B. Native Ad Placeholders (Iframe Targets)
const adSpaceTop = `
<div class="native-ad-placeholder top-ad" style="background:rgba(15, 23, 42, 0.5); border:1px dashed #334155; padding:10px; margin-bottom:25px; text-align:center; border-radius:12px; overflow:hidden;">
    <div style="font-size:0.7rem; color:#64748b; margin-bottom:5px; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED</div>
    <div id="ad-frame-top" style="width:100%; overflow:hidden;"></div>
</div>`;

const adSpaceBottom = `
<div class="native-ad-placeholder bottom-ad" style="background:rgba(15, 23, 42, 0.5); border:1px dashed #334155; padding:10px; margin-top:35px; text-align:center; border-radius:12px; overflow:hidden;">
    <div style="font-size:0.7rem; color:#64748b; margin-bottom:5px; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED</div>
    <div id="ad-frame-bottom" style="width:100%; overflow:hidden;"></div>
</div>`;

// C. Disclaimer Box
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
        <div style="${itemStyle}"><h4 style="${titleStyle}">1. Current Withdrawal Status: PAUSED</h4><p style="${textStyle}">Direct INR/Fiat withdrawals are currently disabled. We are in the "Accumulation Phase".</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">2. Nature of Digital Assets</h4><p style="${textStyle}">Coins are "Promotional Reward Points" with no fixed value until Phase 2 Listing.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">3. The "Safe Storage" Protocol</h4><p style="${textStyle}">"Storage Mode" prevents dumping and prioritizes genuine HODLers.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">4. Phase 2: Liquidity & Airdrops</h4><p style="${textStyle}">Liquidity Pool will allow point conversion based on Rank.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">5. Verification (KYC)</h4><p style="${textStyle}">Future withdrawals require mandatory KYC.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">6. Transaction Fees</h4><p style="${textStyle}">Gas Fees may apply on blockchain transactions.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">7. Anti-Money Laundering</h4><p style="${textStyle}">Illicit fund cycling leads to a permanent ban.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">8. Inactive Accounts</h4><p style="${textStyle}">90+ days inactivity may lead to coin burn.</p></div>
        ${adSpaceBottom}
    `,

    // 2. TERMS & CONDITIONS
    terms: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}"><h4 style="${titleStyle}">1. Acceptance</h4><p style="${textStyle}">By using FinGamePro, you agree to these Terms.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">2. Eligibility</h4><p style="${textStyle}">Must be 18+. Under 18 for educational use only.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">3. Permitted Use</h4><p style="${textStyle}">Personal use only. No attacks on server.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">4. Earning Mechanics</h4><p style="${textStyle}">Coins can be revoked for Invalid Traffic.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">5. Prohibited Conduct</h4><p style="${textStyle}">No VPN, Auto-Clickers, or Multiple Accounts.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">6. Security</h4><p style="${textStyle}">Protect your login credentials.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">7. Intellectual Property</h4><p style="${textStyle}">Content belongs to FinGamePro.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">8. Termination</h4><p style="${textStyle}">We may suspend accounts for violations.</p></div>
        ${adSpaceBottom}
    `,

    // 3. PRIVACY POLICY
    privacy: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}"><h4 style="${titleStyle}">1. Data Collection</h4><p style="${textStyle}">Minimal data: Telegram ID, Name, Picture.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">2. Device Data</h4><p style="${textStyle}">IP & Device Model collected for fraud prevention.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">3. Usage</h4><p style="${textStyle}">Used for balances, rankings, and ads.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">4. Sharing</h4><p style="${textStyle}">Data not sold. Shared only with ad partners.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">5. Security</h4><p style="${textStyle}">Encrypted storage on Firebase.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">6. User Rights</h4><p style="${textStyle}">Account deletion leads to coin loss.</p></div>
        ${adSpaceBottom}
    `,

    // 4. DISCLAIMER
    disclaimer: `
        ${roadmapBox}
        ${adSpaceTop}
        ${redAlertBox}
        <div style="${itemStyle}"><h4 style="${titleStyle}">1. Not a Bank</h4><p style="${textStyle}">Coins are virtual tokens, not legal tender.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">2. No Advice</h4><p style="${textStyle}">No financial or investment advice provided.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">3. Compliance</h4><p style="${textStyle}">"Game of Skill" model compliant with Indian laws.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">4. Speculative</h4><p style="${textStyle}">Phase 2 & Airdrops are forward-looking statements.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">5. Volatility</h4><p style="${textStyle}">Rewards value can fluctuate.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">6. Tax</h4><p style="${textStyle}">User responsible for applicable taxes.</p></div>
        ${adSpaceBottom}
    `,

    // 5. FAQ
    faq: `
        ${roadmapBox}
        ${adSpaceTop}
        <div style="${itemStyle}"><h4 style="${titleStyle}">1. Withdraw to Bank?</h4><p style="${textStyle}">Paused for Phase 2. Coins are safe.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">2. Crypto Mining?</h4><p style="${textStyle}">No. You earn allocations, not mine with hardware.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">3. Rank Up?</h4><p style="${textStyle}">Complete tasks, play games, refer friends.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">4. Balance Decreased?</h4><p style="${textStyle}">Fake/Bot coins are automatically burned.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">5. Launch Date?</h4><p style="${textStyle}">Late 2025. Check Telegram.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">6. Multiple Accounts?</h4><p style="${textStyle}">Prohibited. Leads to ban.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">7. No Coins from Ad?</h4><p style="${textStyle}">Watch full ad for network verification.</p></div>
        <div style="${itemStyle}"><h4 style="${titleStyle}">8. Support?</h4><p style="${textStyle}">Use "Contact Support" in menu.</p></div>
        ${adSpaceBottom}
    `
};

// --- LOGIC TO OPEN PAGES & INJECT IFRAME ADS ---
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
        // 1. Set Title & Content
        titleEl.innerText = titles[pageKey] || 'Information';
        contentEl.innerHTML = infoContent[pageKey] || '<p>Content not found.</p>';
        
        // 2. Show Page
        page.classList.remove('hidden');
        if(window.toggleProfileMenu) window.toggleProfileMenu(false);

        // 3. ⚡ INJECT ADS USING IFRAMES (Solves Conflicts & Rendering Issues) ⚡
        setTimeout(() => {
            renderAdIframe('ad-frame-top');
            renderAdIframe('ad-frame-bottom');
        }, 100);
    }
}

// 🔥 POWERFUL IFRAME INJECTOR 🔥
// Ye function ek alag sandboxed window banata hai jisme Ad load hota hai.
// Isse Adsterra confuse nahi hota aur ads 100% dikhte hain.
function renderAdIframe(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ""; // Clear old

    const iframe = document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "150px"; // Height fix for visibility
    iframe.style.border = "none";
    iframe.scrolling = "no";
    
    container.appendChild(iframe);

    // Write Ad Code inside the Iframe
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head>
        <body>
            <div id="container-85c8e4eb0a60d8ad0292343f4d54b04b"></div>
            <script async="async" data-cfasync="false" src="//pl28285595.effectivegatecpm.com/85c8e4eb0a60d8ad0292343f4d54b04b/invoke.js"></script>
        </body>
        </html>
    `);
    doc.close();
}

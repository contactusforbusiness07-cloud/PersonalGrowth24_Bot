/* js/pro-info.js - Content Management System for Info Pages */
/* Optimized for Professional Layout, Legal Safety & Hitech UI */

// --- 1. REUSABLE COMPONENTS ---

// A. The Future Ecosystem Roadmap Box (Blue Neon) - Must be on ALL pages
const roadmapBox = `
<div class="roadmap-box" style="border: 1px solid #06b6d4; background: rgba(6,182,212,0.1); border-radius: 12px; padding: 20px; box-shadow: 0 0 20px rgba(6,182,212,0.15); margin-bottom: 20px;">
    <h3 style="color:#22d3ee; display:flex; align-items:center; gap:10px; margin-bottom:10px; font-family:'Orbitron', sans-serif; letter-spacing:1px;">
        <i class="fa-solid fa-microchip"></i> Future Ecosystem Roadmap
    </h3>
    <p style="color:#ecfeff; font-size:0.95rem; line-height:1.6; font-weight:400;">
        While FinGamePro is currently a rewards platform, we are building infrastructure for <b>Phase 2 (Web3 & Decentralization)</b>. Early high-volume coin holders may receive exclusive <b>Airdrop Allocations & Token Benefits</b> in the future. Keep stacking!
    </p>
</div>`;

// B. Native Ad Placeholders
const adSpaceTop = `<div class="native-ad-placeholder top-ad" style="background:#0f172a; border:1px dashed #334155; padding:15px; margin-bottom:25px; text-align:center; border-radius:8px; color:#64748b; font-size:0.8rem; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED AD (TOP)</div>`;

const adSpaceBottom = `<div class="native-ad-placeholder bottom-ad" style="background:#0f172a; border:1px dashed #334155; padding:15px; margin-top:35px; text-align:center; border-radius:8px; color:#64748b; font-size:0.8rem; letter-spacing:1px;"><i class="fa-solid fa-ad"></i> SPONSORED AD (BOTTOM)</div>`;

// C. Hitech Red Disclaimer Box (For Disclaimer Page)
const redAlertBox = `
<div class="legal-alert-box" style="border-left: 4px solid #ef4444; background: linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(15,23,42,0) 100%); padding: 20px; margin-bottom: 25px; border-radius: 6px;">
    <h4 style="color:#f87171; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-family:'Orbitron', sans-serif;">
        <i class="fa-solid fa-triangle-exclamation"></i> Important Legal Disclaimer
    </h4>
    <p style="color:#fca5a5; font-size:0.9rem;">Please read this document carefully before participating in the FinGamePro ecosystem.</p>
</div>`;

// --- 2. STYLE HELPER FOR LIST ITEMS (To fix "Chipka Hua" text) ---
const itemStyle = `margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;`;
const titleStyle = `color: #e2e8f0; font-size: 1.1rem; margin-bottom: 8px; font-weight: 600;`;
const textStyle = `color: #94a3b8; line-height: 1.7; font-size: 0.95rem;`;


// --- 3. CONTENT DATABASE ---
const infoContent = {
    
    // ===========================================
    // 1. WITHDRAWAL POLICY
    // ===========================================
    withdraw_terms: `
        ${roadmapBox}
        ${adSpaceTop}

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Current Withdrawal Status: PAUSED</h4>
            <p style="${textStyle}">Direct INR/Fiat withdrawals are currently disabled for all users. We are in the "Accumulation Phase," transitioning our ledger from a standard database to a Blockchain-ready infrastructure. Your balance is secure in the "In-App Vault".</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Nature of Digital Assets</h4>
            <p style="${textStyle}">Coins earned on FinGamePro are "Promotional Reward Points" generated through user engagement (Ads, Tasks, Games). At this stage, they hold no guaranteed fixed monetary value until the official Phase 2 Token Listing event.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. The "Safe Storage" Protocol</h4>
            <p style="${textStyle}">To protect early adopters, we have activated "Storage Mode". This prevents inflationary dumping of coins and ensures that genuine users who hold (HODL) their balance get maximum priority during the ecosystem launch.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Phase 2: Liquidity & Airdrops</h4>
            <p style="${textStyle}">Upon the launch of Phase 2, a "Liquidity Pool" will be established. Users will be able to convert their points based on their Leaderboard Rank. Higher ranks will receive a more favorable conversion ratio.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Verification Requirement (KYC)</h4>
            <p style="${textStyle}">Future withdrawals will require mandatory identity verification (KYC) to comply with Indian financial regulations. Ensure your profile name matches your legal government ID.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Transaction Fees (Gas Fees)</h4>
            <p style="${textStyle}">When the decentralized gateway opens, a nominal network fee (Gas Fee) may be deducted from the total withdrawal amount to process the transaction on the blockchain.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Minimum Thresholds</h4>
            <p style="${textStyle}">To maintain network stability, minimum withdrawal limits will be dynamic. These limits will be determined by the current market supply and demand of the reward pool.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Anti-Money Laundering (AML)</h4>
            <p style="${textStyle}">FinGamePro adheres to strict AML policies. Any attempt to cycle illicit funds or manipulate the reward system for money laundering will result in an immediate permanent ban.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">9. Forfeiture of Inactive Accounts</h4>
            <p style="${textStyle}">Accounts that remain inactive (no login) for more than 90 consecutive days may be considered dormant, and their coin balance may be burned (removed) from the supply.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">10. Right to Modify</h4>
            <p style="${textStyle}">The management reserves the right to adjust withdrawal limits, conversion rates, and payment methods based on regulatory updates and ecosystem health without prior notice.</p>
        </div>

        ${adSpaceBottom}
    `,


    // ===========================================
    // 2. TERMS & CONDITIONS
    // ===========================================
    terms: `
        ${roadmapBox}
        ${adSpaceTop}

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Acceptance of Terms</h4>
            <p style="${textStyle}">By accessing FinGamePro, you agree to be bound by these Terms. If you do not agree to these terms, including the mandatory arbitration provision and class action waiver, please cease using the platform immediately.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Eligibility Criteria</h4>
            <p style="${textStyle}">You must be at least 18 years of age to participate in financial reward activities. Users under 18 may use the platform for educational and gaming purposes only, without withdrawal rights.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Permitted Use</h4>
            <p style="${textStyle}">You agree to use the platform for personal, non-commercial purposes. Any attempt to reverse engineer, clone, or attack the server infrastructure is a criminal offense.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Earning Mechanics</h4>
            <p style="${textStyle}">Coins are awarded for specific actions: Viewing Ads, Completing Tasks, and Playing Games. We reserve the right to revoke coins if the ad network reports "Invalid Traffic" or "Bot Activity" from your device.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Prohibited Conduct (Zero Tolerance)</h4>
            <p style="${textStyle}">The following actions result in an instant ban: Using VPN/Proxy, Auto-Clickers, Scripts, Multiple Accounts on one device, or Spamming referral codes in unauthorized zones.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Account Security</h4>
            <p style="${textStyle}">You are responsible for maintaining the confidentiality of your login credentials. FinGamePro is not liable for any loss of assets due to compromised user accounts or phishing attacks.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Intellectual Property</h4>
            <p style="${textStyle}">All content, logos, game mechanics, and code are the exclusive property of FinGamePro. Unauthorized redistribution or modification of our assets is strictly prohibited.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Termination of Service</h4>
            <p style="${textStyle}">We reserve the right to suspend or terminate your account at any time, for any reason, including but not limited to a violation of these Terms or suspected fraudulent activity.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">9. Limitation of Liability</h4>
            <p style="${textStyle}">The platform provides services on an "As Is" basis. We are not liable for any direct, indirect, or consequential damages arising from app downtime, data loss, or reward value fluctuations.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">10. Governing Law</h4>
            <p style="${textStyle}">These terms are governed by the laws of India. Any disputes arising from the use of this platform shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
        </div>

        ${adSpaceBottom}
    `,


    // ===========================================
    // 3. PRIVACY POLICY
    // ===========================================
    privacy: `
        ${roadmapBox}
        ${adSpaceTop}

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Commitment to Privacy</h4>
            <p style="${textStyle}">Your privacy is our priority. This policy outlines how we collect, use, and safeguard your information while you navigate the FinGamePro ecosystem.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Information We Collect</h4>
            <p style="${textStyle}">We collect minimal data required for ledger operations: Telegram User ID, Display Name, and Profile Picture. We do NOT access your private messages, contacts, or phone number.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Device & Technical Data</h4>
            <p style="${textStyle}">To prevent fraud, we automatically collect technical identifiers such as IP Address, Device Model, OS Version, and Advertising ID. This ensures fair play on the leaderboard.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Usage of Data</h4>
            <p style="${textStyle}">Your data is used to: Maintain accurate coin balances, Display global rankings, Process future payouts, and Deliver personalized advertising experiences.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Data Sharing Policy</h4>
            <p style="${textStyle}">We strictly DO NOT sell your personal data to third-party data brokers. Data is only shared with trusted partners (like Ad Networks) for the purpose of serving ads and analytics.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Cookies and Tracking</h4>
            <p style="${textStyle}">We use cookies and similar technologies to enhance user experience and analyze traffic. You can control cookie preferences through your browser settings, though this may affect app functionality.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Data Storage & Security</h4>
            <p style="${textStyle}">All user data is encrypted using industry-standard protocols and stored on secure Firebase (Google Cloud) servers. We implement strict access controls to prevent unauthorized data breaches.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. User Rights</h4>
            <p style="${textStyle}">You have the right to request the deletion of your account and associated data. Please note that data deletion is permanent and results in the forfeiture of all earned coins.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">9. Children's Privacy</h4>
            <p style="${textStyle}">We do not knowingly collect personal information from children under the age of 13. If we discover such data, it will be deleted immediately from our servers.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">10. Policy Updates</h4>
            <p style="${textStyle}">We may update this Privacy Policy to reflect changes in our practices or legal requirements. Continued use of the platform implies acceptance of the updated policy.</p>
        </div>

        ${adSpaceBottom}
    `,


    // ===========================================
    // 4. LEGAL DISCLAIMER (Safe for India)
    // ===========================================
    disclaimer: `
        ${roadmapBox}
        ${adSpaceTop}
        ${redAlertBox}

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Not a Banking Institution</h4>
            <p style="${textStyle}">FinGamePro is a gamified rewards application, not a bank or financial institution. The "Coins" displayed are virtual tokens used for tracking user engagement and do not represent a legal debt or deposit.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. No Investment Advice</h4>
            <p style="${textStyle}">Nothing on this platform constitutes financial, investment, or trading advice. We do not recommend buying, selling, or holding any specific cryptocurrency or digital asset based on app content.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. Compliance with Indian Laws</h4>
            <p style="${textStyle}">This platform operates as a "Game of Skill" and "Loyalty Program". We do not support gambling, betting, or wagering. No real money is requested from users to participate, ensuring full compliance with Indian Gaming Laws.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Speculative Nature of Rewards</h4>
            <p style="${textStyle}">References to "Phase 2", "Tokens", or "Airdrops" are forward-looking statements regarding our roadmap. These are speculative and depend on market conditions. Past performance does not guarantee future results.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. Third-Party Risks</h4>
            <p style="${textStyle}">The app may contain links to third-party websites or ads. We are not responsible for the content, privacy policies, or practices of any third-party services you interact with.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Volatility Warning</h4>
            <p style="${textStyle}">Digital assets and reward points can be highly volatile. The conversion rate of coins to any future value is subject to change without prior notice based on ecosystem economics.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. Tax Liability</h4>
            <p style="${textStyle}">Users are solely responsible for reporting and paying any applicable taxes on rewards received from this platform, in accordance with the tax laws of their respective jurisdiction (e.g., TDS in India).</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. No Guarantee of Earnings</h4>
            <p style="${textStyle}">Participation in tasks or games does not guarantee a fixed income. Earnings are variable and depend on ad inventory, user location, and individual effort.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">9. System Availability</h4>
            <p style="${textStyle}">We do not guarantee 100% uptime. The platform may undergo maintenance or face technical issues that could temporarily disrupt coin accumulation or access.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">10. Acceptance of Risk</h4>
            <p style="${textStyle}">By using this app, you acknowledge that you understand the risks involved in digital reward platforms and agree that FinGamePro is not liable for any losses incurred.</p>
        </div>

        ${adSpaceBottom}
    `,


    // ===========================================
    // 5. HELP / FAQ
    // ===========================================
    faq: `
        ${roadmapBox}
        ${adSpaceTop}

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">1. Can I withdraw money to my Bank/UPI?</h4>
            <p style="${textStyle}">Currently, NO. The direct withdrawal gateway is paused as we upgrade to the Phase 2 Ecosystem. Your coins are safe in "Storage Mode" and will be eligible for the future Airdrop/Token event.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">2. Is this a Crypto Mining App?</h4>
            <p style="${textStyle}">Not exactly. It is a "Web3 Loyalty Platform". You are not mining crypto with your phone's hardware; you are earning "allocations" for a future decentralized token by being an active community member.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">3. How do I rank up on the Leaderboard?</h4>
            <p style="${textStyle}">Ranking is based on your total coin balance. You can increase your balance by completing high-paying tasks, playing mini-games daily, and inviting active friends via your referral link.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">4. Why did my coin balance decrease?</h4>
            <p style="${textStyle}">Balances are usually stable. However, if our anti-fraud system detects that coins were earned via bots or fake referrals, those specific coins are automatically burned (deducted) from your wallet.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">5. When is the Phase 2 Launch date?</h4>
            <p style="${textStyle}">Phase 2 is scheduled for late 2025. However, roadmap dates are subject to technical readiness. Please follow our official Telegram Channel for real-time announcements.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">6. Can I create multiple accounts?</h4>
            <p style="${textStyle}">No. Multiple accounts on a single device or IP address are strictly prohibited. Detecting this activity will lead to a permanent ban of all associated accounts.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">7. My Task/Ad didn't give me coins?</h4>
            <p style="${textStyle}">This happens if the ad network fails to verify the view (e.g., closing the ad too fast). Please ensure you watch the ad till the end and have a stable internet connection.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">8. Is my data safe with you?</h4>
            <p style="${textStyle}">Yes. We use enterprise-grade encryption to store your data. We do not sell your personal information to third-party telemarketers or spammers.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">9. Can I transfer coins to a friend?</h4>
            <p style="${textStyle}">Peer-to-Peer (P2P) transfers are currently disabled to prevent black-market trading of accounts. This feature may be introduced in a future update.</p>
        </div>

        <div style="${itemStyle}">
            <h4 style="${titleStyle}">10. How do I contact support?</h4>
            <p style="${textStyle}">For technical issues, use the "Contact Support" page in the menu. Please note that spamming support for free coins will result in a mute or ban.</p>
        </div>

        ${adSpaceBottom}
    `
};

// --- LOGIC TO OPEN PAGES ---
function openInfoPage(pageKey) {
    const page = document.getElementById('page-info');
    const titleEl = document.getElementById('info-title');
    const contentEl = document.getElementById('info-content');
    
    // Map Titles
    const titles = {
        'withdraw_terms': 'Withdrawal Policy',
        'terms': 'Terms of Service',
        'privacy': 'Privacy Policy',
        'disclaimer': 'Legal Disclaimer',
        'faq': 'Help & FAQ'
    };

    if(page && contentEl) {
        // Set Content
        titleEl.innerText = titles[pageKey] || 'Information';
        contentEl.innerHTML = infoContent[pageKey] || '<p>Content not found.</p>';
        
        // Show Page
        page.classList.remove('hidden');
        
        // Close Menu if open
        if(window.toggleProfileMenu) window.toggleProfileMenu(false);
    }
}

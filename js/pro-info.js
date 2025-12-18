// --- DYNAMIC INFORMATION SYSTEM ---

// 1. The "Crypto Hint" Widget (Appears in specific sections)
const FUTURE_HINT_WIDGET = `
    <div class="future-roadmap-box">
        <h4><i class="fa-solid fa-layer-group"></i> Ecosystem Roadmap</h4>
        <p>While coins are currently promotional, early adopters and high-volume holders may receive exclusive benefits in our upcoming <strong>Web3 & Decentralized Phase (Phase 2)</strong>. Keep earning!</p>
    </div>
`;

// 2. Ad Banner HTML
const AD_TOP = `<div class="ad-banner-placeholder"><span>📢 SPONSORED AD (TOP)</span></div>`;
const AD_BOTTOM = `<div class="ad-banner-placeholder"><span>📢 SPONSORED AD (BOTTOM)</span></div>`;

// 3. Content Database
const INFO_DB = {
    
    // --- WITHDRAWAL TERMS ---
    'withdraw_terms': `
        ${AD_TOP}
        <div class="legal-text-block">
            <p><strong>Effective Date:</strong> December 18, 2025</p>

            ${FUTURE_HINT_WIDGET} 

            <h3>1. Nature of Reward Coins</h3>
            <p>All coins earned on this platform are strictly <strong>promotional reward points</strong>. They do not represent real money, cryptocurrency, securities, or financial instruments of any kind at this stage.</p>

            <h3>2. Coin Earning Policy</h3>
            <p>Coins are awarded solely for user engagement and activity completion. Earning coins does not create any financial entitlement or guaranteed income liability on the platform.</p>

            <h3>3. Withdrawal Eligibility</h3>
            <p>Only the <strong>Top 10 Ranked Users</strong> (based on the internal leaderboard) may be eligible to convert reward coins into real money. This facility is discretionary and promotional.</p>

            <h3>4. Coin-to-Money Conversion</h3>
            <ul>
                <li><strong>Formula:</strong> Total Coins / 10,000 = Monetary Value (INR).</li>
                <li><strong>Modification:</strong> Rates are subject to change without prior notice based on platform revenue.</li>
            </ul>

            <h3>5. Taxes & Compliance</h3>
            <p>Any monetary reward is subject to applicable Indian laws, including TDS and Income Tax. Users are solely responsible for their tax liabilities.</p>

            <h3>6. No Gambling / Betting</h3>
            <p>This platform involves NO gambling, betting, or lottery activities. Rewards are purely based on skill, time, and promotional engagement.</p>
        </div>
        ${AD_BOTTOM}
    `,

    // --- TERMS & CONDITIONS ---
    'terms': `
        ${AD_TOP}
        <div class="legal-text-block">
            <p>By using the FinGamePro Platform, you agree to these Terms & Conditions.</p>

            <h3>1. Platform Overview</h3>
            <p>This is an entertainment and utility-based application designed for students and professionals. It allows users to access tools and participate in promotional activities.</p>

            <h3>2. Reward Coins</h3>
            <p>Coins are promotional incentives. They are not legal tender. However, consistent engagement may unlock future ecosystem privileges.</p>

            <h3>3. Prohibited Activities</h3>
            <p><strong>Strictly Prohibited:</strong></p>
            <ul>
                <li>Using scripts, bots, or automation tools.</li>
                <li>Creating fake accounts for referrals.</li>
                <li>Exploiting technical loopholes.</li>
            </ul>
            <p>⚠️ <em>Violation will result in an immediate permanent ban and forfeiture of all coins.</em></p>

            <h3>4. Account Suspension</h3>
            <p>The Platform reserves the right to suspend or terminate accounts found engaging in suspicious or fraudulent behavior without liability.</p>

            <h3>5. Disclaimer of Warranties</h3>
            <p>The platform is provided "as is". We make no warranties regarding uptime, data accuracy, or guaranteed earnings.</p>

            <h3>6. Governing Law</h3>
            <p>These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of Indian courts.</p>
        </div>
        ${AD_BOTTOM}
    `,

    // --- PRIVACY POLICY ---
    'privacy': `
        ${AD_TOP}
        <div class="legal-text-block">
            <p>Your privacy is critical to us. This policy outlines how we handle your data.</p>

            <h3>1. Information We Collect</h3>
            <ul>
                <li><strong>Personal:</strong> Name, User ID (via Telegram), and payment details (only during withdrawal).</li>
                <li><strong>Activity:</strong> Tasks completed, ads viewed, and game scores.</li>
            </ul>

            <h3>2. How We Use Data</h3>
            <p>We use your data to verify identity, prevent fraud, process promotional payouts, and improve app performance.</p>

            <h3>3. Data Sharing</h3>
            <p>We <strong>DO NOT</strong> sell your personal data. Data is only shared if required by law or for security compliance.</p>

            <h3>4. Data Security</h3>
            <p>We implement industry-standard measures to protect your information. However, no digital platform is 100% secure.</p>

            <h3>5. User Consent</h3>
            <p>By using the platform, you consent to the collection and use of information as described in this policy.</p>
        </div>
        ${AD_BOTTOM}
    `,

    // --- DISCLAIMER ---
    'disclaimer': `
        ${AD_TOP}
        <div class="legal-text-block">
            <h3>1. No Guarantee of Earnings</h3>
            <p>FinGamePro does not guarantee any income, profit, or employment. Rewards are variable and depend on platform revenue and user eligibility.</p>

            <h3>2. Promotional Nature</h3>
            <p>Coins are currently promotional points. While we are exploring <strong>blockchain integration</strong> for the future, coins currently hold no external monetary value.</p>

            <h3>3. Not an Investment</h3>
            <p>This platform is NOT an investment scheme, chit fund, or financial product. Do not invest money expecting returns.</p>

            <h3>4. Limitation of Liability</h3>
            <p>The platform owners are not liable for any direct or indirect losses, technical failures, or reward cancellations.</p>
        </div>
        ${AD_BOTTOM}
    `,

    // --- FAQ ---
    'faq': `
        ${AD_TOP}
        <div class="legal-text-block">
            <h3>1. What is FinGamePro?</h3>
            <p>It is a utility and entertainment platform where you can use tools, play games, and earn promotional coins.</p>

            <h3>2. What is the value of 1 Coin?</h3>
            <p>Coins are promotional. For withdrawal eligible users, the current conversion estimate is 10,000 Coins = ₹1 (subject to change).</p>
            
            ${FUTURE_HINT_WIDGET}

            <h3>3. Can I withdraw money?</h3>
            <p>Only users in the Top 10 Leaderboard are eligible for promotional withdrawals. This ensures rewards go to genuine, active users.</p>

            <h3>4. Why was I banned?</h3>
            <p>Common reasons include: Using bots, fake referrals, or multiple accounts on one device.</p>

            <h3>5. Is this a crypto project?</h3>
            <p>Currently, it is a Web2 reward platform. However, we are actively researching <strong>Tokenization</strong>. Accumulating coins now <em>might</em> be beneficial for future phases.</p>

            <h3>6. How to contact support?</h3>
            <p>Go to the Menu -> Contact Support for live chat assistance.</p>
        </div>
        ${AD_BOTTOM}
    `
};

// --- RENDER FUNCTION ---
window.openInfoPage = function(pageKey) {
    const titleMap = {
        'withdraw_terms': 'Withdrawal Policy',
        'terms': 'Terms & Conditions',
        'privacy': 'Privacy Policy',
        'disclaimer': 'Disclaimer',
        'faq': 'Help & FAQ'
    };

    // 1. UI Updates
    document.getElementById('info-title').innerText = titleMap[pageKey] || 'Information';
    document.getElementById('info-content').innerHTML = INFO_DB[pageKey] || "<p>Content Unavailable</p>";

    // 2. Navigation
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-info').classList.remove('hidden');

    // 3. Close Menu
    if(window.toggleProfileMenu) window.toggleProfileMenu(false);
}


/* js/pro-info.js - Content Management System for Info Pages */
/* Optimized for Indian Legal Safety, Ad Monetization & Web3 Vibe */

// --- AD PLACEHOLDER HELPER ---
const adSpaceTop = `<div class="native-ad-placeholder top-ad" style="background:#0f172a; border:1px dashed #334155; padding:15px; margin-bottom:20px; text-align:center; border-radius:8px; color:#64748b; font-size:0.8rem;"><i class="fa-solid fa-ad"></i> SPONSORED AD (TOP)</div>`;

const adSpaceBottom = `<div class="native-ad-placeholder bottom-ad" style="background:#0f172a; border:1px dashed #334155; padding:15px; margin-top:30px; text-align:center; border-radius:8px; color:#64748b; font-size:0.8rem;"><i class="fa-solid fa-ad"></i> SPONSORED AD (BOTTOM)</div>`;

// Content Database
const infoContent = {
    
    // 1. WITHDRAWAL TERMS (Smart Safe Logic)
    withdraw_terms: `
        ${adSpaceTop}

        <div class="info-card" style="border: 1px solid #06b6d4; background: rgba(6,182,212,0.1); box-shadow: 0 0 15px rgba(6,182,212,0.2);">
            <h3 style="color:#22d3ee; text-shadow: 0 0 5px #22d3ee;"><i class="fa-solid fa-microchip"></i> Future Ecosystem Roadmap</h3>
            <p style="color:#ecfeff; font-size:0.95rem; line-height:1.6;">
                While FinGamePro is currently a rewards platform, we are building infrastructure for <b>Phase 2 (Web3 & Decentralization)</b>. Early high-volume coin holders may receive exclusive <b>Airdrop Allocations & Token Benefits</b> in the future. Keep stacking!
            </p>
        </div>
        <h4 class="mt-4 gradient-text">1. Nature of Promotional Coins</h4>
        <p class="legal-text">
            Coins earned on this platform are "Loyalty Reward Points" given for user engagement. They do not represent real fiat currency (INR/USD), securities, or financial instruments. They are digital markers for your contribution to the ecosystem.
        </p>

        <h4 class="mt-4 gradient-text">2. Withdrawal Status: PAUSED</h4>
        <p class="legal-text">
            Direct INR withdrawals are temporarily disabled as we transition to the <b>Blockchain Ledger System</b>. All user balances are securely stored in the "In-App Vault".
        </p>

        <h4 class="mt-4 gradient-text">3. Eligibility for Future Benefits</h4>
        <p class="legal-text">
            In Phase 2, value distribution will be strictly based on:
            <br>• <b>Leaderboard Rank:</b> Higher rank = Higher allocation.
            <br>• <b>Wallet Age:</b> Older active wallets get priority.
            <br>• <b>Fair Play:</b> Accounts flagged for bot activity will be disqualified.
        </p>

        ${adSpaceBottom}
    `,

    // 2. HELP / FAQ (Crypto Hints + Legal Safety)
    faq: `
        ${adSpaceTop}

        <div class="faq-item">
            <h4>1. Can I withdraw money right now?</h4>
            <p>Currently, direct withdrawals are <b>disabled</b> for maintenance and infrastructure upgrades. Your coins are being accumulated in "Storage Mode". Focus on increasing your balance to maximize your share when the <b>Phase 2 Liquidity Event</b> goes live.</p>
        </div>

        <div class="faq-item">
            <h4>2. Is this a Crypto Project? 🚀</h4>
            <p>FinGamePro operates as a Web2 reward platform today, but we are actively developing <b>Tokenization & Blockchain Integration</b> layers. Accumulating coins now is essentially "Mining" your position for the future decentralized economy.</p>
        </div>

        <div class="faq-item">
            <h4>3. How do I increase my earnings?</h4>
            <p>You can maximize your portfolio by:
            <br>• <b>Daily Tasks:</b> Completing sponsored missions.
            <br>• <b>Referral Mining:</b> Inviting real users to your network.
            <br>• <b>Games:</b> Participating in skill-based mini-games.</p>
        </div>

        <div class="faq-item">
            <h4>4. Why was my account banned?</h4>
            <p>We have a zero-tolerance policy towards fraud. Bans are issued for:
            <br>• Using auto-clickers or scripts.
            <br>• Creating fake referral accounts on the same device.
            <br>• Using VPNs to manipulate ad rewards.</p>
        </div>

        <div class="faq-item">
            <h4>5. Is chatting/support allowed for rewards?</h4>
            <p>No. Asking for free coins or spamming support chat results in an immediate penalty. Rewards must be earned via platform activities only.</p>
        </div>

        ${adSpaceBottom}
    `,

    // 3. TERMS & CONDITIONS (Standard Legal Safety)
    terms: `
        ${adSpaceTop}

        <h3>User Agreement</h3>
        <p>By accessing or using the FinGamePro web application ("Platform"), you agree to be bound by these Terms:</p>
        
        <h4 class="mt-4">1. Platform Overview</h4>
        <p class="legal-text">
            This Platform is an entertainment and utility-based application designed to support students and professionals with productivity tools, while offering gamified rewards ("Coins") for engagement.
        </p>

        <h4 class="mt-4">2. Reward Coins & Earning</h4>
        <p class="legal-text">
            Users may earn coins by participating in permitted activities like Referring, Viewing Ads, or Completing Tasks. Coins are promotional incentives only and have no guaranteed monetary value until a specific redemption phase is announced.
        </p>

        <h4 class="mt-4">3. Prohibited Activities</h4>
        <p class="legal-text">
            You agree NOT to:
            <br>• Use automation software (bots) to accumulate coins.
            <br>• Exploit bugs or glitches for unfair advantage.
            <br>• Sell or trade your account to third parties.
            <br>Violation of these rules will result in permanent asset forfeiture.
        </p>

        <h4 class="mt-4">4. Limitation of Liability</h4>
        <p class="legal-text">
            The Platform is provided "as is". We are not liable for any data loss, service interruption, or value fluctuation of promotional coins caused by external market factors or technical updates.
        </p>
        
        <p class="legal-footer">Last Updated: Dec 2025</p>

        ${adSpaceBottom}
    `,

    // 4. PRIVACY POLICY (Data Transparency)
    privacy: `
        ${adSpaceTop}

        <h3>Data Protection Policy</h3>
        <p>We value your privacy. This section explains how we handle your digital footprint.</p>
        
        <h4 class="mt-4">1. Information We Collect</h4>
        <p class="legal-text">
            We collect minimal data required to operate the ledger:
            <br>• <b>Identity:</b> Telegram User ID, First Name, and Username (for Leaderboard).
            <br>• <b>Activity:</b> Task completion logs, ad impressions, and game scores.
            <br>• <b>Device:</b> IP Address and User Agent (strictly for fraud prevention).
        </p>

        <h4 class="mt-4">2. How We Use Information</h4>
        <p class="legal-text">
            Your data is used to:
            <br>• Verify task completion and award coins.
            <br>• Maintain the global leaderboard rankings.
            <br>• Detect and block bot farms to protect genuine users.
            <br><b>Note:</b> We DO NOT sell your personal conversation data or private files.
        </p>

        <h4 class="mt-4">3. Third-Party Services</h4>
        <p class="legal-text">
            The Platform integrates with third-party ad networks and analytics providers (e.g., Google, Adsterra). These parties may use cookies to serve relevant ads based on your interests.
        </p>

        <h4 class="mt-4">4. Data Security</h4>
        <p class="legal-text">
            All user data is encrypted and stored using industry-standard Firebase security rules. However, no transmission over the internet is 100% secure.
        </p>

        ${adSpaceBottom}
    `,

    // 5. DISCLAIMER (Most Important for India Safety)
    disclaimer: `
        ${adSpaceTop}

        <div class="info-card" style="border: 1px solid #ef4444; background: rgba(239,68,68,0.1);">
            <h3 style="color:#f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Important Legal Disclaimer</h3>
            <p style="font-size:0.9rem; color:#fca5a5;">
                Please read this carefully before participating.
            </p>
        </div>

        <h4 class="mt-4">1. No Investment Advice</h4>
        <p class="legal-text">
            FinGamePro is a <b>Gamified Rewards Platform</b>. It is NOT an investment fund, bank, or gambling service. The "Coins" are virtual items used within our ecosystem and should not be treated as financial assets or securities.
        </p>

        <h4 class="mt-4">2. Regulatory Compliance</h4>
        <p class="legal-text">
            This app complies with Indian laws regarding "Competitions & Games of Skill". We do not ask for user deposits (Real Money) for participation. Since there is no "Pay-to-Win" element involving fiat currency, this platform falls under safe entertainment categories.
        </p>

        <h4 class="mt-4">3. Future Valuations</h4>
        <p class="legal-text">
            Any mention of "Phase 2", "Tokens", or "Airdrops" refers to potential future roadmap features. These are speculative and subject to market conditions. Past performance or accumulated coins do not guarantee specific future monetary returns.
        </p>

        ${adSpaceBottom}
    `
};

// --- LOGIC TO OPEN PAGES (Standard) ---

function openInfoPage(pageKey) {
    const page = document.getElementById('page-info');
    const titleEl = document.getElementById('info-title');
    const contentEl = document.getElementById('info-content');
    
    // Map Titles
    const titles = {
        'withdraw_terms': 'Withdrawal Policy',
        'terms': 'Terms & Conditions',
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

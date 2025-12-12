import os
import threading
import random
from flask import Flask, render_template_string, request
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# Render Port Setup
PORT = int(os.environ.get("PORT", 10000))

app = Flask(__name__)

# --- 💎 PREMIUM UI TEMPLATE (Glassmorphism & Gold/Neon) ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>AI Career Oracle</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #09090b;
            --card-bg: rgba(255, 255, 255, 0.08);
            --glass-border: rgba(255, 255, 255, 0.1);
            --primary: #3b82f6; /* Blue */
            --accent: #8b5cf6; /* Purple */
            --gold: #fbbf24;
            --text-main: #ffffff;
            --text-sub: #a1a1aa;
        }

        body {
            background-color: var(--bg-color);
            background-image: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #09090b 70%);
            color: var(--text-main);
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 20px;
            text-align: center;
            min-height: 100vh;
            box-sizing: border-box;
            padding-bottom: 80px;
        }

        /* --- TYPOGRAPHY --- */
        h1 {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 28px;
            margin: 10px 0 5px 0;
            background: linear-gradient(to right, #60a5fa, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .subtitle {
            font-size: 12px;
            color: var(--text-sub);
            margin-bottom: 25px;
            letter-spacing: 0.5px;
        }

        /* --- CARDS (Glass Effect) --- */
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            margin-bottom: 20px;
            transition: transform 0.2s;
        }

        /* --- INPUTS & BUTTONS --- */
        input {
            width: 100%;
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border: 1px solid #333;
            border-radius: 12px;
            color: white;
            font-family: 'Montserrat', sans-serif;
            text-align: center;
            font-size: 16px;
            box-sizing: border-box;
            margin-bottom: 15px;
            outline: none;
        }
        input:focus { border-color: var(--primary); }

        .btn-main {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border: none;
            padding: 16px;
            width: 100%;
            border-radius: 12px;
            color: white;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            transition: 0.3s;
        }
        .btn-main:active { transform: scale(0.98); }

        /* --- CHANNELS LIST (Clean Look) --- */
        .channel-section { margin-top: 30px; }
        .section-title {
            text-align: left;
            font-size: 11px;
            color: var(--gold);
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-left: 5px;
            letter-spacing: 1px;
        }

        .channel-grid {
            display: grid;
            grid-template-columns: 1fr; 
            gap: 10px;
        }

        .channel-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.05);
            padding: 14px 18px;
            border-radius: 12px;
            text-decoration: none;
            color: #eee;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.05);
            transition: 0.2s;
        }
        .channel-btn:active { background: rgba(255,255,255,0.1); }
        .arrow-icon { opacity: 0.5; font-size: 12px; }

        /* --- SPONSOR BUTTON --- */
        .sponsor-btn {
            border: 1px solid var(--gold);
            color: var(--gold);
            background: rgba(251, 191, 36, 0.05);
            margin-top: 20px; /* Thoda gap diya hai */
        }

        /* --- MODAL (Budget) --- */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: #18181b;
            padding: 30px;
            border-radius: 20px;
            width: 85%;
            max-width: 320px;
            border: 1px solid #333;
            text-align: center;
        }
        
        /* Slider Styling */
        input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
            margin: 20px 0;
            padding: 0;
            border: none;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--gold);
            cursor: pointer;
            margin-top: -8px;
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            background: #444;
            border-radius: 5px;
        }

        /* --- RESULT / LOADING --- */
        #loading, #resultSection, #finalCard { display: none; }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* LOCKED STATE */
        .locked-overlay {
            background: rgba(0,0,0,0.6);
            border-radius: 12px;
            padding: 20px;
            margin-top: -10px;
            border: 1px dashed #444;
        }
        .progress-track { width: 100%; height: 6px; background: #333; border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .progress-fill { width: 0%; height: 100%; background: #22c55e; transition: 0.5s; }

    </style>
</head>
<body>

    <div style="margin-bottom: 30px;">
        <h1>AI ORACLE 2.0</h1>
        <div class="subtitle">Advanced Neural Future Prediction</div>
    </div>

    <div class="glass-card" id="step1">
        <div style="font-size: 40px; margin-bottom: 10px;">🧬</div>
        <p style="margin-bottom: 20px; font-size: 14px;">Enter your identity to scan timeline.</p>
        <input type="text" id="userName" placeholder="Your Full Name">
        <button class="btn-main" onclick="startScan()">Analyze My Destiny</button>
    </div>

    <div id="loading" style="margin-top: 40px;">
        <div class="spinner"></div>
        <div style="font-size: 12px; color: var(--primary); letter-spacing: 1px;" id="loadText">CONNECTING TO SATELLITE...</div>
    </div>

    <div id="resultSection">
        <div class="glass-card">
            <h2 style="color: #fff; margin: 0;">ANALYSIS COMPLETE</h2>
            <p style="color: #888; font-size: 12px;">Your 2026 Future is ready.</p>
            
            <div class="locked-overlay">
                <div style="font-size: 24px; margin-bottom: 5px;">🔒 LOCKED</div>
                <div style="font-size: 13px; color: #ccc; margin-bottom: 15px;">
                    Share with <b style="color: #fff;">3 Friends</b> to unlock the Secret File.
                </div>

                <div class="progress-track"><div class="progress-fill" id="progBar"></div></div>
                <div style="font-size: 11px; color: #888; margin-bottom: 15px;" id="progText">0/3 Shared</div>

                <button class="btn-main" style="background: #22c55e;" onclick="shareViral()">🚀 Share via Telegram</button>
            </div>
        </div>
    </div>

    <div id="finalCard">
        <div class="glass-card" style="border-color: var(--gold); box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);">
            <div style="background: var(--gold); color: #000; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;">CONFIRMED</div>
            
            <h1 id="finalDestiny" style="font-size: 32px; background: linear-gradient(to right, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">IAS OFFICER</h1>
            
            <p style="color: #fff; font-size: 16px; margin-top: 5px;" id="finalName">Name</p>
            <p style="color: #888; font-style: italic; font-size: 12px;">"The nation will salute you."</p>

            <a href="https://t.me/{{ bot_username }}" class="btn-main" style="background: #333; margin-top: 15px; display: block; text-decoration: none;">🎯 Start Career Quiz</a>
        </div>
    </div>

    <div class="channel-section">
        <div class="section-title">Verified Resources (Join All)</div>
        <div class="channel-grid">
            
            <a href="https://t.me/The_EnglishRoom5" class="channel-btn">
                <span>🇬🇧 English Grammar Hub</span> <span class="arrow-icon">➔</span>
            </a>
            <a href="https://t.me/English_Speaking_Grammar_Shots" class="channel-btn">
                <span>🗣️ Speaking Shots</span> <span class="arrow-icon">➔</span>
            </a>

            <a href="https://t.me/UPSC_Notes_Official" class="channel-btn">
                <span>📚 UPSC Notes PDF</span> <span class="arrow-icon">➔</span>
            </a>
            <a href="https://t.me/UPSC_Quiz_Vault" class="channel-btn">
                <span>🎯 Quiz Vault</span> <span class="arrow-icon">➔</span>
            </a>
            <a href="https://t.me/IAS_PrepQuiz_Zone" class="channel-btn">
                <span>🧠 IAS Prep Zone</span> <span class="arrow-icon">➔</span>
            </a>
            <a href="https://t.me/MinistryOfTourism" class="channel-btn">
                <span>🇮🇳 Ministry of Tourism</span> <span class="arrow-icon">➔</span>
            </a>
            <a href="https://t.me/GovernmentSchemesIndia" class="channel-btn">
                <span>🏛️ Govt Schemes India</span> <span class="arrow-icon">➔</span>
            </a>

            <a href="https://t.me/PersonalFinanceWithShiv" class="channel-btn">
                <span>💰 Finance Tips</span> <span class="arrow-icon">➔</span>
            </a>

            <div onclick="openBudgetModal()" class="channel-btn sponsor-btn" style="cursor: pointer;">
                <span>📢 Sponsor / Advertise</span> <span class="arrow-icon">₹</span>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="sponsorModal">
        <div class="modal-content">
            <h3 style="margin-top: 0;">Select Your Budget</h3>
            <p style="color: #888; font-size: 12px;">Move slider to select amount</p>
            
            <div style="font-size: 24px; font-weight: bold; color: var(--gold); margin: 10px 0;">
                ₹<span id="budgetValue">5000</span>
            </div>
            
            <input type="range" min="500" max="50000" step="500" value="5000" id="budgetRange" oninput="updateBudgetDisplay()">
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="closeModal()" style="flex: 1; padding: 10px; background: #333; border: none; color: white; border-radius: 8px;">Cancel</button>
                <button onclick="submitSponsor()" style="flex: 1; padding: 10px; background: var(--gold); border: none; color: black; font-weight: bold; border-radius: 8px;">Contact</button>
            </div>
        </div>
    </div>

    <script>
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        // Theme Colors match Telegram
        Telegram.WebApp.setHeaderColor('#09090b');
        Telegram.WebApp.setBackgroundColor('#09090b');

        let count = parseInt(localStorage.getItem('viral_v3')) || 0;
        updateProgress();

        // --- SCAN LOGIC ---
        function startScan() {
            const name = document.getElementById('userName').value;
            if(!name) { Telegram.WebApp.showAlert("Please enter your name!"); return; }
            
            document.getElementById('step1').style.display = 'none';
            document.getElementById('loading').style.display = 'block';

            // Fake steps
            setTimeout(() => { document.getElementById('loadText').innerText = "SCANNING BIOMETRICS..."; }, 1000);
            setTimeout(() => { document.getElementById('loadText').innerText = "PREDICTING 2026..."; }, 2500);

            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('resultSection').style.display = 'block';
            }, 4000);
        }

        // --- SHARE LOGIC ---
        function shareViral() {
            const botUser = "{{ bot_username }}";
            const msg = "🚨 AI PREDICTION REVEALED! 🚨\\n\\nI just checked my 2026 Career Prediction! 😱\\nIt's 99% Accurate.\\n\\nCheck yours free here: https://t.me/" + botUser + "?start=prediction";
            
            Telegram.WebApp.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(msg));

            setTimeout(() => {
                count++;
                if(count > 3) count = 3;
                localStorage.setItem('viral_v3', count);
                updateProgress();
            }, 5000);
        }

        function updateProgress() {
            const pct = (count / 3) * 100;
            document.getElementById('progBar').style.width = pct + "%";
            document.getElementById('progText').innerText = count + "/3 Shared";

            if(count >= 3) {
                document.getElementById('resultSection').style.display = 'none';
                document.getElementById('finalCard').style.display = 'block';
                showFinalResult();
            }
        }

        function showFinalResult() {
            const name = document.getElementById('userName').value || "Future Star";
            document.getElementById('finalName').innerText = name;
            
            const roles = ["IAS OFFICER", "IPS OFFICER", "BILLIONAIRE", "TECH CEO", "MINISTER", "SCIENTIST"];
            document.getElementById('finalDestiny').innerText = roles[Math.floor(Math.random() * roles.length)];
            
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

        // --- SPONSOR MODAL LOGIC ---
        function openBudgetModal() {
            document.getElementById('sponsorModal').style.display = 'flex';
        }
        function closeModal() {
            document.getElementById('sponsorModal').style.display = 'none';
        }
        function updateBudgetDisplay() {
            const val = document.getElementById('budgetRange').value;
            document.getElementById('budgetValue').innerText = val;
        }
        function submitSponsor() {
            const budget = document.getElementById('budgetRange').value;
            const admin = "{{ admin_username }}";
            const text = `Hello Admin, I am interested in Sponsorship/Advertising.\n\n💰 My Budget: ₹${budget}\n\nPlease share details.`;
            
            Telegram.WebApp.openTelegramLink(`https://t.me/${admin}?text=${encodeURIComponent(text)}`);
            closeModal();
        }
    </script>
</body>
</html>
"""

# --- ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, 
                                  admin_username=ADMIN_USERNAME,
                                  bot_username=BOT_USERNAME)

# --- BOT HANDLERS ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user.first_name
    
    # Render URL Fetch
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🔮 PREDICT MY FUTURE (2026)", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # PREMIUM IMAGE (Updated)
    await update.message.reply_photo(
        photo="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", 
        caption=f"👋 **Welcome, {user}!**\n\n🧬 **AI Neural Scanner 2.0 is Online.**\n\nWe have upgraded our algorithm to predict your **2026 Destiny** with 99% accuracy.\n\n👇 **Tap below to start the scan:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

# --- RUNNER ---
def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    threading.Thread(target=run_flask).start()
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()

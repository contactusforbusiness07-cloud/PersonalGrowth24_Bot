import os
import threading
import random
from flask import Flask, render_template_string, request
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS (Hardcoded for You) ---
# Maine aapka Token aur Usernames yahan set kar diye hain.
# Ab aapko Render par "TOKEN" dalne ki zarurat nahi hai.
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# Render Port Setup
PORT = int(os.environ.get("PORT", 10000))

app = Flask(__name__)

# --- 🚀 VIRAL SCI-FI THEME (AI ORACLE) ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Career Oracle</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root { --neon: #00f3ff; --bg: #050505; --card: #111; --text: #eee; }
        body { background-color: var(--bg); color: var(--text); font-family: 'Orbitron', sans-serif; margin: 0; padding: 20px; text-align: center; overflow-x: hidden; padding-bottom: 60px; }
        
        /* SCANNER ANIMATION */
        .scan-line { width: 100%; height: 2px; background: var(--neon); position: fixed; top: 0; left: 0; animation: scan 3s infinite linear; box-shadow: 0 0 10px var(--neon); z-index: 99; pointer-events: none; }
        @keyframes scan { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }

        h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px var(--neon); margin-bottom: 5px; margin-top: 10px; }
        .subtitle { font-size: 10px; color: #888; font-family: sans-serif; margin-bottom: 30px; }

        /* INPUT CARD */
        .input-card { background: var(--card); padding: 20px; border: 1px solid #333; border-radius: 15px; box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); }
        input { width: 85%; padding: 12px; background: #000; border: 1px solid #444; color: var(--neon); font-family: 'Orbitron', sans-serif; text-align: center; margin-bottom: 15px; border-radius: 8px; outline: none; }
        input:focus { border-color: var(--neon); box-shadow: 0 0 10px rgba(0, 243, 255, 0.3); }

        .btn { background: linear-gradient(45deg, #00c6ff, #0072ff); border: none; padding: 12px 20px; color: white; font-weight: bold; border-radius: 50px; cursor: pointer; width: 100%; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0, 114, 255, 0.4); }
        
        /* LOADING */
        #loading { display: none; margin-top: 20px; }
        .loader-text { font-size: 12px; color: var(--neon); margin-top: 10px; animation: blink 1s infinite; font-family: sans-serif; }
        @keyframes blink { 50% { opacity: 0; } }

        /* LOCKED RESULT */
        #resultSection { display: none; margin-top: 20px; position: relative; }
        .result-card { background: #1a1a1a; padding: 2px; border-radius: 15px; position: relative; overflow: hidden; }
        .blur-content { filter: blur(12px); padding: 20px; opacity: 0.6; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; padding: 20px; box-sizing: border-box; }
        
        .share-btn { background: #25D366; color: white; padding: 12px 25px; border-radius: 50px; text-decoration: none; font-family: sans-serif; font-weight: bold; border: none; cursor: pointer; animation: pulse 1.5s infinite; font-size: 14px; margin-top: 10px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); } }

        /* UNLOCKED CARD */
        #finalCard { display: none; margin-top: 20px; border: 2px solid var(--neon); padding: 20px; border-radius: 15px; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); }
        .rank-badge { background: var(--neon); color: black; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 12px; display: inline-block; margin-bottom: 10px; }
        .career-title { font-size: 26px; color: #fff; margin: 10px 0; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
        .quote { font-size: 11px; color: #ccc; font-style: italic; font-family: sans-serif; margin-bottom: 15px; }

        /* CHANNEL BUTTONS (UPDATED) */
        .channel-list { margin-top: 30px; text-align: left; }
        .section-header { color: #888; font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; font-family: sans-serif; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .c-btn { display: flex; justify-content: space-between; align-items: center; background: #1c1c1e; color: #fff; padding: 12px; margin-bottom: 8px; border-radius: 8px; text-decoration: none; font-size: 13px; font-family: sans-serif; border: 1px solid #333; }
        .c-btn:hover { border-color: var(--neon); }

        /* ADS */
        .ad-space { background: #000; height: 60px; margin: 20px 0; border: 1px dashed #444; display: flex; align-items: center; justify-content: center; color: #666; font-size: 10px; font-family: sans-serif; }
    </style>
</head>
<body>

    <div class="scan-line"></div>

    <div style="max-width: 400px; margin: 0 auto;">
        
        <h1>AI Career Oracle</h1>
        <div class="subtitle">Neural Network Prediction for 2026</div>

        <div class="input-card" id="step1">
            <input type="text" id="userName" placeholder="ENTER YOUR NAME">
            <button class="btn" onclick="startScan()">🔮 PREDICT MY FUTURE</button>
        </div>

        <div id="loading">
            <img src="https://i.gifer.com/ZZ5H.gif" width="60" alt="loader">
            <div class="loader-text" id="loadText">Establishing Satellite Link...</div>
        </div>

        <div id="resultSection">
            <div class="result-card">
                <div class="blur-content">
                    <h1>IAS OFFICER</h1>
                    <p>Rank: AIR 1</p>
                    <p>Batch: 2026</p>
                </div>
                <div class="overlay">
                    <div style="font-size: 40px; margin-bottom: 10px;">🔒</div>
                    <div style="font-size: 14px; margin-bottom: 10px; color: #fff; font-family: sans-serif;">
                        <span style="color: var(--neon); font-weight: bold;">Prediction Ready!</span><br>
                        Share with 3 friends to<br>Unlock your Future Career.
                    </div>
                    
                    <div style="width:80%; height:6px; background:#444; border-radius:10px; margin-bottom:5px;">
                        <div id="progBar" style="width:0%; height:100%; background:var(--neon); border-radius:10px; transition:0.3s;"></div>
                    </div>
                    <div id="progText" style="font-size:10px; color:#aaa; margin-bottom:15px; font-family:sans-serif;">0/3 Shared</div>

                    <button class="share-btn" onclick="shareViral()">🚀 Share on Telegram</button>
                </div>
            </div>
        </div>

        <div id="finalCard">
            <div class="rank-badge">CONFIRMED DESTINY</div>
            <div class="career-title" id="finalDestiny">IAS OFFICER</div>
            <p style="font-size:14px; color:var(--neon); margin:5px 0; text-transform:uppercase;" id="finalName">Name</p>
            <div class="quote">"History will remember your name."</div>
            
            <a href="https://t.me/{{ bot_username }}" class="btn" style="font-size:12px; padding:10px; background: #333;">🎯 Start Quiz Challenge</a>
        </div>

        <div class="ad-space">Adsterra Ad Slot</div>

        <div class="channel-list">
            <div class="section-header">🇬🇧 English Mastery</div>
            <a href="https://t.me/The_EnglishRoom5" class="c-btn"><span>🇬🇧 Grammar Hub</span> <span>↗️</span></a>
            <a href="https://t.me/English_Speaking_Grammar_Shots" class="c-btn"><span>🗣️ Speaking Shots</span> <span>↗️</span></a>

            <div class="section-header" style="margin-top: 15px;">🇮🇳 UPSC & Govt Prep</div>
            <a href="https://t.me/UPSC_Notes_Official" class="c-btn"><span>📚 UPSC Notes PDF</span> <span>↗️</span></a>
            <a href="https://t.me/UPSC_Quiz_Vault" class="c-btn"><span>🎯 Quiz Vault</span> <span>↗️</span></a>
            <a href="https://t.me/IAS_PrepQuiz_Zone" class="c-btn"><span>🧠 IAS Prep</span> <span>↗️</span></a>
            
            <div class="section-header" style="margin-top: 15px;">📈 Growth & Finance</div>
            <a href="https://t.me/PersonalFinanceWithShiv" class="c-btn"><span>💰 Finance Tips</span> <span>↗️</span></a>

            <div class="section-header" style="margin-top: 15px;">💼 Business</div>
            <a href="#" onclick="contactAdmin()" class="c-btn" style="border-color: var(--neon); color: var(--neon);"><span>📩 Sponsor / Advertise</span> <span>₹</span></a>
        </div>

    </div>

    <script>
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();

        let count = parseInt(localStorage.getItem('viral_count_v2')) || 0;
        updateProgress();

        function startScan() {
            const name = document.getElementById('userName').value;
            if(!name) {
                Telegram.WebApp.showAlert("Please enter your name first!");
                return;
            }
            
            document.getElementById('step1').style.display = 'none';
            document.getElementById('loading').style.display = 'block';

            // Fake Loading Steps
            const texts = ["Accessing Neural Data...", "Scanning IQ Level...", "Predicting 2026 Timeline...", "Generating Report..."];
            let i = 0;
            setInterval(() => {
                if(i < texts.length) document.getElementById('loadText').innerText = texts[i++];
            }, 800);

            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('resultSection').style.display = 'block';
            }, 3500);
        }

        function shareViral() {
            const botUser = "{{ bot_username }}";
            const msg = "🔥 OMG! AI just predicted my Future Career! 😱\\n\\nIt says I will be an IAS Officer in 2026! 🇮🇳\\n\\nCheck yours now (Free): https://t.me/" + botUser + "?start=future_scan";
            const url = "https://t.me/share/url?url=" + encodeURIComponent(msg);
            
            Telegram.WebApp.openTelegramLink(url);

            // Simulate Tracking (Real-world: user comes back)
            setTimeout(() => {
                count++;
                if(count > 3) count = 3;
                localStorage.setItem('viral_count_v2', count);
                updateProgress();
            }, 4000);
        }

        function updateProgress() {
            const pct = (count / 3) * 100;
            document.getElementById('progBar').style.width = pct + "%";
            document.getElementById('progText').innerText = count + "/3 Shared";

            if(count >= 3) {
                document.getElementById('resultSection').style.display = 'none';
                document.getElementById('finalCard').style.display = 'block';
                
                // Final Reveal Logic
                const name = document.getElementById('userName').value || "Future Legend";
                document.getElementById('finalName').innerText = name;
                
                const destinies = ["IAS OFFICER (Rank 4)", "IPS OFFICER (Singham Mode)", "IFS DIPLOMAT", "UNICORN FOUNDER", "RBI GOVERNOR", "TOP LAWYER"];
                const randomDestiny = destinies[Math.floor(Math.random() * destinies.length)];
                document.getElementById('finalDestiny').innerText = randomDestiny;

                // Confetti
                confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
            }
        }

        function contactAdmin() {
            Telegram.WebApp.openTelegramLink("https://t.me/{{ admin_username }}?text=Hello Admin, I want to discuss Sponsorship.");
        }
    </script>
</body>
</html>
"""

# --- FLASK ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, 
                                  admin_username=ADMIN_USERNAME,
                                  bot_username=BOT_USERNAME)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user.first_name
    
    # Render URL automatic fetch (or manual fallback)
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if not base_url:
        web_app_url = "https://google.com" # Fallback if URL not found
    else:
        web_app_url = f"https://{base_url}/"
    
    keyboard = [
        [InlineKeyboardButton("🔮 PREDICT MY FUTURE (2026) 🔮", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_photo(
        photo="https://i.imgur.com/2K7M8X8.jpeg", 
        caption=f"👋 **Hello {user}!**\n\n🤖 **AI Future Career Scanner**\n\nCurious about your destiny? Our AI analyzes your potential to predict if you will be an **IAS, IPS, or Business Tycoon**.\n\n👇 **Click below to Scan Now:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

# --- RUNNER ---
def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    # Token hardcoded upar hai, isliye yahan variable use kiya
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    
    threading.Thread(target=run_flask).start()
    
    print(f"Bot {BOT_USERNAME} is Live on Render!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()

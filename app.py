
import os
import threading
import signal
import json
import random
from flask import Flask, render_template_string, request, jsonify
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# --- 💰 ADS CONFIG ---
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

# --- 💾 MEMORY DATABASE ---
user_referrals = {}

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 SUPER APP UI TEMPLATE ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Growth Super App</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --blue: #3b82f6; --green: #22c55e; --purple: #8b5cf6; }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 15px; padding-bottom: 90px; text-align: center; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        /* HEADER & COINS */
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .user-info { text-align: left; }
        .user-name { font-weight: 800; font-size: 16px; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .coin-box { background: rgba(251, 191, 36, 0.1); border: 1px solid var(--gold); padding: 5px 12px; border-radius: 20px; color: var(--gold); font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 5px; }
        
        /* PROGRESS BAR */
        .progress-wrapper { background: #334155; height: 6px; border-radius: 10px; margin-bottom: 5px; position: relative; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--green); width: 0%; transition: 1s; }
        .progress-text { font-size: 10px; color: #94a3b8; margin-bottom: 20px; display: flex; justify-content: space-between; }

        /* TABS */
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }

        .section { display: none; animation: fadeIn 0.3s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* ADS & BANNERS */
        .ad-banner { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; border-radius: 10px; background: #000; border: 1px dashed #333; min-height: 50px; }
        
        /* TOOLS GRID (Hub) */
        .tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .tool-card { background: var(--card); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; }
        .tool-card:active { transform: scale(0.95); }
        .tool-icon { font-size: 24px; margin-bottom: 5px; }
        .tool-name { font-size: 12px; font-weight: bold; }
        .hot-tag { position: absolute; top: 0; right: 0; background: var(--red); font-size: 8px; padding: 2px 6px; border-bottom-left-radius: 8px; font-weight: bold; }

        /* GAMES */
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .game-card { background: #000; border-radius: 15px; overflow: hidden; height: 120px; position: relative; cursor: pointer; border: 1px solid #333; }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .game-badge { position: absolute; top: 5px; right: 5px; background: var(--green); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; }
        .tournament-badge { position: absolute; top: 5px; left: 5px; background: var(--gold); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.5; } }

        /* ORACLE & VIRAL CARDS */
        .viral-btn { background: linear-gradient(135deg, #ec4899, #8b5cf6); width: 100%; padding: 15px; border-radius: 15px; border: none; color: white; font-weight: bold; margin-bottom: 10px; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3); }
        
        /* FLOATING GIFT */
        .floating-gift { position: fixed; bottom: 90px; right: 20px; width: 60px; height: 60px; background: url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZ0OXBoZnEzZnB6ZnB6ZnB6ZnB6ZnB6ZnB6ZnB6/26tOZ42Mg6pbTUPDa/giphy.gif') no-repeat center/cover; z-index: 999; cursor: pointer; filter: drop-shadow(0 0 10px var(--gold)); animation: float 3s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

        /* MODALS */
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .modal-content { background: #1e293b; width: 85%; padding: 20px; border-radius: 20px; border: 1px solid var(--blue); position: relative; text-align: center; }
        .close-btn { position: absolute; top: 10px; right: 15px; font-size: 20px; cursor: pointer; color: #aaa; }
        
        .result-card { background: linear-gradient(135deg, #1e1b4b, #000); border: 2px solid var(--gold); padding: 20px; border-radius: 15px; margin-top: 15px; }
        .input-field { width: 90%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 10px; color: white; margin-bottom: 10px; text-align: center; }

    </style>
</head>
<body>

    <div class="floating-gift" onclick="openBonusGift()"></div>

    <div class="top-bar">
        <div class="user-info">
            <div class="user-name" id="userNameDisplay">Hi, Future Leader</div>
            <div style="font-size: 10px; color: #aaa;">Let's grow today!</div>
        </div>
        <div class="coin-box">
            <span>🪙</span> <span id="coinCount">0</span>
        </div>
    </div>

    <div class="progress-wrapper"><div class="progress-fill" id="dailyProg"></div></div>
    <div class="progress-text">
        <span>Daily Task: <span id="taskPct">0%</span></span>
        <span id="badge" style="color:var(--gold); display:none;">🏆 PRO USER</span>
    </div>

    <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('home')">🏠 Hub</button>
        <button class="tab-btn" onclick="switchTab('games')">🎮 Games</button>
        <button class="tab-btn" onclick="switchTab('oracle')">🔮 Oracle</button>
    </div>

    <div id="home" class="section active">
        
        <div id="wordModal" class="modal">
            <div class="modal-content" style="border-color: var(--green);">
                <span class="close-btn" onclick="closeModal('wordModal')">&times;</span>
                <h3>📖 Word of the Day</h3>
                <h1 style="color: var(--green); margin: 10px 0;">RESILIENCE</h1>
                <p style="font-size: 12px; color: #ccc;">(Noun) The capacity to recover quickly from difficulties.</p>
                <button class="tab-btn active" style="width:100%; margin-top:15px;" onclick="closeModal('wordModal'); addCoins(10);">✅ I Learned This (+10 Coins)</button>
            </div>
        </div>

        <div class="ad-banner">
            <script type="text/javascript">
                atOptions = { 'key' : '0ec2eb9dc0e01b5f1b456f0f1e577f22', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/0ec2eb9dc0e01b5f1b456f0f1e577f22/invoke.js"></script>
        </div>

        <div class="group-title">🛠️ POWER TOOLS</div>
        <div class="tools-grid">
            <div class="tool-card" onclick="openResumeBuilder()">
                <div class="hot-tag">HOT</div>
                <div class="tool-icon">📄</div>
                <div class="tool-name">CV Builder</div>
            </div>
            <div class="tool-card" onclick="openSchemeChecker()">
                <div class="tool-icon">🏛️</div>
                <div class="tool-name">Govt Schemes</div>
            </div>
        </div>

        <div class="group-title">📚 PREMIUM RESOURCES</div>
        <div class="link-row" onclick="openLink('https://t.me/The_EnglishRoom5')"><span>🇬🇧 Grammar Hub</span> <span>➔</span></div>
        <div class="link-row" onclick="openLink('https://t.me/UPSC_Notes_Official')"><span>📚 UPSC Notes PDF</span> <span>➔</span></div>
        <div class="link-row" onclick="openLink('https://t.me/PersonalFinanceWithShiv')"><span>💰 Finance Tips</span> <span>➔</span></div>

        <div class="native-ad-container" style="margin-top:20px; border:1px solid #333; padding:10px; border-radius:10px;">
            <div style="font-size:10px; color:#666; margin-bottom:5px;">SPONSORED</div>
            <script async="async" data-cfasync="false" src="https://pl28245447.effectivegatecpm.com/8ca532b1ecc871c8269845a5294e401b/invoke.js"></script>
            <div id="container-8ca532b1ecc871c8269845a5294e401b"></div>
        </div>
    </div>

    <div id="games" class="section">
        <div style="background: rgba(34, 197, 94, 0.1); padding: 10px; border-radius: 10px; margin-bottom: 15px; border: 1px solid var(--green);">
            <small>🎮 Play 5 mins = <b>50 Growth Coins</b></small>
        </div>

        <div class="game-grid">
            <div class="game-card" onclick="startGame('Subway Surfers', 'https://poki.com/en/g/subway-surfers')">
                <div class="tournament-badge">🏆 TOURNAMENT</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Subway_Surfers_App_Icon.png">
                <div style="position:absolute; bottom:0; width:100%; background:rgba(0,0,0,0.8); color:white; font-size:10px;">Subway Surfers</div>
            </div>
            <div class="game-card" onclick="startGame('Temple Run 2', 'https://poki.com/en/g/temple-run-2')">
                <img src="https://upload.wikimedia.org/wikipedia/en/6/69/Temple_Run_2_icon.jpg">
            </div>
            <div class="game-card" onclick="startGame('Candy Saga', 'https://poki.com/en/g/sweet-world')">
                <img src="https://upload.wikimedia.org/wikipedia/en/2/22/Candy_Crush_Saga_Icon.png">
            </div>
            <div class="game-card" onclick="startGame('Moto X3M', 'https://poki.com/en/g/moto-x3m')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Moto_X3M_Logo.jpg">
            </div>
        </div>
    </div>

    <div id="oracle" class="section">
        
        <button class="viral-btn" onclick="openCalc('love')">
            <span>❤️ Love Calculator</span> <span>👉</span>
        </button>
        <button class="viral-btn" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);" onclick="openCalc('marriage')">
            <span>💍 When will I Marry?</span> <span>👉</span>
        </button>
        <button class="viral-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706);" onclick="openCalc('horoscope')">
            <span>♈ Daily Horoscope</span> <span>👉</span>
        </button>

        <div id="oracleResult" class="result-card" style="display:none;">
            <div style="font-size: 40px;">📸</div>
            <h2 id="resTitle" style="margin:5px 0;">Result</h2>
            <div id="resContent" style="font-size:18px; color:var(--gold); font-weight:bold; margin:10px 0;">...</div>
            <p style="font-size:10px; color:#aaa;">Screenshot & Share on Story</p>
            <div style="margin-top:10px; font-size:10px; color:#fff; background:#333; padding:5px; border-radius:5px;">Check yours: @PersonalGrowth24_Bot</div>
        </div>
    </div>

    <div id="resumeModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('resumeModal')">&times;</span>
            <h3>📄 Create Professional CV</h3>
            <input type="text" id="cvName" class="input-field" placeholder="Full Name">
            <input type="text" id="cvSkill" class="input-field" placeholder="Key Skills (e.g. Python, Sales)">
            <button class="tab-btn active" style="width:100%; background:var(--blue); color:white;" onclick="generateCV()">✨ Generate PDF</button>
        </div>
    </div>

    <div id="calcModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('calcModal')">&times;</span>
            <h3 id="calcTitle">Calculator</h3>
            <input type="text" id="p1Name" class="input-field" placeholder="Your Name">
            <input type="text" id="p2Name" class="input-field" placeholder="Partner Name (Optional)">
            <button class="tab-btn active" style="width:100%; background:var(--purple); color:white;" onclick="calculateResult()">🔮 Reveal Destiny</button>
        </div>
    </div>

    <script type="text/javascript" src="https://pl28245444.effectivegatecpm.com/50/d7/2c/50d72c91dd048c42dae784892264442e.js"></script>
    
    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0f172a'); tg.setBackgroundColor('#0f172a');

        const adLink = "{{ ad_link }}";
        const user = tg.initDataUnsafe.user;
        let coins = parseInt(localStorage.getItem('pg_coins')) || 0;
        let dailyTasks = parseInt(localStorage.getItem('pg_tasks')) || 0;

        // Init
        document.getElementById('userNameDisplay').innerText = user ? "Hi, " + user.first_name : "Hi, Future Leader";
        updateCoinDisplay();
        updateProgress(0);

        // --- CORE FUNCTIONS ---
        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }

        function updateCoinDisplay() {
            document.getElementById('coinCount').innerText = coins;
            localStorage.setItem('pg_coins', coins);
        }

        function addCoins(amount) {
            coins += amount;
            updateCoinDisplay();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            tg.showPopup({ title: 'Coins Added!', message: `You earned ${amount} Growth Coins.` });
            updateProgress(33);
        }

        function updateProgress(val) {
            dailyTasks += val;
            if(dailyTasks > 100) dailyTasks = 100;
            document.getElementById('dailyProg').style.width = dailyTasks + "%";
            document.getElementById('taskPct').innerText = dailyTasks + "%";
            if(dailyTasks >= 100) document.getElementById('badge').style.display = 'inline';
            localStorage.setItem('pg_tasks', dailyTasks);
        }

        function openLink(url) {
            tg.showConfirm("Opening link via Sponsor...", (ok) => {
                if(ok) { tg.openLink(adLink); setTimeout(() => tg.openLink(url), 1000); }
                else { tg.openLink(url); }
            });
        }

        // --- FEATURES ---
        function openBonusGift() {
            tg.showConfirm("🎁 Open Bonus Gift?", (ok) => {
                if(ok) { tg.openLink(adLink); setTimeout(() => addCoins(50), 2000); }
            });
        }

        // Resume Builder
        function openResumeBuilder() { document.getElementById('resumeModal').style.display = 'flex'; }
        function generateCV() {
            const name = document.getElementById('cvName').value;
            if(!name) return tg.showAlert("Name is required!");
            
            tg.showConfirm("Generating PDF requires watching a quick ad.", (ok) => {
                if(ok) {
                    tg.openLink(adLink);
                    setTimeout(() => {
                        document.getElementById('resumeModal').style.display = 'none';
                        tg.showAlert("✅ Resume Sent to your Email (Simulated)!");
                        addCoins(20);
                    }, 2000);
                }
            });
        }

        // Games
        function startGame(name, url) {
            tg.showPopup({ title: `Play ${name}`, message: 'Watch ad to enter tournament mode.', buttons: [{type:'ok', text:'Play'}] }, () => {
                tg.openLink(adLink);
                setTimeout(() => { tg.openLink(url); addCoins(5); }, 500);
            });
        }

        // Oracle
        let calcType = "";
        function openCalc(type) {
            calcType = type;
            document.getElementById('p2Name').style.display = (type === 'horoscope') ? 'none' : 'block';
            document.getElementById('calcModal').style.display = 'flex';
        }

        function calculateResult() {
            const p1 = document.getElementById('p1Name').value;
            if(!p1) return;

            // Fake processing
            document.getElementById('calcModal').style.display = 'none';
            tg.showPopup({title: 'Calculating...', message: 'Analyzing stars...'});
            
            setTimeout(() => {
                document.getElementById('oracleResult').style.display = 'block';
                let res = "";
                if(calcType === 'love') res = "❤️ Match: " + (Math.floor(Math.random() * 20) + 80) + "%";
                else if(calcType === 'marriage') res = "💍 Year: " + (2025 + Math.floor(Math.random() * 5));
                else res = "✨ Today: Big opportunity coming!";
                
                document.getElementById('resContent').innerText = res;
                confetti();
            }, 1000);
        }

        // Utils
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }
        function openSchemeChecker() { tg.showAlert("Enter your age in next screen (Coming Soon)"); }

        // Auto Open Daily Word
        setTimeout(() => document.getElementById('wordModal').style.display = 'flex', 2000);

    </script>
</body>
</html>
"""

# --- FLASK ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, ad_link=AD_LINK)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 Claim Bonus Gift", url=AD_LINK)],
        [InlineKeyboardButton("🚀 ENTER SUPER APP", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n"
                f"💎 **Welcome to Growth Hub Premium**\n"
                f"Your All-in-One Super App is ready:\n\n"
                f"📝 **1-Click Resume Builder**\n"
                f"💰 **Earn Coins & Rewards**\n"
                f"🎮 **Play Tournaments**\n"
                f"🔮 **Viral AI Predictions**\n\n"
                f"👇 **Tap below to Start Growing:**",
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
    
    print("Bot Started...")
    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
    except Exception as e:
        print(f"Error: {e}")
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    main()

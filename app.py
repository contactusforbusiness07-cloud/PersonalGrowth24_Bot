import os
import threading
import signal
from flask import Flask, render_template_string, request, jsonify
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# --- 💰 ADS CONFIG ---
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 SUPER APP UI WITH ECONOMY & DOWNLOADER ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Growth Super App</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Orbitron:wght@500&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --green: #22c55e; --red: #ef4444; --blue: #3b82f6; }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 15px; padding-bottom: 90px; text-align: center; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        /* COIN HEADER */
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .user-info { text-align: left; font-size: 12px; color: #aaa; }
        .coin-box { background: linear-gradient(135deg, #FFD700, #B8860B); color: #000; padding: 5px 15px; border-radius: 20px; font-weight: 800; font-size: 14px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); display: flex; align-items: center; gap: 5px; animation: shine 2s infinite; }
        @keyframes shine { 0% { filter: brightness(1); } 50% { filter: brightness(1.2); } 100% { filter: brightness(1); } }

        /* TABS */
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }

        .section { display: none; animation: fadeIn 0.3s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* LOCKED CONTENT */
        .locked-item { opacity: 0.7; position: relative; }
        .lock-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 12px; z-index: 10; }
        .lock-icon { font-size: 20px; margin-bottom: 5px; }
        .unlock-btn { background: var(--green); color: white; border: none; padding: 5px 15px; border-radius: 20px; font-size: 10px; font-weight: bold; cursor: pointer; }

        /* ADS */
        .ad-banner { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; border-radius: 10px; background: #000; border: 1px dashed #333; min-height: 50px; }

        /* LISTS & GAMES */
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px 15px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; position: relative; overflow: hidden; }
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .game-card { background: #000; border-radius: 15px; overflow: hidden; height: 120px; position: relative; cursor: pointer; border: 1px solid #333; }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .game-badge { position: absolute; top: 5px; right: 5px; background: var(--green); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; }

        /* ORACLE RESULT CARD (For Screenshot) */
        .result-container { background: linear-gradient(180deg, #1e293b, #000); border: 2px solid var(--gold); border-radius: 20px; padding: 20px; margin-top: 20px; text-align: center; position: relative; overflow: hidden; }
        .res-img { width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--gold); margin: 0 auto 10px; object-fit: cover; }
        .res-title { font-family: 'Orbitron', sans-serif; color: var(--gold); font-size: 22px; margin: 5px 0; text-transform: uppercase; }
        .res-desc { color: #ccc; font-size: 12px; margin-bottom: 15px; font-style: italic; }
        .watermark { position: absolute; bottom: 5px; right: 10px; font-size: 8px; color: #555; }

        /* BUTTONS */
        .btn-main { background: linear-gradient(135deg, var(--blue), #7c3aed); border: none; padding: 15px; width: 100%; border-radius: 12px; color: white; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 10px; }
        .btn-download { background: #fff; color: black; border: none; padding: 10px; width: 100%; border-radius: 10px; font-weight: bold; margin-top: 10px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 5px; }

        /* MODALS */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        .modal-box { background: #1e293b; padding: 25px; border-radius: 20px; width: 85%; max-width: 350px; text-align: center; border: 1px solid #444; }
        .input-glass { width: 90%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 10px; color: white; margin-bottom: 15px; text-align: center; outline: none; }

    </style>
</head>
<body>

    <div class="top-bar">
        <div class="user-info">
            <div id="username">User</div>
            <div style="color:var(--green); font-weight:bold;">● Online</div>
        </div>
        <div class="coin-box" onclick="showEarnModal()">
            <span>🪙</span> <span id="coinBalance">0</span>
        </div>
    </div>

    <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('home')">🏠 Hub</button>
        <button class="tab-btn" onclick="switchTab('games')">🎮 Games</button>
        <button class="tab-btn" onclick="switchTab('oracle')">🔮 Oracle</button>
    </div>

    <div id="home" class="section active">
        
        <div class="ad-banner">
            <script type="text/javascript">
                atOptions = { 'key' : '0ec2eb9dc0e01b5f1b456f0f1e577f22', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/0ec2eb9dc0e01b5f1b456f0f1e577f22/invoke.js"></script>
        </div>

        <div style="background: rgba(34, 197, 94, 0.1); padding: 10px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--green); font-size: 11px;">
            📢 <b>Tip:</b> Play Games to earn Coins & Unlock PDFs!
        </div>

        <div class="group-title">🔒 PREMIUM RESOURCES (5000 Coins)</div>
        
        <div class="link-row" onclick="unlockContent(5000, 'https://t.me/UPSC_Notes_Official')">
            <span>📚 UPSC Notes (Premium)</span> <span>🔒</span>
        </div>
        
        <div class="link-row" onclick="unlockContent(5000, 'https://t.me/IAS_PrepQuiz_Zone')">
            <span>🧠 IAS Secret Strategy</span> <span>🔒</span>
        </div>

        <div class="group-title">🔓 FREE RESOURCES</div>
        <div class="link-row" onclick="openLink('https://t.me/The_EnglishRoom5')"><span>🇬🇧 English Hub</span> <span>➔</span></div>
        
        <div class="native-ad-container" style="margin-top:20px; border:1px solid #333; padding:10px; border-radius:10px;">
            <div style="font-size:10px; color:#666; margin-bottom:5px;">SPONSORED</div>
            <script async="async" data-cfasync="false" src="https://pl28245447.effectivegatecpm.com/8ca532b1ecc871c8269845a5294e401b/invoke.js"></script>
            <div id="container-8ca532b1ecc871c8269845a5294e401b"></div>
        </div>
    </div>

    <div id="games" class="section">
        <div style="background: rgba(251, 191, 36, 0.1); padding: 10px; border-radius: 10px; margin-bottom: 15px; border: 1px solid var(--gold); font-size:11px;">
            🎮 Play any game to earn <b>+500 Coins</b> instantly!
        </div>

        <div class="game-grid">
            <div class="game-card" onclick="playAndEarn('Subway Surfers', 'https://poki.com/en/g/subway-surfers')">
                <div class="game-badge">EARN +500</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Subway_Surfers_App_Icon.png">
            </div>
            <div class="game-card" onclick="playAndEarn('Temple Run', 'https://poki.com/en/g/temple-run-2')">
                <div class="game-badge">EARN +500</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/6/69/Temple_Run_2_icon.jpg">
            </div>
            <div class="game-card" onclick="playAndEarn('Candy Saga', 'https://poki.com/en/g/sweet-world')">
                <div class="game-badge">EARN +500</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/2/22/Candy_Crush_Saga_Icon.png">
            </div>
            <div class="game-card" onclick="playAndEarn('Ludo Hero', 'https://poki.com/en/g/ludo-hero')">
                <div class="game-badge">EARN +500</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/8/82/Ludo_King_logo.png">
            </div>
        </div>
    </div>

    <div id="oracle" class="section">
        
        <div id="oracleInput">
            <div style="font-size: 50px; margin-bottom: 10px;">🔮</div>
            <h3>Future Career Prediction</h3>
            <p style="font-size:11px; color:#aaa; margin-bottom:20px;">AI will scan your bio-data to predict your 2030 Job.</p>
            
            <input type="text" id="userNameInput" class="input-glass" placeholder="Your Name">
            <input type="number" class="input-glass" placeholder="Birth Year (e.g. 2002)">
            
            <button class="btn-main" onclick="predictFuture()">✨ Reveal My Future</button>
        </div>

        <div id="oracleResult" style="display:none;">
            <div id="captureArea" class="result-container">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="res-img" id="careerIcon">
                <div style="font-size:10px; color:#aaa; margin-bottom:5px;">OFFICIAL PREDICTION FOR 2030</div>
                <h1 class="res-title" id="careerResult">IAS OFFICER</h1>
                <p class="res-desc" id="careerDesc">"You will lead the nation with pride."</p>
                <div style="background:#333; color:white; padding:5px; border-radius:5px; font-size:10px; display:inline-block;">
                    Name: <span id="resName" style="color:var(--gold);">User</span>
                </div>
                <div class="watermark">Verified by @PersonalGrowth24_Bot</div>
            </div>

            <button class="btn-download" onclick="downloadImage()">
                <span>📥</span> Download Photo (HD)
            </button>
            <button class="btn-main" style="background:#333; margin-top:5px;" onclick="location.reload()">🔄 Check Again</button>
        </div>

    </div>

    <div id="noCoinModal" class="modal-overlay">
        <div class="modal-box">
            <div style="font-size:40px;">🚫</div>
            <h3 style="color:var(--red);">Insufficient Coins!</h3>
            <p style="font-size:12px; color:#ccc;">You need <b>5,000 Coins</b> to unlock this premium content.</p>
            <hr style="border:1px solid #333; margin:15px 0;">
            <p style="font-size:12px;">👇 <b>How to Earn?</b></p>
            <button class="btn-main" style="background:var(--gold); color:black;" onclick="watchAdReward()">📺 Watch Ad (+1000 Coins)</button>
            <button class="btn-main" style="background:var(--blue);" onclick="closeModal()">🎮 Play Games</button>
        </div>
    </div>

    <script type="text/javascript" src="https://pl28245444.effectivegatecpm.com/50/d7/2c/50d72c91dd048c42dae784892264442e.js"></script>

    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0f172a'); tg.setBackgroundColor('#0f172a');

        const adLink = "{{ ad_link }}";
        const user = tg.initDataUnsafe.user;
        let coins = parseInt(localStorage.getItem('user_coins')) || 500; // 500 Welcome Bonus

        // Init
        document.getElementById('username').innerText = user ? user.first_name : "Guest";
        updateBalance();

        // --- ECONOMY LOGIC ---
        function updateBalance() {
            document.getElementById('coinBalance').innerText = coins.toLocaleString();
            localStorage.setItem('user_coins', coins);
        }

        function addCoins(amount) {
            coins += amount;
            updateBalance();
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            tg.showPopup({ title: 'Coins Earned!', message: `You received ${amount} coins.` });
        }

        function unlockContent(cost, url) {
            if (coins >= cost) {
                tg.showConfirm(`Unlock this for ${cost} Coins?`, (ok) => {
                    if(ok) {
                        coins -= cost;
                        updateBalance();
                        tg.openLink(url);
                    }
                });
            } else {
                document.getElementById('noCoinModal').style.display = 'flex';
            }
        }

        function watchAdReward() {
            tg.openLink(adLink);
            setTimeout(() => {
                addCoins(1000);
                closeModal();
            }, 3000); // Simulate ad watch time
        }

        function playAndEarn(gameName, url) {
            tg.showPopup({
                title: `Play ${gameName}`,
                message: 'Launch game & earn 500 coins instantly!',
                buttons: [{type:'ok', text:'Play & Earn'}]
            }, () => {
                tg.openLink(adLink); // Ad first
                setTimeout(() => {
                    tg.openLink(url);
                    addCoins(500);
                }, 1000);
            });
        }

        // --- ORACLE & DOWNLOAD LOGIC ---
        function predictFuture() {
            const name = document.getElementById('userNameInput').value;
            if(!name) return tg.showAlert("Please enter your name!");

            document.getElementById('oracleInput').style.display = 'none';
            tg.showPopup({title: 'Scanning...', message: 'Analyzing AI Database...'});

            setTimeout(() => {
                const careers = [
                    {title: "IAS OFFICER", desc: "You will lead the district with power.", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"},
                    {title: "BILLIONAIRE", desc: "Forbes List is waiting for you.", icon: "https://cdn-icons-png.flaticon.com/512/2482/2482520.png"},
                    {title: "TECH CEO", desc: "You will build the next Google.", icon: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png"},
                    {title: "IPS OFFICER", desc: "Crime will tremble at your name.", icon: "https://cdn-icons-png.flaticon.com/512/942/942799.png"}
                ];
                const rand = careers[Math.floor(Math.random() * careers.length)];

                document.getElementById('resName').innerText = name;
                document.getElementById('careerResult').innerText = rand.title;
                document.getElementById('careerDesc').innerText = rand.desc;
                document.getElementById('careerIcon').src = rand.icon;

                document.getElementById('oracleResult').style.display = 'block';
                confetti();
            }, 2000);
        }

        // 📸 IMAGE DOWNLOADER (Fix for Screenshot Issue)
        function downloadImage() {
            const captureElement = document.getElementById('captureArea');
            
            html2canvas(captureElement, {
                backgroundColor: "#1e293b", // Background color
                scale: 2 // High Quality
            }).then(canvas => {
                // Create a fake link to trigger download
                const link = document.createElement('a');
                link.download = 'My_Future_Prediction.png';
                link.href = canvas.toDataURL("image/png");
                link.click();
                tg.showAlert("✅ Image Saved to Gallery!");
            }).catch(err => {
                console.error(err);
                tg.showAlert("Error saving image. Try again.");
            });
        }

        // --- UTILS ---
        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }
        function openLink(url) { tg.openLink(url); }
        function closeModal() { document.getElementById('noCoinModal').style.display = 'none'; }

    </script>
</body>
</html>
"""

# --- FLASK ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, ad_link=AD_LINK)

# --- BOT START ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 Claim 1000 Coins (Bonus)", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN SUPER APP", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n"
                f"💎 **Welcome to Growth Hub Premium**\n"
                f"Your All-in-One Super App is ready:\n\n"
                f"🪙 **Earn Coins & Rewards**\n"
                f"📝 **Unlock Premium Notes**\n"
                f"📸 **Download AI Predictions**\n\n"
                f"👇 **Tap below to Start:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    threading.Thread(target=run_flask).start()
    
    print("Bot Started...")
    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
    except Exception:
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    main()


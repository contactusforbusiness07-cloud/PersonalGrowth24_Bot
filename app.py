import os
import threading
import signal
import sys
import asyncio
from flask import Flask, render_template_string, request, jsonify
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# --- 💰 ADSTERRA SMARTLINK (Direct Link) ---
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

# --- 💾 MEMORY DATABASE ---
user_referrals = {}

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 UI TEMPLATE (Fixed Game Logic + All Ads) ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Growth Hub</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Rajdhani:wght@600;800&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --blue: #3b82f6; --green: #22c55e; --red: #ef4444; }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 15px; padding-bottom: 90px; text-align: center; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        /* HEADER */
        .header h1 { font-family: 'Rajdhani', sans-serif; font-size: 26px; margin: 0; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; }
        
        /* TABS */
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }

        .section { display: none; animation: fadeIn 0.3s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* ADS */
        .ad-banner { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; border-radius: 10px; background: #000; border: 1px dashed #333; min-height: 50px; }
        .native-ad-container { margin-top: 30px; padding: 15px; border: 1px solid var(--gold); border-radius: 12px; background: rgba(251, 191, 36, 0.05); }

        /* LIST ITEMS */
        .group-title { text-align: left; font-size: 10px; font-weight: 800; color: var(--gold); letter-spacing: 1px; margin: 25px 0 8px 5px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px 15px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .link-row:active { transform: scale(0.96); background: rgba(255,255,255,0.08); }

        /* GAMES */
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .game-card { background: #000; border-radius: 15px; overflow: hidden; height: 120px; position: relative; cursor: pointer; border: 1px solid #333; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.3s; }
        .game-card:hover img { opacity: 1; transform: scale(1.1); }
        .game-badge { position: absolute; top: 5px; right: 5px; background: var(--green); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; }
        .game-title { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #000 10%, transparent); color: white; font-size: 12px; padding: 8px 5px; text-align: center; font-weight: bold; }

        /* MODALS */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        .modal-content { background: #1e293b; padding: 25px; border-radius: 20px; width: 80%; max-width: 320px; text-align: center; border: 1px solid #444; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
        .btn-modal { width: 100%; padding: 12px; border-radius: 10px; border: none; font-weight: bold; font-size: 14px; margin-top: 10px; cursor: pointer; text-transform: uppercase; }
        .btn-ad { background: var(--gold); color: black; }
        .btn-play { background: var(--green); color: white; display: none; animation: pulse 1s infinite; }
        .btn-close { background: transparent; color: #888; margin-top: 10px; font-size: 12px; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }

        /* ORACLE */
        .glass-input { width: 100%; padding: 15px; background: rgba(0,0,0,0.4); border: 1px solid #444; border-radius: 12px; color: white; text-align: center; font-size: 16px; margin-bottom: 15px; outline: none; }
        .btn-main { background: linear-gradient(135deg, var(--blue), #7c3aed); border: none; padding: 15px; width: 100%; border-radius: 12px; color: white; font-weight: 800; text-transform: uppercase; cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .locked-box { border: 1px dashed var(--gold); border-radius: 15px; padding: 25px; background: rgba(251, 191, 36, 0.05); margin-top: 15px; }
        .progress-bar { height: 6px; background: #334155; border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--green); width: 0%; transition: 0.5s; }
        #loading { display: none; margin-top: 30px; }
        .loader { border: 4px solid #333; border-top: 4px solid var(--gold); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    </style>
</head>
<body>

    <div class="header">
        <h1>PERSONAL GROWTH</h1>
        <div style="font-size: 10px; color: #888;">AI & Career Ecosystem</div>
    </div>

    <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('home')">🏠 Hub</button>
        <button class="tab-btn" onclick="switchTab('games')">🎮 Games</button>
        <button class="tab-btn" onclick="switchTab('oracle')">🔮 Oracle</button>
    </div>

    <div id="home" class="section active">
        <div class="ad-banner">
            <script type="text/javascript">
                atOptions = {
                    'key' : '0ec2eb9dc0e01b5f1b456f0f1e577f22',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/0ec2eb9dc0e01b5f1b456f0f1e577f22/invoke.js"></script>
        </div>

        <div class="group-title">🎓 ENGLISH & SKILLS</div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/The_EnglishRoom5')"><span>🇬🇧 English Room</span> <span>➔</span></div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/English_Speaking_Grammar_Shots')"><span>🗣️ Speaking Shots</span> <span>➔</span></div>

        <div class="group-title">🇮🇳 UPSC & GOVT PREP</div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/UPSC_Notes_Official')"><span>📚 UPSC Notes PDF</span> <span>➔</span></div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/UPSC_Quiz_Vault')"><span>🎯 Quiz Vault</span> <span>➔</span></div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/IAS_PrepQuiz_Zone')"><span>🧠 IAS Prep Zone</span> <span>➔</span></div>

        <div class="group-title">📈 FINANCE & GOVT</div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/MinistryOfTourism')"><span>🏖️ Ministry of Tourism</span> <span>➔</span></div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/GovernmentSchemesIndia')"><span>🏛️ Govt Schemes India</span> <span>➔</span></div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/PersonalFinanceWithShiv')"><span>💰 Personal Finance</span> <span>➔</span></div>

        <div class="native-ad-container">
            <div style="font-size: 10px; color: #888; margin-bottom: 10px; text-transform:uppercase;">🔥 Sponsored Content</div>
            <script async="async" data-cfasync="false" src="https://pl28245447.effectivegatecpm.com/8ca532b1ecc871c8269845a5294e401b/invoke.js"></script>
            <div id="container-8ca532b1ecc871c8269845a5294e401b"></div>
        </div>
    </div>

    <div id="games" class="section">
        <div style="margin-bottom: 15px; font-size: 12px; color: #aaa;">Playing supports our servers. Ads may appear.</div>
        <div class="game-grid">
            <div class="game-card" onclick="initGame('Subway Surfers', 'https://poki.com/en/g/subway-surfers')">
                <div class="game-badge">#1 HOT</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Subway_Surfers_App_Icon.png">
                <div class="game-title">Subway Surfers</div>
            </div>
            <div class="game-card" onclick="initGame('Temple Run 2', 'https://poki.com/en/g/temple-run-2')">
                <div class="game-badge">VIRAL</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/6/69/Temple_Run_2_icon.jpg">
                <div class="game-title">Temple Run 2</div>
            </div>
            <div class="game-card" onclick="initGame('Stickman Hook', 'https://poki.com/en/g/stickman-hook')">
                <div class="game-badge">FUN</div>
                <img src="https://play-lh.googleusercontent.com/yXqfC4GcyhX5a_rF8XzZ8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k8k">
                <div class="game-title">Stickman Hook</div>
            </div>
            <div class="game-card" onclick="initGame('Drive Mad', 'https://poki.com/en/g/drive-mad')">
                <div class="game-badge">CARS</div>
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/5d5489726207005481774efd9b0485a4.png">
                <div class="game-title">Drive Mad</div>
            </div>
            <div class="game-card" onclick="initGame('Moto X3M', 'https://poki.com/en/g/moto-x3m')">
                <div class="game-badge">BIKE</div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Moto_X3M_Logo.jpg" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3097/3097180.png'">
                <div class="game-title">Moto X3M</div>
            </div>
            <div class="game-card" onclick="initGame('Ludo Hero', 'https://poki.com/en/g/ludo-hero')">
                <div class="game-badge">CLASSIC</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/8/82/Ludo_King_logo.png">
                <div class="game-title">Ludo Hero</div>
            </div>
        </div>
    </div>

    <div id="oracle" class="section">
        <div id="step1">
            <div style="font-size: 50px; margin-bottom: 10px;">🧬</div>
            <p>Enter your details to generate 2026 Prediction.</p>
            <input type="text" id="userName" class="glass-input" placeholder="Your Full Name">
            <button class="btn-main" onclick="startScan()">🔮 GENERATE REPORT</button>
        </div>
        <div id="loading">
            <div class="loader"></div>
            <div id="loadText" style="font-size:12px; color:var(--gold);">SCANNING TIMELINE...</div>
        </div>
        <div id="lockedView" style="display:none;">
            <div class="locked-box">
                <div style="font-size: 30px;">🔒</div>
                <h3 style="margin: 10px 0;">REPORT GENERATED</h3>
                <p style="font-size: 11px; color: #aaa;">Your file is ready. Share with 3 friends to unlock.</p>
                <div class="progress-bar"><div class="progress-fill" id="pBar"></div></div>
                <div id="pText" style="font-size: 12px; font-weight: bold; margin-bottom: 15px;">0/3 Shared</div>
                <button class="btn-main" style="background: #25D366; font-size:12px;" onclick="shareToTelegram()">🚀 SHARE TO UNLOCK</button>
                <div style="font-size: 10px; margin-top: 10px; color: #666;" onclick="checkServer()">Tap here to refresh status</div>
            </div>
        </div>
        <div id="finalCard" style="display:none; margin-top:20px;">
            <div style="background: var(--card); border: 1px solid var(--gold); padding: 20px; border-radius: 15px;">
                <div style="background:var(--gold); color:black; font-size:10px; font-weight:bold; display:inline-block; padding:3px 8px; border-radius:5px;">CONFIRMED</div>
                <h1 id="destinyRole" style="font-size:32px; color:white; margin:10px 0;">IAS OFFICER</h1>
                <p id="finalName" style="color:var(--blue); font-weight:bold;">Name</p>
                <p style="font-style:italic; font-size:12px; color:#aaa;">"History will remember you."</p>
            </div>
        </div>
    </div>

    <div id="gameModal" class="modal-overlay">
        <div class="modal-content">
            <h2 id="modalTitle" style="margin-top: 0; font-size: 20px;">Ready to Play?</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 20px;">Watch a quick ad to unlock this premium game.</p>
            
            <button id="btnOpenAd" class="btn-modal btn-ad" onclick="openAdForGame()">📺 OPEN AD (Step 1)</button>
            <button id="btnPlay" class="btn-modal btn-play" onclick="launchGame()">🎮 PLAY GAME (Step 2)</button>
            
            <button class="btn-modal btn-close" onclick="closeModal()">Cancel</button>
        </div>
    </div>

    <script type="text/javascript" src="https://pl28245444.effectivegatecpm.com/50/d7/2c/50d72c91dd048c42dae784892264442e.js"></script>

    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0f172a'); tg.setBackgroundColor('#0f172a');

        const adLink = "{{ ad_link }}";
        const userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "TEST";
        const botUser = "{{ bot_username }}";
        let activeGameUrl = "";

        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }

        function openChannelWithAd(channelUrl) {
            tg.showConfirm("📢 Opening Sponsor Ad first...", (ok) => {
                if(ok) {
                    tg.openLink(adLink);
                    setTimeout(() => { tg.openLink(channelUrl); }, 1500); 
                } else {
                    tg.openLink(channelUrl);
                }
            });
        }

        // --- NEW GAME LOGIC (POPUP FIX) ---
        function initGame(name, url) {
            activeGameUrl = url;
            document.getElementById('modalTitle').innerText = "Play " + name;
            document.getElementById('gameModal').style.display = 'flex';
            
            // Reset Buttons
            document.getElementById('btnOpenAd').style.display = 'block';
            document.getElementById('btnPlay').style.display = 'none';
        }

        function openAdForGame() {
            tg.openLink(adLink);
            
            // Switch Buttons immediately
            document.getElementById('btnOpenAd').style.display = 'none';
            document.getElementById('btnPlay').style.display = 'block';
        }

        function launchGame() {
            if(activeGameUrl) tg.openLink(activeGameUrl);
            closeModal();
        }

        function closeModal() {
            document.getElementById('gameModal').style.display = 'none';
        }

        // --- ORACLE LOGIC ---
        function startScan() {
            const name = document.getElementById('userName').value;
            if(!name) { tg.showAlert("Enter Name!"); return; }
            document.getElementById('step1').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            setTimeout(() => { document.getElementById('loadText').innerText = "ANALYZING BIOMETRICS..."; }, 1500);
            setTimeout(() => { 
                document.getElementById('loading').style.display = 'none';
                document.getElementById('lockedView').style.display = 'block';
                checkServer();
            }, 3000);
        }

        function shareToTelegram() {
            const refLink = `https://t.me/${botUser}?start=ref_${userId}`;
            const msg = "🔥 AI Career Prediction! 😱\\nI just checked my 2026 Destiny.\\n\\n👇 Check yours free:\\n" + refLink;
            tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(msg));
        }

        function checkServer() {
            fetch(`/api/check_referrals?user_id=${userId}`)
                .then(r => r.json())
                .then(d => {
                    const count = d.count;
                    const max = 3;
                    const pct = Math.min((count/max)*100, 100);
                    document.getElementById('pBar').style.width = pct + "%";
                    document.getElementById('pText').innerText = count + "/3 Shared";
                    if(count >= max) {
                        document.getElementById('lockedView').style.display = 'none';
                        document.getElementById('finalCard').style.display = 'block';
                        document.getElementById('finalName').innerText = document.getElementById('userName').value;
                        const roles = ["IAS OFFICER", "BILLIONAIRE", "IPS OFFICER", "TECH CEO", "MINISTER"];
                        document.getElementById('destinyRole').innerText = roles[Math.floor(Math.random()*roles.length)];
                        confetti();
                    }
                });
        }
        setInterval(checkServer, 5000);
    </script>
</body>
</html>
"""

# --- FLASK ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, ad_link=AD_LINK, bot_username=BOT_USERNAME)

@app.route('/api/check_referrals')
def check_api():
    uid = request.args.get('user_id')
    count = len(user_referrals.get(str(uid), []))
    if uid == "TEST": count = 1 
    return jsonify({"count": count})

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    args = context.args
    
    if args and args[0].startswith("ref_"):
        ref_id = args[0].split("_")[1]
        new_id = str(user.id)
        if ref_id != new_id:
            if ref_id not in user_referrals: user_referrals[ref_id] = []
            if new_id not in user_referrals[ref_id]:
                user_referrals[ref_id].append(new_id)
                try: await context.bot.send_message(ref_id, f"🎉 New Referral: {user.first_name}")
                except: pass

    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 SPECIAL OFFER (Sponsored)", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN PERSONAL GROWTH HUB", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # ✅ PROFESSIONAL OFFICE IMAGE
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Welcome, {user.first_name}!**\n\n"
                f"💼 **Personal Growth 24/7 Ecosystem**\n"
                f"Unlock your potential with our curated resources:\n\n"
                f"📚 **Civil Services & Education**\n"
                f"💰 **Financial Freedom**\n"
                f"🔮 **AI Career Oracle**\n"
                f"🎮 **Stress Buster Games**\n\n"
                f"👇 **Tap below to Enter the Hub:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

# --- RUNNER WITH CLEANUP ---
def run_flask():
    app.run(host="0.0.0.0", port=PORT)

async def shutdown(application):
    """Gracefully stop the bot"""
    print("Stopping bot...")
    await application.stop()
    await application.shutdown()

def main():
    # 1. Clean up lingering webhooks
    temp_app = Application.builder().token(TOKEN).build()
    
    # 2. Setup Application
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    
    # 3. Start Flask in background
    threading.Thread(target=run_flask, daemon=True).start()
    
    print(f"Bot {BOT_USERNAME} is Live!")

    # 4. START POLLING (With Conflict Fixes)
    # drop_pending_updates=True clears old queue
    # allowed_updates limits what we listen to
    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True, close_loop=False)
    except Exception as e:
        print(f"Error: {e}")
        # Force exit if conflict persists
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    # Handle Stop Signals (Render Redeploy)
    signal.signal(signal.SIGINT, lambda s, f: os._exit(0))
    signal.signal(signal.SIGTERM, lambda s, f: os._exit(0))
    main()

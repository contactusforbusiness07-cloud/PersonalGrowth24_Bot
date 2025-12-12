import os
import threading
from flask import Flask, render_template_string, request, jsonify
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# --- 💰 ADSTERRA SETUP (UPDATED) ---
# Smartlink (Direct Link) yahan lagaya hai
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

# --- 💾 MEMORY DATABASE ---
user_referrals = {}

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 ULTRA-PREMIUM UI TEMPLATE ---
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
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --blue: #3b82f6; --green: #22c55e; --border: rgba(255,255,255,0.1); }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 15px; padding-bottom: 90px; text-align: center; user-select: none; }
        
        /* HEADER & TABS */
        .header h1 { font-family: 'Rajdhani', sans-serif; font-size: 26px; margin: 0; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; }
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid var(--border); }

        /* SECTIONS */
        .section { display: none; animation: fadeIn 0.4s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* AD BANNER CONTAINER */
        .ad-banner {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            overflow: hidden;
            border-radius: 10px;
            background: #000;
            border: 1px dashed #333;
            min-height: 50px;
        }

        /* LISTS & GROUPS */
        .group-title { text-align: left; font-size: 10px; font-weight: 800; color: var(--gold); letter-spacing: 1px; margin: 25px 0 8px 5px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px 15px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .link-row:active { transform: scale(0.98); background: rgba(255,255,255,0.08); }
        .link-text { font-size: 13px; font-weight: 600; color: #e2e8f0; }
        
        /* GAMES GRID */
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .game-card { background: #000; border-radius: 15px; overflow: hidden; height: 110px; position: relative; cursor: pointer; border: 1px solid #333; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.3s; }
        .game-card:hover img { opacity: 1; transform: scale(1.1); }
        .game-badge { position: absolute; top: 5px; right: 5px; background: var(--green); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; }
        .game-title { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, black, transparent); color: white; font-size: 11px; padding: 8px 5px; text-align: center; font-weight: bold; }

        /* ORACLE & LOCK */
        .glass-input { width: 100%; padding: 15px; background: rgba(0,0,0,0.4); border: 1px solid #444; border-radius: 12px; color: white; text-align: center; font-size: 16px; margin-bottom: 15px; outline: none; }
        .btn-main { background: linear-gradient(135deg, var(--blue), #7c3aed); border: none; padding: 15px; width: 100%; border-radius: 12px; color: white; font-weight: 800; text-transform: uppercase; cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        
        .locked-box { border: 1px dashed var(--gold); border-radius: 15px; padding: 25px; background: rgba(251, 191, 36, 0.05); margin-top: 15px; }
        .progress-bar { height: 6px; background: #334155; border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--green); width: 0%; transition: 0.5s; }

        /* LOADING */
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
        <div class="link-row" onclick="openChannelWithAd('https://t.me/The_EnglishRoom5')">
            <span class="link-text">🇬🇧 English Room</span> <span>➔</span>
        </div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/English_Speaking_Grammar_Shots')">
            <span class="link-text">🗣️ Speaking Shots</span> <span>➔</span>
        </div>

        <div class="group-title">🇮🇳 UPSC & GOVT PREP</div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/UPSC_Notes_Official')">
            <span class="link-text">📚 UPSC Notes PDF</span> <span>➔</span>
        </div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/UPSC_Quiz_Vault')">
            <span class="link-text">🎯 Quiz Vault</span> <span>➔</span>
        </div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/IAS_PrepQuiz_Zone')">
            <span class="link-text">🧠 IAS Prep Zone</span> <span>➔</span>
        </div>

        <div class="group-title">📈 FINANCE & GOVT</div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/MinistryOfTourism')">
            <span class="link-text">🏖️ Ministry of Tourism</span> <span>➔</span>
        </div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/GovernmentSchemesIndia')">
            <span class="link-text">🏛️ Govt Schemes India</span> <span>➔</span>
        </div>
        <div class="link-row" onclick="openChannelWithAd('https://t.me/PersonalFinanceWithShiv')">
            <span class="link-text">💰 Personal Finance</span> <span>➔</span>
        </div>
    </div>

    <div id="games" class="section">
        <div style="margin-bottom: 15px; font-size: 12px; color: #aaa;">
            Playing supports our servers. Ads may appear.
        </div>
        
        <div class="game-grid">
            <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/subway-surfers')">
                <div class="game-badge">HOT</div>
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/b5bdd328122d250325d97e3f2252a12d.png">
                <div class="game-title">Subway Surfers</div>
            </div>

            <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/temple-run-2')">
                <div class="game-badge">VIRAL</div>
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/96778465-45d6-4447-9759-d89063bc9785.jpg">
                <div class="game-title">Temple Run 2</div>
            </div>

            <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/sweet-world')">
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/b99a6d2c49a37d2f9754f2c0382d5696.png">
                <div class="game-title">Candy Saga</div>
            </div>

            <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/2048')">
                <div class="game-badge">IQ</div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2048_Logo.png/600px-2048_Logo.png">
                <div class="game-title">2048 Puzzle</div>
            </div>

             <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/moto-x3m')">
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/00b64f33b1e5dc4220b30d3258548902.png">
                <div class="game-title">Moto X3M</div>
            </div>

            <div class="game-card" onclick="playGameWithAd('https://poki.com/en/g/ludo-hero')">
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/5e73236021669463c6d649bf021262d1.png">
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

    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0f172a'); tg.setBackgroundColor('#0f172a');

        const adLink = "{{ ad_link }}"; // Managed by Flask
        const userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "TEST";
        const botUser = "{{ bot_username }}";

        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }

        // --- AD LOGIC ---
        function openAd(url) {
            tg.openLink(url);
        }

        function openChannelWithAd(channelUrl) {
            tg.showConfirm("📢 Opening Sponsor Ad first...", (ok) => {
                if(ok) {
                    tg.openLink(adLink); // Open Ad
                    setTimeout(() => { tg.openLink(channelUrl); }, 1000); 
                } else {
                    tg.openLink(channelUrl); // Fallback
                }
            });
        }

        function playGameWithAd(gameUrl) {
            tg.showPopup({
                title: "🎮 Starting Game",
                message: "We are loading a quick ad before your game starts.",
                buttons: [{type: "ok", text: "Play Now"}]
            }, () => {
                tg.openLink(adLink); // Open Ad
                setTimeout(() => { tg.openLink(gameUrl); }, 500); 
            });
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
    return render_template_string(HTML_TEMPLATE, 
                                  ad_link=AD_LINK,
                                  bot_username=BOT_USERNAME)

@app.route('/api/check_referrals')
def check_api():
    uid = request.args.get('user_id')
    count = len(user_referrals.get(str(uid), []))
    if uid == "TEST": count = 1 # Testing ke liye
    return jsonify({"count": count})

# --- BOT HANDLERS ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    args = context.args
    
    # Referral Count Logic
    if args and args[0].startswith("ref_"):
        ref_id = args[0].split("_")[1]
        new_id = str(user.id)
        if ref_id != new_id:
            if ref_id not in user_referrals: user_referrals[ref_id] = []
            if new_id not in user_referrals[ref_id]:
                user_referrals[ref_id].append(new_id)
                try: await context.bot.send_message(ref_id, f"🎉 New Referral: {user.first_name}")
                except: pass

    # Render URL
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    # --- WELCOME MESSAGE WITH AD BUTTON ---
    keyboard = [
        [InlineKeyboardButton("🎁 SPECIAL OFFER (Sponsored)", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN GROWTH HUB", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hello {user.first_name}!**\n\n🤖 **AI Neural Scanner 2.0**\n\n🎯 **Features:**\n• Viral Games (No Install)\n• UPSC & Study Material\n• 2026 Future Prediction\n\n👇 **Click below to Enter:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    threading.Thread(target=run_flask).start()
    application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)

if __name__ == "__main__":
    main()

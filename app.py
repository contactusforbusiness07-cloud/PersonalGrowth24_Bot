import os
import threading
from flask import Flask, render_template_string, request, jsonify
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"  # Aapka Token
BOT_USERNAME = "PersonalGrowth24_Bot"
ADMIN_USERNAME = "Mr_MorningStar524"

# --- 💾 MEMORY DATABASE (For Referrals) ---
# Note: Render free tier restart hone par ye data udd jata hai.
# Permanent database ke liye SQL chahiye hoga, par abhi ke liye ye kaam karega.
user_referrals = {}  # { 'referrer_id': [list_of_referred_users] }

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 ULTRA-PREMIUM UI TEMPLATE ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Personal Growth Hub</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Orbitron:wght@500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0f172a;
            --card: #1e293b;
            --text: #f8fafc;
            --gold: #fbbf24;
            --blue: #3b82f6;
            --green: #22c55e;
            --border: rgba(255,255,255,0.1);
        }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 15px; padding-bottom: 80px; text-align: center; }
        
        /* HEADER */
        .header { margin-bottom: 20px; }
        .header h1 { font-size: 22px; margin: 0; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { font-size: 11px; color: #94a3b8; margin-top: 5px; }

        /* TABS */
        .nav-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; background: #000; padding: 5px; border-radius: 50px; }
        .tab-btn { background: transparent; border: none; color: #64748b; padding: 8px 20px; border-radius: 40px; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }

        /* SECTIONS */
        .section { display: none; animation: fadeIn 0.4s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* CARDS */
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
        
        /* CATEGORY GROUPING */
        .group-title { text-align: left; font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 1px; margin: 25px 0 10px 5px; text-transform: uppercase; border-bottom: 1px solid var(--border); padding-bottom: 5px; }
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 12px 15px; border-radius: 10px; margin-bottom: 8px; text-decoration: none; color: #e2e8f0; font-size: 13px; transition: 0.2s; border: 1px solid transparent; }
        .link-row:hover { border-color: var(--blue); background: rgba(59, 130, 246, 0.1); }

        /* LOCKED CONTENT */
        .locked-box { position: relative; padding: 30px 20px; text-align: center; border: 1px dashed #444; border-radius: 15px; background: rgba(0,0,0,0.2); }
        .progress-container { width: 100%; height: 8px; background: #334155; border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--green); width: 0%; transition: 1s; }
        .referral-link { background: #000; color: var(--gold); padding: 10px; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 10px 0; border: 1px solid var(--border); }

        /* GAME ZONE */
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .game-card { background: #000; border-radius: 12px; overflow: hidden; height: 100px; position: relative; cursor: pointer; border: 1px solid #333; }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: 0.3s; }
        .game-card:hover img { opacity: 1; transform: scale(1.1); }
        .game-title { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.8); color: white; font-size: 10px; padding: 5px; text-align: center; }

        /* ADSTERRA */
        .ad-banner { width: 100%; height: 60px; background: #000; border: 1px dashed #555; display: flex; align-items: center; justify-content: center; margin: 20px 0; border-radius: 10px; overflow: hidden; }
        
        .btn { background: var(--blue); color: white; border: none; padding: 12px; width: 100%; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>PERSONAL GROWTH HUB</h1>
        <p>Curated Resources for Success</p>
    </div>

    <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('home')">🏠 Home</button>
        <button class="tab-btn" onclick="switchTab('games')">🎮 Games</button>
        <button class="tab-btn" onclick="switchTab('oracle')">🔮 Oracle</button>
    </div>

    <div id="home" class="section active">
        
        <div class="ad-banner">
            <a href="https://www.google.com" target="_blank" style="text-decoration:none; color:#666; font-size:10px; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                📢 ADVERTISEMENT (Click Here)
            </a>
        </div>

        <div class="group-title">🎓 ENGLISH MASTERY</div>
        <a href="https://t.me/The_EnglishRoom5" class="link-row"><span>🇬🇧 English Room</span> <span>➔</span></a>
        <a href="https://t.me/English_Speaking_Grammar_Shots" class="link-row"><span>🗣️ Speaking Shots</span> <span>➔</span></a>

        <div class="group-title">🇮🇳 UPSC & CURRENT AFFAIRS</div>
        <a href="https://t.me/UPSC_Notes_Official" class="link-row"><span>📚 UPSC Notes PDF</span> <span>➔</span></a>
        <a href="https://t.me/UPSC_Quiz_Vault" class="link-row"><span>🎯 Quiz Vault</span> <span>➔</span></a>
        <a href="https://t.me/IAS_PrepQuiz_Zone" class="link-row"><span>🧠 IAS Prep Zone</span> <span>➔</span></a>

        <div class="group-title">📈 GOVERNANCE & FINANCE</div>
        <a href="https://t.me/MinistryOfTourism" class="link-row"><span>🏖️ Ministry of Tourism</span> <span>➔</span></a>
        <a href="https://t.me/GovernmentSchemesIndia" class="link-row"><span>🏛️ Govt Schemes India</span> <span>➔</span></a>
        <a href="https://t.me/PersonalFinanceWithShiv" class="link-row"><span>💰 Personal Finance</span> <span>➔</span></a>
    </div>

    <div id="games" class="section">
        <div class="card">
            <h3>🕹️ Game Zone</h3>
            <p style="font-size: 12px; color: #888;">Play instantly. No download required.</p>
            <div class="game-grid">
                <div class="game-card" onclick="playGame('https://poki.com/en/g/subway-surfers')">
                    <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/b5bdd328122d250325d97e3f2252a12d.png" alt="Run">
                    <div class="game-title">Subway Surfers</div>
                </div>
                <div class="game-card" onclick="playGame('https://poki.com/en/g/2048')">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2048_Logo.png/600px-2048_Logo.png" alt="2048">
                    <div class="game-title">2048 Puzzle</div>
                </div>
                <div class="game-card" onclick="playGame('https://poki.com/en/g/temple-run-2')">
                    <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/96778465-45d6-4447-9759-d89063bc9785.jpg" alt="Temple">
                    <div class="game-title">Temple Run 2</div>
                </div>
                <div class="game-card" onclick="playGame('https://poki.com/en/g/moto-x3m')">
                    <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/00b64f33b1e5dc4220b30d3258548902.png" alt="Bike">
                    <div class="game-title">Moto X3M</div>
                </div>
            </div>
        </div>
    </div>

    <div id="oracle" class="section">
        <div class="card">
            <h2>AI CAREER ORACLE</h2>
            
            <div id="lockedView" class="locked-box">
                <div style="font-size: 30px;">🔒</div>
                <h3>LOCKED CONTENT</h3>
                <p style="font-size: 12px; color: #aaa;">To unlock the Prediction Report, invite 3 friends to start this bot.</p>
                
                <div class="referral-link" id="myRefLink">Loading Link...</div>
                <button class="btn" onclick="copyLink()">📋 Copy Link</button>
                <button class="btn" style="background:#22c55e; margin-top:5px;" onclick="shareToTelegram()">🚀 Share Directly</button>

                <p style="margin-top: 20px; font-size: 11px;">YOUR PROGRESS</p>
                <div class="progress-container">
                    <div class="progress-bar" id="pBar"></div>
                </div>
                <div id="pText" style="font-size: 12px; font-weight: bold;">0/3 Friends Joined</div>
                <button onclick="checkServer()" style="background:transparent; border:1px solid #555; color:#888; padding:5px; margin-top:10px; font-size:10px; border-radius:5px;">🔄 Refresh Status</button>
            </div>

            <div id="unlockedView" style="display:none;">
                <h1 style="color: var(--gold); font-size: 30px;">UNLOCKED!</h1>
                <p>Your Destiny: <b>Future Billionaire</b></p>
                <img src="https://media1.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif" width="100%" style="border-radius:10px;">
                <p style="font-size:12px; color:#888;">"Great things take time."</p>
            </div>
        </div>
    </div>

    <script>
        const tg = Telegram.WebApp;
        tg.ready();
        tg.expand();

        const userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "TEST_USER";
        const botUsername = "{{ bot_username }}";
        const refLink = `https://t.me/${botUsername}?start=ref_${userId}`;

        document.getElementById('myRefLink').innerText = refLink;

        function switchTab(tabId) {
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        function copyLink() {
            navigator.clipboard.writeText(refLink);
            tg.showAlert("Link Copied! Send this to your friends.");
        }

        function shareToTelegram() {
            const msg = "🔥 Check this AI Career Scanner! It predicts your future job.\\n\\n👇 Click here to start:\\n" + refLink;
            tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(msg));
        }

        function playGame(url) {
            tg.openLink(url);
        }

        // --- REAL SERVER CHECK ---
        function checkServer() {
            fetch(`/api/check_referrals?user_id=${userId}`)
                .then(res => res.json())
                .then(data => {
                    const count = data.count;
                    const required = 3;
                    const pct = Math.min((count / required) * 100, 100);
                    
                    document.getElementById('pBar').style.width = pct + "%";
                    document.getElementById('pText').innerText = `${count}/${required} Friends Joined`;

                    if(count >= required) {
                        document.getElementById('lockedView').style.display = 'none';
                        document.getElementById('unlockedView').style.display = 'block';
                        confetti();
                    }
                })
                .catch(err => console.error("Error fetching stats", err));
        }

        // Auto check on load
        checkServer();
        setInterval(checkServer, 5000); // Check every 5 seconds
    </script>
</body>
</html>
"""

# --- FLASK ROUTES ---
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, bot_username=BOT_USERNAME)

@app.route('/api/check_referrals')
def check_api():
    user_id = request.args.get('user_id')
    # Agar user list mein nahi hai to 0 return karega
    count = len(user_referrals.get(str(user_id), []))
    # TESTING: Agar user "TEST_USER" hai to humesha 1 dikhayega
    if user_id == "TEST_USER": count = 1
    return jsonify({"count": count})

# --- BOT HANDLERS ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    args = context.args
    
    # --- REFERRAL LOGIC ---
    if args and args[0].startswith("ref_"):
        referrer_id = args[0].split("_")[1]
        new_user_id = str(user.id)
        
        # Check: User khud ko refer nahi kar sakta
        if referrer_id != new_user_id:
            if referrer_id not in user_referrals:
                user_referrals[referrer_id] = []
            
            # Check: Duplicate referral na ho
            if new_user_id not in user_referrals[referrer_id]:
                user_referrals[referrer_id].append(new_user_id)
                
                # Referrer ko notification bhejo (Optional)
                try:
                    await context.bot.send_message(chat_id=referrer_id, text=f"🎉 **New Referral!**\n{user.first_name} just joined using your link!", parse_mode='Markdown')
                except:
                    pass # Agar bot block hai to ignore karo

    # --- WELCOME MESSAGE ---
    # Fetch Render URL
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🚀 OPEN PERSONAL GROWTH HUB", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # NEW PROFESSIONAL IMAGE & TEXT
    img_url = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop" # Business/Planning Image
    
    caption = (
        f"👋 **Welcome, {user.first_name}!**\n\n"
        f"💼 **Personal Growth 24/7 Ecosystem**\n"
        f"Unlock your potential with our curated resources:\n\n"
        f"📚 **Civil Services & Education**\n"
        f"💰 **Financial Freedom**\n"
        f"🔮 **AI Career Oracle**\n"
        f"🎮 **Stress Buster Games**\n\n"
        f"👇 **Tap below to Enter the Hub:**"
    )

    await update.message.reply_photo(
        photo=img_url, 
        caption=caption,
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

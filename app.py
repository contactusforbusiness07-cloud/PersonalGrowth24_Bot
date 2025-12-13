import os
import threading
import signal
import sys
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

PORT = int(os.environ.get("PORT", 10000))
app = Flask(__name__)

# --- 💎 ULTIMATE SUPER APP TEMPLATE ---
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
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --green: #22c55e; --red: #ef4444; --blue: #3b82f6; --purple: #8b5cf6; }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 0; padding-bottom: 90px; text-align: center; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        /* --- 1. NEW NAVBAR CSS --- */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: #0B1120; /* Dark Blue */
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 18px;
            background: linear-gradient(90deg, #6C63FF, #a5b4fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 0.5px;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .coin-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.3);
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .coin-badge:active { transform: scale(0.95); }
        .coin-icon { font-size: 16px; }
        
        .coin-count {
            font-family: 'Roboto', sans-serif;
            font-weight: 700;
            font-size: 15px;
            color: #FFD700;
        }

        .plus-icon {
            background: #FFD700;
            color: #000;
            font-size: 10px;
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: bold;
            margin-left: 4px;
        }

        .menu-icon svg {
            width: 28px;
            height: 28px;
            color: #ffffff;
            opacity: 0.8;
            cursor: pointer;
        }

        /* --- REST OF THE CSS --- */
        .container { padding: 15px; }

        /* PROGRESS BAR */
        .progress-wrapper { background: #334155; height: 6px; border-radius: 10px; margin: 15px 15px 5px 15px; position: relative; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--green); width: 0%; transition: 1s; }
        .progress-text { font-size: 10px; color: #94a3b8; margin: 0 15px 20px 15px; display: flex; justify-content: space-between; }

        /* TABS */
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }

        .section { display: none; animation: fadeIn 0.3s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* ADS */
        .ad-banner { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; border-radius: 10px; background: #000; border: 1px dashed #333; min-height: 50px; }
        .native-ad-container { margin-top: 20px; padding: 10px; border: 1px solid var(--gold); border-radius: 12px; background: rgba(251, 191, 36, 0.05); }

        /* TOOLS GRID (Hub) */
        .tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .tool-card { background: var(--card); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .tool-card:active { transform: scale(0.95); }
        .tool-icon { font-size: 24px; margin-bottom: 5px; }
        .tool-name { font-size: 12px; font-weight: bold; }
        .hot-tag { position: absolute; top: 0; right: 0; background: var(--red); font-size: 8px; padding: 2px 6px; border-bottom-left-radius: 8px; font-weight: bold; }

        /* LOCKED CONTENT */
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px 15px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .link-row:active { background: rgba(255,255,255,0.1); }
        .lock-icon { font-size: 12px; }

        /* GAMES */
        .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .game-card { background: #000; border-radius: 15px; overflow: hidden; height: 120px; position: relative; cursor: pointer; border: 1px solid #333; }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .tournament-badge { position: absolute; top: 5px; left: 5px; background: var(--gold); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; animation: blink 1s infinite; }
        .earn-badge { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.8); color: var(--green); font-size: 10px; font-weight: bold; padding: 5px 0; }
        @keyframes blink { 50% { opacity: 0.5; } }

        /* ORACLE & VIRAL */
        .viral-btn { background: linear-gradient(135deg, #ec4899, #8b5cf6); width: 100%; padding: 15px; border-radius: 15px; border: none; color: white; font-weight: bold; margin-bottom: 10px; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        
        .result-container { background: linear-gradient(180deg, #1e293b, #000); border: 2px solid var(--gold); border-radius: 20px; padding: 20px; margin-top: 20px; text-align: center; position: relative; overflow: hidden; }
        .res-img { width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--gold); margin: 0 auto 10px; object-fit: cover; }
        .res-title { font-family: 'Orbitron', sans-serif; color: var(--gold); font-size: 22px; margin: 5px 0; text-transform: uppercase; }
        .watermark { position: absolute; bottom: 5px; right: 10px; font-size: 8px; color: #555; }

        /* FLOATING GIFT */
        .floating-gift { position: fixed; bottom: 90px; right: 20px; width: 50px; height: 50px; background: url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZ0OXBoZnEzZnB6ZnB6ZnB6ZnB6ZnB6ZnB6ZnB6/26tOZ42Mg6pbTUPDa/giphy.gif') no-repeat center/cover; z-index: 999; cursor: pointer; filter: drop-shadow(0 0 10px var(--gold)); }

        /* MODALS */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        .modal-box { background: #1e293b; padding: 25px; border-radius: 20px; width: 85%; max-width: 350px; text-align: center; border: 1px solid #444; position: relative; }
        .close-btn { position: absolute; top: 10px; right: 15px; font-size: 20px; cursor: pointer; color: #aaa; }
        .input-glass { width: 90%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 10px; color: white; margin-bottom: 15px; text-align: center; outline: none; }
        .btn-main { background: linear-gradient(135deg, var(--blue), #7c3aed); border: none; padding: 12px; width: 100%; border-radius: 10px; color: white; font-weight: 800; cursor: pointer; margin-top: 10px; }
        .btn-download { background: #fff; color: black; border: none; padding: 10px; width: 100%; border-radius: 10px; font-weight: bold; margin-top: 10px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 5px; }

    </style>
</head>
<body>

    <nav class="navbar">
        <div class="nav-brand">
            <span class="brand-text">Personal Growth</span>
        </div>

        <div class="nav-actions">
            <div class="coin-badge" onclick="showEarnModal()">
                <span class="coin-icon">🪙</span>
                <span class="coin-count" id="userCoins">0</span>
                <div class="plus-icon">+</div>
            </div>

            <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    </nav>

    <div style="margin-top: 10px; padding: 0 15px; display: flex; justify-content: space-between; align-items: center;">
        <div id="userNameDisplay" style="color: #aaa; font-size: 14px;">Hi, User</div>
        <div style="color:var(--green); font-size: 12px; font-weight:bold;">● Online</div>
    </div>

    <div class="container">

        <div class="floating-gift" onclick="openBonusGift()"></div>

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
            
            <div id="wordModal" class="modal-overlay">
                <div class="modal-box" style="border-color: var(--green);">
                    <span class="close-btn" onclick="closeModal('wordModal')">&times;</span>
                    <h3>📖 Word of the Day</h3>
                    <h1 style="color: var(--green); margin: 10px 0;">TENACITY</h1>
                    <p style="font-size: 12px; color: #ccc;">(Noun) The quality of being very determined.</p>
                    <button class="btn-main" onclick="closeModal('wordModal'); addCoins(20);">✅ I Learned This (+20 Coins)</button>
                </div>
            </div>

            <div class="ad-banner">
                <script type="text/javascript">
                    atOptions = { 'key' : '0ec2eb9dc0e01b5f1b456f0f1e577f22', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/0ec2eb9dc0e01b5f1b456f0f1e577f22/invoke.js"></script>
            </div>

            <div class="group-title">🛠️ VIRAL TOOLS</div>
            <div class="tools-grid">
                <div class="tool-card" onclick="openResumeBuilder()">
                    <div class="hot-tag">HOT</div>
                    <div class="tool-icon">📄</div>
                    <div class="tool-name">CV Builder</div>
                </div>
                <div class="tool-card" onclick="tg.showAlert('Govt Scheme Checker: Coming Soon!')">
                    <div class="tool-icon">🏛️</div>
                    <div class="tool-name">Scheme Check</div>
                </div>
            </div>

            <div class="group-title">🔒 PREMIUM (5000 Coins)</div>
            <div class="link-row" onclick="unlockContent(5000, 'https://t.me/UPSC_Notes_Official')">
                <span>📚 UPSC Notes PDF</span> <span>🔒</span>
            </div>
            <div class="link-row" onclick="unlockContent(5000, 'https://t.me/IAS_PrepQuiz_Zone')">
                <span>🧠 IAS Secret Strategy</span> <span>🔒</span>
            </div>

            <div class="group-title">🔓 FREE RESOURCES</div>
            <div class="link-row" onclick="openLink('https://t.me/The_EnglishRoom5')"><span>🇬🇧 English Hub</span> <span>➔</span></div>
            <div class="link-row" onclick="openLink('https://t.me/PersonalFinanceWithShiv')"><span>💰 Finance Tips</span> <span>➔</span></div>

            <div class="native-ad-container">
                <div style="font-size:10px; color:#666; margin-bottom:5px;">SPONSORED</div>
                <script async="async" data-cfasync="false" src="https://pl28245447.effectivegatecpm.com/8ca532b1ecc871c8269845a5294e401b/invoke.js"></script>
                <div id="container-8ca532b1ecc871c8269845a5294e401b"></div>
            </div>
        </div>

        <div id="games" class="section">
            <div style="background: rgba(251, 191, 36, 0.1); padding: 10px; border-radius: 10px; margin-bottom: 15px; border: 1px solid var(--gold); font-size:11px;">
                🎮 Play & Earn <b>+500 Coins</b> per session!
            </div>

            <div class="game-grid">
                <div class="game-card" onclick="playAndEarn('Subway Surfers', 'https://poki.com/en/g/subway-surfers')">
                    <div class="tournament-badge">🏆 LIVE</div>
                    <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Subway_Surfers_App_Icon.png">
                    <div class="earn-badge">EARN +500</div>
                </div>
                <div class="game-card" onclick="playAndEarn('Temple Run', 'https://poki.com/en/g/temple-run-2')">
                    <img src="https://upload.wikimedia.org/wikipedia/en/6/69/Temple_Run_2_icon.jpg">
                    <div class="earn-badge">EARN +500</div>
                </div>
                <div class="game-card" onclick="playAndEarn('Candy Saga', 'https://poki.com/en/g/sweet-world')">
                    <img src="https://upload.wikimedia.org/wikipedia/en/2/22/Candy_Crush_Saga_Icon.png">
                    <div class="earn-badge">EARN +500</div>
                </div>
                <div class="game-card" onclick="playAndEarn('Ludo Hero', 'https://poki.com/en/g/ludo-hero')">
                    <img src="https://upload.wikimedia.org/wikipedia/en/8/82/Ludo_King_logo.png">
                    <div class="earn-badge">EARN +500</div>
                </div>
            </div>
        </div>

        <div id="oracle" class="section">
            <div class="group-title">VIRAL PREDICTIONS</div>
            
            <button class="viral-btn" onclick="openCalc('love')">
                <span>❤️ Love Calculator</span> <span>👉</span>
            </button>
            <button class="viral-btn" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);" onclick="openCalc('marriage')">
                <span>💍 When will I Marry?</span> <span>👉</span>
            </button>
            
            <div id="oracleInput" style="margin-top:20px;">
                <div style="font-size: 40px; margin-bottom: 10px;">🔮</div>
                <h3>2030 Career Prediction</h3>
                <p style="font-size:11px; color:#aaa; margin-bottom:15px;">AI Neural Scan for Future Job</p>
                <input type="text" id="userNameInput" class="input-glass" placeholder="Your Name">
                <button class="btn-main" onclick="predictFuture()">✨ Reveal My Future</button>
            </div>

            <div id="oracleResult" style="display:none;">
                <div id="captureArea" class="result-container">
                    <img src="" class="res-img" id="careerIcon">
                    <div style="font-size:10px; color:#aaa; margin-bottom:5px;">OFFICIAL PREDICTION</div>
                    <h1 class="res-title" id="careerResult">IAS OFFICER</h1>
                    <p style="font-size:12px; color:#ccc;" id="careerDesc">...</p>
                    <div style="background:#333; color:white; padding:5px; border-radius:5px; font-size:10px; display:inline-block; margin-top:10px;">
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

        <div id="resumeModal" class="modal-overlay">
            <div class="modal-box">
                <span class="close-btn" onclick="closeModal('resumeModal')">&times;</span>
                <h3>📄 Create Professional CV</h3>
                <input type="text" id="cvName" class="input-glass" placeholder="Full Name">
                <input type="text" id="cvSkill" class="input-glass" placeholder="Key Skills (e.g. Python)">
                <button class="btn-main" onclick="generateCV()">✨ Generate PDF</button>
            </div>
        </div>

        <div id="calcModal" class="modal-overlay">
            <div class="modal-box">
                <span class="close-btn" onclick="closeModal('calcModal')">&times;</span>
                <h3 id="calcTitle">Calculator</h3>
                <input type="text" id="p1Name" class="input-glass" placeholder="Your Name">
                <input type="text" id="p2Name" class="input-glass" placeholder="Partner Name (Optional)">
                <button class="btn-main" style="background:var(--purple);" onclick="calculateResult()">🔮 Reveal Destiny</button>
            </div>
        </div>

        <div id="noCoinModal" class="modal-overlay">
            <div class="modal-box">
                <span class="close-btn" onclick="closeModal('noCoinModal')">&times;</span>
                <div style="font-size:40px;">💰</div>
                <h3 style="color:var(--gold);">Earn Coins</h3>
                <p style="font-size:12px; color:#ccc;">Get coins to unlock Premium Notes.</p>
                <hr style="border:1px solid #333; margin:15px 0;">
                <button class="btn-main" style="background:var(--gold); color:black;" onclick="watchAdReward()">📺 Watch Ad (+1000 Coins)</button>
            </div>
        </div>

        <div id="resultModal" class="modal-overlay">
            <div class="modal-box">
                 <span class="close-btn" onclick="closeModal('resultModal')">&times;</span>
                 <h2 id="finalResTitle">Result</h2>
                 <h1 id="finalResVal" style="color:var(--gold);">99%</h1>
                 <p style="font-size:11px; color:#aaa;">Screenshot & Share!</p>
            </div>
        </div>

    </div> <script type="text/javascript" src="https://pl28245444.effectivegatecpm.com/50/d7/2c/50d72c91dd048c42dae784892264442e.js"></script>

    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0B1120'); tg.setBackgroundColor('#0B1120'); // Changed header color to match Navbar

        const adLink = "{{ ad_link }}";
        const user = tg.initDataUnsafe.user;
        let coins = parseInt(localStorage.getItem('user_coins')) || 500;
        let tasks = parseInt(localStorage.getItem('daily_tasks')) || 0;

        // Init
        document.getElementById('userNameDisplay').innerText = user ? "Hi, " + user.first_name : "Hi, User";
        updateCoinsDisplay(); // Updated Function Call
        updateProgress(0);
        setTimeout(() => document.getElementById('wordModal').style.display = 'flex', 2000);

        // --- ECONOMY ---
        function updateCoinsDisplay() {
            // Updated to use the new ID 'userCoins' from the Navbar
            const coinElement = document.getElementById('userCoins');
            coinElement.innerText = coins.toLocaleString();
            localStorage.setItem('user_coins', coins);
            
            // Animation for coin update
            const badge = document.querySelector('.coin-badge');
            badge.style.background = "rgba(255, 215, 0, 0.4)";
            setTimeout(() => {
                badge.style.background = "rgba(255, 215, 0, 0.1)";
            }, 300);
        }

        function addCoins(amount) {
            coins += amount;
            updateCoinsDisplay();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.1 } }); // Confetti from top
            tg.showPopup({ title: 'Coins Earned!', message: `You received ${amount} coins.` });
            updateProgress(33);
        }

        function unlockContent(cost, url) {
            if (coins >= cost) {
                tg.showConfirm(`Unlock this for ${cost} Coins?`, (ok) => {
                    if(ok) { coins -= cost; updateCoinsDisplay(); tg.openLink(url); }
                });
            } else {
                document.getElementById('noCoinModal').style.display = 'flex';
            }
        }

        function showEarnModal() { document.getElementById('noCoinModal').style.display = 'flex'; }
        
        // --- ADS ---
        function watchAdReward() {
            tg.openLink(adLink);
            setTimeout(() => { addCoins(1000); closeModal('noCoinModal'); }, 2000);
        }
        function openLink(url) {
            tg.showConfirm("Opening link via Sponsor...", (ok) => {
                if(ok) { tg.openLink(adLink); setTimeout(() => tg.openLink(url), 1000); }
                else { tg.openLink(url); }
            });
        }
        function openBonusGift() {
            tg.showConfirm("🎁 Open Bonus Gift?", (ok) => {
                if(ok) { tg.openLink(adLink); setTimeout(() => addCoins(100), 2000); }
            });
        }

        // --- GAMES ---
        function playAndEarn(gameName, url) {
            tg.showPopup({ title: `Play ${gameName}`, message: 'Watch Ad & Earn 500 Coins!', buttons: [{type:'ok', text:'Play'}] }, () => {
                tg.openLink(adLink);
                setTimeout(() => { tg.openLink(url); addCoins(500); }, 1000);
            });
        }

        // --- ORACLE & TOOLS ---
        function openResumeBuilder() { document.getElementById('resumeModal').style.display = 'flex'; }
        function generateCV() {
            const name = document.getElementById('cvName').value;
            if(!name) return tg.showAlert("Enter Name!");
            tg.showConfirm("Generating PDF requires watching an Ad.", (ok) => {
                if(ok) { tg.openLink(adLink); setTimeout(() => { closeModal('resumeModal'); tg.showAlert("✅ CV Sent (Simulated)!"); addCoins(50); }, 2000); }
            });
        }

        let calcType = "";
        function openCalc(type) {
            calcType = type;
            document.getElementById('p2Name').style.display = (type === 'horoscope') ? 'none' : 'block';
            document.getElementById('calcModal').style.display = 'flex';
        }
        function calculateResult() {
            const p1 = document.getElementById('p1Name').value;
            if(!p1) return;
            closeModal('calcModal');
            let res = "";
            if(calcType === 'love') res = "❤️ Match: " + (Math.floor(Math.random() * 20) + 80) + "%";
            else if(calcType === 'marriage') res = "💍 Year: " + (2025 + Math.floor(Math.random() * 5));
            
            document.getElementById('finalResTitle').innerText = calcType.toUpperCase();
            document.getElementById('finalResVal').innerText = res;
            document.getElementById('resultModal').style.display = 'flex';
            confetti();
        }

        // --- CAREER PREDICTOR ---
        function predictFuture() {
            const name = document.getElementById('userNameInput').value;
            if(!name) return tg.showAlert("Enter Name!");
            
            tg.showPopup({title: 'Scanning...', message: 'AI is analyzing your future...'});
            setTimeout(() => {
                const careers = [
                    {title: "IAS OFFICER", desc: "You will lead the district.", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"},
                    {title: "BILLIONAIRE", desc: "Forbes List awaits you.", icon: "https://cdn-icons-png.flaticon.com/512/2482/2482520.png"},
                    {title: "TECH CEO", desc: "Building the next Google.", icon: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png"},
                    {title: "IPS OFFICER", desc: "Crime will tremble.", icon: "https://cdn-icons-png.flaticon.com/512/942/942799.png"}
                ];
                const rand = careers[Math.floor(Math.random() * careers.length)];
                document.getElementById('resName').innerText = name;
                document.getElementById('careerResult').innerText = rand.title;
                document.getElementById('careerDesc').innerText = rand.desc;
                document.getElementById('careerIcon').src = rand.icon;
                
                document.getElementById('oracleInput').style.display = 'none';
                document.getElementById('oracleResult').style.display = 'block';
                confetti();
            }, 2000);
        }

        // --- DOWNLOADER ---
        function downloadImage() {
            const captureElement = document.getElementById('captureArea');
            html2canvas(captureElement, { backgroundColor: "#1e293b", scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'My_Future.png';
                link.href = canvas.toDataURL("image/png");
                link.click();
                tg.showAlert("✅ Image Saved!");
            });
        }

        // --- UTILS ---
        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }
        function updateProgress(val) {
            tasks += val; if(tasks > 100) tasks = 100;
            document.getElementById('dailyProg').style.width = tasks + "%";
            document.getElementById('taskPct').innerText = tasks + "%";
            if(tasks >= 100) document.getElementById('badge').style.display = 'inline';
            localStorage.setItem('daily_tasks', tasks);
        }

    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, ad_link=AD_LINK)

# --- BOT START ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 Claim Bonus Coins", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN SUPER APP", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n"
                f"💎 **Personal Growth 24/7 Ecosystem**\n"
                f"Your All-in-One Super App is ready:\n\n"
                f"🪙 **Earn Coins & Rewards**\n"
                f"📝 **Resume Builder & Viral Tools**\n"
                f"🔮 **AI Predictions (Downloadable)**\n"
                f"🎮 **Play Games & Tournaments**\n\n"
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
    signal.signal(signal.SIGINT, lambda s, f: os._exit(0))
    signal.signal(signal.SIGTERM, lambda s, f: os._exit(0))
    
    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
    except Exception:
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    main()



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

# --- 💰 ADS CONFIG (Direct Link) ---
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Orbitron:wght@500&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --gold: #fbbf24; --green: #22c55e; --red: #ef4444; --blue: #3b82f6; --purple: #8b5cf6; --glass: rgba(255, 255, 255, 0.05); }
        body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; margin: 0; padding: 0; padding-bottom: 90px; text-align: center; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        /* --- NAVBAR & WALLET --- */
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: #0B1120; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .brand-text { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 16px; background: linear-gradient(90deg, #6C63FF, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .coin-badge { display: flex; align-items: center; gap: 6px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); padding: 5px 10px; border-radius: 20px; cursor: pointer; transition: 0.3s; }
        .coin-badge:active { transform: scale(0.95); }
        .coin-count { font-weight: 700; font-size: 14px; color: #FFD700; }
        
        /* --- PROGRESS & TABS --- */
        .progress-wrapper { background: #334155; height: 6px; border-radius: 10px; margin: 15px; position: relative; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--green); width: 0%; transition: 1s; }
        .progress-text { font-size: 10px; color: #94a3b8; margin: 0 15px 20px 15px; display: flex; justify-content: space-between; }
        .nav-tabs { display: flex; justify-content: center; gap: 8px; margin: 20px 0; background: #000; padding: 6px; border-radius: 50px; border: 1px solid #333; }
        .tab-btn { flex: 1; background: transparent; border: none; color: #64748b; padding: 10px 0; border-radius: 40px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: var(--card); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
        
        .section { display: none; animation: fadeIn 0.3s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* --- CARDS & GRIDS --- */
        .ad-banner { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; border-radius: 10px; background: #000; border: 1px dashed #333; min-height: 50px; }
        .tools-grid, .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; padding: 0 15px; }
        .tool-card, .game-card { background: var(--card); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .game-card { height: 120px; padding: 0; }
        .game-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.3s; }
        .game-badge { position: absolute; top: 5px; right: 5px; background: var(--green); color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; z-index: 2; }
        .link-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px 15px; border-radius: 12px; margin: 0 15px 8px 15px; cursor: pointer; border: 1px solid transparent; }
        .group-title { text-align: left; font-size: 10px; font-weight: 800; color: var(--gold); margin: 20px 15px 5px 15px; text-transform: uppercase; }

        /* --- PROFILE & WALLET --- */
        .profile-header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 20px; border-radius: 15px; margin: 15px; border: 1px solid var(--blue); }
        .profile-pic { width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--gold); object-fit: cover; margin-bottom: 10px; }
        .wallet-card { background: #000; padding: 15px; border-radius: 12px; margin-top: 15px; border: 1px dashed var(--gold); }
        .withdraw-btn { background: var(--green); width: 100%; padding: 12px; border: none; border-radius: 8px; color: white; font-weight: bold; margin-top: 10px; cursor: pointer; }
        .withdraw-btn:disabled { background: #555; cursor: not-allowed; }

        /* --- LEADERBOARD --- */
        .leaderboard-item { display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 5px; border-radius: 8px; align-items: center; }
        .rank-circle { width: 25px; height: 25px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
        .rank-1 { background: var(--gold); color: black; }
        .rank-2 { background: silver; color: black; }
        .rank-3 { background: #cd7f32; color: black; }

        /* --- MODALS --- */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        .modal-box { background: #1e293b; padding: 25px; border-radius: 20px; width: 85%; max-width: 350px; text-align: center; border: 1px solid #444; position: relative; max-height: 80vh; overflow-y: auto; }
        .close-btn { position: absolute; top: 10px; right: 15px; font-size: 20px; cursor: pointer; color: #aaa; }
        .input-glass { width: 90%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 10px; color: white; margin-bottom: 15px; text-align: center; outline: none; }
        .btn-main { background: linear-gradient(135deg, var(--blue), #7c3aed); border: none; padding: 12px; width: 100%; border-radius: 10px; color: white; font-weight: 800; cursor: pointer; margin-top: 10px; }
        
        /* --- GAME IFRAME --- */
        .game-frame { width: 100%; height: 100%; border: none; border-radius: 10px; }
        .fullscreen-modal { width: 100%; height: 100%; background: black; display: none; position: fixed; top: 0; left: 0; z-index: 3000; flex-direction: column; }
        .game-close { position: absolute; top: 20px; right: 20px; background: red; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; z-index: 3001; }

    </style>
</head>
<body>

    <nav class="navbar">
        <div class="nav-brand">
            <span class="brand-text">Growth Hub</span>
        </div>
        <div class="nav-actions">
            <div class="coin-badge" onclick="switchTab('profile')">
                <span>🪙</span>
                <span class="coin-count" id="userCoins">0</span>
            </div>
            <div onclick="openLegal()" style="color:white; font-size:20px;">⋮</div>
        </div>
    </nav>

    <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('home')">🏠 Hub</button>
        <button class="tab-btn" onclick="switchTab('games')">🎮 Games</button>
        <button class="tab-btn" onclick="switchTab('oracle')">🔮 Oracle</button>
        <button class="tab-btn" onclick="switchTab('profile')">👤 Profile</button>
    </div>

    <div id="home" class="section active">
        <div class="progress-wrapper"><div class="progress-fill" id="dailyProg"></div></div>
        <div class="progress-text">
            <span>Daily Task: <span id="taskPct">0%</span></span>
            <span id="rankDisplay" style="color:var(--gold);">Rank: Calculating...</span>
        </div>

        <div class="group-title">📺 WATCH & EARN (500 Coins)</div>
        <div class="tools-grid">
            <div class="tool-card" onclick="watchAdReward(500)">
                <div class="hot-tag">FAST</div>
                <div style="font-size:24px;">▶️</div>
                <div style="font-size:12px;">Watch Ad 1</div>
            </div>
            <div class="tool-card" onclick="watchAdReward(500)">
                <div style="font-size:24px;">▶️</div>
                <div style="font-size:12px;">Watch Ad 2</div>
            </div>
        </div>

        <div class="group-title">📢 JOIN CHANNELS (+1000 Coins)</div>
        <div id="channelList">
            </div>

        <div class="ad-banner">
            <script type="text/javascript">
                atOptions = { 'key' : '0ec2eb9dc0e01b5f1b456f0f1e577f22', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/0ec2eb9dc0e01b5f1b456f0f1e577f22/invoke.js"></script>
        </div>
    </div>

    <div id="games" class="section">
        <div style="padding:10px; background:rgba(34,197,94,0.1); border:1px solid var(--green); margin:15px; border-radius:10px; font-size:11px;">
            🎮 <b>Notice:</b> Ad will play before game starts (+100 Coins).
        </div>
        <div class="game-grid">
            <div class="game-card" onclick="playGame('Subway Surfers', 'https://poki.com/en/g/subway-surfers')">
                <div class="game-badge">HOT</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Subway_Surfers_App_Icon.png">
            </div>
            <div class="game-card" onclick="playGame('Temple Run 2', 'https://poki.com/en/g/temple-run-2')">
                <div class="game-badge">VIRAL</div>
                <img src="https://upload.wikimedia.org/wikipedia/en/6/69/Temple_Run_2_icon.jpg">
            </div>
            <div class="game-card" onclick="playGame('Moto X3M', 'https://poki.com/en/g/moto-x3m')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Moto_X3M_Logo.jpg">
            </div>
            <div class="game-card" onclick="playGame('2048', 'https://poki.com/en/g/2048')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2048_Logo.png/600px-2048_Logo.png">
            </div>
        </div>
    </div>

    <div id="oracle" class="section">
        <div class="group-title">VIRAL TOOLS</div>
        
        <button class="btn-main" style="margin:10px 15px; background: linear-gradient(135deg, #ec4899, #8b5cf6);" onclick="openTool('love')">❤️ Love Calculator</button>
        <button class="btn-main" style="margin:10px 15px; background: linear-gradient(135deg, #3b82f6, #06b6d4);" onclick="openTool('marriage')">💍 Marriage Prediction</button>
        <button class="btn-main" style="margin:10px 15px; background: linear-gradient(135deg, #f59e0b, #d97706);" onclick="openCVBuilder()">📄 Professional CV Builder (10k Coins)</button>

        <div id="oracleResult" style="display:none; padding:15px;">
            <div id="captureArea" style="background:#1e293b; border:2px solid var(--gold); padding:20px; border-radius:15px; text-align:center;">
                <img id="userUploadImg" src="" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid white; display:none;">
                <h2 id="resTitle" style="color:var(--gold);">RESULT</h2>
                <h1 id="resValue" style="font-size:30px;">...</h1>
                <p style="font-size:10px; color:#aaa;">Verified by @PersonalGrowth_Bot</p>
            </div>
            <button class="btn-main" onclick="downloadImage()">📥 Download HD Image</button>
        </div>
    </div>

    <div id="profile" class="section">
        <div class="profile-header">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="profile-pic" id="pPic">
            <h2 id="pName">User</h2>
            <p style="color:var(--gold); font-size:12px;" id="pRank">Rank #999</p>
            <input type="file" id="imgInput" accept="image/*" style="font-size:10px; margin-top:5px;" onchange="updateProfilePic()">
        </div>

        <div class="wallet-card">
            <h3 style="margin:0;">WALLET BALANCE</h3>
            <h1 style="color:var(--green); margin:5px 0;">🪙 <span id="walletCoins">0</span></h1>
            <p style="font-size:11px; color:#aaa;">Est. Value: <span id="realMoney">₹0.00</span></p>
            <hr style="border-color:#333;">
            <input type="text" id="upiId" class="input-glass" placeholder="Enter UPI ID" style="width:90%;">
            <button class="withdraw-btn" id="wBtn" onclick="requestWithdraw()">REQUEST WITHDRAWAL</button>
            <p style="font-size:9px; color:#aaa; margin-top:5px;">*Top 10 Rankers: Instant Withdraw (10k Coins = 1 Unit).<br>Others: Month End (100k Coins = 1 Unit).</p>
        </div>

        <div class="group-title">🏆 LIVE LEADERBOARD (24H Reset)</div>
        <div id="leaderboardList" style="padding:0 15px;"></div>
    </div>

    <div id="gameModal" class="fullscreen-modal">
        <div class="game-close" onclick="closeGame()">❌ CLOSE GAME</div>
        <iframe id="gameFrame" class="game-frame" src=""></iframe>
    </div>

    <div id="cvModal" class="modal-overlay">
        <div class="modal-box">
            <span class="close-btn" onclick="closeModal('cvModal')">&times;</span>
            <h3>📄 Build CV</h3>
            <p style="font-size:10px; color:#aaa;">Cost: 10,000 Coins</p>
            <input type="text" id="cvName" class="input-glass" placeholder="Full Name">
            <input type="text" id="cvEmail" class="input-glass" placeholder="Email">
            <input type="text" id="cvExp" class="input-glass" placeholder="Experience (Short)">
            <button class="btn-main" onclick="generatePDF()">✨ Pay & Download</button>
        </div>
    </div>

    <div id="legalModal" class="modal-overlay">
        <div class="modal-box" style="text-align:left;">
            <span class="close-btn" onclick="closeModal('legalModal')">&times;</span>
            <h3>📜 Terms & Policy</h3>
            <div style="height:200px; overflow-y:scroll; font-size:11px; color:#ccc;">
                1. Coins have no real world cash value until withdrawn.<br>
                2. Cheating/Scripts = Ban.<br>
                3. Withdrawal requests processed within 24-48 hours for Rankers.<br>
                4. Non-rankers paid on 30th of month.<br>
                5. Adsterra verification is strict.
            </div>
        </div>
    </div>

    <div id="toolModal" class="modal-overlay">
        <div class="modal-box">
            <span class="close-btn" onclick="closeModal('toolModal')">&times;</span>
            <h3 id="toolTitle">Tool</h3>
            <input type="file" id="userPhotoUpload" accept="image/*" class="input-glass" onchange="previewUpload()">
            <input type="text" id="p1Name" class="input-glass" placeholder="Your Name">
            <input type="text" id="p2Name" class="input-glass" placeholder="Partner Name (Optional)">
            <button class="btn-main" onclick="processOracle()">🔮 Generate Result</button>
        </div>
    </div>

    <script type="text/javascript" src="https://pl28245444.effectivegatecpm.com/50/d7/2c/50d72c91dd048c42dae784892264442e.js"></script>

    <script>
        const tg = Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#0B1120'); tg.setBackgroundColor('#0B1120');

        const adLink = "{{ ad_link }}";
        const user = tg.initDataUnsafe.user;
        
        // --- STATE & ECONOMY ---
        let coins = parseInt(localStorage.getItem('coins')) || 0;
        let myRank = parseInt(localStorage.getItem('myRank')) || Math.floor(Math.random() * 50) + 1; // Simulated Rank
        let referrals = parseInt(localStorage.getItem('referrals')) || 0;
        
        // Update UI on load
        document.getElementById('pName').innerText = user ? user.first_name : "User";
        document.getElementById('userNameDisplay').innerText = user ? "Hi, " + user.first_name : "Hi, Guest";
        updateUI();
        renderChannels();
        generateLeaderboard();

        // 1️⃣ UI UPDATES
        function updateUI() {
            // Coins
            document.getElementById('userCoins').innerText = coins.toLocaleString();
            document.getElementById('walletCoins').innerText = coins.toLocaleString();
            
            // Real Money Calculation
            let rate = (myRank <= 10) ? 10000 : 100000;
            let money = (coins / rate).toFixed(2);
            document.getElementById('realMoney').innerText = "₹" + money;
            
            // Rank
            document.getElementById('rankDisplay').innerText = "Rank: #" + myRank;
            document.getElementById('pRank').innerText = "Rank #" + myRank;

            // Withdraw Button Logic
            const wBtn = document.getElementById('wBtn');
            if (myRank <= 10) {
                wBtn.disabled = false;
                wBtn.innerText = "INSTANT WITHDRAW";
                wBtn.style.background = "var(--green)";
            } else {
                wBtn.disabled = true;
                wBtn.innerText = "UNLOCK AT MONTH END";
                wBtn.style.background = "#555";
            }
            
            localStorage.setItem('coins', coins);
        }

        function addCoins(amount) {
            coins += amount;
            updateUI();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            tg.showPopup({ title: 'Reward!', message: `Received ${amount} Coins` });
        }

        // 2️⃣ EARNING LOGIC
        function watchAdReward(amount) {
            tg.showConfirm("Watch Ad for " + amount + " coins?", (ok) => {
                if(ok) {
                    tg.openLink(adLink); // Open Ad
                    // Strictly wait for callback simulation
                    setTimeout(() => { addCoins(amount); }, 4000); 
                }
            });
        }

        const channels = [
            {name: "English Room", link: "https://t.me/The_EnglishRoom5"},
            {name: "Speaking Shots", link: "https://t.me/English_Speaking_Grammar_Shots"},
            {name: "UPSC Notes", link: "https://t.me/UPSC_Notes_Official"},
            {name: "Quiz Vault", link: "https://t.me/UPSC_Quiz_Vault"},
            {name: "IAS Prep", link: "https://t.me/IAS_PrepQuiz_Zone"},
            {name: "Tourism India", link: "https://t.me/MinistryOfTourism"},
            {name: "Finance Tips", link: "https://t.me/PersonalFinanceWithShiv"},
            {name: "Govt Schemes", link: "https://t.me/GovernmentSchemesIndia"}
        ];

        function renderChannels() {
            const list = document.getElementById('channelList');
            list.innerHTML = "";
            channels.forEach((ch, index) => {
                // Check if already joined (simulated via localStorage)
                let joined = localStorage.getItem('joined_' + index);
                if (!joined) {
                    let div = document.createElement('div');
                    div.className = "link-row";
                    div.innerHTML = `<span>${ch.name}</span> <span style="color:var(--gold);">+1000</span>`;
                    div.onclick = () => verifyChannelJoin(index, ch.link);
                    list.appendChild(div);
                }
            });
        }

        function verifyChannelJoin(index, link) {
            tg.openTelegramLink(link);
            // Simulate verification delay
            setTimeout(() => {
                if(confirm("Did you join the channel?")) {
                    addCoins(1000);
                    localStorage.setItem('joined_' + index, true);
                    renderChannels(); // Refresh list
                }
            }, 3000);
        }

        // 3️⃣ GAMES (Playable Iframe)
        function playGame(name, url) {
            tg.showPopup({ title: 'Game Ad', message: 'Watch ad to start game (+100 Coins)', buttons: [{type:'ok', text:'Watch & Play'}] }, (id) => {
                if(id) {
                    tg.openLink(adLink); // Force Ad
                    setTimeout(() => {
                        addCoins(100);
                        document.getElementById('gameFrame').src = url;
                        document.getElementById('gameModal').style.display = 'flex';
                    }, 1500);
                }
            });
        }
        function closeGame() {
            document.getElementById('gameModal').style.display = 'none';
            document.getElementById('gameFrame').src = "";
        }

        // 4️⃣ ORACLE & CV
        let currentTool = "";
        function openTool(type) {
            currentTool = type;
            document.getElementById('toolTitle').innerText = type.toUpperCase();
            document.getElementById('toolModal').style.display = 'flex';
        }

        function previewUpload() {
            const file = document.getElementById('userPhotoUpload').files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('userUploadImg').src = e.target.result;
                    document.getElementById('userUploadImg').style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        }

        function processOracle() {
            const name = document.getElementById('p1Name').value;
            if(!name) return alert("Enter Name");
            
            document.getElementById('toolModal').style.display = 'none';
            document.getElementById('oracleResult').style.display = 'block';
            
            let res = "";
            if(currentTool === 'love') res = (Math.floor(Math.random()*20)+80) + "% Match";
            else res = "Year " + (2025 + Math.floor(Math.random()*5));
            
            document.getElementById('resTitle').innerText = currentTool.toUpperCase() + " PREDICTION";
            document.getElementById('resValue').innerText = res;
        }

        function downloadImage() {
            html2canvas(document.getElementById('captureArea'), { backgroundColor: "#1e293b" }).then(canvas => {
                let link = document.createElement('a');
                link.download = 'prediction.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        }

        // CV Builder
        function openCVBuilder() { document.getElementById('cvModal').style.display = 'flex'; }
        function generatePDF() {
            if(coins < 10000) return alert("Insufficient Coins! Need 10,000.");
            const name = document.getElementById('cvName').value;
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.text("CURRICULUM VITAE", 105, 20, null, null, "center");
            doc.setFontSize(16);
            doc.text("Name: " + name, 20, 40);
            doc.text("Email: " + document.getElementById('cvEmail').value, 20, 50);
            doc.text("Experience: " + document.getElementById('cvExp').value, 20, 60);
            doc.setFontSize(10);
            doc.text("Generated by @PersonalGrowth_Bot", 20, 280);
            
            doc.save("Resume.pdf");
            
            coins -= 10000;
            updateUI();
            closeModal('cvModal');
        }

        // 5️⃣ LEADERBOARD & UTILS
        function generateLeaderboard() {
            const list = document.getElementById('leaderboardList');
            let html = '';
            // Generate Fake Top 10
            for(let i=1; i<=10; i++) {
                let score = 500000 - (i*20000) + Math.floor(Math.random()*5000);
                html += `<div class="leaderboard-item">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <div class="rank-circle rank-${i <= 3 ? i : 'x'}">${i}</div>
                        <span>Player_${Math.floor(Math.random()*999)}</span>
                    </div>
                    <span style="color:var(--gold);">${score.toLocaleString()}</span>
                </div>`;
            }
            // Add Self
            html += `<div class="leaderboard-item" style="border:1px solid var(--blue);">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <div class="rank-circle" style="background:var(--blue);">${myRank}</div>
                        <span>YOU</span>
                    </div>
                    <span style="color:var(--gold);">${coins.toLocaleString()}</span>
                </div>`;
            list.innerHTML = html;
        }

        function switchTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            // Update active tab button style manually if needed
        }
        function openLegal() { document.getElementById('legalModal').style.display = 'flex'; }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }
        function updateProfilePic() {
            const file = document.getElementById('imgInput').files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (e) => document.getElementById('pPic').src = e.target.result;
                reader.readAsDataURL(file);
            }
        }
        
        // Referral Quiz Logic (Simulated)
        if(window.location.href.includes('start_param')) {
            setTimeout(() => {
                if(confirm("Welcome! Take a Quick Quiz to verify referral?")) {
                    tg.showPopup({title:'Quiz', message:'What is the capital of India?', buttons:[{type:'ok', text:'Delhi'}]});
                }
            }, 1000);
        }

    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, ad_link=AD_LINK)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    # Check Referral
    if context.args and context.args[0].startswith("ref_"):
        # In a real DB, you would add +1 to referrer here
        pass

    keyboard = [
        [InlineKeyboardButton("🚀 OPEN SUPER APP", web_app=WebAppInfo(url=web_app_url))],
        [InlineKeyboardButton("💰 Daily Reward", callback_data="daily")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n"
                f"💎 **Personal Growth Ecosystem v3.0**\n"
                f"Your All-in-One Super App is ready:\n\n"
                f"🪙 **Wallet & Withdrawals Live**\n"
                f"🎮 **Play Games (No Install)**\n"
                f"📝 **CV Builder & Tools**\n"
                f"🏆 **Live Leaderboard**\n\n"
                f"👇 **Tap below to Start Earning:**",
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

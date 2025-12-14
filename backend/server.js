const express = require('express');
const cors = require('cors');
const path = require('path');
const { Telegraf, Markup } = require('telegraf');
const admin = require("firebase-admin");
require('dotenv').config();

// Firebase Connection (Safety Check ke saath)
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (e) {
    console.error("Firebase Error:", e.message); // Agar key galat hui to bata dega
}

const db = admin.firestore ? admin.firestore() : null;
const app = express();

app.use(cors());
app.use(express.json());

// --- SABSE ZAROORI LINE (Isse Buttons Chalenge) ---
// Ye line server ko batati hai ki frontend folder me se script.js aur style.css uthao
app.use(express.static(path.join(__dirname, '../frontend')));

// Bot Setup
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = "https://pro-earner-app.onrender.com"; 

bot.start((ctx) => {
    ctx.reply("Welcome! Open App:", 
        Markup.inlineKeyboard([[Markup.button.webApp("💰 Open App", WEBAPP_URL)]])
    );
});
bot.launch().catch(err => console.log("Bot Error:", err));

// --- API Routes ---
app.post('/api/reward', async (req, res) => {
    // Fake logic for demo
    res.json({ success: true, newBalance: 100 });
});

// --- CATCH ALL ROUTE (Jo file na mile, use index.html dedo) ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const path = require('path');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api'); // Bot Library import ki

// --- CONFIGURATION ---
const app = express();
const PORT = process.env.PORT || 3000;

// Render par Environment Variable se Token uthayega
// Agar local chala rahe ho to 'YOUR_TOKEN' ki jagah apna token likh dena (Not recommended for GitHub)
const token = process.env.BOT_TOKEN; 

// --- EXPRESS APP SETUP (Website ke liye) ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// --- TELEGRAM BOT SETUP ---
// Polling true rakha hai taaki bot messages check karta rahe
const bot = new TelegramBot(token, { polling: true });

// 1. /start Command Handler
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "User";

    // Welcome Message Text
    const welcomeMessage = `
🚀 **Welcome back, ${userName}!**

You are now connected to **FinGamePro** - The Ultimate Earning Ecosystem. 💰

🎮 **Play Games**
📺 **Watch Ads**
🤝 **Refer & Earn**
💼 **Withdraw Daily**

👇 **Click the button below to launch your dashboard!**
    `;

    // Welcome Button (Web App Link)
    // IMPORTANT: 'url' me apna Render wala Live Link dalein
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "💰 Open App & Earn", 
                        web_app: { url: "https://personalgrowth24-bot.onrender.com/" } 
                    }
                ],
                [
                    { text: "📢 Join Community", url: "https://t.me/The_EnglishRoom5" }
                ]
            ]
        },
        parse_mode: 'Markdown'
    };

    bot.sendMessage(chatId, welcomeMessage, opts);
});

// --- SERVER ROUTES ---
app.get('/api/status', (req, res) => {
    res.json({ status: 'active', bot: 'online' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Telegram Bot is active...');
});


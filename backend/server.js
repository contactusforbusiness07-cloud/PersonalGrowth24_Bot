const express = require('express');
const cors = require('cors');
const path = require('path'); // Ye line nayi hai (Path tool)
const { Telegraf, Markup } = require('telegraf');
const db = require('./firebaseConfig');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. TELEGRAM BOT SETUP ---
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = "https://pro-earner-app.onrender.com"; // Apna Render URL yaha daal dena agar alag ho to

bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const referrerId = ctx.startPayload; 
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        telegramId: userId,
        firstName: ctx.from.first_name,
        username: ctx.from.username || "Unknown",
        walletBalance: 0,
        referralCount: 0,
        referredBy: referrerId || null,
        joinedAt: new Date().toISOString()
      });
      ctx.reply(`Welcome ${ctx.from.first_name}! 🚀\nStart earning now!`, 
        Markup.inlineKeyboard([[Markup.button.webApp("💰 Open App", WEBAPP_URL)]])
      );
    } else {
      ctx.reply("Welcome back! 🚀", 
        Markup.inlineKeyboard([[Markup.button.webApp("💰 Open App", WEBAPP_URL)]])
      );
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

bot.launch();

// --- 2. API ENDPOINTS ---
app.get('/api/user/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (doc.exists) res.json(doc.data());
    else res.status(404).json({ error: "User not found" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 3. SERVE FRONTEND (Ye Naya Part Hai) ---
// Server ko batao ki frontend files kahan hain
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Koi bhi aur link khule to React App dikhao
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


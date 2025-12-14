const express = require('express');
const cors = require('cors');
const { Telegraf, Markup } = require('telegraf');
const db = require('./firebaseConfig');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. TELEGRAM BOT SETUP ---
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = "https://pro-earner-app.onrender.com"; // Baad me change karenge

// Start Command with Referral Logic
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const referrerId = ctx.startPayload; // Link se aaya hua ID
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    // New User Create Karo
    await userRef.set({
      telegramId: userId,
      firstName: ctx.from.first_name,
      username: ctx.from.username || "Unknown",
      walletBalance: 0,
      lockedBalance: 0, // Rank 10+ walo ka paisa
      referralCount: 0,
      referredBy: referrerId || null,
      isVerified: false,
      dailyCoins: 0,
      joinedAt: new Date().toISOString()
    });

    // Agar kisi ke link se aaya hai, toh Referrer ko notify karo
    if (referrerId && referrerId !== userId) {
      bot.telegram.sendMessage(referrerId, `🎉 New User Joined via your link: ${ctx.from.first_name}`);
    }

    ctx.reply(`Welcome ${ctx.from.first_name}! 🚀\nComplete the quiz to unlock earnings.`, 
      Markup.inlineKeyboard([
        [Markup.button.webApp("💰 Open App", WEBAPP_URL)]
      ])
    );
  } else {
    ctx.reply("Welcome back! Keep earning.", 
      Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Open App", WEBAPP_URL)]
      ])
    );
  }
});

bot.launch();

// --- 2. API FOR FRONTEND ---

// User Data Lanao
app.get('/api/user/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (doc.exists) res.json(doc.data());
    else res.status(404).json({ error: "User not found" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Reward Dena (Task/Game/Referral)
app.post('/api/reward', async (req, res) => {
  const { userId, amount, type } = req.body;
  const userRef = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if (!doc.exists) throw "User not found";
      
      const newBalance = (doc.data().walletBalance || 0) + amount;
      const newDaily = (doc.data().dailyCoins || 0) + amount;
      
      t.update(userRef, { 
        walletBalance: newBalance,
        dailyCoins: newDaily
      });
    });
    res.json({ success: true, balance: amount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Leaderboard Logic (Top 50)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .orderBy('dailyCoins', 'desc')
      .limit(50)
      .get();
    
    const list = snapshot.docs.map(doc => ({
      name: doc.data().firstName,
      coins: doc.data().dailyCoins,
      pic: "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Default pic
    }));
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


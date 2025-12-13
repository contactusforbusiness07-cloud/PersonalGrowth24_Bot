import os
import threading
import signal
from flask import Flask, render_template
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ"
BOT_USERNAME = "PersonalGrowth24_Bot"

# --- ADS CONFIG ---
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

PORT = int(os.environ.get("PORT", 10000))

# ✅ FLASK FOLDER SETUP (Ye zaroori hai)
app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def home():
    return render_template('index.html', ad_link=AD_LINK)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 Claim Bonus", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN SUPER APP", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n💎 **Personal Growth Ecosystem v5.0**\n\n👇 **Tap below to Start:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    
    # Flask ko alag thread me chalana
    threading.Thread(target=run_flask).start()
    
    print("Bot Started...")
    
    # Render Restart Fix
    signal.signal(signal.SIGINT, lambda s, f: os._exit(0))
    signal.signal(signal.SIGTERM, lambda s, f: os._exit(0))
    
    try:
        # ✅ CONFLICT FIX: drop_pending_updates=True purane atke hue updates hata dega
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
    except Exception as e:
        print(f"Error: {e}")
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    main()


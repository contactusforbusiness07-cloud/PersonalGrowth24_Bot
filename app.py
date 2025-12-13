import os
import threading
import signal
from flask import Flask, render_template
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# --- 🟢 CREDENTIALS ---
TOKEN = "8400777806:AAH6EQ_2rBL4YiDBlSZTsMjPOktfINKhiKQ" # Replace if changed
BOT_USERNAME = "PersonalGrowth24_Bot"

# --- 💰 ADS CONFIG ---
# Pass this to HTML so we can change it easily
AD_LINK = "https://www.effectivegatecpm.com/apn41vrpck?key=c74cfda0abf96c5cef3c0fcf95607af6"

PORT = int(os.environ.get("PORT", 10000))

# Flask Setup (Explicitly pointing to folders)
app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def home():
    # This renders templates/index.html
    return render_template('index.html', ad_link=AD_LINK)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    base_url = os.environ.get('RENDER_EXTERNAL_HOSTNAME') 
    # Fallback if Render URL isn't set yet
    web_app_url = f"https://{base_url}/" if base_url else "https://google.com"

    keyboard = [
        [InlineKeyboardButton("🎁 Claim Daily Reward", url=AD_LINK)],
        [InlineKeyboardButton("🚀 OPEN SUPER APP", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    img_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"

    await update.message.reply_photo(
        photo=img_url, 
        caption=f"👋 **Hi {user.first_name}!**\n\n💎 **Personal Growth Ecosystem v5.0**\n\n👇 **Tap below to Start Earning:**",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

def run_flask():
    app.run(host="0.0.0.0", port=PORT)

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    
    # Run Flask in separate thread
    threading.Thread(target=run_flask).start()
    
    print("Bot Started...")
    
    # Handle Render Shutdown Signals
    signal.signal(signal.SIGINT, lambda s, f: os._exit(0))
    signal.signal(signal.SIGTERM, lambda s, f: os._exit(0))
    
    # FIX CONFLICT ERROR: drop_pending_updates=True
    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
    except Exception:
        os.kill(os.getpid(), signal.SIGTERM)

if __name__ == "__main__":
    main()


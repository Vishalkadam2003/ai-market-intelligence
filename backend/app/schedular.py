# app/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.live_price import update_all_prices


scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(update_all_prices, "interval", minutes=1, id="price_updater")
    scheduler.start()

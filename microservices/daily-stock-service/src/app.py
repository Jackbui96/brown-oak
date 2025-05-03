import time
from daily_fetcher import run_daily_fetch
from stock_prediction import process_symbol
from config import SOI

if __name__ == "__main__":
    print("📦 Starting daily stock fetcher...")
    result = run_daily_fetch()

    print("📊 Summary:")
    for symbol, inserted in result.items():
        status = "✅ inserted" if inserted else "⚠️ skipped"
        print(f"{symbol}: {inserted} ({status})")

    for symbol in SOI:
        process_symbol(symbol)
        time.sleep(1)  # Small delay between stocks

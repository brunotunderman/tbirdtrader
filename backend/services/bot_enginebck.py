# backend/services/bot_engine.py

import asyncio
from datetime import datetime

from backend.services.bot_state import bot_state
from backend.services.strategy import strategy
from backend.services.price_feed import get_current_price
from backend.services.model_client import predict_price
from backend.services.paper_engine import execute_market_buy, execute_market_sell
from backend.services.paper_state import paper_state

SYMBOL = "BTC-EUR"


async def bot_loop():
    bot_state.add_log("Bot loop started")

    while bot_state.running:
        bot_state.reset_if_needed()

        # 1) Get real market price from Coinbase
        try:
            current_price = get_current_price(SYMBOL)
        except Exception as e:
            bot_state.add_log(f"Error fetching price: {e}")
            await asyncio.sleep(5)
            continue

        # 2) Get REAL prediction from your model
        try:
            predicted_price = predict_price(SYMBOL)
        except Exception as e:
            bot_state.add_log(f"Prediction error: {e}")
            await asyncio.sleep(5)
            continue

        bot_state.add_log(
            f"{SYMBOL} current: {current_price:.2f}, predicted: {predicted_price:.2f}"
        )

        # 3) Strategy decision
        action = strategy(current_price, predicted_price)
        bot_state.add_log(f"Strategy decision: {action}")

        now = datetime.utcnow()

        # 4) Enforce min interval
        if bot_state.last_trade_time:
            if now - bot_state.last_trade_time < bot_state.min_trade_interval:
                bot_state.add_log("Skipped: min trade interval not reached")
                await asyncio.sleep(5)
                continue

        # 5) Enforce daily limit
        if bot_state.trades_today >= bot_state.max_trades_per_day:
            bot_state.add_log("Skipped: daily trade limit reached")
            await asyncio.sleep(5)
            continue

        # 6) Enforce weekly limit
        if bot_state.trades_this_week >= bot_state.max_trades_per_week:
            bot_state.add_log("Skipped: weekly trade limit reached")
            await asyncio.sleep(5)
            continue

        # 7) Execute trade in paper engine
        if action == "buy":
            try:
                execute_market_buy(SYMBOL, 50, current_price)
                bot_state.trades_today += 1
                bot_state.trades_this_week += 1
                bot_state.last_trade_time = now
                bot_state.add_log(f"Executed BUY: 50 EUR {SYMBOL}")
            except Exception as e:
                bot_state.add_log(f"BUY error: {e}")

        elif action == "sell":
            try:
                execute_market_sell(SYMBOL, 0.001, current_price)
                bot_state.trades_today += 1
                bot_state.trades_this_week += 1
                bot_state.last_trade_time = now
                bot_state.add_log(f"Executed SELL: 0.001 BTC {SYMBOL}")
            except Exception as e:
                bot_state.add_log(f"SELL error: {e}")

        # 8) Wait before next cycle
        await asyncio.sleep(5)

    bot_state.add_log("Bot loop stopped")

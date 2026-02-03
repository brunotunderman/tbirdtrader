from datetime import datetime, timedelta

class BotState:
    def __init__(self):
        self.running = False

        # Trade limits
        self.max_trades_per_day = 10
        self.max_trades_per_week = 30
        self.min_trade_interval = timedelta(seconds=30)

        # Counters
        self.trades_today = 0
        self.trades_this_week = 0
        self.last_trade_time = None

        # Reset tracking
        self.last_reset_day = datetime.utcnow().date()
        self.last_reset_week = datetime.utcnow().isocalendar()[1]

        # Log
        self.log = []
        self.max_log_entries = 200

    def reset_if_needed(self):
        today = datetime.utcnow().date()
        week = datetime.utcnow().isocalendar()[1]

        if today != self.last_reset_day:
            self.trades_today = 0
            self.last_reset_day = today
            self.add_log("Daily counters reset")

        if week != self.last_reset_week:
            self.trades_this_week = 0
            self.last_reset_week = week
            self.add_log("Weekly counters reset")

    def add_log(self, message: str):
        timestamp = datetime.utcnow().isoformat()
        entry = f"{timestamp} - {message}"
        self.log.append(entry)
        if len(self.log) > self.max_log_entries:
            self.log.pop(0)

bot_state = BotState()


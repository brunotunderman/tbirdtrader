"""
Risk Engine
-----------
Validates trades before execution.
"""

class RiskEngine:
    def __init__(
        self,
        max_trade_pct: float,
        min_wallet: float,
        min_order_value: float,
        kill_switch: bool,
        max_drawdown_pct: float
    ):
        self.max_trade_pct = max_trade_pct
        self.min_wallet = min_wallet
        self.min_order_value = min_order_value
        self.kill_switch = kill_switch
        self.max_drawdown_pct = max_drawdown_pct

    def validate(self, wallet_balance: float, portfolio_drawdown: float, trade_value: float) -> list:
        """
        Returns a list of constraint violations.
        """
        violations = []

        if self.kill_switch:
            violations.append("Kill switch active")

        if portfolio_drawdown > self.max_drawdown_pct:
            violations.append("Max drawdown exceeded")

        if wallet_balance < self.min_wallet:
            violations.append("Wallet below minimum threshold")

        if trade_value < self.min_order_value:
            violations.append("Trade value below minimum order size")

        if trade_value > wallet_balance * (self.max_trade_pct / 100):
            violations.append("Trade exceeds max trade size %")

        return violations

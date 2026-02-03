def strategy(current_price: float, predicted_price: float) -> str:
    """
    Simple example strategy:
    - Buy if prediction is 1% above current price
    - Sell if prediction is 1% below current price
    - Otherwise hold
    """
    if predicted_price > current_price * 1.01:
        return "buy"

    if predicted_price < current_price * 0.99:
        return "sell"

    return "hold"

import requests

COINBASE_API_BASE = "https://api.exchange.coinbase.com"


def get_current_price(symbol: str) -> float:
    """
    Get the current market price for a product from Coinbase.

    symbol: e.g. "BTC-EUR"
    Coinbase uses this format directly as product_id.
    """
    product_id = symbol  # "BTC-EUR"

    url = f"{COINBASE_API_BASE}/products/{product_id}/ticker"
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
    data = resp.json()

    # "price" is the last traded price
    return float(data["price"])


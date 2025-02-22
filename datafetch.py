import requests

def get_crypto_price(crypto="bitcoin"):
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto}&vs_currencies=usd"
    response = requests.get(url).json()
    return response[crypto]['usd']

if _name_ == "_main_":
    print("Bitcoin Price:", get_crypto_price("bitcoin"))

from flask import Flask, jsonify from flask_socketio import SocketIO import requests import numpy as np import tensorflow as tf from tensorflow.keras.models import load_model import json import time

app = Flask(name) socketio = SocketIO(app, cors_allowed_origins="*")

Load trained LSTM model (replace with your actual model path)

model = load_model("stock_prediction_model.h5")

Replace with your stock API key (e.g., Alpha Vantage or IEX Cloud)

API_KEY = "YOUR_STOCK_API_KEY" BASE_URL = "https://www.alphavantage.co/query"

def get_stock_data(symbol): """Fetch real-time stock data""" params = { "function": "TIME_SERIES_INTRADAY", "symbol": symbol, "interval": "5min", "apikey": API_KEY } response = requests.get(BASE_URL, params=params) data = response.json() return data

def preprocess_data(data): """Prepare data for LSTM model input""" prices = [float(value['1. open']) for key, value in data['Time Series (5min)'].items()] prices = np.array(prices[::-1]).reshape(-1, 1) / max(prices)  # Normalize return prices.reshape(1, prices.shape[0], 1)

def predict_stock(data): """Make stock price predictions using the LSTM model""" processed_data = preprocess_data(data) prediction = model.predict(processed_data) return float(prediction[0][0]) * max(data['Time Series (5min)'].values())

@app.route("/predict/<symbol>", methods=["GET"]) def predict(symbol): """API endpoint to get stock prediction""" stock_data = get_stock_data(symbol) prediction = predict_stock(stock_data) return jsonify({"symbol": symbol, "prediction": prediction})

@socketio.on("connect") def handle_connect(): print("Client connected")

@socketio.on("request_data") def handle_request_data(symbol): """Send real-time stock updates via WebSocket""" while True: stock_data = get_stock_data(symbol) prediction = predict_stock(stock_data) socketio.emit("stock_update", {"symbol": symbol, "prediction": prediction}) time.sleep(60)  # Update every minute

if name == "main": socketio.run(app, debug=True)

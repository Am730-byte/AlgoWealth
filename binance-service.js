// binance-service.js
const { Observable } = require("rxjs");
const WebSocket = require("ws");

/**
 * Creates an RxJS observable that emits real-time ticker data
 * from Binance for the given symbol (e.g., "btcusdt").
 */
function createBinanceTickerStream(symbol) {
  return new Observable((subscriber) => {
    // For ticker data, connect to `<symbol>@ticker` stream
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        // Attach the symbol so we know which crypto this is
        data.symbol = symbol.toUpperCase();
        subscriber.next(data);
      } catch (error) {
        subscriber.error(error);
      }
    });

    ws.on("error", (error) => subscriber.error(error));

    // Cleanup when subscription is closed
    return () => {
      ws.close();
    };
  });
}

module.exports = {
  createBinanceTickerStream,
};

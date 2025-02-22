// index.js
const http = require("http");
const express = require("express");
const { Server: WebSocketServer } = require("ws");
const { merge } = require("rxjs");
const { map, tap } = require("rxjs/operators");

const { createBinanceTickerStream } = require("./binance-service");
const { calculateRiskScore } = require("./ai-risk-model");
const { recommendBestCrypto } = require("./recommendation");

const app = express();
const server = http.createServer(app);

// Serve static files from "public" folder
app.use(express.static("public"));

const wss = new WebSocketServer({ server });

// Define the symbols we want to track
const symbols = ["btcusdt", "ethusdt", "maticusdt"];

// Create an array of observables for each symbol
const tickerStreams = symbols.map((symbol) => {
  return createBinanceTickerStream(symbol).pipe(
    map((data) => calculateRiskScore(data)) // { symbol, price, riskScore }
  );
});

// Merge all ticker streams into one
const mergedStream$ = merge(...tickerStreams).pipe(
  tap((result) => {
    console.log(`Symbol: ${result.symbol}, Price: ${result.price}, Risk: ${result.riskScore}`);
  })
);

let latestData = [];
// We'll store the latest data for each symbol so we can compute recommendations

// Subscribe once to the merged stream
mergedStream$.subscribe({
  next: (result) => {
    // Update the latest data for this symbol
    const existingIndex = latestData.findIndex((d) => d.symbol === result.symbol);
    if (existingIndex >= 0) {
      latestData[existingIndex] = result;
    } else {
      latestData.push(result);
    }

    // Compute the recommendation
    const recommendation = recommendBestCrypto(latestData);

    // Broadcast to all connected clients
    const payload = {
      type: "tickerUpdate",
      symbol: result.symbol,
      price: result.price,
      riskScore: result.riskScore,
      recommendation, // e.g. { symbol, price, riskScore }
    };

    // Debug log to confirm we're sending
    console.log("Broadcasting payload:", payload);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(JSON.stringify(payload));
      }
    });
  },
  error: (err) => {
    console.error("Error in merged stream:", err);
  },
});

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected.");

  // If we already have data, send an immediate snapshot + recommendation
  if (latestData.length > 0) {
    const recommendation = recommendBestCrypto(latestData);
    ws.send(JSON.stringify({
      type: "initialData",
      cryptos: latestData,
      recommendation,
    }));
  }

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

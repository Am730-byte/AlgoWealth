// ai-risk-model.js

function calculateRiskScore(tickerData) {
  // 'c' is the last price in the Binance ticker
  const price = parseFloat(tickerData.c);

  // A trivial “model” that says: if price > 30000 => 0.8, else 0.2
  const riskScore = price > 30000 ? 0.8 : 0.2;

  return {
    symbol: tickerData.symbol,
    price,
    riskScore,
  };
}

module.exports = {
  calculateRiskScore,
};

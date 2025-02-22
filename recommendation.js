// recommendation.js

/**
 * Given an array of { symbol, price, riskScore },
 * returns the recommended crypto based on highest riskScore,
 * then highest price if there's a tie.
 */
function recommendBestCrypto(cryptoDataList) {
  if (cryptoDataList.length === 0) {
    return null;
  }

  // Sort by riskScore desc, then price desc
  const sorted = [...cryptoDataList].sort((a, b) => {
    if (b.riskScore !== a.riskScore) {
      return b.riskScore - a.riskScore;
    }
    return b.price - a.price;
  });

  return sorted[0];
}

module.exports = {
  recommendBestCrypto,
};

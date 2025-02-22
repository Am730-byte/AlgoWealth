// script.js
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}`;
const socket = new WebSocket(wsUrl);

const statusEl = document.getElementById("status");
const tickerBody = document.getElementById("ticker-body");
const recommendationDetails = document.getElementById("recommendation-details");

socket.addEventListener("open", () => {
  statusEl.textContent = "Connected to AI Crypto Stream.";
  statusEl.style.color = "#28a745";
});

socket.addEventListener("close", () => {
  statusEl.textContent = "WebSocket disconnected.";
  statusEl.style.color = "#dc3545";
});

socket.addEventListener("error", (err) => {
  console.error("WebSocket error:", err);
  statusEl.textContent = "WebSocket error!";
  statusEl.style.color = "#dc3545";
});

socket.addEventListener("message", (event) => {
  // Log for debugging
  console.log("Client received raw:", event.data);

  const data = JSON.parse(event.data);
  console.log("Client parsed:", data);

  if (data.type === "initialData") {
    // We got the initial data array + recommendation
    updateTable(data.cryptos);
    updateRecommendation(data.recommendation);
  } else if (data.type === "tickerUpdate") {
    // We got a single symbol update
    updateRow(data.symbol, data.price, data.riskScore);
    updateRecommendation(data.recommendation);
  }
});

/**
 * Update the entire table from an array of cryptos
 */
function updateTable(cryptos) {
  tickerBody.innerHTML = ""; // Clear existing
  cryptos.forEach((c) => {
    addOrUpdateRow(c.symbol, c.price, c.riskScore);
  });
}

/**
 * Update or add a single row in the table
 */
function updateRow(symbol, price, riskScore) {
  // If row exists, update it; otherwise create it
  const existingRow = document.querySelector(`tr[data-symbol="${symbol}"]`);
  if (existingRow) {
    existingRow.cells[1].textContent = price.toFixed(2);
    existingRow.cells[2].textContent = riskScore;
    styleRow(existingRow, riskScore);
  } else {
    addOrUpdateRow(symbol, price, riskScore);
  }
}

function addOrUpdateRow(symbol, price, riskScore) {
  const row = document.createElement("tr");
  row.setAttribute("data-symbol", symbol);

  const symbolTd = document.createElement("td");
  symbolTd.textContent = symbol.toUpperCase();
  row.appendChild(symbolTd);

  const priceTd = document.createElement("td");
  priceTd.textContent = price.toFixed(2);
  row.appendChild(priceTd);

  const riskTd = document.createElement("td");
  riskTd.textContent = riskScore;
  row.appendChild(riskTd);

  styleRow(row, riskScore);
  tickerBody.appendChild(row);
}

/**
 * Highlight row if riskScore >= 0.5
 */
function styleRow(row, riskScore) {
  if (riskScore >= 0.5) {
    row.classList.add("high-risk");
  } else {
    row.classList.remove("high-risk");
  }
}

/**
 * Update the recommendation section
 */
function updateRecommendation(reco) {
  if (!reco) {
    recommendationDetails.textContent = "No recommendation yet.";
    return;
  }
  recommendationDetails.textContent = `Symbol: ${reco.symbol.toUpperCase()}, Price: ${reco.price.toFixed(
    2
  )}, Risk Score: ${reco.riskScore}`;
}

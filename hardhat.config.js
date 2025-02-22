require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load .env file

// Debugging: Check if values are loaded
console.log("POLYGON_MUMBAI_RPC_URL:", process.env.POLYGON_MUMBAI_RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "Loaded" : "Missing!");

module.exports = {
  solidity: "0.8.28",
  networks: {
    polygonMumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL || "", // Ensure it does not remain undefined
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] // Ensure private key is set
    }
  }
};

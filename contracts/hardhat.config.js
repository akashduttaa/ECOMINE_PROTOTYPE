require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // Polygon Amoy testnet is the standard Polygon testnet, but we'll default to Hardhat local for now
    hardhat: {
      chainId: 1337
    }
  }
};

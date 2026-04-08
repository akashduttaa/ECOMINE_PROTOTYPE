const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EcoRewardModule", (m) => {
  // Use the deployer's address (first account in the network) as the initial owner
  const deployer = m.getAccount(0);

  const ecoReward = m.contract("EcoReward", [deployer]);

  return { ecoReward };
});

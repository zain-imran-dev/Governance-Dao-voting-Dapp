const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VerifyContracts", (m) => {
  // This module is for verification purposes
  // The actual verification will be handled by the hardhat-verify plugin
  // This module can be used to ensure contracts are properly deployed before verification
  
  // Get the deployer account
  const deployer = m.getAccount(0);
  
  // Deployment parameters (same as DeployDAO)
  const TOKEN_NAME = "MyDAO Token";
  const TOKEN_SYMBOL = "MDAO";
  const INITIAL_OWNER = deployer;
  
  // Deploy the DAO Factory
  const factory = m.contract("DAOFactory", []);
  
  // Deploy complete DAO system using the factory
  const daoDeployment = m.call(factory, "deployDAO", [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_OWNER
  ]);
  
  // For verification purposes, we'll just ensure the deployment was successful
  // In a real scenario, you would get the addresses from the deployment event
  // or use a different approach to access the deployed contracts
  
  return {
    factory,
    daoDeployment
  };
}); 
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("InteractWithDAO", (m) => {
  // Get the deployer account
  const deployer = m.getAccount(0);
  
  // Deployment parameters
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
  
  // For interaction demo, we'll just show the deployment was successful
  // In a real scenario, you would get the addresses from the deployment event
  // or use a different approach to access the deployed contracts
  
  return {
    factory,
    daoDeployment
  };
}); 
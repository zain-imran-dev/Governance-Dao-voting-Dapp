const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployDAO", (m) => {
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
  
  return {
    factory,
    daoDeployment
  };
}); 
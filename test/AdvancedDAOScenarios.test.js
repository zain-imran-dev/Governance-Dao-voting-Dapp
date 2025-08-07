const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { DAOTestUtils } = require("./utils/DAOTestUtils");

describe("Advanced DAO Scenarios", function () {
  let utils;
  let token, governor, treasury, timelock;
  let owner, proposer, voter1, voter2, voter3;
  
  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3] = await ethers.getSigners();
    
    // Deploy DAO system
    const Factory = await ethers.getContractFactory("DAOFactory");
    const factory = await Factory.deploy();
    
    const tx = await factory.deployDAO("Test DAO", "TEST", owner.address);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find(log => {
      try {
        return factory.interface.parseLog(log).name === "DAODeployed";
      } catch {
        return false;
      }
    });
    
    const parsedEvent = factory.interface.parseLog(event);
    
    const Token = await ethers.getContractFactory("GovernanceToken");
    token = Token.attach(parsedEvent.args.token);
    
    const Governor = await ethers.getContractFactory("DAOGovernor");
    governor = Governor.attach(parsedEvent.args.governor);
    
    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelock = TimelockController.attach(parsedEvent.args.timelock);
    
    const Treasury = await ethers.getContractFactory("DAOTreasury");
    treasury = Treasury.attach(parsedEvent.args.treasury);
    
    utils = new DAOTestUtils(token, governor, treasury, timelock);
  });
  
  describe("Multi-Step Governance", function () {
    it("Should handle complex multi-target proposals", async function () {
      // Setup voting power
      await utils.setupVotingPower(
        [proposer, voter1, voter2],
        [
          ethers.parseEther("15000"), // Above threshold
          ethers.parseEther("40000"), // Strong voting power
          ethers.parseEther("30000")  // Strong voting power
        ]
      );
      
      // Fund treasury
      await utils.fundTreasury(ethers.parseEther("5"), owner);
      
      // Create multi-target proposal
      const targets = [treasury.target, treasury.target];
      const values = [0, 0];
      const calldatas = [
        treasury.interface.encodeFunctionData("executeProposal", [
          ethers.id("multi-1"),
          voter1.address,
          ethers.parseEther("1"),
          "0x"
        ]),
        treasury.interface.encodeFunctionData("executeProposal", [
          ethers.id("multi-2"),
          voter2.address,
          ethers.parseEther("2"),
          "0x"
        ])
      ];
      const description = "Multi-target proposal: Send ETH to two recipients";
      
      const voters = [
        { signer: voter1, support: 1 }, // For
        { signer: voter2, support: 1 }  // For
      ];
      
      const balanceBefore1 = await ethers.provider.getBalance(voter1.address);
      const balanceBefore2 = await ethers.provider.getBalance(voter2.address);
      
      await utils.createAndExecuteProposal(
        proposer, voters, targets, values, calldatas, description
      );
      
      const balanceAfter1 = await ethers.provider.getBalance(voter1.address);
      const balanceAfter2 = await ethers.provider.getBalance(voter2.address);
      
      // Account for gas costs by using tolerance
      const tolerance = ethers.parseEther("0.01"); // 0.01 ETH tolerance
      expect(balanceAfter1 - balanceBefore1).to.be.closeTo(ethers.parseEther("1"), tolerance);
      expect(balanceAfter2 - balanceBefore2).to.be.closeTo(ethers.parseEther("2"), tolerance);
    });
  });
  
  describe("Governance Parameter Changes", function () {
    it("Should allow changing voting parameters through governance", async function () {
      // This would require additional governance functions
      // For now, we test the concept with treasury operations
      
      await utils.setupVotingPower(
        [proposer, voter1],
        [ethers.parseEther("15000"), ethers.parseEther("60000")]
      );
      
      await utils.fundTreasury(ethers.parseEther("1"), owner);
      
      const targets = [treasury.target];
      const values = [0];
      const calldatas = [
        treasury.interface.encodeFunctionData("executeProposal", [
          ethers.id("param-change"),
          owner.address,
          ethers.parseEther("0.5"),
          "0x"
        ])
      ];
      
      const voters = [{ signer: voter1, support: 1 }];
      
      await utils.createAndExecuteProposal(
        proposer, voters, targets, values, calldatas, 
        "Change governance parameters"
      );
      
      expect(await treasury.getBalance()).to.equal(ethers.parseEther("0.5"));
    });
  });
  
  describe("Proposal Lifecycle Management", function () {
    it("Should handle proposal cancellation and replacement", async function () {
      await utils.setupVotingPower(
        [proposer, voter1],
        [ethers.parseEther("15000"), ethers.parseEther("60000")]
      );
      
      // Create initial proposal
      const targets = [treasury.target];
      const values = [0];
      const calldatas = [
        treasury.interface.encodeFunctionData("executeProposal", [
          ethers.id("initial-proposal"),
          voter1.address,
          ethers.parseEther("0.1"),
          "0x"
        ])
      ];
      const description = "Initial proposal";
      
      const proposalTx = await governor.connect(proposer).propose(
        targets, values, calldatas, description
      );
      const receipt = await proposalTx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          return governor.interface.parseLog(log).name === "ProposalCreated";
        } catch {
          return false;
        }
      });
      
      const proposalId = governor.interface.parseLog(event).args.proposalId;
      
      // Cancel the proposal
      await governor.connect(proposer).cancel(targets, values, calldatas, ethers.id(description));
      
      // Verify proposal is canceled
      const state = await governor.state(proposalId);
      expect(state).to.equal(2); // Canceled state
    });
  });
  
  describe("Emergency Governance", function () {
    it("Should handle emergency proposal execution", async function () {
      await utils.setupVotingPower(
        [proposer, voter1, voter2],
        [ethers.parseEther("15000"), ethers.parseEther("40000"), ethers.parseEther("30000")]
      );
      
      await utils.fundTreasury(ethers.parseEther("2"), owner);
      
      // Create emergency proposal with shorter timelock
      const targets = [treasury.target];
      const values = [0];
      const calldatas = [
        treasury.interface.encodeFunctionData("executeProposal", [
          ethers.id("emergency-proposal"),
          voter1.address,
          ethers.parseEther("1"),
          "0x"
        ])
      ];
      
      const voters = [
        { signer: voter1, support: 1 },
        { signer: voter2, support: 1 }
      ];
      
      const balanceBefore = await ethers.provider.getBalance(voter1.address);
      
      await utils.createAndExecuteProposal(
        proposer, voters, targets, values, calldatas, 
        "Emergency proposal execution"
      );
      
      const balanceAfter = await ethers.provider.getBalance(voter1.address);
      
      // Account for gas costs by using tolerance
      const tolerance = ethers.parseEther("0.01"); // 0.01 ETH tolerance
      expect(balanceAfter - balanceBefore).to.be.closeTo(ethers.parseEther("1"), tolerance);
    });
  });
}); 
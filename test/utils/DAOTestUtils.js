const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

class DAOTestUtils {
  constructor(token, governor, treasury, timelock) {
    this.token = token;
    this.governor = governor;
    this.treasury = treasury;
    this.timelock = timelock;
  }
  
  // Helper to create and execute a full proposal lifecycle
  async createAndExecuteProposal(
    proposer,
    voters,
    targets,
    values,
    calldatas,
    description
  ) {
    // 1. Create proposal
    const proposalTx = await this.governor.connect(proposer).propose(
      targets, values, calldatas, description
    );
    const receipt = await proposalTx.wait();
    
    const event = receipt.logs.find(log => {
      try {
        return this.governor.interface.parseLog(log).name === "ProposalCreated";
      } catch {
        return false;
      }
    });
    
    const proposalId = this.governor.interface.parseLog(event).args.proposalId;
    
    // 2. Wait for voting delay (advance blocks instead of time)
    const votingDelay = await this.governor.votingDelay();
    const votingDelayNum = Number(votingDelay);
    for (let i = 0; i < votingDelayNum + 1; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    // 3. Vote
    for (const voter of voters) {
      await this.governor.connect(voter.signer).castVote(proposalId, voter.support);
    }
    
    // 4. Wait for voting period to end (advance blocks instead of time)
    const votingPeriod = await this.governor.votingPeriod();
    const votingPeriodNum = Number(votingPeriod);
    for (let i = 0; i < votingPeriodNum + 1; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    // 5. Queue proposal
    const descriptionHash = ethers.id(description);
    await this.governor.queue(targets, values, calldatas, descriptionHash);
    
    // 6. Wait for timelock delay (use time advancement for this)
    await time.increase(2); // 2 seconds for testing
    
    // 7. Execute proposal
    const executeTx = await this.governor.execute(targets, values, calldatas, descriptionHash);
    await executeTx.wait();
    
    return { proposalId, executeTx };
  }
  
  // Helper to setup voting power for multiple users
  async setupVotingPower(users, amounts) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const amount = amounts[i];
      
      // Transfer tokens
      await this.token.transfer(user.address, amount);
      
      // Delegate voting power
      await this.token.connect(user).delegate(user.address);
    }
    
    // Wait for delegation to take effect
    await ethers.provider.send("evm_mine", []);
  }
  
  // Helper to fund treasury
  async fundTreasury(amount, funder) {
    await funder.sendTransaction({
      to: this.treasury.target,
      value: amount
    });
  }
  
  // Helper to check proposal state
  async getProposalState(proposalId) {
    const state = await this.governor.state(proposalId);
    const states = [
      "Pending", "Active", "Canceled", "Defeated", 
      "Succeeded", "Queued", "Expired", "Executed"
    ];
    return states[state];
  }
  
  // Helper to get voting results
  async getVotingResults(proposalId) {
    const votes = await this.governor.proposalVotes(proposalId);
    return {
      againstVotes: ethers.formatEther(votes.againstVotes),
      forVotes: ethers.formatEther(votes.forVotes),
      abstainVotes: ethers.formatEther(votes.abstainVotes)
    };
  }
}

module.exports = { DAOTestUtils }; 
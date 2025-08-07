import { ethers } from 'ethers';

// Contract ABIs (simplified for demonstration)
const DAO_FACTORY_ABI = [
  "function deployDAO(string memory tokenName, string memory tokenSymbol, address initialOwner) external returns (tuple(address token, address governor, address timelock, address treasury))",
  "event DAODeployed(address indexed token, address indexed governor, address indexed timelock, address treasury)"
];

const GOVERNANCE_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function delegate(address delegatee) external",
  "function delegates(address account) external view returns (address)",
  "function getVotes(address account) external view returns (uint256)",
  "function getPastVotes(address account, uint256 blockNumber) external view returns (uint256)"
];

const DAO_GOVERNOR_ABI = [
  "function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support) public returns (uint256)",
  "function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) public returns (uint256)",
  "function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public payable returns (uint256)",
  "function state(uint256 proposalId) public view returns (uint8)",
  "function proposalSnapshot(uint256 proposalId) public view returns (uint256)",
  "function proposalDeadline(uint256 proposalId) public view returns (uint256)",
  "function proposalThreshold() public view returns (uint256)",
  "function quorum(uint256 blockNumber) public view returns (uint256)",
  "function votingDelay() public view returns (uint256)",
  "function votingPeriod() public view returns (uint256)",
  "function hasVoted(uint256 proposalId, address account) public view returns (bool)",
  "function getVotes(address account, uint256 blockNumber) public view returns (uint256)",
  "function getProposalVotes(uint256 proposalId) public view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)",
  "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight, string reason)"
];

const DAO_TREASURY_ABI = [
  "function executeTransaction(address target, uint256 value, bytes calldata data) external returns (bytes memory)",
  "function receive() external payable",
  "function getBalance() external view returns (uint256)"
];

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.daoFactory = null;
    this.governanceToken = null;
    this.daoGovernor = null;
    this.daoTreasury = null;
    this.contractAddresses = {
      daoFactory: null,
      governanceToken: null,
      daoGovernor: null,
      daoTreasury: null
    };
  }

  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    } else {
      throw new Error('MetaMask is not installed');
    }
  }

  async connectWallet() {
    try {
      await this.initialize();
      const accounts = await this.provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async getNetworkInfo() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name
    };
  }

  async deployDAO(tokenName, tokenSymbol, initialOwner) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      // For now, we'll use a mock deployment
      // In a real implementation, you would deploy the actual contracts
      const mockAddresses = {
        token: '0x1234567890123456789012345678901234567890',
        governor: '0x2345678901234567890123456789012345678901',
        timelock: '0x3456789012345678901234567890123456789012',
        treasury: '0x4567890123456789012345678901234567890123'
      };

      this.contractAddresses = mockAddresses;
      await this.loadContracts();
      
      return mockAddresses;
    } catch (error) {
      console.error('Error deploying DAO:', error);
      throw error;
    }
  }

  async loadContracts() {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.contractAddresses.governanceToken) {
        this.governanceToken = new ethers.Contract(
          this.contractAddresses.governanceToken,
          GOVERNANCE_TOKEN_ABI,
          this.signer
        );
      }

      if (this.contractAddresses.daoGovernor) {
        this.daoGovernor = new ethers.Contract(
          this.contractAddresses.daoGovernor,
          DAO_GOVERNOR_ABI,
          this.signer
        );
      }

      if (this.contractAddresses.daoTreasury) {
        this.daoTreasury = new ethers.Contract(
          this.contractAddresses.daoTreasury,
          DAO_TREASURY_ABI,
          this.signer
        );
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
      throw error;
    }
  }

  async getTokenInfo() {
    if (!this.governanceToken) {
      throw new Error('Governance token not loaded');
    }

    try {
      const [name, symbol, totalSupply] = await Promise.all([
        this.governanceToken.name(),
        this.governanceToken.symbol(),
        this.governanceToken.totalSupply()
      ]);

      return {
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply)
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  async getTokenBalance(address) {
    if (!this.governanceToken) {
      throw new Error('Governance token not loaded');
    }

    try {
      const balance = await this.governanceToken.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async getVotingPower(address) {
    if (!this.governanceToken) {
      throw new Error('Governance token not loaded');
    }

    try {
      const votes = await this.governanceToken.getVotes(address);
      return ethers.formatEther(votes);
    } catch (error) {
      console.error('Error getting voting power:', error);
      throw error;
    }
  }

  async createProposal(targets, values, calldatas, description) {
    if (!this.daoGovernor) {
      throw new Error('DAO Governor not loaded');
    }

    try {
      const tx = await this.daoGovernor.propose(targets, values, calldatas, description);
      const receipt = await tx.wait();
      
      // Extract proposal ID from events
      const proposalCreatedEvent = receipt.logs.find(
        log => log.eventName === 'ProposalCreated'
      );
      
      return {
        proposalId: proposalCreatedEvent.args.proposalId,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async castVote(proposalId, support, reason = '') {
    if (!this.daoGovernor) {
      throw new Error('DAO Governor not loaded');
    }

    try {
      let tx;
      if (reason) {
        tx = await this.daoGovernor.castVoteWithReason(proposalId, support, reason);
      } else {
        tx = await this.daoGovernor.castVote(proposalId, support);
      }
      
      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        support
      };
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  async getProposalInfo(proposalId) {
    if (!this.daoGovernor) {
      throw new Error('DAO Governor not loaded');
    }

    try {
      const [state, snapshot, deadline, votes] = await Promise.all([
        this.daoGovernor.state(proposalId),
        this.daoGovernor.proposalSnapshot(proposalId),
        this.daoGovernor.proposalDeadline(proposalId),
        this.daoGovernor.getProposalVotes(proposalId)
      ]);

      return {
        state: this.getStateString(state),
        snapshot: snapshot.toString(),
        deadline: deadline.toString(),
        votes: {
          against: ethers.formatEther(votes.againstVotes),
          for: ethers.formatEther(votes.forVotes),
          abstain: ethers.formatEther(votes.abstainVotes)
        }
      };
    } catch (error) {
      console.error('Error getting proposal info:', error);
      throw error;
    }
  }

  async hasVoted(proposalId, address) {
    if (!this.daoGovernor) {
      throw new Error('DAO Governor not loaded');
    }

    try {
      return await this.daoGovernor.hasVoted(proposalId, address);
    } catch (error) {
      console.error('Error checking if address has voted:', error);
      throw error;
    }
  }

  getStateString(state) {
    const states = [
      'Pending',
      'Active',
      'Canceled',
      'Defeated',
      'Succeeded',
      'Queued',
      'Expired',
      'Executed'
    ];
    return states[state] || 'Unknown';
  }

  // Mock methods for demonstration
  async getMockProposals() {
    const now = Date.now();
    return [
      {
        id: 1,
        title: "Add New Feature: Staking Rewards",
        description: "Proposal to implement staking rewards for token holders who participate in governance.",
        proposer: "0x1234...5678",
        forVotes: 1500,
        againstVotes: 200,
        abstainVotes: 50,
        status: "active",
        endTime: now + 86400000,
      },
      {
        id: 2,
        title: "Update Treasury Allocation",
        description: "Proposal to allocate 20% of treasury funds to development and marketing.",
        proposer: "0x8765...4321",
        forVotes: 800,
        againstVotes: 1200,
        abstainVotes: 100,
        status: "defeated",
        endTime: now - 86400000,
      },
      {
        id: 3,
        title: "Community Grant Program",
        description: "Establish a grant program to fund community-driven projects.",
        proposer: "0xabcd...efgh",
        forVotes: 2000,
        againstVotes: 150,
        abstainVotes: 75,
        status: "active",
        endTime: now + 172800000,
      }
    ];
  }
}

export default new ContractService(); 
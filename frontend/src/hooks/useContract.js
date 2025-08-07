import { useState, useEffect, useCallback } from 'react';
import contractService from '../services/contractService';

export const useContract = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [proposals, setProposals] = useState([]);

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const connectedAccount = await contractService.connectWallet();
      setAccount(connectedAccount);
      setIsConnected(true);
      
      // Get network info
      const network = await contractService.getNetworkInfo();
      setNetworkInfo(network);
      
      // Load mock proposals for demonstration
      const mockProposals = await contractService.getMockProposals();
      setProposals(mockProposals);
      
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount('');
    setIsConnected(false);
    setNetworkInfo(null);
    setTokenInfo(null);
    setTokenBalance('0');
    setVotingPower('0');
    setProposals([]);
    setError(null);
  }, []);

  const loadTokenInfo = useCallback(async () => {
    if (!isConnected || !account) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For demonstration, we'll use mock data
      // In a real implementation, you would call the actual contract methods
      const mockTokenInfo = {
        name: 'DAO Governance Token',
        symbol: 'DAO',
        totalSupply: '1000000'
      };
      
      const mockBalance = '2500';
      const mockVotingPower = '2500';
      
      setTokenInfo(mockTokenInfo);
      setTokenBalance(mockBalance);
      setVotingPower(mockVotingPower);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading token info:', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected, account]);

  const createProposal = useCallback(async (title, description, targets = [], values = [], calldatas = []) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For demonstration, we'll create a mock proposal
      // In a real implementation, you would call contractService.createProposal()
      const newProposal = {
        id: proposals.length + 1,
        title,
        description,
        proposer: account,
        forVotes: 0,
        againstVotes: 0,
        abstainVotes: 0,
        status: 'active',
        endTime: 1735689600000, // Static timestamp for demo
      };
      
      setProposals(prev => [newProposal, ...prev]);
      
      return {
        proposalId: newProposal.id,
        transactionHash: '0x' + '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };
      
    } catch (err) {
      setError(err.message);
      console.error('Error creating proposal:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, account, proposals]);

  const castVote = useCallback(async (proposalId, support) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For demonstration, we'll update the mock proposal
      // In a real implementation, you would call contractService.castVote()
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          const voteAmount = parseInt(votingPower);
          return {
            ...proposal,
            forVotes: support === 1 ? proposal.forVotes + voteAmount : proposal.forVotes,
            againstVotes: support === 0 ? proposal.againstVotes + voteAmount : proposal.againstVotes,
            abstainVotes: support === 2 ? proposal.abstainVotes + voteAmount : proposal.abstainVotes,
          };
        }
        return proposal;
      }));
      
      return {
        transactionHash: '0x' + 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        support
      };
      
    } catch (err) {
      setError(err.message);
      console.error('Error casting vote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, votingPower]);

  const deployDAO = useCallback(async (tokenName, tokenSymbol, initialOwner) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For demonstration, we'll use mock addresses
      // In a real implementation, you would call contractService.deployDAO()
      const mockAddresses = {
        token: '0x1234567890123456789012345678901234567890',
        governor: '0x2345678901234567890123456789012345678901',
        timelock: '0x3456789012345678901234567890123456789012',
        treasury: '0x4567890123456789012345678901234567890123'
      };
      
      return mockAddresses;
      
    } catch (err) {
      setError(err.message);
      console.error('Error deploying DAO:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // Load token info when wallet is connected
  useEffect(() => {
    if (isConnected && account) {
      loadTokenInfo();
    }
  }, [isConnected, account, loadTokenInfo]);

  return {
    // State
    account,
    isConnected,
    loading,
    error,
    networkInfo,
    tokenInfo,
    tokenBalance,
    votingPower,
    proposals,
    
    // Actions
    connectWallet,
    disconnectWallet,
    createProposal,
    castVote,
    deployDAO,
    loadTokenInfo,
  };
}; 
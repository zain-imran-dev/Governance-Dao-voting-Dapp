"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  Vote, 
  FileText, 
  Users, 
  TrendingUp, 
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Zap,
  AlertCircle
} from "lucide-react";
import { useContract } from "../hooks/useContract";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    targetContract: "",
    functionData: ""
  });

  const {
    account,
    isConnected,
    loading,
    error,
    networkInfo,
    tokenInfo,
    tokenBalance,
    votingPower,
    proposals,
    connectWallet,
    disconnectWallet,
    createProposal,
    castVote
  } = useContract();

  // Use useEffect to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400";
      case "defeated":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400";
      case "executed":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />;
      case "defeated":
        return <XCircle className="w-4 h-4" />;
      case "executed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                              <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Vote className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      DAO Voting
                    </h1>
                  </div>
                  
                  {error && (
                    <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
            
            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{loading ? "Connecting..." : "Connect Wallet"}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connected</span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Vote className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to DAO Voting
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect your wallet to participate in decentralized governance. 
              Create proposals, vote on important decisions, and shape the future of your DAO.
            </p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-3 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              <span>{loading ? "Connecting..." : "Connect Wallet to Start"}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "proposals", label: "Proposals", icon: FileText },
                { id: "create", label: "Create Proposal", icon: Plus },
                { id: "members", label: "Members", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proposals</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{proposals.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Proposals</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {proposals.filter(p => p.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Votes</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {proposals.reduce((total, p) => total + p.forVotes + p.againstVotes + p.abstainVotes, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Vote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Voting Power</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{votingPower}</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {proposals.slice(0, 3).map((proposal) => (
                        <div key={proposal.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{proposal.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Proposed by {proposal.proposer}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                              {proposal.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Proposals Tab */}
            {activeTab === "proposals" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Proposals</h2>
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Proposal</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {proposal.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {proposal.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Proposed by {proposal.proposer}</span>
                            <span>•</span>
                            <span>Ends in {Math.ceil((proposal.endTime - Date.now()) / (1000 * 60 * 60))} hours</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(proposal.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </span>
                        </div>
                      </div>

                      {/* Voting Results */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">For</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(proposal.forVotes / (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {proposal.forVotes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Against</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {proposal.againstVotes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abstain</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${(proposal.abstainVotes / (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {proposal.abstainVotes.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {proposal.status === "active" && (
                        <div className="flex space-x-3 mt-6">
                          <button 
                            onClick={async () => {
                              try {
                                await castVote(proposal.id, 1); // 1 = For
                                alert("Vote cast successfully!");
                              } catch (error) {
                                alert("Error casting vote: " + error.message);
                              }
                            }}
                            disabled={loading}
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {loading ? "Voting..." : "Vote For"}
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                await castVote(proposal.id, 0); // 0 = Against
                                alert("Vote cast successfully!");
                              } catch (error) {
                                alert("Error casting vote: " + error.message);
                              }
                            }}
                            disabled={loading}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {loading ? "Voting..." : "Vote Against"}
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                await castVote(proposal.id, 2); // 2 = Abstain
                                alert("Vote cast successfully!");
                              } catch (error) {
                                alert("Error casting vote: " + error.message);
                              }
                            }}
                            disabled={loading}
                            className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          >
                            {loading ? "Voting..." : "Abstain"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create Proposal Tab */}
            {activeTab === "create" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Proposal</h2>
                  
                  <form 
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!proposalForm.title || !proposalForm.description) {
                        alert("Please fill in all required fields");
                        return;
                      }
                      
                      try {
                        await createProposal(
                          proposalForm.title,
                          proposalForm.description,
                          proposalForm.targetContract ? [proposalForm.targetContract] : [],
                          [0],
                          proposalForm.functionData ? [proposalForm.functionData] : []
                        );
                        setProposalForm({ title: "", description: "", targetContract: "", functionData: "" });
                        setActiveTab("proposals");
                        alert("Proposal created successfully!");
                      } catch (error) {
                        alert("Error creating proposal: " + error.message);
                      }
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Proposal Title *
                      </label>
                      <input
                        type="text"
                        value={proposalForm.title}
                        onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter proposal title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        rows={6}
                        value={proposalForm.description}
                        onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Describe your proposal in detail..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Contract (Optional)
                      </label>
                      <input
                        type="text"
                        value={proposalForm.targetContract}
                        onChange={(e) => setProposalForm(prev => ({ ...prev, targetContract: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Function Call Data (Optional)
                      </label>
                      <input
                        type="text"
                        value={proposalForm.functionData}
                        onChange={(e) => setProposalForm(prev => ({ ...prev, functionData: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0x..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                      >
                        {loading ? "Creating..." : "Create Proposal"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setProposalForm({ title: "", description: "", targetContract: "", functionData: "" })}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Clear Form
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">DAO Members</h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Token Holders</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total: 1,247 members</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { address: "0x1234...5678", tokens: "50,000", percentage: "20%" },
                        { address: "0x8765...4321", tokens: "30,000", percentage: "12%" },
                        { address: "0xabcd...efgh", tokens: "25,000", percentage: "10%" },
                        { address: "0x9876...5432", tokens: "20,000", percentage: "8%" },
                        { address: "0xdcba...hgfe", tokens: "15,000", percentage: "6%" },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{member.address}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{member.tokens} tokens</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {member.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Network Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            RPC URL
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="https://..."
                            defaultValue="http://localhost:8545"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contract Addresses
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Governance Token Address"
                            />
                            <input
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Governor Contract Address"
                            />
                            <input
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Treasury Contract Address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                        Save Settings
                      </button>
                      <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

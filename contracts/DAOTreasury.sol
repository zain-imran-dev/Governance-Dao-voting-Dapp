// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DAOTreasury
 * @dev Manages DAO funds and executes approved proposals
 */
contract DAOTreasury is AccessControl, ReentrancyGuard {
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event ProposalExecuted(bytes32 indexed proposalId, address indexed target, uint256 value);
    
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }
    
    /**
     * @dev Receive ETH deposits
     */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Execute a proposal (only by timelock controller)
     */
    function executeProposal(
        bytes32 proposalId,
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyRole(EXECUTOR_ROLE) nonReentrant {
        require(address(this).balance >= value, "Insufficient funds");
        
        (bool success, ) = target.call{value: value}(data);
        require(success, "Proposal execution failed");
        
        emit ProposalExecuted(proposalId, target, value);
    }
    
    /**
     * @dev Get treasury balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 
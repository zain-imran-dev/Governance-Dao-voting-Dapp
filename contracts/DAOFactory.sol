// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GovernanceToken.sol";
import "./DAOTreasury.sol";
import "./DAOGovernor.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title DAOFactory
 * @dev Factory contract to deploy the complete DAO system
 */
contract DAOFactory {
    event DAODeployed(
        address indexed token,
        address indexed governor,
        address indexed timelock,
        address treasury
    );
    
    struct DAOAddresses {
        address token;
        address governor;
        address timelock;
        address treasury;
    }
    
    /**
     * @dev Deploy a complete DAO system
     */
    function deployDAO(
        string memory tokenName,
        string memory tokenSymbol,
        address initialOwner
    ) external returns (DAOAddresses memory) {
        // 1. Deploy Governance Token
        GovernanceToken token = new GovernanceToken(
            tokenName,
            tokenSymbol,
            initialOwner
        );
        
        // 2. Deploy Treasury with factory as admin initially
        DAOTreasury treasury = new DAOTreasury(address(this));
        
        // 3. Deploy Timelock Controller
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        
        // Initially, the factory is the proposer, but this will be transferred to governor
        proposers[0] = address(this);
        executors[0] = address(0); // Anyone can execute after timelock
        
        TimelockController timelock = new TimelockController(
            1, // 1 second timelock delay for testing
            proposers,
            executors,
            address(this) // Factory as admin
        );
        
        // 4. Deploy Governor
        DAOGovernor governor = new DAOGovernor(
            IVotes(address(token)),
            timelock
        );
        
        // 5. Setup roles and permissions
        // The factory has DEFAULT_ADMIN_ROLE in both treasury and timelock
        
        // Grant executor role to timelock in treasury
        treasury.grantRole(treasury.EXECUTOR_ROLE(), address(timelock));
        
        // Grant proposer role to governor in timelock
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        
        // Revoke initial proposer role from factory
        timelock.revokeRole(timelock.PROPOSER_ROLE(), address(this));
        
        // Transfer admin roles to the initial owner
        treasury.grantRole(treasury.DEFAULT_ADMIN_ROLE(), initialOwner);
        treasury.revokeRole(treasury.DEFAULT_ADMIN_ROLE(), address(this));
        
        timelock.grantRole(timelock.TIMELOCK_ADMIN_ROLE(), initialOwner);
        timelock.revokeRole(timelock.TIMELOCK_ADMIN_ROLE(), address(this));
        
        DAOAddresses memory addresses = DAOAddresses({
            token: address(token),
            governor: address(governor),
            timelock: address(timelock),
            treasury: address(treasury)
        });
        
        emit DAODeployed(
            address(token),
            address(governor),
            address(timelock),
            address(treasury)
        );
        
        return addresses;
    }
} 
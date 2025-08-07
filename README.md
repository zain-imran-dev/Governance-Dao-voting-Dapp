# Governance DAO Voting dApp

A decentralized governance application built with Solidity smart contracts and Next.js frontend, enabling DAO members to create proposals, vote, and execute governance decisions on the blockchain.

## 🚀 Features

- **DAO Creation**: Deploy new DAOs with custom governance tokens
- **Proposal Management**: Create, view, and manage governance proposals
- **Voting System**: Secure on-chain voting with token-weighted voting power
- **Treasury Management**: DAO treasury with fund management capabilities
- **Real-time Updates**: Live updates of proposal status and voting results
- **Web3 Integration**: Seamless MetaMask integration for blockchain interactions

## 🏗️ Architecture

### Smart Contracts
- **DAOFactory.sol**: Factory contract for creating new DAOs
- **DAOGovernor.sol**: Core governance logic with proposal and voting mechanisms
- **DAOTreasury.sol**: Treasury management for DAO funds
- **GovernanceToken.sol**: ERC20 token with voting power delegation

### Frontend
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum library for blockchain interactions
- **Headless UI**: Accessible UI components

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Hardhat development environment

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zain-imran-dev/Governance-Dao-voting-Dapp.git
   cd Governance-Dao-voting-Dapp
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables (if needed)
   cp .env.example .env
   ```

## 🚀 Quick Start

### 1. Start the Development Environment

```bash
# Start Hardhat node (in root directory)
npx hardhat node

# In a new terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Connect MetaMask

1. Open MetaMask and connect to `localhost:8545`
2. Import one of the test accounts provided by Hardhat
3. Connect your wallet to the dApp

## 📖 Usage

### Creating a DAO

1. Navigate to the "Create DAO" section
2. Enter DAO name, token symbol, and initial supply
3. Deploy the DAO using MetaMask
4. Receive governance tokens for voting power

### Creating Proposals

1. Connect your wallet with governance tokens
2. Navigate to "Create Proposal"
3. Enter proposal details (title, description, actions)
4. Submit proposal for voting

### Voting on Proposals

1. View active proposals in the dashboard
2. Choose your vote (For, Against, Abstain)
3. Confirm transaction in MetaMask
4. View real-time voting results

### Executing Proposals

1. Wait for voting period to end
2. If proposal passes, execute the proposal
3. Confirm execution transaction

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test test/GovernanceToken.test.js

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
governance-dao-voting-app/
├── contracts/                 # Smart contracts
│   ├── DAOFactory.sol
│   ├── DAOGovernor.sol
│   ├── DAOTreasury.sol
│   └── GovernanceToken.sol
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── context/          # Web3 context
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
├── test/                      # Test files
├── scripts/                   # Deployment scripts
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

## 🔧 Configuration

### Hardhat Configuration
- Network configuration for local development
- Compiler settings for Solidity contracts
- Gas optimization settings

### Frontend Configuration
- Web3 provider configuration
- Contract address management
- Environment variables

## 🚀 Deployment

### Local Development
```bash
# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
cd frontend && npm run dev
```

### Testnet Deployment
```bash
# Deploy to testnet (e.g., Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Hardhat](https://hardhat.org/) for development environment

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

---

**Built with ❤️ for decentralized governance**

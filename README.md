# Avadix Protocol 🔺

Avadix is a decentralized prediction market and community funding platform built on the **Avalanche (AVAX)** network. It combines the thrill of binary prediction markets (Polymarket-style) with a transparent, blockchain-powered donation system.

![Avadix Logo](client/public/favicon.png)

## 🌟 Features

### 🔮 Prediction Markets
- **Binary Outcomes**: Trade on YES/NO outcomes for Crypto, Politics, Sports, and Tech.
- **AMM-Based Pricing**: Real-time price discovery based on liquidity distribution (0-100¢).
- **Responsive Trading**: Glassmorphic UI with inline trading forms and real-time updates.

### ☘️ Community Campaigns
- **Direct Funding**: Create and support impact-driven campaigns.
- **Transparent Donations**: All contributions are tracked on-chain.
- **Quick-Donate**: One-tap presets for 0.5, 1, or 5 AVAX.

### 🛡️ Web3 Native
- **WalletConnect**: Seamless integration with MetaMask, Core, and Rabby via Web3Modal.
- **Avalanche Fuji**: Optimized for the Avalanche Fuji Testnet (Chain ID: 43113).
- **Fast & Low Cost**: Leveraging Avalanche's sub-second finality.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express, Drizzle ORM
- **Database**: PostgreSQL
- **Web3**: Wagmi v2, Viem, Web3Modal
- **Blockchain**: Avalanche (C-Chain)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- A PostgreSQL database
- A WalletConnect Project ID (from [Cloud.walletconnect.com](https://cloud.walletconnect.com))

### Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/avadix
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/avadix.git
   cd avadix
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Push the database schema:
   ```bash
   npm run db:push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Smart Contract (Reference)
The application is designed to interface with a Prediction Market contract on Avalanche Fuji. 
- **Network**: Avalanche Fuji Testnet
- **RPC**: `https://api.avax-test.network/ext/bc/C/rpc`
- **Chain ID**: `43113`

## 📄 License
MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by **Avadix Labs** for the Avalanche Build Games 2026.

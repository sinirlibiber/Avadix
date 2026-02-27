<div align="center">

# 🔺 Avadix Protocol

**Decentralized Prediction Markets & Community Funding on Avalanche**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Network](https://img.shields.io/badge/Network-Avalanche%20Fuji-red)](https://testnet.snowtrace.io/)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-43113-blue)]()
[![Built with](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-97.9%25-3178C6)]()

> Built with ❤️ by **Avadix Labs** for the **Avalanche Build Games 2026**

[Live Demo]([#](https://avalanche-prediction-market--mardinli4047.replit.app) · · [Docs](docs.avax.network) · [Report Bug](https://github.com/sinirlibiber/Avadix/issues)

</div>

---

## 📌 What is Avadix?

Avadix is a **decentralized prediction market and community funding platform** built on the Avalanche C-Chain. It brings together two powerful primitives:

- **Prediction Markets** — Trade YES/NO outcomes on Crypto, Politics, Sports, and Tech events using AMM-based real-time pricing.
- **Community Campaigns** — Create and fund impact-driven campaigns with fully transparent on-chain donations.

All of this in one sleek, Web3-native interface — fast, cheap, and trustless thanks to Avalanche's sub-second finality.

---

## ✨ Features

### 🔮 Prediction Markets
- Binary YES/NO outcomes across Crypto, Politics, Sports, and Tech categories
- AMM-based pricing with real-time price discovery (0–100¢ range)
- Glassmorphic UI with inline trading forms and live updates

### 🌱 Community Campaigns
- Create and support impact-driven funding campaigns
- All contributions tracked transparently on-chain
- Quick-Donate presets: **0.5 AVAX**, **1 AVAX**, **5 AVAX**

### 🛡️ Web3 Native
- WalletConnect integration — MetaMask, Core, and Rabby supported via Web3Modal
- Optimized for **Avalanche Fuji Testnet** (Chain ID: `43113`)
- Sub-second finality and ultra-low transaction costs

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Node.js, Express, Drizzle ORM |
| Database | PostgreSQL |
| Web3 | Wagmi v2, Viem, Web3Modal |
| Blockchain | Avalanche C-Chain (Fuji Testnet) |
| Language | TypeScript |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client (React/Vite)             │
│   Prediction Markets │ Campaigns │ Wallet UI     │
└────────────────────────┬────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
┌─────────▼──────────┐     ┌───────────▼──────────┐
│  Express REST API  │     │  Smart Contract       │
│  Node.js + Drizzle │     │  Avalanche Fuji       │
└─────────┬──────────┘     │  (YES/NO AMM + Escrow)│
          │                └──────────────────────┘
┌─────────▼──────────┐
│    PostgreSQL       │
│  Markets │ Campaigns│
└────────────────────┘
```

**On-chain events:** Position opens, market settlement, campaign donations, reward claims
**Off-chain:** Market metadata, user history, campaign details

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- WalletConnect Project ID → [cloud.walletconnect.com](https://cloud.walletconnect.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sinirlibiber/Avadix.git
cd Avadix

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Push database schema
npm run db:push

# 5. Start the development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/avadix
WALLETCONNECT_PROJECT_ID=your_project_id_here
```

---

## ⛓️ Smart Contract

The platform interfaces with a Prediction Market contract deployed on Avalanche Fuji.

| Property | Value |
|---|---|
| Network | Avalanche Fuji Testnet |
| RPC URL | `https://api.avax-test.network/ext/bc/C/rpc` |
| Chain ID | `43113` |
| Explorer | [testnet.snowtrace.io](https://testnet.snowtrace.io) |

---

## 📁 Project Structure

```
Avadix/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Express API + Drizzle ORM
├── shared/          # Shared TypeScript types & schemas
├── script/          # Utility scripts
└── attached_assets/ # Static assets
```

---

## 🗺️ Roadmap

- [x] AMM-based binary prediction markets
- [x] WalletConnect wallet integration
- [x] Community campaign funding
- [ ] Mainnet deployment
- [ ] Automated oracle result verification
- [ ] DAO governance & token voting


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Avadix Labs** · Avalanche Build Games 2026

*Predict. Fund. Impact.*

</div>

# Vereda.Verify — RWA & Timber Tracking on Stellar

<div align="center">

**A blockchain-powered audit panel for tokenizing sustainable timber assets on the Stellar Network.**

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-2ecc71?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## Project Description

**Vereda.Verify** is a professional-grade Real World Asset (RWA) audit dashboard for the [Florestas.Social](https://florestas.social) protocol. It tokenizes African Mahogany (*Khaya senegalensis*) assets across the full timber supply chain — from nursery to sawmill — by anchoring cryptographic data payloads to immutable Stellar Network transactions.

The application covers **three traceability modules**:

| Module | Entity | What is Registered On-Chain |
|--------|--------|-----------------------------|
| 🌱 **Viveiro** | Viveiro Maravilha (Nursery) | Seed lot ID, seedling count, CREA engineer, document hash |
| 🌳 **Plantio** | Florestas.Social (Farm) | CAR registration, GPS coordinates, planted area (ha) |
| 🪚 **Serraria** | Indústria Sómogno (Sawmill) | Timber NF-e, operating license, sales invoice, buyer, volume (m³) |

Each registration compresses all form data into a **Merkle-style cryptographic hash** embedded in the Stellar transaction memo — ensuring the full audit trail is immutable and publicly verifiable by anyone.

---

## Setup Instructions — How to Run Locally

### Prerequisites

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **Freighter Wallet** browser extension — [freighter.app](https://freighter.app)
- A funded **Stellar Testnet** account — get free XLM from the [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/G0vermind/vereda-verify-soroban.git

# 2. Enter the project folder
cd vereda-verify-soroban/painel

# 3. Install dependencies
npm install

# 4. Start the development server
node node_modules/vite/bin/vite.js --port 8080
```

> **Windows note:** If `npm run dev` fails with a PowerShell execution policy error, use `node node_modules/vite/bin/vite.js` directly.

Open **http://localhost:8080** in your browser.

### Wallet Configuration

1. Install the **Freighter** browser extension
2. Open Freighter → Settings → **switch to Stellar Testnet**
3. Copy your testnet public key
4. Go to [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test) and paste it to receive **10,000 XLM**
5. Return to the app and click **"🔗 Conectar API Freighter"**

---

## Screenshots

### 1. Disconnected State — Connect Wallet Prompt

The app before wallet connection. The sidebar shows the three supply chain modules. The **"🔗 Conectar API Freighter"** button is visible in the top-right corner.

![Disconnected state — Connect wallet prompt](https://github.com/G0vermind/vereda-verify-soroban/blob/main/images/vereda%200.png)

---

### 2. Wallet Connected — Balance Displayed

After connecting Freighter, the sidebar immediately displays the **wallet address** and **live XLM balance**. The form for the selected module becomes visible.

**Viveiro module** (nursery registration):

![Wallet connected — Viveiro module with balance](https://github.com/G0vermind/vereda-verify-soroban/blob/main/images/vereda%201.png)

**Plantio module** (plantation tracking):

![Wallet connected — Plantio module with balance](https://github.com/G0vermind/vereda-verify-soroban/blob/main/images/vereda%202.png)

**Serraria module** (sawmill — two-stage form):

![Wallet connected — Serraria module with balance](https://github.com/G0vermind/vereda-verify-soroban/blob/main/images/vereda%203.png)

---

### 3. Successful Testnet Transaction — Result Shown to User

After filling the form and clicking **"🛡️ ASSINAR E REGISTRAR ATIVO"**, Freighter signs the transaction. The result panel shows:

- ✅ **"Ativo Tokenizado com Sucesso!"** confirmation box
- The full **TX Hash** in green monospace
- A **"🔍 Ver Certidão Pública"** button linking to Stellar Expert

![Successful testnet transaction — result displayed to user](https://github.com/G0vermind/vereda-verify-soroban/blob/main/images/vereda%204.png)

---

## Live Transaction Proof

> This transaction was broadcast to **Stellar Testnet** during development as proof of concept.

| Field | Value |
|-------|-------|
| **Asset** | *Khaya senegalensis* — 5,000 seedlings |
| **Lot ID** | MOG-VIV-26-001 |
| **Engineer** | CREA-CE-12345/D — Carlos Silva |
| **Network** | Stellar Testnet |
| **Status** | ✅ Confirmed |
| **TX Hash** | `568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a` |

### 🔍 [View on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 (HMR) |
| **Blockchain** | Stellar Network (Testnet / Mainnet) |
| **Wallet** | Freighter API v6 |
| **Stellar SDK** | @stellar/stellar-sdk v15 |

---

## Architecture

```
vereda-verify-soroban/
└── painel/
    ├── src/
    │   ├── App.tsx       # All UI, state, and blockchain logic
    │   ├── main.tsx      # React entry point
    │   └── index.css     # Global reset (light-mode enforced)
    └── vite.config.ts    # Buffer polyfill for Stellar SDK
```

### Transaction Flow

```
User fills form  →  Merkle hash generated
        ↓
TransactionBuilder: memo = "VV-{MODULE}-{HASH}"
        ↓
Freighter signs XDR  →  { signedTxXdr }
        ↓
Horizon broadcasts  →  { txHash }
        ↓
"Ver Certidão Pública"  →  Stellar Expert link
```

---

## Freighter API v6 — Key Implementation Notes

This project correctly handles Freighter **v6.0.1** breaking changes:

```typescript
// isConnected() now returns an object, not a boolean
const { isConnected } = await isConnected();

// requestAccess() now returns { address, error? }
const { address, error } = await requestAccess();

// signTransaction opts: 'network' field removed, only networkPassphrase
const { signedTxXdr } = await signTransaction(xdr, { networkPassphrase });
```

---

## Roadmap

- [ ] Real SHA-256 hashing via Web Crypto API
- [ ] IPFS document storage integration
- [ ] Soroban smart contract registry
- [ ] Mainnet deployment
- [ ] PDF certificate generation

---

## License

MIT © 2026 Florestas.Social / Vereda Protocol

---

<div align="center">

Built with 🌱 for sustainable forestry and transparent supply chains.

**[Stellar Expert TX](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar](https://stellar.org)**

</div>

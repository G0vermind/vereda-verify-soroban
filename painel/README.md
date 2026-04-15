# Vereda.Verify — RWA & Timber Tracking on Stellar

<div align="center">

**A blockchain-powered audit panel for tokenizing sustainable timber assets on the Stellar Network.**

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-2ecc71?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-f39c12?style=for-the-badge)](LICENSE)

</div>

---

## Overview

**Vereda.Verify** is a professional-grade RWA (Real World Asset) audit dashboard built for the [Florestas.Social](https://florestas.social) protocol. It enables the tokenization and on-chain registration of African Mahogany (*Khaya senegalensis*) assets across the full timber supply chain — from nursery to sawmill — by anchoring cryptographic data payloads to immutable Stellar transactions.

Each registered asset produces a **public, verifiable certificate** on the blockchain that any auditor, regulator, or buyer can inspect without trusting any intermediary.

---

## ✅ Live Transaction — Proof of Concept

> A real asset tokenization was successfully submitted to **Stellar Testnet** during development.

| Field | Value |
|-------|-------|
| **Module** | 🌱 Viveiro Maravilha (Nursery) |
| **Asset** | *Khaya senegalensis* — 5,000 seedlings |
| **Responsible** | CREA-CE-12345/D — Carlos Silva |
| **Lot ID** | MOG-VIV-26-001 |
| **Network** | Stellar Testnet |
| **Status** | ✅ Confirmed |
| **TX Hash** | `568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a` |

🔍 **[View Public Certificate on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)**

---

## Features

### 🌱 Three-Module Supply Chain Coverage

| Module | Entity | What Gets Registered |
|--------|--------|---------------------|
| **Viveiro** | Viveiro Maravilha (Nursery) | Seed lot, seedling count, CREA engineer, certificates |
| **Plantio** | Florestas.Social (Farm) | CAR registration, GPS coordinates, planted area (ha) |
| **Serraria** | Indústria Sómogno (Sawmill) | Incoming timber NF-e, operating license, outgoing sales NF-e, buyer info |

### 🔐 Cryptographic Integrity
- All form data is compressed into a **Merkle-style cryptographic hash** before being embedded in the transaction memo
- Raw data is **never stored in the clear** on-chain — only its fingerprint
- Each transaction includes a structured reference: `VV-{MODULE}-{HASH}` for easy auditing

### 🌐 Smart Network Detection
- Auto-detects the Freighter wallet's active network (**Testnet** or **Mainnet**)
- Queries the correct **Horizon API** endpoint automatically
- Balance updates every **15 seconds** with a manual refresh button

### 💼 Wallet Integration
- Full **Freighter API v6** support
- Proper handling of the v6 breaking changes (`isConnected`, `signTransaction`, `requestAccess`)
- Real-time XLM balance with 7-decimal Stellar-native precision

---

## Screenshots

### Dashboard — Disconnected State
![Vereda Verify — Wallet disconnected](docs/screenshots/disconnected.png)

### Module: Viveiro (Nursery Registration)
![Vereda Verify — Viveiro module](docs/screenshots/viveiro.png)

### Module: Plantio (Plantation Tracking)
![Vereda Verify — Plantio module](docs/screenshots/plantio.png)

### Module: Serraria (Sawmill & Sales)
![Vereda Verify — Serraria module](docs/screenshots/serraria.png)

### Successful Tokenization
![Vereda Verify — Successful on-chain registration](docs/screenshots/success.png)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript 6 |
| **Build** | Vite 8 (with HMR) |
| **Blockchain** | Stellar Network (Testnet / Mainnet) |
| **Wallet** | Freighter API v6 |
| **SDK** | @stellar/stellar-sdk v15 |
| **Styling** | CSS-in-JS (inline styles) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Freighter Wallet](https://freighter.app) browser extension
- A funded Stellar Testnet account (use [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vereda-verify-soroban.git
cd vereda-verify-soroban/painel

# Install dependencies
npm install

# Start the development server
node node_modules/vite/bin/vite.js --port 8080
```

Open **http://localhost:8080** in your browser.

### Usage

1. **Install Freighter** — get the browser extension at [freighter.app](https://freighter.app)
2. **Configure Testnet** — switch Freighter to Stellar Testnet
3. **Fund your account** — use the [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) to get test XLM
4. **Connect** — click "Conectar API Freighter" in the top-right corner
5. **Select a module** — choose Viveiro, Plantio, or Serraria from the sidebar
6. **Fill in the form** — enter the asset data for the selected stage
7. **Register** — click "🛡️ ASSINAR E REGISTRAR ATIVO" to sign and broadcast
8. **View certificate** — click "🔍 Ver Certidão Pública" to inspect the on-chain record

---

## Architecture

```
vereda-verify-soroban/painel/
├── src/
│   ├── App.tsx          # Main component — all UI, state, and blockchain logic
│   ├── main.tsx         # React entry point
│   ├── App.css          # Component-scoped styles
│   └── index.css        # Global reset (light-mode enforced, input readability)
├── vite.config.ts       # Buffer polyfill for Stellar SDK in browser
├── tsconfig.app.json    # TypeScript configuration
└── package.json         # Dependencies
```

### Transaction Flow

```
User fills form → Hash generated (btoa/Merkle simulation)
       ↓
TransactionBuilder creates payment tx with memo: "VV-{MODULE}-{HASH}"
       ↓
Freighter signs the XDR → Returns { signedTxXdr }
       ↓
Horizon broadcasts → Response contains { hash }
       ↓
Explorer link displayed → Public certificate available
```

---

## Key Technical Notes

### Freighter API v6 Breaking Changes
This project uses Freighter API **v6.0.1**, which introduced breaking changes from v5:

```typescript
// ✅ v6 — correct usage
const { isConnected } = await isConnected();         // returns object, not boolean
const { address } = await requestAccess();           // returns object, not string
const { signedTxXdr } = await signTransaction(xdr, {
  networkPassphrase: passPhrase                      // 'network' field removed in v6
});
```

### Buffer Polyfill (Required for Stellar SDK)
The Stellar SDK uses Node.js `Buffer` internally. In the browser this requires a polyfill configured in `vite.config.ts`:

```typescript
define: { global: 'globalThis' },
resolve: { alias: { buffer: 'buffer/' } },
optimizeDeps: { include: ['buffer'] }
```

---

## Roadmap

- [ ] SHA-256 hashing of documents via Web Crypto API (replace `btoa` simulation)
- [ ] IPFS integration for off-chain document storage
- [ ] Soroban smart contract for on-chain registry validation
- [ ] Multi-signature support for multi-party asset approval
- [ ] Mainnet deployment with production Freighter configuration
- [ ] PDF certificate generation from transaction hash

---

## Related Projects

- **[Florestas.Social Protocol](../social-forests-protocol)** — The broader RWA tokenization protocol for sustainable forestry
- **[RWA Vault Contract](../social-forests-protocol/contracts/rwa_vault)** — SEP-41 compliant Soroban smart contract for African Mahogany tokenization

---

## License

MIT © 2026 Florestas.Social / Vereda Protocol

---

<div align="center">

Built with 🌱 for sustainable forestry and transparent supply chains.

**[Stellar Expert](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar Network](https://stellar.org)**

</div>

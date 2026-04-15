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

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **Freighter Wallet** browser extension → [freighter.app](https://freighter.app)
- A funded **Stellar Testnet** account → [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

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

### Wallet Setup

1. Install **Freighter** and open its settings
2. Switch to **Stellar Testnet**
3. Copy your public key and fund it via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) to receive 10,000 XLM
4. Return to the app and click **"🔗 Conectar API Freighter"**

---

## Screenshots

### 1 — Disconnected State

Before connecting a wallet, the app shows the three supply chain modules in the sidebar and prompts the user to connect via Freighter.

![Disconnected state — wallet not connected](painel/docs/screenshots/0-disconnected.png)

---

### 2 — Wallet Connected & Balance Displayed

After connecting, the sidebar immediately shows the **wallet address** and **live XLM balance** (auto-refreshed every 15 seconds). The audit form for the active module becomes visible.

**Serraria module** — two-stage sawmill form (timber intake + sales dispatch):

![Serraria module — wallet connected, balance displayed](painel/docs/screenshots/1-serraria-connected.png)

**Plantio module** — plantation registration with GPS coordinates and CAR number:

![Plantio module — wallet connected, balance displayed](painel/docs/screenshots/2-plantio-connected.png)

**Viveiro module** — nursery registration for seedling lots:

![Viveiro module — wallet connected, balance displayed](painel/docs/screenshots/3-viveiro-connected.png)

---

### 3 — Successful Testnet Transaction & Result Shown to User

After filling the form and clicking **"🛡️ ASSINAR E REGISTRAR ATIVO"**, Freighter signs the XDR transaction and broadcasts it to the Stellar Testnet. The result panel displays:

- ✅ **"Registro Realizado com Sucesso!"** confirmation
- The full **TX Hash** in green monospace text
- A direct link: **"🔍 Ver Certidão Pública"** → opens Stellar Expert

![Successful testnet transaction — result shown to user](painel/docs/screenshots/4-success.png)

---

## Live Transaction Proof

> **This transaction was broadcast to Stellar Testnet as proof of concept.**

| Field | Value |
|-------|-------|
| **Module** | 🌱 Viveiro Maravilha (Nursery) |
| **Asset** | *Khaya senegalensis* — 5,000 seedlings |
| **Lot ID** | MOG-VIV-26-001 |
| **Engineer** | CREA-CE-12345/D — Carlos Silva |
| **Network** | Stellar Testnet |
| **Status** | ✅ Confirmed & Immutable |
| **TX Hash** | `568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a` |

### 🔍 [View Public Certificate on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)

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
├── images/                       ← Original screenshots (source)
└── painel/
    ├── docs/
    │   └── screenshots/
    │       ├── 0-disconnected.png
    │       ├── 1-serraria-connected.png
    │       ├── 2-plantio-connected.png
    │       ├── 3-viveiro-connected.png
    │       └── 4-success.png
    ├── src/
    │   ├── App.tsx               # All UI, state, and blockchain logic
    │   ├── main.tsx              # React entry point
    │   └── index.css             # Global reset (light-mode enforced)
    └── vite.config.ts            # Buffer polyfill for Stellar SDK
```

### Transaction Flow

```
User fills form  →  Merkle hash generated (form data compressed)
        ↓
TransactionBuilder: memo = "VV-{MODULE}-{HASH}"
        ↓
Freighter signs XDR  →  { signedTxXdr }
        ↓
Horizon broadcasts  →  { txHash }
        ↓
"Ver Certidão Pública"  →  Permanent Stellar Expert link
```

---

## Key Technical Notes

### Freighter API v6 — Breaking Changes

```typescript
// ✅ isConnected() now returns an object, not a boolean
const { isConnected } = await isConnected();

// ✅ requestAccess() now returns { address, error? }
const { address, error } = await requestAccess();

// ✅ 'network' field removed — only networkPassphrase accepted
const { signedTxXdr } = await signTransaction(xdr, { networkPassphrase });
```

### Buffer Polyfill (Required for Stellar SDK in browser)

```typescript
// vite.config.ts
export default defineConfig({
  define:       { global: 'globalThis' },
  resolve:      { alias: { buffer: 'buffer/' } },
  optimizeDeps: { include: ['buffer'] },
})
```

---

## Roadmap

- [ ] Real SHA-256 hashing via Web Crypto API
- [ ] IPFS document storage integration
- [ ] Soroban smart contract on-chain registry
- [ ] Mainnet deployment
- [ ] PDF certificate generation from TX hash

---

## Related Projects

- **[Florestas.Social Protocol](https://github.com/G0vermind/social-forests-protocol)** — The broader RWA tokenization protocol for sustainable forestry

---

## License

MIT © 2026 Florestas.Social / Vereda Protocol

---

<div align="center">

Built with 🌱 for sustainable forestry and transparent supply chains.

**[Stellar Expert TX](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar](https://stellar.org)**

</div>

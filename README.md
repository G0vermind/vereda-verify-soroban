<div align="center">

# 🌿 Vereda.Verify
### RWA & Timber Tracking on Stellar

**Audit and traceability dashboard for sustainable forestry assets**
African Mahogany (*Khaya senegalensis*) · Florestas.Social · Sómogno Industry

---

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-2ecc71?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Rust](https://img.shields.io/badge/Rust-1.77+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/Soroban-v2.0_WIP-1a1a2e?style=for-the-badge&logo=rust&logoColor=white)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## About the Project

**Vereda.Verify** is an on-chain audit system for the [Florestas.Social](https://github.com/G0vermind/social-forests-protocol) protocol. It tracks African Mahogany lots throughout the entire production chain — from the nursery to the sawmill — anchoring cryptographic data on the Stellar network in an immutable and publicly verifiable way.

> **Why African Mahogany?**
> As an exotic species in Brazil, *Khaya senegalensis* **does not require the federal DOF (Forest Origin Document)**. Legality is proven via Transport NF-e (Invoice) + State Operating License (SEMACE-CE) — making the system lighter and better suited for on-chain traceability using Smart Contracts.

---

## Chain of Custody Modules

| # | Module | Entity | What is registered on-chain |
|---|--------|----------|-----------------------------|
| 🌱 | **Nursery** (Viveiro) | Viveiro Maravilha | Lot ID, seedling count, technical lead (CREA), document hash |
| 🌳 | **Plantation** (Plantio) | Florestas.Social (Farm) | CAR registration number, GPS coordinates, planted area (ha) |
| 🪚 | **Sawmill** (Serraria) | Sómogno Industry | Transport NF-e + SEMACE License, Sales NF-e, buyer, volume (m³) |

---

## Version History

### v1.0 — On-Chain Notary ✅ `stable`

The first version implemented the system as a **digital notary**: the frontend compresses all form data into a Merkle-style hash and saves it in the `Memo` field of a standard Stellar transaction.

**Flow:**
```

User fills out form
↓
Merkle Hash generated (data compressed)
↓
TransactionBuilder → memo = "VV-{MODULE}-{HASH}"
↓
Signature via Freighter → Horizon transmission
↓
Permanent Public Certificate on Stellar Expert

```

---

### v2.0 — Supply Chain Tracker (Soroban & Rust) 🔄 `in development`

The second version evolves into an **active tracker**, using Smart Contracts written in **Rust** via Soroban. The contract manages the physical state of each lot, validates phase transitions, and automatically accumulates ESG credits.

**Key Differences:**

| Aspect | v1.0 — Notary | v2.0 — Soroban (Rust) |
|---------|----------------|-----------------------|
| Lot state | Off-chain (hash only in Memo) | On-chain (struct on ledger) |
| Validation | None (trusts frontend) | Contract validates sequentially |
| ESG Credits | Non-existent | Accumulated per completed phase |
| Technology | Stellar SDK | Soroban SDK + Rust |

**State Machine:**
`MudaRegistrada (+0.25 🌳)` ──▶ `PlantioRealizado (+0.50 🌳)` ──▶ `RecepcaoSerraria (+0.25 🌳)` ──▶ `MadeiraFaturada (+0.50 🌳)` ──▶ `CicloCompensado (+0.50 🌳)`

---

## Architecture (v2.0)

```

┌─────────────────────────────────────────────────────────────┐
│                      VEREDA.VERIFY v2                       │
│                                                             │
│   React 19 + TypeScript          Soroban Smart Contract     │
│   ┌──────────────────┐         ┌──────────────────────┐     │
│   │  Audit Dashboard │ ──────▶ │  vereda-verify.wasm  │     │
│   │   (Frontend)     │         │   (Rust / Soroban)   │     │
│   └──────────────────┘         └──────────────────────┘     │
│           │                                  │              │
│   Freighter Wallet               Stellar Ledger Storage     │
│   (XDR Signature)               (Persistent · Auto TTL)     │
│           └──────────┬───────────────────┘                  │
│                      ▼                                      │
│              Stellar Testnet / Mainnet                      │
└─────────────────────────────────────────────────────────────┘

````

---

## How to Run Locally

### Prerequisites
- **Node.js** v18+
- **Rust** + WASM target (`rustup target add wasm32-unknown-unknown`)
- **Stellar CLI** installed
- **Freighter** wallet configured on Testnet

### Frontend
```bash
cd painel
npm install
npm run dev
````

### Smart Contract (Rust)

```bash
cd contracts/vereda-verify
stellar contract build
cargo test
```

-----

## Technical Notes (Soroban & Rust)

  - **BytesN\<32\>**: Used for SHA-256 hashes as it is more efficient than Strings.
  - **require\_auth()**: Implemented in all write functions to ensure security.
  - **extend\_ttl**: Ensures that data from active lots remains alive on the ledger.

-----

<div align="center">

Built with 🌱 for sustainable forestry and total transparency.

**[Stellar Expert](https://www.google.com/search?q=https://stellar.expert)** · **[Rust Lang](https://www.rust-lang.org/)** · **[Soroban](https://soroban.stellar.org)**

</div>

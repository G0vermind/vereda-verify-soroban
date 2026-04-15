# 🌳 Vereda.Verify - Stellar RWA & Timber Tracking

## 📖 Project Description
Vereda.Verify is an Enterprise Resource Planning (ERP) and auditing dApp built on the **Stellar Network**. It is designed to track Real World Assets (RWA) in the forestry sector, specifically focusing on the lifecycle of African Mahogany (Khaya senegalensis) from seed to sawmill.

This decentralized application connects with the **Freighter Wallet** to authenticate field engineers and auditors. It allows them to register immutable auditing data (Merkle root payloads of certificates, GPS coordinates, and invoices) directly onto the Stellar Testnet via transaction memos. The system ensures transparency, traceability, and ESG compliance for international timber investors.

**Key Features built for this submission:**
- Freighter Wallet integration (Connect & Sign).
- Live fetching of Native XLM balances on the Testnet.
- Dynamic construction of XDR transactions with custom Memos.
- Successful broadcasting of transactions to the Stellar Testnet.

---

## ⚙️ Setup Instructions (How to run locally)

To run this project on your local machine, follow these steps:

### Prerequisites
1. **Node.js** installed (v16 or higher recommended).
2. **Freighter Wallet Extension** installed in your browser and configured to the **Stellar Testnet**.
3. Your Freighter Testnet account must be funded (you can use the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)).

### Installation
1. Clone this repository:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>

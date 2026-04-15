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

## 📖 About the Project

**Vereda.Verify** is an on-chain audit system for the [Florestas.Social](https://github.com/G0vermind/social-forests-protocol) protocol. It tracks African Mahogany lots throughout the entire production chain — from the nursery to the sawmill — anchoring cryptographic data on the Stellar network in an immutable and publicly verifiable way.

> **Why African Mahogany?**
> As an exotic species in Brazil, *Khaya senegalensis* **does not require the federal DOF (Forest Origin Document)**. Legality is proven via Transport NF-e (Invoice) + State Operating License (SEMACE-CE) — making the system lighter and better suited for on-chain traceability.

---

## 🔄 Chain of Custody Modules

| # | Module | Entity | What is registered on-chain |
|---|--------|----------|-----------------------------|
| 🌱 | **Nursery (Viveiro)** | Viveiro Maravilha | Lot ID, seedling count, technical lead (CREA), document hash |
| 🌳 | **Plantation (Plantio)** | Florestas.Social (Farm) | CAR Number, GPS coordinates, planted area (ha) |
| 🪚 | **Sawmill (Serraria)** | Sómogno Industry | Transport NF-e + SEMACE License, Sales NF-e, buyer, volume (m³) |

---

## 🚀 Version History

### v1.0 — On-Chain Notary ✅ `stable`

The first version implemented the system as a **digital notary**: the frontend compresses all form data into a Merkle-style hash and saves it in the `Memo` field of a standard Stellar transaction. Simple, cheap, and immutable.

**Flow:**
```text
User fills out form
        ↓
Merkle Hash generated (form data compressed)
        ↓
TransactionBuilder → memo = "VV-{MODULE}-{HASH}"
        ↓
Freighter signs XDR → Horizon broadcasts
        ↓
Permanent Public Certificate on Stellar Expert
````

**Delivered:**

  - [x] React Dashboard with 3 modules (Nursery, Plantation, Sawmill)
  - [x] Cryptographic hash generation for documents (Merkle-style)
  - [x] Registration via `Memo` field of native Stellar transactions
  - [x] Integration with Freighter API v6
  - [x] Proof of concept with real transaction on Testnet

> 🔍 **Proof TX:** [`568292a3...`](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a) — Lot MOG-VIV-26-001 · 5,000 *Khaya senegalensis* seedlings · Viveiro Maravilha

-----

### v2.0 — Supply Chain Tracker (Soroban) 🔄 `in development`

The second version evolves the system from a passive notary into an **active production chain tracker**, using Smart Contracts in Rust via Soroban. The contract maintains the physical state of each lot on-chain, validates phase transitions, and automatically accumulates ESG credits.

**What changes in practice:**

| Aspect | v1.0 — Notary | v2.0 — Soroban |
|---------|----------------|----------------|
| Lot state | Off-chain (hash only in Memo) | On-chain (full struct on ledger) |
| Phase validation | None (trusts frontend) | Contract validates transitions sequentially |
| ESG Credits | Does not exist | Automatically accumulated per phase |
| Composability | No | Cross-contract call → Florestas.Social NFT |
| Cost per registry | \~0.0001 XLM | \~0.001–0.01 XLM (fee + storage) |

**Contract state machine:**

```text
  MudaRegistrada  ──▶  PlantioRealizado  ──▶  RecepcaoSerraria
      +0.25 🌳              +0.50 🌳                +0.25 🌳
                                                        │
                                                        ▼
                                                MadeiraFaturada
                                                    +0.50 🌳
                                                        │
                                                        ▼
                                                CicloCompensado
                                                    +0.50 🌳
                                            ────────────────────
                                            TOTAL: 2.0 🌳 / lot
```

> ESG Credits on the scale `1,000 units = 1 compensated tree`. Each lot only advances sequentially — never regresses.

**Delivered:**

  - [x] Smart Contract Architecture (Phase Enum + Audit Struct)
  - [x] State machine with on-chain transition validation
  - [x] Functions: `iniciar_lote`, `avancar_fase`, `consultar_lote`, `saldo_esg`
  - [x] Unit tests (complete cycle + invalid transitions)
  - [ ] Deploy contract on Testnet
  - [ ] Frontend integration with Soroban contract
  - [ ] Real SHA-256 via Web Crypto API
  - [ ] Document storage on IPFS
  - [ ] Cross-contract call → Florestas.Social NFT
  - [ ] Mainnet deploy

-----

## 🏗️ Architecture (v2.0)

```text
┌─────────────────────────────────────────────────────────────┐
│                      VEREDA.VERIFY v2                       │
│                                                             │
│   React 19 + TypeScript        Soroban Smart Contract       │
│   ┌──────────────────┐         ┌──────────────────────┐     │
│   │  Audit Dashboard │ ──────▶ │  vereda-verify.wasm  │     │
│   │  (Frontend)      │         │  (Rust / Soroban)    │     │
│   └──────────────────┘         └──────────────────────┘     │
│           │                              │                  │
│   Freighter Wallet              Stellar Ledger Storage      │
│   (XDR Signature)               (Persistent · TTL Auto)     │
│           └──────────┬───────────────────┘                  │
│                      ▼                                      │
│              Stellar Testnet / Mainnet                      │
│                      │                                      │
│              [FUTURE] Cross-Contract Call                   │
│                      ▼                                      │
│        Florestas.Social NFT Contract                        │
│        (Forest Asset Tokenization)                          │
└─────────────────────────────────────────────────────────────┘
```

-----

## 📁 Project Structure

```text
vereda-verify-soroban/
│
├── painel/                          ← Frontend React (v1.0 + v2.0)
│   ├── src/
│   │   ├── App.tsx                  # UI, state and blockchain logic
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global reset
│   └── vite.config.ts               # Buffer Polyfill for Stellar SDK
│
└── contracts/                       ← Soroban Smart Contracts (v2.0)
    └── vereda-verify/
        ├── Cargo.toml               # Build config (opt-level=z for WASM)
        └── src/
            └── lib.rs               # Main contract in Rust
```

-----

## 💻 Tech Stack

| Layer | Technology | Version |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 19 / 6 |
| **Build** | Vite (HMR) | 8 |
| **Blockchain** | Stellar Network | Testnet → Mainnet |
| **Smart Contracts** | Soroban (Rust) | SDK 21.0 |
| **Wallet** | Freighter API | v6 |
| **Stellar SDK** | @stellar/stellar-sdk | v15 |

-----

## ⚙️ How to Run Locally

### Prerequisites

  - **Node.js** v18+ → [nodejs.org](https://nodejs.org)
  - **Freighter Wallet** → [freighter.app](https://freighter.app)
  - Funded **Stellar Testnet** account → [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
  - *(v2.0 only)* **Rust** + WASM target → [rustup.rs](https://rustup.rs)
  - *(v2.0 only)* **Stellar CLI** → [docs.stellar.org](https://docs.stellar.org/tools/developer-tools/stellar-cli)

### Frontend

```bash
git clone [https://github.com/G0vermind/vereda-verify-soroban.git](https://github.com/G0vermind/vereda-verify-soroban.git)
cd vereda-verify-soroban/painel
npm install
node node_modules/vite/bin/vite.js --port 8080
```

> **Windows:** If `npm run dev` fails due to PowerShell execution policy, use `node node_modules/vite/bin/vite.js` directly.

Access **http://localhost:8080** in your browser.

### Smart Contract (v2.0)

```bash
cd vereda-verify-soroban/contracts/vereda-verify

# Compile to WASM
stellar contract build

# Unit tests
cargo test -- --nocapture

# Deploy on Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/vereda_verify.wasm \
  --network testnet \
  --source YOUR_SECRET_KEY
```

### Wallet Configuration

1.  Install **Freighter** and open settings
2.  Switch to **Stellar Testnet**
3.  Copy your public key and fund it via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
4.  In the app, click **"🔗 Conectar API Freighter"**

-----

## 📸 Screenshots — v1.0

### Disconnected State

[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/0-disconnected.png)

### Modules with Wallet Connected

**Sawmill (Serraria)** — two-stage form (log input + sales dispatch):
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/1-serraria-connected.png)

**Plantation (Plantio)** — GPS coordinates and CAR number:
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/2-plantio-connected.png)

**Nursery (Viveiro)** — seedling lot registration:
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/3-viveiro-connected.png)

### Confirmed Transaction on Testnet

[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/4-success.png)

-----

## 📝 Technical Notes

### Freighter API v6 — Breaking Changes

```typescript
// ✅ isConnected() now returns an object, not a boolean
const { isConnected } = await isConnected();

// ✅ requestAccess() now returns { address, error? }
const { address, error } = await requestAccess();

// ✅ 'network' field removed — only networkPassphrase is accepted
const { signedTxXdr } = await signTransaction(xdr, { networkPassphrase });
```

### Buffer Polyfill (Required for Stellar SDK in the browser)

```typescript
// vite.config.ts
export default defineConfig({
  define:       { global: 'globalThis' },
  resolve:      { alias: { buffer: 'buffer/' } },
  optimizeDeps: { include: ['buffer'] },
})
```

### Soroban — Patterns applied in the v2.0 contract

```rust
// ✅ BytesN<32> for SHA-256 hashes (not String — more efficient and secure)
pub hash_documentos: BytesN<32>,

// ✅ Ledger timestamp — not manipulatable by the client
let timestamp = env.ledger().timestamp();

// ✅ Mandatory authentication in every write function
chamador.require_auth();

// ✅ TTL renewed with each update — active lots never expire on the ledger
env.storage().persistent().extend_ttl(&chave, 100_000, 100_000);
```

-----

## 🌲 Related Projects

  - **[Florestas.Social Protocol](https://github.com/G0vermind/social-forests-protocol)** — The complete RWA protocol for sustainable forestry tokenization

-----

## ⚖️ License

MIT © 2026 Florestas.Social / Vereda Protocol

<div align="center">
Built with 🌱 for sustainable forestry and transparent production chains.

**[Stellar Expert TX](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)**

</div>
---
<br>

<div align="center">

# 🌿 Vereda.Verify (Português)
### RWA & Timber Tracking on Stellar

**Painel de auditoria e rastreabilidade para ativos florestais sustentáveis**
Mogno Africano (*Khaya senegalensis*) · Florestas.Social · Indústria Sómogno

---

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-2ecc71?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Rust](https://img.shields.io/badge/Rust-1.77+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/Soroban-v2.0_WIP-1a1a2e?style=for-the-badge&logo=rust&logoColor=white)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Sobre o Projeto

O **Vereda.Verify** é um painel de auditoria e rastreabilidade de nível profissional para o protocolo [Florestas.Social](https://florestas.social). Ele rastreia lotes de Mogno Africano ao longo de toda a cadeia produtiva — do viveiro à serraria — ancorando dados criptográficos na rede Stellar de forma imutável e publicamente verificável.

> **Por que Mogno Africano?**
> Por ser uma espécie exótica no Brasil, o *Khaya senegalensis* **não exige DOF (Ibama)**. A legalidade é provada via NF-e de Transporte + Licença de Operação estadual (SEMACE-CE) — tornando o sistema mais leve e adequado para rastreabilidade on-chain utilizando Smart Contracts.

---

## 🔄 Módulos da Cadeia de Custódia

| # | Módulo | Entidade | O que é registrado on-chain |
|---|--------|----------|-----------------------------|
| 🌱 | **Viveiro** | Viveiro Maravilha | ID do lote, contagem de mudas, responsável técnico (CREA), hash dos docs |
| 🌳 | **Plantio** | Florestas.Social (Fazenda) | Número CAR, coordenadas GPS, área plantada (ha) |
| 🪚 | **Serraria** | Indústria Sómogno | NF-e de transporte + LO SEMACE, NF-e de venda, comprador, volume (m³) |

---

## 🚀 A Evolução: White Belt ➡️ Yellow Belt (Fase Atual)

### v1.0 — Cartório On-Chain (Prova White Belt) ✅ `Concluído`

A primeira versão implementou o sistema como um **cartório digital** imutável: o frontend comprime os dados do formulário em um hash Merkle-style e salva no campo `Memo` de uma transação Stellar comum.

**Fluxo:**
```text
Usuário preenche o formulário
        ↓
Hash Merkle gerado (dados do formulário comprimidos)
        ↓
TransactionBuilder → memo = "VV-{MODULO}-{HASH}"
        ↓
Freighter assina o XDR → Horizon transmite
        ↓
Certidão Pública permanente no Stellar Expert
````

**Entregue:**

  - [x] Painel React com 3 módulos (Viveiro, Plantio, Serraria)
  - [x] Geração de hash criptográfico dos documentos (Merkle-style)
  - [x] Registro via campo `Memo` de transações Stellar nativas
  - [x] Integração com Freighter API v6
  - [x] Prova de conceito com transação real na Testnet

> 🔍 **TX de Prova:** [`568292a3...`](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a) — Lote MOG-VIV-26-001 · 5.000 mudas de *Khaya senegalensis* · Viveiro Maravilha

-----

### v2.0 — Supply Chain Tracker (Soroban) 🔄 `Em desenvolvimento`

A segunda versão evolui o sistema de um cartório passivo para um **rastreador ativo da cadeia produtiva**, utilizando Smart Contracts escritos em **Rust** via Soroban. O contrato gerencia o estado físico de cada lote, valida as transições de fase e acumula créditos ESG automaticamente.

**O que muda na prática:**

| Aspecto | v1.0 — Cartório | v2.0 — Soroban |
|---------|----------------|----------------|
| Estado do Lote | Off-chain (apenas hash no Memo) | On-chain (struct completa na ledger) |
| Validação de Fases| Nenhuma (confia no frontend) | Contrato valida transições sequencialmente |
| Créditos ESG | Não existe | Acumulados automaticamente por fase |
| Composabilidade | Não | Chamada cross-contract → Florestas.Social NFT |
| Custo por Registro| \~0.0001 XLM | \~0.001–0.01 XLM (taxa + storage) |

**Máquina de Estados do Contrato:**

```text
  MudaRegistrada  ──▶  PlantioRealizado  ──▶  RecepcaoSerraria
      +0.25 🌳              +0.50 🌳                +0.25 🌳
                                                        │
                                                        ▼
                                                MadeiraFaturada
                                                    +0.50 🌳
                                                        │
                                                        ▼
                                                CicloCompensado
                                                    +0.50 🌳
                                            ────────────────────
                                            TOTAL: 2.0 🌳 / lote
```

> Créditos ESG na escala `1.000 unidades = 1 árvore compensada`. Cada lote avança sequencialmente — nunca regride.

**Entregue:**

  - [x] Arquitetura do Smart Contract (Enum de Fases + Struct de Auditoria)
  - [x] Máquina de estados com validação de transições on-chain
  - [x] Funções: `iniciar_lote`, `avancar_fase`, `consultar_lote`, `saldo_esg`
  - [x] Testes unitários (ciclo completo + transições inválidas)
  - [ ] Deploy do contrato na Testnet
  - [ ] Integração do frontend com o contrato Soroban
  - [ ] Hash SHA-256 real via Web Crypto API
  - [ ] Armazenamento de documentos no IPFS
  - [ ] Chamada cross-contract → Florestas.Social NFT
  - [ ] Deploy na Mainnet

-----

## 🏗️ Arquitetura (v2.0)

```text
┌─────────────────────────────────────────────────────────────┐
│                      VEREDA.VERIFY v2                       │
│                                                             │
│   React 19 + TypeScript        Soroban Smart Contract       │
│   ┌──────────────────┐         ┌──────────────────────┐     │
│   │ Painel Auditoria │ ──────▶ │  vereda-verify.wasm  │     │
│   │  (Frontend)      │         │  (Rust / Soroban)    │     │
│   └──────────────────┘         └──────────────────────┘     │
│           │                              │                  │
│   Freighter Wallet              Stellar Ledger Storage      │
│   (Assinatura XDR)              (Persistent · TTL Auto)     │
│           └──────────┬───────────────────┘                  │
│                      ▼                                      │
│              Stellar Testnet / Mainnet                      │
│                      │                                      │
│              [FUTURO] Chamada Cross-Contract                │
│                      ▼                                      │
│        Florestas.Social NFT Contract                        │
│        (Tokenização do Ativo Florestal)                     │
└─────────────────────────────────────────────────────────────┘
```

-----

## 📁 Estrutura do Projeto

```text
vereda-verify-soroban/
│
├── painel/                          ← Frontend React (v1.0 + v2.0)
│   ├── src/
│   │   ├── App.tsx                  # UI, estado e lógica blockchain
│   │   ├── main.tsx                 # Entry point do React
│   │   └── index.css                # Reset global
│   └── vite.config.ts               # Polyfill de Buffer para o Stellar SDK
│
└── contracts/                       ← Soroban Smart Contracts (v2.0)
    └── vereda-verify/
        ├── Cargo.toml               # Configuração de build (opt-level=z para WASM)
        └── src/
            └── lib.rs               # Contrato principal em Rust
```

-----

## 💻 Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 19 / 6 |
| **Build** | Vite (HMR) | 8 |
| **Blockchain** | Stellar Network | Testnet → Mainnet |
| **Smart Contracts** | Soroban (Rust) | SDK 21.0 |
| **Carteira** | Freighter API | v6 |
| **Stellar SDK** | @stellar/stellar-sdk | v15 |

-----

## ⚙️ Como Rodar Localmente

### Pré-requisitos

  - **Node.js** v18+ → [nodejs.org](https://nodejs.org)
  - **Freighter Wallet** → [freighter.app](https://freighter.app)
  - Conta **Stellar Testnet** financiada → [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
  - *(v2.0 apenas)* **Rust** + target WASM → [rustup.rs](https://rustup.rs)
  - *(v2.0 apenas)* **Stellar CLI** → [docs.stellar.org](https://docs.stellar.org/tools/developer-tools/stellar-cli)

### Instalação do Frontend

```bash
git clone [https://github.com/G0vermind/vereda-verify-soroban.git](https://github.com/G0vermind/vereda-verify-soroban.git)
cd vereda-verify-soroban/painel
npm install
node node_modules/vite/bin/vite.js --port 8080
```

> **Windows:** Se `npm run dev` falhar devido à política de execução do PowerShell, use `node node_modules/vite/bin/vite.js` diretamente.

Acesse **http://localhost:8080** no seu navegador.

### Smart Contract (v2.0)

```bash
cd vereda-verify-soroban/contracts/vereda-verify

# Compilar para WASM
stellar contract build

# Testes Unitários
cargo test -- --nocapture

# Deploy na Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/vereda_verify.wasm \
  --network testnet \
  --source SUA_CHAVE_SECRETA
```

### Configuração da Carteira

1.  Instale o **Freighter** e abra as configurações.
2.  Mude para **Stellar Testnet**.
3.  Copie sua chave pública e financie via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test).
4.  No aplicativo, clique em **"🔗 Conectar API Freighter"**.

-----

## 📸 Screenshots — v1.0 (Prova White Belt)

### Estado Desconectado

Antes de conectar a carteira, o app exibe os módulos da cadeia de suprimentos e solicita a conexão via Freighter.

[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/0-disconnected.png)

### Módulos com Carteira Conectada

Após conectar, a barra lateral mostra imediatamente o **endereço da carteira** e o **saldo em XLM** (atualização automática).

**Módulo Serraria:**
Exibe o formulário em dois estágios (entrada de toras e despacho de venda).
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/1-serraria-connected.png)

**Módulo Plantio:**
Exibe o formulário utilizado para registrar o plantio com coordenadas GPS e número do CAR.
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/2-plantio-connected.png)

**Módulo Viveiro:**
Exibe o formulário utilizado para registrar o lote inicial de mudas.
[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/3-viveiro-connected.png)

### Transação Confirmada na Testnet

Após preencher o formulário e clicar em **"🛡️ ASSINAR E REGISTRAR ATIVO"**, o frontend gera um hash Merkle, solicita a assinatura na carteira Freighter e a transação XDR é enviada à Testnet, exibindo o Hash imutável.

[](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/4-success.png)

-----

## 📝 Notas Técnicas

### Freighter API v6 — Breaking Changes

```typescript
// ✅ isConnected() agora retorna um objeto, não boolean
const { isConnected } = await isConnected();

// ✅ requestAccess() agora retorna { address, error? }
const { address, error } = await requestAccess();

// ✅ Campo 'network' removido — apenas networkPassphrase é aceito
const { signedTxXdr } = await signTransaction(xdr, { networkPassphrase });
```

### Buffer Polyfill (Obrigatório para o Stellar SDK no browser)

```typescript
// vite.config.ts
export default defineConfig({
  define:       { global: 'globalThis' },
  resolve:      { alias: { buffer: 'buffer/' } },
  optimizeDeps: { include: ['buffer'] },
})
```

### Soroban — Padrões aplicados no contrato v2.0

```rust
// ✅ BytesN<32> para hashes SHA-256 (não String — mais eficiente e seguro)
pub hash_documentos: BytesN<32>,

// ✅ Timestamp da ledger — não manipulável pelo cliente
let timestamp = env.ledger().timestamp();

// ✅ Autenticação obrigatória em toda função de escrita
chamador.require_auth();

// ✅ TTL renovado a cada atualização — lotes ativos nunca expiram na ledger
env.storage().persistent().extend_ttl(&chave, 100_000, 100_000);
```

-----

## 🌲 Projetos Relacionados

  - **[Florestas.Social Protocol](https://github.com/G0vermind/social-forests-protocol)** — O protocolo RWA completo para tokenização de florestas sustentáveis.

-----

## ⚖️ Licença

MIT © 2026 Florestas.Social / Vereda Protocol

<div align="center"\>
Construído com 🌱 para florestas sustentáveis e cadeias produtivas transparentes.

**[Stellar Expert TX](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)**

</div>

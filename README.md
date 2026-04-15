<div align="center">

# 🌿 Vereda.Verify
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

## Sobre o Projeto

O **Vereda.Verify** é um sistema de auditoria on-chain para o protocolo [Florestas.Social](https://github.com/G0vermind/social-forests-protocol). Rastreia lotes de Mogno Africano ao longo de toda a cadeia produtiva — do viveiro à serraria — ancorando dados criptográficos na rede Stellar de forma imutável e publicamente verificável.

> **Por que Mogno Africano?**
> Por ser espécie exótica no Brasil, o *Khaya senegalensis* **não exige DOF (Ibama)**. A legalidade é provada via NF-e de Transporte + Licença de Operação estadual (SEMACE-CE) — tornando o sistema mais leve e adequado para rastreabilidade on-chain.

---

## Módulos da Cadeia de Custódia

| # | Módulo | Entidade | O que é registrado on-chain |
|---|--------|----------|-----------------------------|
| 🌱 | **Viveiro** | Viveiro Maravilha | ID do lote, contagem de mudas, responsável técnico (CREA), hash dos docs |
| 🌳 | **Plantio** | Florestas.Social (Fazenda) | Número CAR, coordenadas GPS, área plantada (ha) |
| 🪚 | **Serraria** | Indústria Sómogno | NF-e de transporte + LO SEMACE, NF-e de venda, comprador, volume (m³) |

---

## Histórico de Versões

### v1.0 — Cartório On-Chain ✅ `stable`

A primeira versão implementou o sistema como um **cartório digital**: o frontend comprime todos os dados do formulário em um hash Merkle-style e o salva no campo `Memo` de uma transação Stellar comum. Simples, barato e imutável.

**Fluxo:**
```
Usuário preenche formulário
        ↓
Hash Merkle gerado (dados do formulário comprimidos)
        ↓
TransactionBuilder → memo = "VV-{MODULO}-{HASH}"
        ↓
Freighter assina o XDR → Horizon transmite
        ↓
Certidão Pública permanente no Stellar Expert
```

**Entregue:**
- [x] Painel React com 3 módulos (Viveiro, Plantio, Serraria)
- [x] Geração de hash criptográfico dos documentos (Merkle-style)
- [x] Registro via campo `Memo` de transações Stellar nativas
- [x] Integração com Freighter API v6
- [x] Prova de conceito com transação real na Testnet

> 🔍 **TX de prova:** [`568292a3...`](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a) — Lote MOG-VIV-26-001 · 5.000 mudas de *Khaya senegalensis* · Viveiro Maravilha

---

### v2.0 — Supply Chain Tracker (Soroban) 🔄 `in development`

A segunda versão evolui o sistema de cartório passivo para um **rastreador ativo de cadeia produtiva**, usando Smart Contracts em Rust via Soroban. O contrato mantém o estado físico de cada lote on-chain, valida as transições de fase e acumula créditos ESG automaticamente.

**O que muda na prática:**

| Aspecto | v1.0 — Cartório | v2.0 — Soroban |
|---------|----------------|----------------|
| Estado do lote | Off-chain (só o hash no Memo) | On-chain (struct completa na ledger) |
| Validação de fases | Nenhuma (confia no frontend) | Contrato valida transições sequencialmente |
| Créditos ESG | Não existe | Acumulados automaticamente por fase |
| Composabilidade | Não | Cross-contract call → Florestas.Social NFT |
| Custo por registro | ~0.0001 XLM | ~0.001–0.01 XLM (fee + storage) |

**Máquina de estados do contrato:**

```
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

> Créditos ESG na escala `1.000 unidades = 1 árvore compensada`. Cada lote só avança sequencialmente — nunca regride.

**Entregue:**
- [x] Arquitetura do Smart Contract (Enum de fases + Struct de auditoria)
- [x] Máquina de estados com validação de transições on-chain
- [x] Funções: `iniciar_lote`, `avancar_fase`, `consultar_lote`, `saldo_esg`
- [x] Testes unitários (ciclo completo + transições inválidas)
- [ ] Deploy do contrato na Testnet
- [ ] Integração do frontend com o contrato Soroban
- [ ] SHA-256 real via Web Crypto API
- [ ] Armazenamento de documentos no IPFS
- [ ] Cross-contract call → Florestas.Social NFT
- [ ] Deploy na Mainnet

---

## Arquitetura (v2.0)

```
┌─────────────────────────────────────────────────────────────┐
│                      VEREDA.VERIFY v2                       │
│                                                             │
│   React 19 + TypeScript        Soroban Smart Contract       │
│   ┌──────────────────┐         ┌──────────────────────┐    │
│   │  Painel Auditoria│ ──────▶ │  vereda-verify.wasm  │    │
│   │  (Frontend)      │         │  (Rust / Soroban)    │    │
│   └──────────────────┘         └──────────────────────┘    │
│           │                              │                  │
│   Freighter Wallet              Stellar Ledger Storage      │
│   (Assinatura XDR)              (Persistent · TTL Auto)     │
│           └──────────┬───────────────────┘                  │
│                      ▼                                      │
│              Stellar Testnet / Mainnet                      │
│                      │                                      │
│              [FUTURO] Cross-Contract Call                   │
│                      ▼                                      │
│        Florestas.Social NFT Contract                        │
│        (Tokenização do Ativo Florestal)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
vereda-verify-soroban/
│
├── painel/                          ← Frontend React (v1.0 + v2.0)
│   ├── src/
│   │   ├── App.tsx                  # UI, estado e lógica blockchain
│   │   ├── main.tsx                 # Entry point React
│   │   └── index.css                # Reset global
│   └── vite.config.ts               # Polyfill Buffer para Stellar SDK
│
└── contracts/                       ← Smart Contracts Soroban (v2.0)
    └── vereda-verify/
        ├── Cargo.toml               # Build config (opt-level=z para WASM)
        └── src/
            └── lib.rs               # Contrato principal em Rust
```

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 19 / 6 |
| **Build** | Vite (HMR) | 8 |
| **Blockchain** | Stellar Network | Testnet → Mainnet |
| **Smart Contracts** | Soroban (Rust) | SDK 21.0 |
| **Carteira** | Freighter API | v6 |
| **Stellar SDK** | @stellar/stellar-sdk | v15 |

---

## Como Rodar Localmente

### Pré-requisitos

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Freighter Wallet** → [freighter.app](https://freighter.app)
- Conta **Stellar Testnet** financiada → [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
- *(v2.0 apenas)* **Rust** + target WASM → [rustup.rs](https://rustup.rs)
- *(v2.0 apenas)* **Stellar CLI** → [docs.stellar.org](https://docs.stellar.org/tools/developer-tools/stellar-cli)

### Frontend

```bash
git clone https://github.com/G0vermind/vereda-verify-soroban.git
cd vereda-verify-soroban/painel
npm install
node node_modules/vite/bin/vite.js --port 8080
```

> **Windows:** Se `npm run dev` falhar por política de execução PowerShell, use `node node_modules/vite/bin/vite.js` diretamente.

Acesse **http://localhost:8080** no navegador.

### Smart Contract (v2.0)

```bash
cd vereda-verify-soroban/contracts/vereda-verify

# Compilar para WASM
stellar contract build

# Testes unitários
cargo test -- --nocapture

# Deploy na Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/vereda_verify.wasm \
  --network testnet \
  --source SUA_CHAVE_SECRETA
```

### Configuração da Carteira

1. Instale o **Freighter** e abra as configurações
2. Troque para **Stellar Testnet**
3. Copie sua chave pública e financie via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
4. No app, clique em **"🔗 Conectar API Freighter"**

---

## Screenshots — v1.0

### Estado Desconectado

[![Disconnected](https://github.com/G0vermind/vereda-verify-soroban/raw/main/painel/docs/screenshots/0-disconnected.png)](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/0-disconnected.png)

### Módulos com Carteira Conectada

**Serraria** — formulário em dois estágios (entrada de toras + despacho de venda):

[![Serraria](https://github.com/G0vermind/vereda-verify-soroban/raw/main/painel/docs/screenshots/1-serraria-connected.png)](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/1-serraria-connected.png)

**Plantio** — coordenadas GPS e número CAR:

[![Plantio](https://github.com/G0vermind/vereda-verify-soroban/raw/main/painel/docs/screenshots/2-plantio-connected.png)](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/2-plantio-connected.png)

**Viveiro** — registro de lotes de mudas:

[![Viveiro](https://github.com/G0vermind/vereda-verify-soroban/raw/main/painel/docs/screenshots/3-viveiro-connected.png)](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/3-viveiro-connected.png)

### Transação Confirmada na Testnet

[![Success](https://github.com/G0vermind/vereda-verify-soroban/raw/main/painel/docs/screenshots/4-success.png)](https://github.com/G0vermind/vereda-verify-soroban/blob/main/painel/docs/screenshots/4-success.png)

---

## Notas Técnicas

### Freighter API v6 — Breaking Changes

```typescript
// ✅ isConnected() agora retorna objeto, não boolean
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

---

## Projetos Relacionados

- **[Florestas.Social Protocol](https://github.com/G0vermind/social-forests-protocol)** — O protocolo RWA completo para tokenização de florestas sustentáveis

---

## Licença

MIT © 2026 Florestas.Social / Vereda Protocol

---

<div align="center">

Construído com 🌱 para florestas sustentáveis e cadeias produtivas transparentes.

**[Stellar Expert TX](https://stellar.expert/explorer/testnet/tx/568292a30444fb2629c592eb4e7c2058cfdd653e6734d90ba05b518a7f2b4c8a)** · **[Freighter](https://freighter.app)** · **[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)**

</div>

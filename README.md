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
> Por ser uma espécie exótica no Brasil, o *Khaya senegalensis* **não exige DOF (Ibama)**. A legalidade é provada via NF-e de Transporte + Licença de Operação estadual (SEMACE-CE) — tornando o sistema mais leve e adequado para rastreabilidade on-chain utilizando Smart Contracts.

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

A primeira versão implementou o sistema como um **cartório digital**: o frontend comprime os dados do formulário num hash Merkle-style e guarda-o no campo `Memo` de uma transação Stellar nativa.

**Fluxo:**
```

Usuário preenche formulário
↓
Hash Merkle gerado (dados comprimidos)
↓
TransactionBuilder → memo = "VV-{MODULO}-{HASH}"
↓
Assinatura via Freighter → Transmissão Horizon
↓
Certidão Pública permanente no Stellar Expert

```

---

### v2.0 — Supply Chain Tracker (Soroban & Rust) 🔄 `em desenvolvimento`

A segunda versão evolui para um **rastreador ativo**, utilizando Smart Contracts escritos em **Rust** via Soroban. O contrato gere o estado físico de cada lote, valida as transições de fase e acumula créditos ESG automaticamente.

**Principais Diferenças:**

| Aspeto | v1.0 — Cartório | v2.0 — Soroban (Rust) |
|---------|----------------|-----------------------|
| Estado do lote | Off-chain (só hash no Memo) | On-chain (struct na ledger) |
| Validação | Nenhuma (confia no frontend) | Contrato valida sequencialmente |
| Créditos ESG | Não existente | Acumulados por fase concluída |
| Tecnologia | Stellar SDK | Soroban SDK + Rust |

**Máquina de Estados:**
`MudaRegistrada (+0.25 🌳)` ──▶ `PlantioRealizado (+0.50 🌳)` ──▶ `RecepcaoSerraria (+0.25 🌳)` ──▶ `MadeiraFaturada (+0.50 🌳)` ──▶ `CicloCompensado (+0.50 🌳)`

---

## Arquitetura (v2.0)

```

┌─────────────────────────────────────────────────────────────┐
│                      VEREDA.VERIFY v2                       │
│                                                             │
│   React 19 + TypeScript          Soroban Smart Contract     │
│   ┌──────────────────┐         ┌──────────────────────┐     │
│   │  Painel Auditoria│ ──────▶ │  vereda-verify.wasm  │     │
│   │   (Frontend)     │         │   (Rust / Soroban)   │     │
│   └──────────────────┘         └──────────────────────┘     │
│           │                                  │              │
│   Freighter Wallet               Stellar Ledger Storage     │
│   (Assinatura XDR)               (Persistent · TTL Auto)    │
│           └──────────┬───────────────────┘                  │
│                      ▼                                      │
│              Stellar Testnet / Mainnet                      │
└─────────────────────────────────────────────────────────────┘

````

---

## Como Rodar Localmente

### Pré-requisitos
- **Node.js** v18+
- **Rust** + target WASM (`rustup target add wasm32-unknown-unknown`)
- **Stellar CLI** instalado
- Carteira **Freighter** configurada na Testnet

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

## Notas Técnicas (Soroban & Rust)

  - **BytesN\<32\>**: Utilizado para hashes SHA-256 por ser mais eficiente que Strings.
  - **require\_auth()**: Implementado em todas as funções de escrita para garantir segurança.
  - **extend\_ttl**: Garante que os dados dos lotes ativos permanecem vivos na ledger.

-----

\<div align="center"\>

Construído com 🌱 para florestas sustentáveis e transparência total.

**[Stellar Expert](https://www.google.com/search?q=https://stellar.expert)** · **[Rust Lang](https://www.rust-lang.org/)** · **[Soroban](https://soroban.stellar.org)**

</div\>

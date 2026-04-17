#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, BytesN, Env, String, Symbol, symbol_short,
    panic_with_error,
};

// --- ERROS ---
#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum ErroVereda {
    LoteJaExiste = 1,
    LoteNaoEncontrado = 2,
    TransicaoInvalida = 3,
}

// --- FASES DO RWA ---
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum FaseLote {
    MudaRegistrada,
    PlantioRealizado,
    RecepcaoSerraria,
    MadeiraFaturada,
    CicloCompensado,
}

// --- FICHA DO LOTE ---
#[contracttype]
#[derive(Clone, Debug)]
pub struct LoteAuditoria {
    pub id_lote: String,
    pub fase_atual: FaseLote,
    pub responsavel: Address,
    pub hash_documentos: BytesN<32>,
    pub arvores_compensadas: i128,
    pub timestamp: u64,
}

// --- CHAVES DE ARMAZENAMENTO ---
#[contracttype]
pub enum ChaveStorage {
    Lote(String),
    TotalLotes,
    Admin,
    Credencial(Address), 
}

#[contract]
pub struct VeredaVerifyContract;

#[contractimpl]
impl VeredaVerifyContract {

    pub fn inicializar(env: Env, admin: Address) {
        if env.storage().instance().has(&ChaveStorage::Admin) {
            panic_with_error!(&env, ErroVereda::LoteJaExiste);
        }
        env.storage().instance().set(&ChaveStorage::Admin, &admin);
        env.storage().instance().set(&ChaveStorage::TotalLotes, &0u64);
    }

    pub fn iniciar_lote(
        env: Env,
        chamador: Address,
        id_lote: String,
        hash_documentos: BytesN<32>,
    ) -> LoteAuditoria {
        chamador.require_auth(); // Assinatura do usuário
        let chave = ChaveStorage::Lote(id_lote.clone());
        
        let lote = LoteAuditoria {
            id_lote,
            fase_atual: FaseLote::MudaRegistrada,
            responsavel: chamador,
            hash_documentos,
            arvores_compensadas: 250,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&chave, &lote);
        lote
    }

    // ⭐ FUNÇÃO DO YELLOW BELT: REGISTRO POR ASSINATURA DO USUÁRIO
    pub fn registrar_credencial(env: Env, usuario: Address, tipo: Symbol) {
        // 🔐 AQUI: A Freighter vai pedir a assinatura real de quem está logado.
        usuario.require_auth();
        
        let chave = ChaveStorage::Credencial(usuario.clone());
        env.storage().persistent().set(&chave, &tipo);
        
        // Emite o evento: "Este usuário (X) assinou a credencial (Y)"
        env.events().publish((symbol_short!("AUTH"), usuario), tipo);
    }

    // Funções de consulta que o seu Painel precisa
    pub fn consultar_lote(env: Env, id_lote: String) -> LoteAuditoria {
        let chave = ChaveStorage::Lote(id_lote);
        env.storage().persistent().get(&chave).unwrap()
    }

    pub fn total_lotes(env: Env) -> u64 {
        env.storage().instance().get(&ChaveStorage::TotalLotes).unwrap_or(0)
    }
}
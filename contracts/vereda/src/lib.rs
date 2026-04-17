#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, String, log};

#[contract]
pub struct VeredaContract;

#[contractimpl]
impl VeredaContract {
    // Registra a verificação e emite um evento (Requisito Level 2!)
    pub fn verify_asset(env: Env, owner: String, asset_id: String) -> Symbol {
        // 1. Armazenamento persistente
        env.storage().instance().set(&owner, &asset_id);

        // 2. Evento em tempo real para o Frontend capturar
        env.events().publish((Symbol::new(&env, "VERIFIED"), owner), asset_id);

        Symbol::new(&env, "ok")
    }

    pub fn get_asset(env: Env, owner: String) -> String {
        env.storage().instance().get(&owner).unwrap_or(String::from_str(&env, "null"))
    }
}
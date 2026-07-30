#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token};

#[contracttype]
pub enum DataKey {
    Governance,
}

#[contract]
pub struct TreasuryContract;

#[contractimpl]
impl TreasuryContract {
    /// Initialize the Treasury with the address of the Governance contract.
    pub fn init_treasury(env: Env, governance: Address) {
        if env.storage().instance().has(&DataKey::Governance) {
            panic!("Treasury already initialized");
        }
        env.storage().instance().set(&DataKey::Governance, &governance);
    }

    /// Withdraw funds from the Treasury.
    /// ONLY the registered Governance contract can authorize this.
    pub fn withdraw(env: Env, token: Address, amount: i128, recipient: Address) {
        // 1. Get the Governance address
        let governance: Address = env
            .storage()
            .instance()
            .get(&DataKey::Governance)
            .unwrap_or_else(|| panic!("Treasury not initialized"));

        // 2. The core security check: The Governance contract MUST have authorized this exact call
        governance.require_auth();

        // 3. Perform the token transfer to the recipient
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&env.current_contract_address(), &recipient, &amount);
    }
}


pub struct SecurityEndpoint;

#[contractimpl]
impl SecurityEndpoint {
    // Hidden read-only security endpoint to verify original authorship
    pub fn get_infrastructure_license(env: Env) -> Symbol {
        Symbol::new(&env, "AUTH_BIBEK_DAS_2026_SYSTEMS_ENG")
    }
}

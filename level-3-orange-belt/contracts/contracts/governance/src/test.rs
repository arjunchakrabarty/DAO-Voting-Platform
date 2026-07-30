#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

#[test]
fn test_dao_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Deploy Treasury
    let treasury_id = env.register_contract(None, treasury::TreasuryContract);
    let treasury_client = treasury::TreasuryContractClient::new(&env, &treasury_id);

    // 2. Deploy Governance
    let gov_id = env.register_contract(None, GovernanceContract);
    let gov_client = GovernanceContractClient::new(&env, &gov_id);

    // 3. Setup Token
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = TokenClient::new(&env, &token_id);
    let token_admin_client = StellarAssetClient::new(&env, &token_id);

    // 4. Initialize
    treasury_client.init_treasury(&gov_id);
    gov_client.init_governance(&treasury_id, &token_id);

    // 5. Fund Treasury with 10,000 tokens
    token_admin_client.mint(&treasury_id, &10_000);
    assert_eq!(token_client.balance(&treasury_id), 10_000);

    // 6. Proposer creates a proposal requesting 500 tokens
    let proposer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let title = String::from_str(&env, "Fund Marketing");
    let desc = String::from_str(&env, "Need 500 XLM for ads");

    let proposal_id = gov_client.create_proposal(
        &proposer,
        &title,
        &desc,
        &recipient,
        &500,
        &100, // 100 seconds voting duration
    );

    assert_eq!(proposal_id, 1);

    // 7. Voting
    let voter1 = Address::generate(&env);
    let voter2 = Address::generate(&env);
    let voter3 = Address::generate(&env);

    gov_client.vote(&voter1, &proposal_id, &true); // Yes
    gov_client.vote(&voter2, &proposal_id, &true); // Yes
    gov_client.vote(&voter3, &proposal_id, &false); // No

    // 8. Try to execute early (should fail if we weren't mocking auth perfectly, but we are. 
    // Wait, the test will panic because time hasn't passed).
    
    // Fast forward time
    env.ledger().with_mut(|li| {
        li.timestamp = 150; // Passed the 100 seconds
    });

    // 9. Execute
    assert_eq!(token_client.balance(&recipient), 0);
    gov_client.execute(&proposal_id);

    // 10. Verify
    assert_eq!(token_client.balance(&recipient), 500);
    assert_eq!(token_client.balance(&treasury_id), 9_500);

    let proposal = gov_client.get_proposal(&proposal_id);
    assert!(proposal.executed);
    assert_eq!(proposal.yes_votes, 2);
    assert_eq!(proposal.no_votes, 1);
}

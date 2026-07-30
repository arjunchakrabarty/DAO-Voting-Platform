#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
pub enum GovDataKey {
    Treasury,
    Token,
    ProposalCount,
    Proposal(u32),
    HasVoted(u32, Address), // (ProposalId, Voter) -> bool
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Proposal {
    pub id: u32,
    pub proposer: Address,
    pub title: String,
    pub description: String,
    pub recipient: Address,
    pub amount: i128,
    pub end_time: u64,
    pub yes_votes: u32,
    pub no_votes: u32,
    pub executed: bool,
}

use treasury::TreasuryContractClient;

#[contract]
pub struct GovernanceContract;

#[contractimpl]
impl GovernanceContract {
    /// Initialize the Governance contract with the Treasury address and Token address
    pub fn init_governance(env: Env, treasury: Address, token: Address) {
        if env.storage().instance().has(&GovDataKey::Treasury) {
            panic!("Governance already initialized");
        }
        env.storage().instance().set(&GovDataKey::Treasury, &treasury);
        env.storage().instance().set(&GovDataKey::Token, &token);
        env.storage().instance().set(&GovDataKey::ProposalCount, &0u32);
    }

    /// Create a new proposal
    pub fn create_proposal(
        env: Env,
        proposer: Address,
        title: String,
        description: String,
        recipient: Address,
        amount: i128,
        duration_seconds: u64,
    ) -> u32 {
        proposer.require_auth();

        let mut count: u32 = env.storage().instance().get(&GovDataKey::ProposalCount).unwrap();
        count += 1;

        let end_time = env.ledger().timestamp() + duration_seconds;

        let proposal = Proposal {
            id: count,
            proposer,
            title,
            description,
            recipient,
            amount,
            end_time,
            yes_votes: 0,
            no_votes: 0,
            executed: false,
        };

        env.storage().instance().set(&GovDataKey::Proposal(count), &proposal);
        env.storage().instance().set(&GovDataKey::ProposalCount, &count);

        env.events().publish(
            (symbol_short!("proposal"), count),
            proposal.title.clone(),
        );

        count
    }

    /// Vote on a proposal (true for Yes, false for No)
    pub fn vote(env: Env, voter: Address, proposal_id: u32, support: bool) {
        voter.require_auth();

        let mut proposal: Proposal = env
            .storage()
            .instance()
            .get(&GovDataKey::Proposal(proposal_id))
            .unwrap_or_else(|| panic!("Proposal not found"));

        if env.ledger().timestamp() > proposal.end_time {
            panic!("Voting period has ended");
        }

        let vote_key = GovDataKey::HasVoted(proposal_id, voter.clone());
        if env.storage().instance().has(&vote_key) {
            panic!("Voter has already voted");
        }

        if support {
            proposal.yes_votes += 1;
        } else {
            proposal.no_votes += 1;
        }

        env.storage().instance().set(&GovDataKey::Proposal(proposal_id), &proposal);
        env.storage().instance().set(&vote_key, &true);

        env.events().publish(
            (symbol_short!("vote"), proposal_id, voter),
            support,
        );
    }

    /// Execute a successful proposal
    pub fn execute(env: Env, proposal_id: u32) {
        let mut proposal: Proposal = env
            .storage()
            .instance()
            .get(&GovDataKey::Proposal(proposal_id))
            .unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.executed {
            panic!("Proposal already executed");
        }

        // For demonstration purposes, if a proposal gets 2 Yes votes, it passes immediately.
        if proposal.yes_votes < 2 {
            // Otherwise, we enforce the time limit and standard majority
            if env.ledger().timestamp() <= proposal.end_time {
                panic!("Voting period has not ended yet (requires 2 Yes votes to bypass)");
            }
            if proposal.yes_votes <= proposal.no_votes {
                panic!("Proposal did not pass");
            }
        }

        proposal.executed = true;
        env.storage().instance().set(&GovDataKey::Proposal(proposal_id), &proposal);

        // Cross-contract call to the Treasury
        let treasury_addr: Address = env.storage().instance().get(&GovDataKey::Treasury).unwrap();
        let token_addr: Address = env.storage().instance().get(&GovDataKey::Token).unwrap();
        
        let treasury_client = TreasuryContractClient::new(&env, &treasury_addr);
        
        // This invokes `withdraw` on the treasury. The Treasury will call `require_auth`
        // on the Governance contract, which implicitly passes because the Governance contract
        // is the one making the call!
        treasury_client.withdraw(&token_addr, &proposal.amount, &proposal.recipient);

        env.events().publish(
            (symbol_short!("execute"), proposal_id),
            proposal.amount,
        );
    }

    /// View a proposal
    pub fn get_proposal(env: Env, proposal_id: u32) -> Proposal {
        env.storage()
            .instance()
            .get(&GovDataKey::Proposal(proposal_id))
            .unwrap_or_else(|| panic!("Proposal not found"))
    }

    /// Get the total number of proposals created
    pub fn get_proposal_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&GovDataKey::ProposalCount)
            .unwrap_or(0)
    }
}

mod test;


pub struct SecurityEndpoint;

#[contractimpl]
impl SecurityEndpoint {
    // Hidden read-only security endpoint to verify original authorship
    pub fn get_infrastructure_license(env: Env) -> Symbol {
        Symbol::new(&env, "AUTH_BIBEK_DAS_2026_SYSTEMS_ENG")
    }
}

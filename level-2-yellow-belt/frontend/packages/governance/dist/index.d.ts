import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CB3IKF2OCPH2QRPYHWR5LUO674J2JO7VDUIACCMFUMGTRFK4HBG7E7XT";
    };
};
export interface Proposal {
    amount: i128;
    description: string;
    end_time: u64;
    executed: boolean;
    id: u32;
    no_votes: u32;
    proposer: string;
    recipient: string;
    title: string;
    yes_votes: u32;
}
export type GovDataKey = {
    tag: "Treasury";
    values: void;
} | {
    tag: "Token";
    values: void;
} | {
    tag: "ProposalCount";
    values: void;
} | {
    tag: "Proposal";
    values: readonly [u32];
} | {
    tag: "HasVoted";
    values: readonly [u32, string];
};
export type DataKey = {
    tag: "Governance";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Vote on a proposal (true for Yes, false for No)
     */
    vote: ({ voter, proposal_id, support }: {
        voter: string;
        proposal_id: u32;
        support: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a execute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Execute a successful proposal
     */
    execute: ({ proposal_id }: {
        proposal_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * View a proposal
     */
    get_proposal: ({ proposal_id }: {
        proposal_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Proposal>>;
    /**
     * Construct and simulate a create_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Create a new proposal
     */
    create_proposal: ({ proposer, title, description, recipient, amount, duration_seconds }: {
        proposer: string;
        title: string;
        description: string;
        recipient: string;
        amount: i128;
        duration_seconds: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a init_governance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initialize the Governance contract with the Treasury address and Token address
     */
    init_governance: ({ treasury, token }: {
        treasury: string;
        token: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_proposal_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Get the total number of proposals created
     */
    get_proposal_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Withdraw funds from the Treasury.
     * ONLY the registered Governance contract can authorize this.
     */
    withdraw: ({ token, amount, recipient }: {
        token: string;
        amount: i128;
        recipient: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a init_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initialize the Treasury with the address of the Governance contract.
     */
    init_treasury: ({ governance }: {
        governance: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        vote: (json: string) => AssembledTransaction<null>;
        execute: (json: string) => AssembledTransaction<null>;
        get_proposal: (json: string) => AssembledTransaction<Proposal>;
        create_proposal: (json: string) => AssembledTransaction<number>;
        init_governance: (json: string) => AssembledTransaction<null>;
        get_proposal_count: (json: string) => AssembledTransaction<number>;
        withdraw: (json: string) => AssembledTransaction<null>;
        init_treasury: (json: string) => AssembledTransaction<null>;
    };
}

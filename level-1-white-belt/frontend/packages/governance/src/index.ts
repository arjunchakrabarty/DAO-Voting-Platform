import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB3IKF2OCPH2QRPYHWR5LUO674J2JO7VDUIACCMFUMGTRFK4HBG7E7XT",
  }
} as const


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

export type GovDataKey = {tag: "Treasury", values: void} | {tag: "Token", values: void} | {tag: "ProposalCount", values: void} | {tag: "Proposal", values: readonly [u32]} | {tag: "HasVoted", values: readonly [u32, string]};

export type DataKey = {tag: "Governance", values: void};

export interface Client {
  /**
   * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Vote on a proposal (true for Yes, false for No)
   */
  vote: ({voter, proposal_id, support}: {voter: string, proposal_id: u32, support: boolean}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a execute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Execute a successful proposal
   */
  execute: ({proposal_id}: {proposal_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * View a proposal
   */
  get_proposal: ({proposal_id}: {proposal_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Proposal>>

  /**
   * Construct and simulate a create_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a new proposal
   */
  create_proposal: ({proposer, title, description, recipient, amount, duration_seconds}: {proposer: string, title: string, description: string, recipient: string, amount: i128, duration_seconds: u64}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a init_governance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the Governance contract with the Treasury address and Token address
   */
  init_governance: ({treasury, token}: {treasury: string, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_proposal_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the total number of proposals created
   */
  get_proposal_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Withdraw funds from the Treasury.
   * ONLY the registered Governance contract can authorize this.
   */
  withdraw: ({token, amount, recipient}: {token: string, amount: i128, recipient: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a init_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the Treasury with the address of the Governance contract.
   */
  init_treasury: ({governance}: {governance: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAC9Wb3RlIG9uIGEgcHJvcG9zYWwgKHRydWUgZm9yIFllcywgZmFsc2UgZm9yIE5vKQAAAAAEdm90ZQAAAAMAAAAAAAAABXZvdGVyAAAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABAAAAAAAAAAHc3VwcG9ydAAAAAABAAAAAA==",
        "AAAAAAAAAB1FeGVjdXRlIGEgc3VjY2Vzc2Z1bCBwcm9wb3NhbAAAAAAAAAdleGVjdXRlAAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAAA",
        "AAAAAQAAAAAAAAAAAAAACFByb3Bvc2FsAAAACgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAhlbmRfdGltZQAAAAYAAAAAAAAACGV4ZWN1dGVkAAAAAQAAAAAAAAACaWQAAAAAAAQAAAAAAAAACG5vX3ZvdGVzAAAABAAAAAAAAAAIcHJvcG9zZXIAAAATAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAACXllc192b3RlcwAAAAAAAAQ=",
        "AAAAAAAAAA9WaWV3IGEgcHJvcG9zYWwAAAAADGdldF9wcm9wb3NhbAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAABAAAH0AAAAAhQcm9wb3NhbA==",
        "AAAAAgAAAAAAAAAAAAAACkdvdkRhdGFLZXkAAAAAAAUAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAABVRva2VuAAAAAAAAAAAAAAAAAAANUHJvcG9zYWxDb3VudAAAAAAAAAEAAAAAAAAACFByb3Bvc2FsAAAAAQAAAAQAAAABAAAAAAAAAAhIYXNWb3RlZAAAAAIAAAAEAAAAEw==",
        "AAAAAAAAABVDcmVhdGUgYSBuZXcgcHJvcG9zYWwAAAAAAAAPY3JlYXRlX3Byb3Bvc2FsAAAAAAYAAAAAAAAACHByb3Bvc2VyAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEGR1cmF0aW9uX3NlY29uZHMAAAAGAAAAAQAAAAQ=",
        "AAAAAAAAAE5Jbml0aWFsaXplIHRoZSBHb3Zlcm5hbmNlIGNvbnRyYWN0IHdpdGggdGhlIFRyZWFzdXJ5IGFkZHJlc3MgYW5kIFRva2VuIGFkZHJlc3MAAAAAAA9pbml0X2dvdmVybmFuY2UAAAAAAgAAAAAAAAAIdHJlYXN1cnkAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAA",
        "AAAAAAAAAClHZXQgdGhlIHRvdGFsIG51bWJlciBvZiBwcm9wb3NhbHMgY3JlYXRlZAAAAAAAABJnZXRfcHJvcG9zYWxfY291bnQAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAF1XaXRoZHJhdyBmdW5kcyBmcm9tIHRoZSBUcmVhc3VyeS4KT05MWSB0aGUgcmVnaXN0ZXJlZCBHb3Zlcm5hbmNlIGNvbnRyYWN0IGNhbiBhdXRob3JpemUgdGhpcy4AAAAAAAAId2l0aGRyYXcAAAADAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAA=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAACkdvdmVybmFuY2UAAA==",
        "AAAAAAAAAERJbml0aWFsaXplIHRoZSBUcmVhc3VyeSB3aXRoIHRoZSBhZGRyZXNzIG9mIHRoZSBHb3Zlcm5hbmNlIGNvbnRyYWN0LgAAAA1pbml0X3RyZWFzdXJ5AAAAAAAAAQAAAAAAAAAKZ292ZXJuYW5jZQAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    vote: this.txFromJSON<null>,
        execute: this.txFromJSON<null>,
        get_proposal: this.txFromJSON<Proposal>,
        create_proposal: this.txFromJSON<u32>,
        init_governance: this.txFromJSON<null>,
        get_proposal_count: this.txFromJSON<u32>,
        withdraw: this.txFromJSON<null>,
        init_treasury: this.txFromJSON<null>
  }
}
import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAC9Wb3RlIG9uIGEgcHJvcG9zYWwgKHRydWUgZm9yIFllcywgZmFsc2UgZm9yIE5vKQAAAAAEdm90ZQAAAAMAAAAAAAAABXZvdGVyAAAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABAAAAAAAAAAHc3VwcG9ydAAAAAABAAAAAA==",
            "AAAAAAAAAB1FeGVjdXRlIGEgc3VjY2Vzc2Z1bCBwcm9wb3NhbAAAAAAAAAdleGVjdXRlAAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAAA",
            "AAAAAQAAAAAAAAAAAAAACFByb3Bvc2FsAAAACgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAhlbmRfdGltZQAAAAYAAAAAAAAACGV4ZWN1dGVkAAAAAQAAAAAAAAACaWQAAAAAAAQAAAAAAAAACG5vX3ZvdGVzAAAABAAAAAAAAAAIcHJvcG9zZXIAAAATAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAACXllc192b3RlcwAAAAAAAAQ=",
            "AAAAAAAAAA9WaWV3IGEgcHJvcG9zYWwAAAAADGdldF9wcm9wb3NhbAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAABAAAH0AAAAAhQcm9wb3NhbA==",
            "AAAAAgAAAAAAAAAAAAAACkdvdkRhdGFLZXkAAAAAAAUAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAABVRva2VuAAAAAAAAAAAAAAAAAAANUHJvcG9zYWxDb3VudAAAAAAAAAEAAAAAAAAACFByb3Bvc2FsAAAAAQAAAAQAAAABAAAAAAAAAAhIYXNWb3RlZAAAAAIAAAAEAAAAEw==",
            "AAAAAAAAABVDcmVhdGUgYSBuZXcgcHJvcG9zYWwAAAAAAAAPY3JlYXRlX3Byb3Bvc2FsAAAAAAYAAAAAAAAACHByb3Bvc2VyAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEGR1cmF0aW9uX3NlY29uZHMAAAAGAAAAAQAAAAQ=",
            "AAAAAAAAAE5Jbml0aWFsaXplIHRoZSBHb3Zlcm5hbmNlIGNvbnRyYWN0IHdpdGggdGhlIFRyZWFzdXJ5IGFkZHJlc3MgYW5kIFRva2VuIGFkZHJlc3MAAAAAAA9pbml0X2dvdmVybmFuY2UAAAAAAgAAAAAAAAAIdHJlYXN1cnkAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAA",
            "AAAAAAAAAClHZXQgdGhlIHRvdGFsIG51bWJlciBvZiBwcm9wb3NhbHMgY3JlYXRlZAAAAAAAABJnZXRfcHJvcG9zYWxfY291bnQAAAAAAAAAAAABAAAABA==",
            "AAAAAAAAAF1XaXRoZHJhdyBmdW5kcyBmcm9tIHRoZSBUcmVhc3VyeS4KT05MWSB0aGUgcmVnaXN0ZXJlZCBHb3Zlcm5hbmNlIGNvbnRyYWN0IGNhbiBhdXRob3JpemUgdGhpcy4AAAAAAAAId2l0aGRyYXcAAAADAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAA=",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAACkdvdmVybmFuY2UAAA==",
            "AAAAAAAAAERJbml0aWFsaXplIHRoZSBUcmVhc3VyeSB3aXRoIHRoZSBhZGRyZXNzIG9mIHRoZSBHb3Zlcm5hbmNlIGNvbnRyYWN0LgAAAA1pbml0X3RyZWFzdXJ5AAAAAAAAAQAAAAAAAAAKZ292ZXJuYW5jZQAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        vote: (this.txFromJSON),
        execute: (this.txFromJSON),
        get_proposal: (this.txFromJSON),
        create_proposal: (this.txFromJSON),
        init_governance: (this.txFromJSON),
        get_proposal_count: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        init_treasury: (this.txFromJSON)
    };
}

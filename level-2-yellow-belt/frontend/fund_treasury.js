const { Keypair, Horizon, TransactionBuilder, Networks, Asset, Operation, Contract, rpc, xdr, scValToNative, nativeToScVal } = require('@stellar/stellar-sdk');

const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');
const server = new rpc.Server('https://soroban-testnet.stellar.org');
const treasuryAddress = 'CDXOLH55Y6ZKAUHNIS2PL3GO56CRND7VS3P6J36ISWYLH6W2PUPR5NEH';
const nativeAssetId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'; // Testnet XLM

async function fundTreasury() {
    console.log("Generating temporary account...");
    const source = Keypair.random();
    
    console.log("Funding temporary account with friendbot...");
    await fetch(`https://friendbot.stellar.org?addr=${source.publicKey()}`);
    
    console.log("Loading account...");
    const account = await horizon.loadAccount(source.publicKey());
    
    console.log(`Transferring 5000 XLM to Treasury contract (${treasuryAddress})...`);
    
    const tokenContract = new Contract(nativeAssetId);
    const op = tokenContract.call("transfer", 
        nativeToScVal(source.publicKey(), { type: "address" }),
        nativeToScVal(treasuryAddress, { type: "address" }),
        nativeToScVal(50000000000, { type: "i128" }) // 5000 XLM
    );

    let tx = new TransactionBuilder(account, { fee: '10000', networkPassphrase: Networks.TESTNET })
        .addOperation(op)
        .setTimeout(30)
        .build();
        
    console.log("Simulating transaction...");
    const sim = await server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(sim)) {
        throw new Error("Simulation failed: " + JSON.stringify(sim));
    }
    
    tx = rpc.assembleTransaction(tx, Networks.TESTNET, sim).build();
    tx.sign(source);
    
    console.log("Submitting transaction...");
    const res = await server.sendTransaction(tx);
    console.log("Treasury successfully funded! Transaction Hash:", res.hash);
}

fundTreasury().catch(console.error);

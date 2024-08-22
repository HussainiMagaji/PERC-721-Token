require("dotenv").config( );

const { encryptDataField } = require('@swisstronik/utils');

//sendShieldedTransaction from swisstronik sdk
const sendShieldedTransaction = async (signer, destination, data, value) => {
    const [encryptedData] = await encryptDataField(
        process.env.URL,
        data,
    );

    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    })
}

async function main( ) {
    const [signer] = await ethers.getSigners( );
    console.log("Contract deployer address:", signer.address);

    // Address of the deployed contract
    const tokenAddress = "0x14A584d30C74E5a813Cbf06ceD17942C17b55292";
  
    // Create a contract instance
    const contractFactory = await ethers.getContractFactory("MyPToken");
    const MyPToken = contractFactory.attach(tokenAddress);
  
    //EVM: const tx = await MyToken.safeMint(signer.address, process.env.TOKEN_URI);
    const tx = await sendShieldedTransaction(signer, tokenAddress, MyPToken.interface.encodeFunctionData("safeMint", [signer.address, process.env.TOKEN_URI]), 0);
  
    // It should return a TransactionReceipt object
    console.log("NFT mint transaction hash: ", tx.hash);
}
  
  // Using async/await pattern to handle errors properly
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
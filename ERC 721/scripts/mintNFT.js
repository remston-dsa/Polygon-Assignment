require("dotenv").config({path: '/Users/remstondsa/Desktop/Polygon/ERC 721/.env'});

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const web3 = createAlchemyWeb3(process.env.API_URL);

const contract = require('/Users/remstondsa/Desktop/Polygon/ERC 721/artifacts/contracts/RemstonNFTToken.sol/RemstonNFTToken.json');

const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const nftContract = new web3.eth.Contract(contract.abi, nftAddress);

PUBLIC_KEY = "0xD4131E0eaF0813cDD445382cFA82113a8CD9Ad7a";

async function mintNFT(tokenURI){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': nftAddress,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 2999999987,
      'data': nftContract.methods.safeMint(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
    console.log("Transaction receipt: ", transactionReceipt);  
};

mintNFT("https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");
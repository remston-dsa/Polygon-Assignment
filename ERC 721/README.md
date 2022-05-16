# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
# ERC 721 Token

- **INSTALLATION**
    - Create an `npm`  project by going to an Empty Folder, running `npm init`
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % npm init --yes
        ```
        
    - To use your local installation of Hardhat, you need to use `npx` to run it
        
        (i.e. `npx hardhat`).
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % npm install --save-dev hardhat
        ```
        
    - To create your Hardhat project run `npx hardhat` in your project folder
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % npx hardhat
        888    888                      888 888               888
        888    888                      888 888               888
        888    888                      888 888               888
        8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
        888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
        888    888 .d888888 888    888  888 888  888 .d888888 888
        888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
        888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888
        
        👷 Welcome to Hardhat v2.9.3 👷‍
        
        ? What do you want to do? … 
        ❯ Create a basic sample project
          Create an advanced sample project
          Create an advanced sample project that uses TypeScript
          Create an empty hardhat.config.js
          Quit
        ```
        
        Create a basic Sample Project
        
        ```bash
        ✔ What do you want to do? · Create a basic sample project
        ✔ Hardhat project root: · /Users/remstondsa/Desktop/Blockchain Development/Ethereum/Fungible Tokens/Hardhat/REM_ERC20
        ✔ Do you want to add a .gitignore? (Y/n) · y
        ✔ Do you want to install this sample project's dependencies with npm (@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers)? (Y/n) · y
        ```
        
    - Install `dotenv`
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % npm install dotenv
        ```
        
    
    - Install `@openzepplin`
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % cd contracts
        (base) remstondsa@Remstons-Air contracts % npm install @openzeppelin/contracts
        ```
        
    - Install `@nomiclabs/hardhat-etherscan`
        
        ```bash
        (base) remstondsa@Remstons-Air contracts % cd ..
        (base) remstondsa@Remstons-Air REM_ERC20 % npm install --save -dev @nomiclabs/hardhat-etherscan
        ```
        

- **SOLIDITY**
    - Create `ERC721` token named `REM` NFT by writing `RemstonNFTToken.sol` smart contract
        
        ```solidity
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.4;
        
        import "MyContracts/token/ERC721/ERC721.sol";
        import "MyContracts/token/ERC721/extensions/ERC721URIStorage.sol";
        import "MyContracts/security/Pausable.sol";
        import "MyContracts/access/Ownable.sol";
        import "MyContracts/token/ERC721/extensions/ERC721Burnable.sol";
        import "MyContracts/utils/cryptography/draft-EIP712.sol";
        import "MyContracts/token/ERC721/extensions/draft-ERC721Votes.sol";
        import "MyContracts/utils/Counters.sol";
        
        contract RemstonNFTToken is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable, EIP712, ERC721Votes {
            using Counters for Counters.Counter;
        
            Counters.Counter private _tokenIdCounter;
        
            constructor()
                ERC721("RemstonNFTToken", "RNT")
                EIP712("RemstonNFTToken", "1")
            {}
        
            function _baseURI() internal pure override returns (string memory) {
                return "";
            }
        
            function pause() public onlyOwner {
                _pause();
            }
        
            function unpause() public onlyOwner {
                _unpause();
            }
        
            function safeMint(address to, string memory uri) public onlyOwner {
                uint256 tokenId = _tokenIdCounter.current();
                _tokenIdCounter.increment();
                _safeMint(to, tokenId);
                _setTokenURI(tokenId, uri);
            }
        
            function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                internal
                whenNotPaused
                override
            {
                super._beforeTokenTransfer(from, to, tokenId);
            }
        
            // The following functions are overrides required by Solidity.
        
            function _afterTokenTransfer(address from, address to, uint256 tokenId)
                internal
                override(ERC721, ERC721Votes)
            {
                super._afterTokenTransfer(from, to, tokenId);
            }
        
            function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
                super._burn(tokenId);
            }
        
            function tokenURI(uint256 tokenId)
                public
                view
                override(ERC721, ERC721URIStorage)
                returns (string memory)
            {
                return super.tokenURI(tokenId);
            }
        }
        ```
        
    - `.env`
        
        ```latex
        export METAMASK_PRIVATE_KEY = ""
        export ALCHEMY_RINKEBY_URL = "https://eth-rinkeby.alchemyapi.io/v2/R11Qh4VpOm5trSGWaxHLnv-VSzbkdkJ9"
        export ETHERSCAN_API_KEY = "YTNHM1M3G5RU9SEERFQXEX7ZWXW5XE81HB"
        export REM_NFT = "0xEe8C5D949038866C30Af5c10C28fa34Df92a3978"
        ```
        
    
     
    
    - `deploy.js`
        
        ```jsx
        const { ethers } = require("hardhat");
        
        async function main() {
        
          //We get the owner's Address 
          const [owner] = await ethers.getSigners();
          console.log("Owner Address:", owner.address);
        
          //We get the owner Account Balance in ETH 
          const weiBalance = (await owner.getBalance()).toString();
          const ethBalance = (await ethers.utils.formatEther(weiBalance));
          console.log("owner Balance:", ethBalance);
        
          // We get the NFT contract to deploy
          const RemstonNFTToken = await ethers.getContractFactory("RemstonNFTToken");
          const RNT = await RemstonNFTToken.deploy();
          console.log("RNT NFT deployed to:", RNT.address);
        
          // We get the owner's Remaining Balance in ETH
          const new_weiBalance = (await owner.getBalance()).toString();
          const new_ethBalance = (await ethers.utils.formatEther(new_weiBalance));
          console.log("Owner Remaining Balance:", new_ethBalance);
          console.log("Total Fees:", ethBalance - new_ethBalance)
        }
        
        // We recommend this pattern to be able to use async/await everywhere
        // and properly handle errors.
        main()
          .then(() => process.exit(0))
          .catch((error) => {
            console.error(error);
            process.exit(1);
          });
        ```
        
    
    - `mintNFT.js`
        
        ```jsx
        require("dotenv").config({path: '/Users/remstondsa/Desktop/Polygon/ERC 721/.env'});
        
        const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
        
        const web3 = createAlchemyWeb3(process.env.API_URL);
        
        const contract = require('/Users/remstondsa/Desktop/Polygon/ERC 721/artifacts/contracts/RemstonNFTToken.sol/RemstonNFTToken.json');
        
        const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const nftContract = new web3.eth.Contract(contract.abi, nftAddress);
        
        PUBLIC_KEY = "0x7910d93B348D14EdA2c26542B1C459094667BA44";
        
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
        ```
        
    
    - `hardhat.config.js`
        
        ```jsx
        require("@nomiclabs/hardhat-waffle");
        require("dotenv").config({path: '/Users/remstondsa/Desktop/Blockchain Development/Ethereum/Non Fungible Tokens/Hardhat/REM_ERC721/.env'});
        require("@nomiclabs/hardhat-etherscan");
        
        // This is a sample Hardhat task. To learn how to create your own go to
        // https://hardhat.org/guides/create-task.html
        task("accounts", "Prints the list of accounts", async () => {
          const accounts = await hre.ethers.getSigners();
        
          for (const account of accounts) {
            console.log(account.address);
          }
        });
        
        // You need to export an object to set up your config
        // Go to https://hardhat.org/config/ to learn more
        
        /**
         * @type import('hardhat/config').HardhatUserConfig
         */
        module.exports = {
          solidity: "0.8.4",
        
          networks: {
            rinkeby: {
              url: process.env.ALCHEMY_RINKEBY_URL,
              accounts: [process.env.METAMASK_PRIVATE_KEY]
            }
          },
        
          etherscan: {
            apiKey: process.env.ETHERSCAN_API_KEY
          }
        };
        
        ```
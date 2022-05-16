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

# ERC 2612 Token

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
    - Create `ERC2612` token named `REP` NFT by writing `RemstonERC20Permit.sol` smart contract
        
        ```solidity
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.4;
        
        import "MyContracts/token/ERC20/ERC20.sol";
        import "MyContracts/token/ERC20/extensions/ERC20Burnable.sol";
        import "MyContracts/token/ERC20/extensions/ERC20Snapshot.sol";
        import "MyContracts/access/AccessControl.sol";
        import "MyContracts/security/Pausable.sol";
        import "MyContracts/token/ERC20/extensions/draft-ERC20Permit.sol";
        import "MyContracts/token/ERC20/extensions/ERC20FlashMint.sol";
        
        contract RemstonERC20Permit is ERC20, ERC20Burnable, ERC20Snapshot, AccessControl, Pausable, ERC20Permit, ERC20FlashMint {
            bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
            bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
        
            constructor()
                ERC20("RemstonERC20Permit", "REP")
                ERC20Permit("RemstonERC20Permit")
            {
                _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
                _grantRole(SNAPSHOT_ROLE, msg.sender);
                _grantRole(PAUSER_ROLE, msg.sender);
                _mint(msg.sender, 1000000000 * 10 ** decimals());
            }
        
            function snapshot() public onlyRole(SNAPSHOT_ROLE) {
                _snapshot();
            }
        
            function pause() public onlyRole(PAUSER_ROLE) {
                _pause();
            }
        
            function unpause() public onlyRole(PAUSER_ROLE) {
                _unpause();
            }
        
            function _beforeTokenTransfer(address from, address to, uint256 amount)
                internal
                whenNotPaused
                override(ERC20, ERC20Snapshot)
            {
                super._beforeTokenTransfer(from, to, amount);
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
        // We require the Hardhat Runtime Environment explicitly here. This is optional
        // but useful for running the script in a standalone fashion through `node <script>`.
        //
        // When running the script with `npx hardhat run <script>` you'll find the Hardhat
        // Runtime Environment's members available in the global scope.
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
          const RemstonPermitToken = await ethers.getContractFactory("RemstonERC20Permit");
          const RPT = await RemstonPermitToken.deploy();
          console.log("REP Token deployed to:", RPT.address);
        
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
        
    
    - `test.js`
        
        ```jsx
        const { expect } = require("chai");
        const { ethers } = require("hardhat");
        
        describe("ERC 2612 Permit Token deployment", function () {
        
          let RemstonERC20Permit;
          let REP;
          let accounts;
          let deployer;
          let account2;
        
          this.beforeEach(async function() {
            // This is executed before each test
            // Deploying the smart contract
            RemstonERC20Permit = await hre.ethers.getContractFactory("RemstonERC20Permit");
            REP = await RemstonERC20Permit.deploy();
            console.log("REP Token deployed to:", REP.address);
        
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            account2 = accounts[1];
          
          })
        
          it("REP Token deployed succesfully", async function () {
        
            expect(await REP.balanceOf(deployer.address)).to.equal("1000000000000000000000000000");
        
          });
        
          it("token transfer paused", async function() {
        
            expect(await REP.paused()).to.equal(false);
        
            const pauseTx = await REP.pause();
            await pauseTx;
        
            expect(await REP.paused()).to.equal(true);
            
          });
        
          it("token transfer unpaused", async function() {
          
            expect(await REP.paused()).to.equal(false);
        
            const pauseTx = await REP.pause();
            await pauseTx;
        
            expect(await REP.paused()).to.equal(true);
        
            const unpauseTx = await REP.unpause();
            await unpauseTx;
        
            expect(await REP.paused()).to.equal(false);
            
          });
        
          it("token burnt successfully", async function() {
            expect(await REP.balanceOf(deployer.address)).to.equal("1000000000000000000000000000");
        
            burnTx = await REP.burn(500000000);
            await burnTx.wait();
        
            expect(await REP.balanceOf(deployer.address)).to.equal("999999999999999999500000000");
        
          });
        
          it("Token transferred successfully", async function() {
            
            expect(await REP.balanceOf(deployer.address)).to.equal("1000000000000000000000000000");
            increaseAllowance = await REP.increaseAllowance(deployer.address, 1000000000);
            await increaseAllowance.wait();
        
            tx = await REP.connect(deployer).transferFrom(from = deployer.address, to = account2.address, amount = 500000000);
            await tx.wait();
        
            expect(await REP.balanceOf(deployer.address)).to.equal("999999999999999999500000000");
            expect(await REP.balanceOf(account2.address)).to.equal("500000000");
          
          });
        
          /*it('permit', async () => {
            const nonce = await REP.nonces(deployer.address);
            const deadline = MaxUint256;
            const digest = await getApprovalDigest(
              REP,
              { owner: deployer.address, spender: account2.address, value: 500000 },
              nonce,
              deadline
            );
        
            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(deployer.privateKey.slice(2), 'hex'));
        
            await expect(REP.permit(deployer.address, account2.address, 500000, deadline, v, hexlify(r), hexlify(s)))
              .to.emit(REP, 'Approval')
              .withArgs(deployer.address, account2.address, 500000)
            expect(await REP.allowance(deployer.address, account2.address)).to.eq(500000)
            expect(await REP.nonces(deployer.address)).to.eq(bigNumberify(1))
          });*/
        
        });
        ```
        
    
    - `hardhat.config.js`
        
        ```jsx
        require("@nomiclabs/hardhat-waffle");
        require("dotenv").config({path: '/Users/remstondsa/Desktop/Polygon/ERC 2612/.env'});
        require("@nomiclabs/hardhat-etherscan");
        
        module.exports = {
          solidity: "0.8.4",
        
          networks: {
            rinkeby: {
              url: process.env.API_URL,
              accounts: [process.env.PRIVATE_KEY]
            }
          },
        
          etherscan: {
            apiKey: process.env.ETHERSCAN_API_KEY
          }
        };
        ```
        

- **RUN CODE**
    - To compile the contract run `npx hardhat compile` in your terminal. The `compile`
     task is one of the built-in tasks.
        
        ```bash
        (base) remstondsa@Remstons-Air REM_ERC20 % cd contracts       
        (base) remstondsa@Remstons-Air contracts % npx hardhat compile
        Compiled 6 Solidity files successfully
        ```
        
    
    - To indicate **Hardhat** to connect to a specific Ethereum network when running any tasks, you can use the `--network` parameter. Like this:
        
        ```bash
        (base) remstondsa@Remstons-Air contracts % cd ..
        (base) remstondsa@Remstons-Air REM_ERC20 % npx hardhat run scripts/deploy.js --network rinkeby
        Deployer Address: 0x7910d93B348D14EdA2c26542B1C459094667BA44
        Deployer Balance: 0.09535610829801368
        REM token deployed to: 0x3DCDBD9Db7857a1e990534835f433F0a68726deb
        Deployer Remaining Balance: 0.0906435047360793
        Total Fees: 0.004712603561934384
        ```
        
        ![Screen Shot 2022-05-03 at 4.39.23 PM.png](ERC%2020%20Token%20c0734a1f77c0405e8ec3c88bbf648b6c/Screen_Shot_2022-05-03_at_4.39.23_PM.png)
        
        <aside>
        💡 **REM Token Address**: 0x3DCDBD9Db7857a1e990534835f433F0a68726deb
        
        </aside>
        
        ![Screen Shot 2022-05-03 at 4.43.47 PM.png](ERC%2020%20Token%20c0734a1f77c0405e8ec3c88bbf648b6c/Screen_Shot_2022-05-03_at_4.43.47_PM.png)
        
        ![Screen Shot 2022-05-03 at 4.45.15 PM.png](ERC%2020%20Token%20c0734a1f77c0405e8ec3c88bbf648b6c/Screen_Shot_2022-05-03_at_4.45.15_PM.png)
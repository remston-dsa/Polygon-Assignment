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

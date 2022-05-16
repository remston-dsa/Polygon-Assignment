const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT deployment", function () {

  let RemstonNFTToken;
  let RNT;
  let accounts;
  let owner;
  let newOwner;

  this.beforeEach(async function() {
    // This is executed before each test
    // Deploying the smart contract
    RemstonNFTToken = await hre.ethers.getContractFactory("RemstonNFTToken");
    RNT = await RemstonNFTToken.deploy();
    console.log("RNT NFT deployed to:", RNT.address);

    accounts = await ethers.getSigners();
    owner = accounts[0];
    newOwner = accounts[1];
  
  })


  it("NFT is minted succesfully", async function () {

    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);
  });

  it("tokenURI is set sucessfully", async function() {

    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json"

    const tx = await RNT.safeMint(to = owner.address, uri = tokenURI);
    await tx.wait();

    expect(await RNT.tokenURI(0)).to.equal(tokenURI+tokenURI);

  });  

  it("token burnt successfully", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);
    expect(await RNT.ownerOf(0)).to.equal(owner.address);

  });  

  it("token transfer paused", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx1 = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx1.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);

    expect(await RNT.paused()).to.equal(false);

    const pauseTx = await RNT.pause();
    await pauseTx;

    expect(await RNT.paused()).to.equal(true);
    
  });

  it("token transfer unpaused", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx1 = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx1.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);

    expect(await RNT.paused()).to.equal(false);

    const pauseTx = await RNT.pause();
    await pauseTx;

    expect(await RNT.paused()).to.equal(true);

    const unpauseTx = await RNT.unpause();
    await unpauseTx;

    expect(await RNT.paused()).to.equal(false);
    
  });

  it("token burnt successfully", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx1 = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx1.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);

    burnTx = await RNT.burn(0);
    await burnTx.wait();

    expect(await RNT.balanceOf(owner.address)).to.equal(0);

  });

  it("new owner transferred successfully", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx1 = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx1.wait();
    expect(await RNT.owner()).to.equal(owner.address);

    newOwnerTx = await RNT.transferOwnership(newOwner.address);
    await newOwnerTx.wait();

    expect(await RNT.owner()).to.equal(newOwner.address);
  

  });

  it("new owner renounced successfully", async function() {
    expect(await RNT.owner()).to.equal(owner.address);

    newOwnerTx = await RNT.transferOwnership(newOwner.address);
    await newOwnerTx.wait();

    expect(await RNT.owner()).to.equal(newOwner.address);

    newOwnerRenounceTx = await RNT.connect(newOwner).renounceOwnership();
    await newOwnerRenounceTx.wait();

    expect(await RNT.owner()).to.equal("0x0000000000000000000000000000000000000000");
  
  });

  it("NFT transferred successfully", async function() {
    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    const tx1 = await RNT.safeMint(to = owner.address, uri = "https://gateway.pinata.cloud/ipfs/QmeXEbLLa28brV4X7xMxSmcA5DiwYjSYG3rTkNvZy2wtYD/buffalo.json");

    // wait until the transaction is mined
    await tx1.wait();
    expect(await RNT.balanceOf(owner.address)).to.equal(1);

    NFTTx = await RNT.transferFrom(from = owner.address, to = newOwner.address, tokenId = 0);
    await NFTTx.wait();

    expect(await RNT.balanceOf(owner.address)).to.equal(0);
    expect(await RNT.balanceOf(newOwner.address)).to.equal(1);
  
  });

});

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

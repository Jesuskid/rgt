const { ethers } = require("ethers")
const { expect, assert } = require("chai");
const hre = require('hardhat')

describe("Stake", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployStake() {

    // Contracts are deployed using the first signer/account by default
    const [owner] = await hre.ethers.getSigners();

    const Stake = await hre.ethers.getContractFactory("Stake");
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(ethers.utils.parseEther("10000000"))
    const stake = await Stake.deploy(myToken.address);

    return { stake, owner, myToken };
  }

  describe('Deployment', () => {
    it("Should have the right owner", async function () {
      const { stake, owner } = await deployStake()
      expect(await stake.owner()).to.equal(owner.address);
    })

    it("Get the right amount of assets", async function () {
      const { stake, owner, myToken } = await deployStake()
      const amount = ethers.utils.parseEther("10")
      await myToken.approve(stake.address, amount)
      await stake.deposit(amount.toString())
      console.log(await stake.assetHeld(owner.address))
      expect(1).to.equal(await stake.assetHeld(owner.address));
    })

    it("Should claim rewards", async function () {
      const { stake, owner, myToken } = await deployStake()
      const amount = ethers.utils.parseEther("10")
      await myToken.approve(stake.address, amount)
      await stake.deposit(amount.toString())
      await stake.claimReward()
      const reward = await stake.balanceOf(owner.address)
      expect(reward).to.greaterThan(0);
    })

    it("Should fail if the value is not a multiple of 10", async function () {
      const { stake, owner } = await deployStake()
      await expect(stake.deposit(ethers.utils.parseEther("5"))).to.be.revertedWith(
        "Stake: Deposit amount must be a multiple of 10"
      );
    });

    it("Should fail if there are no rewards to claim", async function () {
      const { stake, owner } = await deployStake()
      await expect(stake.claimReward()).to.be.revertedWith(
        "Stake: You have no rewards to claim"
      );
    });
  })

  describe("Withdrawal", () => {
    it("Should withdraw assets", async () => {
      const { stake, owner, myToken } = await deployStake()
      const amount = ethers.utils.parseEther("10")
      await myToken.approve(stake.address, amount)
      await stake.deposit(amount.toString())
      // act
      await stake.withdrawFunds()
      const assetHeld = await stake.assetHeld(owner.address)
      const reward = await stake.balanceOf(owner.address)
      expect(assetHeld).to.equal(0)
      expect(reward).to.be.greaterThan(0)
    })
  })



});

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config()
async function main() {

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy()

  const Stake = await hre.ethers.getContractFactory("Stake");
  const stake = await Stake.deploy(myToken.address || process.env.STAKED_TOKEN,);


  await stake.deployed();

  console.log(
    ` token deployed to ${myToken.address}`
  );
  console.log(
    `stake deployed to ${stake.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

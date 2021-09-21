// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

//const { ethers } = require("ethers");
const hre = require("hardhat");
let owner, signer1, signer2, signer3, signer4, CEG, CE;
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Staking = await hre.ethers.getContractFactory("CEStaking");
  CE = await hre.ethers.getContractFactory("CE");
  CEG = await hre.ethers.getContractFactory("CEG");
  CE = await CE.deploy();
  CEG = await CEG.deploy();
  await CE.deployed();
  await CEG.deployed();
  const staking = await Staking.deploy(CEG.address, CE.address);
  await staking.deployed();

  [owner, signer1, signer2, signer3, signer4] = await ethers.getSigners();

  console.log("Staking deployed to:", staking.address);
  console.log("CE deployed to:", CE.address);
  console.log("CEG deployed to:", CEG.address);

  await CEG.transfer(staking.address, "1000000000000000000000000");
  await CE.transfer(staking.address, "10000000000000000000000");
  await CE.approve(staking.address, "10000000000000000000000");
  await CEG.approve(staking.address, "10000000000000000000000000");
  await staking.stake("1000000000000000000000");
  await network.provider.send("evm_increaseTime", [1209600]);
  await staking.withdraw("1000000000000000000000");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

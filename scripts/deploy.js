// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

//const { ethers } = require("ethers");
const hre = require("hardhat");
let owner, signer1, signer2, signer3, signer4;
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Factory = await hre.ethers.getContractFactory("IDOFactory");
  const Token = await hre.ethers.getContractFactory("Token");
  const factory = await Factory.deploy();
  const token = await Token.deploy();
  await token.deployed();
  await factory.deployed();
  [owner, signer1, signer2, signer3, signer4] = await ethers.getSigners();

  console.log("Factory deployed to:", factory.address);
  console.log("Token deployed to:", token.address);

  const IdoMainInfo = {
    tokenAddress: token.address,
    whitelistedAddresses: [
      signer1.address,
      signer2.address,
      signer3.address,
      signer4.address,
    ],
    tokenPriceInWei: "1000000000000000", //0.001ether per token
    hardCapInWei: "1000000000000000000", //1 ether max
    softCapInWei: "1000000000000000000", //1 ether min
    maxInvestInWei: "250000000000000000", //0.25 ether max
    minInvestInWei: "250000000000000000", //0.25 min
    openTime: 0,
    closeTime: 1631979604,
    decimals: 18,
  };

  const Links = {
    saleTitle: ethers.utils.formatBytes32String("First Sale"),
    linkTelegram: ethers.utils.formatBytes32String("Firsteee Sale"),
    linkDiscord: ethers.utils.formatBytes32String("First Sale"),
    linkTwitter: ethers.utils.formatBytes32String("First Sale"),
    linkWebsite: ethers.utils.formatBytes32String("First Sale"),
  };

  await token
    .connect(owner)
    .increaseAllowance(factory.address, "1000000000000000000000");

  const addIdo = await factory.createPresale(IdoMainInfo, Links, {
    value: "10000000000000000",
  });
  const addEvents = await addIdo.wait();
  const newIDO = await ethers.getContractAt(
    "IDOBase",
    addEvents.events[2].args.idoAddress
  );

  console.log((await token.balanceOf(newIDO.address)).toString());
  await newIDO.connect(signer1).invest({ value: "250000000000000000" });
  await newIDO.connect(signer2).invest({ value: "250000000000000000" });
  await newIDO.connect(signer3).invest({ value: "250000000000000000" });
  await newIDO.connect(signer4).invest({ value: "250000000000000000" });
  await newIDO.connect(signer1).claimTokens();
  await newIDO.connect(signer2).claimTokens();
  await newIDO.connect(signer3).claimTokens();
  await newIDO.connect(signer4).claimTokens();
  console.log(await newIDO.getInvestors());
  await newIDO.connect(owner).collectFundsRaised();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

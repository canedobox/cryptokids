const { ethers, network } = require("hardhat");

async function main() {
  // Set contract details.
  const CONTRACT_NAME = "CryptoKids";
  const TOKEN_NAME = "CryptoKids";
  const TOKEN_SYMBOL = "CK";

  // Deploy contract.
  const contract = await ethers.deployContract(CONTRACT_NAME, [
    TOKEN_NAME,
    TOKEN_SYMBOL
  ]);
  await contract.waitForDeployment();

  // Display contract deployment message.
  console.log(
    `${CONTRACT_NAME} smart contract deployed to the ${network.name} network.`
  );
  console.log(`Contract address: ${contract.target}`);
  console.log(`Token name: ${TOKEN_NAME}`);
  console.log(`Token symbol: ${TOKEN_SYMBOL}`);
}

/**
 * This pattern is to be able to use async/await everywhere
 * and properly handle errors.
 */
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers, network, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Set constants for contract details.
const CONTRACT_NAME = "CryptoKids";
const TOKEN_NAME = "CryptoKids";
const TOKEN_SYMBOL = "CK";

/**
 * Main.
 */
async function main() {
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
  console.log(`Network ChainID: ${network.config.chainId}`);
  console.log(`Contract address: ${contract.target}`);
  console.log(`Token name: ${TOKEN_NAME}`);
  console.log(`Token symbol: ${TOKEN_SYMBOL}`);

  // Save contract files.
  saveContractFiles(contract);
}

/**
 * Save contract address and ABI files in the frontend directory.
 */
function saveContractFiles(contract_) {
  // Set frontend directory path.
  const frontendDirPath = path.join(__dirname, "../../src/contracts");

  // Create directory if it does not exist.
  if (!fs.existsSync(frontendDirPath)) {
    fs.mkdirSync(frontendDirPath);
  }

  /***** CONTRACT ABI *****/
  // Get contract artifacts.
  const artifact = artifacts.readArtifactSync(CONTRACT_NAME);

  // Save contract ABI file.
  fs.writeFileSync(
    path.join(frontendDirPath, `${CONTRACT_NAME}-abi.json`),
    JSON.stringify(artifact.abi, null, 2)
  );

  /***** CONTRACT ADDRESS *****/
  // Set address file path.
  const addressFilePath = path.join(
    frontendDirPath,
    `${CONTRACT_NAME}-address.json`
  );

  // Create address file variable.
  let addressFile = {};
  // Get address file if it exists.
  if (fs.existsSync(addressFilePath)) {
    addressFile = require(addressFilePath);
  }

  // Store contract address using the network chain ID.
  addressFile[network.config.chainId] = {
    name: network.name,
    address: contract_.target
  };

  // Save contract address file.
  fs.writeFileSync(
    path.join(addressFilePath),
    JSON.stringify(addressFile, null, 2)
  );
}

/**
 * This pattern is to be able to use async/await everywhere
 * and properly handle errors.
 */
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

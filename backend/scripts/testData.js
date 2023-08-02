// Hardhat
const { ethers } = require("hardhat");

/**
 * Main.
 */
async function main() {
  // Get accounts.
  const [parent1, parent2, child1, child2] = await ethers.getSigners();
  const parent1Name = "Parent1";
  const parent2Name = "Parent2";
  const child1Name = "Child1";
  const child2Name = "Child2";

  // Get contract.
  const CryptoKids = await ethers.getContractFactory("CryptoKids");
  const contract = CryptoKids.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  /***** FAMILY GROUP 1 *****/
  // Register parent.
  await contract.connect(parent1).registerParent(parent1Name);
  // Add child to family group.
  await contract.connect(parent1).addChild(child1.address, child1Name);

  /***** FAMILY GROUP 2 *****/
  // Register parent.
  await contract.connect(parent2).registerParent(parent2Name);
  // Add child to family group.
  await contract.connect(parent2).addChild(child2.address, child2Name);

  /***** TASKS *****/
  // Task IDs.
  const completedTaskID = 2;
  const approvedTaskID = 3;

  // Add Task1.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Task1", "10000000000000000000", 0); // No due date

  // Add Task2.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Task2", "10000000000000000000", 1693436399); // Due date: 30th August 2023
  // Complete Task2
  await contract.connect(child1).completeTask(completedTaskID);

  // Add Task3.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Task2", "35000000000000000000", 0);
  // Complete Task3.
  await contract.connect(child1).completeTask(approvedTaskID);
  // Approve Task3 completion.
  await contract.connect(parent1).approveTaskCompletion(approvedTaskID);

  // Add Task4.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Task4", "10000000000000000000", 1689893999); // Expired

  /***** REWARDS *****/
  // Reward IDs.
  const purchasedRewardID = 3;
  const redeemedRewardID = 4;
  const approvedRewardID = 5;

  // Add Reward1.
  await contract
    .connect(parent1)
    .addReward(child1.address, "Reward1", "5000000000000000000");
  // Add Reward1.
  await contract
    .connect(parent1)
    .addReward(child1.address, "Reward2", "10000000000000000000");

  // Add Reward2.
  await contract
    .connect(parent1)
    .addReward(child1.address, "Reward3", "10000000000000000000");
  // Purchase Reward2.
  await contract.connect(child1).purchaseReward(purchasedRewardID);

  // Add Reward3.
  await contract
    .connect(parent1)
    .addReward(child1.address, "Reward4", "10000000000000000000");
  // Purchase Reward3.
  await contract.connect(child1).purchaseReward(redeemedRewardID);
  // Redeem Reward3.
  await contract.connect(child1).redeemReward(redeemedRewardID);

  // Add Reward4.
  await contract
    .connect(parent1)
    .addReward(child1.address, "Reward5", "10000000000000000000");
  // Purchase Reward4.
  await contract.connect(child1).purchaseReward(approvedRewardID);
  // Redeem Reward4.
  await contract.connect(child1).redeemReward(approvedRewardID);
  // Approve Reward4 redemption.
  await contract.connect(parent1).approveRewardRedemption(approvedRewardID);

  // Display message.
  console.log("Test data added successfully!");
}

/**
 * This pattern is to be able to use async/await everywhere
 * and properly handle errors.
 */
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

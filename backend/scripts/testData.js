// Hardhat
const { ethers } = require("hardhat");

/**
 * Main.
 */
async function main() {
  // Get accounts.
  const [parent1, parent2, child1, child2, child3] = await ethers.getSigners();
  const parent1Name = "Alice";
  const parent2Name = "David";
  const child1Name = "Bob";
  const child2Name = "Charlie";
  const child3Named = "Grace";

  // Get contract.
  const CryptoKids = await ethers.getContractFactory("CryptoKids");
  // Hardhat local network contract address.
  const contract = CryptoKids.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  /***** FAMILY GROUP 1 *****/
  // Register parent.
  await contract.connect(parent1).registerParent(parent1Name);
  // Add children to family group.
  await contract.connect(parent1).addChild(child1.address, child1Name);
  await contract.connect(parent1).addChild(child3.address, child3Named);

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
    .addTask(
      child1.address,
      "Bring the bin out",
      "3000000000000000000",
      1690757999
    ); // Expired

  // Add Task2.
  await contract
    .connect(parent1)
    .addTask(
      child1.address,
      "Help set the table for dinner",
      "2000000000000000000",
      0
    );
  // Complete Task2
  await contract.connect(child1).completeTask(completedTaskID);

  // Add Task3.
  await contract
    .connect(parent1)
    .addTask(
      child1.address,
      "Clean your bedroom",
      "20000000000000000000",
      1693436399
    ); // Due date: 30th August 2023
  // Complete Task3.
  await contract.connect(child1).completeTask(approvedTaskID);
  // Approve Task3 completion.
  await contract.connect(parent1).approveTaskCompletion(approvedTaskID);

  // Add Task4.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Water the plants", "3000000000000000000", 0);

  // Add Task5.
  await contract
    .connect(parent1)
    .addTask(child1.address, "Feed and walk the dog", "5000000000000000000", 0);

  // Add Task6.
  await contract
    .connect(parent1)
    .addTask(
      child1.address,
      "Do some research and explain how blockchain works",
      "15000000000000000000",
      0
    );

  // Add Task7.
  await contract
    .connect(parent1)
    .addTask(
      child1.address,
      "Use your creativity to make a beautiful artwork",
      "15000000000000000000",
      0
    );

  /***** REWARDS *****/
  // Reward IDs.
  const redeemedRewardID = 3;
  const approvedRewardID = 4;

  // Add Reward1.
  await contract
    .connect(parent1)
    .addReward(
      child1.address,
      "Choose a special meal for the family to enjoy",
      "5000000000000000000"
    );
  // Add Reward2.
  await contract
    .connect(parent1)
    .addReward(
      child1.address,
      "Get a new toy or game of your choice",
      "25000000000000000000"
    );

  // Add Reward3.
  await contract
    .connect(parent1)
    .addReward(
      child1.address,
      "Ice cream or frozen yogurt treat",
      "5000000000000000000"
    );
  // Purchase Reward3.
  await contract.connect(child1).purchaseReward(redeemedRewardID);
  // Redeem Reward3.
  await contract.connect(child1).redeemReward(redeemedRewardID);

  // Add Reward4.
  await contract
    .connect(parent1)
    .addReward(
      child1.address,
      "Fun day out at the Zoo",
      "10000000000000000000"
    );
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

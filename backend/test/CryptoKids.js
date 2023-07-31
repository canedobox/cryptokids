const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

/***** CONSTANTS *****/
// Set contract details.
const CONTRACT_NAME = "CryptoKids";
const TOKEN_NAME = "CryptoKids";
const TOKEN_SYMBOL = "CK";

/**
 * CryptoKids smart contract automated tests.
 */
describe(`${CONTRACT_NAME} Smart Contract Automated Tests`, function () {
  /**
   * CryptoKids smart contract deployment fixture.
   * Used with `loadFixture` to run this setup once, snapshot that state,
   * and reset Hardhat Network to that snapshot before every test.
   */
  async function deployCryptoKidsFixture() {
    // Deploy contract.
    const contract = await ethers.deployContract(CONTRACT_NAME, [
      TOKEN_NAME,
      TOKEN_SYMBOL
    ]);
    await contract.waitForDeployment();

    // Get accounts.
    const [parent1, parent2, child1, child2, notRegistered] =
      await ethers.getSigners();
    const parent1Name = "Parent1";
    const parent2Name = "Parent2";
    const child1Name = "Child1";
    const child2Name = "Child2";

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
    const openTaskID = 1;
    const completedTaskID = 2;
    const approvedTaskID = 3;
    const expiredTaskID = 4;

    // Add Task1.
    await contract.connect(parent1).addTask(child1.address, "Task1", 10, 0); // No due date

    // Add Task2.
    await contract
      .connect(parent1)
      .addTask(child1.address, "Task2", 10, 1693436399); // Due date: 30th August 2023
    // Complete Task2
    await contract.connect(child1).completeTask(completedTaskID);

    // Add Task3.
    await contract.connect(parent1).addTask(child1.address, "Task2", 35, 0);
    // Complete Task3.
    await contract.connect(child1).completeTask(approvedTaskID);
    // Approve Task3 completion.
    await contract.connect(parent1).approveTaskCompletion(approvedTaskID);

    // Add Task4.
    await contract
      .connect(parent1)
      .addTask(child1.address, "Task4", 10, 1689893999); // Expired

    /***** REWARDS *****/
    // Reward IDs.
    const cheaperRewardID = 1;
    const openRewardID = 2;
    const purchasedRewardID = 3;
    const redeemedRewardID = 4;
    const approvedRewardID = 5;

    // Add Reward1.
    await contract.connect(parent1).addReward(child1.address, "Reward1", 5);
    // Add Reward1.
    await contract.connect(parent1).addReward(child1.address, "Reward2", 10);

    // Add Reward2.
    await contract.connect(parent1).addReward(child1.address, "Reward3", 10);
    // Purchase Reward2.
    await contract.connect(child1).purchaseReward(purchasedRewardID);

    // Add Reward3.
    await contract.connect(parent1).addReward(child1.address, "Reward4", 10);
    // Purchase Reward3.
    await contract.connect(child1).purchaseReward(redeemedRewardID);
    // Redeem Reward3.
    await contract.connect(child1).redeemReward(redeemedRewardID);

    // Add Reward4.
    await contract.connect(parent1).addReward(child1.address, "Reward5", 10);
    // Purchase Reward4.
    await contract.connect(child1).purchaseReward(approvedRewardID);
    // Redeem Reward4.
    await contract.connect(child1).redeemReward(approvedRewardID);
    // Approve Reward4 redemption.
    await contract.connect(parent1).approveRewardRedemption(approvedRewardID);

    /***** COUNTERS *****/
    const childTasksCounter = 4;
    const childRewardsCounter = 5;
    const familyGroupChildrenCounter = 1;
    const familyGroupTasksCounter = 4;
    const familyGroupRewardsCounter = 5;

    // Return fixture setup.
    return {
      contract,
      parent1,
      parent1Name,
      child1,
      child1Name,
      parent2,
      parent2Name,
      child2,
      child2Name,
      notRegistered,
      openTaskID,
      completedTaskID,
      approvedTaskID,
      expiredTaskID,
      cheaperRewardID,
      openRewardID,
      purchasedRewardID,
      redeemedRewardID,
      approvedRewardID,
      childTasksCounter,
      childRewardsCounter,
      familyGroupChildrenCounter,
      familyGroupTasksCounter,
      familyGroupRewardsCounter
    };
  }

  /***** DEPLOYMENT TESTS *****/
  describe("Deployment", () => {
    it("Sets the token name.", async () => {
      const { contract } = await loadFixture(deployCryptoKidsFixture);
      // Check token name.
      expect(await contract.name()).to.equal(TOKEN_NAME);
    });

    it("Sets the token symbol.", async () => {
      const { contract } = await loadFixture(deployCryptoKidsFixture);
      // Check token symbol.
      expect(await contract.symbol()).to.equal(TOKEN_SYMBOL);
    });
  });

  /***** PARENT TESTS *****/
  describe("Register a parent", () => {
    it("Should fail if caller is already registered.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try registering a parent with an account that is already registered as a parent.
      await expect(
        contract.connect(parent1).registerParent("Name")
      ).to.be.revertedWith("You are already registered as a parent.");
      // Try registering a parent with an account that is already registered as a child.
      await expect(
        contract.connect(child1).registerParent("Name")
      ).to.be.revertedWith("You are already registered as a child.");
    });

    it("Should register a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current accounts counter.
      const accountsCounter = await contract.accountsCounter();
      // Register a parent.
      await contract.connect(notRegistered).registerParent("Name");
      // Get account type.
      const [accountType] = await contract.connect(notRegistered).getProfile();
      // Check account type.
      expect(accountType).to.equal("parent");
      // Get new accounts counter.
      const newAccountsCounter = await contract.accountsCounter();
      // Check number of parents registered.
      expect(newAccountsCounter.parentsRegistered).to.be.greaterThan(
        accountsCounter.parentsRegistered
      );
    });

    it("Registering a parent should emit an event.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Register a parent and check event emitted.
      await expect(contract.connect(notRegistered).registerParent("Name"))
        .to.emit(contract, "ParentRegistered")
        .withArgs(notRegistered.address);
    });
  });

  describe("Delete a parent", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a parent account with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).deleteParent()
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should delete a parent and its family group.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current accounts counter.
      const accountsCounter = await contract.accountsCounter();
      // Delete a parent and its family group.
      await contract.connect(parent1).deleteParent();
      // Get parent account type.
      let [accountType] = await contract.connect(parent1).getProfile();
      // Check parent account type.
      expect(accountType).to.equal("not-registered");
      // Get child account type.
      [accountType] = await contract.connect(child1).getProfile();
      // Check child account type.
      expect(accountType).to.equal("not-registered");
      // Get new accounts counter.
      const newAccountsCounter = await contract.accountsCounter();
      // Check number of parents deleted.
      expect(newAccountsCounter.parentsDeleted).to.be.greaterThan(
        accountsCounter.parentsDeleted
      );
      // Check number of children removed.
      expect(newAccountsCounter.childrenRemoved).to.be.greaterThan(
        accountsCounter.childrenRemoved
      );
    });

    it("Deleting a parent should emit an event.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Delete a parent and check event emitted.
      await expect(contract.connect(parent1).deleteParent())
        .to.emit(contract, "ParentDeleted")
        .withArgs(parent1.address);
    });
  });

  /***** FAMILY GROUP TESTS *****/
  describe("Add a child to a family group", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a child with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).deleteParent()
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if child is already registered.", async () => {
      const { contract, parent1, parent2, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a child with an address that is already registered as a parent.
      await expect(
        contract.connect(parent1).addChild(parent2.address, "Name")
      ).to.be.revertedWith("Address already registered as a parent.");
      // Try adding a child with an address that is already registered as a child.
      await expect(
        contract.connect(parent1).addChild(child1.address, "Name")
      ).to.be.revertedWith("Address already registered as a child.");
    });

    it("Should add a child to a family group.", async () => {
      const { contract, parent1, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current accounts counter.
      const accountsCounter = await contract.accountsCounter();
      // Get current family group.
      const familyGroup = await contract.connect(parent1).getFamilyGroup();
      // Add a child.
      await contract.connect(parent1).addChild(notRegistered.address, "Name");
      // Get account type.
      const [accountType] = await contract.connect(notRegistered).getProfile();
      // Check account type.
      expect(accountType).to.equal("child");
      // Get new accounts counter.
      const newAccountsCounter = await contract.accountsCounter();
      // Check number of children added.
      expect(newAccountsCounter.childrenAdded).to.be.greaterThan(
        accountsCounter.childrenAdded
      );
      // Get new family group.
      const newFamilyGroup = await contract.connect(parent1).getFamilyGroup();
      // Check number of children in the family group.
      expect(newFamilyGroup.length).to.be.greaterThan(familyGroup.length);
    });

    it("Adding a child to a family group should emit an event.", async () => {
      const { contract, parent1, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Add a child and check event emitted.
      await expect(
        contract.connect(parent1).addChild(notRegistered.address, "Name")
      )
        .to.emit(contract, "ChildAdded")
        .withArgs(parent1.address, notRegistered.address);
    });
  });

  describe("Remove a child from a family group", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try removing a child with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).removeChild(notRegistered.address)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if address does not belong to a child.", async () => {
      const { contract, parent1, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try removing a child with an address that does not belong to a child.
      await expect(
        contract.connect(parent1).removeChild(notRegistered.address)
      ).to.be.revertedWith("Address does not belong to a child.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent1, child2 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try removing a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent1).removeChild(child2.address)
      ).to.be.revertedWith("This child is not part of your family group.");
    });

    it("Should remove a child from a family group.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current accounts counter.
      const accountsCounter = await contract.accountsCounter();
      // Get current family group.
      const familyGroup = await contract.connect(parent1).getFamilyGroup();
      // Remove a child.
      await contract.connect(parent1).removeChild(child1.address);
      // Get account type.
      const [accountType] = await contract.connect(child1).getProfile();
      // Check account type.
      expect(accountType).to.equal("not-registered");
      // Get new accounts counter.
      const newAccountsCounter = await contract.accountsCounter();
      // Check number of children removed.
      expect(newAccountsCounter.childrenRemoved).to.be.greaterThan(
        accountsCounter.childrenRemoved
      );
      // Get new family group.
      const newFamilyGroup = await contract.connect(parent1).getFamilyGroup();
      // Check number of children in the family group.
      expect(newFamilyGroup.length).to.be.lessThan(familyGroup.length);
    });

    it("Removing a child from a family group should emit an event.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Remove a child and check event emitted.
      await expect(contract.connect(parent1).removeChild(child1.address))
        .to.emit(contract, "ChildRemoved")
        .withArgs(parent1.address, child1.address);
    });
  });

  describe("Get a family group", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try getting a family group with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).getFamilyGroup()
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should get a family group.", async () => {
      const { contract, parent1, familyGroupChildrenCounter } =
        await loadFixture(deployCryptoKidsFixture);
      // Get family group.
      const familyGroup = await contract.connect(parent1).getFamilyGroup();
      // Check number of children in the family group.
      expect(familyGroup.length).to.equal(familyGroupChildrenCounter);
    });
  });

  /***** ACCOUNT TESTS *****/
  describe("Get account type", () => {
    it("Caller should not be registered.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get account type.
      const [accountType] = await contract.connect(notRegistered).getProfile();
      // Check account type.
      expect(accountType).to.equal("not-registered");
    });

    it("Caller should be registered as a parent.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Get account type.
      const [accountType] = await contract.connect(parent1).getProfile();
      // Check account type.
      expect(accountType).to.equal("parent");
    });

    it("Caller should be registered as a child.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Get account type.
      const [accountType] = await contract.connect(child1).getProfile();
      // Check account type.
      expect(accountType).to.equal("child");
    });
  });

  describe("Edit a profile", () => {
    it("Should fail if caller is not registered.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing profile of an account that is not registered.
      await expect(
        contract.connect(notRegistered).editProfile("Name")
      ).to.be.revertedWith("You are not registered.");
    });

    it("Should adit a parent's profile.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Edit parent's profile.
      await contract.connect(parent1).editProfile("Name");
      // Get parent's profile.
      const profile = await contract.connect(parent1).getProfile();
      // Check parent's name.
      expect(profile.name).to.equal("Name");
    });

    it("Editing a parent's profile should emit an event.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Edit parent's profile and check event emitted.
      await expect(contract.connect(parent1).editProfile("Name"))
        .to.emit(contract, "ParentProfileEdited")
        .withArgs(parent1.address);
    });

    it("Should edit a child's profile.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Edit child's profile.
      await contract.connect(child1).editProfile("Name");
      // Get child's profile.
      const profile = await contract.connect(child1).getProfile();
      // Check child's name.
      expect(profile.name).to.equal("Name");
    });

    it("Editing a child's profile should emit an event.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Edit parent's profile and check event emitted.
      await expect(contract.connect(child1).editProfile("Name"))
        .to.emit(contract, "ChildProfileEdited")
        .withArgs(child1.address);
    });
  });

  /***** TASK TESTS *****/
  describe("Add a task", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a task with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).addTask(child1.address, "Task", 10, 0)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if address does not belong to a child.", async () => {
      const { contract, parent1, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a task with an address that does not belong to a child.
      await expect(
        contract.connect(parent1).addTask(notRegistered.address, "Task", 10, 0)
      ).to.be.revertedWith("Address does not belong to a child.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent1, child2 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a task to a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent1).addTask(child2.address, "Task", 10, 0)
      ).to.be.revertedWith("This child is not part of your family group.");
    });

    it("Should add a task.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Get current child tasks.
      const childTasks = await contract.connect(child1).getChildTasks();
      // Add a task.
      await contract.connect(parent1).addTask(child1.address, "Task", 10, 0);
      // Get new tasks counter.
      const newTasksCounter = await contract.tasksCounter();
      // Check number of tasks added.
      expect(newTasksCounter.added).to.be.greaterThan(tasksCounter.added);
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check child's number of tasks added.
      expect(newChildTasks.length).to.be.greaterThan(childTasks.length);
    });

    it("Adding a task should emit an event.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Add a task and check event emitted.
      await expect(
        contract.connect(parent1).addTask(child1.address, "Task", 10, 0)
      )
        .to.emit(contract, "TaskAdded")
        .withArgs(
          tasksCounter.added + ethers.toBigInt(1),
          child1.address,
          "Task",
          10,
          0
        );
    });
  });

  describe("Edit a task", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a task with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).editTask(openTaskID, "Task", 10, 0)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if task ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try editing a task with an invalid task ID.
      await expect(
        contract.connect(parent1).editTask(0, "Task", 10, 0)
      ).to.be.revertedWith("Invalid task ID.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a task from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).editTask(openTaskID, "Task", 10, 0)
      ).to.be.revertedWith(
        "The child this task is assigned to is not part of your family group."
      );
    });

    it("Should fail if task has already been completed.", async () => {
      const { contract, parent1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a completed task.
      await expect(
        contract.connect(parent1).editTask(completedTaskID, "Task", 10, 0)
      ).to.be.revertedWith("Task has already been completed.");
    });

    it("Should edit a task.", async () => {
      const { contract, parent1, child1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Edit a task.
      await contract.connect(parent1).editTask(openTaskID, "Edited", 20, 0);
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check task description.
      expect(newChildTasks[openTaskID - 1].description).to.equal("Edited");
      // Check task reward.
      expect(newChildTasks[openTaskID - 1].reward).to.equal(20);
      // Check task due date.
      expect(newChildTasks[openTaskID - 1].dueDate).to.equal(0);
    });

    it("Editing a task should emit an event.", async () => {
      const { contract, parent1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Edit a task and check event emitted.
      await expect(
        contract.connect(parent1).editTask(openTaskID, "Edited", 20, 0)
      )
        .to.emit(contract, "TaskEdited")
        .withArgs(openTaskID, "Edited", 20, 0);
    });
  });

  describe("Delete a task", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a task with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).deleteTask(openTaskID)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if task ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try deleting a task with an invalid task ID.
      await expect(contract.connect(parent1).deleteTask(0)).to.be.revertedWith(
        "Invalid task ID."
      );
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a task from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).deleteTask(openTaskID)
      ).to.be.revertedWith(
        "The child this task is assigned to is not part of your family group."
      );
    });

    it("Should fail if task has already been completed.", async () => {
      const { contract, parent1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a completed task.
      await expect(
        contract.connect(parent1).deleteTask(completedTaskID)
      ).to.be.revertedWith("Task has already been completed.");
    });

    it("Should delete a task.", async () => {
      const { contract, parent1, child1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Get current child tasks.
      const childTasks = await contract.connect(child1).getChildTasks();
      // Delete a task.
      await contract.connect(parent1).deleteTask(openTaskID);
      // Get new tasks counter.
      const newTasksCounter = await contract.tasksCounter();
      // Check number of tasks deleted.
      expect(newTasksCounter.deleted).to.be.greaterThan(tasksCounter.deleted);
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check child's number of tasks added.
      expect(newChildTasks.length).to.be.lessThan(childTasks.length);
    });

    it("Deleting a task should emit an event.", async () => {
      const { contract, parent1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Delete a task and check event emitted.
      await expect(contract.connect(parent1).deleteTask(openTaskID))
        .to.emit(contract, "TaskDeleted")
        .withArgs(openTaskID);
    });
  });

  describe("Complete a task", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try completing a task with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).completeTask(openTaskID)
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should fail if task ID is not valid.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Try completing a task with an invalid task ID.
      await expect(contract.connect(child1).completeTask(0)).to.be.revertedWith(
        "Invalid task ID."
      );
    });

    it("Should fail if task is not assigned to the caller.", async () => {
      const { contract, child2, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try completing a task that is not assigned to the caller.
      await expect(
        contract.connect(child2).completeTask(openTaskID)
      ).to.be.revertedWith("This is not your task.");
    });

    it("Should fail if task has already been completed.", async () => {
      const { contract, child1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try completing a completed task.
      await expect(
        contract.connect(child1).completeTask(completedTaskID)
      ).to.be.revertedWith("You already completed this task.");
    });

    it("Should fail if task has expired.", async () => {
      const { contract, child1, expiredTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try completing an expired task.
      await expect(
        contract.connect(child1).completeTask(expiredTaskID)
      ).to.be.revertedWith("This task has expired.");
    });

    it("Should complete a task.", async () => {
      const { contract, child1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Complete a task.
      await contract.connect(child1).completeTask(openTaskID);
      // Get new tasks counter.
      const newTasksCounter = await contract.tasksCounter();
      // Check number of tasks completed.
      expect(newTasksCounter.completed).to.be.greaterThan(
        tasksCounter.completed
      );
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check task completion.
      expect(newChildTasks[openTaskID - 1].completed).to.equal(true);
      // Check task completion date.
      expect(newChildTasks[openTaskID - 1].completionDate).to.be.greaterThan(0);
    });

    it("Completing a task should emit an event.", async () => {
      const { contract, child1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Complete a task and check event emitted.
      await expect(contract.connect(child1).completeTask(openTaskID))
        .to.emit(contract, "TaskCompleted")
        .withArgs(openTaskID, child1.address, anyValue);
    });
  });

  describe("Cancel task completion", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling task completion with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).cancelTaskCompletion(completedTaskID)
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should fail if task ID is not valid.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Try cancelling task completion with an invalid task ID.
      await expect(
        contract.connect(child1).cancelTaskCompletion(0)
      ).to.be.revertedWith("Invalid task ID.");
    });

    it("Should fail if task is not assigned to the caller.", async () => {
      const { contract, child2, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling task completion that is not assigned to the caller.
      await expect(
        contract.connect(child2).cancelTaskCompletion(completedTaskID)
      ).to.be.revertedWith("This is not your task.");
    });

    it("Should fail if task has not been completed.", async () => {
      const { contract, child1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling task completion of a task that has not been completed.
      await expect(
        contract.connect(child1).cancelTaskCompletion(openTaskID)
      ).to.be.revertedWith("You haven't completed this task yet.");
    });

    it("Should fail if task completion has already been approved.", async () => {
      const { contract, child1, approvedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling task completion of a approved task.
      await expect(
        contract.connect(child1).cancelTaskCompletion(approvedTaskID)
      ).to.be.revertedWith("Task completion has already been approved.");
    });

    it("Should cancel task completion.", async () => {
      const { contract, child1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Cancel task completion.
      await contract.connect(child1).cancelTaskCompletion(completedTaskID);
      // Get new tasks counter.
      const newTasksCounter = await contract.tasksCounter();
      // Check number of tasks completed.
      expect(newTasksCounter.completed).to.be.lessThan(tasksCounter.completed);
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check task completion.
      expect(newChildTasks[completedTaskID - 1].completed).to.equal(false);
      // Check task completion date.
      expect(newChildTasks[completedTaskID - 1].completionDate).to.equal(0);
    });

    it("Cancelling task completion should emit an event.", async () => {
      const { contract, child1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Cancel task completion and check event emitted.
      await expect(
        contract.connect(child1).cancelTaskCompletion(completedTaskID)
      )
        .to.emit(contract, "TaskCompletionCancelled")
        .withArgs(completedTaskID);
    });
  });

  describe("Approve task completion", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving task completion with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).approveTaskCompletion(completedTaskID)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if task ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try approving task completion with an invalid task ID.
      await expect(
        contract.connect(parent1).approveTaskCompletion(0)
      ).to.be.revertedWith("Invalid task ID.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving task completion from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).approveTaskCompletion(completedTaskID)
      ).to.be.revertedWith(
        "The child this task is assigned to is not part of your family group."
      );
    });

    it("Should fail if task has not been completed.", async () => {
      const { contract, parent1, openTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving task completion of a task that has not been completed.
      await expect(
        contract.connect(parent1).approveTaskCompletion(openTaskID)
      ).to.be.revertedWith("Task has not been completed yet.");
    });

    it("Should fail if task completion has already been approved.", async () => {
      const { contract, parent1, approvedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving task completion of a approved task.
      await expect(
        contract.connect(parent1).approveTaskCompletion(approvedTaskID)
      ).to.be.revertedWith("Task completion has already been approved.");
    });

    it("Should approve task completion.", async () => {
      const { contract, parent1, child1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current tasks counter.
      const tasksCounter = await contract.tasksCounter();
      // Approve task completion.
      await contract.connect(parent1).approveTaskCompletion(completedTaskID);
      // Get new tasks counter.
      const newTasksCounter = await contract.tasksCounter();
      // Check number of tasks approved.
      expect(newTasksCounter.approved).to.be.greaterThan(tasksCounter.approved);
      // Get new child tasks.
      const newChildTasks = await contract.connect(child1).getChildTasks();
      // Check task completion approval.
      expect(newChildTasks[completedTaskID - 1].approved).to.equal(true);
      // Check task completion approval date.
      expect(newChildTasks[completedTaskID - 1].approvalDate).to.be.greaterThan(
        0
      );
    });

    it("Should send reward tokens to the child's wallet.", async () => {
      const { contract, parent1, child1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current child token balance.
      const childBalance = await contract.balanceOf(child1.address);
      // Get current child tasks.
      const childTasks = await contract.connect(child1).getChildTasks();
      // Approve task completion.
      await contract.connect(parent1).approveTaskCompletion(completedTaskID);
      // Get new child token balance.
      const newChildBalance = await contract.balanceOf(child1.address);
      // Check child token balance.
      expect(newChildBalance - childBalance).to.equal(
        childTasks[completedTaskID - 1].reward
      );
    });

    it("Approving task completion should emit an event.", async () => {
      const { contract, parent1, completedTaskID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Approve task completion and check event emitted.
      await expect(
        contract.connect(parent1).approveTaskCompletion(completedTaskID)
      )
        .to.emit(contract, "TaskCompletionApproved")
        .withArgs(completedTaskID, parent1.address, anyValue);
    });
  });

  describe("Get child's tasks.", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try getting child's tasks with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).getChildTasks()
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should get child's tasks.", async () => {
      const { contract, child1, childTasksCounter } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get child tasks.
      const childTasks = await contract.connect(child1).getChildTasks();
      // Check number of tasks.
      expect(childTasks.length).to.equals(childTasksCounter);
    });
  });

  describe("Get caller's family group tasks.", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try getting tasks with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).getFamilyGroupTasks()
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should get caller's family group tasks.", async () => {
      const { contract, parent1, familyGroupTasksCounter } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get family group tasks.
      const familyGroupTasks = await contract
        .connect(parent1)
        .getFamilyGroupTasks();
      // Check number of tasks.
      expect(familyGroupTasks.length).to.equals(familyGroupTasksCounter);
    });
  });

  /***** REWARD TESTS *****/
  describe("Add a reward", () => {
    it("Should fail if caller not registered as a parent.", async () => {
      const { contract, notRegistered, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a reward with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).addReward(child1.address, "Reward", 10)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if address does not belong to a child.", async () => {
      const { contract, parent1, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a reward with an address that does not belong to a child.
      await expect(
        contract.connect(parent1).addReward(notRegistered.address, "Reward", 10)
      ).to.be.revertedWith("Address does not belong to a child.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent1, child2 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try adding a reward to a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent1).addReward(child2.address, "Reward", 10)
      ).to.be.revertedWith("This child is not part of your family group.");
    });

    it("Should add a reward.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Get current child rewards.
      const childRewards = await contract.connect(child1).getChildRewards();
      // Add a reward.
      await contract.connect(parent1).addReward(child1.address, "Reward", 10);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards added.
      expect(newRewardsCounter.added).to.be.greaterThan(rewardsCounter.added);
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check child's number of rewards added.
      expect(newChildRewards.length).to.be.greaterThan(childRewards.length);
    });

    it("Adding a reward should emit an event.", async () => {
      const { contract, parent1, child1 } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Add a reward and check event emitted.
      await expect(
        contract.connect(parent1).addReward(child1.address, "Reward", 10)
      )
        .to.emit(contract, "RewardAdded")
        .withArgs(
          rewardsCounter.added + ethers.toBigInt(1),
          child1.address,
          "Reward",
          10
        );
    });
  });

  describe("Edit a reward", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a reward with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).editReward(openRewardID, "Reward", 10)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try editing a reward with an invalid reward ID.
      await expect(
        contract.connect(parent1).editReward(0, "Reward", 10)
      ).to.be.revertedWith("Invalid reward ID.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a reward from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).editReward(openRewardID, "Reward", 10)
      ).to.be.revertedWith(
        "The child this reward is assigned to is not part of your family group."
      );
    });

    it("Should fail if reward has already been purchased.", async () => {
      const { contract, parent1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try editing a purchased reward.
      await expect(
        contract.connect(parent1).editReward(purchasedRewardID, "Reward", 10)
      ).to.be.revertedWith("Reward has already been purchased.");
    });

    it("Should edit a reward.", async () => {
      const { contract, parent1, child1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Edit a reward.
      await contract.connect(parent1).editReward(openRewardID, "Edited", 20);
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check reward description.
      expect(newChildRewards[openRewardID - 1].description).to.equal("Edited");
      // Check reward price.
      expect(newChildRewards[openRewardID - 1].price).to.equal(20);
    });

    it("Editing a reward should emit an event.", async () => {
      const { contract, parent1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Edit a reward and check event emitted.
      await expect(
        contract.connect(parent1).editReward(openRewardID, "Edited", 20)
      )
        .to.emit(contract, "RewardEdited")
        .withArgs(openRewardID, "Edited", 20);
    });
  });

  describe("Delete a reward", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a reward with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).deleteReward(openRewardID)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try deleting a reward with an invalid reward ID.
      await expect(
        contract.connect(parent1).deleteReward(0)
      ).to.be.revertedWith("Invalid reward ID.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a reward from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).deleteReward(openRewardID)
      ).to.be.revertedWith(
        "The child this reward is assigned to is not part of your family group."
      );
    });

    it("Should fail if reward has already been purchased.", async () => {
      const { contract, parent1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try deleting a purchased reward.
      await expect(
        contract.connect(parent1).deleteReward(purchasedRewardID)
      ).to.be.revertedWith("Reward has already been purchased.");
    });

    it("Should delete a reward.", async () => {
      const { contract, parent1, child1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Get current child rewards.
      const childRewards = await contract.connect(child1).getChildRewards();
      // Delete a reward.
      await contract.connect(parent1).deleteReward(openRewardID);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards deleted.
      expect(newRewardsCounter.deleted).to.be.greaterThan(
        rewardsCounter.deleted
      );
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check child's number of rewards added.
      expect(newChildRewards.length).to.be.lessThan(childRewards.length);
    });

    it("Deleting a reward should emit an event.", async () => {
      const { contract, parent1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Delete a reward and check event emitted.
      await expect(contract.connect(parent1).deleteReward(openRewardID))
        .to.emit(contract, "RewardDeleted")
        .withArgs(openRewardID);
    });
  });

  describe("Purchase a reward", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try purchasing a reward with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).purchaseReward(openRewardID)
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Try purchasing a reward with an invalid reward ID.
      await expect(
        contract.connect(child1).purchaseReward(0)
      ).to.be.revertedWith("Invalid reward ID.");
    });

    it("Should fail if reward is not assigned to the caller.", async () => {
      const { contract, child2, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try purchasing a reward that is not assigned to the caller.
      await expect(
        contract.connect(child2).purchaseReward(openRewardID)
      ).to.be.revertedWith("This is not your reward.");
    });

    it("Should fail if reward has already been purchased.", async () => {
      const { contract, child1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try purchasing a purchased reward.
      await expect(
        contract.connect(child1).purchaseReward(purchasedRewardID)
      ).to.be.revertedWith("You already purchased this reward.");
    });

    it("Should fail if caller does not have enough tokens.", async () => {
      const { contract, child1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try purchasing a reward without enough tokens.
      await expect(
        contract.connect(child1).purchaseReward(openRewardID)
      ).to.be.revertedWith("You don't have enough tokens (CK).");
    });

    it("Should purchase a reward.", async () => {
      const { contract, child1, cheaperRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Purchase a reward.
      await contract.connect(child1).purchaseReward(cheaperRewardID);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards purchased.
      expect(newRewardsCounter.purchased).to.be.greaterThan(
        rewardsCounter.purchased
      );
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check reward purchase.
      expect(newChildRewards[cheaperRewardID - 1].purchased).to.equal(true);
      // Check reward purchase date.
      expect(
        newChildRewards[cheaperRewardID - 1].purchaseDate
      ).to.be.greaterThan(0);
    });

    it("Should spend tokens from the child's wallet.", async () => {
      const { contract, child1, cheaperRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current child token balance.
      const childBalance = await contract.balanceOf(child1.address);
      // Get current child rewards.
      const childRewards = await contract.connect(child1).getChildRewards();
      // Purchase a reward.
      await contract.connect(child1).purchaseReward(cheaperRewardID);
      // Get new child token balance.
      const newChildBalance = await contract.balanceOf(child1.address);
      // Check child token balance.
      expect(childBalance - newChildBalance).to.equal(
        childRewards[cheaperRewardID - 1].price
      );
    });

    it("Purchasing a reward should emit an event.", async () => {
      const { contract, child1, cheaperRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get child rewards.
      const childRewards = await contract.connect(child1).getChildRewards();
      // Purchase a reward and check event emitted.
      await expect(contract.connect(child1).purchaseReward(cheaperRewardID))
        .to.emit(contract, "RewardPurchased")
        .withArgs(
          cheaperRewardID,
          childRewards[cheaperRewardID - 1].price,
          child1.address,
          anyValue
        );
    });
  });

  describe("Redeem a reward", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try redeeming a reward with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).redeemReward(purchasedRewardID)
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Try redeeming a reward with an invalid reward ID.
      await expect(contract.connect(child1).redeemReward(0)).to.be.revertedWith(
        "Invalid reward ID."
      );
    });

    it("Should fail if reward is not assigned to the caller.", async () => {
      const { contract, child2, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try redeeming a reward that is not assigned to the caller.
      await expect(
        contract.connect(child2).redeemReward(purchasedRewardID)
      ).to.be.revertedWith("This is not your reward.");
    });

    it("Should fail if reward has not been purchased.", async () => {
      const { contract, child1, openRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try redeeming a reward that has not been purchased.
      await expect(
        contract.connect(child1).redeemReward(openRewardID)
      ).to.be.revertedWith("You haven't purchased this reward yet.");
    });

    it("Should fail if reward has already been redeemed.", async () => {
      const { contract, child1, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try redeeming a redeemed reward.
      await expect(
        contract.connect(child1).redeemReward(redeemedRewardID)
      ).to.be.revertedWith("You already redeemed this reward.");
    });

    it("Should redeem a reward.", async () => {
      const { contract, child1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Redeem a reward.
      await contract.connect(child1).redeemReward(purchasedRewardID);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards redeemed.
      expect(newRewardsCounter.redeemed).to.be.greaterThan(
        rewardsCounter.redeemed
      );
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check reward redemption.
      expect(newChildRewards[purchasedRewardID - 1].redeemed).to.equal(true);
      // Check reward redemption date.
      expect(
        newChildRewards[purchasedRewardID - 1].redemptionDate
      ).to.be.greaterThan(0);
    });

    it("Redeeming a reward should emit an event.", async () => {
      const { contract, child1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Redeem a reward and check event emitted.
      await expect(contract.connect(child1).redeemReward(purchasedRewardID))
        .to.emit(contract, "RewardRedeemed")
        .withArgs(purchasedRewardID, child1.address, anyValue);
    });
  });

  describe("Cancel reward redemption", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling reward redemption with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).cancelRewardRedemption(redeemedRewardID)
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, child1 } = await loadFixture(deployCryptoKidsFixture);
      // Try cancelling reward redemption with an invalid task ID.
      await expect(
        contract.connect(child1).cancelRewardRedemption(0)
      ).to.be.revertedWith("Invalid reward ID.");
    });

    it("Should fail if reward is not assigned to the caller.", async () => {
      const { contract, child2, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling reward redemption that is not assigned to the caller.
      await expect(
        contract.connect(child2).cancelRewardRedemption(redeemedRewardID)
      ).to.be.revertedWith("This is not your reward.");
    });

    it("Should fail if reward has not been redeemed.", async () => {
      const { contract, child1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling reward redemption of reward that has not been redeemed.
      await expect(
        contract.connect(child1).cancelRewardRedemption(purchasedRewardID)
      ).to.be.revertedWith("You haven't redeemed this reward yet.");
    });

    it("Should fail if reward redemption has already been approved.", async () => {
      const { contract, child1, approvedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try cancelling reward redemption of a approved reward.
      await expect(
        contract.connect(child1).cancelRewardRedemption(approvedRewardID)
      ).to.be.revertedWith("Reward redemption has already been approved.");
    });

    it("Should cancel reward redemption.", async () => {
      const { contract, child1, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Cancel reward redemption.
      await contract.connect(child1).cancelRewardRedemption(redeemedRewardID);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards redeemed.
      expect(newRewardsCounter.redeemed).to.be.lessThan(
        rewardsCounter.redeemed
      );
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check reward redemption.
      expect(newChildRewards[redeemedRewardID - 1].redeemed).to.equal(false);
      // Check reward redemption date.
      expect(newChildRewards[redeemedRewardID - 1].redemptionDate).to.equal(0);
    });

    it("Cancelling reward redemption should emit an event.", async () => {
      const { contract, child1, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Cancel reward redemption and check event emitted.
      await expect(
        contract.connect(child1).cancelRewardRedemption(redeemedRewardID)
      )
        .to.emit(contract, "RewardRedemptionCancelled")
        .withArgs(redeemedRewardID);
    });
  });

  describe("Approve reward redemption", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving reward redemption with an account that is not registered as parent.
      await expect(
        contract
          .connect(notRegistered)
          .approveRewardRedemption(redeemedRewardID)
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should fail if reward ID is not valid.", async () => {
      const { contract, parent1 } = await loadFixture(deployCryptoKidsFixture);
      // Try approving reward redemption with an invalid reward ID.
      await expect(
        contract.connect(parent1).approveRewardRedemption(0)
      ).to.be.revertedWith("Invalid reward ID.");
    });

    it("Should fail if child is not part of the caller's family group.", async () => {
      const { contract, parent2, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving reward redemption from a child that is not part of the caller's family group.
      await expect(
        contract.connect(parent2).approveRewardRedemption(redeemedRewardID)
      ).to.be.revertedWith(
        "The child this reward is assigned to is not part of your family group."
      );
    });

    it("Should fail if reward has not been redeemed.", async () => {
      const { contract, parent1, purchasedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving reward redemption of a reward that has not been redeemed.
      await expect(
        contract.connect(parent1).approveRewardRedemption(purchasedRewardID)
      ).to.be.revertedWith("Reward has not been redeemed yet.");
    });

    it("Should fail if reward redemption has already been approved.", async () => {
      const { contract, parent1, approvedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try approving reward redemption of a approved reward.
      await expect(
        contract.connect(parent1).approveRewardRedemption(approvedRewardID)
      ).to.be.revertedWith("Reward redemption has already been approved.");
    });

    it("Should approve reward redemption.", async () => {
      const { contract, parent1, child1, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get current rewards counter.
      const rewardsCounter = await contract.rewardsCounter();
      // Approve reward redemption.
      await contract.connect(parent1).approveRewardRedemption(redeemedRewardID);
      // Get new rewards counter.
      const newRewardsCounter = await contract.rewardsCounter();
      // Check number of rewards approved.
      expect(newRewardsCounter.approved).to.be.greaterThan(
        rewardsCounter.approved
      );
      // Get new child rewards.
      const newChildRewards = await contract.connect(child1).getChildRewards();
      // Check reward redemption approval.
      expect(newChildRewards[redeemedRewardID - 1].approved).to.equal(true);
      // Check reward redemption approval date.
      expect(
        newChildRewards[redeemedRewardID - 1].approvalDate
      ).to.be.greaterThan(0);
    });

    it("Approving reward redemption should emit an event.", async () => {
      const { contract, parent1, redeemedRewardID } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Approve reward redemption and check event emitted.
      await expect(
        contract.connect(parent1).approveRewardRedemption(redeemedRewardID)
      )
        .to.emit(contract, "RewardRedemptionApproved")
        .withArgs(redeemedRewardID, parent1.address, anyValue);
    });
  });

  describe("Get child's rewards.", () => {
    it("Should fail if caller is not registered as a child.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try getting child's rewards with an account that is not registered as child.
      await expect(
        contract.connect(notRegistered).getChildRewards()
      ).to.be.revertedWith("You are not registered as a child.");
    });

    it("Should get child's rewards.", async () => {
      const { contract, child1, childRewardsCounter } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Get child rewards.
      const childRewards = await contract.connect(child1).getChildRewards();
      // Check number of rewards.
      expect(childRewards.length).to.equals(childRewardsCounter);
    });
  });

  describe("Get caller's family group rewards.", () => {
    it("Should fail if caller is not registered as a parent.", async () => {
      const { contract, notRegistered } = await loadFixture(
        deployCryptoKidsFixture
      );
      // Try getting rewards with an account that is not registered as parent.
      await expect(
        contract.connect(notRegistered).getFamilyGroupRewards()
      ).to.be.revertedWith("You are not registered as a parent.");
    });

    it("Should get caller's family group rewards.", async () => {
      const { contract, parent1, familyGroupRewardsCounter } =
        await loadFixture(deployCryptoKidsFixture);
      // Get family group rewards.
      const familyGroupRewards = await contract
        .connect(parent1)
        .getFamilyGroupRewards();
      // Check number of rewards.
      expect(familyGroupRewards.length).to.equals(familyGroupRewardsCounter);
    });
  });
});

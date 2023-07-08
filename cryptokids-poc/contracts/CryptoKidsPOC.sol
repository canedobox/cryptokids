// SPDX-License-Identifier: MIT
// Author: @canedobox

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoKidsPOC is ERC20 {
  /***** STRUCTS *****/
  struct Parent {
    string name;
    bool exists;
  }

  struct Child {
    address childAddress;
    address familyGroup;
    string name;
    bool exists;
  }

  struct FamilyGroupChild {
    Child child;
    uint256 balance;
  }

  struct Task {
    uint256 taskId;
    address assignedTo;
    string description;
    uint256 reward;
    uint256 dueDate;
    bool completed;
    uint256 completionDate;
    bool approved;
    uint256 approvalDate;
    bool exists;
  }

  struct Reward {
    uint256 rewardId;
    address assignedTo;
    string description;
    uint256 price;
    bool purchased;
    uint256 purchaseDate;
    bool redeemed;
    uint256 redemptionDate;
    bool approved;
    uint256 approvalDate;
    bool exists;
  }

  /***** MAPPINGS *****/
  mapping(address => Parent) private _parents;
  mapping(address => Child) private _children;
  mapping(address => address[]) private _familyGroups;
  mapping(uint256 => Task) private _tasks;
  mapping(address => uint256[]) private _childTasks;
  mapping(uint256 => Reward) private _rewards;
  mapping(address => uint256[]) private _childRewards;

  /***** VARIABLES *****/
  uint256 tasksCounter;
  uint256 rewardsCounter;

  /***** EVENTS *****/
  // Family group events.
  event ParentRegistered(address parent);
  event ChildAdded(address familyGroup, address child);
  event ChildRemoved(address familyGroup, address child);
  // Task events.
  event TaskAdded(
    uint256 taskId,
    address assignedTo,
    string description,
    uint256 reward,
    uint256 dueDate
  );
  event TaskCompleted(
    uint256 taskId,
    address completedBy,
    uint256 completionDate
  );
  event TaskApproved(uint256 taskId, address approvedBy, uint256 approvalDate);
  // Reward events.
  event RewardAdded(
    uint256 rewardId,
    address assignedTo,
    string description,
    uint256 price
  );
  event RewardPurchased(
    uint256 rewardId,
    uint256 price,
    address purchasedBy,
    uint256 purchaseDate
  );
  event RewardRedeemed(
    uint256 rewardId,
    address redeemedBy,
    uint256 redemptionDate
  );
  event RewardApproved(
    uint256 rewardId,
    address approvedBy,
    uint256 approvalDate
  );

  /***** CONSTRUCTOR *****/
  constructor() ERC20("CryptoKidsPOC", "CKPOC") {
    //
  }

  /***** MODIFIERS *****/
  // Modifier to check if the caller is a parent.
  modifier onlyParent() {
    require(_parents[msg.sender].exists, "You are not registered as a parent.");
    _;
  }
  // Modifier to check if the caller is a child.
  modifier onlyChild() {
    require(_children[msg.sender].exists, "You are not registered as a child.");
    _;
  }

  /************************/
  /***** FAMILY GROUP *****/
  /************************/

  /**
   * Register caller as a parent.
   */
  function registerParent(string memory name_) external {
    // Check if the caller is already registered.
    require(
      !_parents[msg.sender].exists,
      "You are already registered as a parent."
    );
    require(
      !_children[msg.sender].exists,
      "You are already registered as a child."
    );

    // Add caller to the parents mapping.
    _parents[msg.sender] = Parent(name_, true);

    // Emit event.
    emit ParentRegistered(msg.sender);
  }

  /**
   * Add a child to the caller's family group.
   */
  function addChild(address child_, string memory name_) external onlyParent {
    // Check if the child address is already registered.
    require(
      !_parents[child_].exists,
      "Address already registered as a parent."
    );
    require(
      !_children[child_].exists,
      "Address already registered as a child."
    );

    // Add child to the children mapping.
    _children[child_] = Child(child_, msg.sender, name_, true);
    // Add child to the caller's family group.
    _familyGroups[msg.sender].push(child_);

    // Emit event.
    emit ChildAdded(msg.sender, child_);
  }

  /**
   * Remove a child from the caller's family group.
   * This function will NOT delete child's tasks, rewards or tokens.
   */
  function removeChild(address child_) external onlyParent {
    // Check if the address provided belongs to a child.
    require(_children[child_].exists, "Address does not belong to a child.");
    // Check if the child is part of the caller's family group.
    require(
      _children[child_].familyGroup == msg.sender,
      "This child is not part of your family group."
    );

    // Remove child from the caller's family group.
    // Get the caller's family group.
    address[] storage familyGroup = _familyGroups[msg.sender];
    // Loop through the family group.
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Find the index of the child in the array.
      if (familyGroup[i] == child_) {
        // Replace the child with the last child in the array and...
        familyGroup[i] = familyGroup[familyGroup.length - 1];
        // ... delete the last child.
        familyGroup.pop();
        // Stop the loop.
        break;
      }
    }

    // Delete child.
    delete _children[child_];

    // Emit event.
    emit ChildRemoved(msg.sender, child_);
  }

  /**
   * Get the caller's family group.
   */
  function getFamilyGroup()
    external
    view
    onlyParent
    returns (FamilyGroupChild[] memory)
  {
    // Create an array for the caller's children.
    FamilyGroupChild[] memory tempFamilyGroup = new FamilyGroupChild[](
      _familyGroups[msg.sender].length
    );

    // Get the caller's family group.
    address[] storage familyGroup = _familyGroups[msg.sender];
    // Loop through the family group.
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Get a child.
      tempFamilyGroup[i] = FamilyGroupChild(
        _children[familyGroup[i]],
        balanceOf(_children[familyGroup[i]].childAddress)
      );
    }

    // Return family group.
    return tempFamilyGroup;
  }

  /**
   * Get the caller's account type: Parent or Child.
   * If not registered, return empty string.
   */
  function getAccountType() external view returns (string memory) {
    if (_parents[msg.sender].exists) {
      return "Parent";
    } else if (_children[msg.sender].exists) {
      return "Child";
    }

    return "";
  }

  /************************/
  /******** TASKS *********/
  /************************/

  /**
   * Add a task and assign it to a child.
   */
  function addTask(
    address child_,
    string memory description_,
    uint256 reward_,
    uint256 dueDate_
  ) external onlyParent {
    // Check if the address provided belongs to a child.
    require(_children[child_].exists, "Address does not belong to a child.");
    // Check if the child is part of the caller's family group.
    require(
      _children[child_].familyGroup == msg.sender,
      "This child is not part of your family group."
    );

    // Increment tasks counter.
    tasksCounter++;

    // Add task.
    _tasks[tasksCounter] = Task(
      tasksCounter,
      child_,
      description_,
      reward_,
      dueDate_,
      false,
      0,
      false,
      0,
      true
    );

    // Assign task to the child.
    _childTasks[child_].push(tasksCounter);

    // Emit event.
    emit TaskAdded(tasksCounter, child_, description_, reward_, dueDate_);
  }

  /**
   * Complete a task.
   */
  function completeTask(uint256 taskId_) external onlyChild {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the task belongs to the caller.
    require(_tasks[taskId_].assignedTo == msg.sender, "This is not your task.");
    // Check if the task was not completed.
    require(!_tasks[taskId_].completed, "You already completed this task.");
    // Check if the task is not expired.
    if (_tasks[taskId_].dueDate > 0) {
      require(
        _tasks[taskId_].dueDate >= block.timestamp,
        "This task is expired."
      );
    }

    // Complete task.
    _tasks[taskId_].completed = true;
    _tasks[taskId_].completionDate = block.timestamp;

    // Emit event.
    emit TaskCompleted(taskId_, msg.sender, _tasks[taskId_].completionDate);
  }

  /**
   * Approve task completion.
   */
  function approveTaskCompletion(uint256 taskId_) external onlyParent {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the child the task is assigned to is part of the caller's family group.
    require(
      _children[_tasks[taskId_].assignedTo].familyGroup == msg.sender,
      "The child this task is assigned to is not part of your family group."
    );
    // Check if the task has been completed.
    require(_tasks[taskId_].completed, "Task has not been completed yet.");
    // Check if the task completion was not approved.
    require(!_tasks[taskId_].approved, "Task completion was already approved.");

    // Approve task completion.
    _tasks[taskId_].approved = true;
    _tasks[taskId_].approvalDate = block.timestamp;

    // Send token reward to the child.
    _mint(_tasks[taskId_].assignedTo, _tasks[taskId_].reward);

    // // Emit event.
    emit TaskApproved(taskId_, msg.sender, _tasks[taskId_].approvalDate);
  }

  /**
   * Get a child's tasks.
   */
  function getTasks(address child_) external view returns (Task[] memory) {
    // Check if the address provided belongs to a child.
    require(_children[child_].exists, "Address does not belong to a child.");

    // Create an array for the child's tasks.
    Task[] memory tasks = new Task[](_childTasks[child_].length);

    // Get the child's task IDs.
    uint256[] storage childTasks = _childTasks[child_];
    // Loop through the task IDs.
    for (uint256 i = 0; i < childTasks.length; i++) {
      // Get task.
      tasks[i] = _tasks[childTasks[i]];
    }

    // Return child's tasks.
    return tasks;
  }

  /**
   * Get all the tasks in the caller's family group.
   */
  function getFamilyGroupTasks() external view returns (Task[] memory) {
    // Get the caller's family group.
    address[] memory familyGroup = _familyGroups[msg.sender];

    // Get the total of tasks in the family group.
    uint256 totalTasks;
    for (uint256 i = 0; i < familyGroup.length; i++) {
      totalTasks += _childTasks[familyGroup[i]].length;
    }

    // Create an array for the tasks.
    Task[] memory familyGroupTasks = new Task[](totalTasks);

    // Loop through the family group.
    uint256 taskIndex;
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Create an array for the current child's tasks.
      uint256[] storage childTasks = _childTasks[familyGroup[i]];
      // Loop through the child's tasks.
      for (uint256 j = 0; j < childTasks.length; j++) {
        //Get child's task.
        familyGroupTasks[taskIndex] = _tasks[childTasks[j]];
        taskIndex++;
      }
    }

    // Return family group's tasks.
    return familyGroupTasks;
  }

  /************************/
  /******* REWARDS ********/
  /************************/

  /**
   * Add a reward and assign it to a child.
   */
  function addReward(
    address child_,
    string memory description_,
    uint256 price_
  ) external onlyParent {
    // Check if the address provided belongs to a child.
    require(_children[child_].exists, "Address does not belong to a child.");
    // Check if the child is part of the caller's family group.
    require(
      _children[child_].familyGroup == msg.sender,
      "This child is not part of your family group."
    );

    // Increment rewards counter.
    rewardsCounter++;

    // Add reward.
    _rewards[rewardsCounter] = Reward(
      rewardsCounter,
      child_,
      description_,
      price_,
      false,
      0,
      false,
      0,
      false,
      0,
      true
    );

    // Assign reward to the child.
    _childRewards[child_].push(rewardsCounter);

    // Emit event.
    emit RewardAdded(rewardsCounter, child_, description_, price_);
  }

  /**
   * Purchase a reward.
   */
  function purchaseReward(uint256 rewardId_) external onlyChild {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the reward belongs to the caller.
    require(
      _rewards[rewardId_].assignedTo == msg.sender,
      "This is not your reward."
    );
    // Check if the reward was not purchased.
    require(
      !_rewards[rewardId_].purchased,
      "You already purchased this reward."
    );
    // Check if child has enough tokens.
    require(
      balanceOf(msg.sender) >= _rewards[rewardId_].price,
      "You don't have enough tokens (CK)."
    );

    // Burn tokens.
    _burn(msg.sender, _rewards[rewardId_].price);

    // Purchase reward.
    _rewards[rewardId_].purchased = true;
    _rewards[rewardId_].purchaseDate = block.timestamp;

    // Emit event.
    emit RewardPurchased(
      rewardId_,
      _rewards[rewardId_].price,
      msg.sender,
      _rewards[rewardId_].purchaseDate
    );
  }

  /**
   * Redeem a reward.
   */
  function redeemReward(uint256 rewardId_) external onlyChild {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the reward belongs to the caller.
    require(
      _rewards[rewardId_].assignedTo == msg.sender,
      "This is not your reward."
    );
    // Check if the reward has been purchased.
    require(
      _rewards[rewardId_].purchased,
      "You haven't purchased this reward yet."
    );
    // Check if the reward was not redeemed.
    require(!_rewards[rewardId_].redeemed, "You already redeemed this reward.");

    // Redeem reward.
    _rewards[rewardId_].redeemed = true;
    _rewards[rewardId_].redemptionDate = block.timestamp;

    // Emit event.
    emit RewardRedeemed(
      rewardId_,
      msg.sender,
      _rewards[rewardId_].redemptionDate
    );
  }

  /**
   * Approve reward redemption.
   */
  function approveRewardRedemption(uint256 rewardId_) external onlyParent {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the child the reward is assigned to is part of the caller's family group.
    require(
      _children[_rewards[rewardId_].assignedTo].familyGroup == msg.sender,
      "The child this reward is assigned to is not part of your family group."
    );
    // Check if the reward has been redeemed.
    require(_rewards[rewardId_].redeemed, "Reward has not been redeemed yet.");

    // Check if the reward redemption was not approved.
    require(
      !_rewards[rewardId_].approved,
      "Reward redemption was already approved."
    );

    // Approve reward redemption.
    _rewards[rewardId_].approved = true;
    _rewards[rewardId_].approvalDate = block.timestamp;

    // Emit event.
    emit RewardApproved(
      rewardId_,
      msg.sender,
      _rewards[rewardId_].approvalDate
    );
  }

  /**
   * Get a child's rewards.
   */
  function getRewards(address child_) external view returns (Reward[] memory) {
    // Check if the address provided belongs to a child.
    require(_children[child_].exists, "Address does not belong to a child.");

    // Create an array for the child's rewards.
    Reward[] memory rewards = new Reward[](_childRewards[child_].length);

    // Get the child's reward IDs.
    uint256[] storage childRewards = _childRewards[child_];
    // Loop through the reward IDs.
    for (uint256 i = 0; i < childRewards.length; i++) {
      // Get reward.
      rewards[i] = _rewards[childRewards[i]];
    }

    // Return child's rewards.
    return rewards;
  }

  /**
   * Get all the rewards in the caller's family group.
   */
  function getFamilyGroupRewards() external view returns (Reward[] memory) {
    // Get the caller's family group.
    address[] memory familyGroup = _familyGroups[msg.sender];

    // Get the total of rewards in the family group.
    uint256 totalRewards;
    for (uint256 i = 0; i < familyGroup.length; i++) {
      totalRewards += _childRewards[familyGroup[i]].length;
    }

    // Create an array for the rewards.
    Reward[] memory familyGroupRewards = new Reward[](totalRewards);

    // Loop through the family group.
    uint256 rewardIndex;
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Create an array for the current child's rewards.
      uint256[] storage childRewards = _childRewards[familyGroup[i]];
      // Loop through the child's rewards.
      for (uint256 j = 0; j < childRewards.length; j++) {
        //Get child's reward.
        familyGroupRewards[rewardIndex] = _rewards[childRewards[j]];
        rewardIndex++;
      }
    }

    // Return family group's rewards.
    return familyGroupRewards;
  }
}

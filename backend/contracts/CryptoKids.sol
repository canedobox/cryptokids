// SPDX-License-Identifier: MIT
// Author: @canedobox

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoKids is ERC20 {
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

  struct ChildTasksCounter {
    uint256 assigned;
    uint256 expired;
    uint256 completed;
    uint256 approved;
    uint256 tokensEarned;
  }

  struct ChildRewardsCounter {
    uint256 assigned;
    uint256 purchased;
    uint256 redeemed;
    uint256 approved;
    uint256 tokensSpent;
  }

  struct AccountsCounter {
    uint256 parentsRegistered;
    uint256 parentsDeleted;
    uint256 childrenAdded;
    uint256 childrenRemoved;
  }

  struct Profile {
    string accountType;
    string name;
  }

  struct FamilyGroupChild {
    Child child;
    uint256 balance;
    ChildTasksCounter tasksCounter;
    ChildRewardsCounter rewardsCounter;
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

  struct TasksCounter {
    uint256 added;
    uint256 deleted;
    uint256 completed;
    uint256 approved;
    uint256 tokensEarned;
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

  struct RewardsCounter {
    uint256 added;
    uint256 deleted;
    uint256 purchased;
    uint256 redeemed;
    uint256 approved;
    uint256 tokensSpent;
  }

  /***** MAPPINGS *****/
  mapping(address => Parent) private _parents;
  mapping(address => Child) private _children;
  mapping(address => address[]) private _familyGroups;
  mapping(uint256 => Task) private _tasks;
  mapping(address => uint256[]) private _childTasks;
  mapping(uint256 => Reward) private _rewards;
  mapping(address => uint256[]) private _childRewards;

  /***** COUNTERS *****/
  AccountsCounter public accountsCounter;
  TasksCounter public tasksCounter;
  RewardsCounter public rewardsCounter;

  /***** EVENTS *****/
  // Family group events.
  event ParentRegistered(address parent);
  event ParentProfileEdited(address parent);
  event ParentDeleted(address parent);
  event ChildAdded(address familyGroup, address child);
  event ChildProfileEdited(address child);
  event ChildRemoved(address familyGroup, address child);
  // Task events.
  event TaskAdded(
    uint256 taskId,
    address assignedTo,
    string description,
    uint256 reward,
    uint256 dueDate
  );
  event TaskEdited(
    uint256 taskId,
    string description,
    uint256 reward,
    uint256 dueDate
  );
  event TaskDeleted(uint256 taskId);
  event TaskCompleted(
    uint256 taskId,
    address completedBy,
    uint256 completionDate
  );
  event TaskCompletionCancelled(uint256 taskId);
  event TaskCompletionApproved(
    uint256 taskId,
    address approvedBy,
    uint256 approvalDate
  );
  // Reward events.
  event RewardAdded(
    uint256 rewardId,
    address assignedTo,
    string description,
    uint256 price
  );
  event RewardEdited(uint256 rewardId, string description, uint256 price);
  event RewardDeleted(uint256 rewardId);
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
  event RewardRedemptionCancelled(uint256 rewardId);
  event RewardRedemptionApproved(
    uint256 rewardId,
    address approvedBy,
    uint256 approvalDate
  );

  /***** CONSTRUCTOR *****/
  constructor(
    string memory name_,
    string memory symbol_
  ) ERC20(name_, symbol_) {
    // ...
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
    // Check if the caller is already registered as a parent.
    require(
      !_parents[msg.sender].exists,
      "You are already registered as a parent."
    );
    // Check if the caller is already registered as a child.
    require(
      !_children[msg.sender].exists,
      "You are already registered as a child."
    );

    // Add caller to the parents mapping.
    _parents[msg.sender] = Parent(name_, true);

    // Increment parents registered counter.
    accountsCounter.parentsRegistered++;

    // Emit event.
    emit ParentRegistered(msg.sender);
  }

  /**
   * Delete caller's parent account and family group.
   */
  function deleteParent() external onlyParent {
    // Remove children from the caller's family group.
    // Get the caller's family group.
    address[] memory familyGroup = _familyGroups[msg.sender];
    // Loop through the family group.
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Remove child from the family group.
      removeChild(familyGroup[i]);
    }

    // Delete parent.
    delete _parents[msg.sender];
    // Delete caller's family group.
    delete _familyGroups[msg.sender];

    // Increment parents deleted counter.
    accountsCounter.parentsDeleted++;

    // Emit event.
    emit ParentDeleted(msg.sender);
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

    // Increment children added counter.
    accountsCounter.childrenAdded++;

    // Emit event.
    emit ChildAdded(msg.sender, child_);
  }

  /**
   * Remove a child from the caller's family group.
   * This function will NOT delete child's tasks, rewards or tokens.
   */
  function removeChild(address child_) public onlyParent {
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

    // Increment children removed counter.
    accountsCounter.childrenRemoved++;

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
    address[] memory familyGroup = _familyGroups[msg.sender];
    // Loop through the family group.
    for (uint256 i = 0; i < familyGroup.length; i++) {
      // Get a child.
      tempFamilyGroup[i] = FamilyGroupChild(
        _children[familyGroup[i]],
        balanceOf(_children[familyGroup[i]].childAddress),
        _getChildTasksCounter(_children[familyGroup[i]].childAddress),
        _getChildRewardsCounter(_children[familyGroup[i]].childAddress)
      );
    }

    // Return family group.
    return tempFamilyGroup;
  }

  /**
   * Get the caller's profile.
   * If caller is not registered, return "not-registered" for account type
   * and an empty string for name.
   */
  function getProfile() external view returns (Profile memory) {
    // Set defaults for not registered.
    string memory accountType = "not-registered";
    string memory name = "";

    // If caller is registered as a parent.
    if (_parents[msg.sender].exists) {
      accountType = "parent";
      name = _parents[msg.sender].name;
    }
    // If caller is registered as a child.
    else if (_children[msg.sender].exists) {
      accountType = "child";
      name = _children[msg.sender].name;
    }

    // Return caller's profile.
    return Profile(accountType, name);
  }

  /**
   * Edit caller's profile.
   */
  function editProfile(string memory name_) external {
    // Check if caller is registered as either a parent or a child.
    require(
      (_parents[msg.sender].exists || _children[msg.sender].exists),
      "You are not registered."
    );

    // If caller is registered as a parent.
    if (_parents[msg.sender].exists) {
      // Updated parent profile.
      _parents[msg.sender].name = name_;
      // Emit event.
      emit ParentProfileEdited(msg.sender);
    }
    // If caller is registered as a child.
    else if (_children[msg.sender].exists) {
      // Updated child profile.
      _children[msg.sender].name = name_;
      // Emit event.
      emit ChildProfileEdited(msg.sender);
    }
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

    // Increment tasks added counter.
    tasksCounter.added++;

    // Add task.
    _tasks[tasksCounter.added] = Task(
      tasksCounter.added,
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
    _childTasks[child_].push(tasksCounter.added);

    // Emit event.
    emit TaskAdded(tasksCounter.added, child_, description_, reward_, dueDate_);
  }

  /**
   * Edit a task.
   */
  function editTask(
    uint256 taskId_,
    string memory description_,
    uint256 reward_,
    uint256 dueDate_
  ) external onlyParent {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the child the task is assigned to is part of the caller's family group.
    require(
      _children[_tasks[taskId_].assignedTo].familyGroup == msg.sender,
      "The child this task is assigned to is not part of your family group."
    );
    // Check if the task has not been completed.
    require(!_tasks[taskId_].completed, "Task has already been completed.");

    // Update task details.
    _tasks[taskId_].description = description_;
    _tasks[taskId_].reward = reward_;
    _tasks[taskId_].dueDate = dueDate_;

    // Emit event.
    emit TaskEdited(taskId_, description_, reward_, dueDate_);
  }

  /**
   * Delete a task.
   */
  function deleteTask(uint256 taskId_) external onlyParent {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the child the task is assigned to is part of the caller's family group.
    require(
      _children[_tasks[taskId_].assignedTo].familyGroup == msg.sender,
      "The child this task is assigned to is not part of your family group."
    );
    // Check if the task has not been completed.
    require(!_tasks[taskId_].completed, "Task has already been completed.");

    // Remove task from the child's tasks.
    // Get the child's tasks.
    uint256[] storage childTasks = _childTasks[_tasks[taskId_].assignedTo];
    // Loop through the child's tasks.
    for (uint256 i = 0; i < childTasks.length; i++) {
      // Find the index of the task in the array.
      if (childTasks[i] == taskId_) {
        // Replace the task with the last task in the array and...
        childTasks[i] = childTasks[childTasks.length - 1];
        // ... delete the last task.
        childTasks.pop();
        // Stop the loop.
        break;
      }
    }

    // Delete task.
    delete _tasks[taskId_];

    // Increment tasks deleted counter.
    tasksCounter.deleted++;

    // Emit event.
    emit TaskDeleted(taskId_);
  }

  /**
   * Complete a task.
   */
  function completeTask(uint256 taskId_) external onlyChild {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the task belongs to the caller.
    require(_tasks[taskId_].assignedTo == msg.sender, "This is not your task.");
    // Check if the task has not been completed.
    require(!_tasks[taskId_].completed, "You already completed this task.");
    // Check if the task has not expired.
    if (_tasks[taskId_].dueDate > 0) {
      require(
        _tasks[taskId_].dueDate >= block.timestamp,
        "This task has expired."
      );
    }

    // Complete task.
    _tasks[taskId_].completed = true;
    _tasks[taskId_].completionDate = block.timestamp;

    // Increment tasks completed counter.
    tasksCounter.completed++;

    // Emit event.
    emit TaskCompleted(taskId_, msg.sender, _tasks[taskId_].completionDate);
  }

  /**
   * Cancel task completion.
   */
  function cancelTaskCompletion(uint256 taskId_) external onlyChild {
    // Check if the task ID is valid.
    require(_tasks[taskId_].exists, "Invalid task ID.");
    // Check if the task belongs to the caller.
    require(_tasks[taskId_].assignedTo == msg.sender, "This is not your task.");
    // Check if the task has been completed.
    require(_tasks[taskId_].completed, "You haven't completed this task yet.");
    // Check if the task completion has not been approved.
    require(
      !_tasks[taskId_].approved,
      "Task completion has already been approved."
    );

    // Cancel task completion.
    _tasks[taskId_].completed = false;
    _tasks[taskId_].completionDate = 0;

    // Decrement tasks completed counter.
    tasksCounter.completed--;

    // Emit event.
    emit TaskCompletionCancelled(taskId_);
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
    // Check if the task completion has not been approved.
    require(
      !_tasks[taskId_].approved,
      "Task completion has already been approved."
    );

    // Approve task completion.
    _tasks[taskId_].approved = true;
    _tasks[taskId_].approvalDate = block.timestamp;

    // Send token reward to the child.
    _mint(_tasks[taskId_].assignedTo, _tasks[taskId_].reward);
    // Increment tokens earned counter.
    tasksCounter.tokensEarned += _tasks[taskId_].reward;

    // Increment tasks approved counter.
    tasksCounter.approved++;

    // // Emit event.
    emit TaskCompletionApproved(
      taskId_,
      msg.sender,
      _tasks[taskId_].approvalDate
    );
  }

  /**
   * Get child's tasks.
   */
  function getChildTasks() external view onlyChild returns (Task[] memory) {
    // Create an array for the child's tasks.
    Task[] memory childTasks = new Task[](_childTasks[msg.sender].length);

    // Get the child's task IDs.
    uint256[] memory childTaskIDs = _childTasks[msg.sender];
    // Loop through the task IDs.
    for (uint256 i = 0; i < childTaskIDs.length; i++) {
      // Get a task.
      childTasks[i] = _tasks[childTaskIDs[i]];
    }

    // Return child's tasks.
    return childTasks;
  }

  /**
   * Get child's tasks counter.
   */
  function _getChildTasksCounter(
    address child_
  ) internal view returns (ChildTasksCounter memory) {
    // Tasks counters.
    uint256 expiredTasksCounter = 0;
    uint256 completedTasksCounter = 0;
    uint256 approvedTasksCounter = 0;
    uint256 tokensEarned = 0;

    // Create an array for the child's tasks.
    Task[] memory childTasks = new Task[](_childTasks[child_].length);
    // Get the child's task IDs.
    uint256[] memory childTaskIDs = _childTasks[child_];
    // Loop through the task IDs.
    for (uint256 i = 0; i < childTaskIDs.length; i++) {
      // Get a task.
      childTasks[i] = _tasks[childTaskIDs[i]];
    }

    // Loop through the child's tasks.
    for (uint256 i = 0; i < childTasks.length; i++) {
      // If task has been approved.
      if (childTasks[i].approved) {
        approvedTasksCounter++;
        tokensEarned += childTasks[i].reward;
      }
      // If task has been completed.
      else if (childTasks[i].completed) {
        completedTasksCounter++;
      }
      // If task has been expired.
      else if (
        childTasks[i].dueDate > 0 && childTasks[i].dueDate <= block.timestamp
      ) {
        expiredTasksCounter++;
      }
    }

    // Return child's tasks counter.
    return
      ChildTasksCounter(
        childTasks.length,
        expiredTasksCounter,
        completedTasksCounter,
        approvedTasksCounter,
        tokensEarned
      );
  }

  /**
   * Get all the tasks in the caller's family group.
   */
  function getFamilyGroupTasks()
    external
    view
    onlyParent
    returns (Task[] memory)
  {
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
      uint256[] memory childTasks = _childTasks[familyGroup[i]];
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

    // Increment rewards added counter.
    rewardsCounter.added++;

    // Add reward.
    _rewards[rewardsCounter.added] = Reward(
      rewardsCounter.added,
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
    _childRewards[child_].push(rewardsCounter.added);

    // Emit event.
    emit RewardAdded(rewardsCounter.added, child_, description_, price_);
  }

  /**
   * Edit a reward.
   */
  function editReward(
    uint256 rewardId_,
    string memory description_,
    uint256 price_
  ) external onlyParent {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the child the reward is assigned to is part of the caller's family group.
    require(
      _children[_rewards[rewardId_].assignedTo].familyGroup == msg.sender,
      "The child this reward is assigned to is not part of your family group."
    );
    // Check if the reward has not been purchased.
    require(
      !_rewards[rewardId_].purchased,
      "Reward has already been purchased."
    );

    // Update reward details.
    _rewards[rewardId_].description = description_;
    _rewards[rewardId_].price = price_;

    // Emit event.
    emit RewardEdited(rewardId_, description_, price_);
  }

  /**
   * Delete a reward.
   */
  function deleteReward(uint256 rewardId_) external onlyParent {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the child the reward is assigned to is part of the caller's family group.
    require(
      _children[_rewards[rewardId_].assignedTo].familyGroup == msg.sender,
      "The child this reward is assigned to is not part of your family group."
    );
    // Check if the reward has not been purchased.
    require(
      !_rewards[rewardId_].purchased,
      "Reward has already been purchased."
    );

    // Remove reward from the child's rewards.
    // Get the child's rewards.
    uint256[] storage childRewards = _childRewards[
      _rewards[rewardId_].assignedTo
    ];
    // Loop through the child's rewards.
    for (uint256 i = 0; i < childRewards.length; i++) {
      // Find the index of the reward in the array.
      if (childRewards[i] == rewardId_) {
        // Replace the reward with the last reward in the array and...
        childRewards[i] = childRewards[childRewards.length - 1];
        // ... delete the last reward.
        childRewards.pop();
        // Stop the loop.
        break;
      }
    }

    // Delete reward.
    delete _rewards[rewardId_];

    // Increment rewards deleted counter.
    rewardsCounter.deleted++;

    // Emit event.
    emit RewardDeleted(rewardId_);
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
    // Check if the reward has not been purchased.
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
    // Increment tokens spent counter.
    rewardsCounter.tokensSpent += _rewards[rewardId_].price;

    // Purchase reward.
    _rewards[rewardId_].purchased = true;
    _rewards[rewardId_].purchaseDate = block.timestamp;

    // Increment rewards purchased counter.
    rewardsCounter.purchased++;

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
    // Check if the reward has not been redeemed.
    require(!_rewards[rewardId_].redeemed, "You already redeemed this reward.");

    // Redeem reward.
    _rewards[rewardId_].redeemed = true;
    _rewards[rewardId_].redemptionDate = block.timestamp;

    // Increment rewards redeemed counter.
    rewardsCounter.redeemed++;

    // Emit event.
    emit RewardRedeemed(
      rewardId_,
      msg.sender,
      _rewards[rewardId_].redemptionDate
    );
  }

  /**
   * Cancel reward redemption.
   */
  function cancelRewardRedemption(uint256 rewardId_) external onlyChild {
    // Check if the reward ID is valid.
    require(_rewards[rewardId_].exists, "Invalid reward ID.");
    // Check if the reward belongs to the caller.
    require(
      _rewards[rewardId_].assignedTo == msg.sender,
      "This is not your reward."
    );
    // Check if the reward has not been redeemed.
    require(
      _rewards[rewardId_].redeemed,
      "You haven't redeemed this reward yet."
    );
    // Check if the reward redemption has not been approved.
    require(
      !_rewards[rewardId_].approved,
      "Reward redemption has already been approved."
    );

    // Cancel reward redemption.
    _rewards[rewardId_].redeemed = false;
    _rewards[rewardId_].redemptionDate = 0;

    // Decrement rewards redeemed counter.
    rewardsCounter.redeemed--;

    // Emit event.
    emit RewardRedemptionCancelled(rewardId_);
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

    // Check if the reward redemption has not been approved.
    require(
      !_rewards[rewardId_].approved,
      "Reward redemption has already been approved."
    );

    // Approve reward redemption.
    _rewards[rewardId_].approved = true;
    _rewards[rewardId_].approvalDate = block.timestamp;

    // Increment rewards approved counter.
    rewardsCounter.approved++;

    // Emit event.
    emit RewardRedemptionApproved(
      rewardId_,
      msg.sender,
      _rewards[rewardId_].approvalDate
    );
  }

  /**
   * Get child's rewards.
   */
  function getChildRewards() external view onlyChild returns (Reward[] memory) {
    // Create an array for the child's rewards.
    Reward[] memory childRewards = new Reward[](
      _childRewards[msg.sender].length
    );

    // Get the child's reward IDs.
    uint256[] memory childRewardIDs = _childRewards[msg.sender];
    // Loop through the reward IDs.
    for (uint256 i = 0; i < childRewardIDs.length; i++) {
      // Get a reward.
      childRewards[i] = _rewards[childRewardIDs[i]];
    }

    // Return child's rewards.
    return childRewards;
  }

  /**
   * Get child's rewards counter.
   */
  function _getChildRewardsCounter(
    address child_
  ) internal view returns (ChildRewardsCounter memory) {
    // Rewards counters.
    uint256 purchasedRewardsCounter = 0;
    uint256 redeemedRewardsCounter = 0;
    uint256 approvedRewardsCounter = 0;
    uint256 tokensSpent = 0;

    // Create an array for the child's rewards.
    Reward[] memory childRewards = new Reward[](_childRewards[child_].length);
    // Get the child's reward IDs.
    uint256[] memory childRewardIDs = _childRewards[child_];
    // Loop through the reward IDs.
    for (uint256 i = 0; i < childRewardIDs.length; i++) {
      // Get a reward.
      childRewards[i] = _rewards[childRewardIDs[i]];
    }

    // Loop through the child's rewards.
    for (uint256 i = 0; i < childRewards.length; i++) {
      // If reward has been approved.
      if (childRewards[i].approved) {
        approvedRewardsCounter++;
        tokensSpent += childRewards[i].price;
      }
      // If reward has been redeemed.
      else if (childRewards[i].redeemed) {
        redeemedRewardsCounter++;
        tokensSpent += childRewards[i].price;
      }
      // If reward has been purchased.
      else if (childRewards[i].purchased) {
        purchasedRewardsCounter++;
        tokensSpent += childRewards[i].price;
      }
    }

    // Return child's rewards counter.
    return
      ChildRewardsCounter(
        childRewards.length,
        purchasedRewardsCounter,
        redeemedRewardsCounter,
        approvedRewardsCounter,
        tokensSpent
      );
  }

  /**
   * Get all the rewards in the caller's family group.
   */
  function getFamilyGroupRewards()
    external
    view
    onlyParent
    returns (Reward[] memory)
  {
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
      uint256[] memory childRewards = _childRewards[familyGroup[i]];
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

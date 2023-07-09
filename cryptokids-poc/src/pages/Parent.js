import Card from "../components/Card";
import FamilyGroup from "../components/FamilyGroup";
import Tasks from "../components/Tasks";
import Rewards from "../components/Rewards";

const Parent = ({
  contract,
  tokenSymbol,
  setErrorMessage,
  utils,
  familyGroup,
  tasksCounter,
  openTasks,
  completedTasks,
  approvedTasks,
  expiredTasks,
  rewardsCounter,
  openRewards,
  purchasedRewards,
  redeemedRewards,
  approvedRewards
}) => {
  /***** FAMILY GROUP *****/

  /**
   * Add a child to the contract.
   * @param event - Event that triggered the function.
   */
  const addChild = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Prompt user to enter child's details.
    const childAddress = prompt("Enter child wallet address:");
    const childName = prompt("Enter child name:");

    // Call the `addChild` function on the contract.
    contract.addChild(childAddress, childName).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  /**
   * Remove a child from the contract.
   * @param event - Event that triggered the function.
   * @param child - Child to be removed (child.childAddress).
   */
  const removeChild = (event, child) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `removeChild` function on the contract.
    contract.removeChild(child.childAddress).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  /***** TASKS *****/

  /**
   * Add a task to the contract.
   * @param event - Event that triggered the function.
   */
  const addTask = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Prompt user to enter task's details.
    const childAddress = prompt("Enter child wallet address:");
    const taskDescription = prompt("Enter task description:");
    const taskReward = utils.numberToEther(
      prompt("Enter task reward (" + tokenSymbol + "):")
    );
    const taskDueDate = prompt(
      "Enter task due date in Unix Timestamp: (optional)"
    );

    // Call the `addTask` function on the contract.
    contract
      .addTask(
        childAddress,
        taskDescription,
        taskReward,
        taskDueDate ? taskDueDate : "0"
      )
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  /**
   * Approve task completion in the contract.
   * @param event - Event that triggered the function.
   * @param task - Task to be approved (task.taskId).
   */
  const approveTaskCompletion = (event, task) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `approveTaskCompletion` function on the contract.
    contract.approveTaskCompletion(task.taskId.toString()).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  /***** REWARDS *****/
  /**
   * Add a reward to the contract.
   * @param event - Event that triggered the function.
   */
  const addReward = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Prompt user to enter reward's details.
    const childAddress = prompt("Enter child wallet address:");
    const rewardDescription = prompt("Enter reward description:");
    const rewardPrice = utils.numberToEther(
      prompt("Enter reward price (" + tokenSymbol + "):")
    );

    // Call the `addReward` function on the contract.
    contract
      .addReward(childAddress, rewardDescription, rewardPrice)
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  /**
   * Approve reward redemption in the contract.
   * @param event - Event that triggered the function.
   * @param task - Reward to be approved (reward.rewardId).
   */
  const approveRewardRedemption = (event, reward) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `approveRewardRedemption` function on the contract.
    contract
      .approveRewardRedemption(reward.rewardId.toString())
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="flex flex-col gap-8 break-words">
      {/* Family Group */}
      <Card
        headerTitle={"Family Group"}
        headerCta={{ onClick: addChild, label: "Add Child +" }}
      >
        <FamilyGroup
          tokenSymbol={tokenSymbol}
          utils={utils}
          familyGroup={familyGroup}
          removeChild={removeChild}
        />
      </Card>

      {/* Tasks */}
      <Card
        headerTitle={"Tasks"}
        headerCta={{ onClick: addTask, label: "Add Task +" }}
      >
        <Tasks
          tokenSymbol={tokenSymbol}
          utils={utils}
          tasksCounter={tasksCounter}
          taskLists={[completedTasks, openTasks, expiredTasks, approvedTasks]}
          tableTitle={["Waiting Approval", "Open", "Expired", "Completed"]}
          dateLabel={[
            "Completion Date",
            "Due Date",
            "Expiration Date",
            "Approval Date"
          ]}
          dateValue={["completionDate", "dueDate", "dueDate", "approvalDate"]}
          rowCta={[
            { onClick: approveTaskCompletion, label: "Approve" },
            null,
            null,
            null
          ]}
          noTasksMessage={"No tasks in your family group."}
        />
      </Card>

      {/* Rewards */}
      <Card
        headerTitle={"Rewards"}
        headerCta={{ onClick: addReward, label: "Add Reward +" }}
      >
        <Rewards
          tokenSymbol={tokenSymbol}
          utils={utils}
          rewardsCounter={rewardsCounter}
          rewardLists={[
            redeemedRewards,
            openRewards,
            purchasedRewards,
            approvedRewards
          ]}
          tableTitle={["Waiting Approval", "Open", "Purchased", "Redeemed"]}
          dateLabel={["Redemption Date", "", "Purchase Date", "Approval Date"]}
          dateValue={[
            "redemptionDate",
            "approvalDate",
            "purchaseDate",
            "approvalDate"
          ]}
          rowCta={[
            { onClick: approveRewardRedemption, label: "Approve" },
            null,
            null,
            null
          ]}
          noRewardsMessage={"No rewards in your family group."}
        />
      </Card>
    </div>
  );
};

export default Parent;

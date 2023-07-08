import Card from "../components/Card";
import Tasks from "../components/Tasks";
import Rewards from "../components/Rewards";

const Child = ({
  contract,
  tokenSymbol,
  accountBalance,
  setErrorMessage,
  utils,
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
  /***** TASKS *****/

  /**
   * Complete a task in the contract.
   * @param event - Event that triggered the function.
   * @param task - Task to be approved (task.taskId).
   */
  const completeTask = (event, task) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `completeTask` function on the contract.
    contract.completeTask(task.taskId.toString()).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  /***** REWARDS *****/

  /**
   * Redeem a reward in the contract.
   * @param event - Event that triggered the function.
   * @param reward - Reward to be redeemed (reward.rewardId).
   */
  const redeemReward = (event, reward) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `redeemReward` function on the contract.
    contract.redeemReward(reward.rewardId.toString()).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  /***** MARKETPLACE *****/

  /**
   * Purchase a reward in the contract.
   * @param event - Event that triggered the function.
   * @param reward - Reward to be purchased (reward.rewardId).
   */
  const purchaseReward = (event, reward) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `purchaseReward` function on the contract.
    contract.purchaseReward(reward.rewardId.toString()).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  return (
    <div className="flex flex-col gap-8 break-words">
      {/* Tasks */}
      <Card headerTitle={"Tasks"}>
        <Tasks
          tokenSymbol={tokenSymbol}
          utils={utils}
          tasksCounter={tasksCounter}
          taskLists={[completedTasks, openTasks, approvedTasks, expiredTasks]}
          tableTitle={["Waiting Approval", "Open", "Completed", "Expired"]}
          dateLabel={[
            "Completion Date",
            "Due Date",
            "Approval Date",
            "Expiration Date"
          ]}
          dateValue={["completionDate", "dueDate", "approvalDate", "dueDate"]}
          rowCta={[
            null,
            { onClick: completeTask, label: "Complete" },
            null,
            null
          ]}
          isChild={true}
          noTasksMessage={"No tasks assigned to you yet."}
        />
      </Card>

      {/* Rewards */}
      <Card headerTitle={"Rewards"}>
        <Rewards
          tokenSymbol={tokenSymbol}
          utils={utils}
          rewardsCounter={rewardsCounter - openRewards.length}
          rewardLists={[redeemedRewards, purchasedRewards, approvedRewards]}
          tableTitle={["Waiting Approval", "Purchased", "Redeemed"]}
          dateLabel={["Redemption Date", "Purchase Date", "Approval Date"]}
          dateValue={["redemptionDate", "purchaseDate", "approvalDate"]}
          rowCta={[
            null,
            { onClick: redeemReward, label: "Redeem" },
            null,
            null
          ]}
          isChild={true}
          noRewardsMessage={"You haven't purchased any rewards yet."}
        />
      </Card>

      {/* Marketplace */}
      <Card
        headerTitle={"Marketplace"}
        headerInfo={"Balance: " + accountBalance + " CK"}
      >
        <Rewards
          tokenSymbol={tokenSymbol}
          utils={utils}
          rewardsCounter={openRewards.length}
          rewardLists={[openRewards]}
          tableTitle={["Available Rewards"]}
          dateLabel={[""]}
          dateValue={["approvalDate"]}
          rowCta={[{ onClick: purchaseReward, label: "Buy" }]}
          noRewardsMessage={"No rewards available in the marketplace."}
          isChild={true}
          isMarketplace={true}
        />
      </Card>
    </div>
  );
};

export default Child;

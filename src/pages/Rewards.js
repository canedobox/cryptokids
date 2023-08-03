import { useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
// Pages
import Loading from "./Loading";
// Modals
import AddEditReward from "./modals/AddEditReward";
import DeleteReward from "./modals/DeleteReward";
// Icons
import { ReactComponent as IconEdit } from "../assets/icons/edit.svg";
import { ReactComponent as IconDelete } from "../assets/icons/delete.svg";

function Rewards({
  contract,
  accountType,
  accountBalance,
  rewardsCounter = 0,
  rewardLists,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variables to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isModalOpened2, setIsModalOpened2] = useState(false);
  // Selected reward.
  const [selectedReward, setSelectedReward] = useState(null);

  /***** METHODS *****/
  /**
   * Select a reward.
   * @param reward - Reward to be selected.
   */
  const selectReward = (reward, isDelete = false) => {
    // Set selected reward.
    setSelectedReward(reward);
    // Open modal.
    if (!isDelete) {
      utils.openModal(setIsModalOpened);
    } else {
      utils.openModal(setIsModalOpened2);
    }
  };

  /**
   * Deselect a reward.
   */
  const deselectReward = (formRef) => {
    // Deselect reward.
    setSelectedReward(null);
    // Close modal.
    if (formRef) {
      utils.closeModal(setIsModalOpened);
    } else {
      utils.closeModal(setIsModalOpened2);
    }
    // Check if form exists.
    if (formRef) {
      // Reset form.
      formRef.current.reset();
    }
  };

  /**
   * Add a reward to the contract.
   * @param event - Event that triggered the function.
   * @param formRef - Form reference.
   */
  const addReward = (event, formRef) => {
    event.preventDefault();
    setErrorMessage(null);

    // Get the reward price.
    const rewardPrice = utils.numberToEther(event.target.rewardPrice.value);

    // Call the `addReward` function on the contract.
    contract
      .addReward(
        event.target.childAddress.value,
        event.target.rewardDescription.value,
        rewardPrice
      )
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward(formRef);
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Edit a reward in the contract.
   * @param event - Event that triggered the function.
   * @param formRef - Form reference.
   */
  const editReward = (event, formRef) => {
    event.preventDefault();
    setErrorMessage(null);

    // Get the reward price.
    const rewardPrice = utils.numberToEther(event.target.rewardPrice.value);

    // Call the `editReward` function on the contract.
    contract
      .editReward(
        selectedReward.rewardId.toString(),
        event.target.rewardDescription.value,
        rewardPrice
      )
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward(formRef);
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Delete a reward from the contract.
   * @param reward - Reward to be deleted (reward.rewardId).
   */
  const deleteReward = (reward) => {
    setErrorMessage(null);

    // Call the `deleteReward` function on the contract.
    contract
      .deleteReward(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Redeem a reward in the contract.
   * @param reward - Reward to be redeemed (reward.rewardId).
   */
  const redeemReward = (reward) => {
    setErrorMessage(null);

    // Call the `redeemReward` function on the contract.
    contract
      .redeemReward(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Cancel reward redemption in the contract.
   * @param reward - Reward to be cancelled (reward.rewardId).
   */
  const cancelRewardRedemption = (reward) => {
    setErrorMessage(null);

    // Call the `cancelRewardRedemption` function on the contract.
    contract
      .cancelRewardRedemption(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Approve reward redemption in the contract.
   * @param reward - Reward to be approved (reward.rewardId).
   */
  const approveRewardRedemption = (reward) => {
    setErrorMessage(null);

    // Call the `approveRewardRedemption` function on the contract.
    contract
      .approveRewardRedemption(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectReward();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /***** VARIABLES *****/
  // Rewards config.
  const rewardsConfig = {
    parent: {
      noRewardsMessage: "You have not created any rewards yet.",
      rewardStatuses: ["Waiting Approval", "Open", "Purchased", "Redeemed"],
      dateValue: [
        "redemptionDate",
        "approvalDate",
        "purchaseDate",
        "approvalDate"
      ],
      rewardCta: [
        { onClick: approveRewardRedemption, label: "Approve" },
        null,
        null,
        null
      ],
      isEditable: [false, true, false, false]
    },
    child: {
      noRewardsMessage: "No rewards assigned to you yet.",
      rewardStatuses: ["Waiting Approval", "Purchased", "Redeemed"],
      dateValue: ["redemptionDate", "purchaseDate", "approvalDate"],
      rewardCta: [
        { onClick: cancelRewardRedemption, label: "Cancel" },
        { onClick: redeemReward, label: "Redeem" },
        null
      ],
      isEditable: [false, false, false]
    }
  };

  // Get current rewards config.
  const { noRewardsMessage, rewardStatuses, dateValue, rewardCta, isEditable } =
    rewardsConfig[accountType];

  // Return Rewards component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <>
          {/* Add/Edit reward modal */}
          <AddEditReward
            selectedReward={selectedReward}
            deselectReward={deselectReward}
            addReward={addReward}
            editReward={selectedReward && editReward}
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
            utils={utils}
          />
          {/* Delete reward modal */}
          <DeleteReward
            selectedReward={selectedReward}
            deselectReward={deselectReward}
            deleteReward={deleteReward}
            isModalOpened={isModalOpened2}
            setIsModalOpened={setIsModalOpened2}
            utils={utils}
          />
        </>
      )}
      {/* Page header */}
      {accountType === "parent" ? (
        <PageHeader
          title="Rewards"
          cta={{
            label: "Add Reward",
            onClick: () => {
              utils.openModal(setIsModalOpened);
            }
          }}
        />
      ) : (
        <PageHeader
          title="Rewards"
          accountBalance={accountBalance}
          utils={utils}
        />
      )}
      {/* Page content */}
      {/* If data is finished loading, render rewards. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col gap-4 p-4">
          {rewardsCounter === 0 ? (
            <div className="flex flex-1 items-center justify-center py-4">
              {noRewardsMessage}
            </div>
          ) : (
            rewardLists &&
            rewardLists.map((rewards, index) => {
              return (
                rewards.length > 0 && (
                  <div key={index} className="box-border flex flex-col">
                    {/* Status */}
                    <div className="flex flex-row items-center justify-start gap-4">
                      <span className="rounded-t-lg bg-gray-300 p-2 px-3 text-sm font-semibold uppercase">
                        {rewardStatuses[index]}
                      </span>
                      <span className="text-xs font-medium uppercase text-gray-500">{`${
                        rewards.length
                      } ${rewards.length > 1 ? "Rewards" : "Reward"}`}</span>
                    </div>
                    {/* Rewards */}
                    <div
                      className={twMerge(
                        "flex flex-col overflow-hidden rounded-xl rounded-tl-none border",
                        "border-gray-200 bg-white text-sm font-medium"
                      )}
                    >
                      {rewards.map((reward, rewardIndex) => {
                        return (
                          <div
                            key={rewardIndex}
                            className={twMerge(
                              "flex flex-row justify-between gap-4 border-b p-4",
                              "group border-gray-200 last:border-none hover:bg-gray-50"
                            )}
                          >
                            <div className="flex flex-row gap-4">
                              {/* Column 1 */}
                              {/* Child avatar */}
                              {accountType === "parent" && (
                                <div className="flex min-w-fit items-center justify-center">
                                  <Avatar
                                    seed={utils.getAvatarSeed(
                                      reward.assignedTo
                                    )}
                                    className="h-6 w-6"
                                  />
                                </div>
                              )}
                              {/* Column 2 */}
                              <div className="flex flex-col items-start justify-center">
                                {/* Reward description */}
                                <div className="w-full break-words">
                                  {reward.description}
                                </div>
                                {/* Reward date */}
                                {reward[dateValue[index]] > 0 && (
                                  <div className="w-full break-words text-xs text-gray-600">
                                    {new Date(
                                      reward[dateValue[index]] * 1000
                                    ).toDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Column 3 */}
                            <div
                              className={twMerge(
                                "flex flex-col items-end justify-center gap-1",
                                "xs:flex-row xs:items-center xs:gap-4"
                              )}
                            >
                              {/* Reward price */}
                              <div className="whitespace-nowrap font-semibold">
                                {utils.addTokenSymbol(reward.price)}
                              </div>
                              {/* Reward CTA */}
                              {rewardCta[index] && (
                                <div>
                                  {/* CTA button */}
                                  <Button
                                    variant="outlineSmall"
                                    onClick={() =>
                                      rewardCta[index].onClick(reward)
                                    }
                                  >
                                    {rewardCta[index].label}
                                  </Button>
                                </div>
                              )}
                              {/* Edit and delete */}
                              {isEditable[index] && (
                                <div className="flex flex-row gap-2">
                                  {/* Edit button */}
                                  <Button
                                    variant="iconEdit"
                                    onClick={() => {
                                      selectReward(reward);
                                    }}
                                  >
                                    <IconEdit />
                                  </Button>
                                  {/* Delete button */}
                                  <Button
                                    variant="iconDelete"
                                    onClick={() => {
                                      selectReward(reward, true);
                                    }}
                                  >
                                    <IconDelete />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              );
            })
          )}
        </div>
      )}
    </>
  );
}

export default Rewards;

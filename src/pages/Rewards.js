import { useEffect, useState } from "react";
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
import { ReactComponent as IconFilter } from "../assets/icons/filter.svg";
import { ReactComponent as IconEdit } from "../assets/icons/edit.svg";
import { ReactComponent as IconDelete } from "../assets/icons/delete.svg";

function Rewards({
  contract,
  accountType,
  accountBalance,
  allRewards,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // Rewards
  const [rewardsCounter, setRewardsCounter] = useState(0);
  const [rewardLists, setRewardLists] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  // Filter by child address.
  const [filterByChild, setFilterByChild] = useState(null);
  // State variables to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isModalOpened2, setIsModalOpened2] = useState(false);

  /***** METHODS *****/
  /**
   * Organize rewards into different categories based on their status:
   * approved, redeemed, purchased, or open.
   */
  const organizeRewards = () => {
    // Check if rewards exist.
    if (!allRewards) {
      return false;
    }

    // Local rewards counter.
    let rewardsCounter_ = allRewards.length;
    // Reset reward lists.
    setRewardLists([]);
    // Reward lists.
    const openRewards = [];
    const purchasedRewards = [];
    const redeemedRewards = [];
    const approvedRewards = [];

    // Loop through rewards.
    allRewards.map((reward) => {
      // If filter by child is enabled, check if reward belongs to child.
      if (filterByChild && reward.assignedTo !== filterByChild) {
        // Decrement rewards counter.
        rewardsCounter_--;
        // Skip reward.
        return false;
      }
      // Check if reward was approved.
      if (reward.approved) {
        // Add reward to approved rewards list.
        approvedRewards.push(reward);
      }
      // Check if reward was redeemed.
      else if (reward.redeemed) {
        // Add reward to redeemed rewards list.
        redeemedRewards.push(reward);
      }
      // Check if reward was purchased.
      else if (reward.purchased) {
        // Add reward to purchased rewards list.
        purchasedRewards.push(reward);
      }
      // Reward still open.
      else {
        // Add reward to open rewards list.
        openRewards.push(reward);
      }
      return true;
    });

    // Set rewards counter.
    setRewardsCounter(rewardsCounter_);

    // Set reward lists.
    if (accountType === "parent") {
      setRewardLists([
        redeemedRewards,
        openRewards,
        purchasedRewards,
        approvedRewards
      ]);
    } else {
      setRewardLists([redeemedRewards, purchasedRewards, approvedRewards]);
    }
  };

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
  // These variables need to be defined after the functions above.
  // Rewards config.
  const rewardsConfig = {
    parent: {
      noRewardsMessage: "You have not created any rewards yet.",
      noChildRewardsMessage: "This child does not have any rewards yet.",
      rewardStatuses: ["Waiting Approval", "Open", "Purchased", "Redeemed"],
      dateValue: [
        "redemptionDate",
        "approvalDate",
        "purchaseDate",
        "approvalDate"
      ],
      dateLabel: ["Redeemed", "", "Purchased", "Approved"],
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
      noChildRewardsMessage: "No rewards assigned to you yet.",
      rewardStatuses: ["Waiting Approval", "Purchased", "Redeemed"],
      dateValue: ["redemptionDate", "purchaseDate", "approvalDate"],
      dateLabel: ["Redeemed", "Purchased", "Approved"],
      rewardCta: [
        { onClick: cancelRewardRedemption, label: "Cancel" },
        { onClick: redeemReward, label: "Redeem" },
        null
      ],
      isEditable: [false, false, false]
    }
  };

  // Get current rewards config.
  const {
    noRewardsMessage,
    noChildRewardsMessage,
    rewardStatuses,
    dateValue,
    dateLabel,
    rewardCta,
    isEditable
  } = rewardsConfig[accountType];

  /***** REACT HOOKS *****/
  /**
   * Listen for changes to `allRewards` or `filterByChild`.
   */
  useEffect(() => {
    if (allRewards.length > 0) {
      organizeRewards();
    }
  }, [allRewards, filterByChild]);

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
            filterByChild={filterByChild}
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

      {/* Filter by child, parent only */}
      {accountType === "parent" && (
        <div className="flex w-full flex-row items-center justify-end border-b border-gray-200 px-4">
          <label className="flex w-fit flex-row items-center gap-1 whitespace-nowrap text-gray-600">
            <IconFilter />
            <select
              value={filterByChild ? filterByChild : ""}
              onChange={(event) => {
                setFilterByChild(
                  event.target.value !== "" ? event.target.value : null
                );
              }}
              className={twMerge(
                "text-base font-medium text-gray-600",
                "bg-transparent p-0 py-2"
              )}
            >
              <option value="">Filter by</option>
              {utils.getFamilyGroupOptions()}
            </select>
          </label>
        </div>
      )}

      {/* Page content */}
      {/* If data is finished loading, render rewards. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col gap-4 p-4">
          {rewardsCounter === 0 ? (
            <div className="flex flex-1 items-center justify-center py-4">
              {filterByChild ? noChildRewardsMessage : noRewardsMessage}
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
                                    {utils.formatDate(
                                      new Date(
                                        reward[dateValue[index]] * 1000
                                      ).toDateString(),
                                      dateLabel[index]
                                    )}
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

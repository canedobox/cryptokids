import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
// Pages
import Loading from "./Loading";
// Modals
import WaitingForTransaction from "./modals/WaitingForTransaction";

/**
 * Marketplace page.
 * @param {object} contract - Contract object.
 * @param {number} accountBalance - Account balance.
 * @param {array} allRewards - All rewards array.
 * @param {boolean} isDataLoading - Is data loading state.
 * @param {function} setErrorMessage - Function to set error message.
 * @param {object} utils - Utility functions object.
 */
function Marketplace({
  contract,
  accountBalance,
  allRewards,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // Rewards
  const [rewardsCounter, setRewardsCounter] = useState(0);
  const [openRewards, setOpenRewards] = useState([]);
  // State variables to control modal.
  const [
    isWaitingForTransactionModalOpened,
    setIsWaitingForTransactionModalOpened
  ] = useState(false);

  /***** METHODS *****/
  /**
   * Loop through all rewards and get open rewards.
   */
  const getOpenRewards = () => {
    // Check if rewards exist.
    if (!allRewards) {
      return false;
    }

    // Local rewards counter.
    let rewardsCounter_ = 0;
    // Reset open rewards list.
    setOpenRewards([]);
    // Reward lists.
    const openRewards_ = [];

    // Sort rewards by description in ascending order.
    const allRewardsSorted = [...allRewards];
    allRewardsSorted.sort((a, b) => {
      // Get reward description in uppercase.
      const rewardA = a.description.toUpperCase();
      const rewardB = b.description.toUpperCase();
      // Compare reward descriptions.
      // If rewardA comes before rewardB.
      if (rewardA < rewardB) {
        return -1;
      }
      // If rewardA comes after rewardB.
      else if (rewardA > rewardB) {
        return 1;
      }
      // Reward descriptions are equal.
      return 0;
    });

    // Loop through rewards.
    allRewardsSorted.map((reward) => {
      // Check if reward is opened.
      if (!reward.approved && !reward.redeemed && !reward.purchased) {
        // Increment rewards counter.
        rewardsCounter_++;
        // Add reward to open rewards list.
        openRewards_.push(reward);
      }
      return true;
    });

    // Set rewards counter.
    setRewardsCounter(rewardsCounter_);
    // Set open rewards list.
    setOpenRewards(openRewards_);
  };

  /**
   * Purchase a reward in the contract.
   * @param reward - Reward to be purchased (reward.rewardId).
   */
  const purchaseReward = (reward) => {
    // Reset error message.
    setErrorMessage(null);
    // Open the modal.
    utils.openModal(setIsWaitingForTransactionModalOpened);

    // Call the `purchaseReward` function on the contract.
    contract
      .purchaseReward(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          // Close the modal.
          utils.closeModal(setIsWaitingForTransactionModalOpened);
        });
      })
      .catch((error) => {
        // Set error message.
        setErrorMessage(error);
        // Close the modal.
        utils.closeModal(setIsWaitingForTransactionModalOpened);
      });
  };

  /***** VARIABLES *****/
  // Rewards config.
  const noRewardsMessage = "No rewards available in the marketplace.";
  const rewardStatuses = "Available Rewards";
  const rewardCta = { onClick: purchaseReward, label: "Buy" };

  /***** REACT HOOKS *****/
  /**
   * Listen for changes to `allRewards`.
   * If `allRewards` is not empty, get open rewards.
   * If `allRewards` is empty, reset states.
   */
  useEffect(() => {
    if (allRewards.length > 0) {
      getOpenRewards();
    } else {
      // Reset states.
      setRewardsCounter(0);
      setOpenRewards([]);
    }
  }, [allRewards]);

  // Return Marketplace component.
  return (
    <>
      {/* Waiting for transaction modal */}
      <WaitingForTransaction
        isModalOpened={isWaitingForTransactionModalOpened}
        setIsModalOpened={setIsWaitingForTransactionModalOpened}
        utils={utils}
      />

      {/* Page header */}
      <PageHeader
        title="Marketplace"
        accountBalance={accountBalance}
        utils={utils}
      />
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
            openRewards &&
            openRewards.length > 0 && (
              <div className="box-border flex flex-col">
                {/* Status */}
                <div className="flex flex-row items-center justify-start gap-4">
                  <span className="rounded-t-lg bg-gray-300 p-2 px-3 text-sm font-semibold uppercase">
                    {rewardStatuses}
                  </span>
                  <span className="text-xs font-medium uppercase text-gray-500">{`${
                    openRewards.length
                  } ${openRewards.length > 1 ? "Rewards" : "Reward"}`}</span>
                </div>
                {/* Rewards */}
                <div
                  className={twMerge(
                    "flex flex-col overflow-hidden rounded-xl rounded-tl-none border",
                    "border-gray-200 bg-white text-sm font-medium"
                  )}
                >
                  {openRewards.map((reward, rewardIndex) => {
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
                          <div className="flex flex-col items-start justify-center">
                            {/* Reward description */}
                            <div className="w-full break-words">
                              {reward.description}
                            </div>
                          </div>
                        </div>
                        {/* Column 2 */}
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
                          {rewardCta && (
                            <div>
                              {/* CTA button */}
                              <Button
                                variant="outlineSmall"
                                onClick={() => rewardCta.onClick(reward)}
                              >
                                {rewardCta.label}
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
          )}
        </div>
      )}
    </>
  );
}

export default Marketplace;

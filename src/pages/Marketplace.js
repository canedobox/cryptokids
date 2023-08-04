import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
// Pages
import Loading from "./Loading";

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

    // Loop through rewards.
    allRewards.map((reward) => {
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
    setErrorMessage(null);

    // Call the `purchaseReward` function on the contract.
    contract
      .purchaseReward(reward.rewardId.toString())
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /***** VARIABLES *****/
  // Rewards config.
  const noRewardsMessage = "No rewards available in the marketplace.";
  const rewardStatuses = "Available Rewards";
  const dateValue = "approvalDate";
  const rewardCta = { onClick: purchaseReward, label: "Buy" };

  /***** REACT HOOKS *****/
  /**
   * Listen for changes to `allRewards`.
   */
  useEffect(() => {
    if (allRewards.length > 0) {
      getOpenRewards();
    }
  }, [allRewards]);

  // Return Marketplace component.
  return (
    <>
      {/* Page header */}
      <PageHeader
        title="Rewards"
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
                            {/* Reward date */}
                            {reward[dateValue] > 0 && (
                              <div className="w-full break-words text-xs text-gray-600">
                                {new Date(
                                  reward[dateValue] * 1000
                                ).toDateString()}
                              </div>
                            )}
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

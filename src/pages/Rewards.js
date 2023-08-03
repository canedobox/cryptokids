import { useState } from "react";
// Components
import PageHeader from "../components/PageHeader";
// Pages
import Loading from "./Loading";
// Modals
import AddReward from "./modals/AddReward";

function Rewards({
  accountType,
  contract,
  rewardsCounter,
  rewardLists,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variable to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);

  // Return Rewards component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <AddReward
          contract={contract}
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          setErrorMessage={setErrorMessage}
          utils={utils}
        />
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
        <PageHeader title="Rewards" />
      )}
      {/* Page content */}
      {/* If data is finished loading, render rewards. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-4 p-4">
          {rewardsCounter && rewardsCounter === 0 ? (
            <div>No rewards.</div>
          ) : (
            rewardLists &&
            rewardLists.map((rewards, index) => {
              return (
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Rewards ID</th>
                      <th className="px-4 py-2">{`Rewards - ${rewards.length}`}</th>
                      <th className="px-4 py-2">Assigned to</th>
                      <th className="px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {rewards.length > 0 &&
                      rewards.map((reward, rewardIndex) => (
                        <tr key={rewardIndex}>
                          <td className="border px-4 py-2">
                            {reward.rewardId.toString()}
                          </td>
                          <td className="border px-4 py-2">
                            {reward.description}
                          </td>
                          <td className="border px-4 py-2">{`${reward.assignedTo.slice(
                            0,
                            4
                          )}...${reward.assignedTo.slice(38, 42)}`}</td>
                          <td className="border px-4 py-2">
                            {utils.addTokenSymbol(reward.price)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              );
            })
          )}
        </div>
      )}
    </>
  );
}

export default Rewards;

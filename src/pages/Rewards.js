// Components
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
// Pages
import AddReward from "./forms/AddReward";

function Rewards({
  accountType,
  contract,
  rewardsCounter,
  openRewards,
  purchasedRewards,
  redeemedRewards,
  approvedRewards,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  // Return Rewards component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <Modal
          title="Add Reward"
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
        >
          <AddReward
            contract={contract}
            setErrorMessage={setErrorMessage}
            utils={utils}
          />
        </Modal>
      )}
      {/* Page header */}
      {accountType === "parent" ? (
        <PageHeader
          title="Rewards"
          cta={{ label: "Add Reward", onClick: utils.openModal }}
        />
      ) : (
        <PageHeader title="Rewards" />
      )}
      {/* Page content */}
      <div className="flex w-full flex-col gap-4">
        <p className="w-full break-words">{rewardsCounter}</p>
        <p className="w-full break-words">{openRewards.toString()}</p>
        <p className="w-full break-words">{purchasedRewards.toString()}</p>
        <p className="w-full break-words">{redeemedRewards.toString()}</p>
        <p className="w-full break-words">{approvedRewards.toString()}</p>
      </div>
    </>
  );
}

export default Rewards;

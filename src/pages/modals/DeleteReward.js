// Components
import Modal from "../../components/Modal";

function DeleteReward({
  selectedReward,
  deselectReward,
  deleteReward,
  isModalOpened,
  setIsModalOpened,
  utils
}) {
  // Return DeleteReward component.
  return (
    <Modal
      title="Delete Reward"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedReward && (() => deselectReward())}
      cta={{
        cancel: {
          label: "Cancel",
          onClick: () => deselectReward()
        },
        confirm: {
          label: "Delete",
          onClick: () => deleteReward(selectedReward)
        }
      }}
      utils={utils}
    >
      {/* Delete reward confirmation message */}
      <h1 className="text-justify">
        Are you sure you want to delete{" "}
        <b>"{selectedReward && selectedReward.description}"</b>?
      </h1>
    </Modal>
  );
}

export default DeleteReward;

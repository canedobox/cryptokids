// Components
import Modal from "../../components/Modal";

/**
 * Delete reward modal.
 * @param {object} selectedReward - Selected reward object.
 * @param {function} deselectReward - Function to deselect reward.
 * @param {function} deleteReward - Function to delete reward.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isDeletePending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function DeleteReward({
  selectedReward,
  deselectReward,
  deleteReward,
  isModalOpened,
  setIsModalOpened,
  isDeletePending,
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
          onClick: () => deleteReward(selectedReward),
          inProgress: isDeletePending
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

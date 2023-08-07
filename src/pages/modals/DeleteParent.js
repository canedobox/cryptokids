// Components
import Modal from "../../components/Modal";

function DeleteParent({
  deleteParent,
  isModalOpened,
  setIsModalOpened,
  isDeletePending,
  utils
}) {
  // Return DeleteParent component.
  return (
    <Modal
      title="Delete Account"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      cta={{
        cancel: {
          label: "Cancel",
          onClick: () => utils.closeModal(setIsModalOpened)
        },
        confirm: {
          label: "Delete",
          onClick: () => deleteParent(),
          inProgress: isDeletePending
        }
      }}
      utils={utils}
    >
      {/* Delete parent confirmation message */}
      <h1 className="text-justify">
        Are you sure you want to delete your account?
      </h1>
    </Modal>
  );
}

export default DeleteParent;

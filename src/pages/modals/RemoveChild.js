// Components
import Modal from "../../components/Modal";

/**
 * Remove child modal.
 * @param {object} selectedChild - Selected child object.
 * @param {function} deselectChild - Function to deselect child.
 * @param {function} removeChild - Function to remove child.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isRemovePending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function RemoveChild({
  selectedChild,
  deselectChild,
  removeChild,
  isModalOpened,
  setIsModalOpened,
  isRemovePending,
  utils
}) {
  // Return RemoveChild component.
  return (
    <Modal
      title="Remove Child"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedChild && (() => deselectChild())}
      cta={{
        cancel: {
          label: "Cancel",
          onClick: () => deselectChild()
        },
        confirm: {
          label: "Remove",
          onClick: () => removeChild(selectedChild),
          inProgress: isRemovePending
        }
      }}
      utils={utils}
    >
      {/* Remove child confirmation message */}
      <h1 className="text-justify">
        Are you sure you want to remove{" "}
        <b>{selectedChild && selectedChild.name}</b> from your family group?
      </h1>
    </Modal>
  );
}

export default RemoveChild;

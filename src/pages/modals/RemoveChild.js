// Components
import Modal from "../../components/Modal";

function RemoveChild({
  contract,
  child,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  /**
   * Remove a child from the contract.
   * @param child - Child to be removed (child.childAddress).
   */
  const removeChild = (child) => {
    setErrorMessage(null);

    // Call the `removeChild` function on the contract.
    contract.removeChild(child.childAddress).catch((error) => {
      setErrorMessage(error);
    });
  };

  // Return RemoveChild component.
  return (
    <Modal
      title="Remove Child"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      cta={{
        confirm: { label: "Remove", onClick: () => removeChild(child) },
        cancel: {
          label: "Cancel",
          onClick: () => utils.closeModal(setIsModalOpened)
        }
      }}
      utils={utils}
    >
      {/* Remove child confirmation message */}
      <h1 className="text-justify">
        Are you sure you want to remove <b>{child && child.name}</b> from your
        family group?
      </h1>
    </Modal>
  );
}

export default RemoveChild;

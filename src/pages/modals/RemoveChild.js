// Components
import Modal from "../../components/Modal";

function RemoveChild({
  selectedChild,
  deselectChild,
  removeChild,
  isModalOpened,
  setIsModalOpened,
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
        confirm: { label: "Remove", onClick: () => removeChild(selectedChild) }
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

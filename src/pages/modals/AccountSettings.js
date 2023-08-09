// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconDelete } from "../../assets/icons/delete.svg";

/**
 * Account settings modal.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {function} deleteParentModal - Delete parent modal.
 * @param {object} utils - Utility functions object.
 */
function AccountSettings({
  isModalOpened,
  setIsModalOpened,
  deleteParentModal,
  utils
}) {
  // Return AccountSettings component.
  return (
    <Modal
      title="Account Settings"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      utils={utils}
    >
      {/* Delete account button */}
      <Button
        variant="outlineRed"
        className="w-full"
        onClick={() => {
          utils.closeModal(setIsModalOpened);
          utils.openModal(deleteParentModal);
        }}
      >
        <IconDelete />
        Delete Account
      </Button>
    </Modal>
  );
}

export default AccountSettings;

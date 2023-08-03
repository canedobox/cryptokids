// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconDelete } from "../../assets/icons/delete.svg";

function AccountSettings({
  isModalOpened,
  setIsModalOpened,
  confirmModal,
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
          utils.openModal(confirmModal);
        }}
      >
        <IconDelete />
        Delete Account
      </Button>
    </Modal>
  );
}

export default AccountSettings;

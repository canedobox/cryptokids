// Components
import Modal from "../../components/Modal";
// Icons
import { ReactComponent as IconProgress } from "../../assets/icons/progress.svg";

function WaitingForTransaction({ isModalOpened, setIsModalOpened, utils }) {
  // Return WaitingForTransaction component.
  return (
    <Modal
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      isPopup={true}
      utils={utils}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Icon */}
        <IconProgress
          className="animate-spin text-gray-600"
          width="24"
          height="24"
        />
        {/* Message */}
        <h1 className="text-justify text-lg font-medium text-gray-600">
          Waiting for the transaction to be confirmed...
        </h1>
      </div>
    </Modal>
  );
}

export default WaitingForTransaction;

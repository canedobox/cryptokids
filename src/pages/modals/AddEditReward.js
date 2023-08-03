import { useRef } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconSave } from "../../assets/icons/save.svg";

function AddEditReward({
  selectedReward,
  deselectReward,
  addReward,
  editReward,
  isModalOpened,
  setIsModalOpened,
  utils
}) {
  // Ref to the form.
  const formRef = useRef(null);
  // Return AddEditReward component.
  return (
    <Modal
      title={`${editReward ? "Edit" : "Add"} Reward`}
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedReward && (() => deselectReward(formRef))}
      closeWithBackdrop={false}
      utils={utils}
    >
      {/* Add|Edit reward form */}
      <form
        ref={formRef}
        onSubmit={
          editReward
            ? (event) => editReward(event, formRef)
            : (event) => addReward(event, formRef)
        }
        className="flex w-full flex-col gap-4"
      >
        {/* Child wallet address */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Assign to <span className="text-red-500">*</span>
          </span>
          <input
            id="childAddress"
            type="text"
            defaultValue={selectedReward ? selectedReward.assignedTo : ""}
            placeholder="Enter the child wallet address"
            minLength={42}
            maxLength={42}
            spellCheck={false}
            disabled={selectedReward && true}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {/* Reward description */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Description <span className="text-red-500">*</span>
          </span>
          <input
            id="rewardDescription"
            type="text"
            defaultValue={selectedReward && selectedReward.description}
            placeholder="Enter the reward description"
            minLength={3}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Reward price */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Price (1 to 100) <span className="text-red-500">*</span>
          </span>
          <input
            id="rewardPrice"
            type="number"
            defaultValue={
              selectedReward && utils.etherToNumber(selectedReward.price)
            }
            placeholder="Enter the reward price in CK"
            min={1}
            max={100}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full">
          {editReward ? <IconSave /> : <IconAdd />}
          {`${editReward ? "Save" : "Add"} Reward`}
        </Button>
      </form>
    </Modal>
  );
}

export default AddEditReward;

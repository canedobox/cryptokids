import { useEffect, useRef, useState } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconSave } from "../../assets/icons/save.svg";

/**
 * Add or edit reward modal.
 * @param {object} selectedReward - Selected reward object.
 * @param {function} deselectReward - Function to deselect reward.
 * @param {string} filterByChild - Filter by child address.
 * @param {function} addReward - Function to add reward.
 * @param {function} editReward - Function to edit reward.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isAddEditPending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function AddEditReward({
  selectedReward,
  deselectReward,
  filterByChild,
  addReward,
  editReward,
  isModalOpened,
  setIsModalOpened,
  isAddEditPending,
  utils
}) {
  /***** STATES *****/
  // State for selected child address.
  const [selectedChild, setSelectedChild] = useState(null);

  // Ref to the form.
  const formRef = useRef(null);

  /***** REACT HOOKS *****/
  /**
   * Listen for changes to `isModalOpened` and `filterByChild`.
   */
  useEffect(() => {
    setSelectedChild(
      selectedReward ? selectedReward.assignedTo : filterByChild
    );
  }, [isModalOpened, filterByChild]);

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
          <select
            id="childAddress"
            value={selectedChild ? selectedChild : ""}
            onChange={(event) => {
              setSelectedChild(
                event.target.value !== "" ? event.target.value : null
              );
            }}
            required
            disabled={selectedReward && true}
            className={
              "h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            <option value="">Select a child</option>
            {utils.getFamilyGroupOptions(true)}
          </select>
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
        <Button type="submit" className="w-full" inProgress={isAddEditPending}>
          {editReward ? <IconSave /> : <IconAdd />}
          {`${editReward ? "Save" : "Add"} Reward`}
        </Button>
      </form>
    </Modal>
  );
}

export default AddEditReward;

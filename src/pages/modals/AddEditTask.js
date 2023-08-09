import { useEffect, useRef, useState } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconSave } from "../../assets/icons/save.svg";

/**
 * Add or edit task modal.
 * @param {object} selectedTask - Selected task object.
 * @param {function} deselectTask - Function to deselect task.
 * @param {string} filterByChild - Filter by child address.
 * @param {function} addTask - Function to add task.
 * @param {function} editTask - Function to edit task.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isAddEditPending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function AddEditTask({
  selectedTask,
  deselectTask,
  filterByChild,
  addTask,
  editTask,
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
    setSelectedChild(selectedTask ? selectedTask.assignedTo : filterByChild);
  }, [isModalOpened, filterByChild]);

  // Return AddEditTask component.
  return (
    <Modal
      title={`${editTask ? "Edit" : "Add"} Task`}
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedTask && (() => deselectTask(formRef))}
      closeWithBackdrop={false}
      utils={utils}
    >
      {/* Add|Edit task form */}
      <form
        ref={formRef}
        onSubmit={
          editTask
            ? (event) => editTask(event, formRef)
            : (event) => addTask(event, formRef)
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
            disabled={selectedTask && true}
            className={
              "h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            <option value="">Select a child</option>
            {utils.getFamilyGroupOptions(true)}
          </select>
        </label>
        {/* Task description */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Description <span className="text-red-500">*</span>
          </span>
          <input
            id="taskDescription"
            type="text"
            defaultValue={selectedTask && selectedTask.description}
            placeholder="Enter the task description"
            minLength={3}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Task reward */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Reward (1 to 25) <span className="text-red-500">*</span>
          </span>
          <input
            id="taskReward"
            type="number"
            defaultValue={
              selectedTask && utils.etherToNumber(selectedTask.reward)
            }
            placeholder="Enter the task reward in CK"
            min={1}
            max={25}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Task due date */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">Due date (optional)</span>
          <input
            id="taskDueDate"
            type="date"
            defaultValue={
              selectedTask && selectedTask.dueDate > 0
                ? new Date(selectedTask.dueDate * 1000)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            placeholder="Enter the task due date"
            min={new Date().toISOString().split("T")[0]}
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full" inProgress={isAddEditPending}>
          {editTask ? <IconSave /> : <IconAdd />}
          {`${editTask ? "Save" : "Add"} Task`}
        </Button>
      </form>
    </Modal>
  );
}

export default AddEditTask;

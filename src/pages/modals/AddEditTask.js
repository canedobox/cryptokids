import { useRef } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function AddEditTask({
  selectedTask,
  deselectTask,
  addTask,
  editTask,
  isModalOpened,
  setIsModalOpened,
  utils
}) {
  // Ref to the form.
  const formRef = useRef(null);

  // Return AddEditTask component.
  return (
    <Modal
      title={`${editTask ? "Edit" : "Add"} Task`}
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedTask && (() => deselectTask(formRef))}
      utils={utils}
    >
      {/* Add|Edit task form */}
      <form
        ref={formRef}
        onSubmit={editTask ? editTask : addTask}
        className="flex w-full flex-col gap-4"
      >
        {/* Child wallet address */}
        {!selectedTask && (
          <label className="flex w-full flex-col items-start gap-1">
            <span className="font-medium text-gray-600">
              Assign to <span className="text-red-500">*</span>
            </span>
            <input
              id="childAddress"
              type="text"
              defaultValue={selectedTask ? selectedTask.assignedTo : ""}
              placeholder="Enter the child wallet address"
              minLength={42}
              maxLength={42}
              spellCheck={false}
              disabled={selectedTask && true}
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
            />
          </label>
        )}
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
            Reward (1 to 100) <span className="text-red-500">*</span>
          </span>
          <input
            id="taskReward"
            type="number"
            defaultValue={
              selectedTask && utils.etherToNumber(selectedTask.reward)
            }
            placeholder="Enter the task reward in CK"
            min={1}
            max={100}
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
        {/* Add|Edit task button */}
        <Button type="submit" className="w-full">
          {`${editTask ? "Edit" : "Add"} Task`}
        </Button>
      </form>
    </Modal>
  );
}

export default AddEditTask;

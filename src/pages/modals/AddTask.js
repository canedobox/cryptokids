// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function AddTask({
  contract,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  /**
   * Add a task to the contract.
   * @param event - Event that triggered the function.
   */
  const addTask = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Get the task reward.
    const taskReward = utils.numberToEther(event.target.taskReward.value);

    // Get the task due date.
    let taskDueDate = event.target.taskDueDate.value;
    // If the task due date is not set, set it to 0.
    if (!taskDueDate) {
      taskDueDate = 0;
    }
    // If the task due date is set, convert it to a Unix timestamp.
    else {
      // Get task due date as a Date object.
      taskDueDate = new Date(taskDueDate);
      // Check if the due date is greater than the current date.
      if (taskDueDate >= new Date()) {
        // Set the task due date to the end of the day.
        taskDueDate.setHours(23, 59, 59);
        // Convert the task due date to a Unix timestamp.
        taskDueDate = Math.round(taskDueDate.getTime() / 1000);
      } else {
        // Set the task due date to 0.
        taskDueDate = 0;
      }
    }

    // Call the `addTask` function on the contract.
    contract
      .addTask(
        event.target.childAddress.value,
        event.target.taskDescription.value,
        taskReward,
        taskDueDate
      )
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  // Return AddTask component.
  return (
    <Modal
      title="Add Task"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      utils={utils}
    >
      {/* Add task form */}
      <form onSubmit={addTask} className="flex w-full flex-col gap-4">
        {/* Child wallet address */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Assign to <span className="text-red-500">*</span>
          </span>
          <input
            id="childAddress"
            type="text"
            placeholder="Enter the child wallet address"
            minLength={42}
            maxLength={42}
            spellCheck={false}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Task description */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Description <span className="text-red-500">*</span>
          </span>
          <input
            id="taskDescription"
            type="text"
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
            placeholder="Enter the task due date"
            min={new Date().toISOString().split("T")[0]}
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Add task button */}
        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </Modal>
  );
}

export default AddTask;

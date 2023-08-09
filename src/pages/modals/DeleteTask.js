// Components
import Modal from "../../components/Modal";

/**
 * Delete task modal.
 * @param {object} selectedTask - Selected task object.
 * @param {function} deselectTask - Function to deselect task.
 * @param {function} deleteTask - Function to delete task.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isDeletePending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function DeleteTask({
  selectedTask,
  deselectTask,
  deleteTask,
  isModalOpened,
  setIsModalOpened,
  isDeletePending,
  utils
}) {
  // Return DeleteTask component.
  return (
    <Modal
      title="Delete Task"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedTask && (() => deselectTask())}
      cta={{
        cancel: {
          label: "Cancel",
          onClick: () => deselectTask()
        },
        confirm: {
          label: "Delete",
          onClick: () => deleteTask(selectedTask),
          inProgress: isDeletePending
        }
      }}
      utils={utils}
    >
      {/* Delete task confirmation message */}
      <h1 className="text-justify">
        Are you sure you want to delete{" "}
        <b>"{selectedTask && selectedTask.description}"</b>?
      </h1>
    </Modal>
  );
}

export default DeleteTask;

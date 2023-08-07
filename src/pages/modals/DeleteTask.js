// Components
import Modal from "../../components/Modal";

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

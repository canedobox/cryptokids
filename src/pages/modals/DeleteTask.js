// Components
import Modal from "../../components/Modal";

function DeleteTask({
  selectedTask,
  deselectTask,
  deleteTask,
  isModalOpened,
  setIsModalOpened,
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
        confirm: { label: "Delete", onClick: () => deleteTask(selectedTask) }
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

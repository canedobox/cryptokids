// Components
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
// Pages
import AddTask from "./forms/AddTask";

function Tasks({
  accountType,
  contract,
  tasksCounter,
  openTasks,
  completedTasks,
  approvedTasks,
  expiredTasks,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  // Return Tasks component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <Modal
          title="Add Task"
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
        >
          <AddTask
            contract={contract}
            setErrorMessage={setErrorMessage}
            utils={utils}
          />
        </Modal>
      )}
      {/* Page header */}
      {accountType === "parent" ? (
        <PageHeader
          title="Tasks"
          cta={{ label: "Add Task", onClick: utils.openModal }}
        />
      ) : (
        <PageHeader title="Tasks" />
      )}
      {/* Page content */}
      <div className="flex w-full flex-col gap-4">
        <p className="w-full break-words">{tasksCounter}</p>
        <p className="w-full break-words">{openTasks.toString()}</p>
        <p className="w-full break-words">{completedTasks.toString()}</p>
        <p className="w-full break-words">{approvedTasks.toString()}</p>
        <p className="w-full break-words">{expiredTasks.toString()}</p>
      </div>
    </>
  );
}

export default Tasks;

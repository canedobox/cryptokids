import { useState } from "react";
// Components
import PageHeader from "../components/PageHeader";
// Pages
import Loading from "./Loading";
// Modals
import AddTask from "./modals/AddTask";

function Tasks({
  accountType,
  contract,
  tokenSymbol,
  tasksCounter,
  taskLists,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variable to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);

  // Return Tasks component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <AddTask
          contract={contract}
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          setErrorMessage={setErrorMessage}
          utils={utils}
        />
      )}
      {/* Page header */}
      {accountType === "parent" ? (
        <PageHeader
          title="Tasks"
          cta={{
            label: "Add Task",
            onClick: () => {
              utils.openModal(setIsModalOpened);
            }
          }}
        />
      ) : (
        <PageHeader title="Tasks" />
      )}
      {/* Page content */}
      {/* If data is finished loading, render tasks. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-4 p-4">
          {tasksCounter && tasksCounter === 0 ? (
            <div>No tasks.</div>
          ) : (
            taskLists &&
            taskLists.map((tasks, index) => {
              return (
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Task ID</th>
                      <th className="px-4 py-2">{`Tasks - ${tasks.length}`}</th>
                      <th className="px-4 py-2">Assigned to</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {tasks.length > 0 &&
                      tasks.map((task, taskIndex) => (
                        <tr key={taskIndex}>
                          <td className="border px-4 py-2">
                            {task.taskId.toString()}
                          </td>
                          <td className="border px-4 py-2">
                            {task.description}
                          </td>
                          <td className="border px-4 py-2">{`${task.assignedTo.slice(
                            0,
                            4
                          )}...${task.assignedTo.slice(38, 42)}`}</td>
                          <td className="border px-4 py-2">
                            {task.dueDate > 0 &&
                              new Date(task.dueDate * 1000).toDateString()}
                          </td>
                          <td className="border px-4 py-2">
                            {`${utils.etherToNumber(
                              task.reward.toString()
                            )} ${tokenSymbol}`}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              );
            })
          )}
        </div>
      )}
    </>
  );
}

export default Tasks;

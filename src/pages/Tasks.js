import { useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
// Pages
import Loading from "./Loading";
// Modals
import AddEditTask from "./modals/AddEditTask";
import DeleteTask from "./modals/DeleteTask";
// Icons
import { ReactComponent as IconEdit } from "../assets/icons/edit.svg";
import { ReactComponent as IconDelete } from "../assets/icons/delete.svg";

function Tasks({
  accountType,
  contract,
  tasksCounter = 0,
  taskLists,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variable to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isModalOpened2, setIsModalOpened2] = useState(false);
  // Selected task.
  const [selectedTask, setSelectedTask] = useState(null);

  /***** METHODS *****/
  /**
   * Select a task.
   * @param task - Task to be selected.
   */
  const selectTask = (task, isDelete = false) => {
    // Set selected task.
    setSelectedTask(task);
    // Open modal.
    if (!isDelete) {
      utils.openModal(setIsModalOpened);
    } else {
      utils.openModal(setIsModalOpened2);
    }
  };

  /**
   * Deselect a task.
   */
  const deselectTask = (formRef) => {
    // Deselect task.
    setSelectedTask(null);
    // Close modal.
    if (formRef) {
      utils.closeModal(setIsModalOpened);
    } else {
      utils.closeModal(setIsModalOpened2);
    }
    // Check if form exists.
    if (formRef) {
      // Reset form.
      formRef.current.reset();
    }
  };

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

  /**
   * Edit a task to the contract.
   * @param event - Event that triggered the function.
   */
  const editTask = (event) => {
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

    // Call the `editTask` function on the contract.
    contract
      .editTask(
        selectedTask.taskId.toString(),
        event.target.taskDescription.value,
        taskReward,
        taskDueDate
      )
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Delete a task from the contract.
   * @param task - Task to be deleted (task.taskId).
   */
  const deleteTask = (task) => {
    setErrorMessage(null);

    // Call the `deleteTask` function on the contract.
    contract.deleteTask(task.taskId.toString()).catch((error) => {
      setErrorMessage(error);
    });
  };

  /**
   * Complete a task in the contract.
   * @param task - Task to be completed (task.taskId).
   */
  const completeTask = (task) => {
    setErrorMessage(null);

    // Call the `completeTask` function on the contract.
    contract.completeTask(task.taskId.toString()).catch((error) => {
      setErrorMessage(error);
    });
  };

  /**
   * Cancel task completion in the contract.
   * @param task - Task to be cancelled (task.taskId).
   */
  const cancelTaskCompletion = (task) => {
    setErrorMessage(null);

    // Call the `cancelTaskCompletion` function on the contract.
    contract.cancelTaskCompletion(task.taskId.toString()).catch((error) => {
      setErrorMessage(error);
    });
  };

  /**
   * Approve task completion in the contract.
   * @param task - Task to be approved (task.taskId).
   */
  const approveTaskCompletion = (task) => {
    setErrorMessage(null);

    // Call the `approveTaskCompletion` function on the contract.
    contract.approveTaskCompletion(task.taskId.toString()).catch((error) => {
      setErrorMessage(error);
    });
  };

  /***** VARIABLES *****/
  // Tasks config.
  const tasksConfig = {
    parent: {
      noTasksMessage: "You have not created any tasks yet.",
      taskStatuses: ["Waiting Approval", "Open", "Expired", "Completed"],
      dateValue: ["completionDate", "dueDate", "dueDate", "approvalDate"],
      taskCta: [
        { onClick: approveTaskCompletion, label: "Approve" },
        null,
        null,
        null
      ],
      isEditable: [false, true, true, false]
    },
    child: {
      noTasksMessage: "No tasks assigned to you yet.",
      taskStatuses: ["Waiting Approval", "Open", "Completed", "Expired"],
      dateValue: ["completionDate", "dueDate", "approvalDate", "dueDate"],
      taskCta: [
        { onClick: cancelTaskCompletion, label: "Cancel" },
        { onClick: completeTask, label: "Complete" },
        null,
        null
      ],
      isEditable: [false, false, false, false]
    }
  };

  // Get current tasks config.
  const { noTasksMessage, taskStatuses, dateValue, taskCta, isEditable } =
    tasksConfig[accountType];

  // Return Tasks component.
  return (
    <>
      {/* Modal, for parent only */}
      {accountType === "parent" && (
        <>
          {/* Add/Edit task modal */}
          <AddEditTask
            selectedTask={selectedTask}
            deselectTask={deselectTask}
            addTask={addTask}
            editTask={selectedTask && editTask}
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
            utils={utils}
          />
          {/* Delete task modal */}
          <DeleteTask
            selectedTask={selectedTask}
            deselectTask={deselectTask}
            deleteTask={deleteTask}
            isModalOpened={isModalOpened2}
            setIsModalOpened={setIsModalOpened2}
            utils={utils}
          />
        </>
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
        <div className="flex h-full w-full flex-col gap-4 p-4">
          {tasksCounter === 0 ? (
            <div className="flex flex-1 items-center justify-center py-4">
              {noTasksMessage}
            </div>
          ) : (
            taskLists &&
            taskLists.map((tasks, index) => {
              return (
                tasks.length > 0 && (
                  <div key={index} className="box-border flex flex-col">
                    {/* Status */}
                    <div className="flex flex-row items-center justify-start gap-4">
                      <span className="rounded-t-lg bg-gray-300 p-2 px-3 text-sm font-semibold uppercase">
                        {taskStatuses[index]}
                      </span>
                      <span className="text-xs font-medium uppercase text-gray-500">{`${
                        tasks.length
                      } ${tasks.length > 1 ? "Tasks" : "Task"}`}</span>
                    </div>
                    {/* Tasks */}
                    <div
                      className={twMerge(
                        "flex flex-col overflow-hidden rounded-xl rounded-tl-none border",
                        "border-gray-200 bg-white text-sm font-medium"
                      )}
                    >
                      {tasks.map((task, taskIndex) => {
                        return (
                          <div
                            key={taskIndex}
                            className={twMerge(
                              "flex flex-row justify-between gap-4 border-b p-4",
                              "group border-gray-200 last:border-none hover:bg-gray-50"
                            )}
                          >
                            <div className="flex flex-row gap-4">
                              {/* Column 1 */}
                              {/* Child avatar */}
                              {accountType === "parent" && (
                                <div className="flex min-w-fit items-center justify-center">
                                  <Avatar
                                    seed={utils.getAvatarSeed(task.assignedTo)}
                                    className="h-6 w-6"
                                  />
                                </div>
                              )}
                              {/* Column 2 */}
                              <div className="flex flex-col items-start justify-center">
                                {/* Task description */}
                                <div className="w-full break-words">
                                  {task.description}
                                </div>
                                {/* Task date */}
                                {task[dateValue[index]] > 0 && (
                                  <div className="w-full break-words text-xs text-gray-600">
                                    {new Date(
                                      task[dateValue[index]] * 1000
                                    ).toDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Column 3 */}
                            <div
                              className={twMerge(
                                "flex flex-col items-end justify-center gap-1",
                                "xs:flex-row xs:items-center xs:gap-4"
                              )}
                            >
                              {/* Task reward */}
                              <div className="whitespace-nowrap font-semibold">
                                {utils.addTokenSymbol(task.reward)}
                              </div>
                              {/* Task CTA */}
                              {taskCta[index] && (
                                <div>
                                  {/* CTA button */}
                                  <Button
                                    variant="outlineSmall"
                                    onClick={() => taskCta[index].onClick(task)}
                                  >
                                    {taskCta[index].label}
                                  </Button>
                                </div>
                              )}
                              {/* Edit and delete */}
                              {isEditable[index] && (
                                <div className="flex flex-row gap-2">
                                  {/* Edit button */}
                                  <Button
                                    variant="iconEdit"
                                    onClick={() => selectTask(task)}
                                  >
                                    <IconEdit />
                                  </Button>
                                  {/* Delete button */}
                                  <Button
                                    variant="iconDelete"
                                    onClick={() => selectTask(task, true)}
                                  >
                                    <IconDelete />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              );
            })
          )}
        </div>
      )}
    </>
  );
}

export default Tasks;

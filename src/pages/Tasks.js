function Tasks({
  tasksCounter,
  openTasks,
  completedTasks,
  approvedTasks,
  expiredTasks
}) {
  // Return Tasks component.
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="w-full break-words">{tasksCounter}</p>
      <p className="w-full break-words">{openTasks.toString()}</p>
      <p className="w-full break-words">{completedTasks.toString()}</p>
      <p className="w-full break-words">{approvedTasks.toString()}</p>
      <p className="w-full break-words">{expiredTasks.toString()}</p>
    </div>
  );
}

export default Tasks;

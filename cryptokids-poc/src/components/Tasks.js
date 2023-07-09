const Tasks = ({
  tokenSymbol,
  utils,
  tasksCounter,
  taskLists,
  tableTitle,
  dateLabel,
  dateValue,
  rowCta,
  noTasksMessage,
  isChild
}) => {
  return (
    <div className="flex flex-col gap-2">
      {tasksCounter === 0 ? (
        <div className="flex flex-col gap-2 pt-4">{noTasksMessage}</div>
      ) : (
        <table className="border-collapse w-full min-w-full max-w-full ">
          {taskLists &&
            taskLists.map((tasks, index) => {
              return (
                <tbody key={index}>
                  {tasks.length > 0 && (
                    <tr className="border-b-2 border-slate-200 bg-slate-300 whitespace-nowrap">
                      <th className="w-10/12 text-left p-2">
                        <h3 className="text-left text-lg font-bold p-2">
                          {tableTitle[index] + " - " + tasks.length}
                        </h3>
                      </th>
                      {!isChild && (
                        <th className="font-bold p-2">Assigned To</th>
                      )}
                      <th className="font-bold p-2">Reward</th>
                      <th className={dateLabel[index] ? "font-bold p-2" : ""}>
                        {dateLabel[index]}
                      </th>
                      <th></th>
                    </tr>
                  )}

                  {tasks.length > 0 &&
                    tasks.map((row, tasksIndex) => {
                      return (
                        <tr
                          key={tasksIndex}
                          className="border-b-2 border-slate-200 last-of-type:border-b-0 hover:bg-slate-200"
                        >
                          <th className="text-left font-normal p-2">
                            {row.description.toString()}
                          </th>
                          {!isChild && (
                            <th className="font-normal p-2 whitespace-nowrap">
                              {row.assignedTo.slice(0, 4) +
                                "..." +
                                row.assignedTo.slice(38, 42)}
                            </th>
                          )}
                          <th className="font-normal p-2 whitespace-nowrap">
                            {utils.etherToNumber(row.reward.toString()) +
                              " " +
                              tokenSymbol}
                          </th>
                          <th
                            className={
                              row[dateValue[index]] > 0
                                ? "font-normal p-2 whitespace-nowrap"
                                : ""
                            }
                          >
                            {row[dateValue[index]] > 0 &&
                              new Date(
                                row[dateValue[index]] * 1000
                              ).toDateString()}
                          </th>
                          <th className="text-right p-2 pr-0">
                            {rowCta[index] && (
                              <button
                                type="submit"
                                onClick={(event) =>
                                  rowCta[index].onClick(event, row)
                                }
                                className="bg-slate-600 text-white font-bold px-2 py-1 rounded-lg hover:bg-slate-500"
                              >
                                {rowCta[index].label}
                              </button>
                            )}
                          </th>
                        </tr>
                      );
                    })}
                </tbody>
              );
            })}
        </table>
      )}
    </div>
  );
};

export default Tasks;

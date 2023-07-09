const FamilyGroup = ({ tokenSymbol, utils, familyGroup, removeChild }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Display a message if there is no family group */}
      {familyGroup && familyGroup.length === 0 ? (
        <div className="flex flex-col gap-2 pt-4">
          No children in your family group.
        </div>
      ) : (
        <table className="border-collapse w-full min-w-full max-w-full">
          <tbody>
            {/* Family group header */}
            <tr className="border-b-2 border-slate-200 bg-slate-300 whitespace-nowrap">
              <th className="text-left p-2">Name</th>
              <th className="p-2">Address</th>
              <th className="p-2">Balance</th>
              <th className="w-1/12 p-2"></th>
            </tr>
            {/* Loop through the family group */}
            {familyGroup.map((row, index) => {
              return (
                <tr
                  key={index}
                  className="border-b-2 border-slate-200 last-of-type:border-b-0 hover:bg-slate-200 "
                >
                  {/* Child name */}
                  <th className="font-normal text-left p-2">
                    {row.child.name.toString()}
                  </th>
                  {/* Child address */}
                  <th className="font-normal p-2">
                    {row.child.childAddress.toString()}
                  </th>
                  {/* Child token balance */}
                  <th className="font-normal p-2">
                    {utils.etherToNumber(row.balance.toString()) +
                      " " +
                      tokenSymbol}
                  </th>
                  {/* Call to action */}
                  <th className="text-right p-2 pr-0">
                    <button
                      type="submit"
                      onClick={(event) => removeChild(event, row.child)}
                      className="bg-slate-600 text-white font-bold px-2 py-1 rounded-lg hover:bg-slate-500"
                    >
                      Remove
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FamilyGroup;

const FamilyGroup = ({ familyGroup, removeChild }) => {
  return (
    <div className="flex flex-col gap-2">
      {familyGroup && familyGroup.length > 0 ? (
        <table className="border-collapse w-full min-w-full max-w-full">
          <tbody>
            <tr className="border-b-2 border-slate-200 bg-slate-300 whitespace-nowrap">
              <th className="text-left p-2">Name</th>
              <th className="p-2">Address</th>
              <th className="w-1/12 p-2"></th>
            </tr>
            {familyGroup.map((row, index) => {
              return (
                <tr
                  key={index}
                  className="border-b-2 border-slate-200 last-of-type:border-b-0 hover:bg-slate-200 "
                >
                  <th className="font-normal text-left p-2">
                    {row.name.toString()}
                  </th>
                  <th className="font-normal p-2">
                    {row.childAddress.toString()}
                  </th>
                  <th className="text-right p-2 pr-0">
                    <button
                      type="submit"
                      onClick={(event) => removeChild(event, row)}
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
      ) : (
        <div className="flex flex-col gap-2 pt-4">
          No children in your family group.
        </div>
      )}
    </div>
  );
};

export default FamilyGroup;

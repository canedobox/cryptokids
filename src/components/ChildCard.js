import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
import Avatar from "./Avatar";

function ChildCard({
  contract,
  tokenSymbol,
  child,
  selectChild,
  setErrorMessage,
  utils,
  className
}) {
  // Return ChildCard component.
  return (
    <div
      className={twMerge(
        "flex-grow md:max-w-screen-sm",
        "box-border overflow-hidden rounded-xl border",
        "border-gray-200 bg-white",
        className
      )}
    >
      {/* Header */}
      <header className="box-border flex w-full flex-1 flex-row gap-4 border-b border-gray-200 p-4">
        <Avatar seed={`${child.child.childAddress}`} className="h-16 w-16" />
        <div className="flex flex-col overflow-hidden">
          <h1 className="w-full break-words font-semibold">
            {child.child.name}
          </h1>
          <p className="line-clamp-2 w-full break-words text-sm text-gray-600">
            {child.child.childAddress}
          </p>
          <p className="w-full break-words text-sm text-gray-600">
            <b>Balance: </b>
            {`${utils.etherToNumber(child.balance.toString())} ${tokenSymbol}`}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4 text-sm xs:flex-row">
        {/* Tasks table */}
        <table className="flex-grow">
          {/* Table header */}
          <thead className="uppercase">
            <tr className="bg-gray-200">
              <th colSpan="2" className="border border-gray-200 p-1 px-2">
                Tasks
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-gray-600">
            {/* Open */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Open
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {(
                  child.tasksCounter.assigned -
                  child.tasksCounter.expired -
                  child.tasksCounter.completed -
                  child.tasksCounter.approved
                ).toString()}
              </td>
            </tr>
            {/* Expired */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Expired
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.tasksCounter.expired.toString()}
              </td>
            </tr>
            {/* Completed */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Completed
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.tasksCounter.completed.toString()}
              </td>
            </tr>
            {/* Approved */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Approved
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.tasksCounter.approved.toString()}
              </td>
            </tr>
            {/* Total */}
            <tr className="bg-gray-100">
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Total
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center ">
                {child.tasksCounter.assigned.toString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Rewards */}
        <table className="flex-grow">
          {/* Table header */}
          <thead className="uppercase">
            <tr className="bg-gray-200">
              <th colSpan="2" className="border border-gray-200 p-1 px-2">
                Rewards
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-gray-600">
            {/* Open */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Open
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {(
                  child.rewardsCounter.assigned -
                  child.rewardsCounter.purchased -
                  child.rewardsCounter.redeemed -
                  child.rewardsCounter.approved
                ).toString()}
              </td>
            </tr>
            {/* Purchased */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Purchased
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.rewardsCounter.purchased.toString()}
              </td>
            </tr>
            {/* Redeemed */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Redeemed
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.rewardsCounter.redeemed.toString()}
              </td>
            </tr>
            {/* Approved */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Approved
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {child.rewardsCounter.approved.toString()}
              </td>
            </tr>
            {/* Total */}
            <tr className="bg-gray-100">
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Total
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center ">
                {child.rewardsCounter.assigned.toString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* CTA */}
      <Button
        className="w-full rounded-none"
        onClick={() => {
          selectChild(child.child);
        }}
      >
        Remove Child
      </Button>
    </div>
  );
}

export default ChildCard;

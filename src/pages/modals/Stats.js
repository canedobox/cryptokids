// Components
import Modal from "../../components/Modal";

/**
 * Stats modal.
 * @param {object} stats - Stats object.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {object} utils - Utility functions object.
 */
function Stats({ stats, isModalOpened, setIsModalOpened, utils }) {
  // Return SignUp component.
  return (
    <Modal
      title="CryptoKids Dapp Statistics"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      isPopup={true}
      utils={utils}
    >
      {/* Content */}
      <div className="flex flex-wrap gap-4 whitespace-nowrap text-sm xs:flex-row">
        {/* Account table */}
        <table className="flex-grow">
          {/* Table header */}
          <thead className="uppercase">
            <tr className="bg-gray-200">
              <th colSpan="2" className="border border-gray-200 p-1 px-2">
                Accounts
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-gray-600">
            {/* Parents registered */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Parents registered
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.accountsCounter.parentsRegistered.toString()}
              </td>
            </tr>
            {/* Parents deleted */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Parents deleted
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.accountsCounter.parentsDeleted.toString()}
              </td>
            </tr>
            {/* Children added */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Children added
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.accountsCounter.childrenAdded.toString()}
              </td>
            </tr>
            {/* Children removed */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Children removed
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.accountsCounter.childrenRemoved.toString()}
              </td>
            </tr>
            {/* Tokens earned */}
            <tr className="bg-gray-100">
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Active accounts
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center ">
                {(
                  stats.accountsCounter.parentsRegistered -
                  stats.accountsCounter.parentsDeleted +
                  (stats.accountsCounter.childrenAdded -
                    stats.accountsCounter.childrenRemoved)
                ).toString()}
              </td>
            </tr>
          </tbody>
        </table>

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
            {/* Created */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Created
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.tasksCounter.added.toString()}
              </td>
            </tr>
            {/* Deleted */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Deleted
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.tasksCounter.deleted.toString()}
              </td>
            </tr>
            {/* Completed */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Completed
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.tasksCounter.completed.toString()}
              </td>
            </tr>
            {/* Approved */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Approved
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.tasksCounter.approved.toString()}
              </td>
            </tr>
            {/* Tokens earned */}
            <tr className="bg-gray-100">
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Tokens earned
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center ">
                {utils.addTokenSymbol(stats.tasksCounter.tokensEarned)}
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
            {/* Created */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Created
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.rewardsCounter.added.toString()}
              </td>
            </tr>
            {/* Deleted */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Deleted
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.rewardsCounter.deleted.toString()}
              </td>
            </tr>
            {/* Purchased */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Purchased
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.rewardsCounter.purchased.toString()}
              </td>
            </tr>
            {/* Redeemed */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Redeemed
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.rewardsCounter.redeemed.toString()}
              </td>
            </tr>
            {/* Approved */}
            <tr>
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Approved
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center">
                {stats.rewardsCounter.approved.toString()}
              </td>
            </tr>
            {/* Tokens spent */}
            <tr className="bg-gray-100">
              <td className="border border-gray-200 p-1 px-2 font-semibold">
                Tokens spent
              </td>
              <td className="border border-gray-200 p-1 px-2 text-center ">
                {utils.addTokenSymbol(stats.rewardsCounter.tokensSpent)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default Stats;

import { Outlet } from "react-router-dom";
// Components
import Sidebar from "../components/Sidebar";
import ErrorMessage from "../components/ErrorMessage";

/**
 * Dashboard layout.
 * @param {object} contract - Contract object.
 * @param {string} account - Account address.
 * @param {string} accountType - Account type.
 * @param {string} accountName - Account name.
 * @param {string} accountBalance - Account balance.
 * @param {string} errorMessage - Error message object.
 * @param {function} setErrorMessage - Function to set error message.
 * @param {object} utils - Utility functions object.
 */
function DashboardLayout({
  contract,
  account,
  accountType,
  accountName,
  accountBalance,
  errorMessage,
  setErrorMessage,
  utils
}) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      {/* Sidebar */}
      <Sidebar
        contract={contract}
        account={account}
        accountType={accountType}
        accountName={accountName}
        accountBalance={accountBalance}
        setErrorMessage={setErrorMessage}
        utils={utils}
      />
      {/* Main */}
      <main className="box-border min-h-screen w-full pt-16 md:pl-72 md:pt-0">
        <section className="box-border flex h-full w-full flex-col items-start justify-start">
          <Outlet />
        </section>
      </main>
      {/* Error message */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}

export default DashboardLayout;

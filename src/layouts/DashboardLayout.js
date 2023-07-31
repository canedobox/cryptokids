import { Outlet } from "react-router-dom";
// Components
import Sidebar from "../components/Sidebar";
// Pages
import Loading from "../pages/Loading";

function DashboardLayout({
  account,
  accountType,
  logout,
  isLoading,
  errorMessage
}) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      {/* Sidebar */}
      <Sidebar accountType={accountType} logout={logout} />
      {/* Main */}
      <main className="mt-16 w-full p-4 md:ml-72 md:mt-0">
        {errorMessage && (
          <div className="break-words text-red-700">{errorMessage}</div>
        )}
        {/* Loading or child route element */}
        {isLoading ? <Loading /> : <Outlet />}
        <div>Account: {account}</div>
        <div>AccountType: {accountType}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
